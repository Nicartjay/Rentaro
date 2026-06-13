# Changelog

All notable changes to this project are documented here. Format loosely follows
[Keep a Changelog](https://keepachangelog.com/); this project does not yet use formal
semantic versioning.

## [1.4.0] — 2026-06-13

### Changed
- **Accent colour: vermilion red → forest green** (`#1f7a48`), echoing the Tahimik cover
  art. The accent is now a single `:root` token (`--accent` / `-hover` / `-soft` /
  `-veil`) that the content zone, buttons, NEW badge, focus rings, player and favicon all
  inherit — so it's a one-line change going forward. The player's seek-fill reads the
  token at runtime. Green passes WCAG AA on the cream canvas (~4.7:1) and under white text.

## [1.3.0] — 2026-06-13

### Added
- **Built-in preview player** — a sticky bottom bar that plays the **30-second Apple
  Music preview** of any track (play / pause / prev / next, seek, auto-advance, and a
  "Full track ↗" link to Apple Music). No embeds or login.
- Play buttons on every **discography** row (cover → play) and on the **Latest**
  tracklist. The player queues across all 16 tracks (newest release first) and highlights
  the playing release.
- New **`src/tracks.js`** — auto-generated track data (title, release, cover, duration,
  preview URL, Apple link) from the iTunes catalog API.

### Notes
- Firefox range-input track/thumb styling added; player colours/fonts use shared tokens.
- Docs: new "Music player & previews" section in `docs/CONTENT.md` (incl. how to refresh).

## [1.2.0] — 2026-06-13

### Added
- **Real album art** for all 11 singles, downloaded locally to `public/album/` from
  Apple Music's catalog. The "Latest release" now shows the actual **Tahimik** cover.
- **Cover thumbnails** in the discography, plus **accurate release dates and track
  counts** from the catalog — and the previously-missing **Leftover Umbrella** single.
- **Local artist/mascot photos** in `public/img/` (the artist's cat): the main portrait
  drives the hero card, and all three fill the Photos gallery (rebuilt as a real
  lead-plus-two image grid). Large phone photos were downscaled for web.

### Changed
- Hero card photo swapped from a stock image to the local main portrait.
- Discography rows regained a cover column (responsive: thumbnail + stacked text on mobile).
- Docs (README, `docs/CONTENT.md`) updated — the only remaining placeholder is `[ADD EMAIL]`.

## [1.1.0] — 2026-06-13

### Changed
- **Re-themed the site to a warm-light palette.** The detail zone (`.content`), footer
  and page base flipped from dark warm-black to a warm cream canvas (`--bg-page #f4f0e8`)
  with dark-ink text (`--c-fg #221d1f`), white/cream card surfaces, and dark-low-alpha
  borders. The landing hero/section-2/nav are unchanged (already bright). Renamed
  `--bg-dark` → `--bg-page`.
- Accent settled on the artist's original vermilion `#d32029` (hover `#b71a22`).
- `.release-cover` is now a full-vermilion gradient block with white text.
- Tuned `--c-muted` to `#6f665d` for AA contrast on cream; lightened scrollbar thumb,
  favicon tile and `theme-color` to match.
- Docs (README, STYLING, ARCHITECTURE) updated to describe the light theme.

## [1.0.0] — 2026-06-13

Initial release — the merged single-page site.

### Added
- **Vite** project scaffold: `npm run dev` / `build` / `preview`, `base: '/'` for
  root-domain deploy to `rentaro.nicart.space`, output to `dist/`.
- Merged page combining the cinematic **landing theme** (video hero, animated birds,
  parallax slab, glass nav + panels, "section 2" headline) with the **artist detail
  sections** (About/profile, Latest release, Discography, Photos, Listen/Contact, footer),
  recolored into a dark vermilion-on-warm-black theme.
- Real 2026 artist data wired in from Spotify, Apple Music and YouTube: latest single
  **Tahimik** (2026-06-12) plus the full discography, and the three real streaming/social
  links throughout.
- Behaviors (`src/main.js`): mobile burger menu, hero parallax, birds state machine,
  scroll-spy nav highlighting, full `prefers-reduced-motion` support.
- `連` SVG favicon, Open Graph / description metadata.
- Documentation: `README`, `docs/CONTENT`, `docs/DEPLOYMENT`, `docs/ARCHITECTURE`,
  `docs/STYLING`, `CONTRIBUTING`, `LICENSE`.

### Accessibility
- Skip-to-content link, `aria-controls` / `aria-expanded` / `role="navigation"` on the
  mobile menu, Escape-to-close, `:focus-visible` rings in both theme zones, `lang`
  attributes on Japanese/Tagalog text.

### Fixed (pre-release review)
- Scoped leaking global `.pill` hover/active/transition rules to `.nav`.
- Removed a dead `.content .section + .content .section` selector.
- `.hero { overflow: clip }` to prevent iOS horizontal scroll from the wide slab.
- Gallery grid collapses to a single column below 720px.
- Removed an unverifiable, soon-to-be-stale hardcoded artist age.

### Known placeholders / notes
- `[ADD PHOTO]` (gallery tiles) and `[ADD EMAIL]` (contact) await real content.
- Album art is CSS-rendered (gradient + title), not image files.
- `npm audit` flags a dev-only esbuild advisory inherited via Vite 6; not present in the
  deployed static build. Fix requires a breaking Vite 8 upgrade — deferred.
- "Zimula Trial" is a trial font; confirm licensing before production.
