// server/config/db.js - PostgreSQL database pool connection
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

export const pool = new Pool({
  host: process.env.PGHOST || 'localhost',
  user: process.env.PGUSER || 'postgres',
  password: process.env.PGPASSWORD || 'postgres',
  database: process.env.PGDATABASE || 'tandem',
  port: process.env.PGPORT ? parseInt(process.env.PGPORT, 10) : 5432,
});

export default pool;
