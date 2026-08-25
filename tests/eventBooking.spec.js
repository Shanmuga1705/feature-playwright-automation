const {test, expect} = require('@playwright/test');
//const USER_EMAIL    = 'jshanmugam@euclid.com';// update email and password with your account
//const USER_PASSWORD = 'Window44$';

const USER = {
email: 'jshanmugam@euclid.com',
password: 'Window44$'
};


async function loginEventHub(page) {
    await page.goto('https://eventhub.rahulshettyacademy.com');
    await page.getByPlaceholder("you@email.com").fill(USER.email);
    await page.getByRole("textbox", {name:"password"}).fill(USER.password);
    await page.getByRole("button", {name:"Sign In"}).click();
    await page.waitForLoadState('networkidle');//The test waits for the network to be idle, indicating that all network requests have completed before proceeding with further actions or assertions
    await expect(page.locator("text=Browse Events →")).toBeVisible();
}

 async function futureDateValue() {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 7);
    futureDate.setHours(12, 0, 0, 0);

    const year = futureDate.getFullYear();
    const month = String(futureDate.getMonth() + 1).padStart(2, '0');
    const day = String(futureDate.getDate()).padStart(2, '0');
    const hours = String(futureDate.getHours()).padStart(2, '0');
    const minutes = String(futureDate.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}`;
}

test('Event Booking Test', async({page})=>{
    const eventTitle = `Test Event ${Date.now()}`;

    await loginEventHub(page);

    

    //Step 2 — Create a new event
    await page.getByRole("button", {name:"Admin"}).click();
    await page.locator(".absolute a").filter({hasText:"Manage Events"}).click(); //The test waits for the 'Manage Events' link to be present in the DOM before proceeding with further actions or assertions
    await page.locator("input[id='event-title-input']").fill(eventTitle);
    await page.locator("#admin-event-form textarea").fill("A great event for learning and networking."); //#admin-event-form textarea is a css selector where text area is child of an id attribute admin-event-form
    await page.getByLabel("City").fill("Chennai");
    await page.getByLabel("Venue").fill("Saravana Stores, Usmaan Road, T Nagar");
    await page.getByLabel("Event Date & Time").fill(await futureDateValue()); 
    await page.getByLabel("Price ($)").fill("100");
    await page.getByLabel("Total Seats").fill("50");
    await page.getByTestId("add-event-btn").click(); //getByTestId is a custom locator that targets elements based on their data-testid attribute
    await expect(page.getByText('Event created!')).toBeVisible(); // Wait for success toast

    //Step 3 — Find the event card and capture seats
    await page.locator("#nav-events").click();
    const eventCards = page.getByTestId("event-card");// Get all event cards 
    await expect(eventCards.first()).toBeVisible(); //Assert the first card is visible (confirms page loaded)
    
    const eventCard = eventCards.filter({hasText: eventTitle}); //From all cards, filter for the one that contains your event title text
    await expect(eventCard).toBeVisible(); //Assert that the filtered card is visible (confirms the event exists)

    const seatsBeforeBookingText = await eventCard.locator("text=seats available").first().textContent(); 
    const seatsBeforeBooking = parseInt(seatsBeforeBookingText.match(/\d+/)[0], 10); // Extract the numeric value from the text using regex
    console.log(seatsBeforeBooking);

    //Step 4 — Start booking
    await eventCard.getByTestId("book-now-btn").click();

    //Step 5 — Fill booking form
    const ticketCount = page.locator('#ticket-count');
    await expect(ticketCount).toHaveText('1');
    await page.getByLabel("Name").fill("Shanmugam Vignesh");
    await page.locator("#customer-email").fill(USER.email);
    await page.getByPlaceholder("+91 98765 43210").fill("6998591234");
    await page.locator(".confirm-booking-btn").click();

    //Step 6 — Verify booking confirmation
    await expect(page.locator(".booking-ref").first()).toBeVisible();
    const bookingRefText = await page.locator(".booking-ref").first().innerText(); //innerText returns the text content of the element
    const bookingRef = bookingRefText.trim();
    console.log(bookingRef);    

    //Step 7 — Verify in My Bookings
    await page.getByRole("link", {name:"View My Bookings"}).click();
  //  await expect(page).toHaveURL("https://eventhub.rahulshettyacademy.com/bookings");
    await expect(page).toHaveURL(/.*bookings/); //regex to match any string that ends with "bookings" where .* matches any characters,
    const bookingCards = page.locator("#booking-card");
    await expect(bookingCards.first()).toBeVisible();
    //const tickets = await bookingCards.locator("text=tickets");
    
    const matchedBookingCard = bookingCards.filter({hasText: bookingRef});
    await expect(matchedBookingCard).toBeVisible();
    await expect(matchedBookingCard).toContainText(eventTitle);//Assert that the event title is present in the booking card

    //Step 8 — Verify seat reduction
    await page.locator("#nav-events").click();
    await expect(eventCards.first()).toBeVisible(); 
    await expect(eventCard).toBeVisible();

    

    const seatsAfterBookingtext = await eventCard.getByText(/seats available/i).first().innerText(); //Use regex to match "seats available"
    const seatsAfterBooking = parseInt(seatsAfterBookingtext.match(/\d+/)[0], 10); // Extract the numeric value from the text using regex
    console.log(seatsAfterBooking);
    expect(seatsAfterBooking).toEqual(seatsBeforeBooking - 1); //Assert that the number of available seats has reduced by 1

})

test('Refund Eligibility Check', async ({page})=>{
    await loginEventHub(page);
    await page.locator("#nav-events").click();

    //Step 2 — Book first event with 1 ticket 
    const eventCards = page.getByTestId("event-card");// Get all event cards 
    await expect(eventCards.first()).toBeVisible();
    eventCards.first().getByTestId("book-now-btn").click();
    await page.getByLabel("Name").fill("Shanmugam Vignesh");
    await page.locator("#customer-email").fill(USER.email);
    await page.getByPlaceholder("+91 98765 43210").fill("6998591234");
    await page.locator(".confirm-booking-btn").click();

    //Step 3 — Navigate to booking detail
    await page.getByRole("button", {name:"View My Bookings"}).click();
    await expect(page).toHaveURL(/.*bookings/); //regex to match any string that ends with "bookings" where .* matches any characters,
    await page.getByRole("button", {name:"View Details"}).first().click();
    await expect(page.getByText('Booking Information')).toBeVisible();

    //Step 4 — Validate booking ref
    await page.locator(".mb-2 span").first().waitFor(); //The test waits for the first 'span' element within a '.mb-2' to be present in the DOM before proceeding with further actions or assertions
    const bookingRef = (await page.locator(".mb-2 span").first().innerText()).trim(); //innerText returns the text content of the element

    const eventTitle = (await page.locator(".text-2xl").innerText()).trim();
    console.log(eventTitle);
    //first character of booking ref equals first character of event title
    expect(bookingRef.charAt(0)).toEqual(eventTitle.charAt(0));

    //Step 5 — Check refund eligibility
    await page.getByTestId("check-refund-btn").click();
    await expect(page.locator("#refund-spinner")).toBeVisible();
    await expect(page.locator("#refund-spinner")).toBeHidden({timeout: 6000}); //Assert: spinner is no longer visible within 6 seconds
    //Assert: spinner is no longer visible within 6 seconds

    //Step 6 — Validate result
    const refundEligibility = page.locator("#refund-result");
    console.log(refundEligibility);
    await expect(refundEligibility).toContainText("Eligible for refund");
    await expect(refundEligibility).toContainText("Single-ticket bookings qualify for a full refund");

})

test.only('Group booking Refund Eligibility Check', async ({page})=>{
    await loginEventHub(page);
    await page.locator("#nav-events").click();
    const eventCards = page.getByTestId("event-card");
    await expect(eventCards.first()).toBeVisible();
    eventCards.first().getByTestId("book-now-btn").click();
   // await page.getByRole("button", {hasText:"+"}).click(); //Increase ticket count to 2
    //await page.getByRole("button", {hasText:"+"}).click(); 
    await page.locator('button:has-text("+")').first().click();
    await page.locator('button:has-text("+")').first().click();

    await page.getByLabel("Name").fill("Shanmugam Vignesh");
    await page.locator("#customer-email").fill(USER.email);
    await page.getByPlaceholder("+91 98765 43210").fill("6998591234");
    await page.locator(".confirm-booking-btn").click();

    await page.getByRole("button", {name:"View My Bookings"}).click();
    await expect(page).toHaveURL(/.*bookings/);
    await page.getByRole("button", {name:"View Details"}).first().click();
    await expect(page.getByText('Booking Information')).toBeVisible();

    await page.locator(".mb-2 span").first().waitFor(); //The test waits for the first 'span' element within a '.mb-2' to be present in the DOM before proceeding with further actions or assertions
    const bookingRef = (await page.locator(".mb-2 span").first().innerText()).trim(); //innerText returns the text content of the element

    const eventTitle = (await page.locator(".text-2xl").innerText()).trim();
    console.log(eventTitle);
    //first character of booking ref equals first character of event title
    expect(bookingRef.charAt(0)).toEqual(eventTitle.charAt(0));

    await page.getByTestId("check-refund-btn").click();
    await expect(page.locator("#refund-spinner")).toBeVisible();
    await expect(page.locator("#refund-spinner")).toBeHidden({timeout: 6000});

    const refundEligibility = page.locator("#refund-result");
    console.log(refundEligibility);
    await expect(refundEligibility).toContainText("Not eligible for refund");
    await expect(refundEligibility).toContainText("Group bookings (3 tickets) are non-refundable");



})
