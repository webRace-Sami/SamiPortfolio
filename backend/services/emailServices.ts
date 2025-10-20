import { Resend } from 'resend';

// Define email data interface
interface EmailData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export const sendContactEmail = async (emailData: EmailData): Promise<any> => {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn('RESEND_API_KEY not set; skipping email send.');
    return null;
  }

  const resend = new Resend(apiKey);
  const fromAddr = process.env.RESEND_FROM || process.env.SMTP_FROM || process.env.SMTP_USER;
  const toAddr = process.env.CONTACT_RECEIVER_EMAIL || process.env.SMTP_USER;

  const subject = `Portfolio Contact: ${emailData.subject}`;
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
    const resp = await resend.emails.send({
      from: fromAddr as string,
      to: toAddr as string,
      subject,
      html,
      text: `${emailData.message}\n\nFrom: ${emailData.name} <${emailData.email}>`,
  replyTo: `${emailData.name} <${emailData.email}>`,
    });
    console.log('✅ Email sent via Resend', resp);
    return resp;
  } catch (err) {
    console.error('❌ Resend send error:', err);
    return { error: String(err) };
  }
};