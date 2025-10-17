import mongoose from 'mongoose';
import Contact from '../backend/models/Contact.js';
import { sendContactEmail } from '../backend/services/emailServices.js';

async function connectToMongo() {
  if (mongoose.connection.readyState === 1) return;
  const uri = process.env.MONGODB_URI;
  if (!uri) return;
  await mongoose.connect(uri);
}

export default async function handler(req: any, res: any) {
  try {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

    const { name, email, subject, message } = req.body || {};
    if (!name || !email || !message) return res.status(400).json({ error: 'Missing required fields' });

    await connectToMongo();

    // Save to DB if connected
    try {
      if (mongoose.connection.readyState === 1) {
        await Contact.create({ name, email, subject, message });
      }
    } catch (dbErr) {
      console.error('DB save error (non-fatal):', dbErr);
    }

    // Send email (best-effort)
    try {
      await sendContactEmail({ name, email, subject, message });
    } catch (mailErr) {
      console.error('Mail send error (non-fatal):', mailErr);
    }

    res.status(200).json({ success: true });
  } catch (err) {
    console.error('Function error:', err);
    res.status(500).json({ error: 'Internal error' });
  }
}
