import { expect, test, type Page } from '@playwright/test';

async function tabToControl(page: Page, name: string): Promise<void> {
  for (let attempt = 0; attempt < 16; attempt += 1) {
    await page.keyboard.press('Tab');
    const activeName = await page.evaluate(() => {
      const active = document.activeElement;
      return active?.getAttribute('aria-label') ?? active?.textContent?.trim() ?? '';
    });
    if (activeName.includes(name)) return;
  }
  throw new Error(`Keyboard focus never reached ${name}`);
}

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
      const claim = page.locator('[data-reveal="claim-confidence"]');
      await claim.focus();
      await claim.press('Enter');
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
  await expect(page.locator('#offer')).toBeInViewport();
});

test('loads without browser errors or failed assets', async ({ page }) => {
  const errors: string[] = [];
  const failedRequests: string[] = [];

  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('requestfailed', (request) => failedRequests.push(request.url()));

  await page.goto('/');
  await page.waitForLoadState('networkidle');

  expect(errors).toEqual([]);
  expect(failedRequests).toEqual([]);
});

test('supports the core lesson controls with a keyboard only', async ({ page }) => {
  await page.goto('/');

  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to lesson' })).toBeFocused();
  await expect(page.getByRole('link', { name: 'Skip to lesson' })).toBeVisible();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#lesson$/);

  await page.goto('/');
  await tabToControl(page, 'Present');
  await page.keyboard.press('Enter');
  await expect(page.getByRole('button', { name: 'Present', exact: true })).toHaveAttribute(
    'aria-pressed',
    'true',
  );

  await tabToControl(page, 'Wait');
  await page.keyboard.press('Enter');
  await expect(page.locator('[data-decision="wait"]')).toHaveAttribute('aria-pressed', 'true');

  await tabToControl(page, 'Reveal what the room knows');
  await page.keyboard.press('Enter');
  await expect(page.locator('[data-reveal-panel="offer-context"]')).toBeVisible();
});

test('avoids horizontal clipping and prints every teaching note', async ({ page }) => {
  for (const width of [320, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    const fitsViewport = await page.evaluate(
      () => document.documentElement.scrollWidth <= document.documentElement.clientWidth,
    );
    expect(fitsViewport, `${width}px layout should not scroll sideways`).toBe(true);
    if (width === 320) {
      const firstClaim = page.locator('[data-reveal^="claim-"]').first();
      await firstClaim.focus();
      const columnCount = await page.locator('.signal-accordion').evaluate((accordion) =>
        getComputedStyle(accordion).gridTemplateColumns.trim().split(/\s+/).filter(Boolean).length,
      );
      expect(columnCount, 'phone signal cards should remain a readable single column').toBe(1);
    }
  }

  await page.emulateMedia({ media: 'print' });
  await page.goto('/');
  const guideNotes = page.locator('[data-guide]');
  const revealPanels = page.locator('[data-reveal-panel]');
  await expect(guideNotes).toHaveCount(7);
  await expect(revealPanels).toHaveCount(12);
  for (let index = 0; index < 7; index += 1) await expect(guideNotes.nth(index)).toBeVisible();
  for (let index = 0; index < 12; index += 1) await expect(revealPanels.nth(index)).toBeVisible();
});

test('keeps the full lesson readable when JavaScript is unavailable', async ({ browser }) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  });
  const page = await context.newPage();

  try {
    await page.goto('/');
    const chapters = page.locator('[data-chapter]');
    const guideNotes = page.locator('[data-guide]');
    const revealPanels = page.locator('[data-reveal-panel]');
    await expect(chapters).toHaveCount(7);
    await expect(guideNotes).toHaveCount(7);
    await expect(revealPanels).toHaveCount(12);
    for (let index = 0; index < 7; index += 1) {
      await expect(chapters.nth(index)).toBeVisible();
      await expect(guideNotes.nth(index)).toBeVisible();
    }
    for (let index = 0; index < 12; index += 1) {
      await expect(revealPanels.nth(index)).toBeVisible();
    }
    await expect(page.getByText('If the controls do not load')).toBeVisible();
  } finally {
    await context.close();
  }
});
