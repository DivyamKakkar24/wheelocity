const express = require('express');

const { postVehicle, getVehicles } = require('../controllers/vehicleController');
const verifyToken = require('../middleware/verifyToken');

const router = express.Router();

router.get("/", getVehicles);
router.post("/", verifyToken, postVehicle);

module.exports = router;
