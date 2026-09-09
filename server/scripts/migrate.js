import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootPath = path.resolve(process.cwd(), '../.env');
const localPath = path.resolve(process.cwd(), '.env');

if (fs.existsSync(rootPath)) {
  dotenv.config({ path: rootPath });
} else {
  dotenv.config({ path: localPath });
}

async function runMigrations() {
  let connection;
  try {
    const dbName = process.env.DB_NAME || 'portfolio_requests';

    // Connect to MySQL server (works for local and cloud DBs like Aiven)
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT, 10) || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: dbName,
      ...(process.env.DB_SSL === 'true' ? { ssl: { rejectUnauthorized: false } } : {})
    });

    console.log(`[MIGRATE] Connected to database: ${dbName}`);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS _migrations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        filename VARCHAR(190) UNIQUE,
        applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    const migrationsDir = path.resolve(__dirname, '../migrations');
    const files = fs.readdirSync(migrationsDir)
      .filter(f => f.endsWith('.sql'))
      .sort();

    const [applied] = await connection.query('SELECT filename FROM _migrations');
    const appliedFiles = applied.map(row => row.filename);

    for (const file of files) {
      if (!appliedFiles.includes(file)) {
        console.log(`[MIGRATE] Applying migration: ${file}`);
        const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
        
        const statements = sql.split(';').filter(stmt => stmt.trim() !== '');
        
        for (const statement of statements) {
          await connection.query(statement);
        }

        await connection.query('INSERT INTO _migrations (filename) VALUES (?)', [file]);
        console.log(`[MIGRATE] Applied migration: ${file}`);
      }
    }

    console.log('[MIGRATE] All migrations applied successfully.');
  } catch (error) {
    console.error('[MIGRATE] Error running migrations:', error);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

runMigrations();
