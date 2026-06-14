import './style.css'
import './intro.js'
import { TRACKS } from './tracks.js'

const prefersReduced =
  window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/* ── Mobile burger menu ──────────────────────────────────────────── */
;(function () {
  const burger = document.getElementById('burger')
  const menu = document.getElementById('mobile-menu')
  const open = document.getElementById('burger-open')
  const close = document.getElementById('burger-close')
  if (!burger) return

  function setOpen(isOpen) {
    menu.classList.toggle('open', isOpen)
    open.style.display = isOpen ? 'none' : 'block'
    close.style.display = isOpen ? 'block' : 'none'
    burger.setAttribute('aria-expanded', String(isOpen))
    // Move focus into the menu when opening so keyboard users land on the links.
    if (isOpen) {
      const first = menu.querySelector('a')
      if (first) first.focus()
    }
  }
  burger.addEventListener('click', () => setOpen(!menu.classList.contains('open')))
  // Close the menu after tapping a link, returning focus to the toggle.
  menu.querySelectorAll('a').forEach((a) =>
    a.addEventListener('click', () => {
      setOpen(false)
      burger.focus()
    })
  )
  // Keep Tab cycling within the open menu (simple focus trap: burger ↔ links).
  menu.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab' || !menu.classList.contains('open')) return
    const links = Array.from(menu.querySelectorAll('a'))
    if (!links.length) return
    const first = links[0]
    const last = links[links.length - 1]
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault()
      burger.focus()
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault()
      burger.focus()
    }
  })
  // Close on Escape and return focus to the toggle.
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains('open')) {
      setOpen(false)
      burger.focus()
    }
  })
})()

/* ── Hero parallax: foreground railing + glass panels drift on scroll ── */
;(function () {
  const rail = document.getElementById('rail')
  const panels = document.getElementById('panels')
  const isMobile = () => window.innerWidth < 768
  if (prefersReduced) return

  function onScroll() {
    const y = window.scrollY || window.pageYOffset
    // The railing is the nearest layer, so it drifts down fastest as the hero scrolls up.
    if (rail) rail.style.transform = 'translateY(' + y * 0.16 + 'px)'
    if (panels && !isMobile()) panels.style.bottom = 36 + y * 0.5 + 'px'
  }
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
})()

/* ── Cat: settle onto the railing on load, slip away on scroll ────── */
;(function () {
  const cat = document.getElementById('cat')
  if (!cat) return
  // Settle in on the next frame so the enter transition runs (instant under reduced-motion).
  requestAnimationFrame(() => cat.classList.add('is-in'))

  const THRESH = 10
  window.addEventListener(
    'scroll',
    () => {
      const y = window.scrollY || window.pageYOffset
      cat.classList.toggle('is-out', y > THRESH)
    },
    { passive: true }
  )
})()

/* ── Scroll-spy: highlight the nav pill for the section in view ──── */
;(function () {
  const links = Array.from(document.querySelectorAll('[data-spy]'))
  if (!links.length || !('IntersectionObserver' in window)) return

  const byId = new Map()
  links.forEach((l) => {
    const id = l.getAttribute('href')
    if (id && id.startsWith('#')) byId.set(id.slice(1), l)
  })

  const targets = Array.from(byId.keys())
    .map((id) => document.getElementById(id))
    .filter(Boolean)

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        links.forEach((l) => l.classList.remove('active'))
        const link = byId.get(entry.target.id)
        if (link) link.classList.add('active')
      })
    },
    { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
  )
  targets.forEach((t) => observer.observe(t))
})()

/* ── Reduced motion: stop the looping background clips after autoplay ── */
if (prefersReduced) {
  window.addEventListener('load', () => {
    document.querySelectorAll('video').forEach((v) => {
      try {
        v.pause()
      } catch (e) {}
    })
  })
}

