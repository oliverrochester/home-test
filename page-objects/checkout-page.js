// page-objects/LoginPage.js
class CheckoutPage {
    constructor(page) {
      this.page = page;
      this.fullNameInput = page.locator('form[action="/form-validation"] input[id="fname"]');
      this.emailInput = page.locator('form[action="/form-validation"] input[id="email"]');
      this.addressInput = page.locator('form[action="/form-validation"] input[id="adr"]');
      this.cityInput = page.locator('form[action="/form-validation"] input[id="city"]');
      this.stateInput = page.locator('form[action="/form-validation"] input[id="state"]');
      this.zipInput = page.locator('form[action="/form-validation"] input[id="zip"]');
      this.cardNameInput = page.locator('form[action="/form-validation"] input[id="cname"]');
      this.cardNumberInput = page.locator('form[action="/form-validation"] input[id="ccnum"]');
      this.expMonthDropdown = page.locator('form[action="/form-validation"] select[id="expmonth"]');
      this.expYearInput = page.locator('form[action="/form-validation"] input[id="expyear"]');
      this.cvvInput = page.locator('form[action="/form-validation"] input[id="cvv"]');
      this.shippingBillingCheckbox = page.locator('form[action="/form-validation"] input[name="sameadr"]');
      this.continueToCheckoutButton = page.locator('button:has-text("Continue to checkout")');
      this.cartitemCount = page.locator('h4:has-text("Cart") span b');
    }
  
    async navigate() {
        await this.page.goto('http://localhost:3100/checkout');
    }

    async getCartItemCount() {
      return await this.cartitemCount.textContent();
    }
  
  }
  
  module.exports = { CheckoutPage };