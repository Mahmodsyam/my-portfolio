import { query } from '../config/db.js';

export const logAction = async (adminId, action, requestId = null, details = null, ipAddress = null) => {
  try {
    await query(
      'INSERT INTO audit_logs (admin_id, action, request_id, details, ip_address) VALUES (?, ?, ?, ?, ?)',
      [adminId, action, requestId, details, ipAddress]
    );
  } catch (error) {
    console.error('[AUDIT LOG ERROR]', error.message);
  }
};
