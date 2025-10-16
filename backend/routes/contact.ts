import express, { Request, Response } from "express";

// Dynamically import model and service so this file works in both ts-node and compiled JS
let Contact: any
let sendContactEmail: any
(async () => {
  try {
    const m = await import('../models/Contact.js')
    Contact = m.default || m
  } catch (_) {
    const m = await import('../models/Contact.ts')
    Contact = m.default || m
  }
  try {
    const s = await import('../services/emailServices.js')
    sendContactEmail = s.sendContactEmail || s.default || s
  } catch (_) {
    const s = await import('../services/emailServices.ts')
    sendContactEmail = s.sendContactEmail || s.default || s
  }
})();

const router = express.Router();

// POST - Handle contact form submission
router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, email, subject, message } = req.body;

    // Step 1: Validate required fields
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ 
        success: false, 
        message: 'All fields are required' 
      });
    }

    // Step 2: Save to database
    const newContact = new Contact({
      name,
      email,
      subject,
      message
    });

    await newContact.save();
    console.log('✅ Contact saved to database');

    // Step 3: Send email notification
    try {
      await sendContactEmail({ name, email, subject, message });
    } catch (emailError) {
      console.log('⚠️ Email not sent, but contact saved to database');
      // Don't fail the request if email fails
    }

    // Step 4: Send success response
    res.status(200).json({
      success: true,
      message: 'Message sent successfully!'
    });

  } catch (error) {
    console.error('❌ Error saving contact:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send message'
    });
  }
});

export default router;