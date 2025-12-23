# Deployment Guide - Looks Trend'z Salon Management System

## Prerequisites

### System Requirements
- Node.js 18+ 
- PostgreSQL 14+
- Redis 6+
- Git
- Docker (optional)

### Domain & Hosting
- Domain name (e.g., lookstrendz.com)
- SSL certificate
- Cloud hosting (AWS, DigitalOcean, etc.)

---

## Environment Setup

### 1. Server Preparation

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PostgreSQL
sudo apt install postgresql postgresql-contrib

# Install Redis
sudo apt install redis-server

# Install PM2 for process management
sudo npm install -g pm2

# Install Nginx
sudo apt install nginx
```

### 2. Database Setup

```bash
# Switch to postgres user
sudo -u postgres psql

# Create database and user
CREATE DATABASE salon_db;
CREATE USER salon_user WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE salon_db TO salon_user;
\q
```

### 3. Application Deployment

```bash
# Clone repository
git clone <repository-url>
cd looks-trendz-salon

# Install dependencies
npm run install:all

# Setup environment variables
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local

# Edit environment files with production values
nano backend/.env
nano frontend/.env.local
```

---

## Backend Deployment

### 1. Environment Configuration

Edit `backend/.env`:
```env
# Database
DATABASE_URL="postgresql://salon_user:secure_password@localhost:5432/salon_db"

# JWT
JWT_SECRET="your-super-secure-jwt-secret-key-here"

# Server
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://your-domain.com

# Redis
REDIS_URL="redis://localhost:6379"

# Email (Gmail SMTP)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# SMS (Twilio)
TWILIO_ACCOUNT_SID=your-twilio-sid
TWILIO_AUTH_TOKEN=your-twilio-token
TWILIO_PHONE_NUMBER=+1234567890

# Payments
RAZORPAY_KEY_ID=your-razorpay-key
RAZORPAY_KEY_SECRET=your-razorpay-secret
```

### 2. Database Migration

```bash
cd backend
npx prisma migrate deploy
npx prisma db seed
```

### 3. Build and Start

```bash
# Build backend
cd backend
npm run build

# Start with PM2
pm2 start dist/server.js --name "salon-backend"
pm2 save
pm2 startup
```

---

## Frontend Deployment

### 1. Environment Configuration

Edit `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=https://api.your-domain.com
NEXT_PUBLIC_RAZORPAY_KEY=your-razorpay-key
```

### 2. Build and Deploy

```bash
cd frontend
npm run build

# Start with PM2
pm2 start npm --name "salon-frontend" -- start
```

---

## Nginx Configuration

### 1. Backend Proxy

Create `/etc/nginx/sites-available/salon-api`:
```nginx
server {
    listen 80;
    server_name api.your-domain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 2. Frontend Proxy

Create `/etc/nginx/sites-available/salon-frontend`:
```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 3. Enable Sites

```bash
sudo ln -s /etc/nginx/sites-available/salon-api /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/salon-frontend /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## SSL Certificate Setup

### Using Certbot (Let's Encrypt)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get certificates
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
sudo certbot --nginx -d api.your-domain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

---

## Docker Deployment (Alternative)

### 1. Backend Dockerfile

Create `backend/Dockerfile`:
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 5000

CMD ["npm", "start"]
```

### 2. Frontend Dockerfile

Create `frontend/Dockerfile`:
```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app

COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000

CMD ["node", "server.js"]
```

### 3. Docker Compose

Create `docker-compose.prod.yml`:
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:14
    environment:
      POSTGRES_DB: salon_db
      POSTGRES_USER: salon_user
      POSTGRES_PASSWORD: secure_password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:6-alpine
    ports:
      - "6379:6379"

  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      DATABASE_URL: postgresql://salon_user:secure_password@postgres:5432/salon_db
      REDIS_URL: redis://redis:6379
    depends_on:
      - postgres
      - redis

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      NEXT_PUBLIC_API_URL: http://backend:5000/api
    depends_on:
      - backend

volumes:
  postgres_data:
```

### 4. Deploy with Docker

```bash
docker-compose -f docker-compose.prod.yml up -d
```

---

## Monitoring & Maintenance

### 1. PM2 Monitoring

```bash
# View processes
pm2 list

# View logs
pm2 logs salon-backend
pm2 logs salon-frontend

# Restart services
pm2 restart salon-backend
pm2 restart salon-frontend

# Monitor resources
pm2 monit
```

### 2. Database Backup

```bash
# Create backup script
cat > /home/ubuntu/backup-db.sh << 'EOF'
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump -h localhost -U salon_user salon_db > /home/ubuntu/backups/salon_db_$DATE.sql
find /home/ubuntu/backups -name "salon_db_*.sql" -mtime +7 -delete
EOF

chmod +x /home/ubuntu/backup-db.sh

# Add to crontab for daily backups
crontab -e
# Add: 0 2 * * * /home/ubuntu/backup-db.sh
```

### 3. Log Rotation

```bash
# Configure logrotate
sudo nano /etc/logrotate.d/salon-app

/home/ubuntu/.pm2/logs/*.log {
    daily
    missingok
    rotate 7
    compress
    notifempty
    create 0644 ubuntu ubuntu
    postrotate
        pm2 reloadLogs
    endscript
}
```

---

## Security Checklist

### Server Security
- [ ] Firewall configured (UFW)
- [ ] SSH key authentication only
- [ ] Regular security updates
- [ ] Non-root user for applications
- [ ] Fail2ban installed

### Application Security
- [ ] Environment variables secured
- [ ] Database credentials rotated
- [ ] JWT secrets are strong
- [ ] HTTPS enforced
- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] Input validation implemented

