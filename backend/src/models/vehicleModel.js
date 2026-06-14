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

const findVehicleListings = async ({ brand, fuel_type, vehicle_type, city, min_price, max_price, limit, offset }) => {
    const conditions = [`status = 'active'`];
    const params = [];

    if (brand)        { conditions.push('brand = ?');        params.push(brand); }
    if (fuel_type)    { conditions.push('fuel_type = ?');    params.push(fuel_type); }
    if (vehicle_type) { conditions.push('vehicle_type = ?'); params.push(vehicle_type); }
    if (city)         { conditions.push('city = ?');         params.push(city); }
    if (min_price)    { conditions.push('price >= ?');       params.push(min_price); }
    if (max_price)    { conditions.push('price <= ?');       params.push(max_price); }

    const where = conditions.join(' AND ');

    // Count total matching rows for pagination metadata
    const [[{ total }]] = await pool.query(
        `SELECT COUNT(*) AS total FROM vehicle_listings WHERE ${where}`,
        params
    );

    const [rows] = await pool.query(
        `SELECT * FROM vehicle_listings WHERE ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
        [...params, limit, offset]
    );

    return { total, rows };
};

const findVehicleById = async ({ id }) => {
    const [[vehicle]] = await pool.query(
        `SELECT * FROM vehicle_listings WHERE id = ? AND status = 'active'`, [id]
    );

    return vehicle ?? null;
}

module.exports = { createVehicleListing, findVehicleListings, findVehicleById };
