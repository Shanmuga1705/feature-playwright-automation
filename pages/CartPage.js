const { expect } = require('@playwright/test');

class CartPage{
    constructor(page){
        this.page = page;
        this.cartProducts = page.locator("li.items");
        this.productTitle = page.locator('.card-body b');
        this.checkout = page.locator("text=Checkout");
    }

    /* async verifyAddedProductIsDisplayed(){
        await this.cartProducts.waitFor();
        const bool = await this.getProductLocator(this.productTitle).isVisible(); //
        expect(bool).toBeTruthy();
		}*/


    async verifyAddedProductIsDisplayed(productName = 'ZARA COAT 3'){
        const productRow = this.page.locator('li.items').filter({ hasText: productName });
        await expect(productRow).toBeVisible();
    }

    async getProductLocator(productTitle){
        return this.page.locator("h3:has-text('"+productTitle+"')");//"+productTitle+" is a template literal used
    }

    async navigateToCheckout(){
        await this.checkout.click();
    }
}
module.exports = {CartPage};