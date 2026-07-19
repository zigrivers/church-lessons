# Trust Under Pressure Lesson Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build, verify, ship, and permanently publish a 45–50 minute interactive 2 Kings 16–25 lesson that helps 17-year-old boys reason about trust, scripture-led reform, and covenant action.

**Architecture:** Create an isolated Vite static site under `trust-god-2kings-16-25/`. Keep the complete lesson in semantic HTML so it survives JavaScript failure; use focused TypeScript modules for lesson timing, state, DOM interactions, and GSAP motion. Unit tests cover pure logic, Playwright covers teacher flows, axe covers accessibility, and screenshot assertions protect the intentional design.

**Tech Stack:** Semantic HTML, CSS, TypeScript, Vite, GSAP with ScrollTrigger, Vitest with jsdom, Playwright, `@axe-core/playwright`, GitHub Actions, here.now.

---

## File map

### Repository-level files

- `.gitignore` — ignore generated Node, test, build, and here.now state while retaining visual baselines.
- `.github/workflows/test.yml` — run unit, build, Playwright, axe, and visual checks for this lesson on pushes and pull requests.
- `README.md` — identify both lesson sites and document local commands.
- `docs/superpowers/specs/2026-07-19-trust-god-2-kings-lesson-design.md` — approved product and teaching design; do not change unless implementation reveals a contradiction.
- `docs/superpowers/plans/2026-07-19-trust-god-2-kings-lesson.md` — this execution checklist.

### Lesson application

- `trust-god-2kings-16-25/package.json` and `package-lock.json` — scripts and pinned dependencies.
- `trust-god-2kings-16-25/tsconfig.json` — strict TypeScript settings.
- `trust-god-2kings-16-25/vite.config.ts` — Vite and Vitest configuration.
- `trust-god-2kings-16-25/playwright.config.ts` — local server, desktop projector, and mobile test projects.
- `trust-god-2kings-16-25/index.html` — all lesson copy, landmarks, chapter markup, teacher cues, source links, inline diagrams, and no-JavaScript fallback.
- `trust-god-2kings-16-25/src/styles.css` — design tokens, responsive layout, interaction states, reduced motion, present mode, and print mode.
- `trust-god-2kings-16-25/src/main.ts` — application composition only.
- `trust-god-2kings-16-25/src/lesson.ts` — chapter IDs, labels, timing, validation, and elapsed-time lookup.
- `trust-god-2kings-16-25/src/state.ts` — immutable lesson state, reducer, and guarded local storage.
- `trust-god-2kings-16-25/src/dom.ts` — DOM rendering, event delegation, chapter navigation, view controls, reveals, decision selection, reset, and print.
- `trust-god-2kings-16-25/src/motion.ts` — GSAP setup, ScrollTrigger cleanup, and reduced-motion policy.
- `trust-god-2kings-16-25/src/*.test.ts` — unit and jsdom interaction tests next to the modules they cover.
- `trust-god-2kings-16-25/tests/e2e/lesson.spec.ts` — complete teacher flow and keyboard checks.
- `trust-god-2kings-16-25/tests/e2e/accessibility.spec.ts` — axe checks across meaningful page states.
- `trust-god-2kings-16-25/tests/e2e/visual.spec.ts` — desktop and mobile visual baselines.
- `trust-god-2kings-16-25/tests/e2e/visual.spec.ts-snapshots/` — reviewed screenshot baselines.
- `trust-god-2kings-16-25/public/og-trust-under-pressure.svg` — original, lightweight share art using the pressure-line motif.

## Task 1: Scaffold the isolated testable site

**Files:**
- Modify: `.gitignore`
- Create: `trust-god-2kings-16-25/package.json`
- Create: `trust-god-2kings-16-25/package-lock.json`
- Create: `trust-god-2kings-16-25/tsconfig.json`
- Create: `trust-god-2kings-16-25/vite.config.ts`
- Create: `trust-god-2kings-16-25/playwright.config.ts`
- Create: `trust-god-2kings-16-25/src/toolchain.test.ts`

- [ ] **Step 1: Initialize the package and install current supported dependencies**

Run:

```bash
cd trust-god-2kings-16-25
npm init -y
npm install gsap
npm install --save-dev vite typescript vitest jsdom @types/node @playwright/test @axe-core/playwright
npx playwright install chromium
```

Expected: `package.json` and `package-lock.json` exist, dependency installation exits 0, and Chromium installation exits 0. Preserve the versions npm writes; do not replace them with guessed versions.

- [ ] **Step 2: Replace the generated scripts and metadata**

Use `apply_patch` so `package.json` has these exact non-version fields while preserving npm's generated `dependencies` and `devDependencies`:

```json
{
  "name": "trust-god-2kings-16-25",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "description": "Trust Under Pressure: an interactive 2 Kings 16–25 lesson",
  "scripts": {
    "dev": "vite --host 127.0.0.1",
    "build": "tsc --noEmit && vite build",
    "preview": "vite preview --host 127.0.0.1",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:e2e": "playwright test tests/e2e/lesson.spec.ts",
    "test:a11y": "playwright test tests/e2e/accessibility.spec.ts",
    "test:visual": "playwright test tests/e2e/visual.spec.ts",
    "test:all": "npm run test && npm run build && playwright test"
  }
}
```

- [ ] **Step 3: Add strict TypeScript and Vite/Vitest configuration**

Create `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "useDefineForClassFields": true,
    "module": "ESNext",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "skipLibCheck": true,
    "moduleResolution": "Bundler",
    "allowImportingTsExtensions": false,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src", "tests", "vite.config.ts", "playwright.config.ts"]
}
```

Create `vite.config.ts`:

```ts
import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  build: { outDir: 'dist', sourcemap: true },
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.ts'],
    coverage: { reporter: ['text', 'html'] },
  },
});
```

Create `playwright.config.ts`:

```ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: 'http://127.0.0.1:4173',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'projector',
      use: { viewport: { width: 1440, height: 900 } },
    },
    {
      name: 'mobile',
      use: { ...devices['iPhone 13'] },
    },
  ],
  webServer: {
    command: 'npm run dev -- --port 4173',
    url: 'http://127.0.0.1:4173',
    reuseExistingServer: !process.env.CI,
  },
});
```

- [ ] **Step 4: Write and run the toolchain smoke test**

Create `src/toolchain.test.ts`:

```ts
import { describe, expect, it } from 'vitest';

describe('lesson toolchain', () => {
  it('runs TypeScript unit tests', () => {
    expect('trust under pressure'.toUpperCase()).toBe('TRUST UNDER PRESSURE');
  });
});
```

Run: `npm run test`

Expected: one test passes.

- [ ] **Step 5: Ignore generated artifacts without ignoring visual baselines**

Append these lines to the repository `.gitignore`:

```gitignore
node_modules/
dist/
coverage/
playwright-report/
test-results/
.herenow/
```

Run: `git check-ignore trust-god-2kings-16-25/node_modules trust-god-2kings-16-25/dist`

Expected: both generated paths are printed.

- [ ] **Step 6: Commit the scaffold**

```bash
git add .gitignore trust-god-2kings-16-25
git commit -m "chore: scaffold Trust Under Pressure lesson"
git push
```

## Task 2: Apply the taste-selected visual system

**Files:**
- Create: `trust-god-2kings-16-25/docs/taste-design-plan.md`
- Create: `trust-god-2kings-16-25/public/og-trust-under-pressure.svg`

- [ ] **Step 1: Run the required deterministic taste selection**

Run this exact script from the repository root:

