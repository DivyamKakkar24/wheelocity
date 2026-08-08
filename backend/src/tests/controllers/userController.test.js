process.env.JWT_SECRET = 'test-jwt-secret';

jest.mock('../../models/userModel');

const express = require('express');
const request = require('supertest');
const jwt = require('jsonwebtoken');
const { findUserById, updateUserProfile } = require('../../models/userModel');
const userRoutes = require('../../routes/userRoutes');

const app = express();
app.use(express.json());
app.use('/api/v1/users', userRoutes);

const tokenFor = (userId) => jwt.sign({ userId, email: 'a@b.com' }, process.env.JWT_SECRET, { expiresIn: '1h' });

beforeEach(() => {
    jest.clearAllMocks();
});

describe('GET /api/v1/users/profile', () => {
    it('rejects unauthenticated requests', async () => {
        const res = await request(app).get('/api/v1/users/profile');

        expect(res.status).toBe(401);
        expect(findUserById).not.toHaveBeenCalled();
    });

    it('returns the profile for the authenticated user', async () => {
        findUserById.mockResolvedValue({ id: 1, name: 'Jane', email: 'a@b.com' });

        const res = await request(app)
            .get('/api/v1/users/profile')
            .set('Authorization', `Bearer ${tokenFor(1)}`);

        expect(findUserById).toHaveBeenCalledWith(1);
        expect(res.status).toBe(200);
        expect(res.body.data).toEqual({ id: 1, name: 'Jane', email: 'a@b.com' });
    });

    it('returns 404 when the user no longer exists', async () => {
        findUserById.mockResolvedValue(null);

        const res = await request(app)
            .get('/api/v1/users/profile')
            .set('Authorization', `Bearer ${tokenFor(999)}`);

        expect(res.status).toBe(404);
    });

    it('returns 500 when the model throws', async () => {
        findUserById.mockRejectedValue(new Error('DB down'));

        const res = await request(app)
            .get('/api/v1/users/profile')
            .set('Authorization', `Bearer ${tokenFor(1)}`);

        expect(res.status).toBe(500);
    });
});

describe('PUT /api/v1/users/profile', () => {
    it('rejects unauthenticated requests', async () => {
        const res = await request(app).put('/api/v1/users/profile').send({ name: 'New Name' });

        expect(res.status).toBe(401);
    });

    it('rejects a body with no updatable fields', async () => {
        const res = await request(app)
            .put('/api/v1/users/profile')
            .set('Authorization', `Bearer ${tokenFor(1)}`)
            .send({});

        expect(res.status).toBe(400);
        expect(updateUserProfile).not.toHaveBeenCalled();
    });

    it('updates only the fields provided, scoped to the authenticated user', async () => {
        updateUserProfile.mockResolvedValue({ id: 1, name: 'New Name' });

        const res = await request(app)
            .put('/api/v1/users/profile')
            .set('Authorization', `Bearer ${tokenFor(1)}`)
            .send({ name: 'New Name' });

        expect(updateUserProfile).toHaveBeenCalledWith(1, {
            name: 'New Name',
            phone: undefined,
            city: undefined,
            state: undefined,
        });
        expect(res.status).toBe(200);
        expect(res.body.data).toEqual({ id: 1, name: 'New Name' });
    });

    it('returns 500 when the model throws', async () => {
        updateUserProfile.mockRejectedValue(new Error('DB down'));

        const res = await request(app)
            .put('/api/v1/users/profile')
            .set('Authorization', `Bearer ${tokenFor(1)}`)
            .send({ name: 'New Name' });

        expect(res.status).toBe(500);
    });
});
