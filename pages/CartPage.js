class CartPage{
    constructor(page){
        this.page = page;
        this.cartProducts = page.locator("div li");
        this.productTitle = page.locator('.card-body b');
        this.checkout = page.locator("text=Checkout");
    }

    async verifyAddedProductIsDisplayed(){
        await this.cartProducts.waitFor();
        const bool = await this.getProductLocator(this.productTitle).isVisible(); //
        expect(bool).toBeTruthy(); //The test expects the boolean value to be true, indicating that the element with the text "ZARA COAT 3" is visible in the DOM
    }

    async getProductLocator(productTitle){
        return this.page.locator("h3:has-text('"+productTitle+"')");//"+productTitle+" is a template literal used
    }

    async navigateToCheckout(){
        await this.checkout.click();
    }
}
module.exports = {CartPage};