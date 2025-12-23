import express from 'express';
import { body, validationResult } from 'express-validator';
import { PrismaClient } from '@prisma/client';
import Razorpay from 'razorpay';
import Stripe from 'stripe';
import { authenticate, AuthRequest } from '../middleware/auth';
import { createError } from '../middleware/errorHandler';

const router = express.Router();
const prisma = new PrismaClient();

// Initialize payment gateways (lazy initialization)
let razorpay: Razorpay | null = null;
let stripe: Stripe | null = null;

const getRazorpay = () => {
  if (!razorpay && process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
    razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    });
  }
  return razorpay;
};

const getStripe = () => {
  if (!stripe && process.env.STRIPE_SECRET_KEY) {
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2023-10-16'
    });
  }
  return stripe;
};

// Create payment intent
router.post('/create-intent', authenticate, [
  body('bookingId').isUUID(),
  body('paymentMethod').isIn(['razorpay', 'stripe'])
], async (req: AuthRequest, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { bookingId, paymentMethod } = req.body;
    
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { 
        invoice: true,
        customer: { include: { user: true } }
      }
    });

    if (!booking) {
      throw createError('Booking not found', 404);
    }

    // Verify booking belongs to user
    if (booking.customer.userId !== req.user!.id) {
      throw createError('Unauthorized access to booking', 403);
    }

    // Create invoice if not exists
    let invoice = booking.invoice;
    if (!invoice) {
      const tax = Math.round(booking.totalAmount * 0.18); // 18% GST
      const total = booking.totalAmount + tax;
      
      invoice = await prisma.invoice.create({
        data: {
          bookingId: booking.id,
          customerId: booking.customerId,
          invoiceNumber: `INV-${Date.now()}`,
          subtotal: booking.totalAmount,
          tax,
          total
        }
      });
    }

    let paymentIntent;
    
    if (paymentMethod === 'razorpay') {
      const razorpayClient = getRazorpay();
      if (!razorpayClient) {
        throw createError('Razorpay not configured', 500);
      }
      
      const order = await razorpayClient.orders.create({
        amount: Math.round(invoice.total * 100), // Amount in paise
        currency: 'INR',
        receipt: invoice.invoiceNumber,
        notes: {
          bookingId: booking.id,
          invoiceId: invoice.id
        }
      });
      
      paymentIntent = {
        orderId: order.id,
        amount: invoice.total,
        currency: 'INR',
        key: process.env.RAZORPAY_KEY_ID
      };
    } else if (paymentMethod === 'stripe') {
      const stripeClient = getStripe();
      if (!stripeClient) {
        throw createError('Stripe not configured', 500);
      }
      
      const intent = await stripeClient.paymentIntents.create({
        amount: Math.round(invoice.total * 100), // Amount in cents
        currency: 'inr',
        metadata: {
          bookingId: booking.id,
          invoiceId: invoice.id
        }
      });
      
      paymentIntent = {
        clientSecret: intent.client_secret,
        amount: invoice.total,
        currency: 'INR'
      };
    }

    res.json({
      paymentIntent,
      invoiceId: invoice.id,
      amount: invoice.total
    });
  } catch (error) {
    next(error);
  }
});

// Verify payment (Razorpay)
router.post('/verify-razorpay', authenticate, [
  body('razorpay_order_id').exists(),
  body('razorpay_payment_id').exists(),
  body('razorpay_signature').exists(),
  body('invoiceId').isUUID()
], async (req: AuthRequest, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, invoiceId } = req.body;
    
    // Verify signature
    const crypto = require('crypto');
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(razorpay_order_id + '|' + razorpay_payment_id)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      throw createError('Invalid payment signature', 400);
    }

    // Update invoice
    const invoice = await prisma.invoice.update({
      where: { id: invoiceId },
      data: {
        status: 'PAID',
        paymentMethod: 'razorpay',
        paidAt: new Date()
      },
      include: { booking: true }
    });

    // Update booking status
    await prisma.booking.update({
      where: { id: invoice.bookingId },
      data: { status: 'CONFIRMED' }
    });

    res.json({
      message: 'Payment verified successfully',
      invoice
    });
  } catch (error) {
    next(error);
  }
});

// Verify payment (Stripe)
router.post('/verify-stripe', authenticate, [
  body('payment_intent_id').exists(),
  body('invoiceId').isUUID()
], async (req: AuthRequest, res, next) => {
  try {
    const { payment_intent_id, invoiceId } = req.body;
    
    const stripeClient = getStripe();
    if (!stripeClient) {
      throw createError('Stripe not configured', 500);
    }
    
    const paymentIntent = await stripeClient.paymentIntents.retrieve(payment_intent_id);
    
    if (paymentIntent.status !== 'succeeded') {
      throw createError('Payment not completed', 400);
    }

    // Update invoice
    const invoice = await prisma.invoice.update({
      where: { id: invoiceId },
      data: {
        status: 'PAID',
        paymentMethod: 'stripe',
        paidAt: new Date()
      },
      include: { booking: true }
    });

    // Update booking status
    await prisma.booking.update({
      where: { id: invoice.bookingId },
      data: { status: 'CONFIRMED' }
    });

    res.json({
      message: 'Payment verified successfully',
      invoice
    });
  } catch (error) {
    next(error);
  }
});

// Get payment history
router.get('/history', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const userId = req.user!.id;
    
    const customer = await prisma.customer.findUnique({
      where: { userId }
    });

    if (!customer) {
      throw createError('Customer profile not found', 404);
    }

    const invoices = await prisma.invoice.findMany({
      where: { customerId: customer.id },
      include: {
        booking: {
          include: {
            staff: {
              include: { user: true }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ invoices });
  } catch (error) {
    next(error);
  }
});

export default router;