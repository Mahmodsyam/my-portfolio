import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

async function seed() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'portfolio_requests'
  });

  const email = 'admin@portfolio.local';
  const [existing] = await connection.query('SELECT id FROM admins WHERE email = ?', [email]);
  
  if (existing.length === 0) {
    const passwordHash = await bcrypt.hash('Admin@123456', 12);
    await connection.query(
      'INSERT INTO admins (email, password_hash, display_name) VALUES (?, ?, ?)',
      [email, passwordHash, 'Mahmoud Siam']
    );
    console.log('[SUCCESS] Default Admin Created: admin@portfolio.local / Admin@123456');
  } else {
    console.log('[INFO] Admin already exists.');
  }

  await connection.end();
}

seed().catch(console.error);
