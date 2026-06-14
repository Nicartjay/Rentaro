# Content guide — editing the site

This is the **main guide for keeping the site up to date**. You don't need to be a
developer; most changes are find-and-replace inside two files:

- **`index.html`** — all the words, links, releases and sections.
- **`public/`** — where images live.

After any edit, run `npm run dev` to preview, then `npm run build` to produce the
`dist/` you deploy (see [DEPLOYMENT.md](DEPLOYMENT.md)).

> Tip: open `index.html` in your editor and use **Find** (`Cmd/Ctrl+F`) to jump to the
> text you want to change. All content is real now — there are no `[…]` placeholders
> left to fill.

---

## 1. The streaming / social links

The three real links appear in several places (nav, hero buttons, "Latest" stream
buttons, social cards). They're all plain `href="…"` attributes. If a URL ever changes,
search `index.html` for the old URL and replace **all** occurrences.

Current links:

| Platform | URL |
| --- | --- |
| Spotify | `https://open.spotify.com/intl-ja/artist/2zEI54X1PrMZVmEtcjLDXo` |
| Apple Music | `https://music.apple.com/ph/artist/%E9%80%A3%E5%A4%AA%E9%83%8E/1888965014` |
| YouTube | `https://www.youtube.com/@%E9%80%A3%E5%A4%AA%E9%83%8E%E3%83%8B%E3%82%AB%E3%83%BC%E3%83%88` |

> Japanese characters in a URL must stay **percent-encoded** (`%E9%80%A3…`). Don't paste
> raw 連太郎 into an `href` — copy the encoded address straight from the browser bar.

---

## 2. Updating the "Latest release"

Find the `<!-- LATEST RELEASE -->` section (`id="latest"`). To feature a new single/EP:

1. **Heading** — change `<h2>Tahimik …</h2>` to the new title.
2. **Date / track count** — update the `<span class="meta num">1 TRACK · 2026.06.12</span>`.
3. **Cover** — the cover is a real image: `<img src="/album/tahimik.jpg" …>`. To change
   it, drop a new square JPG into `public/album/` and update the `src` (or overwrite the
   file). Covers come from Apple Music — see the note at the end of §3.
4. **Tags** — the `<span class="tag">…</span>` row (`SINGLE`, `1 SONG`, date…).
5. **Description** — the `<p class="lead">…</p>`.
6. **Tracklist** — each track is one row. Copy this pattern; add as many as needed:

   ```html
   <div class="track">
     <span class="track-no num">01</span>
     <div class="track-title">Song title <small>optional subtitle / language</small></div>
     <span class="track-time num" aria-hidden="true">—</span>
   </div>
   ```

   Leave the time as `—` unless you have a real duration — don't invent one.

---

## 3. Adding to the discography

Find the `<!-- DISCOGRAPHY -->` section (`id="music"`). Each release is one
`<article class="log-row">` with a cover thumbnail. **Newest goes at the top.** Copy this
block:

```html
<article class="log-row">
  <img class="log-cover" src="/album/release-slug.jpg" alt="" loading="lazy" />
  <span class="meta num">2026.06.12</span>
  <div><h3>Release title <small>song · song · or a short note</small></h3></div>
  <span class="format-col tag">SINGLE · 1 SONG</span>
  <span class="pull meta">DIGITAL</span>
</article>
```

- Put the cover JPG in `public/album/` and point `src` at it.
- For the **newest** release, replace the last `<span class="pull meta">DIGITAL</span>`
  with `<span class="pull"><span class="pill">NEW</span></span>` to show the red **NEW**
  badge — and remove it from the previous one.
- Add `class="jp"` to an `<h3>` for Japanese titles, or `lang="tl"` for Tagalog.
- Only state facts you can verify (titles, dates, song counts).

> **Where the covers + dates came from:** Apple Music's public catalog. To refresh after
> a new release, query the artist's catalog and download the artwork:
> ```bash
> curl -sL "https://itunes.apple.com/lookup?id=1888965014&entity=album&limit=200&country=ph"
> ```
> Each result has a `releaseDate`, `trackCount`, and `artworkUrl100`; swap the trailing
> `100x100bb.jpg` for `600x600bb.jpg` (or `1400x1400bb.jpg` for the featured cover) to get
> a larger image, then save it into `public/album/`.

---

## 4. Photos

The Photos section (`id="gallery"`) shows three real images that live in **`public/img/`**:

| File | Where it appears |
| --- | --- |
| `portrait-main.jpg` | gallery **lead** tile (large, left) **and** the hero card (the photo behind the "Listen now" button) |
| `photo-1.jpg` | gallery top-right tile |
| `photo-2.jpg` | gallery bottom-right tile |