```bash
python3 - <<'PY'
import random

prompt = """Build an interesting and mentally/thought stimulating lesson plan using the following content: https://www.churchofjesuschrist.org/study/manual/come-follow-me-for-home-and-church-old-testament-2026/29?lang=eng

I'll be teaching 17 year old boys. Use the here.now and taste skill for the lesson plan."""
rng = random.Random(len(prompt))
hero = rng.choice(["Cinematic Center", "Artistic Asymmetry", "Editorial Split"])
font = rng.choice(["Satoshi", "Cabinet Grotesk", "Outfit", "Geist"])
components = rng.sample(["Inline Typography Images", "Horizontal Accordions", "Infinite Marquee", "Feedback/Testimonial Carousel"], 3)
motion = rng.sample(["Scroll Pinning", "Image Scale & Fade Scroll", "Scrubbing Text Reveals", "Card Stacking"], 2)
print(f"seed={len(prompt)} hero={hero} font={font}")
print("components=" + " | ".join(components))
print("motion=" + " | ".join(motion))
PY
```

Expected:

```text
seed=299 hero=Artistic Asymmetry font=Cabinet Grotesk
components=Inline Typography Images | Horizontal Accordions | Infinite Marquee
motion=Scrubbing Text Reveals | Card Stacking
```

- [ ] **Step 2: Output and record the exact design plan and uniqueness review**

Before editing any HTML or CSS, send the complete `<design_plan>` block below in commentary, then create `docs/taste-design-plan.md` with the same content:

````markdown
<design_plan>
# Siege to Sanctuary Taste Plan

## Seeded selection

- Seed: 299
- Hero: Artistic Asymmetry
- Type: Cabinet Grotesk display, system sans body, tabular system monospace utility
- Components: Inline Typography Images, Horizontal Accordions, Infinite Marquee
- Motion: Scrubbing Text Reveals, Card Stacking

## Tokens

- Night Signal `#0A1423`: opening field and dark controls
- Limestone `#EEEADF`: main reading surface
- Dust `#B8AF9A`: secondary copy and rules
- Warning Ember `#D4523A`: Assyrian pressure only
- Prayer Blue `#6CA7C8`: Hezekiah response and focus
- Covenant Gold `#D8B45A`: Josiah reform and final commitment

## Layout

The opening uses asymmetrical copy pressed left by a pressure-line field and a small inline image band inside the short headline. Assyrian claims move through a restrained marquee and resolve into a four-slice horizontal accordion. The prayer statement reveals word by word; the reform actions stack into an open vertical sequence.

```text
OPENING                 SIGNAL ACCORDION         PRAYER / REFORM
┌───────────────┐       ┌───┬───┬───┬───┐       ┌───────────────┐
│ words [image] │       │ A │ B │ C │ D │       │ word → reveal │
│ choices  //// │       │   expanded    │       │ cards stack ↓ │
└───────────────┘       └───┴───┴───┴───┘       └───────────────┘
```

## Signature

A single pressure line crowds the siege, bends at Hezekiah's prayer, and becomes the covenant underline. It is the only decorative flourish repeated across every chapter.

## Brief-specific review

The first pass risked becoming a generic dark tactical dashboard. The revision removes dashboard panels, limits the dark field to the siege, makes the selected marquee function as oppressive rhetoric rather than decoration, and converts the selected accordion and stacking motions into reasoning tools. Every visual shift now corresponds to the two scriptural case studies.

## Mandatory pre-flight

- AIDA: premium split navigation; Attention in the asymmetrical hero; Interest in the full-width decision grid and signal accordion; Desire in the prayer text scrub and reform card stack; Action in the private final-word field and source footer.
- Hero math: `width: min(100%, 18ch)` with `clamp(3rem, 7.2vw, 7.8rem)` on “Who gets the final word?” keeps the H1 to two or three lines at 320–1440 px. It contains one inline image band, no stamp, no badge, and no raw statistic.
- Density math: the decision grid uses three one-column items in a three-column row (3/3 occupied); the accordion uses four slices in four tracks (4/4 occupied). Both use `grid-auto-flow: dense`; neither can leave an empty cell.
- Label and contrast sweep: no numbered meta-label exists. Dark controls use Limestone text on Night Signal; light controls use Night Signal text on Limestone; focus uses Prayer Blue with a three-pixel outline.
</design_plan>
````

- [ ] **Step 3: Create original share art using the pressure-line motif**

Create `public/og-trust-under-pressure.svg` as a 1200×630 SVG with a Night Signal background, the title `TRUST / UNDER PRESSURE`, an Ember line bending into a Covenant Gold underline, and the source label `2 KINGS 16–25`. Use accessible `<title>` and `<desc>` elements. Do not use external images, emoji, shields, faux-Hebrew letters, or generated ancient textures.

Run:

```bash
file trust-god-2kings-16-25/public/og-trust-under-pressure.svg
rg -n "<title>|<desc>|TRUST|2 KINGS" trust-god-2kings-16-25/public/og-trust-under-pressure.svg
```

Expected: `file` identifies SVG text and `rg` finds all four required content markers.

- [ ] **Step 4: Commit the taste plan**

```bash
git add trust-god-2kings-16-25/docs trust-god-2kings-16-25/public
git commit -m "docs: define Siege to Sanctuary visual system"
git push
```

## Task 3: Build the tested chapter and timing model

**Files:**
- Create: `trust-god-2kings-16-25/src/lesson.test.ts`
- Create: `trust-god-2kings-16-25/src/lesson.ts`

- [ ] **Step 1: Write the failing timing tests**

Create `src/lesson.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { CHAPTERS, chapterForElapsed, totalMinutes, validateChapters } from './lesson';

describe('lesson chapters', () => {
  it('fills exactly 50 minutes with unique ordered chapters', () => {
    expect(totalMinutes(CHAPTERS)).toBe(50);
    expect(CHAPTERS.map(({ id }) => id)).toEqual([
      'offer', 'board', 'signal', 'prayer', 'book', 'reform', 'final-word',
    ]);
    expect(validateChapters(CHAPTERS)).toEqual([]);
  });

  it('maps elapsed time to the active chapter', () => {
    expect(chapterForElapsed(0).id).toBe('offer');
    expect(chapterForElapsed(4).id).toBe('board');
    expect(chapterForElapsed(17).id).toBe('signal');
    expect(chapterForElapsed(49).id).toBe('final-word');
    expect(chapterForElapsed(500).id).toBe('final-word');
  });
});
```

- [ ] **Step 2: Run the test and confirm the expected failure**

Run: `npm run test -- src/lesson.test.ts`

Expected: FAIL because `./lesson` does not exist.

- [ ] **Step 3: Implement the chapter model**

Create `src/lesson.ts`:

