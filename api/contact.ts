import type { VercelRequest, VercelResponse } from '@vercel/node'
import mongoose from 'mongoose'
import nodemailer from 'nodemailer'

// Simple Mongoose model
const ContactSchema = new mongoose.Schema({
  name: String,
  email: String,
  subject: String,
  message: String,
  date: { type: Date, default: Date.now }
})

let Contact: mongoose.Model<any>

async function connectToMongo(uri?: string) {
  if (!uri) return
  if (mongoose.connection.readyState === 1) return
  await mongoose.connect(uri)
  Contact = mongoose.models.Contact || mongoose.model('Contact', ContactSchema)
}

async function sendMail(payload: { name: string; email: string; subject: string; message: string }) {
  const host = process.env.SMTP_HOST
  const port = Number(process.env.SMTP_PORT || 587)
  const secure = (process.env.SMTP_SECURE === 'true') || false

  const transporter = nodemailer.createTransport(
    host
      ? {
          host,
          port,
          secure,
          auth: process.env.SMTP_USER
            ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
            : undefined,
        }
      : { sendmail: true }
  )

  const to = process.env.CONTACT_RECEIVER_EMAIL || process.env.SMTP_USER

  if (!to) return { ok: false, info: 'No recipient configured' }

  const info = await transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to,
    subject: `[Portfolio Contact] ${payload.subject || 'New message'}`,
    text: `Name: ${payload.name}\nEmail: ${payload.email}\n\n${payload.message}`,
  })

  return { ok: true, info }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

    const { name, email, subject, message } = req.body || {}
    if (!name || !email || !message) return res.status(400).json({ error: 'Missing fields' })

    // Connect to MongoDB if URI provided
    await connectToMongo(process.env.MONGODB_URI)

    // Save to DB if connected
    if (mongoose.connection.readyState === 1) {
      Contact = mongoose.models.Contact || mongoose.model('Contact', ContactSchema)
      await Contact.create({ name, email, subject, message })
    }

    // Try sending email (if configured)
    let mailResult = { ok: false }
    try {
      mailResult = await sendMail({ name, email, subject, message })
    } catch (err) {
      // swallow mail errors but include them in response
      // eslint-disable-next-line no-console
      console.error('Mail error', err)
    }

    return res.status(200).json({ success: true, mail: mailResult })
  } catch (err: any) {
    // eslint-disable-next-line no-console
    console.error(err)
    return res.status(500).json({ error: err?.message || String(err) })
  }
}
