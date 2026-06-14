# Architecture

A deliberately small, dependency-light static site: one HTML file, one CSS file, one JS
file, bundled by Vite. No framework, no runtime data fetching — everything is authored
directly in `index.html`.

---

## The merge: two templates, one page

The site combines two source designs (kept verbatim in `template/` for reference):

| Source | Role in the final site |
| --- | --- |
| `rentaro-layered-landing.html` | The **theme** — cinematic hero (background video, a parallax foreground railing with the resident cat perched on it, glass nav + panels) and the full-bleed "section 2" headline. The original template's flying birds and rock slab were swapped for the railing + cat (inline SVG/CSS, no external assets); the template file keeps the originals for reference. |
| `rentaro-artist-site.html` | The **detail** — About/profile, Latest release, Discography, Photos, Contact. A warm-light design, harmonized with the landing's palette and type. |

The page reads top-to-bottom as: **landing hero → section 2 → detail sections →
footer**, i.e. a bright cinematic open that flows into a warm-light editorial body.

```
<body>
  <a.skip-link>
  <nav.nav>                 ┐
  <div.mobile-menu>         │ landing theme (global CSS)
  <section.hero>            │
  <section.sec2>            ┘
  <div.content>             ┐
    <section#about>          │
    <section#latest>         │ artist detail (warm-light, CSS scoped under .content)
    <section#music>          │
    <section#gallery>        │
    <section#contact>        ┘
  </div>
  <footer.pagefoot>
  <script src="/src/main.js">
</body>
```

---

## CSS scoping — why `.content` exists

Both templates were written independently and **reuse generic class names and element
selectors**: `.pill`, `.hero`, `.container`, `.section`, `.btn`, and bare `h2`/`h3`/`p`.
Dropping them into one stylesheet would cross-contaminate.

The strategy:

- **Landing styles stay global.** Their class names are mostly specific (`hero__*`,
  `sec2__*`, `panel-*`, `nav__*`), and the few generic ones (`.pill`, `.cta-*`) are
  scoped to `.nav` so they can't reach the body.
- **All artist-detail styles are scoped under `.content`** — every selector is written
  `.content .thing` / `.content h2` / `.content .pill`, and the warm-light design tokens are
  declared on `.content` itself so they only apply (and inherit) inside that wrapper.

This is enforced, not incidental: the wrapper `<div class="content">` is what makes the
generic names safe to reuse. **If you add new detail markup, put it inside `.content`;
if you add a new global landing element, keep its class names specific.**

Design tokens are documented in [STYLING.md](STYLING.md).

---

## JavaScript (`src/main.js`)

ES module, imported by `index.html` via `<script type="module">`. It `import`s
`style.css` (so Vite bundles the stylesheet) and `./intro.js` (the first-load loader,
which `import`s **GSAP** — the one third-party JS library, bundled, not a CDN). Everything
else is wrapped in small IIFEs that no-op if their target elements are absent (so removing
a section never throws). All of it respects `prefers-reduced-motion`.

| Behavior | What it does |
| --- | --- |
| **First-load intro** (`src/intro.js`) | A full-screen overlay (`#intro`) where a cat bats the **連太郎** logo around then bounds off, revealing the site. GSAP timeline adapted from CodePen WLGaJK. Runs **on every page load**, is skippable (click / Esc) with a safety timeout, and is skipped entirely under `prefers-reduced-motion` or with JS disabled. |
| **Burger menu** | Toggles the mobile menu; syncs `aria-expanded`; moves focus into the menu on open and back to the button on close/**Escape**; traps Tab between the links and the button while open. |
| **Hero parallax** | On scroll, drifts the foreground railing (`#rail`) and the glass panels (desktop only, passive listener). Disabled under reduced-motion. |
| **Cat** | The cat (`#cat`) **walks toward the pointer** along the railing and **sits down** when it arrives. A `requestAnimationFrame` loop eases its `translateX` toward the cursor's x (mapped into the rail); while moving it shows the side-profile **walking** pose (`is-stepping` gait, faces its direction via `is-facing-left`), and on arrival it crossfades to the front-facing **sitting** pose (`is-sitting`) with an idle tail-sway/blink. Hysteresis (arrive 2px / leave 8px) avoids flicker. Slips away on scroll (`is-out`); under reduced-motion or before any pointer input it just sits, centred. |
| **Scroll-spy** | An `IntersectionObserver` highlights the nav pill (`[data-spy]`) for the section currently in view. Degrades gracefully if `IntersectionObserver` is missing. |
| **Preview player** | A sticky bottom bar driving an `<audio>` element through the `TRACKS` queue in `src/tracks.js`. Play triggers (`[data-qi]`) on discography rows + the Latest tracklist set the index; prev/next/`ended` advance with wraparound; the playing release row is highlighted via `data-rel`. Plays Apple Music 30-second previews. Closing resets the index (so re-clicking the same row re-opens the bar) and restores focus to the trigger button; a row click toggles play/pause when it belongs to the currently-playing release; an `error` listener surfaces "Preview unavailable" for expired URLs; an `aria-live` region + `aria-valuetext` announce track and seek changes. |

---

## Build

Vite (`vite.config.js`): `base: '/'` (root-domain deploy), dev server on port 5173
(auto-opens), production output to `dist/` with hashed asset filenames. `npm run build`
bundles the HTML + CSS + JS (+ GSAP, + favicon). The JS is ~33 KB gzipped (most of it
GSAP, used only by the first-load intro); the CSS ~7 KB gzipped.

See [DEPLOYMENT.md](DEPLOYMENT.md) for hosting.

---

## Accessibility baseline

Built in and verified by review: a skip-link, keyboard-operable + `aria`-wired mobile
menu (`aria-controls` / `aria-expanded` / `role="navigation"`, focus moved in on open and
restored on close, Tab trapped while open), a `role="region"` player with an `aria-live`
"now playing" announcement, focus restored to the trigger on close, and `aria-valuetext`
on the seek slider, `:focus-visible` rings in both theme zones, `alt`/`aria-hidden` on
imagery (including decorative inline SVGs), `scroll-padding-top` so anchor jumps clear the
fixed nav, `lang` attributes on Japanese/Tagalog text, and full `prefers-reduced-motion`
handling. Keep these when editing — see [CONTRIBUTING.md](../CONTRIBUTING.md).
