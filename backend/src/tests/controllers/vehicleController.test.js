process.env.JWT_SECRET = 'test-jwt-secret';

jest.mock('../../models/vehicleModel');

const express = require('express');
const request = require('supertest');
const jwt = require('jsonwebtoken');
const {
    createVehicleListing,
    findVehicleListings,
    findVehicleById,
    findVehicleWithOwner,
    updateVehicleListing,
    deleteVehicleListing,
} = require('../../models/vehicleModel');
const vehicleRoutes = require('../../routes/vehicleRoutes');

const app = express();
app.use(express.json());
app.use('/api/v1/vehicle-listings', vehicleRoutes);

const tokenFor = (userId) => jwt.sign({ userId, email: 'a@b.com' }, process.env.JWT_SECRET, { expiresIn: '1h' });

const validListing = {
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
};

beforeEach(() => {
    jest.clearAllMocks();
});

describe('POST /api/v1/vehicle-listings', () => {
    it('rejects unauthenticated requests', async () => {
        const res = await request(app).post('/api/v1/vehicle-listings').send(validListing);

        expect(res.status).toBe(401);
    });

    it('rejects when required fields are missing', async () => {
        const res = await request(app)
            .post('/api/v1/vehicle-listings')
            .set('Authorization', `Bearer ${tokenFor(1)}`)
            .send({ vehicle_type: 'car' });

        expect(res.status).toBe(400);
        expect(res.body.message).toContain('Missing required fields');
        expect(createVehicleListing).not.toHaveBeenCalled();
    });

    it('creates the listing under the authenticated user on success', async () => {
        createVehicleListing.mockResolvedValue({ insertId: 3 });

        const res = await request(app)
            .post('/api/v1/vehicle-listings')
            .set('Authorization', `Bearer ${tokenFor(1)}`)
            .send(validListing);

        expect(createVehicleListing).toHaveBeenCalledWith(expect.objectContaining({ user_id: 1, brand: 'Honda' }));
        expect(res.status).toBe(201);
        expect(res.body.listingId).toBe(3);
    });
});

describe('GET /api/v1/vehicle-listings', () => {
    it('is public and applies default pagination', async () => {
        findVehicleListings.mockResolvedValue({ total: 0, rows: [] });

        const res = await request(app).get('/api/v1/vehicle-listings');

        expect(findVehicleListings).toHaveBeenCalledWith(expect.objectContaining({ limit: 20, offset: 0 }));
        expect(res.status).toBe(200);
    });

    it('clamps an out-of-range limit to the 1-100 window', async () => {
        findVehicleListings.mockResolvedValue({ total: 0, rows: [] });

        await request(app).get('/api/v1/vehicle-listings?limit=500&page=2');

        expect(findVehicleListings).toHaveBeenCalledWith(expect.objectContaining({ limit: 100, offset: 100 }));
    });
});

describe('GET /api/v1/vehicle-listings/:id', () => {
    it('rejects a non-numeric id', async () => {
        const res = await request(app).get('/api/v1/vehicle-listings/abc');

        expect(res.status).toBe(400);
        expect(findVehicleById).not.toHaveBeenCalled();
    });

    it('returns 404 when the listing does not exist', async () => {
        findVehicleById.mockResolvedValue(null);

        const res = await request(app).get('/api/v1/vehicle-listings/999');

        expect(res.status).toBe(404);
    });

    it('returns the listing when found', async () => {
        findVehicleById.mockResolvedValue({ id: 1, brand: 'Honda' });

        const res = await request(app).get('/api/v1/vehicle-listings/1');

        expect(res.status).toBe(200);
        expect(res.body.data).toEqual({ id: 1, brand: 'Honda' });
    });
});