/* ── Preview player: 30s Apple Music clips, queue across all tracks ──── */
;(function () {
  const bar = document.getElementById('player')
  const audio = document.getElementById('pl-audio')
  if (!bar || !audio || !Array.isArray(TRACKS) || !TRACKS.length) return

  const $ = (id) => document.getElementById(id)
  const coverEl = $('pl-cover')
  const titleEl = $('pl-title')
  const relEl = $('pl-release')
  const toggle = $('pl-toggle')
  const seek = $('pl-seek')
  const curEl = $('pl-cur')
  const durEl = $('pl-dur')
  const appleEl = $('pl-apple')
  const iconPlay = toggle.querySelector('.ic-play')
  const iconPause = toggle.querySelector('.ic-pause')

  let idx = -1
  let seeking = false
  let triggerEl = null // the play button that last opened the player (for focus return)
  const ACCENT =
    getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#1f7a48'

  const fmt = (s) => {
    s = Math.max(0, Math.floor(s || 0))
    return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0')
  }
  const paintSeek = () => {
    const max = Number(seek.max) || 30
    const pct = (Number(seek.value) / max) * 100
    seek.style.background =
      'linear-gradient(to right, ' + ACCENT + ' ' + pct + '%, rgba(36,31,33,0.18) ' + pct + '%)'
  }
  const markActive = () => {
    document.querySelectorAll('.log-row.is-playing').forEach((r) => r.classList.remove('is-playing'))
    document.querySelectorAll('.track-play.is-playing').forEach((b) => b.classList.remove('is-playing'))
    const t = TRACKS[idx]
    if (!t) return
    const row = document.querySelector('.log-row[data-rel="' + t.rel + '"]')
    if (row) row.classList.add('is-playing')
    document.querySelectorAll('[data-qi="' + idx + '"]').forEach((b) => {
      if (b.classList.contains('track-play')) b.classList.add('is-playing')
    })
  }
  const setPlaying = (on) => {
    if (iconPlay) iconPlay.style.display = on ? 'none' : ''
    if (iconPause) iconPause.style.display = on ? '' : 'none'
    toggle.setAttribute('aria-label', on ? 'Pause' : 'Play')
    // Active track shows a stop square while playing, a play triangle while paused.
    document.querySelectorAll('.is-playing').forEach((el) => el.classList.toggle('is-paused', !on))
  }
  const play = () => {
    const p = audio.play()
    if (p && p.catch) p.catch(() => {})
  }
  const load = (n, autoplay) => {
    idx = ((n % TRACKS.length) + TRACKS.length) % TRACKS.length
    const t = TRACKS[idx]
    audio.src = t.src
    coverEl.src = t.cover
    coverEl.alt = t.release + ' — cover'
    titleEl.textContent = t.title
    relEl.textContent = t.release
    appleEl.href = t.apple || '#'
    seek.value = 0
    curEl.textContent = '0:00'
    paintSeek()
    bar.hidden = false
    document.body.classList.add('has-player')
    markActive()
    if (autoplay) play()
  }

  toggle.addEventListener('click', () => {
    if (idx < 0) return load(0, true)
    audio.paused ? play() : audio.pause()
  })
  $('pl-next').addEventListener('click', () => load(idx + 1, true))
  $('pl-prev').addEventListener('click', () => load(idx - 1, true))
  $('pl-close').addEventListener('click', () => {
    audio.pause()
    bar.hidden = true
    document.body.classList.remove('has-player')
    document
      .querySelectorAll('.is-playing, .is-paused')
      .forEach((el) => el.classList.remove('is-playing', 'is-paused'))
    // Reset so the next click on the just-closed track re-opens the bar via load()
    // (the n === idx branch would otherwise resume audio while the bar stays hidden).
    idx = -1
    // Return focus to the play button that opened the player.
    if (triggerEl && triggerEl.isConnected) triggerEl.focus()
    triggerEl = null
  })

  audio.addEventListener('play', () => setPlaying(true))
  audio.addEventListener('pause', () => setPlaying(false))
  audio.addEventListener('ended', () => load(idx + 1, true))
  // Apple rotates/expires preview URLs — surface a clear state instead of a silent stuck bar.
  audio.addEventListener('error', () => {
    if (!audio.src) return // ignore the spurious error when src is cleared
    setPlaying(false)
    titleEl.textContent = 'Preview unavailable'
    seek.value = 0
    curEl.textContent = '0:00'
    paintSeek()
  })
  audio.addEventListener('loadedmetadata', () => {
    const d = isFinite(audio.duration) && audio.duration > 0 ? audio.duration : 30
    seek.max = d
    durEl.textContent = fmt(d)
    paintSeek()
  })
  const announceSeek = (v) =>
    seek.setAttribute('aria-valuetext', fmt(v) + ' of ' + fmt(Number(seek.max) || 30))
  audio.addEventListener('timeupdate', () => {
    if (seeking) return
    curEl.textContent = fmt(audio.currentTime)
    seek.value = audio.currentTime
    announceSeek(audio.currentTime)
    paintSeek()
  })
  seek.addEventListener('input', () => {
    seeking = true
    curEl.textContent = fmt(seek.value)
    announceSeek(seek.value)
    paintSeek()
  })
  seek.addEventListener('change', () => {
    audio.currentTime = Number(seek.value)
    seeking = false
  })

  // Wire every play trigger (discography rows + Latest tracklist).
  // Clicking the active track toggles play/pause; any other track loads fresh.
  document.querySelectorAll('[data-qi]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault()
      const n = parseInt(btn.dataset.qi, 10) || 0
      // A discography row exposes only its release's first track, but the player can be
      // on any track of that release — treat a click on the highlighted row as a toggle.
      const sameRow =
        n === idx ||
        (idx >= 0 &&
          btn.classList.contains('log-play') &&
          TRACKS[idx] &&
          TRACKS[n] &&
          TRACKS[idx].rel === TRACKS[n].rel)
      if (sameRow) {
        audio.paused ? play() : audio.pause()
      } else {
        triggerEl = btn
        load(n, true)
      }
    })
  })
})()
