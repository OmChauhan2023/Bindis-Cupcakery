import nodemailer from 'nodemailer';
import dns from 'dns';

// Force Node to prioritize IPv4 over IPv6 when resolving SMTP servers to prevent ENETUNREACH on Render's network
if (typeof dns.setDefaultResultOrder === 'function') {
  dns.setDefaultResultOrder('ipv4first');
}

// Custom DNS lookup function that strictly enforces IPv4 (AF_INET) resolution
const customLookup = (hostname: string, options: any, callback: any) => {
  const cb = typeof options === 'function' ? options : callback;
  return dns.lookup(hostname, { family: 4 }, (err, address, family) => {
    cb(err, address, family);
  });
};

// Create nodemailer transporter using port 587 (STARTTLS), IPv4 family, and explicit timeouts to prevent cloud firewall blocks
const createTransporter = () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    return null;
  }
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: process.env.EMAIL_SECURE === 'true', // false for port 587 (STARTTLS)
    requireTLS: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
      lookup: customLookup,
    },
    socketOptions: {
      family: 4,
      lookup: customLookup,
    },
    family: 4, // Force IPv4 sockets (bypasses Render IPv6 network absence)
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 10000,
  } as any);
};

/**
 * Universal helper to send email via Brevo HTTPS REST API (Port 443) or fall back to Nodemailer SMTP
 */
