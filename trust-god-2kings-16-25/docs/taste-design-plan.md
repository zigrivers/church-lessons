<design_plan>

# Siege to Sanctuary Taste Plan

## Seeded selection

- Seed: 299
- Hero: Artistic Asymmetry
- Type: Space Grotesk Variable display, system sans body, tabular system monospace utility. Cabinet Grotesk was the initial draw; the final build uses this closely matched self-hosted face because the remote font failed the cross-origin accessibility scan.
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
