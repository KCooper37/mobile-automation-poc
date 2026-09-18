class ProductsScreen {
    get headerTitle() { return $('~Awesome Shop'); }
    get searchIcon() { return $('~search-order-button'); }
    get cartIcon() { return $('~cart-icon-button'); }

    async ensureLoggedIn() {
        const loginButton = $('~login-button');
        await browser.waitUntil(async () =>
            await loginButton.isExisting() || await this.cartIcon.isExisting()
        );
        if (await loginButton.isExisting()) {
            await $('~username-input').setValue('admin');
            await $('~password-input').setValue('password');
            await loginButton.click();
        }
        await this.cartIcon.waitForDisplayed();
    }
    
    // In React Native, testID maps to ~accessibility-id in Appium
    async addToCart(productId) {
        const btn = await $(`~add-to-cart-${productId}`);
        await btn.click();
    }
    
    async goToCart() {
        await this.cartIcon.click();
    }
}
module.exports = new ProductsScreen();
