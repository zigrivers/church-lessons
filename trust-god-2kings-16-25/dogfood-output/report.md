# Dogfood Report: Trust Under Pressure

| Field | Value |
|-------|-------|
| **Date** | 2026-07-19 |
| **App URL** | http://127.0.0.1:4173/ |
| **Live URL** | https://zen-breeze-g5r6.here.now/ |
| **Session** | trust-under-pressure-local |
| **Scope** | Complete teacher flow, projector, mobile, keyboard, print, console, and assets |

## Summary

| Severity | Count |
|----------|-------|
| Critical | 0 |
| High | 0 |
| Medium | 0 |
| Low | 0 |
| **Total** | **0** |

## Issues

No reproducible issue remained after the completed production-browser pass.

## Coverage

- Projector flow: all 3 opening decisions, offer evidence, map stakes, 4 signal cards, 3 prayer movements, the prayer response, the missing-book reveal, the reform sequence, and the causal chain.
- Views and navigation: Guide and Present in multiple chapters, Back, Next, the 7-item chapter menu, first/last boundaries, and the back-to-top link.
- State: selections and reveals persisted across reload, then Reset returned the lesson to Guide view with no decision or reveal left active.
- Sources: every distinct Church scripture/manual destination returned HTTP 200; the lesson tab remained open throughout.
- Mobile and keyboard: 320 px width with no horizontal overflow, a 320 px chapter rail, 44 px minimum visible button height, visible skip-link focus, keyboard-only view switching, decision selection, and reveal activation.
- Resilience: production console and runtime error logs were empty, all local assets loaded, and the print rendering exposed all lesson material.
- Live release: the permanent authenticated here.now copy repeated the core interaction and Reset checks, stayed within a 320 px viewport, loaded its social-preview asset, reported no browser errors, and returned zero serious or critical axe violations at the opening and final chapters.
- Personal-application follow-up: inspected all 3 new reflection labs as rendered content, including the faith-under-pressure scenarios and Hezekiah pattern on a projector layout plus the scripture and trust labs on a phone layout. The 320 px viewport had no horizontal overflow, every lab was present, and the browser console and runtime error logs remained empty.

## Evidence

- `screenshots/opening-projector.png`
- `screenshots/signal-projector.png`
- `screenshots/prayer-projector.png`
- `screenshots/reform-projector.png`
- `screenshots/final-word-projector-settled.png`
- `screenshots/opening-mobile-320-settled.png`
- `screenshots/mobile-keyboard-focus.png`
- `screenshots/mobile-keyboard-reveal-confirmed.png`
- `screenshots/final-word-mobile-320-navigation.png`
- `screenshots/print-preview.png`
- `screenshots/live-opening.png`
- `screenshots/live-mobile.png`
- `screenshots/application-board-projector.png`
- `screenshots/application-book-mobile-panel.png`
- `screenshots/application-trust-mobile-panel.png`

Uncited intermediate screenshots are preserved as required by the dogfood workflow.
