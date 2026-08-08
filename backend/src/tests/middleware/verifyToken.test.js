process.env.JWT_SECRET = 'test-jwt-secret';

const jwt = require('jsonwebtoken');
const verifyToken = require('../../middleware/verifyToken');

const buildRes = () => ({
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
});

describe('verifyToken middleware', () => {
    it('rejects requests with no Authorization header', () => {
        const req = { headers: {} };
        const res = buildRes();
        const next = jest.fn();

        verifyToken(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: 'Access denied!' });
        expect(next).not.toHaveBeenCalled();
    });

    it('rejects requests where the header does not start with "Bearer "', () => {
        const req = { headers: { authorization: 'Token abc123' } };
        const res = buildRes();
        const next = jest.fn();

        verifyToken(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: 'Access denied!' });
        expect(next).not.toHaveBeenCalled();
    });

    it('rejects an invalid/garbage token', () => {
        const req = { headers: { authorization: 'Bearer not-a-real-token' } };
        const res = buildRes();
        const next = jest.fn();

        verifyToken(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: 'Invalid or expired token.' });
        expect(next).not.toHaveBeenCalled();
    });

    it('rejects an expired token', () => {
        const expired = jwt.sign({ userId: 1 }, process.env.JWT_SECRET, { expiresIn: -10 });
        const req = { headers: { authorization: `Bearer ${expired}` } };
        const res = buildRes();
        const next = jest.fn();

        verifyToken(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: 'Invalid or expired token.' });
        expect(next).not.toHaveBeenCalled();
    });

    it('rejects a token signed with a different secret', () => {
        const token = jwt.sign({ userId: 1 }, 'some-other-secret', { expiresIn: '1h' });
        const req = { headers: { authorization: `Bearer ${token}` } };
        const res = buildRes();
        const next = jest.fn();

        verifyToken(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(next).not.toHaveBeenCalled();
    });

    it('accepts a valid token, attaches decoded payload to req.user, and calls next()', () => {
        const token = jwt.sign({ userId: 42, email: 'a@b.com' }, process.env.JWT_SECRET, { expiresIn: '1h' });
        const req = { headers: { authorization: `Bearer ${token}` } };
        const res = buildRes();
        const next = jest.fn();

        verifyToken(req, res, next);

        expect(next).toHaveBeenCalledTimes(1);
        expect(req.user).toMatchObject({ userId: 42, email: 'a@b.com' });
        expect(res.status).not.toHaveBeenCalled();
    });
});
