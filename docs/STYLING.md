# Styling & design system

All styles live in **`src/style.css`**, organized top-to-bottom as: fonts → `:root`
tokens → reset → landing theme (global) → detail sections (scoped under `.content`) →
responsive → reduced-motion. The page has **two theme zones**; know which one you're
editing.

---

## Two theme zones

| Zone | Where | Background | Text | Token source |
| --- | --- | --- | --- | --- |
| **Landing** | `.hero`, `.sec2`, `.nav`, panels | bright video imagery | dark ink (`--ink-1`) | `:root` |
| **Detail** | everything inside `.content`, + `.pagefoot` | warm cream `#f4f0e8` | dark ink (`--c-fg`) | `.content` |

The whole page is **warm-light**: the landing zone is bright-imagery-with-dark-text, and
the detail zone is dark-ink on a warm cream canvas. They share the same page background
(`--bg-page`), so the sections sit on it seamlessly.

---

## Color tokens

### Landing (`:root`)

| Token | Value | Use |
| --- | --- | --- |
| `--bg-page` | `#f4f0e8` | page background (warm cream) |
| `--ink-1` / `--ink-2` / `--ink-3` | `#241f21` / `#282425` / `#2a2420` | dark text over bright imagery |
| `--glass-72/88/92/96` | `rgba(248,245,240, .72–.96)` | frosted nav / panels |
| `--warm-12` / `--warm-38` | warm translucent overlays | hero/section tints |
| `--jp-serif` | Noto Serif JP stack | Japanese display type (連太郎) |

### Detail (`.content`)

| Token | Value | Use |
| --- | --- | --- |
| `--c-fg` | `#221d1f` | primary text (dark ink) |
| `--c-fg-2` | `#564d49` | secondary / body text |
| `--c-muted` | `#6f665d` | meta, captions, labels |
| `--c-border` / `--c-border-soft` | `rgba(36,31,33,.14 / .08)` | hairlines, card edges |
| `--c-surface` / `--c-surface-2` | `#fbf8f2` / `#ffffff` | cards, hovers |

The **accent is defined once in `:root`** (not in `.content`), so both the content zone
and the bottom player share it:

| Token | Value | Use |
| --- | --- | --- |
| `--accent` | `#1f7a48` | **forest green** — links, eyebrows, NEW badge, primary buttons, player |
| `--accent-hover` | `#19623a` | button hover |
| `--accent-soft` | `rgba(31,122,72,.12)` | tinted backgrounds, badge fill |
| `--accent-veil` | `rgba(31,122,72,.6)` | the "now playing" cover overlay |

> To re-skin the entire site's accent, change `--accent` (and its `-hover` / `-soft` /
> `-veil` variants) in the **`:root { … }`** block — the content zone, buttons, NEW badge,
> focus rings, the favicon-adjacent mark and the player all key off it. (The green echoes
> the Tahimik cover art.) The player's JS seek-fill reads `--accent` at runtime, so it
> follows too. The `.release-cover` holds the real album image; its gradient is only a
> fallback behind that image.

---

## Typography

| Family | Variable | Used for |
| --- | --- | --- |
| **Zimula Trial Med** | body default, `--font-body` | running text |
| **Zimula Trial Bd** | `--font-display` | detail-zone headings |
| **Noto Serif JP** (400/600/900) | `--jp-serif` | Japanese text, the giant 連太郎 brand, kanji watermarks |
| **SF Mono / ui-monospace** | `--font-mono` | eyebrows, meta, tags, track numbers, labels (the editorial mono detail) |

Loaded in `index.html` (`<link>` for Zimula Med/Bd + Google Noto Serif JP) and via an
`@import` for Zimula Reg at the top of `style.css`.

> **"Zimula Trial" is a trial font.** Confirm licensing before production, or replace the
> font links + `--font-*` variables with a licensed alternative.

---

## Spacing, radius & motion (detail zone)

Declared on `.content`:

- **Gaps:** `--gap-sm 12` · `--gap-md 20` · `--gap-lg 32` · `--gap-xl 56` · `--gap-2xl 96` (px)
- **Radius:** `--radius 12` · `--radius-lg 18` · `--radius-pill 9999` (px)
- **Gutter:** `--gutter` 36px desktop → 20px under 920px
- **Motion:** `--motion-fast 150ms`, `--ease cubic-bezier(.2,0,0,1)`

---

## Responsive breakpoints

| Width | What changes |
| --- | --- |
| `≤ 920px` | content grids (`grid-1-2`, `about-grid`, `log-row`, `gallery-grid`) collapse; gutter shrinks to 20px |
| `≤ 767px` | landing: nav → burger, hero type scales up, panels stack |
| `≤ 720px` | social grid, contact card, **and gallery** go single-column; release cover capped at 420px |

`.hero` uses `overflow: clip` so the oversized slab (160–220vw) can never cause
horizontal scrolling on mobile.

---

## Conventions when adding styles

- New **detail** styles → always prefix the selector with `.content`.
- New **landing** styles → keep class names specific (BEM-ish `block__element`); if you
  must use a generic name, scope it (e.g. `.nav .pill`).
- Reference tokens (`var(--…)`) instead of hardcoding colors so re-skinning stays a
  one-place change.
- Keep `:focus-visible` rings and reduced-motion behavior intact — see
  [ARCHITECTURE.md](ARCHITECTURE.md#accessibility-baseline).
