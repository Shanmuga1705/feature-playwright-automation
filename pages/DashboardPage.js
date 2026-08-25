class DashboardPage{
    
    constructor(page){
        this.page = page;
        this.products = page.locator('.card-body');
        this.productTitle = page.locator('.card-body b');
        this.cart = page.locator("[routerlink*='cart']");

    }

    async searchProductAddCart(){
        const productName = 'ZARA COAT 3';

        await this.productTitle.first().waitFor();//The test waits for the first element with the class 'card-body' and the tag 'b' to be present in the DOM before proceeding with further actions or assertions
        const titles = await this.productTitle.allTextContents();
        console.log(titles);
        const count = await this.products.count();
        
            for(let i=0; i<count; i++){     //let is used instead of var to limit the scope of the variable i to the block in which it is defined, preventing potential issues with variable hoisting and unintended side effects in asynchronous code
                if(await this.products.nth(i).locator('b').textContent() === productName){ // ===
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