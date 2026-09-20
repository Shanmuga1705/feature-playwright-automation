const {test, expect} = require('@playwright/test');

test('Child Window Handling', async ({page,context})=>{
    await page.goto('https://rahulshettyacademy.com/loginpagePractise/');
    const documentLink = page.locator("[href*='documents-request']");

    await expect(documentLink).toBeVisible(); //assert that the document link is visible on the page

    const [newPage] = await Promise.all([
        context.waitForEvent('page'), //wait for the new page to be opened
        documentLink.click(), //click on the document link to open the new page 
    ])

    await newPage.waitForLoadState(); //wait for the new page to load completely
    await expect(newPage).toHaveURL(/documents-request/); //assert that the new page has the expected URL
    await newPage.getByText('JOIN NOW').click(); //click on the JOIN NOW button on the new page

})