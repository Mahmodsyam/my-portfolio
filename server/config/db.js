import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') }); // Load from server root

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'portfolio_requests',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ...(process.env.DB_SSL === 'true' ? { ssl: { rejectUnauthorized: false } } : {})
});

export const query = async (sql, params) => {
  const [results] = await pool.execute(sql, params);
  return results;
};

export const getPool = () => pool;

export const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('[DB] Successfully connected to MySQL database.');
    connection.release();
  } catch (error) {
    console.error('[DB] Error connecting to the database:', error.message);
  }
};
