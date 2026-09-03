process.env.JWT_SECRET = 'test-jwt-secret';

jest.mock('../../models/userModel');
jest.mock('bcrypt');

const express = require('express');
const request = require('supertest');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { findUserByEmail, createUser } = require('../../models/userModel');
const authRoutes = require('../../routes/authRoutes');

const app = express();
app.use(express.json());
app.use('/api/v1/auth', authRoutes);

beforeEach(() => {
    jest.clearAllMocks();
});

describe('POST /api/v1/auth/register', () => {
    it('rejects when required fields are missing', async () => {
        const res = await request(app).post('/api/v1/auth/register').send({ email: 'a@b.com' });

        expect(res.status).toBe(400);
        expect(res.body.message).toBe('All fields required');
        expect(findUserByEmail).not.toHaveBeenCalled();
    });

    it('rejects when the email is already registered', async () => {
        findUserByEmail.mockResolvedValue([{ id: 1, email: 'a@b.com' }]);

        const res = await request(app)
            .post('/api/v1/auth/register')
            .send({ name: 'Jane', email: 'a@b.com', password: 'secret123' });

        expect(res.status).toBe(409);
        expect(res.body.message).toBe('Email already exists');
        expect(createUser).not.toHaveBeenCalled();
    });

    it('hashes the password and creates the user on success', async () => {
        findUserByEmail.mockResolvedValue([]);
        bcrypt.hash.mockResolvedValue('hashed-password');
        createUser.mockResolvedValue({ insertId: 10 });

        const res = await request(app)
            .post('/api/v1/auth/register')
            .send({ name: 'Jane', email: 'a@b.com', password: 'secret123' });

        expect(bcrypt.hash).toHaveBeenCalledWith('secret123', 12);
        expect(createUser).toHaveBeenCalledWith({ name: 'Jane', email: 'a@b.com', password: 'hashed-password' });
        expect(res.status).toBe(201);
        expect(res.body).toEqual({ message: 'User registered successfully', userId: 10 });
    });

    it('returns 500 when the model throws', async () => {
        findUserByEmail.mockRejectedValue(new Error('DB down'));

        const res = await request(app)
            .post('/api/v1/auth/register')
            .send({ name: 'Jane', email: 'a@b.com', password: 'secret123' });

        expect(res.status).toBe(500);
    });
});

describe('POST /api/v1/auth/login', () => {
    it('rejects when email or password is missing', async () => {
        const res = await request(app).post('/api/v1/auth/login').send({ email: 'a@b.com' });

        expect(res.status).toBe(400);
        expect(res.body.message).toBe('Email and password required');
    });

    it('rejects when no user exists for the email', async () => {
        findUserByEmail.mockResolvedValue([]);

        const res = await request(app)
            .post('/api/v1/auth/login')
            .send({ email: 'a@b.com', password: 'secret123' });

        expect(res.status).toBe(401);
        expect(res.body.message).toBe('Invalid credentials');
    });

    it('rejects an incorrect password', async () => {
        findUserByEmail.mockResolvedValue([{ id: 1, email: 'a@b.com', password: 'hashed' }]);
        bcrypt.compare.mockResolvedValue(false);

        const res = await request(app)
            .post('/api/v1/auth/login')
            .send({ email: 'a@b.com', password: 'wrong' });

        expect(res.status).toBe(401);
        expect(res.body.message).toBe('Incorrect password!');
    });

    it('returns a signed JWT on successful login', async () => {
        findUserByEmail.mockResolvedValue([{ id: 1, email: 'a@b.com', password: 'hashed' }]);
        bcrypt.compare.mockResolvedValue(true);

        const res = await request(app)
            .post('/api/v1/auth/login')
            .send({ email: 'a@b.com', password: 'secret123' });

        expect(res.status).toBe(200);
        expect(res.body.message).toBe('Login successful');
        expect(res.body.token).toBeDefined();

        const decoded = jwt.verify(res.body.token, process.env.JWT_SECRET);
        expect(decoded).toMatchObject({ userId: 1, email: 'a@b.com' });
    });

    it('returns 500 when the model throws', async () => {
        findUserByEmail.mockRejectedValue(new Error('DB down'));

        const res = await request(app)
            .post('/api/v1/auth/login')
            .send({ email: 'a@b.com', password: 'secret123' });

        expect(res.status).toBe(500);
    });
});

describe('POST /api/v1/auth/logout', () => {
    it('always returns 200', async () => {
        const res = await request(app).post('/api/v1/auth/logout');

        expect(res.status).toBe(200);
        expect(res.body.message).toBe('Logged out successfully');
    });
});
