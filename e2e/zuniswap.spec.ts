import { test, expect } from '@playwright/test';

// Set the base URL directly in the test
const baseUrl = 'http://localhost:5176';

test.describe('Zuniswap Interface', () => {
  test('should load the home page correctly', async ({ page }) => {
    // Navigate to the app with explicit URL
    await page.goto(baseUrl);
    
    // Wait for the main heading to appear
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.getByText('Swap anytime').first()).toBeVisible();
  });

  test('should display the swap card', async ({ page }) => {
    await page.goto(baseUrl);
    
    // Verify the swap card is visible
    const swapCard = page.locator('.card');
    await expect(swapCard).toBeVisible();
    
    // Verify the swap title is present
    await expect(page.getByText('Swap').first()).toBeVisible();
    
    // Verify both token selectors are present - use more specific selectors
    await expect(page.locator('label').filter({ hasText: 'From' })).toBeVisible();
    await expect(page.locator('label').filter({ hasText: 'To' })).toBeVisible();
  });

  test('should allow token amount input', async ({ page }) => {
    await page.goto(baseUrl);
    
    // Wait for the swap card to be visible
    await page.locator('.card').waitFor();
    
    // Find and interact with the input field - more specific selector
    const fromInput = page.locator('.card input').first();
    await fromInput.fill('1.5');
    
    // Verify the input value
    await expect(fromInput).toHaveValue('1.5');
    
    // Verify the USD value is updated (using a more specific selector)
    await expect(page.locator('span').filter({ hasText: /≈ \$/ }).first()).toBeVisible();
  });

  test('should open token selector modal', async ({ page }) => {
    await page.goto(baseUrl);
    
    // Wait for the swap card to be visible
    await page.locator('.card').waitFor();
    
    // Focus on the card first
    await page.locator('.card').click();
    
    // Find and click a token selector button within the card
    const tokenButtonSelector = '.card button:has(div, span)';
    await page.waitForSelector(tokenButtonSelector);
    await page.locator(tokenButtonSelector).first().click();
    
    // Verify some kind of token selection UI appears
    // Look for common text that might appear in such UI
    await page.waitForTimeout(1000); // Give modal time to appear
    
    // Try different selectors that might match token selection UI
    const selectors = [
      'text=Select a token',
      'text=Popular tokens',
      'text=Search tokens',
      'text=Token Name'
    ];
    
    let found = false;
    for (const selector of selectors) {
      const isVisible = await page.locator(selector).isVisible().catch(() => false);
      if (isVisible) {
        found = true;
        break;
      }
    }
    
    expect(found).toBe(true);
  });

  test('should have swap functionality', async ({ page }) => {
    await page.goto(baseUrl);
    
    // Check if we can enter an amount in the input field
    await page.locator('.card').waitFor();
    const inputField = page.locator('.card input').first();
    await inputField.fill('1.5');
    await expect(inputField).toHaveValue('1.5');
    
    // Verify there's a swap button
    const swapButtonSelector = '.card button:has(svg)';
    await expect(page.locator(swapButtonSelector).nth(1)).toBeVisible();
  });

  test('should toggle between light and dark mode', async ({ page }) => {
    // Navigate to the app
    await page.goto(baseUrl);
    
    // Check if dark mode is active initially
    const htmlElement = page.locator('html');
    const initialHasDarkClass = await htmlElement.evaluate(el => el.classList.contains('dark'));
    
    // Record initial mode
    const initialMode = initialHasDarkClass ? 'dark' : 'light';
    console.log(`Initial mode: ${initialMode}`);
    
    // Open the Global Menu first - look for the menu button
    await page.locator('button').filter({ hasText: /^$/ }).first().click();
    
    // Wait for the menu to be visible
    await page.waitForSelector('div.absolute.right-0');
    
    // Find and click the dark/light mode toggle
    if (initialMode === 'light') {
      // Click the moon icon (dark mode button) - using nth based on the UI structure
      await page.locator('.bg-\\[\\#1f2937\\] button').nth(2).click();
    } else {
      // Click the sun icon (light mode button) - using nth based on the UI structure
      await page.locator('.bg-\\[\\#1f2937\\] button').nth(1).click();
    }
    
    // Wait a bit for theme change to be applied
    await page.waitForTimeout(500);
    
    // Verify visually by checking the class
    const newHasDarkClass = await htmlElement.evaluate(el => el.classList.contains('dark'));
    const newMode = newHasDarkClass ? 'dark' : 'light';
    console.log(`New mode: ${newMode}`);
    
    // Verify the theme has been toggled
    expect(newMode).not.toEqual(initialMode);
  });

  test('should switch language and update UI text', async ({ page }) => {
    // Navigate to the app
    await page.goto(baseUrl);
    
    // Open the Global Menu first - look for the menu button
    const menuButton = page.locator('button').filter({ hasText: /^$/ }).first();
    await menuButton.click();
    
    // Wait for the menu to be visible - use a more relaxed selector
    await page.waitForSelector('div.absolute.right-0');
    
    // Get the global preferences title text to check language
    const menuTitle = await page.locator('div.absolute.right-0 h3').first().textContent() || '';
    console.log(`Menu title: ${menuTitle}`);
    
    // Check if initially in English or Vietnamese
    const initiallyEnglish = menuTitle.includes('Global preferences');
    console.log(`Initially in English: ${initiallyEnglish}`);
    
    // Look for the language button by checking all buttons in the menu
    const menuButtons = page.locator('div.absolute.right-0 button');
    const count = await menuButtons.count();
    
    // Iterate through buttons to find the one with language text
    let languageButton;
    for (let i = 0; i < count; i++) {
      const buttonText = await menuButtons.nth(i).textContent() || '';
      if (buttonText.includes('Language') || buttonText.includes('Ngôn ngữ')) {
        languageButton = menuButtons.nth(i);
        break;
      }
    }
    
    // If we found the language button, click it to toggle
    if (languageButton) {
      await languageButton.click();
      console.log('Clicked language button');
    } else {
      throw new Error('Could not find language button in menu');
    }
    
    // Wait for UI to update after language change
    await page.waitForTimeout(1000);
    
    // Re-open the menu to check the change
    await menuButton.click();
    await page.waitForSelector('div.absolute.right-0');
    
    // Get the menu title text again after language change
    const menuTitleAfter = await page.locator('div.absolute.right-0 h3').first().textContent() || '';
    console.log(`Menu title after language change: ${menuTitleAfter}`);
    
    // Verify the language has changed
    const nowEnglish = menuTitleAfter.includes('Global preferences');
    console.log(`Now in English: ${nowEnglish}`);
    
    expect(nowEnglish).not.toEqual(initiallyEnglish);
    
    // Close the menu
    await page.keyboard.press('Escape');
  });
  
  test('should switch currency and update displayed values', async ({ page }) => {
    // Navigate to the app
    await page.goto(baseUrl);
    
    // First, enter a value in the swap input to ensure we have currency displays
    const inputField = page.locator('.card input').first();
    await inputField.fill('1');
    
    // Open the Global Menu
    const menuButton = page.locator('button').filter({ hasText: /^$/ }).first();
    await menuButton.click();
    
    // Wait for the menu to be visible
    await page.waitForSelector('div.absolute.right-0');
    
    // Find the currency button by checking all buttons in the menu
    const menuButtons = page.locator('div.absolute.right-0 button');
    const count = await menuButtons.count();
    
    // Iterate through buttons to find the one with currency text
    let currencyButton;
    for (let i = 0; i < count; i++) {
      const buttonText = await menuButtons.nth(i).textContent() || '';
      if (buttonText.includes('Currency') || buttonText.includes('Tiền tệ')) {
        currencyButton = menuButtons.nth(i);
        break;
      }
    }
    
    // Record the initial currency
    let initialCurrencyIsUSD = true;
    if (currencyButton) {
      const currencyText = await currencyButton.textContent() || '';
      initialCurrencyIsUSD = currencyText.includes('USD');
      console.log(`Initial currency is USD: ${initialCurrencyIsUSD}`);
      
      // Click the currency button to toggle
      await currencyButton.click();
      console.log('Clicked currency button');
    } else {
      throw new Error('Could not find currency button in menu');
    }
    
    // Wait for UI to update after currency change
    await page.waitForTimeout(1000);
    
    // Re-open the menu to check the change
    await menuButton.click();
    await page.waitForSelector('div.absolute.right-0');
    
    // Find the currency button again
    const menuButtonsAfter = page.locator('div.absolute.right-0 button');
    let currencyButtonAfter;
    
    for (let i = 0; i < await menuButtonsAfter.count(); i++) {
      const buttonText = await menuButtonsAfter.nth(i).textContent() || '';
      if (buttonText.includes('Currency') || buttonText.includes('Tiền tệ')) {
        currencyButtonAfter = menuButtonsAfter.nth(i);
        break;
      }
    }
    
    // Verify currency has changed
    if (currencyButtonAfter) {
      const currencyTextAfter = await currencyButtonAfter.textContent() || '';
      const nowCurrencyIsUSD = currencyTextAfter.includes('USD');
      console.log(`Now currency is USD: ${nowCurrencyIsUSD}`);
      
      // Verify currency selection has changed
      expect(nowCurrencyIsUSD).not.toEqual(initialCurrencyIsUSD);
    }
    
    // Close the menu
    await page.keyboard.press('Escape');
  });
}); 