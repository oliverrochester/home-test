// @ts-check
import { test, expect } from '@playwright/test';
import { LoginPage } from '../page-objects/login-page'
import { HomePage } from '../page-objects/home-page';
import { CheckoutPage } from '../page-objects/checkout-page';
import { OrderPage } from '../page-objects/order-page';
import { GridPage } from '../page-objects/grid-page';
import { GridItem } from '../page-objects/grid-item';
import { SearchPage } from '../page-objects/search-page';
const creds = require('../credentials.json');
const loginFailureTestCases = require('../data/loginFailureTests.json')
const gridData = require('../data/gridItems.json');

test.beforeEach(async ({ page }) => {
  console.log(`Running ${test.info().title}`);
});

test.afterEach(async ({ page }) => {
  console.log(`Finished running ${test.info().title}`);
})


test('login test success', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);
  await loginPage.navigate();
  const responsePromise = page.waitForResponse('**/authenticate');
  await loginPage.login(creds.userCreds.username, creds.userCreds.password);
  const response = await responsePromise;
  expect(response.status()).toBe(200);
  await expect(page).toHaveURL('http://localhost:3100/home'); 
  expect(await homePage.getWelcomeMessage()).toEqual('Welcome!');
  expect(await homePage.getWelcomeMessageUsername()).toEqual('johndoe19');
});

//contains tests for incorrect login credentials as well as empty fields
test('login test failures', async ({ page }) => {
  const loginPage = new LoginPage(page);
  for (const testCase of loginFailureTestCases.testcases) {
    await loginPage.navigate();
    const responsePromise = page.waitForResponse('**/authenticate');
    await loginPage.login(testCase.username, testCase.password);
    const response = await responsePromise;
    expect(response.status()).toBe(403);
    await expect(page).toHaveURL('http://localhost:3100/login');
    expect(await loginPage.getLoginErrorMessage()).toEqual(testCase.expectedErrorMessage);
  }
});

test('Checkout Form Order Success', async ({ page }) => {
  const checkoutPage = new CheckoutPage(page);
  const orderPage = new OrderPage(page);
  await checkoutPage.navigate();
  await checkoutPage.fullNameInput.fill('Test User');
  await checkoutPage.emailInput.fill('test@email.com')
  await checkoutPage.addressInput.fill('123 Test St');
  await checkoutPage.cityInput.fill('Test City');
  await checkoutPage.stateInput.fill('Test State');
  await checkoutPage.zipInput.fill('12345');
  await checkoutPage.cardNameInput.fill('Test User');
  await checkoutPage.cardNumberInput.fill('4111111111111111');
  await checkoutPage.expMonthDropdown.selectOption('January');
  await checkoutPage.expYearInput.fill('2025');
  await checkoutPage.cvvInput.fill('123');
  const checked = await checkoutPage.shippingBillingCheckbox.isChecked();
  if (!checked) {
    await checkoutPage.shippingBillingCheckbox.check();
  }
  const responsePromise = page.waitForResponse('**/form-validation');
  await checkoutPage.continueToCheckoutButton.click()
  const response = await responsePromise;
  expect(response.status()).toBe(200);
  await expect(page).toHaveURL('http://localhost:3100/order');
  const orderNumber = await orderPage.getOrderNumber();
  expect(orderNumber.length).toBeGreaterThan(0);
  expect(orderNumber).toMatch(/^\d+$/); // Check if order number is numeric

});


