const pool = require('../config/db');

const createVehicleListing = async ({
    user_id,
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
}) => {
    const [result] = await pool.query(
        `INSERT INTO vehicle_listings
            (user_id, vehicle_type, brand, model, variant, year, kilometers_driven,
             ownership, fuel_type, transmission, price, is_negotiable, city, state,
             description, phone)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            user_id, vehicle_type, brand, model, variant ?? null, year,
            kilometers_driven, ownership, fuel_type, transmission, price,
            is_negotiable ?? true, city, state, description ?? null, phone,
        ]
    );
    return result;
};

module.exports = { createVehicleListing };
