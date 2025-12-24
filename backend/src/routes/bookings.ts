import express from 'express';
import { body, validationResult } from 'express-validator';
import { PrismaClient } from '@prisma/client';
import { authenticate, authorize, AuthRequest } from '../middleware/auth';
import { createError } from '../middleware/errorHandler';
import { addMinutes, format, parseISO } from 'date-fns';
import { sendWhatsAppNotification } from '../services/whatsapp';
import { sendBookingConfirmation } from '../services/email';
import { sendBookingSMS } from '../services/sms';
import { ObjectId } from 'mongodb';

const router = express.Router();
const prisma = new PrismaClient();

// Get available slots
router.get('/availability', async (req, res, next) => {
  try {
    const { date, serviceIds, staffId } = req.query;
    
    if (!date || !serviceIds) {
      throw createError('Date and service IDs are required', 400);
    }

    const services = await prisma.service.findMany({
      where: {
        id: { in: (serviceIds as string).split(',') }
      }
    });

    const totalDuration = services.reduce((sum, service) => sum + service.duration, 0);
    
    let staffQuery: any = { isAvailable: true };
    if (staffId) {
      staffQuery.id = staffId as string;
    }

    const availableStaff = await prisma.staff.findMany({
      where: {
        ...staffQuery,
        serviceIds: {
          hasSome: services.map(s => s.id)
        }
      },
      include: {
        user: true,
        bookings: {
          where: {
            bookingDate: {
              gte: new Date(date as string),
              lt: new Date(new Date(date as string).getTime() + 24 * 60 * 60 * 1000)
            },
            status: { not: 'CANCELLED' }
          }
        }
      }
    });

    const slots: any[] = [];
    const workingHours = { start: '10:00', end: '22:00' };

    for (const staff of availableStaff) {
      const staffSlots = generateTimeSlots(
        date as string,
        workingHours,
        totalDuration,
        staff.bookings
      );
      
      slots.push({
        staffId: staff.id,
        staffName: `${staff.user.firstName} ${staff.user.lastName}`,
        availableSlots: staffSlots
      });
    }

    res.json({ slots });
  } catch (error) {
    next(error);
  }
});

// Create booking
router.post('/', authenticate, [
  body('staffId').notEmpty().withMessage('Staff ID is required'),
  body('serviceIds').isArray({ min: 1 }).withMessage('At least one service is required'),
  body('bookingDate').notEmpty().withMessage('Booking date is required'),
  body('startTime').notEmpty().withMessage('Start time is required')
], async (req: AuthRequest, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array() 
      });
    }

    const { staffId, serviceIds, bookingDate, startTime, notes, paymentMethod } = (req as any).body;
    const userId = (req as any).user!.id;

    console.log('Creating booking for user:', userId);
    console.log('Booking data:', { staffId, serviceIds, bookingDate, startTime });

    // Get customer
    const customer = await prisma.customer.findUnique({
      where: { userId }
    });

    if (!customer) {
      console.log('Customer not found for userId:', userId);
      return res.status(404).json({ message: 'Customer profile not found. Please complete your profile.' });
    }

    console.log('Customer found:', customer.id);

    // Get services and calculate total
    const services = await prisma.service.findMany({
      where: { id: { in: serviceIds } }
    });

    console.log('Services found:', services.length);

    if (services.length === 0) {
      return res.status(404).json({ message: 'No valid services found' });
    }

    const totalDuration = services.reduce((sum, service) => sum + service.duration, 0);
    const totalAmount = services.reduce((sum, service) => sum + service.price, 0);
    
    // Parse dates properly
    const bookingDateObj = new Date(bookingDate);
    const startTimeObj = new Date(startTime);
    const endTime = addMinutes(startTimeObj, totalDuration);

    console.log('Dates:', { bookingDateObj, startTimeObj, endTime });

    // Check availability
    const conflictingBooking = await prisma.booking.findFirst({
      where: {
        staffId,
        status: { not: 'CANCELLED' },
        OR: [
          {
            AND: [
              { startTime: { lte: startTimeObj } },
              { endTime: { gt: startTimeObj } }
            ]
          },
          {
            AND: [
              { startTime: { lt: endTime } },
              { endTime: { gte: endTime } }
            ]
          }
        ]
      }
    });

    if (conflictingBooking) {
      return res.status(409).json({ message: 'Time slot not available. Please choose another time.' });
    }

    // Create booking using raw MongoDB
    const bookingId = new ObjectId().toString();
    await prisma.$runCommandRaw({
      insert: 'bookings',
      documents: [{
        _id: { $oid: bookingId },
        customerId: { $oid: customer.id },
        staffId: { $oid: staffId },
        bookingDate: { $date: bookingDateObj.toISOString() },
        startTime: { $date: startTimeObj.toISOString() },
        endTime: { $date: endTime.toISOString() },
        status: 'CONFIRMED',
        totalAmount,
        notes: notes || '',
        serviceIds: services.map(s => ({ $oid: s.id })),
        serviceNames: services.map(s => s.name),
        servicePrices: services.map(s => s.price),
        createdAt: { $date: new Date().toISOString() },
        updatedAt: { $date: new Date().toISOString() }
      }]
    });

    // Fetch created booking
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        staff: { include: { user: true } },
        customer: { include: { user: true } }
      }
    });

    if (!booking) {
      return res.status(500).json({ message: 'Booking created but could not be retrieved' });
    }

    console.log('Booking created successfully:', booking.id);

    // Send notifications
    Promise.all([
      sendWhatsAppNotification(booking),
      sendBookingConfirmation(booking),
      sendBookingSMS(booking)
    ]).catch(err => console.error('Notification error:', err));

    res.status(201).json({
      message: 'Booking created successfully',
      booking
    });
  } catch (error: any) {
    console.error('Booking creation error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      message: 'Internal server error', 
      error: error.message 
    });
  }
});

