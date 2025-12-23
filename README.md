# Looks Trend'z Unisex Saloon - Management Platform

A production-ready, full-stack salon booking and management system built for premium salon operations.

## 🏗️ Architecture

```
looks-trendz-salon/
├── frontend/          # Next.js React application
├── backend/           # Node.js Express API
├── docs/             # Documentation & manuals
├── docker-compose.yml # Development environment
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Redis (for sessions)

### Development Setup

1. **Clone & Install**
```bash
git clone <repository>
cd looks-trendz-salon
npm run install:all
```

2. **Environment Setup**
```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
```

3. **Database Setup**
```bash
cd backend
npm run db:migrate
npm run db:seed
```

4. **Start Development**
```bash
npm run dev
```

## 🎯 Features

### Customer Portal
- ✅ Online appointment booking
- ✅ Real-time availability
- ✅ Service selection & pricing
- ✅ Payment integration
- ✅ Booking history & invoices

### Admin Dashboard
- ✅ Staff & service management
- ✅ Customer CRM
- ✅ Revenue analytics
- ✅ Inventory tracking
- ✅ Marketing tools

### Staff Panel
- ✅ Appointment management
- ✅ Commission tracking
- ✅ Availability settings

## 🔐 Security Features
- JWT authentication
- Role-based access control
- Rate limiting
- Input validation
- GDPR compliance

## 📱 Technology Stack

**Frontend:** Next.js 14, React 18, Tailwind CSS, TypeScript
**Backend:** Node.js, Express, TypeScript, Prisma ORM
**Database:** PostgreSQL, Redis
**Payments:** Razorpay/Stripe
**Deployment:** Docker, AWS/Vercel

## 📚 Documentation
- [Admin Manual](docs/admin-manual.md)
- [Staff Manual](docs/staff-manual.md)
- [API Documentation](docs/api-docs.md)
- [Deployment Guide](docs/deployment.md)