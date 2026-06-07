const mysql = require('mysql2/promise');

// mysql connection
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// verify the pool can connect on startup
const testConnection = async () => {
    try {
        const connection = await pool.getConnection();
        console.log("Connected to MySQL database ✅");
        connection.release();
    } catch (err) {
        console.error("Failed to connect to MySQL database ❌", err.message);
    }
};

testConnection();

module.exports = pool;
