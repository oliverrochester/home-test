// page-objects/LoginPage.js
class GridPage {
    constructor(page) {
      this.page = page;
      this.orderConfirmedMessage = page.locator('div[id="order-confirmation"] h2');
      this.orderNumberDisplay = page.locator('div[id="order-confirmation"] p[data-id="ordernumber"]');
    }
  
    async navigate() {
        await this.page.goto('http://localhost:3100/order'); 
    }

  }
  
  module.exports = { GridPage };