```ts
export type ChapterId =
  | 'offer'
  | 'board'
  | 'signal'
  | 'prayer'
  | 'book'
  | 'reform'
  | 'final-word';

export interface LessonChapter {
  readonly id: ChapterId;
  readonly label: string;
  readonly minutes: number;
}

export const CHAPTERS: readonly LessonChapter[] = [
  { id: 'offer', label: 'The offer', minutes: 4 },
  { id: 'board', label: 'The board', minutes: 4 },
  { id: 'signal', label: 'Signal or noise?', minutes: 10 },
  { id: 'prayer', label: 'Spread out the letter', minutes: 10 },
  { id: 'book', label: 'The missing book', minutes: 10 },
  { id: 'reform', label: 'Read or reform?', minutes: 8 },
  { id: 'final-word', label: 'Final word', minutes: 4 },
] as const;

export function totalMinutes(chapters: readonly LessonChapter[]): number {
  return chapters.reduce((sum, chapter) => sum + chapter.minutes, 0);
}

export function validateChapters(chapters: readonly LessonChapter[]): string[] {
  const ids = chapters.map(({ id }) => id);
  const errors: string[] = [];
  if (new Set(ids).size !== ids.length) errors.push('Chapter IDs must be unique.');
  if (chapters.some(({ minutes }) => minutes <= 0)) errors.push('Chapter minutes must be positive.');
  if (totalMinutes(chapters) !== 50) errors.push('Lesson must total 50 minutes.');
  return errors;
}

export function chapterForElapsed(elapsedMinutes: number): LessonChapter {
  const bounded = Math.max(0, elapsedMinutes);
  let cursor = 0;
  for (const chapter of CHAPTERS) {
    cursor += chapter.minutes;
    if (bounded < cursor) return chapter;
  }
  return CHAPTERS[CHAPTERS.length - 1] as LessonChapter;
}
```

- [ ] **Step 4: Run focused and full unit tests**

Run:

```bash
npm run test -- src/lesson.test.ts
npm run test
```

Expected: all tests pass.

- [ ] **Step 5: Commit the timing model**

```bash
git add trust-god-2kings-16-25/src/lesson.ts trust-god-2kings-16-25/src/lesson.test.ts
git commit -m "feat: define 50-minute lesson chapters"
git push
```

## Task 4: Build the tested lesson state and storage boundary

**Files:**
- Create: `trust-god-2kings-16-25/src/state.test.ts`
- Create: `trust-god-2kings-16-25/src/state.ts`

- [ ] **Step 1: Write reducer and storage tests**

Create `src/state.test.ts` with tests that assert:

```ts
import { describe, expect, it, vi } from 'vitest';
import { DEFAULT_STATE, loadLessonState, reduceLessonState, resetLessonState, saveLessonState } from './state';

describe('lesson state', () => {
  it('selects a decision, reveals evidence, changes view, and navigates', () => {
    const decided = reduceLessonState(DEFAULT_STATE, { type: 'choose', decision: 'wait' });
    const revealed = reduceLessonState(decided, { type: 'reveal', id: 'claim-history' });
    const presented = reduceLessonState(revealed, { type: 'set-view', viewMode: 'present' });
    const navigated = reduceLessonState(presented, { type: 'go-to', chapter: 'prayer' });
    expect(navigated).toMatchObject({
      openingDecision: 'wait',
      revealedIds: ['claim-history'],
      viewMode: 'present',
      activeChapter: 'prayer',
    });
  });

  it('does not duplicate revealed IDs', () => {
    const once = reduceLessonState(DEFAULT_STATE, { type: 'reveal', id: 'claim-history' });
    expect(reduceLessonState(once, { type: 'reveal', id: 'claim-history' }).revealedIds).toEqual(['claim-history']);
  });

  it('loads valid state and fails closed for malformed storage', () => {
    const valid = { getItem: vi.fn(() => JSON.stringify({ ...DEFAULT_STATE, viewMode: 'present' })) };
    const invalid = { getItem: vi.fn(() => '{bad json') };
    expect(loadLessonState(valid).viewMode).toBe('present');
    expect(loadLessonState(invalid)).toEqual(DEFAULT_STATE);
  });

  it('saves and resets only the lesson key', () => {
    const storage = { setItem: vi.fn(), removeItem: vi.fn() };
    saveLessonState(storage, DEFAULT_STATE);
    resetLessonState(storage);
    expect(storage.setItem).toHaveBeenCalledOnce();
    expect(storage.removeItem).toHaveBeenCalledWith('trust-under-pressure:v1');
  });
});
```

- [ ] **Step 2: Run the test and confirm the expected failure**

Run: `npm run test -- src/state.test.ts`

Expected: FAIL because `./state` does not exist.

- [ ] **Step 3: Implement immutable state transitions and guarded storage**

Create `src/state.ts` defining:

```ts
import type { ChapterId } from './lesson';

export type ViewMode = 'guide' | 'present';
export type Decision = 'surrender' | 'wait' | 'resist';

export interface LessonState {
  readonly activeChapter: ChapterId;
  readonly viewMode: ViewMode;
  readonly openingDecision?: Decision;
  readonly revealedIds: readonly string[];
}

export type LessonAction =
  | { readonly type: 'choose'; readonly decision: Decision }
  | { readonly type: 'reveal'; readonly id: string }
  | { readonly type: 'set-view'; readonly viewMode: ViewMode }
  | { readonly type: 'go-to'; readonly chapter: ChapterId }
  | { readonly type: 'reset' };

export const STORAGE_KEY = 'trust-under-pressure:v1';
export const DEFAULT_STATE: LessonState = {
  activeChapter: 'offer',
  viewMode: 'guide',
  revealedIds: [],
};

export function reduceLessonState(state: LessonState, action: LessonAction): LessonState {
  switch (action.type) {
    case 'choose': return { ...state, openingDecision: action.decision };
    case 'reveal': return state.revealedIds.includes(action.id)
      ? state
      : { ...state, revealedIds: [...state.revealedIds, action.id] };
    case 'set-view': return { ...state, viewMode: action.viewMode };
    case 'go-to': return { ...state, activeChapter: action.chapter };
    case 'reset': return DEFAULT_STATE;
  }
}

interface ReadStorage { getItem(key: string): string | null }
interface WriteStorage { setItem(key: string, value: string): void; removeItem(key: string): void }

export function loadLessonState(storage: ReadStorage): LessonState {
  try {
    const value: unknown = JSON.parse(storage.getItem(STORAGE_KEY) ?? 'null');
    if (!value || typeof value !== 'object') return DEFAULT_STATE;
    const candidate = value as Partial<LessonState>;
    return {
      activeChapter: candidate.activeChapter ?? DEFAULT_STATE.activeChapter,
      viewMode: candidate.viewMode === 'present' ? 'present' : 'guide',
      openingDecision: candidate.openingDecision,
      revealedIds: Array.isArray(candidate.revealedIds)
        ? candidate.revealedIds.filter((id): id is string => typeof id === 'string')
        : [],
    };
  } catch {
    return DEFAULT_STATE;
  }
}

export function saveLessonState(storage: Pick<WriteStorage, 'setItem'>, state: LessonState): void {
  try { storage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch { /* lesson stays usable */ }
}

export function resetLessonState(storage: Pick<WriteStorage, 'removeItem'>): void {
  try { storage.removeItem(STORAGE_KEY); } catch { /* lesson stays usable */ }
}
```

- [ ] **Step 4: Run focused and full unit tests**

Run: `npm run test -- src/state.test.ts && npm run test`

Expected: all tests pass.

- [ ] **Step 5: Commit the state model**

```bash
git add trust-god-2kings-16-25/src/state.ts trust-god-2kings-16-25/src/state.test.ts
git commit -m "feat: add resilient lesson state"
git push
```

## Task 5: Write the complete semantic lesson before JavaScript behavior

**Files:**
- Create: `trust-god-2kings-16-25/index.html`
- Create: `trust-god-2kings-16-25/src/styles.css`
- Create: `trust-god-2kings-16-25/src/main.ts`
- Create: `trust-god-2kings-16-25/tests/e2e/lesson.spec.ts`

- [ ] **Step 1: Write the failing semantic-content browser test**

Create `tests/e2e/lesson.spec.ts`:

