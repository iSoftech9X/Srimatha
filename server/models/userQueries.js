import db from '../services/postgres.js';
import bcrypt from 'bcryptjs';

export async function createUser({ name, email, password, phone, address = {}, role = 'customer' }) {
  const hashedPassword = await bcrypt.hash(password, 10);
  const result = await db.query(
    `INSERT INTO users (name, email, password, phone, address_street, address_city, address_state, address_zipcode, address_country, role)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
    [
      name,
      email,
      hashedPassword,
      phone,
      address.street || null,
      address.city || null,
      address.state || null,
      address.zipCode || null,
      address.country || 'India',
      role
    ]
  );
  return result.rows[0];
}

export async function getUserByEmail(email) {
  const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows[0];
}

export async function getUserById(id) {
  const result = await db.query('SELECT * FROM users WHERE id = $1', [id]);
  return result.rows[0];
}

export async function updateUser(id, fields) {
  const keys = Object.keys(fields);
  if (keys.length === 0) return null;
  const setClause = keys.map((k, i) => `${k} = $${i + 2}`).join(', ');
  const values = [id, ...keys.map(k => fields[k])];
  const result = await db.query(
    `UPDATE users SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *`,
    values
  );
  return result.rows[0];
}