const sendEmailHelper = async ({
  to,
  subject,
  html,
  replyTo,
}: {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}): Promise<boolean> => {
  const senderEmail = process.env.EMAIL_USER || 'bindiscupcakery@gmail.com';
  const senderName = "Bindi's Cupcakery Bot";

  // 1. Try Brevo HTTPS REST API first (Port 443 - zero firewall blocking on Render)
  if (process.env.BREVO_API_KEY) {
    try {
      const response = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'api-key': process.env.BREVO_API_KEY,
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          sender: { name: senderName, email: senderEmail },
          to: [{ email: to }],
          subject: subject,
          htmlContent: html,
          ...(replyTo ? { replyTo: { email: replyTo } } : {}),
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Brevo API Error (${response.status}): ${errorData}`);
      }

      const data: any = await response.json();
      console.log(`📧 [BREVO HTTPS API] Successfully sent email to ${to} (MessageID: ${data?.messageId || 'ok'})`);
      return true;
    } catch (apiErr: any) {
      console.error(`❌ [BREVO API FAILED]:`, apiErr.message || apiErr);
      // Fallback to Nodemailer if Brevo fails
    }
  }

  // 2. Fallback to Nodemailer SMTP
  const transporter = createTransporter();
  if (!transporter) {
    console.log(`👑 [SIMULATED EMAIL] To: ${to} | Subject: ${subject}`);
    return true;
  }

  try {
    const info = await transporter.sendMail({
      from: `"${senderName}" <${senderEmail}>`,
      to,
      subject,
      html,
      ...(replyTo ? { replyTo } : {}),
    });
    console.log(`📧 [NODEMAILER SMTP] Sent email to ${to}: ${info.messageId}`);
    return true;
  } catch (smtpErr: any) {
    console.error(`❌ [NODEMAILER SMTP FAILED]:`, smtpErr.message || smtpErr);
    return false;
  }
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
    
    const getFoodEmoji = (name: string) => {
      const lower = name.toLowerCase();
      if (lower.includes('brownie')) return '🍫';
      if (lower.includes('truffle')) return '🍬';
      if (lower.includes('cake') && !lower.includes('cup')) return '🎂';
      if (lower.includes('cookie') || lower.includes('biscoff')) return '🍪';
      if (lower.includes('box') || lower.includes('combo')) return '🎁';
      return '🧁';
    };

    const itemsHtml = items
      .map(
        (item) => `
        <tr>
          <td style="padding: 14px 12px; border-bottom: 1px solid #f1f5f9; color: #1e293b; font-weight: 700; font-size: 15px;">
            <span style="font-size: 18px; margin-right: 8px;">${getFoodEmoji(item.name)}</span> ${item.name}
          </td>
          <td style="padding: 14px 12px; border-bottom: 1px solid #f1f5f9; color: #64748b; text-align: center; font-weight: 600;">
            <span style="background: #f1f5f9; padding: 4px 10px; border-radius: 12px; font-size: 13px;">x${item.quantity}</span>
          </td>
          <td style="padding: 14px 12px; border-bottom: 1px solid #f1f5f9; color: #0f172a; font-weight: 800; text-align: right; font-size: 15px;">
            ₹${item.price * item.quantity}
          </td>
        </tr>
      `
      )
      .join('');

    const htmlContent = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 24px; overflow: hidden; border: 1px solid #f1f5f9; box-shadow: 0 20px 40px rgba(0,0,0,0.08);">
        
        <!-- Luxury Burgundy Velvet Header -->
        <div style="background: linear-gradient(135deg, #4c0519 0%, #831843 50%, #9d174d 100%); padding: 40px 24px; text-align: center; color: white; position: relative;">
          <div style="display: inline-block; background: rgba(255,255,255,0.15); padding: 6px 16px; border-radius: 50px; font-size: 12px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; margin-bottom: 12px; border: 1px solid rgba(255,255,255,0.25);">
            ✨ Surat's Premier Eggless Bakery
          </div>
          <h1 style="margin: 0; font-size: 32px; font-weight: 900; letter-spacing: -0.5px; color: #ffffff; text-shadow: 0 2px 4px rgba(0,0,0,0.2);">
            Bindi's Cupcakery
          </h1>
          <p style="margin: 8px 0 0 0; font-size: 15px; color: #fbcfe8; font-weight: 500;">
            Handcrafted with Artisanal Love & Premium Ingredients 🧁
          </p>
        </div>

        <!-- Celebratory Banner -->
        <div style="background: linear-gradient(90deg, #fdf2f8 0%, #fce7f3 100%); padding: 18px 24px; border-bottom: 1px solid #fbcfe8; text-align: center;">
          <p style="margin: 0; color: #9d174d; font-weight: 800; font-size: 16px;">
            🎉 Order Successfully Confirmed & Sent to Kitchen!
          </p>
        </div>

        <!-- Body Content -->
        <div style="padding: 36px 28px;">
          <h2 style="color: #0f172a; margin-top: 0; font-size: 22px; font-weight: 800;">
            Hello, ${userName}! 👋
          </h2>
          <p style="color: #475569; font-size: 15px; line-height: 1.6; margin-bottom: 24px;">
            Thank you for ordering from <strong>Bindi's Cupcakery</strong>! We have received your order and our master chefs in our Surat kitchen are already measuring out fresh cocoa, rich cream, and love to handcraft your treats! 💕
          </p>

          <!-- Status & Time Progress Card -->
          <div style="background: #f8fafc; border: 2px solid #e2e8f0; border-radius: 16px; padding: 20px; margin-bottom: 28px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; border-bottom: 1px solid #e2e8f0; padding-bottom: 12px;">
              <div>
                <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #64748b; font-weight: 700; display: block;">Order Number</span>
                <span style="font-size: 20px; font-family: monospace; font-weight: 900; color: #831843;">#${orderId.slice(-8).toUpperCase()}</span>
              </div>
              <div style="text-align: right;">
                <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #64748b; font-weight: 700; display: block;">Payment Status</span>
                <span style="background: #dcfce7; color: #166534; padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: 800; display: inline-block; margin-top: 2px;">
                  ✅ Paid (${paymentMethod})
                </span>
              </div>
            </div>

            <!-- Estimated Delivery Box -->
            <div style="background: #ffffff; border: 1px dashed #cbd5e1; border-radius: 12px; padding: 14px; text-align: center;">
              <p style="margin: 0; font-size: 14px; color: #334155; font-weight: 700;">
                ⏱️ Estimated Preparation & Delivery Time:
              </p>
              <p style="margin: 4px 0 0 0; font-size: 18px; color: #ec4899; font-weight: 900;">
                30 – 45 Minutes 🛵
              </p>
              <p style="margin: 4px 0 0 0; font-size: 12px; color: #64748b;">
                Freshly baked to order • Packed in temperature-controlled luxury boxes
              </p>
            </div>
          </div>

          <!-- Order Summary Table -->
          <h3 style="color: #0f172a; font-size: 18px; font-weight: 800; margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
            🛍️ Your Delicious Order Summary
          </h3>
          <div style="border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; margin-bottom: 28px;">
            <table style="width: 100%; border-collapse: collapse;">
              <thead>
                <tr style="background-color: #f8fafc; text-align: left; border-bottom: 2px solid #e2e8f0;">
                  <th style="padding: 12px; color: #475569; font-size: 13px; font-weight: 700; text-transform: uppercase;">Item Description</th>
                  <th style="padding: 12px; color: #475569; font-size: 13px; font-weight: 700; text-transform: uppercase; text-align: center;">Qty</th>
                  <th style="padding: 12px; color: #475569; font-size: 13px; font-weight: 700; text-transform: uppercase; text-align: right;">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
              <tfoot>
                <tr style="background-color: #fdf2f8;">
                  <td colspan="2" style="padding: 18px 12px; font-weight: 800; color: #831843; text-align: right; font-size: 16px;">
                    Grand Total Paid:
                  </td>
                  <td style="padding: 18px 12px; font-weight: 900; color: #be185d; text-align: right; font-size: 22px;">
                    ₹${total}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          <!-- Delivery Address Box -->
          <div style="background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); border: 1px solid #86efac; padding: 20px; border-radius: 16px; margin-bottom: 28px;">
            <div style="display: flex; align-items: flex-start; gap: 12px;">
              <span style="font-size: 24px;">📍</span>
              <div>
                <p style="margin: 0; font-size: 13px; color: #166534; text-transform: uppercase; font-weight: 800; letter-spacing: 0.5px;">
                  Delivery / Pickup Location
                </p>
                <p style="margin: 6px 0 0 0; font-size: 15px; color: #14532d; font-weight: 600; white-space: pre-line; line-height: 1.5;">
                  ${deliveryAddress}
                </p>
              </div>
            </div>
          </div>

          <!-- Customer Support Footer Box -->
          <div style="text-align: center; background: #f8fafc; padding: 20px; border-radius: 16px; border: 1px solid #e2e8f0;">
            <p style="margin: 0; font-size: 14px; color: #334155; font-weight: 700;">
              Have a custom dietary request or need delivery updates? 💬
            </p>
            <p style="margin: 6px 0 0 0; font-size: 13px; color: #64748b;">
              Our Surat kitchen team is here for you! You can simply reply to this official confirmation email or reach us on WhatsApp at <strong>+91 98765 43210</strong>.
            </p>
          </div>
        </div>

        <!-- Elegant Footer -->
        <div style="background-color: #0f172a; padding: 28px 20px; text-align: center; color: #94a3b8; font-size: 13px;">
          <p style="margin: 0; color: #ffffff; font-weight: 700; font-size: 15px;">🧁 Bindi's Cupcakery Surat</p>
          <p style="margin: 6px 0 12px 0; color: #cbd5e1; font-size: 12px;">Parle Point, Surat, Gujarat 395007 • 100% Eggless Artisanal Bakery</p>
          <div style="border-top: 1px solid #334155; padding-top: 14px; margin-top: 14px; color: #64748b; font-size: 11px;">
            <p style="margin: 0;">© 2026 Bindi's Cupcakery. All rights reserved. Made with ❤️ for sweet lovers.</p>
          </div>
        </div>
      </div>
    `;

    return await sendEmailHelper({
      to: userEmail,
      subject: `Order Confirmed! #${orderId.slice(-6).toUpperCase()} - Bindi's Cupcakery 🧁`,
      html: htmlContent,
    });
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
    return await sendEmailHelper({
      to: adminEmail || 'bindiscupcakery@gmail.com',
      subject: `🚨 NEW ORDER ALERT! #${orderId.slice(-6).toUpperCase()} - ₹${total} (${paymentMethod})`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 2px solid #ec4899; border-radius: 12px;">
          <h2 style="color: #ec4899;">🚨 New Order Received!</h2>
          <p><strong>Customer:</strong> ${customerName} (${customerPhone})</p>
          <p><strong>Order ID:</strong> #${orderId}</p>
          <p><strong>Total Amount:</strong> ₹${total}</p>
          <p><strong>Payment Method:</strong> ${paymentMethod}</p>
          <p>Go to <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/admin">Admin Dashboard</a> to manage kitchen status!</p>
        </div>
      `,
    });
  } catch (err) {
    console.error('❌ Error sending admin alert email:', err);
    return false;
  }
};

/**
 * Send contact form submission email to the admin
 */
export const sendContactMessageEmail = async (
  name: string,
  email: string,
  message: string
) => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'bindiscupcakery@gmail.com';
    return await sendEmailHelper({
      to: adminEmail,
      subject: `✉️ New Contact Message from ${name}`,
      replyTo: email,
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 2px solid #8b5cf6; border-radius: 12px;">
          <h2 style="color: #8b5cf6;">✉️ New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p style="margin-top: 15px; padding: 10px; background-color: #f3f4f6; border-radius: 6px; font-style: italic;">
            "${message}"
          </p>
        </div>
      `,
    });
  } catch (err) {
    console.error('❌ Error sending contact message email:', err);
    return false;
  }
};
