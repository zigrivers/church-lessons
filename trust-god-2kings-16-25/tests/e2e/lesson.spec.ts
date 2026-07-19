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

test('supports the complete teacher presentation flow and reset', async ({ page }) => {
  await page.goto('/');

  const waitDecision = page.locator('[data-decision="wait"]');
  await waitDecision.click();
  await expect(waitDecision).toHaveAttribute('aria-pressed', 'true');

  await page.getByRole('button', { name: 'Reveal what the room knows' }).click();
  await expect(page.locator('[data-reveal-panel="offer-context"]')).toBeVisible();

  await page.getByRole('button', { name: 'Present', exact: true }).click();
  await expect(page.locator('[data-guide]').first()).toBeHidden();

  const next = page.getByRole('button', { name: 'Next chapter', exact: true });
  const currentLabel = page.locator('[data-current-label]');
  for (const label of [
    'The board',
    'Signal or noise?',
    'Spread out the letter',
    'The missing book',
    'Read or reform?',
    'Final word',
  ]) {
    await next.click();
    await expect(currentLabel).toHaveText(label);
    if (label === 'Signal or noise?') {
      await page.locator('[data-reveal="claim-confidence"]').click();
      await expect(page.locator('[data-reveal-panel="claim-confidence"]')).toBeVisible();
    }
  }
  await expect(next).toBeDisabled();

  await page.locator('[data-action="reset"]').click();
  await expect(currentLabel).toHaveText('The offer');
  await expect(page.getByRole('button', { name: 'Guide', exact: true })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  await expect(waitDecision).toHaveAttribute('aria-pressed', 'false');
  await expect(page.locator('[data-reveal-panel="offer-context"]')).toBeHidden();
});
