// page-objects/LoginPage.js
class GridPage {
    constructor(page) {
      this.page = page;
    }
  
    async navigate() {
        await this.page.goto('http://localhost:3100/grid'); 
    }

    async getItemNameByIndex(index) {
        return await this.page.locator(`div[class="grid-container"] div[class="item"].nth(${index}) h4[data-test-id="item-name"] b`)
    }

    async getItemPriceByIndex(index){
        return await this.page.locator(`div[class="grid-container"] div[class="item"].nth(${index}) p#item-price`)
    }



  }
  
  module.exports = { GridPage };