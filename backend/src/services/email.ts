import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendBookingConfirmation = async (booking: any) => {
  const { customer, staff, bookingDate, startTime, serviceNames, totalAmount } = booking;
  
  const mailOptions = {
    from: process.env.SMTP_FROM || 'noreply@lookstrendz.com',
    to: customer.user.email,
    subject: 'Booking Confirmation - Looks Trend\'z Salon',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #D4AF37;">Booking Confirmed!</h2>
        <p>Dear ${customer.user.firstName},</p>
        <p>Your appointment has been confirmed.</p>
        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Booking Details:</h3>
          <p><strong>Date:</strong> ${new Date(bookingDate).toLocaleDateString()}</p>
          <p><strong>Time:</strong> ${new Date(startTime).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</p>
          <p><strong>Services:</strong> ${serviceNames.join(', ')}</p>
          <p><strong>Staff:</strong> ${staff.user.firstName} ${staff.user.lastName}</p>
          <p><strong>Total Amount:</strong> ₹${totalAmount}</p>
        </div>
        <p>We look forward to serving you!</p>
        <p style="color: #666; font-size: 12px;">Looks Trend'z Unisex Salon<br>Phone: +91 98765 43210</p>
      </div>
    `,
  };

  try {
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      await transporter.sendMail(mailOptions);
      console.log('Email sent to:', customer.user.email);
    } else {
      console.log('Email notification (SMTP not configured):', mailOptions);
    }
  } catch (error) {
    console.error('Email send error:', error);
  }
};

export const sendBookingReminder = async (booking: any) => {
  const { customer, startTime, serviceNames } = booking;
  
  const mailOptions = {
    from: process.env.SMTP_FROM || 'noreply@lookstrendz.com',
    to: customer.user.email,
    subject: 'Appointment Reminder - Looks Trend\'z Salon',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #D4AF37;">Appointment Reminder</h2>
        <p>Dear ${customer.user.firstName},</p>
        <p>This is a reminder for your upcoming appointment tomorrow.</p>
        <p><strong>Time:</strong> ${new Date(startTime).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</p>
        <p><strong>Services:</strong> ${serviceNames.join(', ')}</p>
        <p>See you soon!</p>
      </div>
    `,
  };

  try {
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      await transporter.sendMail(mailOptions);
    } else {
      console.log('Reminder email (SMTP not configured):', mailOptions);
    }
  } catch (error) {
    console.error('Reminder email error:', error);
  }
};
