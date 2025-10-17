import express, { Request, Response } from "express";
import Contact from "../models/Contact.js";
import { sendContactEmail } from "../services/emailServices.js"; // Import email service

const router = express.Router();

// POST - Handle contact form submission
router.post('/', async (req: Request, res: Response) => {
  try {
    console.log('Incoming /api/contact payload:', req.body);
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

    // Step 3: Send email notification and include result in response
    const emailResult = await sendContactEmail({ name, email, subject, message });

    // Step 4: Send success response with email metadata
    res.status(200).json({
      success: true,
      message: 'Message sent successfully!',
      email: emailResult || null
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