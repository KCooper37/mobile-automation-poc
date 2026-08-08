describe('Save Cart Flow', () => {
  beforeAll(async () => {
    await device.launchApp({ newInstance: true });
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should stack identical items, calculate total, and save the cart', async () => {
    // 1. Add 'Sample Item' to cart 3 times to test stacking logic
    await element(by.label('Add Sample Item to cart')).tap();
    await element(by.label('Add Sample Item to cart')).tap();
    await element(by.label('Add Sample Item to cart')).tap();

    // 2. Navigate to Cart
    await element(by.id('cart-icon-button')).tap();

    // 3. Assert quantity stacking (should display Qty: 3)
    await expect(element(by.text('Qty: 3'))).toBeVisible();

    // 4. Assert total amount (3 * 9.99 = 29.97)
    await expect(element(by.text('$29.97'))).toBeVisible();

    // 5. Save the cart
    await element(by.type('android.widget.EditText')).typeText('detox_saved_cart');
    
    // Tap return/enter on the keyboard or tap out to dismiss keyboard
    await element(by.id('cart-icon-button')).swipe('down', 'fast', 0.5); // Example way to hide keyboard if needed
    
    // Tap the save button
    await element(by.text('Save Cart')).tap();

    // 6. Assert success message and ensure the new saved cart button appears
    await expect(element(by.text("Cart 'detox_saved_cart' saved!"))).toBeVisible();
    await expect(element(by.text('detox_saved_cart'))).toBeVisible();
  });
});
