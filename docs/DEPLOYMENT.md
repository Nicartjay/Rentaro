# Deployment

The site is a **static** build. `npm run build` produces a self-contained `dist/`
folder (HTML + hashed CSS/JS + assets) that can be served by any static host or plain
web server. The target domain is **https://rentaro.nicart.space**, served from the
domain **root** — which is why `base` is `/` in `vite.config.js`.

```bash
npm install
npm run build      # → dist/
npm run preview    # optional: serve dist/ locally at http://localhost:4173 to verify
```

Universal settings for any host:

| Setting | Value |
| --- | --- |
| Build command | `npm run build` |
| Output / publish directory | `dist` |
| Node version | 18 or newer |
| SPA rewrite / fallback | **Not needed** — this is a single static page, not a router. |

---

## Cloudflare Pages

1. Connect the repo (or use **Direct Upload** of the `dist/` folder).
2. Framework preset: **None** / Vite. Build command `npm run build`, output `dist`.
3. Add a custom domain → `rentaro.nicart.space` (Cloudflare manages the DNS/SSL).

## Netlify

- Build command `npm run build`, publish directory `dist`.
- A `netlify.toml` is optional; the two settings above are enough.
- Domain settings → add `rentaro.nicart.space`.

## Vercel

- Framework preset **Vite** (auto-detected). Output dir `dist`.
- Project → Domains → add `rentaro.nicart.space`.

## GitHub Pages

Because the site deploys to a **subdomain root** (`rentaro.nicart.space`), keep
`base: '/'`. Publish the `dist/` folder (e.g. via an action that builds and pushes to a
`gh-pages` branch, or the official Pages action) and set the custom domain in repo
**Settings → Pages**. Add a `CNAME` file containing `rentaro.nicart.space`.

> If you ever host under a **sub-path** instead (e.g. `nicart.space/rentaro/`), change
> `base` in `vite.config.js` to `'/rentaro/'` and rebuild — otherwise asset URLs 404.

## Plain nginx / static server

Copy `dist/` to the web root and serve it:

```nginx
server {
  server_name rentaro.nicart.space;
  root /var/www/rentaro/dist;
  index index.html;
  location / { try_files $uri $uri/ /index.html; }
}
```

---

## DNS

Point `rentaro` (a subdomain of `nicart.space`) at your host:

- Managed hosts (Cloudflare/Netlify/Vercel) give you a `CNAME` target to add as the
  `rentaro` record.
- A self-hosted server uses an `A`/`AAAA` record to the server IP.

SSL is automatic on the managed hosts; on nginx use Let's Encrypt (`certbot`).

---

## External assets — keep in mind

The page loads a few things from third-party CDNs at runtime (not bundled):

- **Fonts** — "Zimula Trial" (onlinewebfonts.com) and Noto Serif JP (Google Fonts).
- **Hero media** — the background videos, bird clips and slab image
  (`plugin-assets.open-design.ai`).

These must be reachable over **HTTPS** from the visitor's browser. If you want a fully
self-hosted, offline-proof build, download those assets into `public/` and update the
URLs in `index.html` / `src/style.css`. "Zimula Trial" is a **trial** font — confirm
licensing before production use, or swap it for a licensed/again-free alternative by
editing the font `<link>` tags in `index.html` and the `--font-*` variables in
`src/style.css`.

---

## Post-deploy smoke test

1. Load `https://rentaro.nicart.space` — hero video plays, birds animate.
2. Scroll: nav pills highlight the section in view; content sections render dark.
3. Click each streaming button → opens the right platform in a new tab.
4. Narrow the window to phone width: nav collapses to the burger; grids stack.
5. Check the favicon and the social-share preview (paste the URL into a chat/preview tool).
