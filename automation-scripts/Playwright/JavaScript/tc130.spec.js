const { test, expect } = require('@playwright/test');

test.describe('Salesforce Account Creation', () => {

  test('Verify successful Account creation with required fields', async ({ page }) => {

    test.setTimeout(120000);

    // 🔹 Login
    await page.goto('https://login.salesforce.com');
    await page.fill('#username', process.env.SALESFORCE_USERNAME);
    await page.fill('#password', process.env.SALESFORCE_PASSWORD);
    await page.click('#Login');

    // 🟡 MFA if needed
    await page.pause();

    await page.waitForURL(url => url.includes('/lightning'), { timeout: 120000 });

    // ---------------- APP LAUNCHER ----------------
    await page.waitForSelector('button[title="App Launcher"]');
    await page.click('button[title="App Launcher"]');

    await page.click('button:has-text("View All")');
    await page.click('p:has-text("Sales")');

    // ---------------- ACCOUNTS ----------------
    await page.waitForSelector('a[title="Accounts"]', { timeout: 60000 });
    await page.click('a[title="Accounts"]');

    // 🔹 New Account
    await page.waitForSelector('a[title="New"]');
    await page.click('a[title="New"]');

    // 🔹 Fill Account Name
    const accountName = `Playwright Account ${Date.now()}`;
    await page.fill(
      '//label[text()="Account Name"]/following::input[1]',
      accountName
    );

    // 🔹 Save
    await page.click('button[name="SaveEdit"]');

    // ✅ Verify toast
    const toast = page.locator('span.toastMessage');
    await expect(toast).toContainText(accountName);

  });

});