### Database Security
- [ ] Database user has minimal privileges
- [ ] Regular backups scheduled
- [ ] Connection encryption enabled
- [ ] Access restricted to application only

---

## Performance Optimization

### 1. Database Optimization

```sql
-- Add indexes for frequently queried fields
CREATE INDEX idx_bookings_date ON bookings(booking_date);
CREATE INDEX idx_bookings_staff ON bookings(staff_id);
CREATE INDEX idx_bookings_customer ON bookings(customer_id);
CREATE INDEX idx_users_email ON users(email);
```

### 2. Redis Caching

```javascript
// Cache frequently accessed data
const redis = require('redis');
const client = redis.createClient(process.env.REDIS_URL);

// Cache service data
app.get('/api/services', async (req, res) => {
  const cached = await client.get('services');
  if (cached) {
    return res.json(JSON.parse(cached));
  }
  
  const services = await getServicesFromDB();
  await client.setex('services', 3600, JSON.stringify(services));
  res.json(services);
});
```

### 3. CDN Setup

```bash
# Use CloudFlare or AWS CloudFront for static assets
# Configure in next.config.js
module.exports = {
  assetPrefix: 'https://cdn.your-domain.com',
  images: {
    loader: 'cloudinary',
    path: 'https://res.cloudinary.com/your-account/',
  },
}
```

---

## Troubleshooting

### Common Issues

1. **Database Connection Failed**
   ```bash
   # Check PostgreSQL status
   sudo systemctl status postgresql
   
   # Check connection
   psql -h localhost -U salon_user -d salon_db
   ```

2. **Application Won't Start**
   ```bash
   # Check PM2 logs
   pm2 logs salon-backend --lines 50
   
   # Check environment variables
   pm2 env salon-backend
   ```

3. **High Memory Usage**
   ```bash
   # Monitor processes
   htop
   
   # Restart applications
   pm2 restart all
   ```

4. **SSL Certificate Issues**
   ```bash
   # Check certificate status
   sudo certbot certificates
   
   # Renew certificates
   sudo certbot renew --dry-run
   ```

### Health Checks

```bash
# API health check
curl https://api.your-domain.com/health

# Frontend health check
curl https://your-domain.com

# Database connection test
psql -h localhost -U salon_user -d salon_db -c "SELECT 1;"
```

---

## Scaling Considerations

### Horizontal Scaling
- Load balancer (Nginx/HAProxy)
- Multiple application instances
- Database read replicas
- Redis cluster

### Vertical Scaling
- Increase server resources
- Optimize database queries
- Implement caching strategies
- Use CDN for static assets

### Monitoring Tools
- PM2 Plus for application monitoring
- PostgreSQL monitoring (pg_stat_statements)
- Nginx access logs analysis
- Server monitoring (htop, iotop, netstat)