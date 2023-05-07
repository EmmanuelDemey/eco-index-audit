import { test, expect } from '@playwright/test';
const check = require("../src/main");

test('get started link', async ({ page, launchOptions,  }) => {
  
  const url = 'https://playwright.dev/';

  await page.goto(url);

  // Click the get started link.
  await page.getByRole('link', { name: 'Get started' }).click();

  // Expects the URL to contain intro.
  await expect(page).toHaveURL(/.*intro/);

  const result = await check({
     url, 
     remote_debugging_port: 9222
  }, true);

  expect(result.ecoIndex).toBe(100);
});
