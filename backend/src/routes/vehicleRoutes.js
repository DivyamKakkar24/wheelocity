const express = require('express');

const { postVehicle } = require('../controllers/vehicleController');
const verifyToken = require('../middleware/verifyToken');

const router = express.Router();

router.post("/", verifyToken, postVehicle);

module.exports = router;
