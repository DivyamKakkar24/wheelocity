const { createVehicleListing } = require('../models/vehicleModel');

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

module.exports = { postVehicle };
