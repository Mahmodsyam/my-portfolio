import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const createTransporter = () => {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    return null;
  }
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
};

export const sendAdminNotification = async (requestData) => {
  try {
    const transporter = createTransporter();
    if (!transporter) return;

    const { full_name, email, project_name, project_type, budget, deadline, description, reference_number } = requestData;
    const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_USER;

    const mailOptions = {
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: adminEmail,
      subject: `New Project Request: ${reference_number}`,
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #1a1a1a; color: #fff; padding: 20px;">
          <h2 style="color: #4CAF50;">New Project Request Received</h2>
          <p><strong>Reference:</strong> ${reference_number}</p>
          <p><strong>Client:</strong> ${full_name} (${email})</p>
          <p><strong>Project:</strong> ${project_name || 'N/A'}</p>
          <p><strong>Type:</strong> ${project_type}</p>
          <p><strong>Budget:</strong> ${budget}</p>
          <p><strong>Deadline:</strong> ${deadline}</p>
          <p><strong>Description:</strong> ${description.substring(0, 500)}${description.length > 500 ? '...' : ''}</p>
          <a href="${process.env.ADMIN_URL}/dashboard" style="display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: #fff; text-decoration: none; border-radius: 5px; margin-top: 20px;">View in Dashboard</a>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('[EMAIL ERROR] Failed to send admin notification:', error.message);
  }
};

export const sendClientConfirmation = async (requestData, language = 'en') => {
  try {
    const transporter = createTransporter();
    if (!transporter) return;

    const { email, full_name, reference_number } = requestData;

    let subject, html;
    
    if (language === 'ar') {
      subject = 'تم استلام طلب المشروع الخاص بك';
      html = `
        <div dir="rtl" style="font-family: Arial, sans-serif; background-color: #1a1a1a; color: #fff; padding: 20px; text-align: right;">
          <h2 style="color: #4CAF50;">مرحباً ${full_name}</h2>
          <p>لقد تلقينا طلب المشروع الخاص بك بنجاح.</p>
          <p><strong>رقم المرجع الخاص بك:</strong> ${reference_number}</p>
          <p>سنقوم بمراجعة طلبك والتواصل معك قريباً.</p>
          <p>شكراً لثقتك بنا.</p>
        </div>
      `;
    } else {
      subject = 'Your Project Request has been received';
      html = `
        <div style="font-family: Arial, sans-serif; background-color: #1a1a1a; color: #fff; padding: 20px;">
          <h2 style="color: #4CAF50;">Hello ${full_name}</h2>
          <p>We have successfully received your project request.</p>
          <p><strong>Your Reference Number:</strong> ${reference_number}</p>
          <p>We will review your request and get back to you shortly.</p>
          <p>Thank you for choosing us.</p>
        </div>
      `;
    }

    const mailOptions = {
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: email,
      subject,
      html
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('[EMAIL ERROR] Failed to send client confirmation:', error.message);
  }
};
