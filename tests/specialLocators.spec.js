const {test, expect} = require('@playwright/test');

test('Special Locators', async ({page})=>{
    await page.goto('https://rahulshettyacademy.com/angularpractice/');
    await page.getByPlaceholder("Password").fill("Learning@83"); //Placeholder is used to fill the input field
    await page.getByLabel("Check me out if you Love IceCreams!").click();
    await page.getByLabel("Gender").selectOption("Female");
    await page.getByLabel("Employed").check(); //check is used to check the checkbox
    await page.getByRole("button", {name:"Submit"}).click();

    //5 seconds default timeout for expect assertions {timeout:10000} step level forced timeout
    await expect(page.getByText("Success! The Form has been submitted successfully!.")).toBeVisible({timeout: 10_000}); 
    //await page.getByText("Success! The Form has been submitted successfully!.").isVisible();
    
    await page.getByRole("link", {name:"Shop"}).click();
    await page.locator("app-card").filter({hasText:"Nokia Edge"}).getByRole("button").click();  //app-card is a tag name locator 
})

test('Test level timout configuration for expect', async ({page})=>{
    //page.setDefaultTimeout() affects actions only, NOT assertions.
    test.setTimeout(60000); //(applies to all actions in one test
    const slowExpect = expect.configure({timeout:9000}); //applies to all assertions in one test only
    await page.setDefaultTimeout(9000); //applies to all actions in one test
    await page.goto('https://rahulshettyacademy.com/angularpractice/');
    await page.getByPlaceholder("Password").fill("Learning@83"); //Placeholder is used to fill the input field
    await page.getByLabel("Check me out if you Love IceCreams!").click();
    await page.getByLabel("Gender").selectOption("Female");
    await page.getByLabel("Employed").check(); //check is used to check the checkbox
    await page.getByRole("button", {name:"Submit"}).click();

    //5 seconds default timeout for expect assertions {timeout:10000} step level forced timeout
    await slowExpect(page.getByText("Success! The Form has been submitted successfully!.")).toBeVisible({timeout: 10_000}); 
    //await page.getByText("Success! The Form has been submitted successfully!.").isVisible();
    
    await page.getByRole("link", {name:"Shop"}).click({timeout: 15000}); //step level forced timeout for click action
    await slowExpect(page.locator(".my-4").first()).toHaveText("Shop Name"); 
    await page.locator("app-card").filter({hasText:"Nokia Edge"}).getByRole("button").click();  //app-card is a tag name locator 
})

test('E2E flow with Special Locators App Login', async ({page})=>{
    
    const productName = 'ZARA COAT 3';
    const products = page.locator('.card-body');
    const email = 'jshanmugam@euclid.com';

    await page.goto('https://rahulshettyacademy.com/client/#/auth/login');
    await page.getByPlaceholder("email@example.com").fill(email);
    await page.getByPlaceholder("enter your passsword").fill("Window44$");
    await page.getByRole("button", {name:"Login"}).click();
    await page.waitForLoadState('networkidle');//The test waits for the network to be idle, indicating that all network requests have completed before proceeding with further actions or assertions
    
    await page.locator('.card-body b').first().waitFor();//The test waits for the first element with the class 'card-body' and the tag 'b' to be present in the DOM before proceeding with further actions or assertions    
    await page.locator('.card-body').filter({hasText:productName}).getByRole("button", {name:"Add To Cart"}).click();

    await page.getByRole("listitem").getByRole("button",{name:"Cart"}).click();//The test waits for the 'Cart' button within a 'listitem' to be present in the DOM before proceeding with further actions or assertions
    await page.locator("div li").first().waitFor(); //The test waits for the first 'li' element within a 'div' to be present in the DOM before proceeding with further actions or assertions
    await expect(page.getByText(productName)).toBeVisible(); 
   
    await page.getByRole("button", {name:"Checkout"}).click();
    //Personal Information
    await page.locator('input[type="text"]').first().fill('4542 9931 9292 2293'); // card number
    await page.locator('.input.ddl').nth(0).selectOption('05'); // expiry month
    await page.locator('.input.ddl').nth(1).selectOption('19'); // expiry date
    await page.locator('input[type="text"]').nth(1).fill('123'); // CVV
    await page.locator('input[type="text"]').nth(2).fill('Vignesh Shanmugam'); // name on card
    //await page.locator('input[name="coupon"]').fill('WELCOME10'); // coupon
    //await page.locator('button:has-text("Apply Coupon")').click(); // apply coupon
    //await expect(page.locator("text=* Invalid Coupon")).toBeVisible(); //The test waits for the text "* Invalid Coupon" to be present in the DOM before proceeding with further actions or assertions

   // await page.locator("[placeholder*='Country']").type("ind", {delay:100}); //to press sequentially the keys with a delay of 100ms between each key press, simulating a more realistic typing behavior and allowing time for any dynamic suggestions or autocomplete features to appear
    await page.getByPlaceholder("Country").pressSequentially("ind"); //to press sequentially the keys with a delay of 100ms between each key press, simulating a more realistic typing behavior and allowing time for any dynamic suggestions or autocomplete features to appear    
    await page.getByRole("button", {name:"India"}).nth(1).click(); //nth(1) is used to select the second button with the name "India"

    await page.getByText("PLACE ORDER").click();
    await expect(page.getByText("Thankyou for the order.")).toBeVisible();
    const rawOrderId = await page.locator(".em-spacer-1 .ng-star-inserted").textContent();
    const orderId = rawOrderId.replace(/[^a-zA-Z0-9]/g, ""); //removes all non-alphanumeric characters to replace | 6a60274b85b8849b49014cb2 | as 6a60274b85b8849b49014cb2
    console.log(orderId);

    await page.getByRole("listitem").getByRole("button",{name:"ORDERS"}).click();
    await page.locator("tbody").waitFor(); //The test waits for the element with the tag 'tbody' to be present in the DOM before proceeding with further actions or assertions
    const rows = await page.locator("tbody tr");
    await rows.filter({hasText:orderId}).getByRole("button", {name:"View"}).click();
    //const rowCount = await rows.count(); //await page.locator("tbody tr").count();
  
    const orderIdDetails = await page.locator(".col-text").textContent();
    const orderTitle = await page.locator(".title").textContent();
    
    expect(orderId.includes(orderIdDetails)).toBeTruthy(); //The test expects the 'orderId' variable to be included in the 'orderIdDetails' variable
    expect(orderTitle.includes(productName)).toBeTruthy(); //The test expects the 'orderTitle' variable to be included in the 'productName' variable
    }
);