```ts
import { expect, test } from '@playwright/test';

test('contains the complete teacher-led lesson in semantic HTML', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Trust Under Pressure/);
  await expect(page.getByRole('heading', { level: 1, name: 'Who gets the final word?' })).toBeVisible();
  for (const heading of [
    'The offer', 'The board', 'Signal or noise?', 'Spread out the letter',
    'The missing book', 'Read or reform?', 'Final word',
  ]) {
    await expect(page.getByRole('heading', { level: 2, name: heading })).toBeAttached();
  }
  await expect(page.locator('[data-chapter]')).toHaveCount(7);
  await expect(page.locator('[data-guide]')).toHaveCount(7);
  await expect(page.getByRole('link', { name: /official Come, Follow Me lesson/i })).toHaveAttribute('href', /churchofjesuschrist\.org/);
  await expect(page.getByText('If the controls do not load')).toBeAttached();
});
```

Run: `npm run test:e2e`

Expected: FAIL because `index.html` does not exist.

- [ ] **Step 2: Create the document shell and persistent controls**

Create `index.html` with these exact structural requirements:

```html
<!doctype html>
<html lang="en" data-view="guide">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="theme-color" content="#0A1423">
  <meta name="description" content="A 50-minute interactive lesson about Hezekiah, Josiah, trust under pressure, scripture-led reform, and covenant action.">
  <meta property="og:title" content="Trust Under Pressure">
  <meta property="og:description" content="When fear makes a convincing argument, who gets the final word?">
  <meta property="og:image" content="./og-trust-under-pressure.svg">
  <title>Trust Under Pressure — 2 Kings 16–25</title>
  <link rel="preconnect" href="https://api.fontshare.com">
  <link rel="stylesheet" href="https://api.fontshare.com/v2/css?f[]=cabinet-grotesk@400,500,700,800&display=swap">
  <script type="module" src="/src/main.ts"></script>
</head>
<body>
  <a class="skip-link" href="#lesson">Skip to lesson</a>
  <header class="hero" id="top">
    <nav class="site-nav" aria-label="Lesson controls">
      <a class="wordmark" href="#top">Trust / Under Pressure</a>
      <div class="view-switch" role="group" aria-label="Display view">
        <button type="button" data-view-button="guide" aria-pressed="true">Guide</button>
        <button type="button" data-view-button="present" aria-pressed="false">Present</button>
      </div>
      <button type="button" data-action="print">Print</button>
    </nav>
    <div class="pressure-line" aria-hidden="true"></div>
    <p class="kicker">2 Kings 16–25 · 50-minute lesson</p>
    <p class="hero-question">When fear makes a convincing argument…</p>
    <h1>Who gets <span class="inline-image" aria-hidden="true"></span> the final word?</h1>
    <p class="hero-copy">Two kings. Two crises. One question about whose voice has authority when pressure rises.</p>
    <a class="primary-action" href="#offer">Enter the crisis</a>
  </header>

  <div class="chapter-rail" aria-label="Lesson chapters">
    <button type="button" data-action="previous" aria-label="Previous chapter">Back</button>
    <button type="button" data-action="menu" aria-expanded="false" aria-controls="chapter-menu">
      <span data-current-label>The offer</span> <span data-time-label>0–4 min</span>
    </button>
    <button type="button" data-action="next" aria-label="Next chapter">Next</button>
    <div id="chapter-menu" hidden></div>
  </div>

  <main id="lesson"></main>

  <footer>
    <p>Prepared from 2 Kings 16–25 and the <a href="https://www.churchofjesuschrist.org/study/manual/come-follow-me-for-home-and-church-old-testament-2026/29?lang=eng" target="_blank" rel="noreferrer">official Come, Follow Me lesson</a>.</p>
    <button type="button" data-action="reset">Reset lesson</button>
  </footer>
  <noscript><p class="noscript-note">If the controls do not load, scroll through each chapter in order. Every activity and teacher note remains below.</p></noscript>
  <div class="sr-only" aria-live="polite" data-announcer></div>
</body>
</html>
```

Populate the empty `<main>` with the seven complete sections in Step 3 before running tests.

- [ ] **Step 3: Add all seven lesson chapters**

Use one `<section class="chapter" data-chapter="…" id="…" aria-labelledby="…">` per chapter. Include the following exact content and controls:

1. `offer`: the scenario “An undefeated empire has absorbed every nearby nation. Its field commander offers food, safety, and survival if Jerusalem surrenders. Your own king says to wait.” Add three buttons with `data-decision="surrender|wait|resist"`; the prompts “What evidence would you need?” and “What makes confidence trustworthy?”; a hidden context panel with `data-reveal-panel="offer-context"`; and a guide note instructing the teacher to count a show of hands without praising one choice.
2. `board`: an original inline SVG map labeling Assyria, Israel, Judah, Jerusalem, and Lachish; three facts—Samaria has fallen, fortified cities in Judah have fallen, Jerusalem remains; a button `data-reveal="board-stakes"`; and the question “If Assyria's track record is real, is fear irrational?”
3. `signal`: begin with a `.marquee` carrying `aria-label="Assyrian pressure claims"`, containing the four paraphrased claims once for assistive technology and a duplicated `aria-hidden="true"` row for seamless motion. Follow it with `<div class="signal-accordion" data-signal-accordion>` containing four `.signal-slice` articles: “Hezekiah cannot save you” (intimidation), “No other nation's gods delivered them” (evidence used beyond its limit), “The Lord told Assyria to attack” (unverifiable spiritual claim), and “Surrender and receive safety” (offer with omitted costs). Each slice has a button `data-reveal="claim-*"`, a matching hidden panel, a passage link to 2 Kings 18, and one deliberately debatable classification note. End with “Which claim is most dangerous because part of it is true?”
4. `prayer`: a visual letter with the Assyrian claim paraphrased, followed by the question “Why show God a letter He already knows?” Add three buttons carrying both `data-prayer-lens` and matching `data-reveal="prayer-*"` attributes, labeled “Name the threat,” “Remember who God is,” and “Ask with purpose.” Each reveals an original explanation and links to 2 Kings 18:5–7 and 19:14–19. Include the sentence “Trust does not make the threat imaginary. It changes who gets to interpret it.” once in a screen-reader-only span and once as individually wrapped, `aria-hidden="true"` word spans inside `[data-scrub-copy]` for the selected GSAP text reveal. Add a final `data-reveal="prayer-response"` panel summarizing Isaiah's response and Jerusalem's deliverance in 2 Kings 19:20–37, then ask: “Does ‘in God's hands’ mean our preferred result is guaranteed?”
5. `book`: open with “The law was not newly written. It was newly heard.” Ask students to predict what a society loses when scripture is present but functionally unread. Reveal 2 Kings 22:8–13 in three actions: discovered, read aloud, humbled. Ask, “Can you quote scripture and still have functionally lost it?”
6. `reform`: a six-item sequence inside a `data-reform-stack` container. Each article carries `data-reform-card` plus one of the `data-sequence` values `discover`, `humble`, `inquire`, `gather`, `covenant`, and `remove`; include a reveal button `data-reveal="reform-order"`, passage links to 2 Kings 22:8–13 and 23:1–25, and the debate prompt “If Josiah felt moved but removed nothing, did he hear the book?”
7. `final-word`: a calm field with three private choices—“Question one voice that has claimed too much authority,” “Act on one passage instead of only agreeing with it,” and “Strengthen one covenant habit before pressure chooses for you.” End with thirty seconds of silence, no typed input, and no request to report the choice.

Every section must also contain a teacher cue. Use these exact cue bodies in chapter order:

