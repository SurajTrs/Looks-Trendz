# MongoDB Atlas Production Setup Guide

## Step 1: Create MongoDB Atlas Account

1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up for a free account
3. Create a new cluster (M0 Free Tier for testing, M10+ for production)

## Step 2: Configure Network Access

1. Go to Network Access in Atlas dashboard
2. Add IP Address:
   - For development: Add your current IP
   - For production: Add your server IP or use 0.0.0.0/0 (not recommended for production)

## Step 3: Create Database User

1. Go to Database Access
2. Add New Database User
3. Set username and password (save these securely)
4. Grant "Read and write to any database" role

## Step 4: Get Connection String

1. Click "Connect" on your cluster
2. Choose "Connect your application"
3. Copy the connection string
4. Replace `<password>` with your database user password
5. Replace `<dbname>` with your database name (e.g., looks_trendz_salon)

Example connection string:
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/looks_trendz_salon?retryWrites=true&w=majority
```

## Step 5: Update Backend Configuration

Update your `.env` file:

```env
# Production MongoDB Atlas
DATABASE_URL="mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/looks_trendz_salon?retryWrites=true&w=majority"

# Other production settings
NODE_ENV=production
PORT=5001
JWT_SECRET=your-super-secret-jwt-key-change-this
FRONTEND_URL=https://your-frontend-domain.com

# Email Configuration (Gmail example)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-specific-password
SMTP_FROM=noreply@lookstrendz.com

# SMS Configuration (Twilio)
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_PHONE_NUMBER=+1234567890

# Admin WhatsApp (for notifications)
ADMIN_WHATSAPP=+919389619634
```

## Step 6: Enable Replica Set (Optional)

MongoDB Atlas clusters come with replica sets enabled by default, which allows:
- Transactions support
- High availability
- Automatic failover

## Step 7: Set Up Indexes

Run these commands in MongoDB Atlas shell or via Prisma:

```javascript
// Bookings collection
db.bookings.createIndex({ customerId: 1, createdAt: -1 })
db.bookings.createIndex({ staffId: 1, bookingDate: 1 })
db.bookings.createIndex({ status: 1 })
db.bookings.createIndex({ bookingDate: 1, startTime: 1 })

// Users collection
db.users.createIndex({ email: 1 }, { unique: true })
db.users.createIndex({ phone: 1 })

// Services collection
db.services.createIndex({ category: 1, isActive: 1 })
db.services.createIndex({ name: "text" })

// Customers collection
db.customers.createIndex({ userId: 1 }, { unique: true })

// Staff collection
db.staff.createIndex({ userId: 1 }, { unique: true })
db.staff.createIndex({ isAvailable: 1 })
```

## Step 8: Migrate Data (if needed)

If migrating from local MongoDB:

```bash
# Export from local
mongodump --uri="mongodb://localhost:27017/looks_trendz_salon" --out=./backup

# Import to Atlas
mongorestore --uri="mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/looks_trendz_salon" ./backup/looks_trendz_salon
```

## Step 9: Update Prisma Schema

Your current schema already supports MongoDB. Just update the connection string:

```bash
cd backend
npx prisma generate
npx prisma db push
```

## Step 10: Test Connection

```bash
cd backend
npm run dev
```

Check logs for successful connection to MongoDB Atlas.

## Production Best Practices

### Security
- ✅ Use strong passwords (20+ characters)
- ✅ Enable IP whitelist (don't use 0.0.0.0/0)
- ✅ Rotate credentials regularly
- ✅ Use environment variables (never commit credentials)
- ✅ Enable MongoDB Atlas encryption at rest
- ✅ Use TLS/SSL for connections

### Performance
- ✅ Create appropriate indexes
- ✅ Use connection pooling
- ✅ Monitor slow queries
- ✅ Set up alerts for high CPU/memory usage
- ✅ Use read replicas for heavy read operations

### Backup
- ✅ Enable automated backups (Atlas does this by default)
- ✅ Set retention period (7-30 days recommended)
- ✅ Test restore procedures regularly
- ✅ Export critical data periodically

### Monitoring
- ✅ Enable MongoDB Atlas monitoring
- ✅ Set up alerts for:
  - High connection count
  - Low disk space
  - Slow queries
  - Replication lag
- ✅ Review performance metrics weekly

## Cost Optimization

### Free Tier (M0)
- 512 MB storage
- Shared RAM
- Good for: Development, testing, small projects
- Limitations: No backups, limited connections

### Production Tiers
- M10: $0.08/hour (~$57/month) - Small production apps
- M20: $0.20/hour (~$144/month) - Medium apps
- M30+: For high-traffic applications

### Tips to Reduce Costs
1. Use appropriate cluster size
2. Enable auto-scaling
3. Archive old data
4. Use indexes efficiently
5. Implement caching (Redis)

## Troubleshooting

### Connection Issues
```bash
# Test connection
mongosh "mongodb+srv://cluster0.xxxxx.mongodb.net/looks_trendz_salon" --username your-username
```

### Common Errors

**Error: Authentication failed**
- Check username/password
- Verify database user has correct permissions

**Error: IP not whitelisted**
- Add your IP to Network Access in Atlas

**Error: Connection timeout**
- Check firewall settings
- Verify connection string format

## Migration Checklist

- [ ] Create MongoDB Atlas cluster
- [ ] Configure network access
- [ ] Create database user
- [ ] Update DATABASE_URL in .env
- [ ] Test connection locally
- [ ] Run database migrations
- [ ] Seed initial data
- [ ] Create indexes
- [ ] Set up monitoring
- [ ] Configure backups
- [ ] Update production deployment
- [ ] Test all endpoints
- [ ] Monitor for 24 hours

## Support

- MongoDB Atlas Documentation: https://docs.atlas.mongodb.com/
- MongoDB University (Free courses): https://university.mongodb.com/
- Community Forums: https://www.mongodb.com/community/forums/