test('Checkout Form Alert', async ({ page }) => {
  const checkoutPage = new CheckoutPage(page);
  await checkoutPage.navigate();
  await checkoutPage.fullNameInput.fill('Test User');
  await checkoutPage.emailInput.fill('test@email.com')
  await checkoutPage.addressInput.fill('123 Test St');
  await checkoutPage.cityInput.fill('Test City');
  await checkoutPage.stateInput.fill('Test State');
  await checkoutPage.zipInput.fill('12345');
  await checkoutPage.cardNameInput.fill('Test User');
  await checkoutPage.cardNumberInput.fill('4111111111111111');
  await checkoutPage.expMonthDropdown.selectOption('January');
  await checkoutPage.expYearInput.fill('2025');
  await checkoutPage.cvvInput.fill('123');
  const checked = await checkoutPage.shippingBillingCheckbox.isChecked();
  if (checked) {
    await checkoutPage.shippingBillingCheckbox.uncheck();
  }
  const responsePromise = page.waitForResponse('**/form-validation');
  page.on('dialog', async dialog => {
    expect(dialog.type()).toBe('alert');
    expect(dialog.message()).toEqual('Shipping address same as billing checkbox must be selected.');
    await dialog.accept(); //closes the alert dialog
  });
  await checkoutPage.continueToCheckoutButton.click()
  const response = await responsePromise;
  expect(response.status()).toBe(406);
  await expect(page).toHaveURL('http://localhost:3100/checkout');
});

test('Cart Total Test', async ({ page }) => {
  const checkoutPage = new CheckoutPage(page);
  await checkoutPage.navigate();
  const cartItemCount = await checkoutPage.getCartItemCount();
  const expectedCartTotal = 453
  let totalPrice = 0
  for (let i = 1; i <= cartItemCount; i++) {
    let value = await page.locator(`span[class="price"]>>nth=${i}`).textContent()
    let strp$ = value?.replace('$', '')
    let numericValue = parseFloat(strp$ || '0');
    totalPrice += numericValue;
  }
  expect(totalPrice).toEqual(expectedCartTotal);

});

test('Grid Item Test', async ({ page }) => {
  const gridPage = new GridPage(page);
  await gridPage.navigate();
  const gridItem = new GridItem(page, 6); // Assuming you want to get the 7th item (index 6)
  expect(await gridItem.getItemName()).toEqual(gridData.items[6].name);
  expect(await gridItem.getItemPrice()).toEqual(gridData.items[6].price.toString());
});

test('Grid All Items Test', async ({ page }) => {
  const gridPage = new GridPage(page);
  await gridPage.navigate();

  for (let i = 0; i < gridData.items.length; i++) {
    let gridItem = new GridItem(page, i); // Create a GridItem for each item in the grid
    expect(await gridItem.itemElement).toBeVisible(); // Check if the item element is visible
    expect(await gridItem.getItemName()).toEqual(gridData.items[i].name); // Check if item name is correct
    expect(await gridItem.getItemPrice()).toEqual(gridData.items[i].price.toString()); // Check if item price matches the expected value
    expect(await gridItem.itemImageElement).toHaveAttribute('src', gridData.items[i].imageHref)// Check if the image source matches the expected value
    expect(await gridItem.getButtonText()).toEqual(gridData.items[i].buttonText); // Check if the button text matches the expected value
  }

});

test('Search Success', async ({ page }) => {
  const searchPage = new SearchPage(page);
  await searchPage.navigate();
  expect(await searchPage.searchInput).toBeVisible();
  expect(await searchPage.searchIconButton).toBeVisible();
  await searchPage.searchInput.fill('Automation');
  const responsePromise = page.waitForResponse('**/search-engine');
  await searchPage.searchIconButton.click();
  const response = await responsePromise;
  expect(response.status()).toBe(200);
  expect(await searchPage.getSearchResultText()).toEqual('Found one result for Automation');
});

test('Search Empty', async ({ page }) => {
  const searchPage = new SearchPage(page);
  await searchPage.navigate();
  expect(await searchPage.searchInput).toBeVisible();
  expect(await searchPage.searchIconButton).toBeVisible();
  const responsePromise = page.waitForResponse('**/search-engine');
  await searchPage.searchIconButton.click();
  const response = await responsePromise;
  expect(response.status()).toBe(404);
  expect(await searchPage.getSearchResultText()).toEqual('Please provide a search word.');
});
