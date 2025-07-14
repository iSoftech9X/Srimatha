import dotenv from 'dotenv';
dotenv.config();
import { Pool } from 'pg';

const pool = new Pool({
  user: process.env.DB_USERNAME,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
});

export default pool;

const result = await pool.query(`
  SELECT current_database() AS db, current_user AS user, current_schema() AS schema;
`);
console.log("🔍 DB Info:", result.rows[0]);

const tables = await pool.query(`
  SELECT table_schema, table_name
  FROM information_schema.tables
  WHERE table_name = 'users'
`);
console.log("📋 Users table locations:", tables.rows);

const res = await pool.query(`
  SELECT email, 
         LENGTH(email) AS char_len, 
         OCTET_LENGTH(email) AS byte_len, 
         encode(convert_to(email, 'UTF8'), 'hex') AS hex_email 
  FROM users 
  WHERE email ILIKE '%admin%' 
`);
console.log("🧪 Stored email details:", res.rows);