describe('PUT /api/v1/vehicle-listings/:id (ownership checks)', () => {
    it('rejects unauthenticated requests', async () => {
        const res = await request(app).put('/api/v1/vehicle-listings/1').send({ price: 1 });

        expect(res.status).toBe(401);
    });

    it('rejects a non-numeric id', async () => {
        const res = await request(app)
            .put('/api/v1/vehicle-listings/abc')
            .set('Authorization', `Bearer ${tokenFor(1)}`)
            .send({ price: 1 });

        expect(res.status).toBe(400);
    });

    it('rejects a body with no updatable fields', async () => {
        const res = await request(app)
            .put('/api/v1/vehicle-listings/1')
            .set('Authorization', `Bearer ${tokenFor(1)}`)
            .send({});

        expect(res.status).toBe(400);
        expect(findVehicleWithOwner).not.toHaveBeenCalled();
    });

    it('returns 404 when the listing does not exist', async () => {
        findVehicleWithOwner.mockResolvedValue(null);

        const res = await request(app)
            .put('/api/v1/vehicle-listings/999')
            .set('Authorization', `Bearer ${tokenFor(1)}`)
            .send({ price: 600000 });

        expect(res.status).toBe(404);
        expect(updateVehicleListing).not.toHaveBeenCalled();
    });

    it('returns 403 when the authenticated user does not own the listing', async () => {
        findVehicleWithOwner.mockResolvedValue({ id: 1, user_id: 2, status: 'active' });

        const res = await request(app)
            .put('/api/v1/vehicle-listings/1')
            .set('Authorization', `Bearer ${tokenFor(1)}`) // user 1, listing owned by user 2
            .send({ price: 600000 });

        expect(res.status).toBe(403);
        expect(updateVehicleListing).not.toHaveBeenCalled();
    });

    it('updates the listing when the authenticated user is the owner', async () => {
        findVehicleWithOwner.mockResolvedValue({ id: 1, user_id: 1, status: 'active' });
        updateVehicleListing.mockResolvedValue({ id: 1, price: 600000 });

        const res = await request(app)
            .put('/api/v1/vehicle-listings/1')
            .set('Authorization', `Bearer ${tokenFor(1)}`)
            .send({ price: 600000 });

        expect(updateVehicleListing).toHaveBeenCalledWith({ id: 1, fields: expect.objectContaining({ price: 600000 }) });
        expect(res.status).toBe(200);
        expect(res.body.data).toEqual({ id: 1, price: 600000 });
    });
});

describe('DELETE /api/v1/vehicle-listings/:id (ownership checks)', () => {
    it('rejects unauthenticated requests', async () => {
        const res = await request(app).delete('/api/v1/vehicle-listings/1');

        expect(res.status).toBe(401);
    });

    it('returns 404 when the listing does not exist', async () => {
        findVehicleWithOwner.mockResolvedValue(null);

        const res = await request(app)
            .delete('/api/v1/vehicle-listings/999')
            .set('Authorization', `Bearer ${tokenFor(1)}`);

        expect(res.status).toBe(404);
        expect(deleteVehicleListing).not.toHaveBeenCalled();
    });

    it('returns 403 when the authenticated user does not own the listing', async () => {
        findVehicleWithOwner.mockResolvedValue({ id: 1, user_id: 2, status: 'active' });

        const res = await request(app)
            .delete('/api/v1/vehicle-listings/1')
            .set('Authorization', `Bearer ${tokenFor(1)}`);

        expect(res.status).toBe(403);
        expect(deleteVehicleListing).not.toHaveBeenCalled();
    });

    it('deletes the listing when the authenticated user is the owner', async () => {
        findVehicleWithOwner.mockResolvedValue({ id: 1, user_id: 1, status: 'active' });
        deleteVehicleListing.mockResolvedValue(1);

        const res = await request(app)
            .delete('/api/v1/vehicle-listings/1')
            .set('Authorization', `Bearer ${tokenFor(1)}`);

        expect(deleteVehicleListing).toHaveBeenCalledWith({ id: 1 });
        expect(res.status).toBe(200);
    });
});
