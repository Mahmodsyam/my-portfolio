import express from 'express';
import { requireAdmin } from '../middleware/authMiddleware.js';
import { getStats, getCharts, getClients, getNotifications, markNotificationRead, getAuditLog } from '../controllers/dashboardController.js';

const router = express.Router();

router.get('/stats', requireAdmin, getStats);
router.get('/charts', requireAdmin, getCharts);
router.get('/clients', requireAdmin, getClients);
router.get('/notifications', requireAdmin, getNotifications);
router.put('/notifications/:id/read', requireAdmin, markNotificationRead);
router.get('/audit-log', requireAdmin, getAuditLog);

export default router;
