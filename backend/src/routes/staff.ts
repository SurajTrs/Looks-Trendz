import express from 'express';
import { body, validationResult } from 'express-validator';
import { PrismaClient } from '@prisma/client';
import { authenticate, authorize, AuthRequest } from '../middleware/auth';
import { createError } from '../middleware/errorHandler';

const router = express.Router();
const prisma = new PrismaClient();

// Get all staff (public for booking)
router.get('/', async (req, res, next) => {
  try {
    const staff = await prisma.staff.findMany({
      where: { isAvailable: true },
      include: {
        user: {
          select: { firstName: true, lastName: true, email: true }
        }
      }
    });

    res.json({ staff });
  } catch (error) {
    next(error);
  }
});

// Staff dashboard
router.get('/dashboard', authenticate, authorize(['STAFF']), async (req: AuthRequest, res, next) => {
  try {
    const userId = (req as any).user!.id;
    
    const staff = await prisma.staff.findUnique({
      where: { userId },
      include: { user: true }
    });

    if (!staff) {
      throw createError('Staff profile not found', 404);
    }

    const today = new Date();
    const startOfToday = new Date(today.setHours(0, 0, 0, 0));
    const endOfToday = new Date(today.setHours(23, 59, 59, 999));
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    // Today's bookings
    const todayBookings = await prisma.booking.findMany({
      where: {
        staffId: staff.id,
        bookingDate: { gte: startOfToday, lte: endOfToday },
        status: { not: 'CANCELLED' }
      },
      include: {
        customer: { include: { user: true } }
      },
      orderBy: { startTime: 'asc' }
    });

    // Monthly stats
    const [monthlyBookings, monthlyEarnings, completedBookings] = await Promise.all([
      prisma.booking.count({
        where: {
          staffId: staff.id,
          createdAt: { gte: startOfMonth },
          status: { not: 'CANCELLED' }
        }
      }),
      prisma.booking.aggregate({
        where: {
          staffId: staff.id,
          createdAt: { gte: startOfMonth },
          status: 'COMPLETED'
        },
        _sum: { totalAmount: true }
      }),
      prisma.booking.count({
        where: {
          staffId: staff.id,
          createdAt: { gte: startOfMonth },
          status: 'COMPLETED'
        }
      })
    ]);

    const commission = (monthlyEarnings._sum.totalAmount || 0) * (staff.commissionRate / 100);

    res.json({
      staff: {
        name: `${staff.user.firstName} ${staff.user.lastName}`,
        position: staff.position,
        commissionRate: staff.commissionRate
      },
      todayBookings,
      stats: {
        monthlyBookings,
        monthlyEarnings: monthlyEarnings._sum.totalAmount || 0,
        commission,
        completedBookings
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get staff bookings
router.get('/bookings', authenticate, authorize(['STAFF']), async (req: AuthRequest, res, next) => {
  try {
    const userId = (req as any).user!.id;
    const { date, status } = (req as any).query;
    
    const staff = await prisma.staff.findUnique({
      where: { userId }
    });

    if (!staff) {
      throw createError('Staff profile not found', 404);
    }

    const where: any = { staffId: staff.id };
    
    if (date) {
      const selectedDate = new Date(date as string);
      where.bookingDate = {
        gte: new Date(selectedDate.setHours(0, 0, 0, 0)),
        lte: new Date(selectedDate.setHours(23, 59, 59, 999))
      };
    }
    
    if (status) where.status = status;

    const bookings = await prisma.booking.findMany({
      where,
      include: {
        customer: { include: { user: true } }
      },
      orderBy: { startTime: 'asc' }
    });

    res.json({ bookings });
  } catch (error) {
    next(error);
  }
});

// Update availability
router.patch('/availability', authenticate, authorize(['STAFF']), [
  body('isAvailable').isBoolean()
], async (req: AuthRequest, res, next) => {
  try {
    const userId = (req as any).user!.id;
    const { isAvailable } = (req as any).body;

    const staff = await prisma.staff.update({
      where: { userId },
      data: { isAvailable },
      include: { user: true }
    });

    res.json({
      message: 'Availability updated successfully',
      staff
    });
  } catch (error) {
    next(error);
  }
});

export default router;