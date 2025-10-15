import nodemailer from 'nodemailer';

// Define email data interface
interface EmailData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

// Create transporter using SMTP env vars (flexible for providers)
const createTransport = () => {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined;
  const secure = process.env.SMTP_SECURE === 'true';

  // If SMTP_HOST is set, use explicit host/port configuration
  if (host) {
    return nodemailer.createTransport({
      host,
      port: port || 587,
      secure: !!secure,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  // Fallback to Gmail service if no host provided (still requires credentials)
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

// Send email function
export const sendContactEmail = async (emailData: EmailData): Promise<void> => {
  try {
    const transporter = createTransport();

    // Email content
    const mailOptions = {
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: process.env.CONTACT_RECEIVER_EMAIL || process.env.SMTP_USER,
      subject: `Portfolio Contact: ${emailData.subject}`,
      html: `
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
          <p style="color: #666; margin-top: 20px;">
            This message was sent from your portfolio contact form.
          </p>
        </div>
      `,
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully', info.response || info);

  } catch (error) {
    console.error('❌ Error sending email:', error);
    throw new Error('Failed to send email');
  }
};