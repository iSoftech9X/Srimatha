import pool from './postgres.js';

async function testConnection() {
  try {
    const res = await pool.query('SELECT NOW()');
    console.log('Database connected! Time:', res.rows[0].now);
  } catch (err) {
    console.error('Database connection failed:', err);
  } finally {
    await pool.end();
  }
}

testConnection();
