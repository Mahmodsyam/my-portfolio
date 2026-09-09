import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

async function verify() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'portfolio_requests'
  });

  const [rows] = await connection.query('SELECT * FROM admins');
  console.log('Admins in DB:', rows.map(r => ({ id: r.id, email: r.email, display_name: r.display_name })));

  if (rows.length > 0) {
    const admin = rows[0];
    const isMatch = await bcrypt.compare('Admin@123456', admin.password_hash);
    console.log('Testing password "Admin@123456" for email', admin.email, '=> Match:', isMatch);
  }

  await connection.end();
}

verify().catch(console.error);
