const request = require('supertest');
const app = require('../index');

describe('API Endpoints', () => {
    it('GET /api/products returns products list', async () => {
        const res = await request(app).get('/api/products');
        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBeTruthy();
        expect(res.body.length).toBeGreaterThan(0);
    });

    describe('POST /api/checkout', () => {
        it('returns success for valid cart array', async () => {
            const res = await request(app)
                .post('/api/checkout')
                .send({ cart: [{ id: 1 }] });
            expect(res.statusCode).toEqual(200);
            expect(res.body.success).toBe(true);
        });

        it('returns 400 when cart is missing', async () => {
            const res = await request(app)
                .post('/api/checkout')
                .send({});
            expect(res.statusCode).toEqual(400);
        });

        it('returns 400 when cart is not an array', async () => {
            const res = await request(app)
                .post('/api/checkout')
                .send({ cart: 'not an array' });
            expect(res.statusCode).toEqual(400);
        });
    });
});