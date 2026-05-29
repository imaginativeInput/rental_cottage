# TODO

## Before the next deploy

- **Add `public/og-cover.jpg`** (1200×630). Several `<meta>` tags + the LD+JSON block point at `/og-cover.jpg` already; without the file social previews fall back to a broken image.
- **Run Lighthouse against `npm run preview`** to confirm the perf score jump. Targets: LCP < 2.5 s, Performance ≥ 90, SEO ≥ 95.
- **Re-run `npm run images:gen`** any time a source image under `src/assets/gallery/` or `src/assets/attractions/` changes — the script is idempotent and only re-encodes when the source is newer than the variant. Add new sources to the `SOURCES` list at the top.
- **Test the Google Translate flow end-to-end on the deployed preview**. The unit tests cover cookie-write + reload-trigger logic, but the actual GT bootstrap (script fetch on `requestIdleCallback`, banner-frame hidden, translation applied to all sections) needs a once-over in a real browser before users hit it.

## Next goal — Playwright end-to-end coverage

Vitest unit/component tests landed (49 cases, see `PROGRESS.md`). The booking funnel and lightbox HD swap deserve a thin Playwright pass on top, exercised against `vite dev` in a real browser.

### Suggested first E2E flows

1. **Booking funnel (happy path)**: open `/`, scroll to `#reservation-section`, fill email + phone, pick a 3-night range in `VDatePicker`, set 2 adults + 1 child + pets on, click **Potwierdź**, intercept the POST to `…/api/send-message`, assert the exact JSON payload, assert success alert.
2. **Booking funnel (validation)**: leave email empty, submit, assert the "podanie adresu" alert and that no network call was made.
3. **Hero CTA scroll**: click **Sprawdź dostępność** in the hero, assert `#reservation-section` is in view.
4. **Hero guest dropdown reset**: set children = 8 via the bottom section, then pick `13` from the hero dropdown, assert the bottom counter shows `0` children.
5. **Gallery lightbox HD swap**: open `/galeria`, click the first tile, wait for `<img id="img-big">` `src` to end in `/gallery-hd/<name>.avif`.

### Tooling notes for that work

- Use `@playwright/test`. The `playwright-mcp` plugin already ships browsers.
- Run against `vite preview` for stable URLs (no HMR weirdness).
- Stub the Vercel endpoint with `page.route('**/api/send-message', …)` instead of hitting prod.
- Wire `npm run test:e2e`; gate it on CI once the suite is stable.

---

## Perf follow-ups (deferred from round 2 — see PROGRESS.md)

Verified-real audit findings intentionally left for a later pass, with the reason:

- **`GalleryView` eager glob still bundles ~4.6 MB of unused originals.** `import.meta.glob('@/assets/gallery/*.avif', { eager: true })` materializes all 50 originals though only the 13 `imgOrder` names are used (grid now uses variants; lightbox uses the 13). This is **deploy-size only** — the browser never fetches the 37 unused ones — so it was deprioritised vs runtime wins. Fix: build `fullImgs` from an explicit map (`new URL('../assets/gallery/<name>.avif', import.meta.url)`) for the 13 names. (Pairs naturally with the `/gallery-hd/` CDN move below.)
- **Attractions cards are still JPEG, not AVIF.** Converting at a safe quality only saves ~14 % (~155 KB) and some images get *larger* at q50; meaningful savings need q35–40 (49–38 %). They're below-the-fold + lazy + cached, so low ROI. Decide a quality and add an AVIF block to `SOURCES`, then drop `format="jpeg"` from `Attractions.vue`.
- **Hero preload is unused on `/galeria`.** `index.html` globally preloads `/hero/NZF_4359-1440.avif`, but only `HomeView` renders the hero — a hard load of `/galeria` (it's in the sitemap) wastes that high-priority fetch ("preloaded but not used" warning). Needs per-route head management (no head lib in the project today); the home route is the dominant entry, so left as-is.
- **`favicon.ico` is 80 KB** (byte-identical to the 80 KB `house-icon-02-transparent-balanced.png` used as the page icon). Browsers auto-request `/favicon.ico`; shrink both to ~10–20 KB. Needs an ICO encoder (sharp can't write `.ico`).
- **`vue-screen-utils` (~1 KB gzip) sits on the eager path** only to size the now-deferred hero calendar in `Reservation.vue`. Could be replaced with a `matchMedia`/`innerWidth` check (the component already tracks `width`). Tiny; not worth its own change.
- **Remaining shipped `console.log`s / micro dead-code** in `MobileHeader.vue` (2 logs + 2 dead `getElementById`) and an unused `setPeopleCount` in `guestStore`. Negligible perf; fold into a lint-cleanup pass.

## Pre-existing bug found (NOT introduced this round)

- **v-calendar throws `TypeError: Cannot read properties of undefined (reading 'dayIndex')` when completing a range selection in the hero calendar.** Reproduced **identically on pristine `main`** (commit `2348506`, eager v-calendar + `setupCalendar`) — so it is not caused by the lazy-load refactor. The error is internal to v-calendar's highlight render and is non-fatal (the range still selects and the calendar closes). Likely related to the custom `attrs` dot attribute (`{ key:'Any', dot:true, dates:new Date(), expanded:true }` — `expanded` is not a valid attribute key). Worth fixing the `attrs` config separately. (Note: the hero's end-date display also shows a wrong day via `formattedEndDate`'s `tomorrow`-replacement logic — separate pre-existing quirk.)

## Tech debt spotted along the way

Not blocking, but worth queueing before they bite us:

- **`public/gallery-hd/` is ~67 MB in the repo** — bloats clones + history. **Next follow-up (needs an external bucket + credentials):** introduce a base URL (e.g. `const HD_BASE = import.meta.env.VITE_GALLERY_HD_BASE ?? '/gallery-hd'`) and point `GalleryView`'s HD-URL builder at it; upload the 24 AVIFs to Cloudflare R2 (S3-compatible, zero egress) or Vercel Blob; `git rm -r --cached public/gallery-hd`, add it to `.gitignore`, and set `VITE_GALLERY_HD_BASE` in Vercel project settings. Default stays `/gallery-hd` so local dev still works.
- **SMTP credentials are hardcoded in `domekAPI/app.py`**. Move `MAIL_USERNAME` / `MAIL_PASSWORD` / `MAIL_FROM` into env vars (Vercel project settings).
- **Repo-wide lint is not clean** (`npm run lint`) — pre-existing `no-undef`/`no-unused-vars`/`vue/*` errors in older files (`ReservationForm.vue`, `Welcome.vue`, `AboutView.vue`, `ReservationView.vue`, `Reservation.vue`, etc.), plus a couple in this round's new files (`LanguagePicker.vue` `no-document-cookie`, `HeaderAboutLink.test.js` unused var). Worth a dedicated lint-cleanup pass.
- **Hero `Reservation.vue` still shows "X osoby"** even though the section now distinguishes adults from children. Decide whether the hero summary should read "Dorośli" / show the total of adults + children / stay as-is.
- **Hardcoded Polish strings** in `ReservationSection.vue`, `Attractions.vue`, `LanguagePicker.vue` (sheet copy + button label fall back to Polish/English), etc. — `vue-i18n` is already a dep; if a second locale ever ships, those should go through `t(...)`.
- **Hero `Reservation.vue` form still pre-dates the `box-sizing: border-box` reset.** The `.rezerwacja__date { width: 400px }` + `.rezerwacja__guests { width: 150px }` numbers were tuned against the old content-box geometry. Visually fine today, but anyone refactoring that component should re-measure against border-box.
