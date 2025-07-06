// page-objects/LoginPage.js
class GridItem {
    constructor(page, itemIndex) {
      this.page = page;
      this.itemIndex = itemIndex;
      this.itemElement = page.locator(`div[class="grid-container"] div[class="item"]`).nth(itemIndex);
      this.itemNameElement = this.itemElement.locator('h4[data-test-id="item-name"] b');
      this.itemPriceElement = this.itemElement.locator('p[id="item-price"]');
      this.itemImageElement = this.itemElement.locator('img');
      this.itemButtonElement = this.itemElement.locator('button[data-test-id="add-to-order"]');
    }

    async getItemName() {
        return await this.itemNameElement.textContent();
    }

    async getItemPrice() {
        const itemPriceBefore = await this.itemPriceElement.textContent();
        return itemPriceBefore.replace('$', '').trim(); // Remove the dollar sign and trim any potential whitespace 
    }

    async getButtonText() {
        return await this.itemButtonElement.innerText();
    }



  }
  
  module.exports = { GridItem };