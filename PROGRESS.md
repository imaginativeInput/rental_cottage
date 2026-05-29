# Progress

Session summary of work landed on `main`. Newest commits at the top of each group.

## Tech-debt cleanup

Cleared three items off the tech-debt list before they could bite; no visual or behavioural change.

- **Removed `test.vue`** — an abandoned 178-line reservation-form draft at the repo root with no references.
- **Scoped `Contact.vue` styles** — its `<style>` was global, leaking `.attractions` / `.attractions__title` where they collided with the real `Attractions` section. Added `scoped`. (Contact stays commented out in `HomeView`, so this is preventive.)
- **Re-encoded gallery sources to real AVIF** — `file` revealed the mislabel was far wider than the original "3 files" note: *every* `src/assets/gallery/*.avif` source (plus the root `NZF_4359.avif`) was JPEG content carrying an `.avif` extension — 49 files. Re-encoded in place (sharp, q55) and regenerated the `-480/-960/-1440` variants via `images:gen`; ~14.8 MB → 7.5 MB. Delivery was already real AVIF (the variants), so this was cleanliness only. Build + 64 tests green; no JPEG-content `.avif` remain.

The `public/gallery-hd/` ~67 MB CDN move is left as the documented next follow-up in `TODO.md` (needs an external bucket + credentials).

## SEO + performance (web.dev driven)

A round of fixes targeting the web.dev report (Performance 68, SEO 75). Buckets land independently; nothing here changes the visual design.

- **`index.html` SEO foundations**: `<html lang="pl">`, full title with location keywords, meta description, canonical, theme-color, OpenGraph + Twitter cards, an inline `application/ld+json` `LodgingBusiness` block (address + geo + amenities + sameAs). The bogus nested `<!doctype html><html><head>…</head><body>` wrapper inside `HomeView.vue`'s template (which leaked a Google Fonts `<link>` into the body) is gone.
- **Lazy-loaded Google Translate**: new `LanguagePicker.vue` renders a small "🌐 PL" button (white-on-dark by default, dark-on-light when the header's `linkThemeClass = 'link--dark'` for the unscrolled gallery view). Clicking opens a sheet with four explicit options (🇵🇱 Polski / 🇬🇧 English / 🇩🇪 Deutsch / 🇫🇷 Français); the active language is highlighted via `is-current`. Picking a language sets the `googtrans=/pl/<code>` cookie and reloads — on the next page load, if the cookie is non-default, GT is fetched silently via `requestIdleCallback`. Net: 0 KB and 0 ms of Translate on first paint for default-pl visitors (was ~120 KB unused + 1,060 ms render-blocking).
- **Self-hosted Playfair Display**: `public/fonts/playfair-display-{latin,latin-ext}.woff2` (60 KB total). `src/assets/fonts.css` declares `@font-face` for both subsets with `font-display: swap` and the original Google `unicode-range`. `<link rel="preload">` in `index.html` hints the latin subset for the LCP path. Google Fonts is no longer in the critical chain.
- **Responsive image pipeline**: `scripts/generate-responsive-images.mjs` (sharp) emits `-480/-960/-1440` AVIFs for the home gallery + `-480/-960` JPEGs for the attractions section, in place next to the originals. New `src/utils/responsiveImages.js` + `src/components/PictureImg.vue` glob-resolve the variants and render `<picture><source srcset><img sizes></picture>`. Wired into `About.vue` (two gallery images), `Attractions.vue` (8 cards), and `Gallery.vue` (the home slider, with `fetchpriority="high"` on the active slide for the LCP). Hero `.hero__bg` now uses the `-960` / `-1440` variants of `NZF_4359`. `outside01.avif` was re-encoded at q40 in place: **3.20 MB → 0.08 MB**.
- **`vercel.json`, `robots.txt`, `sitemap.xml`**: `Cache-Control: public, max-age=31536000, immutable` on `/assets/*`, `/fonts/*`, `/gallery-hd/*`. `robots.txt` references the sitemap; `sitemap.xml` lists `/` and `/galeria`.
- **Crawlable "O nas" anchor**: `Header.vue` desktop now uses `href="#o-nas"` on the home route and `href="/#o-nas"` elsewhere. Smooth-scroll behaviour preserved via a single click handler that `preventDefault`s on the home page.
- **Bundle slimming**: `Attractions` + `ReservationSection` are now `defineAsyncComponent`-imported from `HomeView.vue`, splitting them out of the main chunk. Initial JS chunk **629 KB → 359 KB** (gzip **169 KB → 130 KB**). New code-split files: `Attractions-*.{js,css}`, `ReservationSection-*.{js,css}`.
- **Vite config**: `build.assetsInlineLimit: 0` so small variants don't inline into JS chunks (keeps the chunk graph honest + lets the cache headers do their job).
- **Narrow-viewport fixes** (post-deploy bug reports):
  - Global `box-sizing: border-box` reset in `src/assets/main.css`. The `.container` utility's left/right padding plus the browser default `content-box` was pushing the header 16 px past the viewport on every page, dragging a horizontal scrollbar in. Adding the reset (and switching `Gallery.vue`'s wrappers from `width: 100vw` to `100%`) restored true full-width responsiveness.
  - `Gallery.vue` home slider now uses `aspect-ratio: 16 / 10` on `< 1024px` viewports and `object-fit: cover` on the active slide. Was: a 100 vh section that letterboxed the image to ~25 % of the visible area on phones. Desktop still uses the full-viewport hero treatment (`height: 100vh`) at `≥ 1024px`.
  - `About.vue` both `PictureImg`s upgraded from `loading="lazy"` to `loading="eager"`. The two images sit in the same grid cell with overlapping clip-paths, and Chrome's lazy-load heuristic was intermittently skipping the second one (~7/10 repro; resize fixed it). Eager is correct here anyway since the section is above the fold on every viewport.

