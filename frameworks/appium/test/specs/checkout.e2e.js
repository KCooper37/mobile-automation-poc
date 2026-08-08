describe('Checkout flow', () => {
    it('should complete checkout successfully', async () => {
        const button = await $('~checkout-button');
        await button.click();

        const status = await $('~checkout-status');
        await status.waitForDisplayed();
        expect(await status.isDisplayed()).toBe(true);
    });
});
