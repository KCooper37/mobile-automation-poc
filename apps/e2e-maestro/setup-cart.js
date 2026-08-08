// Maestro scripts run in a restricted Rhino JS environment, but they can use fetch() natively!

const payload = {
    name: "maestro_e2e_cart",
    cart: [
        { id: 1, name: "Sample Item", price: 9.99, quantity: 2 },
        { id: 3, name: "Super Gadget", price: 49.99, quantity: 1 }
    ]
};

try {
    const response = http.post(
        'http://localhost:3005/api/carts',
        JSON.stringify(payload),
        { 'Content-Type': 'application/json' }
    );
    console.log("Cart seeded successfully via Maestro API call.");
} catch (e) {
    console.log("Failed to seed cart via API: " + e);
}