1. Offer: “Count the show of hands without praising a choice. Ask two students with different answers what evidence could change their minds. Do not reveal the outcome yet.”
2. Board: “Let a student point out the three locations. Keep the history under two minutes; the purpose is to make Assyria's confidence understandable.”
3. Signal: “Require evidence for every classification. Let the debatable card remain debatable. A student may voice uncertainty without becoming the lesson's object example.”
4. Prayer: “Pause after each movement. Do not turn prayer into a formula for getting a preferred outcome; ask what Hezekiah entrusts to God.”
5. Book: “Avoid shaming inconsistent readers. Invite students to diagnose functional loss in a culture or habit before asking for personal application.”
6. Reform: “Do not accept ‘he changed’ as the whole answer. Ask students to cite the action that proves each stage of Josiah's response.”
7. Final word: “Give a real thirty seconds of silence. Do not ask what anyone chose. Close by testifying that Jesus Christ makes repentance and covenant return possible.”

Use this markup with the matching cue body in each section:

```html
<aside class="guide-note" data-guide>
  <p class="guide-label">Teacher cue</p>
  <p>Count the show of hands without praising a choice. Ask two students with different answers what evidence could change their minds. Do not reveal the outcome yet.</p>
</aside>
```

Keep all copied scripture phrases short; use original summaries plus official passage links for context.

- [ ] **Step 4: Add the base styles and no-JavaScript-safe entrypoint**

Create `src/main.ts`:

```ts
import './styles.css';

document.documentElement.classList.add('has-js');
```

Create `src/styles.css` with these exact tokens and governing rules, then add component rules for every class used in `index.html`:

```css
:root {
  --night: #0a1423;
  --limestone: #eeeadf;
  --dust: #b8af9a;
  --ember: #d4523a;
  --prayer: #6ca7c8;
  --covenant: #d8b45a;
  --ink: #10151d;
  --paper: #f8f5ed;
  --focus: #8fcdf0;
  --display: 'Cabinet Grotesk', 'Arial Black', sans-serif;
  --body: 'Avenir Next', Avenir, 'Segoe UI', sans-serif;
  --utility: ui-monospace, 'SFMono-Regular', Consolas, monospace;
  color-scheme: light;
}

* { box-sizing: border-box; }
html { scroll-behavior: smooth; }
body { margin: 0; background: var(--paper); color: var(--ink); font: 1.0625rem/1.6 var(--body); }
button, a { font: inherit; }
button { min-height: 44px; }
:focus-visible { outline: 3px solid var(--focus); outline-offset: 4px; }
.skip-link { position: fixed; inset: 1rem auto auto 1rem; transform: translateY(-200%); z-index: 100; }
.skip-link:focus { transform: none; }
.hero { min-height: 100svh; overflow: clip; background: var(--night); color: var(--limestone); padding: 1.25rem clamp(1rem, 4vw, 4rem) 6rem; position: relative; }
.hero h1 { width: min(100%, 18ch); font: 800 clamp(3rem, 7.2vw, 7.8rem)/.92 var(--display); letter-spacing: -.055em; }
.inline-image { display: inline-block; width: clamp(3.5rem, 9vw, 9rem); height: .56em; margin-inline: .08em; border-radius: 999px; vertical-align: .06em; background: linear-gradient(90deg, rgba(212,82,58,.7), rgba(216,180,90,.3)), url('https://picsum.photos/seed/assyria-stone/320/160') center/cover; filter: grayscale(1) contrast(1.25); }
.pressure-line { position: absolute; inset: 12% 4% 8% 68%; border-left: clamp(8px, 1.4vw, 22px) solid var(--ember); transform: skewX(-8deg); opacity: .9; }
.chapter { min-height: 92svh; padding: clamp(7rem, 14vw, 13rem) clamp(1rem, 6vw, 7rem); scroll-margin-top: 5rem; }
.chapter > * { width: min(100%, 78rem); margin-inline: auto; }
.chapter h2 { max-width: 15ch; font: 800 clamp(2.7rem, 6vw, 6rem)/.95 var(--display); letter-spacing: -.045em; }
.guide-note { border-left: 4px solid var(--prayer); padding: 1rem 1.25rem; background: color-mix(in srgb, var(--prayer) 10%, white); }
html[data-view='present'] [data-guide] { display: none; }
.has-js [data-reveal-panel][hidden] { display: none; }
html:not(.has-js) [data-reveal-panel][hidden] { display: block !important; }
.decision-grid, .signal-accordion { display: grid; grid-auto-flow: dense; }
.decision-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
.signal-accordion { grid-template-columns: repeat(4, minmax(0, 1fr)); }
.signal-slice { min-width: 0; transition: grid-column .7s ease, transform .7s ease; }
.marquee { overflow: hidden; }
.marquee-track { display: flex; width: max-content; animation: pressure-marquee 28s linear infinite; }
@keyframes pressure-marquee { to { transform: translateX(-50%); } }
.sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0; }

@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  *, *::before, *::after { animation-duration: .01ms !important; animation-iteration-count: 1 !important; transition-duration: .01ms !important; }
}

@media print {
  .site-nav, .chapter-rail, [data-action], .skip-link { display: none !important; }
  .hero, .chapter { min-height: 0; color: black; background: white; padding: 1rem 0; break-inside: avoid; }
  [hidden], [data-guide] { display: block !important; }
  a[href]::after { content: ' (' attr(href) ')'; font-size: .75em; overflow-wrap: anywhere; }
}
```

The additional component rules must ensure: projector text is at least 17 px; controls have 44 px targets; decision cards and classifications never rely on color alone; the three-choice grid occupies 3/3 columns; the four-slice accordion occupies 4/4 columns; the active accordion slice expands on hover, focus-within, and `aria-expanded="true"`; clickable decision and signal cards scale their inner visual to `1.05` over 700 ms inside `overflow: hidden`; headings stay within three lines at 320, 390, 768, and 1440 px; and `body` uses `overflow-x: hidden; width: 100%; max-width: 100%`. At widths below 760 px, both decision and accordion grids become one column. Pause the marquee on hover and focus-within; reduced-motion mode disables it and shows one static row.

- [ ] **Step 5: Run the semantic test and production build**

Run:

```bash
npm run test:e2e
npm run build
```

Expected: semantic test passes, TypeScript exits 0, and Vite writes `dist/index.html`, `dist/assets/*`, and `dist/og-trust-under-pressure.svg`.

- [ ] **Step 6: Commit the complete static lesson**

```bash
git add trust-god-2kings-16-25/index.html trust-god-2kings-16-25/src trust-god-2kings-16-25/tests
git commit -m "feat: add complete Trust Under Pressure lesson"
git push
```

## Task 6: Add tested teacher controls and interactions

**Files:**
- Create: `trust-god-2kings-16-25/src/dom.test.ts`
- Create: `trust-god-2kings-16-25/src/dom.ts`
- Modify: `trust-god-2kings-16-25/src/main.ts`
- Modify: `trust-god-2kings-16-25/tests/e2e/lesson.spec.ts`

- [ ] **Step 1: Write failing jsdom interaction tests**

Create `src/dom.test.ts` with a fixture containing one decision button, one reveal button/panel, Guide/Present buttons, a reset button, and an announcer. Assert that `mountLesson()`:

