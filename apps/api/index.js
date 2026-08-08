const express = require('express');
const app = express();
app.use(express.json());

const products = [
    { id: 1, name: 'Sample Item', price: 9.99 },
    { id: 2, name: 'Premium Widget', price: 29.99 },
    { id: 3, name: 'Super Gadget', price: 49.99 },
    { id: 4, name: 'Basic Thing', price: 4.99 }
];

// Dictionary to hold saved carts by name
let savedCarts = {};

// Dictionary to hold completed orders by orderId
let orders = {};

app.get('/api/products', (req, res) => {
    res.json(products);
});

app.get('/api/carts', (req, res) => {
    // Seed a default cart if empty
    if (Object.keys(savedCarts).length === 0) {
        savedCarts['Seed Cart 1'] = [
            { ...products[0], quantity: 2 },
            { ...products[2], quantity: 1 }
        ];
    }
    // Return array of saved carts { name, cart }
    const cartsList = Object.keys(savedCarts).map(name => ({
        name,
        cart: savedCarts[name]
    }));
    res.json({ carts: cartsList });
});

app.post('/api/carts', (req, res) => {
    const { name, cart } = req.body;
    if (!name || !cart || !Array.isArray(cart)) {
        return res.status(400).json({ success: false, message: 'Invalid payload' });
    }
    savedCarts[name] = cart;
    res.json({ success: true, message: 'Cart saved successfully' });
});

app.post('/api/checkout', (req, res) => {
    const { cart } = req.body;
    if (!cart || !Array.isArray(cart)) {
        return res.status(400).json({ success: false, message: 'Invalid cart payload' });
    }
    const orderId = 'ORD-' + Math.floor(Math.random() * 1000000);
    orders[orderId] = cart; // Save the order details
    res.json({ success: true, message: 'Order received', orderId });
});

app.get('/api/orders/:id', (req, res) => {
    const orderId = req.params.id;
    const orderCart = orders[orderId];
    if (orderCart) {
        res.json({ success: true, order: { id: orderId, cart: orderCart } });
    } else {
        res.status(404).json({ success: false, message: 'Order not found' });
    }
});

module.exports = app;

if (require.main === module) {
    app.listen(3005, '0.0.0.0', () => console.log('API listening on port 3005 on all interfaces'));
}