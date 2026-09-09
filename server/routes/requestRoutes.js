import express from 'express';
import { requireAdmin } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';
import { submitRequest, getRequests, getRequest, updateRequest, deleteRequest, updateStatus, updatePriority, addNote, getNotes, trackRequest } from '../controllers/requestController.js';
import rateLimit from 'express-rate-limit';

const router = express.Router();

const submitLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 5, message: { success: false, error: 'Too many submissions. Please try again later.' } });

router.post('/', submitLimiter, upload, submitRequest);
router.get('/track/:ref', trackRequest);
router.get('/', requireAdmin, getRequests);
router.get('/:id', requireAdmin, getRequest);
router.put('/:id', requireAdmin, updateRequest);
router.delete('/:id', requireAdmin, deleteRequest);
router.put('/:id/status', requireAdmin, updateStatus);
router.put('/:id/priority', requireAdmin, updatePriority);
router.post('/:id/notes', requireAdmin, addNote);
router.get('/:id/notes', requireAdmin, getNotes);

export default router;
