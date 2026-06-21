const express = require('express');

const { postVehicle, getVehicles, getMyListings, getVehicleById, editVehicle, deleteVehicle } = require('../controllers/vehicleController');
const verifyToken = require('../middleware/verifyToken');

const router = express.Router();

router.get("/", getVehicles);
router.post("/", verifyToken, postVehicle);
router.get("/my-listings", verifyToken, getMyListings);
router.get("/:id", getVehicleById);
router.put("/:id", verifyToken, editVehicle);
router.delete("/:id", verifyToken, deleteVehicle);

module.exports = router;
