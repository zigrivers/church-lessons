# Trust Under Pressure: Interactive Lesson Design

Date: 2026-07-19

## Purpose

Build a 45–50 minute, teacher-led lesson for 17-year-old boys based on 2 Kings 16–25 and the July 13–19, 2026 *Come, Follow Me* outline. The lesson should make students reason, choose, defend, reconsider, and apply—not merely listen to a summary.

The lesson's governing question is:

> When fear makes a convincing argument, who gets the final word?

The teacher will run the lesson from a laptop or tablet. Students do not need phones. The finished experience will be a public, permanent here.now site and will also have a printable fallback.

## Source boundaries

The authoritative lesson source is the Church's [July 13–19 Come, Follow Me outline](https://www.churchofjesuschrist.org/study/manual/come-follow-me-for-home-and-church-old-testament-2026/29?lang=eng). The design uses its four principal ideas:

1. I can stay true to the Lord when my faith is challenged (2 Kings 18–19).
2. All things are in the Lord's hands (2 Kings 19:20–37).
3. The scriptures can turn my heart to the Lord (2 Kings 21–23).
4. A covenant is a whole-souled commitment between me and the Lord (2 Kings 23:1–25).

Scripture excerpts on the site will be short and linked to the official chapter or passage. Explanatory text will be original rather than copied from the manual.

## Learning outcomes

By the end of the lesson, students should be able to:

- distinguish evidence, a half-truth, intimidation, and a genuine question;
- explain why Hezekiah's prayer demonstrates trust without denying danger;
- describe the sequence by which scripture moved Josiah from discovery to reform;
- contrast an emotional response, a good intention, and covenant action;
- choose one private, concrete next action without being pressured to disclose personal details.

Success is visible when students change or refine a position because of scripture evidence, can explain their reasoning, and leave with a specific action—not when they produce one predetermined verbal answer.

## Teaching approach considered

### Chosen: Crisis Room

Students enter the Assyrian crisis before they know its outcome, evaluate arguments, make a decision, and then test that decision against Hezekiah's actions and prayer. The second half uses Josiah as a parallel case: truth is rediscovered, but trust becomes real only through reform and covenant.

This approach is recommended because it turns the chapters into decisions under pressure, a form likely to engage older teenagers while preserving spiritual seriousness.

### Not chosen: Courtroom debate

This would create energetic argument, but it risks turning faith into a contest where a student feels assigned to defend a position he does not hold.

### Not chosen: Chronological guided study

This would cover more history, but it would offer fewer consequential choices and could feel like a scripture summary rather than an experience.

## Lesson arc

| Time | Chapter | Student task | Teaching purpose |
| --- | --- | --- | --- |
| 0–4 min | The offer | Vote: surrender, wait, or resist after hearing Assyria's case | Create a real decision before revealing the lesson's conclusion |
| 4–8 min | The board | Locate Israel, Judah, Assyria, and Jerusalem on a minimal strategic map | Supply only the history students need to reason well |
| 8–18 min | Signal or noise? | Classify claims from 2 Kings 18:28–35 as evidence, half-truth, intimidation, or honest question | Examine how pressure can sound rational |
| 18–28 min | Spread out the letter | Read and mark Hezekiah's prayer in 2 Kings 19:14–19: what he names, asks, and remembers | Define trust as honest dependence rather than denial |
| 28–38 min | The missing book | Predict what a society would lose if scripture became culturally present but functionally unread, then inspect Josiah's response in 2 Kings 22:8–13 | Show how scripture exposes drift and invites change |
| 38–46 min | Read or reform? | Order Josiah's actions and debate whether reading without change counts as hearing | Connect scripture to repentance and covenant |
| 46–50 min | Final word | Privately choose one voice to question, one passage to act on, or one covenant habit to strengthen | End with agency and a concrete next step |

## Core discussion prompts

The site will reveal these one at a time so the teacher can let silence do some work:

1. If someone has been right nine times, what would make you resist them the tenth time?
2. Which Assyrian statements are false, and which are dangerous precisely because they are partly true?
3. What is the difference between trusting God and assuming God must produce the outcome we want?
4. Why does Hezekiah show God the letter if God already knows what it says?
5. Can a person be familiar with scripture and still have functionally "lost" it?
6. If Josiah had felt bad but changed nothing, what part of the story would be missing?
7. What deserves less authority over your choices this week?

Teacher notes will include likely productive follow-ups, permission to leave a question unresolved, and warnings against turning a student's doubt into a public object lesson.

## Information architecture

The experience is one continuous page with seven cinematic chapters. A compact control rail provides:

- current chapter and elapsed-time guidance;
- previous and next controls;
- a full chapter menu;
- a `Guide` view with teacher cues and a `Present` view with only student-facing material;
- a reset control that clears local interaction state;
- a print control.

