import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// Since you imported 'pg' as a default import, use pg.Pool
const { Pool } = pg;

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST, 
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '5432', 10),
  // Ensuring secure, efficient connection management
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Test connection on initialization
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ PostgreSQL connection error:', err.stack);
  } else {
    console.log('✅ PostgreSQL Database connected successfully.');
  }
});

export default pool;