## Testing

- **Initial test harness**: Vitest + `@vue/test-utils` + `jsdom` + `@vitest/coverage-v8`. `vitest.config.js` merges Vite config (keeps the `@` alias). `tests/setup.js` provides a Pinia-friendly i18n stub, stubs `VDatePicker` / `Header` / `MobileHeader`, and polyfills `window.matchMedia` + `IntersectionObserver` (jsdom lacks both).
- **64 tests across 8 files** (`npm test`). New since the SEO/perf round: `LanguagePicker` (cookie read/write, sheet open/close, 4 language options render, picking current is a no-op, picking another reloads), `PictureImg` (srcset/sizes/fetchpriority + jpeg vs avif type), `Header` "O nas" (href varies by route). The original 49 still pass unchanged.
- **Original 49 tests across 5 files**:
  - `tests/utils/reservationRequest.test.js` (7) — email/phone regex pass+fail, exact payload shape (people/children/pets/dates), network/backend error paths, alert copy.
  - `tests/components/ReservationSection.test.js` (29) — counter bounds (1 ≤ adults ≤ 13, children ≥ 0), combined cap of 13 disables both `+` buttons + shows the hint, pets toggle reflects on the store, summary chip plurals (`noc/noce/nocy`, `dorosły/dorosłych`, `dziecko/dzieci`), summary hidden without a valid date range, children/pets chips conditional, `isSubmitting` only flips around real network calls and guards against re-entry.
  - `tests/components/Reservation.test.js` (5) — hero dropdown picks update `peopleCount`, picking a value that would push total > 13 zeros `childrenCount`, "Sprawdź dostępność" smooth-scrolls to `#reservation-section`.
  - `tests/views/GalleryView.test.js` (3) — light bundled URL paints first, HD `/gallery-hd/<name>.avif` swaps in on `Image().onload`, race-condition guard (a late HD load for a no-longer-active index does NOT overwrite `viewerSrc`).
  - `tests/components/Attractions.test.js` (5) — 8 cards render, `target="_blank"` + `rel="noopener noreferrer"` on every external link, Jurgów + Zakopane cards omit the link, image `alt` matches the title.
- **Tooling**: scripts `test`, `test:watch`, `test:coverage` added; `vue-screen-utils` moved out of devDeps into runtime deps (was implicitly resolved through the lockfile before).