// Get user bookings
router.get('/my-bookings', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const userId = (req as any).user!.id;
    
    const customer = await prisma.customer.findUnique({
      where: { userId }
    });

    if (!customer) {
      throw createError('Customer profile not found', 404);
    }

    const bookings = await prisma.booking.findMany({
      where: { customerId: customer.id },
      include: {
        staff: {
          include: { user: true }
        },
        invoice: true
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ bookings });
  } catch (error) {
    next(error);
  }
});

// Update booking status (staff/admin only)
router.patch('/:id/status', authenticate, authorize(['ADMIN', 'MANAGER', 'STAFF']), [
  body('status').isIn(['CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'NO_SHOW'])
], async (req: AuthRequest, res, next) => {
  try {
    const { id } = (req as any).params;
    const { status } = (req as any).body;

    const booking = await prisma.booking.update({
      where: { id },
      data: { status },
      include: {
        staff: {
          include: { user: true }
        },
        customer: {
          include: { user: true }
        }
      }
    });

    res.json({
      message: 'Booking status updated',
      booking
    });
  } catch (error) {
    next(error);
  }
});

// Helper function to generate time slots
function generateTimeSlots(
  date: string,
  workingHours: { start: string; end: string },
  serviceDuration: number,
  existingBookings: any[]
) {
  const slots: any[] = [];
  const startHour = parseInt(workingHours.start.split(':')[0]);
  const endHour = parseInt(workingHours.end.split(':')[0]);
  
  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const slotStart = new Date(`${date}T${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:00`);
      const slotEnd = addMinutes(slotStart, serviceDuration);
      
      const hasConflict = existingBookings.some(booking => {
        const bookingStart = new Date(booking.startTime);
        const bookingEnd = new Date(booking.endTime);
        return (slotStart < bookingEnd && slotEnd > bookingStart);
      });
      
      if (!hasConflict && (slotEnd.getHours() < endHour || (slotEnd.getHours() === endHour && slotEnd.getMinutes() === 0))) {
        slots.push({
          startTime: slotStart.toISOString(),
          endTime: slotEnd.toISOString(),
          available: true
        });
      }
    }
  }
  
  return slots;
}

export default router;