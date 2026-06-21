const { findUserById, updateUserProfile } = require('../models/userModel');
const logger = require('../utils/logger');

const getProfile = async (req, res) => {
    try {
        const user = await findUserById(req.user.userId);

        if (!user)
            return res.status(404).json({ message: "User not found" });

        return res.status(200).json({
            message: "Profile fetched successfully",
            data: user,
        });
    } catch (err) {
        logger.error("Error fetching profile:", err);

        return res.status(500).json({
            message: "Internal server error",
        });
    }
};

const updateProfile = async (req, res) => {
    try {
        const { name, phone, city, state } = req.body || {};

        if (name === undefined && phone === undefined && city === undefined && state === undefined)
            return res.status(400).json({ message: "No fields to update" });

        const updatedUser = await updateUserProfile(req.user.userId, { name, phone, city, state });

        return res.status(200).json({
            message: "Profile updated successfully",
            data: updatedUser,
        });
    } catch (err) {
        logger.error("Error updating profile:", err);

        return res.status(500).json({
            message: "Internal server error",
        });
    }
};

module.exports = { getProfile, updateProfile };
