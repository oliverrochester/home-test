// page-objects/LoginPage.js
class LoginPage {
    constructor(page) {
      this.page = page;
      this.usernameInput = page.locator('input[id="username"]');
      this.passwordInput = page.locator('input[id="password"]');
      this.signinButton = page.locator('button[id="signin-button"]');
      this.loginErrorMessageContainer = page.locator('div[class="input-group"]').nth(2);
      this.loginErrorMessage = this.loginErrorMessageContainer.locator('h2[id="message"]');
    }
  
    async navigate() {
      await this.page.goto('http://localhost:3100/login'); // Replace with your login URL
    }
  
    async login(username, password) {
      await this.usernameInput.fill(username);
      await this.passwordInput.fill(password);
      await this.signinButton.click();
    }

    async getLoginErrorMessage() {
        return await this.loginErrorMessage.textContent();
    }
  }
  
  module.exports = { LoginPage };