const express = require('express');
const app = express();
app.use(express.json());

app.get('/api/products', (req, res) => {
    res.json([{ id: 1, name: 'Sample Item', price: 9.99 }]);
});

app.post('/api/checkout', (req, res) => {
    const { cart } = req.body;
    if (!cart || !Array.isArray(cart)) {
        return res.status(400).json({ success: false, message: 'Invalid cart payload' });
    }
    res.json({ success: true, message: 'Order received' });
});

module.exports = app;

if (require.main === module) {
    app.listen(3001, () => console.log('API listening on port 3001'));
}