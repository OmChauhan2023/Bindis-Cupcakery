import nodemailer from 'nodemailer';

// Create nodemailer transporter from environment variables
const createTransporter = () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    return null;
  }
  return nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

/**
 * Send automated order confirmation receipt email to the customer
 */
export const sendOrderConfirmationEmail = async (
  userEmail: string,
  userName: string,
  orderId: string,
  total: number,
  items: Array<{ name: string; quantity: number; price: number }>,
  paymentMethod: string,
  deliveryAddress: string
) => {
  try {
    const transporter = createTransporter();
    
    const itemsHtml = items
      .map(
        (item) => `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #f1f5f9; color: #1e293b; font-weight: 600;">${item.name}</td>
          <td style="padding: 10px; border-bottom: 1px solid #f1f5f9; color: #64748b; text-align: center;">${item.quantity}</td>
          <td style="padding: 10px; border-bottom: 1px solid #f1f5f9; color: #10b981; font-weight: bold; text-align: right;">₹${item.price * item.quantity}</td>
        </tr>
      `
      )
      .join('');

    const htmlContent = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 10px 25px rgba(0,0,0,0.05);">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%); padding: 32px 20px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 28px; font-weight: 900; letter-spacing: -0.5px;">🧁 Bindi's Cupcakery</h1>
          <p style="margin: 8px 0 0 0; font-size: 16px; opacity: 0.9;">Artisanal Freshly Baked Happiness</p>
        </div>

        <!-- Body -->
        <div style="padding: 32px 24px;">
          <h2 style="color: #0f172a; margin-top: 0; font-size: 22px;">Order Confirmed! 🎉</h2>
          <p style="color: #475569; font-size: 16px; line-height: 1.6;">
            Hi <strong>${userName}</strong>,<br/>
            Thank you for ordering from Bindi's Cupcakery! We have received your order and our kitchen is already preparing your fresh artisanal bakes with love.
          </p>

          <!-- Order Badge -->
          <div style="background-color: #f8fafc; border-left: 4px solid #ec4899; padding: 16px; border-radius: 8px; margin: 24px 0;">
            <p style="margin: 0; font-size: 14px; color: #64748b; text-transform: uppercase; font-weight: bold;">Order Reference</p>
            <p style="margin: 4px 0 0 0; font-size: 18px; font-family: monospace; font-weight: bold; color: #1e293b;">#${orderId}</p>
            <p style="margin: 8px 0 0 0; font-size: 14px; color: #10b981; font-weight: 600;">🔒 Payment Method: ${paymentMethod}</p>
          </div>

          <!-- Items Table -->
          <h3 style="color: #1e293b; font-size: 18px; margin-bottom: 12px;">Order Summary</h3>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
            <thead>
              <tr style="background-color: #f1f5f9; text-align: left;">
                <th style="padding: 10px; color: #475569; font-size: 14px;">Item</th>
                <th style="padding: 10px; color: #475569; font-size: 14px; text-align: center;">Qty</th>
                <th style="padding: 10px; color: #475569; font-size: 14px; text-align: right;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="2" style="padding: 16px 10px 0 10px; font-weight: bold; color: #0f172a; text-align: right; font-size: 18px;">Total Amount Paid:</td>
                <td style="padding: 16px 10px 0 10px; font-weight: 900; color: #ec4899; text-align: right; font-size: 20px;">₹${total}</td>
              </tr>
            </tfoot>
          </table>

          <!-- Delivery Info -->
          <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; padding: 16px; border-radius: 12px; margin-bottom: 24px;">
            <p style="margin: 0; font-size: 14px; color: #166534; font-weight: bold;">📍 Delivery Details:</p>
            <p style="margin: 4px 0 0 0; font-size: 14px; color: #15803d; white-space: pre-line;">${deliveryAddress}</p>
          </div>

          <p style="color: #64748b; font-size: 14px; text-align: center; margin-bottom: 0;">
            Need help or custom dietary requests? Reply directly to this email or chat with us on WhatsApp! 💕
          </p>
        </div>

        <!-- Footer -->
        <div style="background-color: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0; color: #94a3b8; font-size: 12px;">
          <p style="margin: 0;">© 2026 Bindi's Cupcakery. All rights reserved.</p>
          <p style="margin: 4px 0 0 0;">Freshly baked in Surat with artisanal love & care.</p>
        </div>
      </div>
    `;

    if (!transporter) {
      // Simulate email delivery in console if SMTP info is not set in .env
      console.log('========================================================================');
      console.log(`📧 [SIMULATED EMAIL SERVICE] Order Confirmation Sent to: ${userEmail}`);
      console.log(`🏷️  Subject: Order Confirmed! #${orderId} - Bindi's Cupcakery`);
      console.log(`💰 Total: ₹${total} | Payment: ${paymentMethod}`);
      console.log('💡 Tip: To send live emails, set EMAIL_USER and EMAIL_PASS in backend/.env');
      console.log('========================================================================');
      return true;
    }

    const info = await transporter.sendMail({
      from: `"Bindi's Cupcakery" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: `Order Confirmed! #${orderId.slice(-6).toUpperCase()} - Bindi's Cupcakery 🧁`,
      html: htmlContent,
    });

    console.log(`📧 Live email sent to ${userEmail}: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error('❌ Error sending order confirmation email:', error);
    return false;
  }
};

/**
 * Send automated alert email to the admin when a new order is placed
 */
export const sendAdminNewOrderEmail = async (
  adminEmail: string,
  orderId: string,
  customerName: string,
  customerPhone: string,
  total: number,
  paymentMethod: string
) => {
  try {
    const transporter = createTransporter();
    if (!transporter) {
      console.log(`👑 [SIMULATED ADMIN ALERT] New Order #${orderId} by ${customerName} (₹${total}) via ${paymentMethod}`);
      return true;
    }

    await transporter.sendMail({
      from: `"Bindi's Cupcakery Bot" <${process.env.EMAIL_USER}>`,
      to: adminEmail || 'omchauhan092005@gmail.com',
      subject: `🚨 NEW ORDER ALERT! #${orderId.slice(-6).toUpperCase()} - ₹${total} (${paymentMethod})`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 2px solid #ec4899; border-radius: 12px;">
          <h2 style="color: #ec4899;">🚨 New Order Received!</h2>
          <p><strong>Customer:</strong> ${customerName} (${customerPhone})</p>
          <p><strong>Order ID:</strong> #${orderId}</p>
          <p><strong>Total Amount:</strong> ₹${total}</p>
          <p><strong>Payment Method:</strong> ${paymentMethod}</p>
          <p>Go to <a href="http://localhost:5173/admin">Admin Dashboard</a> to manage kitchen status!</p>
        </div>
      `,
    });
    return true;
  } catch (err) {
    console.error('❌ Error sending admin alert email:', err);
    return false;
  }
};
