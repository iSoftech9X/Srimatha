import db from '../services/postgres.js';
import bcrypt from 'bcryptjs';
import pool from '../services/postgres.js';
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
  console.log('🔍 Email received in backend:', `"${email}"`, 'Length:', email.length);
 const cleanedEmail = email.trim().toLowerCase();
    const result = await pool.query(
      'SELECT * FROM users WHERE LOWER(email) = LOWER($1)',
      [cleanedEmail]
);

  console.log('getUserByEmail DEBUG:', { email, result }); // DEBUG
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
export async function updateUserById(id, { name, email, phone, address = {} }) {
  const fieldsToUpdate = {
    ...(name && { name }),
    ...(email && { email }),
    ...(phone && { phone }),
    ...(address.street && { address_street: address.street }),
    ...(address.city && { address_city: address.city }),
    ...(address.state && { address_state: address.state }),
    ...(address.zipcode && { address_zipcode: address.zipcode }),
    ...(address.country && { address_country: address.country }),
  };

  const keys = Object.keys(fieldsToUpdate);
  if (keys.length === 0) return null;

  const setClause = keys.map((key, i) => `${key} = $${i + 2}`).join(', ');
  const values = [id, ...keys.map(k => fieldsToUpdate[k])];

  const result = await db.query(
    `UPDATE users SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *`,
    values
  );

  return result.rows[0];
}
