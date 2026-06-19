const express = require('express');

const { getMyListings, getProfile, updateProfile } = require('../controllers/userController');
const verifyToken = require('../middleware/verifyToken');

const router = express.Router();

router.get("/my-listings", verifyToken, getMyListings);
router.get("/profile", verifyToken, getProfile);
router.put("/profile", verifyToken, updateProfile);

module.exports = router;
