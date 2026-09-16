const { expect } = require('@playwright/test');

class CheckoutPage {
    constructor(page) {
        this.page = page;

        // PII form locators
        this.cardNumber = page.locator('input[type="text"]').first();
        this.expiryMonth = page.locator('.input.ddl').nth(0);
        this.expiryDate = page.locator('.input.ddl').nth(1);
        this.cvv = page.locator('input[type="text"]').nth(1);
        this.cardHolderName = page.locator('input[type="text"]').nth(2);

        // Coupon form locators
        this.coupon = page.locator('input[name="coupon"]');
        this.applyCoupon = page.locator('button:has-text("Apply Coupon")');

        // Shipping information locators
        this.country = page.locator("[placeholder*='Country']");
        this.dropdown = page.locator('.ta-results');
        this.email = page.locator(".user__name [type='text']").first();
        this.placeOrder = page.locator('.action__submit');
    }

    async fillPersonalInfoForm() {
        await this.cardNumber.fill('4542 9931 9292 2293');
        await this.expiryMonth.selectOption('05');
        await this.expiryDate.selectOption('19');
        await this.cvv.fill('123');
        await this.cardHolderName.fill('Vignesh Shanmugam');
    }

    async selectCountry(countryName = 'India') {
        await this.country.pressSequentially(countryName);
        await this.dropdown.waitFor();

        const options = this.dropdown.locator('button');
        const optionCount = await options.count();

        for (let i = 0; i < optionCount; i++) {
            const text = await options.nth(i).textContent();
            if (text && text.trim() === countryName) {
                await options.nth(i).click();
                break;
            }
        }
    }

    async verifyEmailIsDisplayed(email) {
        await expect(this.email).toHaveText(email);
    }

    async clickPlaceOrder() {
        await this.placeOrder.click();
    }
}

module.exports = { CheckoutPage };