import pool from '../services/postgres.js';

export async function createPasswordReset(userId, otp, expiresAt) {
  await pool.query(
    'INSERT INTO password_resets (user_id, otp, expires_at) VALUES ($1, $2, $3)',
    [userId, otp, expiresAt]
  );
}

export async function findPasswordReset(userId, otp) {
  const { rows } = await pool.query(
    'SELECT * FROM password_resets WHERE user_id = $1 AND otp = $2 LIMIT 1',
    [userId, otp]
  );
  return rows[0];
}
export async function updateUserByIdPass(userId, updates) {
  const query = `
    UPDATE users
    SET password = $1
    WHERE id = $2
    RETURNING *;
  `;
  const values = [updates.password, userId];
  const result = await pool.query(query, values);
  return result.rows[0];
}

export async function deletePasswordReset(userId) {
  await pool.query(
    'DELETE FROM password_resets WHERE user_id = $1',
    [userId]
  );
}
