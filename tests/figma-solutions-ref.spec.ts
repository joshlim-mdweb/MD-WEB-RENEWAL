import { test } from '@playwright/test';

test('figma gnb dropdown', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('https://www.figma.com/solutions/', { waitUntil: 'domcontentloaded', timeout: 45000 });
  await page.waitForTimeout(3000);
  await page.locator('text=Allow all cookies').click().catch(() => {});
  await page.waitForTimeout(500);

  // Solutions 클릭
  await page.locator('nav button, nav a').filter({ hasText: /^Solutions/ }).first().click();
  await page.waitForTimeout(1500);
  await page.screenshot({ path: '/tmp/figma-solutions-dropdown.png', fullPage: false });

  // Products 클릭
  await page.locator('nav button, nav a').filter({ hasText: /^Products/ }).first().click();
  await page.waitForTimeout(1500);
  await page.screenshot({ path: '/tmp/figma-products-dropdown.png', fullPage: false });
});
