const axios = require('axios');
const ProductsScreen = require('../pageobjects/ProductsScreen');
const CartScreen = require('../pageobjects/CartScreen');

describe('Mobile App - Core Checkout', () => {

    beforeEach(async () => {
        await ProductsScreen.ensureLoggedIn();
    });

    it('should inject state via API and checkout', async () => {
        // 1. Setup: Seed the cart via API before testing the UI
        const seedPayload = {
            name: 'e2e_wdio_test',
            cart: [
                { id: 4, name: 'Basic Thing', price: 4.99, quantity: 3 }
            ]
        };
        
        await axios.post('http://localhost:3005/api/carts', seedPayload);
        
        // 2. Navigate to Cart Screen
        await ProductsScreen.goToCart();
        
        // 3. Load the injected cart via UI
        await CartScreen.loadSavedCart('e2e_wdio_test');
        
        // 4. Perform Checkout
        await CartScreen.checkout();
        
        // 5. Assert Success and capture Order ID
        const msg = await CartScreen.statusMessage.getText();
        expect(msg).toContain('Success! Order placed.');
        expect(msg).toContain('Order ID: ORD-');
    });

});
