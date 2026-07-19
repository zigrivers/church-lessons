import { expect, test } from '@playwright/test';

test('contains the complete teacher-led lesson in semantic HTML', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Trust Under Pressure/);
  await expect(
    page.getByRole('heading', { level: 1, name: 'Who gets the final word?' }),
  ).toBeVisible();
  for (const heading of [
    'The offer',
    'The board',
    'Signal or noise?',
    'Spread out the letter',
    'The missing book',
    'Read or reform?',
    'Final word',
  ]) {
    await expect(page.getByRole('heading', { level: 2, name: heading })).toBeAttached();
  }
  await expect(page.locator('[data-chapter]')).toHaveCount(7);
  await expect(page.locator('[data-guide]')).toHaveCount(7);
  await expect(page.getByRole('link', { name: /official Come, Follow Me lesson/i })).toHaveAttribute(
    'href',
    /churchofjesuschrist\.org/,
  );
  await expect(page.getByText('If the controls do not load')).toBeAttached();
});
