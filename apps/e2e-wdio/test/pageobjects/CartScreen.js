class CartScreen {
    get headerTitle() { return $('//android.widget.TextView[@text="Your Cart"]'); }
    get btnCheckout() { return $('~checkout-button'); }
    get statusMessage() { return $('~checkout-status'); }
    get btnLoadCart() { return $('~load-cart-button'); }
    get btnSaveCart() { return $('~save-cart-button'); }
    get inputCartName() { return $('//android.widget.EditText'); }
    
    async loadSavedCart(cartName) {
        // Find the text element inside the pill button
        const loadBtn = await $(`//android.widget.TextView[@text="${cartName}"]`);
        await loadBtn.click();
    }
    
    async checkout() {
        await this.btnCheckout.click();
    }
}
module.exports = new CartScreen();
