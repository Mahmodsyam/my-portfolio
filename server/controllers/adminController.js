import bcrypt from 'bcrypt';
import { query } from '../config/db.js';
import { logAction } from '../services/auditService.js';

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password are required.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const admins = await query('SELECT * FROM admins WHERE LOWER(email) = ?', [cleanEmail]);
    if (admins.length === 0) {
      return res.status(401).json({ success: false, error: 'Invalid email or password.' });
    }

    const admin = admins[0];
    const isMatch = await bcrypt.compare(password, admin.password_hash);
    
    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Invalid credentials.' });
    }

    req.session.adminId = admin.id;
    req.session.adminEmail = admin.email;

    await logAction(admin.id, 'LOGIN', null, 'Admin logged in', req.ip);

    const { password_hash, ...adminInfo } = admin;
    return res.status(200).json({ success: true, data: adminInfo });
  } catch (error) {
    console.error('[LOGIN ERROR]', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

export const logout = async (req, res) => {
  try {
    const adminId = req.session?.adminId;
    
    if (adminId) {
      await logAction(adminId, 'LOGOUT', null, 'Admin logged out', req.ip);
    }
    
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ success: false, error: 'Could not log out.' });
      }
      res.clearCookie('connect.sid'); // default session cookie name
      return res.status(200).json({ success: true, message: 'Logged out successfully.' });
    });
  } catch (error) {
    console.error('[LOGOUT ERROR]', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

export const getMe = async (req, res) => {
  try {
    const adminId = req.session.adminId;
    const admins = await query('SELECT id, email, display_name, created_at, updated_at FROM admins WHERE id = ?', [adminId]);
    
    if (admins.length === 0) {
      return res.status(404).json({ success: false, error: 'Admin not found.' });
    }

    return res.status(200).json({ success: true, data: admins[0] });
  } catch (error) {
    console.error('[GET ME ERROR]', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

export const getSettings = async (req, res) => {
  try {
    const settings = await query('SELECT setting_key, setting_value FROM admin_settings');
    const settingsObj = {};
    
    settings.forEach(setting => {
      settingsObj[setting.setting_key] = setting.setting_value;
    });

    return res.status(200).json({ success: true, data: settingsObj });
  } catch (error) {
    console.error('[GET SETTINGS ERROR]', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

export const updateSettings = async (req, res) => {
  try {
    const settings = req.body;
    
    if (!settings || typeof settings !== 'object') {
      return res.status(400).json({ success: false, error: 'Invalid settings format.' });
    }

    const adminId = req.session.adminId;
    const updates = [];
    
    for (const [key, value] of Object.entries(settings)) {
      await query(
        'INSERT INTO admin_settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = ?',
        [key, String(value), String(value)]
      );
      updates.push(key);
    }

    await logAction(adminId, 'UPDATE_SETTINGS', null, `Updated settings: ${updates.join(', ')}`, req.ip);

    return res.status(200).json({ success: true, message: 'Settings updated successfully.' });
  } catch (error) {
    console.error('[UPDATE SETTINGS ERROR]', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
};
