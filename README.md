# Church lessons

Teacher-ready lesson sites that work from a projector, laptop, or printed handout.

## When Plan A Breaks — Ruth & 1 Samuel

The original lesson remains at the repository root. Open `index.html` for the teacher-led class reader or `student.html` for the student version. Its QR-code images are stored beside those pages.

## Trust Under Pressure — 2 Kings 16–25

An interactive 50-minute teacher guide for older teenagers. It moves from Hezekiah's siege and prayer to Josiah's rediscovery of scripture, reform, and covenant.

```bash
cd trust-god-2kings-16-25
npm install
npm run dev
```

Open the local address printed in the terminal. The page starts in **Guide** view, which includes pacing and teacher cues. **Present** view hides those notes for projection. **Reset lesson** clears the selections and reveals made on that browser, while **Print** produces a complete guide with every note and answer panel visible.

The 7 chapters total 50 minutes. One teacher runs the lesson from a single laptop; students do not need phones, logins, or accounts. If JavaScript is unavailable, the complete lesson remains readable on the page.

Use `npm run test:all` to run unit, build, browser, accessibility, and visual checks. Use `npm run build` to create the static `dist/` directory for here.now.
