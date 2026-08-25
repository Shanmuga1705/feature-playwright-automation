class CheckoutPage{
    constructor(page){
        this.page = page;

        //PII form Locators
        this.CardNumber = page.locator('input[type="text"]').first();
        this.expiryDate = page.locator('.input.ddl').nth(0);
        this.expiryMonth = page.locator('.input.ddl').nth(1);
        this.CVV = page.locator('input[type="text"]').nth(1);
        this.cardHolderName = page.locator('input[type="text"]').nth(2);
        //Coupon form Locators
        this.coupon = page.locator('input[name="coupon"]');
        this.applyCoupon = page.locator('button:has-text("Apply Coupon")');

        //Shipping Information Locators
        this.country = page.locator("[placeholder*='Country']");
        this.dropdown = page.locator(".ta-results");
        this.optionsCount = dropdown.locator(".ta-results button").count();     
        this.email = page.locator(".user__name  [type='text']").first();
        this.placeOrder = page.locator(".action__submit");
    }
    async fillPersonalInfoForm(){
            await this.CardNumber.fill('4542 9931 9292 2293'); // card number
            await this.expiryMonth.selectOption('05'); // expiry month
            await this.expiryDate.selectOption('19'); // expiry date
            await this.CVV.fill('123'); // CVV
            await this.cardHolderName.fill('Vignesh Shanmugam'); // name on card
        }

    async selectCountry(countryName)
    {
        await this.country.pressSequentially(countryName); 
        await this.dropdown.waitFor(); 
        for(let i=0; i<optionsCount; i++){
            const text = await dropdown.locator("button").nth(i).textContent();
            if(text.trim() === "India"){
            await dropdown.locator("button").nth(i).click();
            break;
            }
        }
    }

    async verifyEmailIsDisplayed(){
        await expect(this.email).toHaveText(email);
    }

    async clickPlaceOrder(){
        await this.placeOrder.click();
    }
}
module.export = {CheckoutPage};