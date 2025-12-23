# API Documentation - Looks Trend'z Salon Management System

## Base URL
```
Development: http://localhost:5000/api
Production: https://your-domain.com/api
```

## Authentication
All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

## Response Format
All API responses follow this structure:
```json
{
  "message": "Success message",
  "data": {},
  "error": "Error message (if any)"
}
```

---

## Authentication Endpoints

### POST /auth/register
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+919876543210"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "CUSTOMER"
  },
  "token": "jwt_token"
}
```

### POST /auth/login
Authenticate user and get access token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "CUSTOMER"
  },
  "token": "jwt_token"
}
```

### GET /auth/verify
Verify JWT token validity.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "CUSTOMER"
  }
}
```

---

## Services Endpoints

### GET /services
Get all services grouped by category.

**Query Parameters:**
- `category` (optional): Filter by service category
- `isActive` (optional): Filter active services (default: true)

**Response:**
```json
{
  "services": {
    "HAIR": [
      {
        "id": "uuid",
        "name": "Premium Hair Cut",
        "description": "Professional hair cutting service",
        "category": "HAIR",
        "duration": 60,
        "price": 1500,
        "isActive": true
      }
    ],
    "SKIN": [...],
    "GROOMING": [...]
  }
}
```

### GET /services/:id
Get service details by ID.

**Response:**
```json
{
  "service": {
    "id": "uuid",
    "name": "Premium Hair Cut",
    "description": "Professional hair cutting service",
    "category": "HAIR",
    "duration": 60,
    "price": 1500,
    "staff": [
      {
        "staff": {
          "id": "uuid",
          "user": {
            "firstName": "Jane",
            "lastName": "Smith"
          }
        }
      }
    ]
  }
}
```

### POST /services (Admin Only)
Create a new service.

**Headers:** `Authorization: Bearer <admin_token>`

**Request Body:**
```json
{
  "name": "New Service",
  "description": "Service description",
  "category": "HAIR",
  "duration": 90,
  "price": 2000
}
```

---

## Bookings Endpoints

### GET /bookings/availability
Get available time slots for booking.

**Query Parameters:**
- `date`: Date in YYYY-MM-DD format
- `serviceIds`: Comma-separated service IDs
- `staffId` (optional): Specific staff member ID

**Response:**
```json
{
  "slots": [
    {
      "staffId": "uuid",
      "staffName": "Jane Smith",
      "availableSlots": [
        {
          "startTime": "2024-01-15T09:00:00Z",
          "endTime": "2024-01-15T10:30:00Z",
          "available": true
        }
      ]
    }
  ]
}
```

### POST /bookings
Create a new booking.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "staffId": "uuid",
  "serviceIds": ["uuid1", "uuid2"],
  "bookingDate": "2024-01-15",
  "startTime": "2024-01-15T09:00:00Z",
  "notes": "Special requests"
}
```

**Response:**
```json
{
  "message": "Booking created successfully",
  "booking": {
    "id": "uuid",
    "bookingDate": "2024-01-15T00:00:00Z",
    "startTime": "2024-01-15T09:00:00Z",
    "endTime": "2024-01-15T10:30:00Z",
    "status": "CONFIRMED",
    "totalAmount": 3500,
    "items": [
      {
        "service": {
          "name": "Premium Hair Cut",
          "price": 1500
        }
      }
    ],
    "staff": {
      "user": {
        "firstName": "Jane",
        "lastName": "Smith"
      }
    }
  }
}
```

### GET /bookings/my-bookings
Get current user's bookings.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "bookings": [
    {
      "id": "uuid",
      "bookingDate": "2024-01-15T00:00:00Z",
      "startTime": "2024-01-15T09:00:00Z",
      "status": "CONFIRMED",
      "totalAmount": 3500,
      "items": [...],
      "staff": {...},
      "invoice": {...}
    }
  ]
}
```

### PATCH /bookings/:id/status (Staff/Admin Only)
Update booking status.

**Headers:** `Authorization: Bearer <staff_or_admin_token>`

**Request Body:**
```json
{
  "status": "COMPLETED"
}
```

---

## Staff Endpoints

### GET /staff
Get all available staff members.

**Response:**
```json
{
  "staff": [
    {
      "id": "uuid",
      "position": "Senior Stylist",
      "user": {
        "firstName": "Jane",
        "lastName": "Smith",
        "email": "jane@lookstrendz.com"
      },
      "services": [
        {
          "service": {
            "name": "Hair Cut",
            "category": "HAIR"
          }
        }
      ]
    }
  ]
}
```

---

## Admin Endpoints

### GET /admin/dashboard (Admin Only)
Get dashboard analytics.

**Headers:** `Authorization: Bearer <admin_token>`

**Response:**
```json
{
  "todayStats": {
    "bookings": 15,
    "revenue": 25000,
    "customers": 150,
    "staff": 8,
    "pending": 5,
    "completed": 10
  },
  "revenueTrend": [
    {
      "date": "2024-01-15",
      "revenue": 25000
    }
  ],
  "popularServices": [
    {
      "name": "Hair Cut",
      "bookings": 25
    }
  ],
  "staffPerformance": [
    {
      "name": "Jane Smith",
      "bookings": 15,
      "revenue": 22500
    }
  ]
}
```

### GET /admin/bookings (Admin Only)
Get all bookings with filters.

**Headers:** `Authorization: Bearer <admin_token>`

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20)
- `status`: Filter by booking status
- `staffId`: Filter by staff member
- `date`: Filter by specific date
- `search`: Search customer name/email

**Response:**
```json
{
  "bookings": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "pages": 5
  }
}
```

### GET /admin/customers (Admin Only)
Get all customers with booking history.

**Headers:** `Authorization: Bearer <admin_token>`

**Query Parameters:**
- `page`: Page number
- `limit`: Items per page
- `search`: Search customer name/email

### GET /admin/reports/revenue (Admin Only)
Get revenue reports.

**Headers:** `Authorization: Bearer <admin_token>`

**Query Parameters:**
- `startDate`: Start date (YYYY-MM-DD)
- `endDate`: End date (YYYY-MM-DD)
- `groupBy`: Grouping (day/week/month)

---

## Payments Endpoints

### POST /payments/create-intent
Create payment intent for booking.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "bookingId": "uuid"
}
```

**Response:**
```json
{
  "clientSecret": "payment_intent_secret",
  "amount": 3500,
  "invoiceId": "uuid"
}
```

---

## Error Codes

| Code | Description |
|------|-------------|
| 400  | Bad Request - Invalid input data |
| 401  | Unauthorized - Invalid or missing token |
| 403  | Forbidden - Insufficient permissions |
| 404  | Not Found - Resource not found |
| 409  | Conflict - Resource already exists or conflict |
| 422  | Validation Error - Input validation failed |
| 500  | Internal Server Error |

## Rate Limiting
- 100 requests per 15 minutes per IP address
- Higher limits for authenticated users

## Pagination
All list endpoints support pagination:
- `page`: Page number (starts from 1)
- `limit`: Items per page (max 100)

Response includes pagination metadata:
```json
{
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "pages": 5
  }
}
```