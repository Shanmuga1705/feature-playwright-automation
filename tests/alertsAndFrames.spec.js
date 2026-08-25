const {test, expect} = require('@playwright/test');

test("Alerts and Frames Test", async ({page})=>{

    await page.goto("https://rahulshettyacademy.com/AutomationPractice/");

    await expect(page.locator("#displayed-text")).toBeVisible();
    await page.locator("#hide-textbox").click();
    await expect(page.locator("#displayed-text")).toBeHidden();//to check if the element is hidden
    page.on('dialog', dialog => dialog.accept()); //to accept the alert and on is an event listener used to handle the alert
     // page.on('dialog', dialog => dialog.dismiss()); //to dismiss the alert
    await page.locator("#confirmbtn").click();

    await page.locator("#mousehover").hover();//to hover over the element
    const framesPage = await page.frameLocator("#courses-iframe");//frames can be located by iframe locator
    await framesPage.locator("a[href*='mentorship']:visible").click(); //:visible is used to make sure the element is visible and not hidden if there are multiple matching locators
     

    const blinkingText = framesPage.locator(".blinkingText");
    await expect(blinkingText).toBeVisible();
    console.log(await blinkingText.textContent());
})