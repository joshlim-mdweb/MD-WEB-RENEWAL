import { test } from '@playwright/test';

test('competitive reference', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });

  // CLO3D
  await page.goto('https://www.clo3d.com/en/features', { waitUntil: 'domcontentloaded', timeout: 40000 });
  await page.waitForTimeout(3000);
  const cloText = await page.evaluate(() => (document.querySelector('main') || document.body).innerText.substring(0, 3000));
  await page.screenshot({ path: '/tmp/ref-clo3d-features.png', fullPage: false });
  const cloNav = await page.evaluate(() => {
    const nav = document.querySelector('nav') || document.querySelector('header');
    if (!nav) return [];
    return Array.from(nav.querySelectorAll('a')).map(a => ({ text: a.textContent.trim().replace(/\s+/g, ' '), href: a.getAttribute('href') })).filter(a => a.text.length > 0 && a.text.length < 80);
  });

  // CLO3D Enterprise
  await page.goto('https://www.clo3d.com/en/enterprise', { waitUntil: 'domcontentloaded', timeout: 40000 });
  await page.waitForTimeout(2500);
  const cloEnterpriseText = await page.evaluate(() => (document.querySelector('main') || document.body).innerText.substring(0, 2500));
  await page.screenshot({ path: '/tmp/ref-clo3d-enterprise.png', fullPage: false });

  // Blender features
  await page.goto('https://www.blender.org/features/', { waitUntil: 'domcontentloaded', timeout: 40000 });
  await page.waitForTimeout(2000);
  const blenderText = await page.evaluate(() => (document.querySelector('main') || document.body).innerText.substring(0, 2500));
  await page.screenshot({ path: '/tmp/ref-blender-features.png', fullPage: false });
  const blenderNav = await page.evaluate(() => {
    const nav = document.querySelector('nav') || document.querySelector('header');
    if (!nav) return [];
    return Array.from(nav.querySelectorAll('a')).map(a => ({ text: a.textContent.trim().replace(/\s+/g, ' '), href: a.getAttribute('href') })).filter(a => a.text.length > 0 && a.text.length < 80);
  });

  console.log('=== CLO3D NAV ===');
  console.log(JSON.stringify(cloNav, null, 2));
  console.log('\n=== CLO3D FEATURES ===');
  console.log(cloText);
  console.log('\n=== CLO3D ENTERPRISE ===');
  console.log(cloEnterpriseText);
  console.log('\n=== BLENDER NAV ===');
  console.log(JSON.stringify(blenderNav, null, 2));
  console.log('\n=== BLENDER FEATURES ===');
  console.log(blenderText);
});
