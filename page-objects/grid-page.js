
class GridPage {
    constructor(page) {
      this.page = page;
    }
  
    async navigate() {
        await this.page.goto('http://localhost:3100/grid'); 
    }

  }
  
  module.exports = { GridPage };