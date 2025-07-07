// @ts-check
import { test, expect } from '@playwright/test';
import { LoginPage } from '../page-objects/login-page'
import { HomePage } from '../page-objects/home-page';
import { CheckoutPage } from '../page-objects/checkout-page';
import { OrderPage } from '../page-objects/order-page';
import { GridPage } from '../page-objects/grid-page';
import { GridItem } from '../page-objects/grid-item';
import { SearchPage } from '../page-objects/search-page';
const searches = require('../data/searches.json');
const loginFailureTestCases = require('../data/loginFailureTests.json')
const gridData = require('../data/gridItems.json');

test.beforeEach(async ({ page }) => {
  console.log(`Running ${test.info().title}`);
});

test('Login Success', async ({ page }) => {
  const loginPage = new LoginPage(page);                                                    // Create a new instance of LoginPage
  const homePage = new HomePage(page);                                                      // Create a new instance of HomePage
  await loginPage.navigate();
  const responsePromise = page.waitForResponse('**/authenticate');
  await loginPage.login('johndoe19', 'supersecret');                                        // call LoginPage class login function with valid credentials
  const response = await responsePromise;                                                   // wait for the authentication response
  expect(response.status()).toBe(200);                                                      // assert athentication network response code is 200 OK
  await expect(page).toHaveURL('http://localhost:3100/home');                               // assert we are redirected to the home page after successful login
  expect(await homePage.getWelcomeMessage()).toEqual('Welcome!');                           // assert welcome message is displayed on the home page
  expect(await homePage.getWelcomeMessageUsername()).toEqual('johndoe19');                  // assert welcome message username is correct
});

//loops through both login failure test cases and assert correct error message
test('Login Failure A and B', async ({ page }) => {
  const loginPage = new LoginPage(page);                                                    // Create a new instance of LoginPage
  for (const testCase of loginFailureTestCases.testcases) {
    await loginPage.navigate();
    const responsePromise = page.waitForResponse('**/authenticate');
    await loginPage.login(testCase.username, testCase.password);
    const response = await responsePromise;
    expect(response.status()).toBe(403);                                                    //assert athentication network response code is 403 unauthorized
    await expect(page).toHaveURL('http://localhost:3100/login');                            //assert we are still on the login page
    expect(await loginPage.getLoginErrorMessage()).toEqual(testCase.expectedErrorMessage);
  }
});

test('Checkout Form Order Success', async ({ page }) => {
  const checkoutPage = new CheckoutPage(page);                              // Create a new instance of CheckoutPage
  const orderPage = new OrderPage(page);                                    // Create a new instance of OrderPage
  await checkoutPage.navigate();
  await checkoutPage.fullNameInput.fill('Test User');                       // Fill in the checkout form with test data       
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
  const checked = await checkoutPage.shippingBillingCheckbox.isChecked();   // get state of shipping billing checkbox
  if (!checked) {                                                           
    await checkoutPage.shippingBillingCheckbox.check();                     // if checkbox is not checked, check it
  }
  const responsePromise = page.waitForResponse('**/form-validation');
  await checkoutPage.continueToCheckoutButton.click()
  const response = await responsePromise;
  expect(response.status()).toBe(200);                                      // assert network response code is 200       
  await expect(page).toHaveURL('http://localhost:3100/order');
  const orderNumber = await orderPage.getOrderNumber();
  expect(orderNumber.length).toBeGreaterThan(0);                            // Check if order number is not empty 
  expect(orderNumber).toMatch(/^\d+$/);                                     // Check if order number is numeric
});


