# Admin User Manual - Looks Trend'z Salon Management System

## Table of Contents
1. [Getting Started](#getting-started)
2. [Dashboard Overview](#dashboard-overview)
3. [Staff Management](#staff-management)
4. [Service Management](#service-management)
5. [Customer Management](#customer-management)
6. [Booking Management](#booking-management)
7. [Payments & Invoicing](#payments--invoicing)
8. [Reports & Analytics](#reports--analytics)
9. [Marketing Tools](#marketing-tools)
10. [System Settings](#system-settings)

---

## Getting Started

### Accessing the Admin Panel

1. **Login to the System**
   - Navigate to `https://your-salon-domain.com/auth/login`
   - Enter your admin credentials
   - Click "Sign In"

2. **Admin Dashboard**
   - After login, you'll be redirected to the admin dashboard
   - The sidebar contains all management modules
   - Top bar shows notifications and quick actions

### First-Time Setup

1. **Complete Your Profile**
   - Click on your profile icon (top right)
   - Update personal information
   - Set up two-factor authentication (recommended)

2. **Configure Salon Settings**
   - Go to Settings → Salon Information
   - Add salon name, address, contact details
   - Set operating hours
   - Upload salon logo and images

---

## Dashboard Overview

### Key Metrics Display

The dashboard provides real-time insights into your salon's performance:

**Today's Statistics:**
- Total bookings for today
- Revenue generated
- Active staff members
- Pending appointments

**Quick Actions:**
- Add new booking
- Register walk-in customer
- View today's schedule
- Generate daily report

**Charts & Graphs:**
- Revenue trend (last 7 days)
- Popular services
- Staff performance
- Customer retention metrics

### Navigation Menu

**Main Sections:**
- 📊 Dashboard - Overview and analytics
- 📅 Bookings - Appointment management
- 👥 Customers - Customer database
- 👨‍💼 Staff - Employee management
- ✂️ Services - Service catalog
- 💰 Payments - Financial management
- 📊 Reports - Business analytics
- 🎯 Marketing - Promotional tools
- ⚙️ Settings - System configuration

---

## Staff Management

### Adding New Staff Members

1. **Navigate to Staff Section**
   - Click "Staff" in the sidebar
   - Click "Add New Staff" button

2. **Enter Staff Information**
   ```
   Personal Details:
   - First Name, Last Name
   - Email Address
   - Phone Number
   - Date of Birth
   - Address
   
   Employment Details:
   - Employee ID
   - Position/Title
   - Department
   - Hire Date
   - Salary/Commission Rate
   
   Working Schedule:
   - Working Days
   - Start Time, End Time
   - Break Times
   - Days Off
   ```

3. **Assign Services**
   - Select services the staff member can perform
   - Set skill level for each service
   - Define service pricing (if different from standard)

4. **Set Permissions**
   - Choose role (Staff, Manager, Admin)
   - Define access permissions
   - Set booking management rights

### Managing Existing Staff

**View Staff List:**
- See all staff members in a table format
- Filter by department, status, or role
- Search by name or employee ID

**Edit Staff Information:**
- Click on staff member's name
- Update any information
- Modify working hours or services
- Change status (Active/Inactive)

**Staff Performance Tracking:**
- View individual performance metrics
- See booking history and revenue generated
- Track customer ratings and feedback
- Monitor attendance and punctuality

### Staff Scheduling

**Set Working Hours:**
1. Select staff member
2. Go to "Schedule" tab
3. Set daily working hours
4. Define break times
5. Mark holidays and days off

**Manage Leave Requests:**
- View pending leave requests
- Approve or reject applications
- Track leave balances
- Generate leave reports

---

## Service Management

### Adding New Services

1. **Create Service Category**
   - Go to Services → Categories
   - Add category (Hair, Skin, Grooming, etc.)
   - Set category description and image

2. **Add Individual Services**
   ```
   Service Information:
   - Service Name
   - Description
   - Category
   - Duration (in minutes)
   - Price
   - Service Image
   
   Additional Settings:
   - Preparation time needed
   - Cleanup time required
   - Maximum bookings per day
   - Seasonal availability
   ```

3. **Assign to Staff**
   - Select which staff members can perform this service
   - Set individual pricing if different
   - Define skill requirements

### Service Packages

**Create Service Bundles:**
1. Go to Services → Packages
2. Click "Create New Package"
3. Select multiple services
4. Set package price (usually discounted)
5. Define package duration and terms

**Popular Package Examples:**
- Bridal Package (Hair + Makeup + Facial)
- Men's Grooming (Haircut + Beard Trim + Facial)
- Spa Day (Facial + Massage + Manicure)
- Mother-Daughter Package

### Pricing Management

**Dynamic Pricing:**
- Set different prices for peak/off-peak hours
- Weekend vs weekday pricing
- Holiday special rates
- Member vs non-member pricing

**Discount Management:**
- Create percentage or fixed amount discounts
- Set validity periods
- Define usage limits
- Track discount usage

---

## Customer Management

### Customer Database

**View All Customers:**
- Complete customer list with contact information
- Filter by registration date, visit frequency, or spending
- Search by name, phone, or email
- Export customer data

**Customer Profiles:**
Each customer profile contains:
```
Personal Information:
- Name, contact details
- Date of birth, gender
- Address and preferences
- Emergency contact

Visit History:
- All past appointments
- Services received
- Amount spent
- Staff preferences

Preferences & Notes:
- Preferred services
- Allergies or special requirements
- Communication preferences
- Internal notes
```

### Customer Loyalty Program

**Points System:**
- Customers earn points for each visit
- Points can be redeemed for discounts
- Set point values and redemption rates
- Track point balances

**Membership Tiers:**
- Bronze, Silver, Gold tiers
- Different benefits for each tier
- Automatic tier upgrades based on spending
- Special member pricing

### Customer Communication

**Automated Messages:**
- Appointment confirmations
- Reminder notifications
- Birthday wishes
- Promotional offers

**Manual Communication:**
- Send individual messages
- Bulk SMS/Email campaigns
- WhatsApp integration
- Follow-up after services

---

## Booking Management

### Viewing Bookings

**Daily Schedule View:**
- See all appointments for selected date
- Color-coded by service type or staff
- Drag-and-drop to reschedule
- Quick status updates

**Calendar View:**
- Monthly overview of bookings
- Identify busy and slow periods
- Plan staff schedules accordingly
- Block dates for holidays

**List View:**
- Detailed booking information
- Filter by date range, staff, or service
- Search by customer name
- Export booking data

### Creating Manual Bookings

**For Walk-in Customers:**
1. Click "New Booking" button
2. Select or create customer profile
3. Choose available staff and time slot
4. Select services
5. Confirm booking and collect payment

**For Phone Bookings:**
1. Search for existing customer or create new
2. Check staff availability
3. Select services and calculate total
4. Reserve time slot
5. Send confirmation message

### Managing Booking Status

**Status Types:**
- ✅ Confirmed - Booking is confirmed
- 🕐 In Progress - Service has started
- ✅ Completed - Service finished successfully
- ❌ Cancelled - Booking was cancelled
- ⚠️ No Show - Customer didn't arrive

**Status Updates:**
- Staff can update status from mobile app
- Automatic status changes based on time
- Notifications sent to customers
- Reports generated for no-shows

### Handling Cancellations & Reschedules

**Cancellation Policy:**
- Set cancellation deadlines
- Define refund policies
- Charge cancellation fees if applicable
- Track cancellation reasons

**Rescheduling:**
- Allow customers to reschedule online
- Find alternative time slots
- Send updated confirmations
- Track rescheduling patterns

---

## Payments & Invoicing

### Payment Processing

**Accepted Payment Methods:**
- Cash payments
- Credit/Debit cards
- UPI payments (Razorpay integration)
- Digital wallets
- Gift cards and vouchers

**Payment Workflow:**
1. Service completion confirmation
2. Automatic invoice generation
3. Payment collection
4. Receipt generation
5. Payment recording in system

### Invoice Management

**Invoice Features:**
- Automatic invoice numbering
- GST calculation and compliance
- Itemized service breakdown
- Discount applications
- Tax calculations

**Invoice Actions:**
- Generate and send invoices
- Mark as paid/unpaid
- Send payment reminders
- Process refunds
- Export for accounting

### Financial Reporting

**Daily Reports:**
- Total revenue
- Payment method breakdown
- Outstanding payments
- Refunds processed

**Monthly/Yearly Reports:**
- Revenue trends
- Service-wise income
- Staff commission calculations
- Tax summaries

---

## Reports & Analytics

### Revenue Analytics

**Revenue Dashboard:**
- Daily, weekly, monthly revenue
- Year-over-year comparisons
- Revenue by service category
- Revenue by staff member

**Trend Analysis:**
- Identify peak business hours
- Seasonal patterns
- Growth trends
- Forecasting

### Customer Analytics

**Customer Insights:**
- New vs returning customers
- Customer lifetime value
- Visit frequency analysis
- Customer retention rates

**Demographic Analysis:**
- Age group preferences
- Gender-based service preferences
- Geographic distribution
- Spending patterns

### Staff Performance

**Individual Performance:**
- Revenue generated per staff
- Number of customers served
- Average service time
- Customer satisfaction ratings

**Comparative Analysis:**
- Staff performance comparison
- Efficiency metrics
- Commission calculations
- Training needs identification

### Service Analytics

**Popular Services:**
- Most booked services
- Revenue per service
- Service profitability
- Seasonal service trends

**Service Optimization:**
- Underperforming services
- Pricing optimization suggestions
- Service bundling opportunities
- Capacity utilization

---

## Marketing Tools

### Promotional Campaigns

**Discount Codes:**
1. Go to Marketing → Promotions
2. Create new promotion code
3. Set discount type (percentage/fixed amount)
4. Define validity period and usage limits
5. Share code with customers

**Special Offers:**
- First-time customer discounts
- Birthday month specials
- Referral bonuses
- Seasonal promotions

### Email Marketing

**Campaign Creation:**
1. Select target customer segment
2. Choose email template
3. Customize content and images
4. Schedule or send immediately
5. Track open rates and clicks

**Automated Emails:**
- Welcome emails for new customers
- Appointment reminders
- Follow-up after services
- Birthday and anniversary wishes

### SMS Marketing

**Bulk SMS Campaigns:**
- Promotional messages
- Appointment reminders
- Special offers
- Event notifications

**SMS Templates:**
- Pre-written message templates
- Personalization variables
- Delivery scheduling
- Response tracking

### Social Media Integration

**Instagram Integration:**
- Display Instagram feed on website
- Share customer transformations (with permission)
- Promote services through posts
- Engage with customer comments

**Review Management:**
- Monitor online reviews
- Respond to customer feedback
- Encourage satisfied customers to leave reviews
- Address negative reviews professionally

---

## System Settings

### Salon Configuration

**Basic Information:**
- Salon name and logo
- Contact information
- Address and location
- Operating hours
- Holiday schedule

**Booking Settings:**
- Advance booking limit
- Cancellation policies
- Buffer time between appointments
- Walk-in availability
- Online booking rules

### User Management

**Admin Users:**
- Create additional admin accounts
- Set role-based permissions
- Manage user access levels
- Track user activity logs

**Security Settings:**
- Password policies
- Two-factor authentication
- Session timeout settings
- Login attempt limits

### Integration Settings

**Payment Gateways:**
- Razorpay configuration
- Stripe setup (if applicable)
- Payment method preferences
- Transaction fee settings

**Communication Services:**
- SMS gateway setup (Twilio)
- Email service configuration
- WhatsApp Business API
- Notification preferences

### Backup & Maintenance

**Data Backup:**
- Automatic daily backups
- Manual backup creation
- Backup restoration
- Data export options

**System Maintenance:**
- Software updates
- Database optimization
- Performance monitoring
- Error log review

---

## Best Practices

### Daily Operations

1. **Start of Day:**
   - Review today's appointments
   - Check staff availability
   - Verify payment systems
   - Update any changes

2. **During Operations:**
   - Monitor real-time bookings
   - Handle walk-in customers
   - Update appointment statuses
   - Process payments promptly

3. **End of Day:**
   - Generate daily reports
   - Reconcile payments
   - Plan next day's schedule
   - Backup important data

### Customer Service Excellence

1. **Booking Management:**
   - Confirm appointments 24 hours in advance
   - Send reminder messages
   - Handle changes professionally
   - Follow up after services

2. **Quality Assurance:**
   - Monitor service quality
   - Collect customer feedback
   - Address complaints promptly
   - Maintain service standards

### Staff Management

1. **Performance Monitoring:**
   - Regular performance reviews
   - Provide constructive feedback
   - Recognize outstanding performance
   - Identify training needs

2. **Schedule Optimization:**
   - Balance workload among staff
   - Consider staff preferences
   - Plan for peak hours
   - Manage time-off requests

### Financial Management

1. **Revenue Optimization:**
   - Analyze pricing strategies
   - Promote high-margin services
   - Implement upselling techniques
   - Monitor competitor pricing

2. **Cost Control:**
   - Track operational expenses
   - Optimize inventory levels
   - Negotiate supplier contracts
   - Monitor staff productivity

---

## Troubleshooting

### Common Issues

**Login Problems:**
- Reset password if forgotten
- Check internet connection
- Clear browser cache
- Contact technical support

**Booking Issues:**
- Verify staff availability
- Check service duration settings
- Confirm customer information
- Review booking policies

**Payment Problems:**
- Verify payment gateway settings
- Check internet connectivity
- Confirm bank account details
- Review transaction logs

### Getting Help

**Support Channels:**
- Email: support@lookstrendz.com
- Phone: +91 98765 43210
- Live Chat: Available 9 AM - 6 PM
- Help Documentation: Available in system

**Training Resources:**
- Video tutorials
- User guides
- Webinar sessions
- One-on-one training

---

## Conclusion

This admin manual provides comprehensive guidance for managing your salon operations effectively. Regular use of the analytics and reporting features will help you make data-driven decisions to grow your business.

For additional support or advanced features, please contact our support team. We're committed to helping you succeed with your salon management system.