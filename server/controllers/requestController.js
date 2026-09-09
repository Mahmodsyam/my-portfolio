import { query } from '../config/db.js';
import { logAction } from '../services/auditService.js';
import { sendAdminNotification, sendClientConfirmation } from '../services/emailService.js';
import path from 'path';

export const submitRequest = async (req, res) => {
  try {
    let { full_name, email, phone, country, project_name, project_type, description, budget, deadline, additional_requirements } = req.body;
    
    // Validate required
    if (!full_name || !email || !project_type || !description) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    // Validate email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ success: false, error: 'Invalid email format' });
    }

    // Sanitize lengths
    full_name = full_name.trim().substring(0, 200);
    email = email.trim().substring(0, 255);
    phone = phone ? phone.trim().substring(0, 50) : null;
    country = country ? country.trim().substring(0, 100) : null;
    project_name = project_name ? project_name.trim().substring(0, 255) : null;
    description = description.trim().substring(0, 10000);
    additional_requirements = additional_requirements ? additional_requirements.trim().substring(0, 5000) : null;

    // Find or create client
    let clients = await query('SELECT id FROM clients WHERE email = ?', [email]);
    let clientId;
    
    if (clients.length > 0) {
      clientId = clients[0].id;
      await query(
        'UPDATE clients SET full_name = ?, phone = ?, country = ? WHERE id = ?',
        [full_name, phone, country, clientId]
      );
    } else {
      const clientResult = await query(
        'INSERT INTO clients (full_name, email, phone, country) VALUES (?, ?, ?, ?)',
        [full_name, email, phone, country]
      );
      clientId = clientResult.insertId;
    }

    // Generate unique ref
    const referenceNumber = 'MJ-' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substring(2, 5).toUpperCase();

    // Insert request
    const requestResult = await query(
      `INSERT INTO project_requests 
      (reference_number, client_id, project_name, project_type, description, budget, deadline, additional_requirements) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [referenceNumber, clientId, project_name, project_type, description, budget || 'not_sure', deadline || 'flexible', additional_requirements]
    );
    
    const requestId = requestResult.insertId;

    // Handle files
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        await query(
          'INSERT INTO request_attachments (request_id, original_name, stored_name, mime_type, file_size, file_path) VALUES (?, ?, ?, ?, ?, ?)',
          [requestId, file.originalname, file.filename, file.mimetype, file.size, file.path]
        );
      }
    }

    // Send emails async
    const requestData = { full_name, email, project_name, project_type, budget, deadline, description, reference_number: referenceNumber };
    sendAdminNotification(requestData).catch(console.error);
    sendClientConfirmation(requestData).catch(console.error);

    return res.status(201).json({ 
      success: true, 
      data: { referenceNumber, message: 'Request submitted successfully' } 
    });
  } catch (error) {
    console.error('[SUBMIT REQUEST ERROR]', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

export const getRequests = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
    const offset = (page - 1) * limit;

    let whereSql = ' WHERE 1=1';
    const params = [];

    if (req.query.search) {
      whereSql += ` AND (c.full_name LIKE ? OR c.email LIKE ? OR c.phone LIKE ? OR pr.project_name LIKE ? OR pr.reference_number LIKE ?)`;
      const searchTerm = `%${req.query.search}%`;
      params.push(searchTerm, searchTerm, searchTerm, searchTerm, searchTerm);
    }

    if (req.query.status) {
      whereSql += ` AND pr.status = ?`;
      params.push(req.query.status);
    }

    if (req.query.priority) {
      whereSql += ` AND pr.priority = ?`;
      params.push(req.query.priority);
    }

    if (req.query.project_type) {
      whereSql += ` AND pr.project_type = ?`;
      params.push(req.query.project_type);
    }

    if (req.query.budget) {
      whereSql += ` AND pr.budget = ?`;
      params.push(req.query.budget);
    }

    if (req.query.startDate && req.query.endDate) {
      whereSql += ` AND pr.created_at BETWEEN ? AND ?`;
      params.push(req.query.startDate, req.query.endDate);
    }

    const baseSql = `FROM project_requests pr JOIN clients c ON pr.client_id = c.id ${whereSql}`;

    const countResult = await query(`SELECT COUNT(pr.id) as total ${baseSql}`, params);
    const total = countResult[0].total;

    let orderBy = 'pr.created_at DESC';
    if (req.query.sort === 'oldest') orderBy = 'pr.created_at ASC';
    else if (req.query.sort === 'priority') orderBy = "FIELD(pr.priority, 'urgent', 'high', 'normal', 'low')";
    else if (req.query.sort === 'status') orderBy = 'pr.status ASC';
    else if (req.query.sort === 'name') orderBy = 'c.full_name ASC';

    const selectSql = `SELECT pr.*, c.full_name, c.email, c.phone, c.country ${baseSql} ORDER BY ${orderBy} LIMIT ${limit} OFFSET ${offset}`;

const formatRequest = (r) => {
  if (!r) return r;
  return {
    ...r,
    clientName: r.full_name || r.clientName || '',
    clientEmail: r.email || r.clientEmail || '',
    clientPhone: r.phone || r.clientPhone || '',
    clientLocation: r.country || r.clientLocation || '',
    projectName: r.project_name || r.projectName || '',
    projectType: r.project_type || r.projectType || '',
    referenceNumber: r.reference_number || r.referenceNumber || '',
    createdAt: r.created_at || r.createdAt || new Date().toISOString(),
    updatedAt: r.updated_at || r.updatedAt || new Date().toISOString(),
    additionalRequirements: r.additional_requirements || r.additionalRequirements || '',
  };
};

    const requests = await query(selectSql, params);

    return res.status(200).json({
      success: true,
      data: {
        requests: requests.map(formatRequest),
        total,
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
      }
    });
  } catch (error) {
    console.error('[GET REQUESTS ERROR]', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

export const getRequest = async (req, res) => {
  try {
    const { id } = req.params;
    
    const requests = await query(
      `SELECT pr.*, c.full_name, c.email, c.phone, c.country 
       FROM project_requests pr 
       JOIN clients c ON pr.client_id = c.id 
       WHERE pr.id = ?`,
      [id]
    );

    if (requests.length === 0) {
      return res.status(404).json({ success: false, error: 'Request not found' });
    }

    const request = formatRequest(requests[0]);
    const attachments = await query('SELECT * FROM request_attachments WHERE request_id = ?', [id]);
    request.attachments = attachments;

    return res.status(200).json({ success: true, data: request });
  } catch (error) {
    console.error('[GET REQUEST ERROR]', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

export const updateRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { project_name, project_type, description, budget, deadline, additional_requirements, status, priority } = req.body;
    
    const [existing] = await query('SELECT status, priority FROM project_requests WHERE id = ?', [id]);
    
    if (!existing) {
      return res.status(404).json({ success: false, error: 'Request not found' });
    }

    await query(
      `UPDATE project_requests SET 
       project_name = ?, project_type = ?, description = ?, budget = ?, deadline = ?, additional_requirements = ?, status = ?, priority = ? 
       WHERE id = ?`,
      [project_name, project_type, description, budget, deadline, additional_requirements, status, priority, id]
    );

    if (existing.status !== status) {
      await logAction(req.session.adminId, 'STATUS_CHANGE', id, `Status changed from ${existing.status} to ${status}`, req.ip);
    }
    
    if (existing.priority !== priority) {
      await logAction(req.session.adminId, 'PRIORITY_CHANGE', id, `Priority changed from ${existing.priority} to ${priority}`, req.ip);
    }

    return res.status(200).json({ success: true, message: 'Request updated successfully' });
  } catch (error) {
    console.error('[UPDATE REQUEST ERROR]', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

export const deleteRequest = async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await query('DELETE FROM project_requests WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, error: 'Request not found' });
    }

    await logAction(req.session.adminId, 'DELETE', id, 'Deleted request', req.ip);

    return res.status(200).json({ success: true, message: 'Request deleted successfully' });
  } catch (error) {
    console.error('[DELETE REQUEST ERROR]', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

export const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const allowedStatuses = ['new','reviewing','contacted','in_progress','completed','rejected','archived'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ success: false, error: 'Invalid status' });
    }

    const [existing] = await query('SELECT status FROM project_requests WHERE id = ?', [id]);
    if (!existing) return res.status(404).json({ success: false, error: 'Request not found' });

    await query('UPDATE project_requests SET status = ? WHERE id = ?', [status, id]);
    await logAction(req.session.adminId, 'STATUS_CHANGE', id, `Status changed from ${existing.status} to ${status}`, req.ip);

    return res.status(200).json({ success: true, message: 'Status updated' });
  } catch (error) {
    console.error('[UPDATE STATUS ERROR]', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

export const updatePriority = async (req, res) => {
  try {
    const { id } = req.params;
    const { priority } = req.body;
    
    const allowedPriorities = ['low','normal','high','urgent'];
    if (!allowedPriorities.includes(priority)) {
      return res.status(400).json({ success: false, error: 'Invalid priority' });
    }

    const [existing] = await query('SELECT priority FROM project_requests WHERE id = ?', [id]);
    if (!existing) return res.status(404).json({ success: false, error: 'Request not found' });

    await query('UPDATE project_requests SET priority = ? WHERE id = ?', [priority, id]);
    await logAction(req.session.adminId, 'PRIORITY_CHANGE', id, `Priority changed from ${existing.priority} to ${priority}`, req.ip);

    return res.status(200).json({ success: true, message: 'Priority updated' });
  } catch (error) {
    console.error('[UPDATE PRIORITY ERROR]', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

export const addNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { note } = req.body;
    
    if (!note) return res.status(400).json({ success: false, error: 'Note is required' });

    await query('INSERT INTO request_notes (request_id, admin_id, note) VALUES (?, ?, ?)', [id, req.session.adminId, note]);
    await logAction(req.session.adminId, 'NOTE_ADDED', id, 'Added internal note', req.ip);

    return res.status(201).json({ success: true, message: 'Note added successfully' });
  } catch (error) {
    console.error('[ADD NOTE ERROR]', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

export const getNotes = async (req, res) => {
  try {
    const { id } = req.params;
    const notes = await query(
      `SELECT n.*, a.display_name 
       FROM request_notes n 
       JOIN admins a ON n.admin_id = a.id 
       WHERE n.request_id = ? 
       ORDER BY n.created_at DESC`,
      [id]
    );

    return res.status(200).json({ success: true, data: notes });
  } catch (error) {
    console.error('[GET NOTES ERROR]', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

export const trackRequest = async (req, res) => {
  try {
    const { ref } = req.params;
    const { email } = req.query;
    
    if (!email) return res.status(400).json({ success: false, error: 'Email is required for verification' });

    const requests = await query(
      `SELECT pr.reference_number, pr.project_name, pr.project_type, pr.status, pr.created_at, pr.updated_at, c.email 
       FROM project_requests pr 
       JOIN clients c ON pr.client_id = c.id 
       WHERE pr.reference_number = ?`,
      [ref]
    );

    if (requests.length === 0) {
      return res.status(404).json({ success: false, error: 'Request not found' });
    }

    const request = requests[0];
    if (request.email !== email) {
      return res.status(403).json({ success: false, error: 'Email does not match our records' });
    }

    const { email: _email, ...publicData } = request;
    return res.status(200).json({ success: true, data: publicData });
  } catch (error) {
    console.error('[TRACK REQUEST ERROR]', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
};
