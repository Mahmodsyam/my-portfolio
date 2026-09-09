import express from 'express';
import { requireAdmin } from '../middleware/authMiddleware.js';
import { login, logout, getMe, getSettings, updateSettings } from '../controllers/adminController.js';
import { getContactMessages, markContactMessageRead, deleteContactMessage } from '../controllers/contactController.js';
import rateLimit from 'express-rate-limit';

const router = express.Router();

const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 10, message: { success: false, error: 'Too many login attempts.' } });

router.post('/login', loginLimiter, login);
router.post('/logout', requireAdmin, logout);
router.get('/me', requireAdmin, getMe);
router.get('/settings', requireAdmin, getSettings);
router.put('/settings', requireAdmin, updateSettings);

// Contact messages management
router.get('/messages', requireAdmin, getContactMessages);
router.put('/messages/:id/read', requireAdmin, markContactMessageRead);
router.delete('/messages/:id', requireAdmin, deleteContactMessage);

export default router;
