const pool = require('../config/db');

const findUserByEmail = async (email) => {
  const [rows] = await pool.query(
    'SELECT * FROM users WHERE email = ?',
    [email]
  );
  return rows;
};

const findUserById = async (userId) => {
  const [rows] = await pool.query(
    'SELECT id, name, email, phone, city, state FROM users WHERE id = ?',
    [userId]
  );
  return rows[0] || null;
};

const createUser = async ({ name, email, password }) => {
  const [result] = await pool.query(
    `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`,
    [name, email, password]
  );
  return result;
};

const updateUserProfile = async (userId, { name, phone, city, state }) => {
  const fields = [];
  const params = [];

  if (name !== undefined)  { fields.push('name = ?');  params.push(name); }
  if (phone !== undefined) { fields.push('phone = ?'); params.push(phone); }
  if (city !== undefined)  { fields.push('city = ?');  params.push(city); }
  if (state !== undefined) { fields.push('state = ?'); params.push(state); }

  if (fields.length === 0) return findUserById(userId);

  await pool.query(
    `UPDATE users SET ${fields.join(', ')} WHERE id = ?`,
    [...params, userId]
  );

  return findUserById(userId);
};

module.exports = {
  findUserByEmail,
  findUserById,
  createUser,
  updateUserProfile,
};
