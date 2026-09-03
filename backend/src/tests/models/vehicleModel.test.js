jest.mock('../../config/db', () => ({
    query: jest.fn(),
}));

const pool = require('../../config/db');
const {
    createVehicleListing,
    findVehicleListings,
    findVehicleById,
    findVehicleWithOwner,
    updateVehicleListing,
    deleteVehicleListing,
} = require('../../models/vehicleModel');

beforeEach(() => {
    jest.clearAllMocks();
});

describe('createVehicleListing', () => {
    it('inserts the listing, defaulting optional fields', async () => {
        const insertResult = { insertId: 5 };
        pool.query.mockResolvedValue([insertResult]);

        const result = await createVehicleListing({
            user_id: 1,
            vehicle_type: 'car',
            brand: 'Honda',
            model: 'City',
            year: 2020,
            kilometers_driven: 10000,
            ownership: 1,
            fuel_type: 'petrol',
            transmission: 'manual',
            price: 500000,
            city: 'Delhi',
            state: 'Delhi',
            phone: '9999999999',
        });

        expect(pool.query).toHaveBeenCalledWith(
            expect.stringContaining('INSERT INTO vehicle_listings'),
            [1, 'car', 'Honda', 'City', null, 2020, 10000, 1, 'petrol', 'manual', 500000, true, 'Delhi', 'Delhi', null, '9999999999']
        );
        expect(result).toBe(insertResult);
    });
});

describe('findVehicleListings', () => {
    it('only filters on active status when no filters are given', async () => {
        pool.query
            .mockResolvedValueOnce([[{ total: 2 }]])
            .mockResolvedValueOnce([[{ id: 1 }, { id: 2 }]]);

        const result = await findVehicleListings({ limit: 20, offset: 0 });

        expect(pool.query).toHaveBeenNthCalledWith(
            1,
            expect.stringContaining("WHERE status = 'active'"),
            []
        );
        expect(pool.query).toHaveBeenNthCalledWith(
            2,
            expect.stringContaining("WHERE status = 'active'"),
            [20, 0]
        );
        expect(result).toEqual({ total: 2, rows: [{ id: 1 }, { id: 2 }] });
    });

    it('adds a condition and parameter per provided filter', async () => {
        pool.query
            .mockResolvedValueOnce([[{ total: 1 }]])
            .mockResolvedValueOnce([[{ id: 1 }]]);

        await findVehicleListings({
            brand: 'Honda',
            fuel_type: 'petrol',
            city: 'Delhi',
            min_price: 100000,
            max_price: 900000,
            limit: 10,
            offset: 0,
        });

        expect(pool.query).toHaveBeenNthCalledWith(
            1,
            expect.stringMatching(/brand = \?.*fuel_type = \?.*city = \?.*price >= \?.*price <= \?/s),
            ['Honda', 'petrol', 'Delhi', 100000, 900000]
        );
    });
});

describe('findVehicleById', () => {
    it('returns the vehicle when found and active', async () => {
        const vehicle = { id: 1, brand: 'Honda' };
        pool.query.mockResolvedValue([[vehicle]]);

        const result = await findVehicleById({ id: 1 });

        expect(pool.query).toHaveBeenCalledWith(expect.stringContaining("status = 'active'"), [1]);
        expect(result).toBe(vehicle);
    });

    it('returns null when not found', async () => {
        pool.query.mockResolvedValue([[undefined]]);

        const result = await findVehicleById({ id: 999 });

        expect(result).toBeNull();
    });
});

describe('findVehicleWithOwner', () => {
    it('returns the id/user_id/status row used for ownership checks', async () => {
        const row = { id: 1, user_id: 4, status: 'active' };
        pool.query.mockResolvedValue([[row]]);

        const result = await findVehicleWithOwner({ id: 1 });

        expect(result).toBe(row);
    });

    it('returns null when the listing does not exist', async () => {
        pool.query.mockResolvedValue([[undefined]]);

        const result = await findVehicleWithOwner({ id: 999 });

        expect(result).toBeNull();
    });
});

describe('updateVehicleListing', () => {
    it('only sets allowed fields and ignores unknown keys', async () => {
        pool.query
            .mockResolvedValueOnce([{}]) // UPDATE
            .mockResolvedValueOnce([[{ id: 1, price: 600000 }]]); // SELECT

        const result = await updateVehicleListing({
            id: 1,
            fields: { price: 600000, not_a_real_column: 'nope' },
        });

        expect(pool.query).toHaveBeenNthCalledWith(
            1,
            expect.stringContaining('SET price = ? WHERE id = ?'),
            [600000, 1]
        );
        expect(result).toEqual({ id: 1, price: 600000 });
    });

    it('skips the UPDATE query and just re-fetches when no fields are provided', async () => {
        pool.query.mockResolvedValueOnce([[{ id: 1 }]]);

        await updateVehicleListing({ id: 1, fields: {} });

        expect(pool.query).toHaveBeenCalledTimes(1);
        expect(pool.query).toHaveBeenCalledWith(expect.stringContaining('SELECT'), [1]);
    });
});

describe('deleteVehicleListing', () => {
    it('returns the number of affected rows', async () => {
        pool.query.mockResolvedValue([{ affectedRows: 1 }]);

        const result = await deleteVehicleListing({ id: 1 });

        expect(pool.query).toHaveBeenCalledWith(expect.stringContaining('DELETE FROM vehicle_listings'), [1]);
        expect(result).toBe(1);
    });
});