```ts
import { beforeEach, describe, expect, it } from 'vitest';
import { mountLesson } from './dom';

beforeEach(() => {
  document.body.innerHTML = `
    <button data-decision="wait">Wait</button>
    <button data-reveal="claim-history" aria-expanded="false">Reveal</button>
    <div data-reveal-panel="claim-history" hidden>Evidence used beyond its limit</div>
    <button data-view-button="guide" aria-pressed="true">Guide</button>
    <button data-view-button="present" aria-pressed="false">Present</button>
    <button data-action="reset">Reset</button>
    <div data-announcer></div>`;
  document.documentElement.dataset.view = 'guide';
  localStorage.clear();
});

describe('teacher controls', () => {
  it('selects decisions and reveals evidence', () => {
    const cleanup = mountLesson(document, localStorage);
    document.querySelector<HTMLButtonElement>('[data-decision="wait"]')?.click();
    document.querySelector<HTMLButtonElement>('[data-reveal="claim-history"]')?.click();
    expect(document.querySelector('[data-decision="wait"]')?.getAttribute('aria-pressed')).toBe('true');
    expect(document.querySelector('[data-reveal-panel="claim-history"]')?.hasAttribute('hidden')).toBe(false);
    cleanup();
  });

  it('switches to Present view and reset restores Guide view', () => {
    const cleanup = mountLesson(document, localStorage);
    document.querySelector<HTMLButtonElement>('[data-view-button="present"]')?.click();
    expect(document.documentElement.dataset.view).toBe('present');
    document.querySelector<HTMLButtonElement>('[data-action="reset"]')?.click();
    expect(document.documentElement.dataset.view).toBe('guide');
    cleanup();
  });
});
```

Run: `npm run test -- src/dom.test.ts`

Expected: FAIL because `./dom` does not exist.

- [ ] **Step 2: Implement event delegation and rendering**

Create `src/dom.ts` with:

```ts
import { CHAPTERS, type ChapterId } from './lesson';
import {
  DEFAULT_STATE,
  loadLessonState,
  reduceLessonState,
  resetLessonState,
  saveLessonState,
  type Decision,
  type LessonAction,
  type LessonState,
  type ViewMode,
} from './state';

export function mountLesson(root: Document, storage: Storage): () => void {
  let state = loadLessonState(storage);

  const announce = (message: string): void => {
    const region = root.querySelector<HTMLElement>('[data-announcer]');
    if (region) region.textContent = message;
  };

  const render = (): void => {
    root.documentElement.dataset.view = state.viewMode;
    root.querySelectorAll<HTMLElement>('[data-view-button]').forEach((button) => {
      button.setAttribute('aria-pressed', String(button.dataset.viewButton === state.viewMode));
    });
    root.querySelectorAll<HTMLElement>('[data-decision]').forEach((button) => {
      button.setAttribute('aria-pressed', String(button.dataset.decision === state.openingDecision));
    });
    root.querySelectorAll<HTMLElement>('[data-reveal-panel]').forEach((panel) => {
      panel.toggleAttribute('hidden', !state.revealedIds.includes(panel.dataset.revealPanel ?? ''));
    });
    root.querySelectorAll<HTMLElement>('[data-reveal]').forEach((button) => {
      button.setAttribute('aria-expanded', String(state.revealedIds.includes(button.dataset.reveal ?? '')));
    });
    const active = CHAPTERS.find(({ id }) => id === state.activeChapter) ?? CHAPTERS[0];
    const label = root.querySelector<HTMLElement>('[data-current-label]');
    if (label && active) label.textContent = active.label;
    saveLessonState(storage, state);
  };

  const dispatch = (action: LessonAction, message: string): void => {
    state = reduceLessonState(state, action);
    render();
    announce(message);
  };

  const onClick = (event: Event): void => {
    const target = (event.target as Element | null)?.closest<HTMLElement>('button, a');
    if (!target) return;
    if (target.dataset.decision) {
      dispatch({ type: 'choose', decision: target.dataset.decision as Decision }, `Decision selected: ${target.textContent?.trim() ?? ''}`);
    } else if (target.dataset.reveal) {
      dispatch({ type: 'reveal', id: target.dataset.reveal }, 'Evidence revealed.');
    } else if (target.dataset.viewButton) {
      dispatch({ type: 'set-view', viewMode: target.dataset.viewButton as ViewMode }, `${target.textContent?.trim() ?? ''} view active.`);
    } else if (target.dataset.chapterTarget) {
      const chapter = target.dataset.chapterTarget as ChapterId;
      dispatch({ type: 'go-to', chapter }, `${target.textContent?.trim() ?? ''} chapter.`);
      root.getElementById(chapter)?.scrollIntoView({ block: 'start' });
    } else if (target.dataset.action === 'reset') {
      resetLessonState(storage);
      state = DEFAULT_STATE;
      render();
      announce('Lesson reset.');
    } else if (target.dataset.action === 'print') {
      window.print();
    }
  };

  root.addEventListener('click', onClick);
  render();
  return () => root.removeEventListener('click', onClick);
}
```

Extend this implementation before completing the step so `previous`, `next`, and `menu` actions use the `CHAPTERS` order, set `aria-expanded`, populate `#chapter-menu` with seven `data-chapter-target` buttons, update the time label with cumulative minute ranges, and disable Back/Next at the first/last chapter. Keep those computations in small named functions within `dom.ts` and cover first/last boundaries in `dom.test.ts`.

- [ ] **Step 3: Compose the application**

Update `src/main.ts`:

```ts
import './styles.css';
import { mountLesson } from './dom';
import { setupMotion } from './motion';

document.documentElement.classList.add('has-js');
const cleanupLesson = mountLesson(document, localStorage);
const cleanupMotion = setupMotion(document, window.matchMedia('(prefers-reduced-motion: reduce)').matches);

window.addEventListener('pagehide', () => {
  cleanupMotion();
  cleanupLesson();
}, { once: true });
```

Use a temporary `src/motion.ts` that exports `setupMotion(): () => void` returning a no-op cleanup until Task 7 replaces it.

- [ ] **Step 4: Extend the browser test through the full teacher flow**

Add assertions to `tests/e2e/lesson.spec.ts` that choose Wait, reveal the offer context, switch to Present view and verify a teacher cue becomes hidden, navigate Next through all seven chapter labels, reveal one signal card, use Reset, and verify Guide view, The offer, hidden reveal panels, and no selected decision are restored.

Run:

```bash
npm run test
npm run test:e2e
```

Expected: unit and teacher-flow tests pass in both projector and mobile projects.

- [ ] **Step 5: Commit the controls**

```bash
git add trust-god-2kings-16-25/src trust-god-2kings-16-25/tests/e2e/lesson.spec.ts
git commit -m "feat: add teacher presentation controls"
git push
```

## Task 7: Add the selected GSAP motion with a tested safety policy

**Files:**
- Create: `trust-god-2kings-16-25/src/motion.test.ts`
- Modify: `trust-god-2kings-16-25/src/motion.ts`
- Modify: `trust-god-2kings-16-25/src/styles.css`

- [ ] **Step 1: Write the failing motion-policy tests**

Create `src/motion.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { motionPolicy } from './motion';

describe('motion policy', () => {
  it('disables scrubbing and stacking for reduced motion', () => {
    expect(motionPolicy(true, 1440)).toEqual({ textScrub: false, cardStack: false });
  });

  it('keeps readable text motion but uses a normal card list on narrow screens', () => {
    expect(motionPolicy(false, 390)).toEqual({ textScrub: true, cardStack: false });
  });

  it('enables both selected paradigms on projector screens', () => {
    expect(motionPolicy(false, 1440)).toEqual({ textScrub: true, cardStack: true });
  });
});
```

Run: `npm run test -- src/motion.test.ts`

Expected: FAIL because `motionPolicy` is not exported.

- [ ] **Step 2: Implement the policy and GSAP lifecycle**

Replace `src/motion.ts` with:

