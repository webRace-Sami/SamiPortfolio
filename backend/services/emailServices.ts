import nodemailer from 'nodemailer';

// Define email data interface
interface EmailData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

function createTransport() {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587;
  const secure = process.env.SMTP_SECURE === 'true';

  if (!host || !user || !pass) {
    console.warn('SMTP not configured; emails will be skipped. Set SMTP_HOST/SMTP_USER/SMTP_PASS to enable email sending.');
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass,
    },
  });
}

export const sendContactEmail = async (emailData: EmailData): Promise<void> => {
  const transporter = createTransport();
  if (!transporter) return; // no-op when SMTP not configured

  const from = process.env.SMTP_FROM || process.env.SMTP_USER;
  const to = process.env.CONTACT_RECEIVER_EMAIL || process.env.SMTP_USER;
  const subject = `Portfolio Contact: ${emailData.subject || '(no subject)'}`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">New Contact Form Submission</h2>
      <div style="background: #f9f9f9; padding: 20px; border-radius: 5px;">
        <p><strong>Name:</strong> ${emailData.name}</p>
        <p><strong>Email:</strong> ${emailData.email}</p>
        <p><strong>Subject:</strong> ${emailData.subject}</p>
        <p><strong>Message:</strong></p>
        <div style="background: white; padding: 15px; border-left: 4px solid #007bff;">
          ${emailData.message.replace(/\n/g, '<br/>')}
        </div>
      </div>
      <p style="color: #666; margin-top: 20px;">This message was sent from your portfolio contact form.</p>
    </div>
  `;

  try {
    const info = await transporter.sendMail({
      from: from as string,
      to: to as string,
      subject,
      html,
    });
    console.log('✅ Email sent:', info.messageId || info);
  } catch (err) {
    console.error('❌ Error sending email via SMTP:', err);
    // don't throw — we want contact saving to continue even if mail fails
  }
};