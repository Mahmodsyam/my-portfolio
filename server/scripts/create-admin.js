import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';
import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootPath = path.resolve(process.cwd(), '../.env');
const localPath = path.resolve(process.cwd(), '.env');

if (fs.existsSync(rootPath)) {
  dotenv.config({ path: rootPath });
} else {
  dotenv.config({ path: localPath });
}

async function createAdmin() {
  const rl = readline.createInterface({ input, output });
  let connection;

  try {
    const email = await rl.question('Admin email: ');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Error('Invalid email format.');
    }

    const password = await rl.question('Admin password (will be visible): ');
    if (password.length < 8) {
      throw new Error('Password must be at least 8 characters long.');
    }

    const displayName = await rl.question('Admin display name (default: Admin): ') || 'Admin';

    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT, 10) || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'portfolio_requests',
      ...(process.env.DB_SSL === 'true' ? { ssl: { rejectUnauthorized: false } } : {})
    });

    const [existing] = await connection.query('SELECT id FROM admins WHERE email = ?', [email]);
    if (existing.length > 0) {
      throw new Error('An admin with this email already exists.');
    }

    const passwordHash = await bcrypt.hash(password, 12);

    await connection.query(
      'INSERT INTO admins (email, password_hash, display_name) VALUES (?, ?, ?)',
      [email, passwordHash, displayName]
    );

    console.log(`\n[SUCCESS] Admin ${email} created successfully.`);
  } catch (error) {
    console.error(`\n[ERROR] ${error.message}`);
  } finally {
    if (connection) await connection.end();
    rl.close();
  }
}

createAdmin();
