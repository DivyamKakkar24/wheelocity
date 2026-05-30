const bcrypt = require('bcrypt');
const pool = require('../config/db');

const register = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
        return res.status(400).json({ message: "All fields required" });

    const [users] = await pool.query(
        "SELECT id FROM users WHERE email = ?",
        [email]
    );

    if (users.length > 0)
        return res.status(409).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 12);

    try {
        const [result] = await pool.query(
            `INSERT INTO users
            (name, email, password)
            VALUES (?, ?, ?)`,
            [
                name,
                email,
                hashedPassword
            ]
        );

        return res.status(201).json({
            message: "User registered successfully",
            userId: result.insertId
        });
    } catch (err) {
        console.log("Error registering user: ", err);

        return res.status(500).json({
            message: "Internal server error",
        });
    }
};

module.exports = { register };
