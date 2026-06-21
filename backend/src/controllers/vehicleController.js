const { createVehicleListing, findVehicleListings, findVehicleById, findVehicleWithOwner, deleteVehicleListing } = require('../models/vehicleModel');
const logger = require('../utils/logger');

const postVehicle = async (req, res) => {
    try {
        const {
            vehicle_type,
            brand,
            model,
            variant,
            year,
            kilometers_driven,
            ownership,
            fuel_type,
            transmission,
            price,
            is_negotiable,
            city,
            state,
            description,
            phone,
        } = req.body || {};

        const required = { vehicle_type, brand, model, year, kilometers_driven, ownership, fuel_type, transmission, price, city, state, phone };
        const missing = Object.keys(required).filter(k => required[k] === undefined || required[k] === null || required[k] === '');

        if (missing.length > 0)
            return res.status(400).json({ message: `Missing required fields: ${missing.join(', ')}` });

        const result = await createVehicleListing({
            user_id: req.user.userId,
            vehicle_type,
            brand,
            model,
            variant,
            year,
            kilometers_driven,
            ownership,
            fuel_type,
            transmission,
            price,
            is_negotiable,
            city,
            state,
            description,
            phone,
        });

        return res.status(201).json({
            message: "Vehicle listed successfully",
            listingId: result.insertId,
        });
    } catch (err) {
        logger.error("Error posting vehicle listing:", err);

        return res.status(500).json({
            message: "Internal server error",
        });
    }
};

const getVehicles = async (req, res) => {
    try {
        const { brand, fuel_type, vehicle_type, city, min_price, max_price } = req.query;

        const page  = Math.max(1, parseInt(req.query.page)  || 1);
        const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
        const offset = (page - 1) * limit;

        const { total, rows } = await findVehicleListings({
            brand, fuel_type, vehicle_type, city, min_price, max_price, limit, offset,
        });

        return res.status(200).json({
            data: rows,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (err) {
        logger.error("Error fetching vehicle listings:", err);

        return res.status(500).json({
            message: "Internal server error",
        });
    }
};

const getVehicleById = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);

        if (isNaN(id) || id <= 0)
            return res.status(400).json({ message: "Invalid vehicle ID" });

        const vehicle = await findVehicleById({ id });

        if (!vehicle)
            return res.status(404).json({ message: "Vehicle not found" });

        return res.status(200).json({
            message: "Vehicle details fetched",
            data: vehicle
        });
    } catch (err) {
        logger.error("Error fetching vehicle details:", err);

        return res.status(500).json({
            message: "Internal server error",
        });
    }
}

const deleteVehicle = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);

        if (isNaN(id) || id <= 0)
            return res.status(400).json({ message: "Invalid vehicle ID" });

        // Fetch the listing first to verify it exists and who owns it
        const vehicle = await findVehicleWithOwner({ id });

        if (!vehicle)
            return res.status(404).json({ message: "Vehicle not found" });

        // A user may only delete their own listing
        if (vehicle.user_id !== req.user.userId)
            return res.status(403).json({ message: "You are not allowed to delete this listing" });

        await deleteVehicleListing({ id });

        return res.status(200).json({ message: "Vehicle listing deleted successfully" });
    } catch (err) {
        logger.error("Error deleting vehicle listing:", err);

        return res.status(500).json({
            message: "Internal server error",
        });
    }
}

module.exports = { postVehicle, getVehicles, getVehicleById, deleteVehicle };
