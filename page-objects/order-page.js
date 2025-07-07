
class OrderPage {
    constructor(page) {
      this.page = page;
      this.orderConfirmedMessage = page.locator('div[id="order-confirmation"] h2');
      this.orderNumberDisplay = page.locator('div[id="order-confirmation"] p[data-id="ordernumber"]');
    }
  
    async navigate() {
        await this.page.goto('http://localhost:3100/order'); 
    }
  
    async orderConfirmedMessage() {
        return await this.orderConfirmedMessage.textContent();
    }

    async orderNumberDisplay() {
        return await this.orderNumberDisplay.textContent();
    }

    async getOrderNumber() {
        const data = await this.orderNumberDisplay.textContent();
        const dataArray = data.split(' ');
        return dataArray[2]; // Assuming the format is "Order number: 12345"
    }

  }
  
  module.exports = { OrderPage };