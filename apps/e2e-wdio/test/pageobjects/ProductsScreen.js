class ProductsScreen {
    get headerTitle() { return $('~Awesome Shop'); }
    get searchIcon() { return $('~search-order-button'); }
    get cartIcon() { return $('~cart-icon-button'); }
    
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
