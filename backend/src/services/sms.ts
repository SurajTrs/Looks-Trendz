import twilio from 'twilio';

const client = process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN
  ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
  : null;

export const sendBookingSMS = async (booking: any) => {
  const { customer, staff, bookingDate, startTime, serviceNames, totalAmount } = booking;
  const phone = customer.user.phone;

  if (!phone) {
    console.log('No phone number for customer');
    return;
  }

  const message = `Looks Trend'z: Booking confirmed for ${new Date(bookingDate).toLocaleDateString()} at ${new Date(startTime).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}. Services: ${serviceNames.join(', ')}. Amount: ₹${totalAmount}. Staff: ${staff.user.firstName}`;

  try {
    if (client && process.env.TWILIO_PHONE_NUMBER) {
      await client.messages.create({
        body: message,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phone,
      });
      console.log('SMS sent to:', phone);
    } else {
      console.log('SMS notification (Twilio not configured):', { phone, message });
    }
  } catch (error) {
    console.error('SMS send error:', error);
  }
};

export const sendReminderSMS = async (booking: any) => {
  const { customer, startTime, serviceNames } = booking;
  const phone = customer.user.phone;

  if (!phone) return;

  const message = `Reminder: Your appointment at Looks Trend'z is tomorrow at ${new Date(startTime).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}. Services: ${serviceNames.join(', ')}. Call +91 98765 43210 to reschedule.`;

  try {
    if (client && process.env.TWILIO_PHONE_NUMBER) {
      await client.messages.create({
        body: message,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phone,
      });
    } else {
      console.log('Reminder SMS (Twilio not configured):', { phone, message });
    }
  } catch (error) {
    console.error('Reminder SMS error:', error);
  }
};
