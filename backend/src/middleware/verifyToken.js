const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

// Protect Routes
const verifyToken = (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                message: "Access denied!",
            });
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded;

        next();
    } catch (err) {
        logger.error("JWT error:", err);

        return res.status(401).json({
            message: "Invalid or expired token.",
        });
    }
}

module.exports = verifyToken;