The page remains usable as a normal scroll document if JavaScript is unavailable. Keyboard users can navigate all controls. Presentation controls will never hide the source links or the main lesson content from assistive technology.

## Interaction model

### Opening decision

Three large choices—surrender, wait, resist—record an anonymous in-room show of hands. The site does not collect student data. After discussion, the teacher reveals the historical context and can invite students to revise their position.

### Signal or noise board

Claim cards flip or expand to show a classification and a short explanation. The explanation is not presented as the only defensible answer; one card is deliberately debatable to prompt evidence-based disagreement.

### Prayer lens

Hezekiah's prayer is displayed in three short linked movements: `name the threat`, `remember who God is`, and `ask with purpose`. Selecting a movement highlights the relevant excerpt and opens a teacher follow-up.

### Josiah sequence

Students predict the order before the teacher reveals `discover → humble yourself → inquire → gather → covenant → remove`. This turns reform into a causal sequence rather than a list of admirable actions.

### Final-word card

The student-facing screen shows three private prompts. Nothing is typed, stored, transmitted, or shared. The teacher pauses for silent commitment and ends without asking students to report what they chose.

Only presentation progress and view preference will be stored in `localStorage`; reset removes both.

## Visual and motion direction

The visual concept is **Siege to Sanctuary**. Early chapters feel compressed and tactical: a strategic-grid background, narrow bands, moving pressure marks, and a constrained visual field. Hezekiah's prayer opens the composition. Josiah's chapters gain light, vertical space, and an illuminated line suggesting a rediscovered text. The final screen is calm and almost empty.

The signature element is a continuous **pressure line** that changes behavior across the page: it crowds the viewport during the siege, bends at Hezekiah's prayer, and becomes the underline beneath the covenant. This is structural storytelling, not decoration.

The `gpt-taste` process will determine the exact hero, type stack, component variants, and motion paradigms through its required seeded randomization before UI implementation. The result must still follow these brief-specific constraints:

- no parchment theme, fake Hebrew lettering, decorative shields, emoji, or game-like points;
- no generic dashboard cards or repeated left-right section layouts;
- strong contrast and readable body text for a classroom projector;
- no heading longer than three lines at supported widths;
- motion must teach sequence or pressure, not delay the lesson;
- reduced-motion mode replaces transforms and scrubbing with immediate reveals;
- the visual arc must move from pressure to clarity without depicting God as merely a tool for desired outcomes.

## Technical structure

The new lesson will live in `trust-god-2kings-16-25/`, isolated from the existing Ruth and Hannah lesson at the repository root.

The site will use Vite, semantic HTML, modular CSS, TypeScript, and GSAP for the motion selected by the taste process. Core lesson content will remain in semantic HTML rather than being injected by JavaScript, preserving the no-JavaScript fallback. The production output will be static files suitable for here.now. No backend, account, analytics, cookies, or student-data collection is required.

Modules will be separated by responsibility:

- lesson content and timing data;
- chapter navigation and view state;
- interaction controllers;
- motion setup with reduced-motion fallbacks;
- styles and design tokens.

External Church links open safely in a new tab. If a remote visual or script fails, the text lesson and all navigation remain available.

## Accessibility and classroom resilience

- Meet WCAG AA contrast for text and controls.
- Use semantic headings, landmarks, buttons, and live-region announcements only where state changes need them.
- Keep every control reachable and operable by keyboard with visible focus.
- Give visual classification states text labels; color is never the only signal.
- Respect `prefers-reduced-motion` and provide a manual motion toggle if needed.
- Support 320 px phones, tablets, laptop screens, and a 16:9 projected view.
- Include print styles that expose all prompts, teacher notes, scripture references, timing, and fallback instructions.
- Avoid audio, autoplay, hover-only information, and network-dependent lesson logic.

## Verification plan

Before publication:

1. Unit-test timing, chapter state, reset behavior, and reduced-motion decisions with Vitest.
2. Test the complete teacher flow in Playwright: start, choose, reveal, switch views, navigate, reset, and print trigger.
3. Run axe on the opening, a revealed activity, and the final chapter.
4. Capture desktop and mobile visual-regression screenshots for the hero, signal board, prayer transition, and final card.
5. Run a production build and inspect it through a local static server.
6. Use agent-browser to complete the lesson on desktop and mobile, checking keyboard focus, text clipping, console errors, and source links.
7. Publish the built directory through here.now, confirm authenticated/permanent status, and rerun the critical flow against the live URL.

## Completion criteria

The work is complete only when:

- every lesson chapter above exists with its intended scripture reasoning activity;
- both Guide and Present views work;
- print and no-JavaScript fallbacks preserve the full lesson;
- automated tests, accessibility checks, production build, and browser QA pass;
- the feature branch is committed, pushed, reviewed through a pull request, merged under repository policy, and cleaned up safely;
- the final permanent here.now URL loads successfully and is reported to the user.
