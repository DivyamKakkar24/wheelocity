const pool = require('../config/db');

const findUserByEmail = async (email) => {
  const [rows] = await pool.query(
    'SELECT * FROM users WHERE email = ?',
    [email]
  );
  return rows;
};

const getUserById = async (userId) => {
  const [rows] = await pool.query(
    'SELECT * FROM users WHERE id = ?',
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

module.exports = {
  findUserByEmail,
  getUserById,
  createUser,
};
