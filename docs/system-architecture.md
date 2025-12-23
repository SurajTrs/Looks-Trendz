# System Architecture Documentation
## Looks Trend'z Unisex Saloon Management Platform

---

## 1. System Overview

### 1.1 Purpose
A comprehensive salon management system designed to handle all aspects of salon operations including:
- Online appointment booking
- Staff and service management
- Customer relationship management (CRM)
- Payment processing and invoicing
- Business analytics and reporting
- Marketing automation

### 1.2 Technology Stack

**Frontend:**
- Framework: Next.js 14 (React 18)
- Styling: Tailwind CSS
- State Management: Zustand
- Data Fetching: React Query
- Forms: React Hook Form + Zod
- Animations: Framer Motion
- Language: TypeScript

**Backend:**
- Runtime: Node.js 18+
- Framework: Express.js
- Language: TypeScript
- ORM: Prisma
- Authentication: JWT
- Validation: Express Validator

**Database:**
- Primary: PostgreSQL 14+
- Cache: Redis 6+

**Infrastructure:**
- Containerization: Docker
- Process Manager: PM2
- Reverse Proxy: Nginx
- SSL: Let's Encrypt

**Third-Party Services:**
- Payments: Razorpay / Stripe
- SMS: Twilio
- Email: Nodemailer (SMTP)
- File Storage: Local / AWS S3

---

## 2. Architecture Patterns

