import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, authorize } from '../middleware/auth';
import { startOfDay, endOfDay, subDays, format } from 'date-fns';

const router = express.Router();
const prisma = new PrismaClient();

// Dashboard analytics
router.get('/dashboard', authenticate, authorize(['ADMIN', 'MANAGER']), async (req, res, next) => {
  try {
    const today = new Date();
    const startOfToday = startOfDay(today);
    const endOfToday = endOfDay(today);
    const last7Days = subDays(today, 7);
    const last30Days = subDays(today, 30);

    // Today's stats
    const [
      todayBookings,
      todayRevenue,
      totalCustomers,
      activeStaff,
      pendingBookings,
      completedBookings
    ] = await Promise.all([
      prisma.booking.count({
        where: {
          bookingDate: { gte: startOfToday, lte: endOfToday },
          status: { not: 'CANCELLED' }
        }
      }),
      prisma.invoice.aggregate({
        where: {
          createdAt: { gte: startOfToday, lte: endOfToday },
          status: 'PAID'
        },
        _sum: { total: true }
      }),
      prisma.customer.count(),
      prisma.staff.count({ where: { isAvailable: true } }),
      prisma.booking.count({
        where: { status: 'CONFIRMED' }
      }),
      prisma.booking.count({
        where: {
          createdAt: { gte: startOfToday, lte: endOfToday },
          status: 'COMPLETED'
        }
      })
    ]);

    // Revenue trend (last 7 days)
    const revenueTrend = await prisma.invoice.groupBy({
      by: ['createdAt'],
      where: {
        createdAt: { gte: last7Days },
        status: 'PAID'
      },
      _sum: { total: true }
    });

    // Popular services - using embedded serviceIds from bookings
    const allBookings = await prisma.booking.findMany({
      where: {
        createdAt: { gte: last30Days },
        status: 'COMPLETED'
      },
      select: { serviceIds: true, serviceNames: true }
    });

    const serviceCounts: Record<string, { name: string; count: number }> = {};
    allBookings.forEach(booking => {
      booking.serviceIds.forEach((serviceId, index) => {
        if (!serviceCounts[serviceId]) {
          serviceCounts[serviceId] = { name: booking.serviceNames[index], count: 0 };
        }
        serviceCounts[serviceId].count++;
      });
    });

    const servicesWithNames = Object.values(serviceCounts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
      .map(s => ({ name: s.name, bookings: s.count }));

    // Staff performance
    const staffPerformance = await prisma.booking.groupBy({
      by: ['staffId'],
      where: {
        createdAt: { gte: last30Days },
        status: 'COMPLETED'
      },
      _count: { id: true },
      _sum: { totalAmount: true }
    });

    const staffWithDetails = await Promise.all(
      staffPerformance.map(async (item) => {
        const staff = await prisma.staff.findUnique({
          where: { id: item.staffId },
          include: { user: true }
        });
        return {
          name: `${staff?.user.firstName} ${staff?.user.lastName}`,
          bookings: item._count.id,
          revenue: item._sum.totalAmount
        };
      })
    );

    res.json({
      todayBookings,
      totalBookings: await prisma.booking.count(),
      totalRevenue: (await prisma.invoice.aggregate({
        where: { status: 'PAID' },
        _sum: { total: true }
      }))._sum.total || 0,
      todayStats: {
        bookings: todayBookings,
        revenue: todayRevenue._sum.total || 0,
        customers: totalCustomers,
        staff: activeStaff,
        pending: pendingBookings,
        completed: completedBookings
      },
      revenueTrend: revenueTrend.map(item => ({
        date: format(item.createdAt, 'yyyy-MM-dd'),
        revenue: item._sum.total
      })),
      popularServices: servicesWithNames,
      staffPerformance: staffWithDetails
    });
  } catch (error) {
    next(error);
  }
});

// Get all bookings with filters
router.get('/bookings', authenticate, authorize(['ADMIN', 'MANAGER']), async (req, res, next) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      status, 
      staffId, 
      date,
      search 
    } = req.query;

    const skip = (Number(page) - 1) * Number(limit);
    const where: any = {};

    if (status) where.status = status;
    if (staffId) where.staffId = staffId;
    if (date) {
      const selectedDate = new Date(date as string);
      where.bookingDate = {
        gte: startOfDay(selectedDate),
        lte: endOfDay(selectedDate)
      };
    }

    if (search) {
      where.OR = [
        {
          customer: {
            user: {
              OR: [
                { firstName: { contains: search, mode: 'insensitive' } },
                { lastName: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } }
              ]
            }
          }
        }
      ];
    }

    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({
        where,
        include: {
          customer: {
            include: { user: true }
          },
          staff: {
            include: { user: true }
          },
          invoice: true
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: Number(limit)
      }),
      prisma.booking.count({ where })
    ]);

    res.json({
      bookings,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get all customers
router.get('/customers', authenticate, authorize(['ADMIN', 'MANAGER']), async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where: any = {};
    if (search) {
      where.user = {
        OR: [
          { firstName: { contains: search, mode: 'insensitive' } },
          { lastName: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } }
        ]
      };
    }

    const [customers, total] = await Promise.all([
      prisma.customer.findMany({
        where,
        include: {
          user: true,
          bookings: {
            orderBy: { createdAt: 'desc' },
            take: 5
          },
          _count: {
            select: { bookings: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: Number(limit)
      }),
      prisma.customer.count({ where })
    ]);

    res.json({
      customers,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    next(error);
  }
});

// Revenue reports
router.get('/reports/revenue', authenticate, authorize(['ADMIN', 'MANAGER']), async (req, res, next) => {
  try {
    const { startDate, endDate, groupBy = 'day' } = req.query;
    
    const start = startDate ? new Date(startDate as string) : subDays(new Date(), 30);
    const end = endDate ? new Date(endDate as string) : new Date();

    const revenue = await prisma.invoice.findMany({
      where: {
        createdAt: { gte: start, lte: end },
        status: 'PAID'
      },
      select: {
        total: true,
        createdAt: true,
        bookingId: true
      }
    });

    // Get bookings for service details
    const bookingIds = revenue.map(inv => inv.bookingId);
    const bookings = await prisma.booking.findMany({
      where: { id: { in: bookingIds } },
      select: { id: true, serviceIds: true, serviceNames: true, servicePrices: true }
    });

    const bookingMap = new Map(bookings.map(b => [b.id, b]));

    // Group revenue by date
    const groupedRevenue = revenue.reduce((acc, invoice) => {
      const dateKey = format(invoice.createdAt, 'yyyy-MM-dd');
      if (!acc[dateKey]) {
        acc[dateKey] = { date: dateKey, revenue: 0, bookings: 0 };
      }
      acc[dateKey].revenue += invoice.total;
      acc[dateKey].bookings += 1;
      return acc;
    }, {} as Record<string, any>);

    // Service-wise revenue
    const serviceRevenue = revenue.reduce((acc, invoice) => {
      const booking = bookingMap.get(invoice.bookingId) as any;
      if (booking && booking.serviceNames && booking.servicePrices) {
        booking.serviceNames.forEach((serviceName: string, index: number) => {
          if (!acc[serviceName]) {
            acc[serviceName] = { service: serviceName, revenue: 0, bookings: 0 };
          }
          acc[serviceName].revenue += booking.servicePrices[index];
          acc[serviceName].bookings += 1;
        });
      }
      return acc;
    }, {} as Record<string, any>);

    res.json({
      dailyRevenue: Object.values(groupedRevenue),
      serviceRevenue: Object.values(serviceRevenue),
      totalRevenue: revenue.reduce((sum, inv) => sum + inv.total, 0),
      totalBookings: revenue.length
    });
  } catch (error) {
    next(error);
  }
});

export default router;