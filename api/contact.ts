import type { VercelRequest, VercelResponse } from '@vercel/node'
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
  if (!uri) throw new Error('MONGODB_URI not set')
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
  // Fallback to a no-op transporter that resolves
  return { sendMail: async () => ({ accepted: [], rejected: [] }) }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Method not allowed' })
      return
    }

    const { name, email, subject, message } = req.body
    if (!name || !email || !message) {
      res.status(400).json({ error: 'Missing fields' })
      return
    }

    await connectToMongo()
    await Contact.create({ name, email, subject, message })

    // Send email notification (best-effort)
    try {
      const transporter = createTransporter()
      const mailOptions = {
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: process.env.CONTACT_RECEIVER_EMAIL || process.env.SMTP_USER,
        subject: `Website contact: ${subject || '(no subject)'}`,
        text: `Name: ${name}\nEmail: ${email}\n\n${message}`
      }
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      await transporter.sendMail(mailOptions)
    } catch (mailErr) {
      // Log and continue — we already saved to DB
      console.error('Mail send error:', mailErr)
    }

    res.status(200).json({ success: true })
  } catch (err: any) {
    console.error('API error:', err)
    res.status(500).json({ error: err.message || 'Internal error' })
  }
}
