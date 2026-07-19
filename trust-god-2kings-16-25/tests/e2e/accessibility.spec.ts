import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

async function expectNoSeriousViolations(page: Page): Promise<void> {
  const result = await new AxeBuilder({ page }).analyze();
  const serious = result.violations.filter(
    ({ impact }) => impact === 'serious' || impact === 'critical',
  );
  expect(serious).toEqual([]);
}

test('opening is accessible', async ({ page }) => {
  await page.goto('/');
  await expectNoSeriousViolations(page);
});

test('revealed signal and Present view are accessible', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Present', exact: true }).click();
  await page.locator('[data-reveal^="claim-"]').first().click();
  await expectNoSeriousViolations(page);
});

test('final chapter is accessible', async ({ page }) => {
  await page.goto('/#final-word');
  await expectNoSeriousViolations(page);
});
