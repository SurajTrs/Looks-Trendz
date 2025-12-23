const ADMIN_WHATSAPP = '+919389619634';

export async function sendWhatsAppNotification(booking: any) {
  try {
    const message = `🎉 *New Booking Received!*

📱 Customer: ${booking.customer.user.firstName} ${booking.customer.user.lastName}
📞 Phone: ${booking.customer.user.phone}

💇 Services: ${booking.serviceNames.join(', ')}
💰 Total Amount: ₹${booking.totalAmount}

📅 Date: ${new Date(booking.bookingDate).toLocaleDateString('en-IN')}
⏰ Time: ${new Date(booking.startTime).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}

👨💼 Staff: ${booking.staff.user.firstName} ${booking.staff.user.lastName}

📝 Notes: ${booking.notes || 'None'}

---
Looks Trend'z Unisex Saloon`;

    console.log('WhatsApp Notification:');
    console.log(`To: ${ADMIN_WHATSAPP}`);
    console.log(message);
    
    return true;
  } catch (error) {
    console.error('WhatsApp notification error:', error);
    return false;
  }
}
