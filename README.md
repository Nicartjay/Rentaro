# 連太郎 — Rentaro (Nicart) · Official Site

The official one-page site for the artist **連太郎 / Rentaro** (also **Nicart**) — a
self-produced hobby artist weaving **English, Japanese & Tagalog** into borderless,
genre-blending songs made purely for the joy of it.

It merges a cinematic landing theme (animated video hero + scroll sections) with a
detailed, warm-light artist section (about, latest release, discography, photos,
links). Built with [Vite](https://vitejs.dev) — plain HTML, CSS and JS, no framework.

> **Live:** https://rentaro.nicart.space

---

## Quick start

```bash
npm install      # once
npm run dev      # dev server at http://localhost:5173 (opens automatically)
npm run build    # static production build → dist/
npm run preview  # serve the production build locally to sanity-check
```

Requires **Node 18+** (Vite 6). That's the only prerequisite.

---

## Documentation

| Doc | What's in it |
| --- | --- |
| **[docs/CONTENT.md](docs/CONTENT.md)** | **Start here to edit the site.** How to add a release, change links, swap photos, update the contact email — copy-paste examples, no deep coding needed. |
| **[docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)** | Deploying `dist/` to `rentaro.nicart.space` (Cloudflare Pages, Netlify, Vercel, GitHub Pages, nginx). |
| **[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)** | How the two templates were merged, the `.content` CSS-scoping strategy, file layout, and the JS behaviors. |
| **[docs/STYLING.md](docs/STYLING.md)** | The design system — colour tokens, fonts, the two theme zones, spacing/radius variables. |
| **[CHANGELOG.md](CHANGELOG.md)** | Version history. |
| **[CONTRIBUTING.md](CONTRIBUTING.md)** | Dev workflow, conventions, commit style. |

---

## Project layout

```
.
├── index.html          # markup — landing hero + sec2, then .content detail sections
├── src/
│   ├── style.css        # all styles (landing theme verbatim + warm-light content sections)
│   ├── main.js          # behaviors: burger menu, hero parallax, cat, scroll-spy, player
│   ├── intro.js         # first-load cat-loader intro (GSAP); reveals the site when done
│   └── tracks.js        # auto-generated track data (titles, covers, 30s preview URLs)
├── public/
│   ├── favicon.svg       # 連 favicon (served at /favicon.svg)
│   ├── img/              # local artist/mascot photos (hero card + gallery)
│   └── album/            # local album/single cover art (Apple Music)
├── template/             # the two ORIGINAL design templates, kept untouched for reference
│   ├── rentaro-layered-landing.html
│   └── rentaro-artist-site.html
├── vite.config.js        # base '/', dev port 5173, build → dist/
├── package.json
├── README.md
├── CHANGELOG.md
├── CONTRIBUTING.md
├── LICENSE.md
└── docs/                 # the guides linked above
```

---

## Content

All content is real — no placeholders remain. The 2026 discography carries **real release
dates, track counts and album art** pulled from Apple Music (`public/album/`); the
hero card and Photos gallery use local **artist/mascot photos** (`public/img/`); the
Spotify / Apple Music / YouTube links and the contact email (`nicartjay@rakumail.jp`) are
all live. To edit any of it, see [docs/CONTENT.md](docs/CONTENT.md).

---

## Note: `npm audit`

`npm audit` reports a high-severity **esbuild** advisory inherited via Vite. It affects
only the local **dev server** toolchain (a Deno/registry RCE vector) — it is **not**
present in the static `dist/` you deploy. The only fix is a breaking upgrade to Vite 8;
it has deliberately been left on Vite 6. See [CONTRIBUTING.md](CONTRIBUTING.md#dependencies).
