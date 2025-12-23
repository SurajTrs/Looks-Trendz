import express from 'express';
import { body, validationResult } from 'express-validator';
import { PrismaClient } from '@prisma/client';
import { authenticate, authorize } from '../middleware/auth';
import { createError } from '../middleware/errorHandler';

const router = express.Router();
const prisma = new PrismaClient();

// Get all services (public)
router.get('/', async (req, res, next) => {
  try {
    const { category, isActive = 'true' } = req.query;
    
    const where: any = {};
    if (category) where.category = category;
    if (isActive === 'true') where.isActive = true;

    const services = await prisma.service.findMany({
      where,
      orderBy: { name: 'asc' }
    });

    const groupedServices = services.reduce((acc, service) => {
      if (!acc[service.category]) {
        acc[service.category] = [];
      }
      acc[service.category].push(service);
      return acc;
    }, {} as Record<string, any[]>);

    res.json({ services: groupedServices });
  } catch (error) {
    next(error);
  }
});

// Get service by ID
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const service = await prisma.service.findUnique({
      where: { id }
    });

    if (!service) {
      throw createError('Service not found', 404);
    }

    res.json({ service });
  } catch (error) {
    next(error);
  }
});

// Create service (admin only)
router.post('/', authenticate, authorize(['ADMIN', 'MANAGER']), [
  body('name').trim().isLength({ min: 1 }),
  body('category').isIn(['HAIR', 'SKIN', 'GROOMING', 'BRIDAL', 'MASSAGE', 'NAILS', 'OTHER']),
  body('duration').isInt({ min: 15 }),
  body('price').isFloat({ min: 0 })
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description, category, duration, price } = req.body;

    const result = await prisma.$runCommandRaw({
      insert: 'services',
      documents: [{
        name,
        description: description || null,
        category,
        duration,
        price,
        isActive: true,
        createdAt: { $date: new Date().toISOString() },
        updatedAt: { $date: new Date().toISOString() }
      }]
    });

    res.status(201).json({
      message: 'Service created successfully',
      service: { name, description, category, duration, price }
    });
  } catch (error) {
    next(error);
  }
});

// Update service (admin only)
router.put('/:id', authenticate, authorize(['ADMIN', 'MANAGER']), [
  body('name').optional().trim().isLength({ min: 1 }),
  body('category').optional().isIn(['HAIR', 'SKIN', 'GROOMING', 'BRIDAL', 'MASSAGE', 'NAILS', 'OTHER']),
  body('duration').optional().isInt({ min: 15 }),
  body('price').optional().isFloat({ min: 0 })
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const updateData = req.body;

    const service = await prisma.service.update({
      where: { id },
      data: updateData
    });

    res.json({
      message: 'Service updated successfully',
      service
    });
  } catch (error) {
    next(error);
  }
});

// Delete service (admin only)
router.delete('/:id', authenticate, authorize(['ADMIN', 'MANAGER']), async (req, res, next) => {
  try {
    const { id } = req.params;

    // Soft delete by setting isActive to false
    await prisma.service.update({
      where: { id },
      data: { isActive: false }
    });

    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;