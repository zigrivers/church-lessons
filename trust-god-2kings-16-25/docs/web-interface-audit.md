# Web Interface Guidelines audit

Reviewed 2026-07-19 against the current [Web Interface Guidelines](https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md).

## Resolved findings

- `index.html:18` — load the core stylesheet independently of JavaScript so the semantic fallback remains usable.
- `src/styles.css:25` — use the dark native color scheme that matches the site shell; print mode explicitly returns to light.
- `src/styles.css:52` — add deliberate touch behavior and tap feedback to interactive elements.
- `src/styles.css:80` — retain a strong visible keyboard-focus treatment across every control.
- `src/styles.css:100` — reveal the skip link with `:focus-visible` instead of mouse-oriented `:focus`.
- `src/styles.css:186` — add hover feedback to the Guide, Present, and Print controls.
- `src/styles.css:355` — add hover feedback to chapter navigation and chapter-menu controls.
- `src/styles.css:1287` — add hover feedback to the Reset lesson control.
- `src/styles.css:1447` — prevent focus and hover from forcing the desktop accordion columns into the phone layout.

## Result

No unresolved high-impact accessibility or usability finding remains. Automated coverage separately verifies semantics, keyboard operation, serious/critical axe findings, 320 px overflow, print output, and the JavaScript-free fallback.
