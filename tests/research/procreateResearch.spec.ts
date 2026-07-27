import { test } from '@playwright/test';

test('procreate feature sections', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('https://procreate.com/procreate', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(4000);

  await page.screenshot({ path: 'tests/research/procreate-hero.png', clip: { x: 0, y: 0, width: 1440, height: 900 } });

  for (let i = 1; i <= 6; i++) {
    await page.evaluate((y) => window.scrollTo(0, y), i * 1800);
    await page.waitForTimeout(1200);
    await page.screenshot({ path: `tests/research/procreate-s${i}.png`, clip: { x: 0, y: 0, width: 1440, height: 900 } });
  }
});
