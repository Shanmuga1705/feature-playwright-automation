const {test, expect} = require('@playwright/test');
//JSON--> string --> js object
const dataSet = JSON.parse(JSON.stringify(require('../utils/placeOrderTestData.json'))); //The JSON.parse() function is used to parse a JSON string into a JavaScript object, and the JSON.stringify() function is used to convert a JavaScript object into a JSON string

//test.describe.configure({mode:'serial'});//The test.describe.configure() function is used to configure the behavior of the test.describe() function, which is used to group related tests together
//test.describe.configure({mode:'parallel'});//The test.describe.configure() function is used to configure the behavior of the test.describe() function, which is used to group related tests together
test('Shopping test case', async ({page})=>{
    await page.goto('https://rahulshettyacademy.com/client/#/auth/login');
    const userEmail = page.locator('#userEmail');
    const password = page.locator('#userPassword');
    const loginButton = page.locator('[name="login"]');
    const products = page.locator('.card-body b');

    await userEmail.fill("jshanmugam@euclid.com");
    await password.fill("Window44$");
    await page.locator('#login').click();
    await page.waitForLoadState('networkidle');//The test waits for the network to be idle, indicating that all network requests have completed before proceeding with further actions or assertions
    //await page.locator(".card-body b").first().waitFor();
   // console.log(await products.first().textContent());
    console.log(await products.allTextContents()); //The text contents of all elements with the class 'card-body' and the tag 'b' are logged to the console for verification or debugging purposes
    
})

test('Client App Login', async ({page})=>{
    await page.goto('https://rahulshettyacademy.com/client/#/auth/login');
    await page.locator('#userEmail').fill(dataSet.email);
    await page.locator('#userPassword').fill(dataSet.password);
    await page.locator("[value='Login']").click();
    await page.waitForLoadState('networkidle');//The test waits for the network to be idle, indicating that all network requests have completed before proceeding with further actions or assertions
    await page.locator('.card-body b').first().waitFor();//The test waits for the first element with the class 'card-body' and the tag 'b' to be present in the DOM before proceeding with further actions or assertions
    const titles = await page.locator('.card-body b').allTextContents();
    console.log(titles);
    const count = await products.count();

    for(let i=0; i<count; i++){     //let is used instead of var to limit the scope of the variable i to the block in which it is defined, preventing potential issues with variable hoisting and unintended side effects in asynchronous code
        if(await products.nth(i).locator('b').textContent() === dataSet.productName){ // ===
            await products.nth(i).locator("text= Add To Cart").click();
            break;
        }
    }
    await page.locator("[routerlink*='cart']").click();
    await page.locator("div li").first().waitFor(); //The test waits for the first 'li' element within a 'div' to be present in the DOM before proceeding with further actions or assertions
    const bool = await page.locator('h3:has-text("ZARA COAT 3")').isVisible(); //psuedo class selector to wait for the element with the text "ZARA COAT 3" to be present in the DOM before proceeding with further actions or assertions
    expect(bool).toBeTruthy(); //The test expects the boolean value to be true, indicating that the element with the text "ZARA COAT 3" is visible in the DOM

    await page.locator("text=Checkout").click();

    //Personal Information
    await page.locator('input[type="text"]').first().fill('4542 9931 9292 2293'); // card number
    await page.locator('.input.ddl').nth(0).selectOption('05'); // expiry month
    await page.locator('.input.ddl').nth(1).selectOption('19'); // expiry date
    await page.locator('input[type="text"]').nth(1).fill('123'); // CVV
    await page.locator('input[type="text"]').nth(2).fill('Vignesh Shanmugam'); // name on card
    //await page.locator('input[name="coupon"]').fill('WELCOME10'); // coupon
    //await page.locator('button:has-text("Apply Coupon")').click(); // apply coupon

    
   // await page.locator("[placeholder*='Country']").type("ind", {delay:100}); //to press sequentially the keys with a delay of 100ms between each key press, simulating a more realistic typing behavior and allowing time for any dynamic suggestions or autocomplete features to appear
    await page.locator("[placeholder*='Country']").pressSequentially("ind"); //to press sequentially the keys with a delay of 100ms between each key press, simulating a more realistic typing behavior and allowing time for any dynamic suggestions or autocomplete features to appear
    const dropdown = page.locator('.ta-results');
    await dropdown.waitFor(); //The test waits for the element with the class 'ta-results' to be present in the DOM before proceeding with further actions or assertions

    const optionsCount = await dropdown.locator("button").count();
    for(let i=0; i<optionsCount; i++){
        const text = await dropdown.locator("button").nth(i).textContent();
        if(text.trim() === "India"){
            await dropdown.locator("button").nth(i).click();
            break;
        }
    }

    await expect(page.locator(".user__name  [type='text']").first()).toHaveText(email); //The test expects the text content of the first element with the class 'user__name' and the type 'text' to be equal to the email variable, indicating that the user is logged in successfully
    await page.locator(".action__submit").click();
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
    expect(orderTitle.includes(dataSet.productName)).toBeTruthy();

    }
);
