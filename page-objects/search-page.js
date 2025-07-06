// page-objects/LoginPage.js
class SearchPage {
    constructor(page) {
      this.page = page;
      this.searchInput = page.locator('input[name="searchWord"]');
      this.searchIconButton = page.locator('button[type="submit"]');
      this.resultsContainer = page.locator('div[class="result-container"] p[id="result"]');
    }

    async navigate() {
        await this.page.goto('http://localhost:3100/search'); 
    }

    async getSearchResultText() {
        return await this.resultsContainer.textContent();
    }
  }
  
  module.exports = { SearchPage };