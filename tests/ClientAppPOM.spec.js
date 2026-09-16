const {test, expect} = require('@playwright/test');
const {LoginPage} = require('../pages/LoginPage'); //we have .. as path of pages is outside the package test folder
const {DashboardPage} = require('../pages/DashboardPage');
const {CartPage} = require('../pages/CartPage');
const {CheckoutPage} = require('../pages/CheckoutPage');
const { log } = require('node:console');
const dataSet = JSON.parse(JSON.stringify(require('../utils/placeOrderTestData.json'))); //The JSON.parse() function is used to parse a JSON string into a JavaScript object, and the JSON.stringify() function is used to convert a JavaScript object into a JSON string

for (const data of dataSet) { //test data parameterization for multiple data sets, the test will run for each data set in the array
test(`Client App with Page Object Model for ${data.productName}`, async ({page})=>{
    
    const productName = data.productName;
    const products = page.locator('.card-body');
    const email = data.email;
    const password = data.password;

    const loginPage = new LoginPage(page);
    await loginPage.goTo();
    await loginPage.login(email, password);
    
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.searchProductAddCart(productName);
    await dashboardPage.navigateToCart();

    const cartPage = new CartPage(page);
    await cartPage.verifyAddedProductIsDisplayed(productName);
    await cartPage.navigateToCheckout();

    const checkoutPage = new CheckoutPage(page);
    await checkoutPage.fillPersonalInfoForm();
    await checkoutPage.selectCountry();

    await checkoutPage.verifyEmailIsDisplayed(email);
    await checkoutPage.clickPlaceOrder();

    await expect(page.locator(".hero-primary")).toHaveText(" Thankyou for the order. "); //The test expects the text content of the element with the class 'hero-primary' to be equal to "THANKYOU FOR THE ORDER.", indicating that the order has been placed successfully
    const orderId = await page.locator(".em-spacer-1 .ng-star-inserted").textContent();
    console.log(orderId);

    await page.locator("button[routerlink*='myorders']").click();
    await page.locator("tbody").waitFor(); //The test waits for the element with the tag 'tbody' to be present in the DOM before proceeding with further actions or assertions
    const rows = await page.locator("tbody tr");
    const rowCount = await rows.count(); //await page.locator("tbody tr").count();
    for(let i=0; i<rowCount; i++){
        const rowOrderId = await rows.nth(i).locator("th").textContent(); //rowOrderId is the order id of the current row
        if(orderId.includes(rowOrderId)){ //if OrderId is present in the current row
            await rows.nth(i).locator(".btn-primary").click();
            break;            
        }
    }
    const orderIdDetails = await page.locator(".col-text").textContent();
    const orderTitle = await page.locator(".title").textContent();
    
    expect(orderId.includes(orderIdDetails)).toBeTruthy();
    expect(orderTitle.includes(productName)).toBeTruthy();

    }
);
}
