const { createVehicleListing, getVehicleListings } = require('../models/vehicleModel');

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
        console.log("Error posting vehicle listing: ", err);

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

        const { total, rows } = await getVehicleListings({
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
        console.log("Error fetching vehicle listings: ", err);

        return res.status(500).json({
            message: "Internal server error",
        });
    }
};

module.exports = { postVehicle, getVehicles };
