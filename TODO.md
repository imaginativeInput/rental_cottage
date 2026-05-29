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

## Tech debt spotted along the way

Not blocking, but worth queueing before they bite us:

- **`Contact.vue` has un-scoped `.attractions { ... }` rules** that leak globally — they collided with the new `Attractions` section while building it (had to override `text-align: left` on the card). Will collide again if `<Contact />` is ever uncommented in `HomeView`. Either scope the styles or rename the conflicting classes.
- **Three "AVIF" originals are actually JPEG content** (`src/assets/gallery/NZF_4375.avif`, `src/assets/NZF_4359.avif`, `src/assets/gallery/NZF_4359.avif`) — confirmed by `file` and `sharp`. Browsers don't care (content-sniffing wins), and the responsive `-480/-960/-1440` variants emitted by `images:gen` are real AVIF, so this isn't user-visible. Worth re-encoding the sources to real AVIF for cleanliness next time the gallery is touched.
- **`public/gallery-hd/` is ~67 MB in the repo**. Works for Vercel, but bloats clones + history. Consider hosting on a CDN / R2 / Vercel Blob and pointing `getHDImageByName` at it.
- **SMTP credentials are hardcoded in `domekAPI/app.py`**. Move `MAIL_USERNAME` / `MAIL_PASSWORD` / `MAIL_FROM` into env vars (Vercel project settings).
- **`test.vue` at the repo root** looks like an old scratch component — delete or move into `src/`.
- **Hero `Reservation.vue` still shows "X osoby"** even though the section now distinguishes adults from children. Decide whether the hero summary should read "Dorośli" / show the total of adults + children / stay as-is.
- **Hardcoded Polish strings** in `ReservationSection.vue`, `Attractions.vue`, `LanguagePicker.vue` (sheet copy + button label fall back to Polish/English), etc. — `vue-i18n` is already a dep; if a second locale ever ships, those should go through `t(...)`.
- **Hero `Reservation.vue` form still pre-dates the `box-sizing: border-box` reset.** The `.rezerwacja__date { width: 400px }` + `.rezerwacja__guests { width: 150px }` numbers were tuned against the old content-box geometry. Visually fine today, but anyone refactoring that component should re-measure against border-box.
