import { test } from '@playwright/test';

test('figma features pages', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });

  // Figma Design 제품 페이지
  await page.goto('https://www.figma.com/design/', { waitUntil: 'domcontentloaded', timeout: 45000 });
  await page.waitForTimeout(3000);
  await page.locator('text=Allow all cookies').click().catch(() => {});
  const designText = await page.evaluate(() => (document.querySelector('main') || document.body).innerText.substring(0, 3000));
  await page.screenshot({ path: '/tmp/figma-feature-design.png', fullPage: false });

  console.log('=== DESIGN PAGE ===');
  console.log(designText);
});
