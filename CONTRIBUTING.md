# Contributing / dev workflow

A small static site. This doc is for working on the **code**; for editing the site's
words, links and images, see [docs/CONTENT.md](docs/CONTENT.md).

## Setup

```bash
npm install
npm run dev        # http://localhost:5173, hot-reloads on save
```

- **Node 18+** required.
- No framework, no TypeScript, no test runner — plain HTML/CSS/JS bundled by Vite.

## The three files

| File | Edit it for |
| --- | --- |
| `index.html` | markup, copy, links, sections |
| `src/style.css` | all styling |
| `src/main.js` | interactive behaviors |

Read [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) and [docs/STYLING.md](docs/STYLING.md)
before structural or visual changes — especially the `.content` CSS-scoping rule.

## Conventions

- **CSS scoping:** new detail-section styles must be prefixed `.content …`; keep landing
  styles' class names specific, or scope generic ones to `.nav`. (Why: both source
  templates reuse names like `.pill`, `.hero`, `h2`.)
- **Tokens over literals:** use the `var(--…)` design tokens rather than hardcoding
  colors/spacing, so re-skinning stays a one-place change.
- **Accessibility is a baseline, not an extra.** Preserve: the skip-link, mobile-menu
  `aria-*` wiring + Escape handling, `:focus-visible` rings, `alt`/`aria-hidden` on
  images, `lang` on JP/TL text, and `prefers-reduced-motion` branches.
- **No fabricated facts.** Only publish artist data you can verify (titles, dates,
  counts). Use a clearly-marked placeholder otherwise — never an invented duration,
  follower count, or date.
- **JS:** keep behaviors in self-contained IIFEs that no-op when their elements are
  absent, and gate motion on `prefers-reduced-motion`.

## Before committing

```bash
npm run build      # must complete with no errors
npm run preview    # check desktop AND a narrow phone width
```

Sanity-check: hero video + birds play, scroll-spy highlights nav, all stream links open
the right platform, layout stacks cleanly on mobile.

## Commits

Short imperative subject lines (`Add …`, `Fix …`, `Update …`). Note user-facing changes
in [CHANGELOG.md](CHANGELOG.md) under the current/next version.

## Dependencies

Only **Vite** (dev/build). `npm audit` reports a high-severity **esbuild** advisory
inherited through Vite — it affects the **local dev server only** (a Deno/registry RCE
vector) and is **not** in the deployed static `dist/`. The fix is `vite@8`, a breaking
major upgrade; it has been deliberately deferred. If you upgrade, re-test the dev server,
`npm run build`, and the hero/birds/parallax behavior, then update the README/CHANGELOG.