### 2.1 Overall Architecture
```
┌─────────────────────────────────────────────────────────┐
│                     Client Layer                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   Web App    │  │  Mobile Web  │  │  Admin Panel │  │
│  │  (Next.js)   │  │  (Responsive)│  │   (React)    │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                   API Gateway Layer                      │
│                    (Nginx / Express)                     │
│              Rate Limiting, CORS, Security               │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                  Application Layer                       │
│  ┌──────────────────────────────────────────────────┐  │
│  │              Express.js Backend                   │  │
│  │  ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐ │  │
│  │  │  Auth  │  │Booking │  │Payment │  │ Admin  │ │  │
│  │  │Service │  │Service │  │Service │  │Service │ │  │
│  │  └────────┘  └────────┘  └────────┘  └────────┘ │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                    Data Layer                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  PostgreSQL  │  │    Redis     │  │  File Store  │  │
│  │  (Primary)   │  │   (Cache)    │  │   (S3/Local) │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### 2.2 Design Patterns Used

**Backend Patterns:**
- MVC (Model-View-Controller)
- Repository Pattern (via Prisma)
- Middleware Pattern
- Factory Pattern (for service creation)
- Singleton Pattern (database connections)

**Frontend Patterns:**
- Component-Based Architecture
- Container/Presentational Components
- Custom Hooks Pattern
- State Management (Zustand stores)
- Server-Side Rendering (Next.js)

---

## 3. Database Schema

### 3.1 Core Entities

**Users Table:**
```sql
- id (UUID, PK)
- email (String, Unique)
- phone (String, Unique)
- password (String, Hashed)
- firstName (String)
- lastName (String)
- role (Enum: ADMIN, MANAGER, STAFF, CUSTOMER)
- isActive (Boolean)
- createdAt (DateTime)
- updatedAt (DateTime)
```

**Customers Table:**
```sql
- id (UUID, PK)
- userId (UUID, FK → Users)
- dateOfBirth (DateTime)
- gender (Enum)
- address (String)
- city (String)
- loyaltyPoints (Integer)
- preferences (JSON)
- notes (Text)
```

**Staff Table:**
```sql
- id (UUID, PK)
- userId (UUID, FK → Users)
- employeeId (String, Unique)
- position (String)
- commissionRate (Float)
- workingHours (JSON)
- isAvailable (Boolean)
```

**Services Table:**
```sql
- id (UUID, PK)
- name (String)
- description (Text)
- category (Enum: HAIR, SKIN, GROOMING, BRIDAL, etc.)
- duration (Integer, minutes)
- price (Float)
- isActive (Boolean)
```

**Bookings Table:**
```sql
- id (UUID, PK)
- customerId (UUID, FK → Customers)
- staffId (UUID, FK → Staff)
- bookingDate (DateTime)
- startTime (DateTime)
- endTime (DateTime)
- status (Enum: CONFIRMED, IN_PROGRESS, COMPLETED, CANCELLED, NO_SHOW)
- totalAmount (Float)
- notes (Text)
```

**Invoices Table:**
```sql
- id (UUID, PK)
- bookingId (UUID, FK → Bookings)
- customerId (UUID, FK → Customers)
- invoiceNumber (String, Unique)
- subtotal (Float)
- tax (Float)
- discount (Float)
- total (Float)
- status (Enum: PENDING, PAID, CANCELLED, REFUNDED)
- paymentMethod (String)
- paidAt (DateTime)
```

### 3.2 Relationships

```
Users (1) ──→ (1) Customer
Users (1) ──→ (1) Staff
Customer (1) ──→ (N) Bookings
Staff (1) ──→ (N) Bookings
Staff (N) ←──→ (N) Services (via StaffService)
Booking (1) ──→ (N) BookingItems
Booking (1) ──→ (1) Invoice
Service (1) ──→ (N) BookingItems
```

---

## 4. API Architecture

### 4.1 RESTful API Design

**Endpoint Structure:**
```
/api/auth/*          - Authentication endpoints
/api/users/*         - User management
/api/services/*      - Service catalog
/api/bookings/*      - Booking operations
/api/staff/*         - Staff management
/api/admin/*         - Admin operations
/api/payments/*      - Payment processing
```

### 4.2 Authentication Flow

```
1. User Login
   ↓
2. Validate Credentials (bcrypt)
   ↓
3. Generate JWT Token (7 days expiry)
   ↓
4. Return Token + User Data
   ↓
5. Client Stores Token (localStorage/cookie)
   ↓
6. Subsequent Requests Include Token
   ↓
7. Server Validates Token (Middleware)
   ↓
8. Grant/Deny Access Based on Role
```

### 4.3 Authorization Levels

**Role Hierarchy:**
```
ADMIN (Full Access)
  ├── MANAGER (Most Operations)
  │     ├── STAFF (Limited Operations)
  │     └── CUSTOMER (Own Data Only)
```

**Permission Matrix:**
| Feature | Customer | Staff | Manager | Admin |
|---------|----------|-------|---------|-------|
| Book Appointment | ✅ | ✅ | ✅ | ✅ |
| View Own Bookings | ✅ | ✅ | ✅ | ✅ |
| Update Booking Status | ❌ | ✅ | ✅ | ✅ |
| Manage Services | ❌ | ❌ | ✅ | ✅ |
| Manage Staff | ❌ | ❌ | ✅ | ✅ |
| View Reports | ❌ | ❌ | ✅ | ✅ |
| System Settings | ❌ | ❌ | ❌ | ✅ |

---

## 5. Frontend Architecture

### 5.1 Directory Structure

```
frontend/
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── (auth)/            # Auth routes group
│   │   ├── (dashboard)/       # Dashboard routes
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Home page
│   ├── components/            # Reusable components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── BookingForm.tsx
│   │   └── ...
│   ├── lib/                   # Utilities
│   │   ├── api.ts            # API client
│   │   ├── utils.ts          # Helper functions
│   │   └── constants.ts      # Constants
│   ├── hooks/                 # Custom hooks
│   │   ├── useAuth.ts
│   │   ├── useBooking.ts
│   │   └── ...
│   ├── store/                 # State management
│   │   ├── authStore.ts
│   │   ├── bookingStore.ts
│   │   └── ...
│   └── types/                 # TypeScript types
│       ├── api.ts
│       ├── models.ts
│       └── ...
├── public/                    # Static assets
└── package.json
```

### 5.2 State Management Strategy

**Global State (Zustand):**
- Authentication state
- User preferences
- Cart/booking state

**Server State (React Query):**
- API data caching
- Background refetching
- Optimistic updates

**Local State (useState):**
- Form inputs
- UI toggles
- Component-specific data

### 5.3 Performance Optimizations

**Code Splitting:**
- Route-based splitting (Next.js automatic)
- Dynamic imports for heavy components
- Lazy loading for images

**Caching Strategy:**
- React Query cache (5 min stale time)
- Browser cache for static assets
- Service Worker for offline support

**SEO Optimization:**
- Server-side rendering for public pages
- Meta tags and Open Graph
- Structured data (JSON-LD)
- Sitemap generation

---

## 6. Security Architecture

### 6.1 Authentication Security

**Password Security:**
- bcrypt hashing (12 rounds)
- Minimum 6 characters
- No password in responses
- Secure password reset flow

**JWT Security:**
- HS256 algorithm
- 7-day expiration
- Refresh token rotation
- Token blacklisting on logout

### 6.2 API Security

**Request Security:**
- Rate limiting (100 req/15min)
- CORS configuration
- Helmet.js security headers
- Input validation (express-validator)
- SQL injection prevention (Prisma ORM)
- XSS protection

**Data Security:**
- HTTPS enforcement
- Encrypted database connections
- Environment variable protection
- Sensitive data masking in logs

### 6.3 GDPR Compliance

**Data Protection:**
- User consent management
- Right to access data
- Right to deletion
- Data portability
- Privacy policy
- Cookie consent

---

## 7. Scalability Considerations

### 7.1 Horizontal Scaling

**Load Balancing:**
```
                    ┌─────────────┐
                    │Load Balancer│
                    │   (Nginx)   │
                    └─────────────┘
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
   ┌────▼────┐      ┌────▼────┐      ┌────▼────┐
   │ App     │      │ App     │      │ App     │
   │Instance1│      │Instance2│      │Instance3│
   └─────────┘      └─────────┘      └─────────┘
        │                 │                 │
        └─────────────────┼─────────────────┘
                          │
                    ┌─────▼─────┐
                    │ Database  │
                    │  Cluster  │
                    └───────────┘
```

**Database Scaling:**
- Read replicas for queries
- Write master for updates
- Connection pooling
- Query optimization

**Caching Strategy:**
- Redis for session storage
- API response caching
- Static asset CDN
- Database query caching

### 7.2 Vertical Scaling

**Resource Optimization:**
- Database indexing
- Query optimization
- Memory management
- CPU utilization monitoring

---

## 8. Monitoring & Logging

### 8.1 Application Monitoring

**Metrics to Track:**
- Response times
- Error rates
- Request throughput
- Database query performance
- Memory usage
- CPU utilization

**Tools:**
- PM2 monitoring
- Winston logging
- Custom analytics dashboard

### 8.2 Error Handling

**Error Levels:**
- INFO: General information
- WARN: Warning messages
- ERROR: Error conditions
- FATAL: Critical failures

**Error Logging:**
```javascript
{
  timestamp: "2024-01-15T10:30:00Z",
  level: "ERROR",
  message: "Database connection failed",
  stack: "...",
  context: {
    userId: "uuid",
    endpoint: "/api/bookings",
    method: "POST"
  }
}
```

---

## 9. Deployment Architecture

### 9.1 Production Environment

```
┌─────────────────────────────────────────┐
│          Cloud Provider (AWS/DO)         │
│  ┌────────────────────────────────────┐ │
│  │         Load Balancer              │ │
│  └────────────────────────────────────┘ │
│                   │                      │
│  ┌────────────────┴────────────────┐   │
│  │                                  │   │
│  │  ┌──────────┐    ┌──────────┐  │   │
│  │  │  App     │    │  App     │  │   │
│  │  │ Server 1 │    │ Server 2 │  │   │
│  │  └──────────┘    └──────────┘  │   │
│  │                                  │   │
│  │  ┌──────────┐    ┌──────────┐  │   │
│  │  │PostgreSQL│    │  Redis   │  │   │
│  │  │  Master  │    │  Cache   │  │   │
│  │  └──────────┘    └──────────┘  │   │
│  │                                  │   │
│  │  ┌──────────────────────────┐  │   │
│  │  │    File Storage (S3)     │  │   │
│  │  └──────────────────────────┘  │   │
│  └──────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

### 9.2 CI/CD Pipeline

```
Code Push → GitHub
    ↓
Run Tests (Jest)
    ↓
Build Application
    ↓
Docker Image Creation
    ↓
Push to Registry
    ↓
Deploy to Staging
    ↓
Run E2E Tests
    ↓
Deploy to Production
    ↓
Health Check
```

---

## 10. Future Enhancements

### 10.1 Planned Features

**Phase 2:**
- Mobile app (React Native)
- Advanced analytics dashboard
- AI-powered recommendations
- Multi-location support
- Inventory management enhancement

**Phase 3:**
- Video consultation feature
- Marketplace for products
- Advanced CRM features
- Loyalty program gamification
- Social media integration

### 10.2 Technical Improvements

- GraphQL API implementation
- Microservices architecture
- Real-time notifications (WebSocket)
- Advanced caching strategies
- Machine learning for demand forecasting

---

## Conclusion

This architecture is designed to be:
- **Scalable**: Can handle growth in users and data
- **Maintainable**: Clean code structure and documentation
- **Secure**: Multiple layers of security
- **Performant**: Optimized for speed and efficiency
- **Reliable**: High availability and fault tolerance

For technical support or architecture questions, contact the development team.