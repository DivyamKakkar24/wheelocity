const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const vehicleRoutes = require('./routes/vehicleRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
    // console.log(req.user);
    res.send("API is running");
})

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/vehicle-listings", vehicleRoutes);
app.use("/api/v1/users", userRoutes);

module.exports = app;
