class DashboardPage{
    
    constructor(page){
        this.page = page;
        this.products = page.locator('.card-body');
        this.productTitle = page.locator('.card-body b');
        this.cart = page.locator("[routerlink*='cart']");

    }

    async searchProductAddCart(productName = 'ZARA COAT 3') {
        await this.productTitle.first().waitFor();
        const titles = await this.productTitle.allTextContents();
        console.log(titles);
        const count = await this.products.count();

        for (let i = 0; i < count; i++) {
            if ((await this.products.nth(i).locator('b').textContent()) === productName) {
                await this.products.nth(i).locator("text= Add To Cart").click();
                break;
            }
        }
    }

    async navigateToCart(){
        await this.cart.click();
    }
 
}
module.exports = {DashboardPage};