# Progress

Session summary of work landed on `main`. Newest commits at the top of each group.

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
