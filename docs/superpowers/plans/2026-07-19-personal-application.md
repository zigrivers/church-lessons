# Personal Application Expansion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add present-day, private personal-application prompts for all five requested gospel principles without extending the 50-minute lesson.

**Architecture:** Add three semantic application panels to the existing static lesson HTML and style them with a reusable CSS component. Extend Playwright coverage to verify content, privacy, pacing, responsive layout, print, and accessibility.

**Tech Stack:** Semantic HTML, CSS, TypeScript, Vite, Vitest, Playwright, axe, agent-browser, here.now

---

### Task 1: Define application coverage in browser tests

**Files:**
- Modify: `trust-god-2kings-16-25/tests/e2e/lesson.spec.ts`

- [ ] Add a test that expects three `[data-application-lab]` panels and the phrases “faith is challenged,” “Hezekiah,” “the Lord’s hands,” “scripture,” “Heavenly Father,” and “Jesus Christ.”
- [ ] Assert that current-life examples include school, team, group chat, online feed, friends, media, and future choices.
- [ ] Assert that each lab says “Choose one” and that no public answer is required.
- [ ] Run `npx playwright test tests/e2e/lesson.spec.ts --grep "connects every principle"` and confirm it fails because the panels do not exist.

### Task 2: Add the application labs

**Files:**
- Modify: `trust-god-2kings-16-25/index.html`
- Modify: `trust-god-2kings-16-25/src/styles.css`

- [ ] Add the Faith Under Pressure and Hezekiah’s Pattern panels to the board chapter.
- [ ] Add the Scripture Can Interrupt Me panel to the book chapter.
- [ ] Add the My Faithful Part / The Lord’s Hands panel to the reform chapter, naming Heavenly Father and Jesus Christ.
- [ ] Add a reusable responsive `.application-lab` component, question grid, step row, and two-column responsibility layout using existing color tokens.
- [ ] Run the focused Playwright test and confirm it passes.

### Task 3: Verify the complete lesson

**Files:**
- Update generated snapshots only if a covered visual intentionally changes.

- [ ] Run `npm run test:all` and require all unit, build, functional, axe, and visual tests to pass.
- [ ] Run `npm audit --audit-level=high` and require zero high-severity vulnerabilities.
- [ ] Use agent-browser against the production preview at projector and 320-pixel widths; inspect the application panels, horizontal overflow, console, and runtime errors.

### Task 4: Ship and publish

**Files:**
- No additional source files.

- [ ] Commit with `feat: deepen personal application in 2 Kings lesson` and push `feature/deepen-personal-application`.
- [ ] Open a pull request, wait for required checks, and squash-merge only when green.
- [ ] Build from merged `main`, update `zen-breeze-g5r6` with the here.now publish helper, and verify the live content and HTTP response.
- [ ] Remove only the proven-merged feature branch and isolated worktree, then run the desktop completion notification.

## Plan self-review

Every design requirement maps to a task. Paths and commands are exact, the implementation remains one static-site subsystem, and the plan contains no placeholders or ambiguous follow-up work.
