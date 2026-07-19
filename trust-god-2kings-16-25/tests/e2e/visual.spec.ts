import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
});

test('opening visual', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveScreenshot('opening.png', {
    fullPage: false,
    animations: 'disabled',
  });
});

test('signal board visual', async ({ page }) => {
  await page.goto('/#signal');
  const claim = page.locator('[data-reveal^="claim-"]').first();
  await claim.focus();
  await claim.press('Enter');
  await page.locator('.skip-link').evaluate((link) => {
    link.style.display = 'none';
  });
  await expect(page.locator('#signal')).toHaveScreenshot('signal.png', {
    animations: 'disabled',
  });
});

test('prayer visual', async ({ page }) => {
  await page.goto('/#prayer');
  await expect(page.locator('#prayer')).toHaveScreenshot('prayer.png', {
    animations: 'disabled',
  });
});

test('final word visual', async ({ page }) => {
  await page.goto('/#final-word');
  await expect(page.locator('#final-word')).toHaveScreenshot('final-word.png', {
    animations: 'disabled',
  });
});
