# TODO

## Next goal — frontend test coverage

The site has grown a lot of stateful UI (reservation form, guest cap logic, lightbox HD swap, attractions grid) and no test coverage yet. Priority is unit/component tests with **Vitest + @vue/test-utils** and a small set of **Playwright** end-to-end flows that protect the booking funnel.

### Suggested first test surfaces (highest value → lowest)

1. **Reservation form (`ReservationSection.vue` + `guestStore` + `reservationRequest.js`)**
   - Email/phone regex pass + fail cases.
   - Adults counter bounds (1 ≤ peopleCount ≤ 13).
   - Children counter bounds (childrenCount ≥ 0).
   - Combined cap: incrementing either counter at total = 13 is a no-op; `isAtCapacity` toggles the hint and disables both `+` buttons.
   - `pets` toggle reflects on `guestStore.hasPets`.
   - Summary chip: hidden when `hasValidRange` is false; pluralises Polish correctly (`1 noc / 2-4 noce / 5+ nocy`; same for `dorosły/dorosłych` and `dziecko/dzieci`).
   - `handleSubmit` skips the loading spinner when client-side validation will fail and toggles `isSubmitting` only around the network call.
   - Submit payload includes `children` and `pets` and posts the right shape.

2. **Hero guest dropdown (`Reservation.vue` `selectGuests`)**
   - Picking a value updates `peopleCount`.
   - Picking a value that would push `peopleCount + childrenCount > 13` resets `childrenCount` to 0.

3. **GalleryView lightbox HD swap (`setViewerImage`)**
   - Initial `viewerSrc` is the light bundled URL.
   - On HD `Image().onload`, `viewerSrc` becomes `/gallery-hd/<name>.avif`.
   - Race-condition guard: a late HD load for an image that's no longer the active index must NOT overwrite the current `viewerSrc`.

4. **Attractions (`Attractions.vue`)**
   - All 8 cards render.
   - Cards with `url` show the "Dowiedz się więcej" link with `target="_blank"` + `rel="noopener noreferrer"`.
   - Cards without `url` (Jurgów, Zakopane) do NOT render the link.
   - Each card's image `alt` matches the title (a11y).

5. **End-to-end (Playwright, headed against `vite dev`)**
   - Open `/`, fill the bottom reservation form with valid data, intercept the POST, assert payload.
   - Open `/galeria`, click a tile, confirm the `<img id="img-big">` ends on a `/gallery-hd/` URL.
   - Click "Sprawdź dostępność" in the hero, assert the page scrolled to `#reservation-section`.

### Tooling notes for that work

- Add `vitest`, `@vue/test-utils`, `@vitest/coverage-v8`, and `jsdom` to `devDependencies`.
- Add a `vitest.config.js` reusing the existing Vite + Vue plugin.
- Add `npm run test` and `npm run test:e2e`. Wire CI later.
- Mock `import.meta.glob` in the Gallery tests so the gallery imports don't pull every asset into test workers.
- Stub `fetch` for `sendReservationRequest`; don't hit the real Vercel endpoint.

---

## Tech debt spotted along the way

Not blocking, but worth queueing before they bite us:

- **`Contact.vue` has un-scoped `.attractions { ... }` rules** that leak globally — they collided with the new `Attractions` section while building it (had to override `text-align: left` on the card). Will collide again if `<Contact />` is ever uncommented in `HomeView`. Either scope the styles or rename the conflicting classes.
- **`vue-screen-utils` is imported by `Reservation.vue` and `ReservationSection.vue` but not in `package.json`**. Currently works through `package-lock`; add it explicitly.
- **`public/gallery-hd/` is ~67 MB in the repo**. Works for Vercel, but bloats clones + history. Consider hosting on a CDN / R2 / Vercel Blob and pointing `getHDImageByName` at it.
- **SMTP credentials are hardcoded in `domekAPI/app.py`**. Move `MAIL_USERNAME` / `MAIL_PASSWORD` / `MAIL_FROM` into env vars (Vercel project settings).
- **`test.vue` at the repo root** looks like an old scratch component — delete or move into `src/`.
- **Hero `Reservation.vue` still shows "X osoby"** even though the section now distinguishes adults from children. Decide whether the hero summary should read "Dorośli" / show the total of adults + children / stay as-is.
- **Hardcoded Polish strings** in `ReservationSection.vue`, `Attractions.vue`, etc. — `vue-i18n` is already a dep; if a second locale ever ships, those should go through `t(...)`.
