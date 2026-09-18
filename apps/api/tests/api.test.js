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
        it('creates an order that can be retrieved by its ID', async () => {
            const cart = [{ id: 1, name: 'Sample Item', price: 9.99, quantity: 2 }];
            const res = await request(app)
                .post('/api/checkout')
                .send({ cart });
            expect(res.statusCode).toEqual(200);
            expect(res.body.success).toBe(true);
            expect(res.body.orderId).toMatch(/^ORD-\d+$/);

            const lookup = await request(app).get(`/api/orders/${res.body.orderId}`);
            expect(lookup.statusCode).toBe(200);
            expect(lookup.body).toEqual({
                success: true,
                order: { id: res.body.orderId, cart }
            });
        });

        it('returns 404 for an unknown order ID', async () => {
            const res = await request(app).get('/api/orders/ORD-does-not-exist');
            expect(res.statusCode).toBe(404);
            expect(res.body.success).toBe(false);
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
