import mongoose from 'mongoose'
import nodemailer from 'nodemailer'

// Simple Contact schema (local to function)
const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  subject: String,
  message: String,
  date: { type: Date, default: Date.now }
})

let Contact: mongoose.Model<any>

async function connectToMongo() {
  if (mongoose.connection.readyState === 1) return
  const uri = process.env.MONGODB_URI
  if (!uri) return
  await mongoose.connect(uri)
  Contact = mongoose.models.Contact || mongoose.model('Contact', contactSchema)
}

function createTransporter() {
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    })
  }
  // noop transporter
  return { sendMail: async () => ({ accepted: [], rejected: [] }) }
}

export default async function handler(req: any, res: any) {
  try {
    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Method Not Allowed' })
      return
    }

    const { name, email, subject, message } = req.body || {}
    if (!name || !email || !message) {
      res.status(400).json({ error: 'Missing required fields' })
      return
    }

    // Save to DB if configured
    try {
      await connectToMongo()
      if (Contact) {
        await Contact.create({ name, email, subject, message })
      }
    } catch (dbErr) {
      console.error('DB save error (non-fatal):', dbErr)
    }

    // Send notification email (best-effort)
    try {
      const transporter = createTransporter()
      const mailOptions = {
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: process.env.CONTACT_RECEIVER_EMAIL || process.env.SMTP_USER,
        subject: `Website Contact: ${subject || '(no subject)'}`,
        text: `Name: ${name}\nEmail: ${email}\n\n${message}`
      }
      // sendMail may not exist on noop transporter typings — ignore errors
      // @ts-ignore
      await transporter.sendMail(mailOptions)
    } catch (mailErr) {
      console.error('Mail send error (non-fatal):', mailErr)
    }

    res.status(200).json({ success: true })
  } catch (err) {
    console.error('Function error:', err)
    res.status(500).json({ error: 'Internal error' })
  }
}
