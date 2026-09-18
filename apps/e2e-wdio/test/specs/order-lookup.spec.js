const axios = require('axios');
const ProductsScreen = require('../pageobjects/ProductsScreen');
const CartScreen = require('../pageobjects/CartScreen');

class OrderLookupModal {
    get inputOrderId() { return $('//android.widget.EditText'); }
    get btnSearch() { return $('//android.widget.TextView[@text="Search"]/..'); }
    get resultTitle() { return $('//android.widget.TextView[contains(@text, "Order: ORD-")]'); }
    get btnClose() { return $('//android.widget.TextView[@text="X"]/..'); }
}
const OrderLookup = new OrderLookupModal();

describe('Mobile App - Order Lookup Flow', () => {

    beforeEach(async () => {
        await ProductsScreen.ensureLoggedIn();
    });

    it('should checkout, extract order ID, and search for it successfully', async () => {
        // 1. Setup: Seed cart via API
        const seedPayload = {
            name: 'lookup_test_cart',
            cart: [{ id: 2, name: 'Premium Widget', price: 29.99, quantity: 1 }]
        };
        await axios.post('http://localhost:3005/api/carts', seedPayload);
        
        // 2. Load Cart and Checkout
        await ProductsScreen.goToCart();
        await CartScreen.loadSavedCart('lookup_test_cart');
        await CartScreen.checkout();
        
        // 3. Extract Order ID from the success message
        const msg = await CartScreen.statusMessage.getText();
        // msg looks like: "Success! Order placed.\nOrder ID: ORD-123456"
        const orderId = msg.split('Order ID: ')[1];
        expect(orderId).toMatch(/^ORD-\d+$/);

        // Wait for auto-navigation back to products
        await browser.waitUntil(async () => {
            return await ProductsScreen.headerTitle.isDisplayed();
        }, { timeout: 5000 });
        
        // 4. Open Order Lookup Modal
        await ProductsScreen.searchIcon.click();
        
        // 5. Search for the extracted Order ID
        await OrderLookup.inputOrderId.setValue(orderId);
        await OrderLookup.btnSearch.click();
        
        // 6. Assert receipt data appears and matches
        const resultText = await OrderLookup.resultTitle.getText();
        expect(resultText).toEqual(`Order: ${orderId}`);
        
        // 7. Cleanup UI
        await OrderLookup.btnClose.click();
    });

});
