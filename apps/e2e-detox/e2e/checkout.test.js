const axios = require('axios');

describe('Core Checkout Flow', () => {
  beforeAll(async () => {
    await device.launchApp({ newInstance: true });
  });

  beforeEach(async () => {
    await device.launchApp({ delete: true });
    await element(by.id('username-input')).typeText('admin\n');
    await element(by.id('password-input')).typeText('password\n');
    await element(by.id('login-button')).tap();
  });

  it('should seed data via API, load cart, and checkout', async () => {
    // 1. API Setup
    await axios.post('http://10.0.2.2:3005/api/carts', {
      name: 'detox_cart',
      cart: [{ id: 1, name: 'Sample Item', price: 9.99, quantity: 2 }]
    });

    // 2. Navigate to Cart
    await element(by.id('cart-icon-button')).tap();

    // 3. Load the seeded cart
    // Detox allows matching by text, similar to Maestro
    await element(by.text('detox_cart')).tap();

    // 4. Assert total matches expected calculation (2 * 9.99 = 19.98)
    await expect(element(by.text('$19.98'))).toBeVisible();

    // 5. Checkout
    await element(by.label('Checkout Cart')).tap();

    // 6. Assert success status appears
    await expect(element(by.id('checkout-status'))).toHaveText('Success! Order placed.');
  });
});
