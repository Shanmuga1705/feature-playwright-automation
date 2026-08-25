const {test, expect} = require('@playwright/test');//playwright package is imported to use the test function for writing test cases

test('Browser Context', async ({browser})=>{
   
    const context = await browser.newContext();//A new browser context is created to isolate the test environment
    const page = await context.newPage();//A new page is created within the browser context to perform actions and assertions
    const userName = page.locator('#username');
    const password = page.locator("input[type='password']");
    const signInButton = page.locator('#signInBtn');
    const cardTitles = page.locator(".card-body a");
   
    await page.goto('https://rahulshettyacademy.com/loginpagePractise/');//The page navigates to the specified URL (https://example.com) to perform actions and assertions on that page
    console.log(await page.title());//The title of the page is logged to the console for verification or debugging purposes
   
    await userName.fill("rahulshetty");
    await password.type("Learning@830$3mK2");
    await signInButton.click();

    console.log(await page.locator("[style*='block']").textContent());//The text content of an element with a specific style attribute is logged to the console for verification or debugging purposes
    await expect(page.locator("[style*='block']")).toContainText('Incorrect');//An assertion is made to verify that the text content of the element contains the expected value ('Incorrect'). If the assertion fails, the test will be marked as failed

    await userName.fill("");
    await userName.fill("rahulshettyacademy");
    await signInButton.click();
    console.log(await cardTitles.first().textContent());//The text content of the first anchor element within an element with the class 'card-body' is logged to the console for verification or debugging purposes
    console.log(await cardTitles.nth(1).textContent());//The text content of the second anchor element within an element with the class 'card-body' is logged to the console for verification or debugging purposes
   
   const allCardTitles = await cardTitles.allTextContents();
   console.log(allCardTitles);//The text contents of all anchor elements within an element with the class 'card-body' are logged to the console for verification or debugging purposes
    
});

test('Page Context', async ({page})=>{ //test.only is used to run only this specific test case, ignoring other test cases in the file
    await page.goto('https://google.com');//The page navigates to the specified URL (https://example.com) to perform actions and assertions on that page
    console.log(await page.title());
    await expect(page).toHaveTitle("Google");//An assertion is made to verify that the title of the page matches the expected value ("Example Domain"). If the assertion fails, the test will be marked as failed
});


test('UI Controls' , async({page})=>{

    await page.goto('https://rahulshettyacademy.com/loginpagePractise/');
    const userName = page.locator('#username');
    const signInButton = page.locator('#signInBtn');
    const dropdown = page.locator("select.form-control");
    const documentLink = page.locator("[href*='documents-request']");

    await dropdown.selectOption('consult');//The dropdown element is selected, and the option with the value 'consult' is chosen
    await page.locator(".radiotextsty").last().click();//The last radio button element with the class 'radiotextsty' is clicked
    await page.locator('#okayBtn').click();//The button element with the ID 'okayBtn' is clicked

    console.log(await page.locator('.radiotextsty').last().isChecked());//The checked state of the last radio button element with the class 'radiotextsty' is logged to the console for verification or debugging purposes
    await expect(page.locator('.radiotextsty').last()).toBeChecked();//An assertion is made to verify that the last radio button element with the class 'radiotextsty' is checked. If the assertion fails, the test will be marked as failed

    await page.locator('#terms').click();
    await expect(page.locator('#terms')).toBeChecked();//An assertion is made to verify that the checkbox element with the ID 'terms' is checked. If the assertion fails, the test will be marked as failed
    await page.locator('#terms').uncheck();
    await expect(page.locator('#terms')).not.toBeChecked();//An assertion is made to verify that the checkbox element with the ID 'terms' is not checked. If the assertion fails, the test will be marked as failed
    //expect(await page.locator('#terms')).isChecked().toBeFalsy();//An assertion is made to verify that the checkbox element with the ID 'terms' is not checked. If the assertion fails, the test will be marked as failed

    await expect(documentLink).toHaveAttribute("class", "blinkingText");//An assertion is made to verify that the anchor element with the specified href attribute has the expected class attribute value ("blinkingText"). If the assertion fails, the test will be marked as failed
});

test('Child Windows', async({browser})=>//browser is used to create a new browser context and page for testing child windows
    {
        const context = await browser.newContext();
        const page = await context.newPage();
        await page.goto('https://rahulshettyacademy.com/loginpagePractise/');
        const documentLink = page.locator("[href*='documents-request']");
        const userName = page.locator('#username');
        
        
        const [newPage] = await Promise.all([
        context.waitForEvent('page'),//listens for the 'page' event on the browser context, which is triggered when a new page (child window) is opened. It allows capturing the newly opened page for further actions and assertions
        documentLink.click(),
        ])//The document link is clicked, which triggers the opening of a new page (child window). The Promise.all() method is used to wait for both the 'page' event and the click action to complete before proceeding with further actions and assertions

    // const newPage = page.context().otherPage();//The otherPage() method is used to retrieve the newly opened page (child window) after clicking on the document link. It allows interaction with the child window for further actions and assertions
        const text = await newPage.locator(".red").textContent();
        console.log(text);
        const arrayText = text.split("@")
        const domain =  arrayText[1].split(" ")[0]
        
        await userName.fill(domain);
      //  await page.pause();
        //The page.pause() method is used to pause the execution of the test at this point, allowing manual inspection or debugging of the page state before proceeding with further actions and assertions
        console.log(await page.locator('#username').inputValue());//The input value is used instead of textContent to retrieve the value entered in the input field. It allows verification or debugging of the input value after filling it with the domain extracted from the child window
        //textContent is used to retrieve the visible text content of an element, while inputValue is used to retrieve the value entered in an input field. In this case, inputValue is more appropriate for verifying the value entered in the username input field after filling it with the domain extracted from the child window
})