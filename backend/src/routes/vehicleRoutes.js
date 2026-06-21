const express = require('express');

const { postVehicle, getVehicles, getVehicleById, deleteVehicle } = require('../controllers/vehicleController');
const verifyToken = require('../middleware/verifyToken');

const router = express.Router();

router.get("/", getVehicles);
router.post("/", verifyToken, postVehicle);
router.get("/:id", getVehicleById);
router.delete("/:id", verifyToken, deleteVehicle);

module.exports = router;
