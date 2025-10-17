import { Resend } from 'resend';

// Define email data interface
interface EmailData {
  name: string;
  email: string;
  subject: string;
  message: string;
}



// Send email function
export const sendContactEmail = async (emailData: EmailData): Promise<void> => {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn('Resend API key not configured; skipping email send. Set RESEND_API_KEY to enable emails.');
    return;
  }

  try {
    const resend = new Resend(apiKey);
    const from = process.env.RESEND_FROM || process.env.SMTP_FROM || process.env.SMTP_USER;
    const to = process.env.CONTACT_RECEIVER_EMAIL || process.env.SMTP_USER;
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
        <p style="color: #666; margin-top: 20px;">
          This message was sent from your portfolio contact form.
        </p>
      </div>
    `;

    const resp = await resend.emails.send({
      from: from as string,
      to: to as string,
      subject,
      html,
    });

    console.log('✅ Email sent via Resend', resp);
  } catch (error) {
    console.error('❌ Error sending email via Resend:', error);
    throw new Error('Failed to send email');
  }
};