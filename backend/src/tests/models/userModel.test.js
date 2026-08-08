jest.mock('../../config/db', () => ({
    query: jest.fn(),
}));

const pool = require('../../config/db');
const {
    findUserByEmail,
    findUserById,
    createUser,
    updateUserProfile,
} = require('../../models/userModel');

beforeEach(() => {
    jest.clearAllMocks();
});

describe('findUserByEmail', () => {
    it('queries by email and returns all matching rows', async () => {
        const rows = [{ id: 1, email: 'a@b.com' }];
        pool.query.mockResolvedValue([rows]);

        const result = await findUserByEmail('a@b.com');

        expect(pool.query).toHaveBeenCalledWith(
            expect.stringContaining('SELECT * FROM users WHERE email = ?'),
            ['a@b.com']
        );
        expect(result).toBe(rows);
    });
});

describe('findUserById', () => {
    it('returns the first row when a user is found', async () => {
        const row = { id: 1, name: 'Jane' };
        pool.query.mockResolvedValue([[row]]);

        const result = await findUserById(1);

        expect(pool.query).toHaveBeenCalledWith(expect.any(String), [1]);
        expect(result).toBe(row);
    });

    it('returns null when no user is found', async () => {
        pool.query.mockResolvedValue([[]]);

        const result = await findUserById(999);

        expect(result).toBeNull();
    });
});

describe('createUser', () => {
    it('inserts the user with the given fields and returns the insert result', async () => {
        const insertResult = { insertId: 7 };
        pool.query.mockResolvedValue([insertResult]);

        const result = await createUser({ name: 'Jane', email: 'a@b.com', password: 'hashed' });

        expect(pool.query).toHaveBeenCalledWith(
            expect.stringContaining('INSERT INTO users'),
            ['Jane', 'a@b.com', 'hashed']
        );
        expect(result).toBe(insertResult);
    });
});

describe('updateUserProfile', () => {
    it('updates only the provided fields and re-fetches the user', async () => {
        pool.query
            .mockResolvedValueOnce([{}]) // UPDATE
            .mockResolvedValueOnce([[{ id: 1, name: 'New Name' }]]); // findUserById

        const result = await updateUserProfile(1, { name: 'New Name', phone: undefined, city: undefined, state: undefined });

        expect(pool.query).toHaveBeenNthCalledWith(
            1,
            expect.stringContaining('UPDATE users SET name = ? WHERE id = ?'),
            ['New Name', 1]
        );
        expect(result).toEqual({ id: 1, name: 'New Name' });
    });

    it('builds a SET clause covering every provided field, in order', async () => {
        pool.query
            .mockResolvedValueOnce([{}])
            .mockResolvedValueOnce([[{ id: 1 }]]);

        await updateUserProfile(1, { name: 'N', phone: 'P', city: 'C', state: 'S' });

        expect(pool.query).toHaveBeenNthCalledWith(
            1,
            expect.stringContaining('name = ?, phone = ?, city = ?, state = ?'),
            ['N', 'P', 'C', 'S', 1]
        );
    });

    it('skips the UPDATE query entirely when no fields are provided', async () => {
        pool.query.mockResolvedValueOnce([[{ id: 1 }]]); // only findUserById

        const result = await updateUserProfile(1, {});

        expect(pool.query).toHaveBeenCalledTimes(1);
        expect(pool.query).toHaveBeenCalledWith(expect.stringContaining('SELECT'), [1]);
        expect(result).toEqual({ id: 1 });
    });
});
