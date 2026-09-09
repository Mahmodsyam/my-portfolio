import { query } from '../config/db.js';

export const getStats = async (req, res) => {
  try {
    const statusCounts = await query('SELECT status, COUNT(*) as count FROM project_requests GROUP BY status');
    
    const stats = {
      total: 0,
      new: 0,
      reviewing: 0,
      contacted: 0,
      in_progress: 0,
      completed: 0,
      rejected: 0,
      archived: 0
    };

    statusCounts.forEach(row => {
      stats[row.status] = row.count;
      stats.total += row.count;
    });

    return res.status(200).json({ success: true, data: stats });
  } catch (error) {
    console.error('[GET STATS ERROR]', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

export const getCharts = async (req, res) => {
  try {
    const requestsOverTime = await query(`
      SELECT YEAR(created_at) as year, MONTH(created_at) as month, COUNT(*) as count 
      FROM project_requests 
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
      GROUP BY YEAR(created_at), MONTH(created_at)
      ORDER BY year ASC, month ASC
    `);

    const byType = await query('SELECT project_type, COUNT(*) as count FROM project_requests GROUP BY project_type');
    const byStatus = await query('SELECT status, COUNT(*) as count FROM project_requests GROUP BY status');
    const byBudget = await query('SELECT budget, COUNT(*) as count FROM project_requests GROUP BY budget');

    return res.status(200).json({ 
      success: true, 
      data: { requestsOverTime, byType, byStatus, byBudget } 
    });
  } catch (error) {
    console.error('[GET CHARTS ERROR]', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

export const getClients = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    let baseSql = `FROM clients c`;
    const params = [];

    if (req.query.search) {
      baseSql += ` WHERE c.full_name LIKE ? OR c.email LIKE ? OR c.phone LIKE ?`;
      const searchTerm = '%' + req.query.search + '%';
      params.push(searchTerm, searchTerm, searchTerm);
    }

    const [{ total }] = await query(`SELECT COUNT(*) as total ${baseSql}`, params);

    const clientsSql = `
      SELECT c.*, 
        COUNT(pr.id) as request_count, 
        MAX(pr.created_at) as last_request 
      ${baseSql} 
      LEFT JOIN project_requests pr ON c.id = pr.client_id 
      GROUP BY c.id 
      ORDER BY last_request DESC 
      LIMIT ${Number(limit)} OFFSET ${Number(offset)}
    `;

    const clients = await query(clientsSql, params);

    return res.status(200).json({ 
      success: true, 
      data: { 
        clients, 
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } 
      } 
    });
  } catch (error) {
    console.error('[GET CLIENTS ERROR]', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

export const getNotifications = async (req, res) => {
  try {
    const notifications = await query(`
      SELECT pr.id, pr.reference_number, pr.project_name, pr.created_at, c.full_name 
      FROM project_requests pr 
      JOIN clients c ON pr.client_id = c.id 
      WHERE pr.is_read = 0 
      ORDER BY pr.created_at DESC 
      LIMIT 20
    `);

    return res.status(200).json({ success: true, data: notifications });
  } catch (error) {
    console.error('[GET NOTIFICATIONS ERROR]', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

export const markNotificationRead = async (req, res) => {
  try {
    const { id } = req.params;
    await query('UPDATE project_requests SET is_read = 1 WHERE id = ?', [id]);
    return res.status(200).json({ success: true, message: 'Notification marked as read' });
  } catch (error) {
    console.error('[MARK READ ERROR]', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

export const getAuditLog = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const offset = (page - 1) * limit;

    const [{ total }] = await query('SELECT COUNT(*) as total FROM audit_logs');
    
    const logs = await query(`
      SELECT al.*, a.display_name as admin_name 
      FROM audit_logs al 
      LEFT JOIN admins a ON al.admin_id = a.id 
      ORDER BY al.created_at DESC 
      LIMIT ${Number(limit)} OFFSET ${Number(offset)}
    `);

    return res.status(200).json({ 
      success: true, 
      data: { 
        logs, 
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } 
      } 
    });
  } catch (error) {
    console.error('[GET AUDIT LOG ERROR]', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
};
