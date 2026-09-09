import express from 'express';
import { handleContactSubmit } from '../controllers/contactController.js';

const router = express.Router();

// Health Check
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    service: 'Mahmoud Jihad 3D Portfolio API',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Contact Submission
router.post('/contact', handleContactSubmit);

export default router;
