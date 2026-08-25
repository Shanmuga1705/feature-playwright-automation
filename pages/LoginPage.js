class LoginPage{
    constructor(page){
        this.page = page;
        this.email = page.locator('#userEmail');
        this.password = page.locator('#userPassword');
        this.loginButton = page.locator("[value='Login']");
    }

    async goTo(){
        await this.page.goto('https://rahulshettyacademy.com/client/#/auth/login');
    }

    async login(email, password){
        await this.email.fill(email);
        await this.password.fill(password);
        await this.loginButton.click();
        await this.page.waitForLoadState('networkidle');//The test waits for the network to be idle, indicating that all network requests have completed before proceeding with further actions or assertions
    }
}
module.exports = {LoginPage};