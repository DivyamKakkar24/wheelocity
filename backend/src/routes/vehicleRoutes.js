const express = require('express');

const { postVehicle, getVehicles, getVehicleById } = require('../controllers/vehicleController');
const verifyToken = require('../middleware/verifyToken');

const router = express.Router();

router.get("/", getVehicles);
router.post("/", verifyToken, postVehicle);
router.get("/:id", getVehicleById);

module.exports = router;