To swap a photo, either **overwrite the file** in `public/img/` (keep the same name) or
add a new file and update its `src` in the `<!-- GALLERY -->` markup (`.g-lead` / `.g-a` /
`.g-b`). Large source photos are heavy — downscale before committing, e.g. on macOS:

```bash
sips -Z 1600 -s formatOptions 78 new-photo.jpg --out public/img/photo-1.jpg
```

Always update the `alt="…"` text to describe the new image. The hero card photo is set
separately in the `<!-- HERO -->` block (`<img class="panel-right__bg" src="/img/portrait-main.jpg">`).

---

## 5. Contact email

The contact address is `nicartjay@rakumail.jp`. It appears in **two** places in the
`<!-- LISTEN / CONTACT -->` section — keep them in sync if you change it:

- the displayed text `<p class="contact-meta">nicartjay@rakumail.jp</p>`
- the button link `<a href="mailto:nicartjay@rakumail.jp" …>`

---

## 6. The About / bio text

Find the `<!-- ABOUT -->` section (`id="about"`):

- **`.about-body`** — the three English paragraphs + the Japanese `jp-line`.
- **`.profile-card`** — the quote and the `row-stat` facts (Name, Role, Approach, Sound,
  Languages, Tools).

> **Age:** there is intentionally **no age** on the site. Apple Music lists a birthdate
> of 1997-05-31; a hardcoded age goes stale every year. If you want one, add it to the
> bio paragraph or as a new `row-stat` — and remember to bump it on birthdays.

---

## 7. Hero & headline copy

The top of the page (the video hero and the "melts into the everyday" headline) lives in
the `<!-- HERO -->` and `<!-- SECTION 2 -->` blocks. The big background video, the bird
animation and the central slab are **decorative theme assets** loaded from a CDN — they
aren't photos of the artist, so you can leave them as-is. To change the poetic copy, edit
the text inside `.panel-left__head`, `.panel-right__top`, and the `<h2>` in `.sec2`.

---

## 8. SEO / preview metadata

In `<head>` of `index.html`: the `<title>`, `<meta name="description">`, the `og:*` /
`twitter:*` tags (used when the link is shared on social media), `rel="canonical"`, and a
Schema.org **`MusicGroup`** JSON-LD block (artist name, genres, streaming links). Update
these if the tagline, links or genres change.

The share image (`og:image` + `twitter:image`) currently points at the latest single's
cover, `https://rentaro.nicart.space/album/tahimik.jpg` (1400×1400). To use a different or
purpose-built image, drop it in `public/` (or `public/album/` / `public/img/`) and update
both URLs — and the `og:image:width` / `height` to match:

```html
<meta property="og:image" content="https://rentaro.nicart.space/og.jpg" />
<meta name="twitter:image" content="https://rentaro.nicart.space/og.jpg" />
```

A landscape **1200×630** image renders best across platforms; the square cover is a fine
fallback.

---

## 9. Music player & previews

The site has a built-in player (the bar that slides up from the bottom) that plays the
**30-second Apple Music preview** of each track. The track data lives in
**`src/tracks.js`** — an auto-generated list of all songs with their title, release,
cover, duration, preview URL and Apple Music link, ordered newest-release-first.

**Play buttons are wired by index.** Each discography row and the Latest tracklist row has
a `data-qi="N"` attribute = the track's position in `src/tracks.js` (0-based). The player
queues across the whole list, so prev/next/auto-advance walk every track. Clicking a row's
cover/play button **toggles** that track: the first click plays it, and clicking the
currently-playing track pauses it (its icon flips to a stop square while playing and a play
triangle while paused) — clicking another track switches to it from the start.

**To refresh after a new release** (so the player and discography stay current),
regenerate `src/tracks.js` from Apple Music's catalog and re-download covers:

```bash
# 1. pull the catalog
curl -sL "https://itunes.apple.com/lookup?id=1888965014&entity=song&limit=200&country=ph" -o songs.json
curl -sL "https://itunes.apple.com/lookup?id=1888965014&entity=album&limit=200&country=ph" -o albums.json
# 2. rebuild src/tracks.js (newest-first, real previewUrl + trackViewUrl) and download
#    new covers into public/album/ — see the python snippets in the project history.
```

> Previews are 30-second clips hosted by Apple (no login needed). The player's **Full
> track ↗** link sends listeners to the complete song on Apple Music. If you add a new
> release, also add its discography row (§3) with a matching `data-qi`.

---

## Checklist before publishing

- [ ] Contact email is current (`nicartjay@rakumail.jp`).
- [ ] Links open the correct pages.
- [ ] The player plays a preview from a discography row and from the Latest tracklist.
- [ ] Clicking the currently-playing track's cover **pauses** it (and resumes on next click)
      rather than restarting from the beginning.
- [ ] `npm run build` completes with no errors.
- [ ] `npm run preview` looks right on desktop **and** a narrow phone width.