## Reservation experience

- **`28d452b` / `b5ac7e2` — Attractions section**: new component with 8 nearby spots (Termy Bukovina, Terma Bania, Kotelnica, Tatrzański Park Narodowy, Bachledka Treetop Walk, Spływ Dunajcem, Kościół w Jurgowie, Zakopane). Each card has a CC-licensed photo, distance pill, category tag, description and an external link only when a working canonical website exists. Wired into `HomeView` between `Gallery` and `ReservationSection`.
- **`c0c63ba` — Summary chip wraps**: fixed `.summary` overflowing the card on narrow screens once it had nights + adults + children + pets.
- **`235d741` — Hero guest dropdown reset**: picking any value from the hero now also zeroes `childrenCount` if the new total would exceed 13. All 1–13 entries are selectable again.
- **`52a3175` — Total guest cap (13)**: both `+` counters in the section disable when adults + children reach 13, with a small "Maksymalna liczba gości to 13." hint. Hero dropdown items were earlier visually disabled (since reverted to the auto-reset approach above).
- **`527f010` — Hero CTA scrolls**: "Sprawdź dostępność" now smooth-scrolls to `#reservation-section` instead of opening a modal. Dropped ~260 lines of dead popup-form CSS + scripting (`formVisible`, `closeForm`, `toggleReservationForm`, textarea char-counter listener, unused `emit`/`useI18n`).
- **`289988a` — Adults/children + pets**: renamed "Liczba osób" → "Dorośli", added a "Dzieci" counter (0–10) and a custom "Zwierzęta" checkbox. `guestStore` exposes `childrenCount` and `hasPets`; submit payload now includes `children` and `pets`.
- **`a70f9cf` — ReservationSection redesign**: two-column desktop layout, elevated card, Playfair title, custom guest counter, icon-prefixed inputs with warm-beige focus rings, inline validation pills with success checkmarks, booking summary chip, animated submit button with loading state. Polish copy fixes; preserved all functional contracts (Pinia stores, shared `dateRange`, DOM ids, v-calendar props).

## Backend (`domekAPI`)

- **`2ba9ad7`** (in `domekAPI` repo) — `RequestPayload` gained `children` (`int = 0`) and `pets` (`bool = False`); both endpoints now call a shared `build_message_content(payload)` helper that emits:
  ```
  Dorośli, Dzieci, Zwierzęta (tak/nie), Od dnia, Do dnia, Treść.
  ```
  Verified end-to-end that a sample payload parses through Pydantic and renders the expected email body.

## Gallery

- **`7dfa2c0` — Mobile padding fix**: `.gallery__img-grid` `margin-bottom` dropped from 5rem to 2rem below 1024px so the light strip between the last picture and the footer is gone.
- **`daa6553` — HD originals in the lightbox**: the 13 heavy originals (`~67 MB`) live in `public/gallery-hd/` (served at site root, not bundled). `GalleryView.setViewerImage` shows the light bundled version first, preloads `/gallery-hd/<name>.avif` in the background, and swaps `viewerSrc` once the HD image is ready — guarded by an index check so rapid prev/next can't paint a stale HD.
- **`b9fbbf0` — Image optimization**: re-encoded every photo in `src/assets/` (181 MB → 12 MB, -93.7 %). Desktop AVIFs at 1920 px wide / q55, `Mobile-*` at 1080 px / q50, attractions JPEG at 1920 px / q78 progressive. EXIF stripped.

## Tooling / repo

- **`67e1596` — Tidy `.gitignore`**: dropped Cypress/Visual Studio/redundant log rules, added `.playwright-mcp/`, `__pycache__/`, `*.pyc`, `.env`. Also `git rm --cached`-ed previously-tracked scratch files (`.playwright-mcp/*`, `__pycache__/app.cpython-313.pyc`) so the new rules actually take effect.

## Reverted

- **`aefb613` / `656ff84`** — temporary `rezerwacja@domekrzepiska.pl` email change rolled back (SMTP credentials for the new mailbox weren't available).
