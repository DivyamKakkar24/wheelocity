const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const verifyToken = require('./middleware/verifyToken');

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", verifyToken, (req, res) => {
    console.log(req.user);
    res.send("API is running");
})

app.use("/api/v1/auth", authRoutes);

module.exports = app;
