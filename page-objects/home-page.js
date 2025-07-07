
class HomePage {
    constructor(page) {
      this.page = page;
      this.welcomeMessage = page.locator('div[id="welcome-message"] h2');
      this.welcomeMessageUsername = page.locator('div[id="welcome-message"] p[data-id="username"]');
    }
  
    async navigate() {
        await this.page.goto('http://localhost:3100/home'); 
    }
  
    async getWelcomeMessage() {
        return await this.welcomeMessage.textContent();
    }

    async getWelcomeMessageUsername() {
        return await this.welcomeMessageUsername.textContent();
    }

    async getWelcomeMessageUsername() {
        return await this.welcomeMessageUsername.textContent();
    }
  }
  
  module.exports = { HomePage };