test('Checkout Form Alert', async ({ page }) => {
  const checkoutPage = new CheckoutPage(page);                              // Create a new instance of CheckoutPage
  await checkoutPage.navigate();
  await checkoutPage.fullNameInput.fill('Test User');                       // Fill in the checkout form with test data  
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
  const checked = await checkoutPage.shippingBillingCheckbox.isChecked();                               // get state of shipping billing checkbox
  if (checked) {
    await checkoutPage.shippingBillingCheckbox.uncheck();                                               // if checkbox is checked, uncheck it
  }
  const responsePromise = page.waitForResponse('**/form-validation');
  page.on('dialog', async dialog => {                                                                   // start listening alert event
    expect(dialog.type()).toBe('alert');                                                                // assert dialog type is alert
    expect(dialog.message()).toEqual('Shipping address same as billing checkbox must be selected.');    // assert dialog message is correct
    await dialog.accept();                                                                              // closes the alert dialog
  });
  await checkoutPage.continueToCheckoutButton.click()                                                   // click continue to checkout button
  const response = await responsePromise;                                                               // wait for 406 response code
  expect(response.status()).toBe(406);
  await expect(page).toHaveURL('http://localhost:3100/checkout');                                       // assert we are still on the checkout page
});

test('Cart Total Test', async ({ page }) => {
  const checkoutPage = new CheckoutPage(page);                                                        // Create a new instance of CheckoutPage
  await checkoutPage.navigate();
  const cartItemCount = await checkoutPage.getCartItemCount();                                        // Get the number of items in the cart to know how many loop iterations to perform and how many elements to grab from the DOM
  const expectedCartTotal = 453                                                                       // Define the expected total price of the items in the cart
  let totalPrice = 0
  for (let i = 1; i <= cartItemCount; i++) {
    let value = await page.locator(`span[class="price"]>>nth=${i}`).textContent()                     // Get the text content of the price element for each item in the cart based on the elemntes nth index 
    let strp$ = value?.replace('$', '')                                                               // Remove the dollar sign from the price string          
    let numericValue = parseFloat(strp$ || '0');                                                      // Convert the string to a float, defaulting to 0 if the string is empty     
    totalPrice += numericValue;                                                                       // Add the numeric value to the total price  
  }
  expect(totalPrice).toEqual(expectedCartTotal);                                                      // Assert that the total price matches the expected total price
});

test('Grid Item Test', async ({ page }) => {
  const gridPage = new GridPage(page);
  await gridPage.navigate();
  const gridItem = new GridItem(page, 6);                                                 // Create a GridItem instance bby index for the 7th item in the grid (index 6)
  expect(await gridItem.getItemName()).toEqual(gridData.items[6].name);                   // Check if item name is correct
  expect(await gridItem.getItemPrice()).toEqual(gridData.items[6].price.toString());      // Check if item price matches the expected value
});

test('Grid All Items Test', async ({ page }) => {
  const gridPage = new GridPage(page);                                                          // Create a new instance of GridPage
  await gridPage.navigate();
  for (let i = 0; i < gridData.items.length; i++) {
    let gridItem = new GridItem(page, i);                                                       // Create a GridItem for each item in the grid
    expect(await gridItem.itemElement).toBeVisible();                                           // Check if the item element is visible
    expect(await gridItem.getItemName()).toEqual(gridData.items[i].name);                       // Check if item name is correct
    expect(await gridItem.getItemPrice()).toEqual(gridData.items[i].price.toString());          // Check if item price matches the expected value
    expect(await gridItem.itemImageElement).toHaveAttribute('src', gridData.items[i].imageHref) // Check if the image source matches the expected value
    expect(await gridItem.getButtonText()).toEqual(gridData.items[i].buttonText);               // Check if the button text matches the expected value
  }
});

test('Search Success and Search Empty', async ({ page }) => {
  const searchPage = new SearchPage(page);                                            // Create a new instance of SearchPage
  for (const search of searches.searches) {                                           // Loop through each search case in the searches.json file  
    await searchPage.navigate();
    expect(await searchPage.searchInput).toBeVisible();                               // Check if the search input and search icon is visible before proceeding
    expect(await searchPage.searchIconButton).toBeVisible();
    const responsePromise = page.waitForResponse('**/search-engine');
    await searchPage.searchInput.fill(search.searchText);                             // Fill the search input with the search text from the searches.json file      
    await searchPage.searchIconButton.click();
    const response = await responsePromise;
    expect(response.status()).toBe(search.networkResponseCode);                       // Assert that the network response code matches the expected value  
    expect(await searchPage.getSearchResultText()).toEqual(search.responseText);      // Assert that the search result text matches the expected value
  }
});
