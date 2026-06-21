const express = require('express');

const { postVehicle, getVehicles, getMyListings, getVehicleById, deleteVehicle } = require('../controllers/vehicleController');
const verifyToken = require('../middleware/verifyToken');

const router = express.Router();

router.get("/", getVehicles);
router.post("/", verifyToken, postVehicle);
router.get("/my-listings", verifyToken, getMyListings);
router.get("/:id", getVehicleById);
router.delete("/:id", verifyToken, deleteVehicle);

module.exports = router;
