const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

const register = async (req, res) => {
    try {
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

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password)
            return res.status(400).json({ message: "Email and password required" });

        const [users] = await pool.query(
            "SELECT * FROM users WHERE email = ?",
            [email]
        );

        if (users.length === 0)
            return res.status(401).json({ message: "Invalid credentials" });

        const user = users[0];
        const passwordIsValid = await bcrypt.compare(password, user.password);

        if (!passwordIsValid)
            return res.status(401).json({ message: "Incorrect password!" });

        const token = jwt.sign(
            {
                userId: user.id,
                email: user.email
            },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        return res.status(200).json({
            message: "Login successful",
            token,
        });

    } catch (err) {
        console.log("Error while logging in: ", err);

        return res.status(500).json({
            message: "Internal server error",
        });
    }
}

module.exports = { register, login };