```ts
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export interface MotionPolicy { textScrub: boolean; cardStack: boolean }

export function motionPolicy(reduced: boolean, width: number): MotionPolicy {
  if (reduced) return { textScrub: false, cardStack: false };
  return { textScrub: true, cardStack: width >= 900 };
}

export function setupMotion(root: Document, reduced: boolean): () => void {
  const policy = motionPolicy(reduced, window.innerWidth);
  if (!policy.textScrub && !policy.cardStack) return () => undefined;

  const context = gsap.context(() => {
    const words = gsap.utils.toArray<HTMLElement>('[data-scrub-word]');
    const copy = root.querySelector<HTMLElement>('[data-scrub-copy]');
    if (policy.textScrub && copy && words.length > 0) {
      gsap.fromTo(words, { opacity: 0.12 }, {
        opacity: 1,
        stagger: 0.12,
        ease: 'none',
        scrollTrigger: {
          trigger: copy,
          start: 'top 82%',
          end: 'bottom 42%',
          scrub: 0.6,
        },
      });
    }

    const stack = root.querySelector<HTMLElement>('[data-reform-stack]');
    const cards = gsap.utils.toArray<HTMLElement>('[data-reform-card]');
    if (policy.cardStack && stack && cards.length > 1) {
      root.documentElement.classList.add('motion-stack');
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: stack,
          start: 'top top',
          end: `+=${cards.length * 320}`,
          pin: true,
          scrub: 0.7,
          invalidateOnRefresh: true,
        },
      });
      cards.slice(1).forEach((card, index) => {
        timeline.fromTo(card, { yPercent: 115, scale: 0.96 }, {
          yPercent: index * 3,
          scale: 1,
          duration: 1,
          ease: 'power2.out',
        });
      });
    }
  }, root.body);

  return () => {
    context.revert();
    root.documentElement.classList.remove('motion-stack');
  };
}
```

- [ ] **Step 3: Add motion-safe layout support**

In `src/styles.css`, keep `[data-scrub-word]` fully visible unless GSAP applies inline opacity. Keep `[data-reform-card]` in a normal vertical list by default. Only under `html.motion-stack` and `(min-width: 900px) and (prefers-reduced-motion: no-preference)` should the reform cards share one grid cell and layer by source order. Ensure the pinned stack has a stable minimum height and every card remains readable when motion is disabled. Do not animate teacher controls, focus outlines, or the final private choices.

- [ ] **Step 4: Verify unit, build, and teacher flow**

Run:

```bash
npm run test
npm run build
npm run test:e2e
```

Expected: all pass; the production bundle contains GSAP; no TypeScript errors appear.

- [ ] **Step 5: Commit the motion system**

```bash
git add trust-god-2kings-16-25/src/motion.ts trust-god-2kings-16-25/src/motion.test.ts trust-god-2kings-16-25/src/styles.css
git commit -m "feat: reveal prayer and reform with GSAP"
git push
```

## Task 8: Prove accessibility, print resilience, and visual quality

**Files:**
- Create: `trust-god-2kings-16-25/tests/e2e/accessibility.spec.ts`
- Create: `trust-god-2kings-16-25/tests/e2e/visual.spec.ts`
- Create: `trust-god-2kings-16-25/tests/e2e/visual.spec.ts-snapshots/*`
- Modify: `trust-god-2kings-16-25/tests/e2e/lesson.spec.ts`
- Modify: `trust-god-2kings-16-25/src/styles.css`
- Modify: `trust-god-2kings-16-25/index.html`

- [ ] **Step 1: Write axe checks for meaningful states**

Create `tests/e2e/accessibility.spec.ts`:

```ts
import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

async function expectNoSeriousViolations(page: Page): Promise<void> {
  const result = await new AxeBuilder({ page }).analyze();
  const serious = result.violations.filter(({ impact }) => impact === 'serious' || impact === 'critical');
  expect(serious).toEqual([]);
}

test('opening is accessible', async ({ page }) => {
  await page.goto('/');
  await expectNoSeriousViolations(page);
});

test('revealed signal and Present view are accessible', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /present/i }).click();
  await page.locator('[data-reveal^="claim-"]').first().click();
  await expectNoSeriousViolations(page);
});

test('final chapter is accessible', async ({ page }) => {
  await page.goto('/#final-word');
  await expectNoSeriousViolations(page);
});
```

- [ ] **Step 2: Add keyboard, clipping, no-console, and print assertions**

Extend `tests/e2e/lesson.spec.ts` to:

- collect `page.on('console')` errors and `page.on('pageerror')` exceptions and expect both arrays empty;
- press Tab from the top and verify the skip link receives visible focus;
- activate the skip link with Enter and verify `#lesson` receives focus or becomes the URL target;
- use only keyboard controls to select Wait, reveal evidence, and switch views;
- at 320 px and 1440 px, evaluate `document.documentElement.scrollWidth <= document.documentElement.clientWidth` with no exclusion;
- emulate print media and assert all seven guide notes and reveal panels are visible.
- create a separate browser context with `{ javaScriptEnabled: false }`, load the page, and assert all seven chapters, seven guide notes, and every reveal panel are visible and readable.

- [ ] **Step 3: Add visual-regression assertions**

Create `tests/e2e/visual.spec.ts` with screenshot tests for:

```ts
import { expect, test } from '@playwright/test';

test('opening visual', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveScreenshot('opening.png', { fullPage: false, animations: 'disabled' });
});

test('signal board visual', async ({ page }) => {
  await page.goto('/#signal');
  await page.locator('[data-reveal^="claim-"]').first().click();
  await expect(page.locator('#signal')).toHaveScreenshot('signal.png', { animations: 'disabled' });
});

test('prayer visual', async ({ page }) => {
  await page.goto('/#prayer');
  await expect(page.locator('#prayer')).toHaveScreenshot('prayer.png', { animations: 'disabled' });
});

test('final word visual', async ({ page }) => {
  await page.goto('/#final-word');
  await expect(page.locator('#final-word')).toHaveScreenshot('final-word.png', { animations: 'disabled' });
});
```

- [ ] **Step 4: Generate and visually inspect baselines**

Run:

```bash
npx playwright test tests/e2e/visual.spec.ts --update-snapshots
npx playwright test tests/e2e/visual.spec.ts
```

Expected: baseline PNGs are created for projector and mobile projects, followed by a clean comparison pass. Open every baseline image; correct clipping, accidental empty space, low contrast, repeated generic card layouts, overlong headings, and motion-dependent missing content before accepting it.

- [ ] **Step 5: Fetch the current Web Interface Guidelines and audit the UI**

Fetch `https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md`, apply every relevant rule to `index.html`, `src/styles.css`, and `src/*.ts`, and record each finding as `file:line`. Fix all actionable serious issues, rerun affected tests, and retain no unresolved high-impact accessibility or usability finding.

- [ ] **Step 6: Run the entire local gate**

Run: `npm run test:all`

Expected: unit tests, strict TypeScript, Vite production build, teacher flow, axe checks, and visual comparisons all pass in projector and mobile projects.

- [ ] **Step 7: Commit verified accessibility and visual baselines**

```bash
git add trust-god-2kings-16-25
git commit -m "test: verify lesson accessibility and visuals"
git push
```

## Task 9: Add CI and teacher-facing documentation

**Files:**
- Create: `.github/workflows/test.yml`
- Modify: `README.md`

- [ ] **Step 1: Add the GitHub Actions test workflow**

Create `.github/workflows/test.yml`:

```yaml
name: Test lesson sites

on:
  pull_request:
  push:
    branches: [main]

permissions:
  contents: read

jobs:
  trust-under-pressure:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: trust-god-2kings-16-25
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
          cache-dependency-path: trust-god-2kings-16-25/package-lock.json
      - run: npm ci
      - run: npx playwright install --with-deps chromium
      - run: npm run test:all
      - if: failure()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report
          path: trust-god-2kings-16-25/playwright-report
          retention-days: 7
```

- [ ] **Step 2: Document both lesson projects and exact commands**

Replace the two-line `README.md` with a plain-language overview that preserves the existing Ruth/Hannah lesson and adds:

````markdown
## Trust Under Pressure — 2 Kings 16–25

An interactive 50-minute teacher guide for older teenagers. It moves from Hezekiah's siege and prayer to Josiah's rediscovery of scripture, reform, and covenant.

```bash
cd trust-god-2kings-16-25
npm install
npm run dev
```

Use `npm run test:all` to run unit, build, browser, accessibility, and visual checks. Use `npm run build` to create the static `dist/` directory for here.now.
````

Also explain Guide versus Present view, Reset, Print, the 50-minute pacing, and that students do not need phones or accounts.

- [ ] **Step 3: Verify workflow syntax and the full gate**

Run:

```bash
ruby -e "require 'yaml'; YAML.load_file('.github/workflows/test.yml'); puts 'workflow yaml valid'"
cd trust-god-2kings-16-25
npm run test:all
```

Expected: `workflow yaml valid`, followed by a completely passing local gate.

- [ ] **Step 4: Commit CI and documentation**

```bash
git add .github/workflows/test.yml README.md
git commit -m "ci: test Trust Under Pressure lesson"
git push
```

## Task 10: Dogfood the complete lesson in a real browser

**Files:**
- Modify only files with reproducible findings from browser QA.

- [ ] **Step 1: Start the local production preview**

Run `npm run build && npm run preview -- --port 4173` in a persistent terminal session.

Expected: Vite reports `http://127.0.0.1:4173/` and no build error.

- [ ] **Step 2: Load the current agent-browser workflow**

Run:

```bash
agent-browser skills get core
agent-browser skills get dogfood
```

Follow the returned current instructions rather than relying on remembered command behavior.

- [ ] **Step 3: Complete projector-size teacher QA**

Use agent-browser to open `http://127.0.0.1:4173/`, take an interactive snapshot, and complete the actual 50-minute sequence in compressed QA form:

1. choose each opening response and confirm the selected state changes;
2. reveal the offer and map stakes;
3. inspect and reveal every signal card;
4. operate all three prayer lenses;
5. reveal the book and reform sequences;
6. switch between Guide and Present views in multiple chapters;
7. navigate Back, Next, and the full chapter menu including first/last boundaries;
8. reset and confirm no previous state survives;
9. reload and confirm only intended state persists before reset;
10. confirm every Church source link resolves to the intended official page without navigating the lesson tab away.

Capture screenshots of the opening, signal accordion, prayer movements, reform stack, final word, and print preview.

- [ ] **Step 4: Complete mobile and keyboard QA**

Use a mobile viewport and keyboard-only interaction. Confirm 320 px readability, no unintended horizontal page scroll, visible focus, usable 44 px controls, accessible reveal state, no clipped chapter rail, and a calm final screen. Inspect browser console output and treat any uncaught error or failed local asset as a bug.

- [ ] **Step 5: Fix only reproducible findings and rerun the full gate**

For each finding, explain the cause in a brief code comment only if the code would otherwise be surprising; add or tighten a regression test; apply the smallest clear fix; run the focused test; then run `npm run test:all`.

Expected: no verified high-impact finding remains and the full gate passes after the final edit.

- [ ] **Step 6: Commit browser-QA fixes if any exist**

```bash
git add trust-god-2kings-16-25
git commit -m "fix: resolve lesson browser QA findings"
git push
```

Skip this commit only if `git status --short` is empty.

## Task 11: Publish, review, merge, republish, and clean up

**Files:**
- No committed file changes expected; `.herenow/state.json` remains ignored.

- [ ] **Step 1: Verify the final branch and local gate**

Run:

```bash
git status --short --branch
git log --oneline origin/main..HEAD
cd trust-god-2kings-16-25
npm run test:all
```

Expected: clean feature branch, only intended commits ahead of `origin/main`, and every test/build/browser gate passes.

- [ ] **Step 2: Publish the verified build using here.now**

Confirm `/Users/kenallred/.herenow/credentials` exists and is non-empty without printing it. From `trust-god-2kings-16-25/`, run:

```bash
/Users/kenallred/.agents/skills/here-now/scripts/publish.sh dist --client codex
```

Expected: publish create, upload, and finalize all succeed. Record the script's `siteUrl` and `publish_result.auth_mode`. Require `authenticated`; if it is anonymous, do not call the publication permanent and follow the here.now sign-in flow before final completion.

- [ ] **Step 3: Verify the live site**

Use agent-browser against the returned `https://…here.now/` URL. Verify title, seven chapters, Guide/Present switching, one decision, one reveal, Reset, source links, mobile layout, zero console errors, and the OG image response. Run an axe check against the live opening and final chapter.

Expected: live behavior matches the exact local build.

- [ ] **Step 4: Open the pull request and wait for policy checks**

Run:

```bash
git push
gh pr create --base main --head feature/trust-god-2-kings-lesson --title "Build Trust Under Pressure 2 Kings lesson" --body "Builds and verifies a 50-minute interactive lesson for 2 Kings 16–25. Includes Guide and Present views, scripture reasoning activities, print fallback, unit and browser tests, axe accessibility checks, visual regression, CI, and permanent here.now publication."
gh pr checks --watch
```

Expected: a pull request URL and all required checks green. Do not merge with a failing required check.

- [ ] **Step 5: Review the diff before merge**

Use the `requesting-code-review` skill on the complete diff. Resolve every verified serious issue with a regression test, focused test run, full `npm run test:all`, commit, push, and another `gh pr checks --watch`. Document any disproven review claim with exact file and test evidence.

- [ ] **Step 6: Merge and prove merge state before cleanup**

Run:

```bash
gh pr merge --squash --delete-branch
gh pr view --json state,mergedAt,mergeCommit,url
git switch main
git pull --ff-only origin main
```

Expected: PR state is `MERGED`, `mergedAt` is non-null, and local `main` fast-forwards to the merge commit. Only after this proof, delete the local feature branch with `git branch -d feature/trust-god-2-kings-lesson` if Git has not already removed it.

- [ ] **Step 7: Rebuild and republish from merged main**

From `trust-god-2kings-16-25/`, run:

```bash
npm ci
npm run test:all
npm run build
lesson_site_slug="$(jq -r '.publishes | keys | last' .herenow/state.json)"
test -n "$lesson_site_slug" && test "$lesson_site_slug" != "null"
/Users/kenallred/.agents/skills/here-now/scripts/publish.sh dist --slug "$lesson_site_slug" --client codex
```

Expected: the local publish state supplies the exact non-secret slug from the first publish, the authenticated update finalizes successfully at the same permanent URL, and the live version matches merged `main`.

- [ ] **Step 8: Final completion audit and notification**

Check every completion criterion in the design specification against current evidence: seven chapters and intended activities, Guide and Present views, print/no-JavaScript fallback, passing full gate, browser QA, merged PR, branch cleanup, and live permanent URL. Then run:

```bash
launchpad notify "Trust Under Pressure lesson is tested, merged, and live on here.now"
```

Expected: desktop notification succeeds. Report the permanent URL, lesson length, test results, PR/merge result, and cleaned branches to the user.
