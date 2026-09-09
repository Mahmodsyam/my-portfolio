import nodemailer from 'nodemailer';
import { query } from '../config/db.js';

export const handleContactSubmit = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Validation
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid name (at least 2 characters).'
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email.trim())) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid email address.'
      });
    }

    if (!subject || typeof subject !== 'string' || subject.trim().length < 2) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a subject for your message.'
      });
    }

    if (!message || typeof message !== 'string' || message.trim().length < 5) {
      return res.status(400).json({
        success: false,
        error: 'Please enter a message with at least 5 characters.'
      });
    }

    const sanitizedData = {
      name: name.trim().slice(0, 100),
      email: email.trim().toLowerCase().slice(0, 100),
      subject: subject.trim().slice(0, 150),
      message: message.trim().slice(0, 5000),
      timestamp: new Date().toISOString()
    };

    console.log(`[CONTACT RECEIVED] From: ${sanitizedData.name} <${sanitizedData.email}> | Subject: "${sanitizedData.subject}"`);

    // 1. Save directly to MySQL database
    let messageId = null;
    try {
      const insertResult = await query(
        'INSERT INTO contact_messages (name, email, subject, message) VALUES (?, ?, ?, ?)',
        [sanitizedData.name, sanitizedData.email, sanitizedData.subject, sanitizedData.message]
      );
      messageId = insertResult.insertId;
      console.log(`[CONTACT SAVED TO DB] ID: ${messageId}`);
    } catch (dbErr) {
      console.error('[CONTACT DB SAVE ERROR]', dbErr);
    }

    // 2. Optional: Send Email via SMTP if configured
    const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, CONTACT_EMAIL } = process.env;

    if (SMTP_HOST && SMTP_USER && SMTP_PASSWORD) {
      try {
        const transporter = nodemailer.createTransport({
          host: SMTP_HOST,
          port: parseInt(SMTP_PORT, 10) || 587,
          secure: process.env.SMTP_SECURE === 'true',
          auth: {
            user: SMTP_USER,
            pass: SMTP_PASSWORD
          }
        });

        await transporter.sendMail({
          from: `"${sanitizedData.name}" <${SMTP_USER}>`,
          replyTo: sanitizedData.email,
          to: CONTACT_EMAIL || SMTP_USER,
          subject: `[Portfolio 3D Contact] ${sanitizedData.subject}`,
          text: `New contact submission from portfolio:\n\nName: ${sanitizedData.name}\nEmail: ${sanitizedData.email}\nSubject: ${sanitizedData.subject}\nTimestamp: ${sanitizedData.timestamp}\n\nMessage:\n${sanitizedData.message}`,
          html: `
            <div style="font-family: Arial, sans-serif; background: #0b0f19; color: #f3f4f6; padding: 24px; border-radius: 12px;">
              <h2 style="color: #38bdf8; border-bottom: 1px solid #1e293b; padding-bottom: 12px;">New 3D Portfolio Contact Message</h2>
              <p><strong>From:</strong> ${sanitizedData.name} &lt;<a href="mailto:${sanitizedData.email}" style="color: #38bdf8;">${sanitizedData.email}</a>&gt;</p>
              <p><strong>Subject:</strong> ${sanitizedData.subject}</p>
              <p><strong>Timestamp:</strong> ${sanitizedData.timestamp}</p>
              <div style="background: #111827; padding: 16px; border-left: 4px solid #38bdf8; margin-top: 16px; border-radius: 6px;">
                <p style="white-space: pre-wrap; margin: 0; line-height: 1.6;">${sanitizedData.message}</p>
              </div>
            </div>
          `
        });
      } catch (mailErr) {
        console.error('[CONTACT EMAIL ERROR]', mailErr);
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Thank you! Your message has been received and recorded successfully.',
      data: {
        id: messageId,
        timestamp: sanitizedData.timestamp
      }
    });
  } catch (error) {
    console.error('[CONTACT ERROR]', error);
    return res.status(500).json({
      success: false,
      error: 'An error occurred while dispatching your message. Please try again.'
    });
  }
};

// Admin endpoints for contact messages
export const getContactMessages = async (req, res) => {
  try {
    const messages = await query('SELECT * FROM contact_messages ORDER BY created_at DESC');
    return res.status(200).json({ success: true, data: messages });
  } catch (error) {
    console.error('[GET CONTACT MESSAGES ERROR]', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

export const markContactMessageRead = async (req, res) => {
  try {
    const { id } = req.params;
    await query('UPDATE contact_messages SET is_read = 1 WHERE id = ?', [id]);
    return res.status(200).json({ success: true, message: 'Message marked as read' });
  } catch (error) {
    console.error('[MARK MESSAGE READ ERROR]', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

export const deleteContactMessage = async (req, res) => {
  try {
    const { id } = req.params;
    await query('DELETE FROM contact_messages WHERE id = ?', [id]);
    return res.status(200).json({ success: true, message: 'Message deleted successfully' });
  } catch (error) {
    console.error('[DELETE MESSAGE ERROR]', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
};
