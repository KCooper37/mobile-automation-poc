const axios = require('axios');

describe('Order Lookup Flow', () => {
  beforeAll(async () => {
    await device.launchApp({ newInstance: true });
  });

  beforeEach(async () => {
    await device.launchApp({ delete: true });
    await element(by.id('username-input')).typeText('admin\n');
    await element(by.id('password-input')).typeText('password\n');
    await element(by.id('login-button')).tap();
  });

  it('should checkout, extract order ID from UI, and lookup the receipt', async () => {
    // 1. Manually add an item
    await element(by.id('add-to-cart-1')).tap();
    await element(by.id('cart-icon-button')).tap();
    
    // 2. Checkout
    await element(by.id('checkout-button')).tap();
    
    // 3. Extract Order ID
    // Detox allows getting attributes from UI elements
    const attributes = await element(by.id('checkout-status')).getAttributes();
    const text = attributes.text; // "Success! Order placed.\nOrder ID: ORD-123456"
    
    const orderId = text.split('Order ID: ')[1];
    
    // 4. Wait for auto-navigation back to products
    await expect(element(by.id('product-list'))).toBeVisible();

    // 5. Open Search Modal
    await element(by.id('search-order-button')).tap();

    // 6. Enter scraped ID and search
    await element(by.type('android.widget.EditText')).typeText(orderId);
    await element(by.text('Search')).tap();

    // 7. Validate Receipt Modal
    await expect(element(by.text(`Order: ${orderId}`))).toBeVisible();
    await element(by.text('X')).tap();
  });
});
