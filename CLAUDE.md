# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` - Start Vite dev server
- `npm run build` - Production build
- `npm run preview` - Preview production build
- `npm run lint` - Run both oxlint and eslint (sequentially via `run-s lint:*`)
- `npm run lint:oxlint` - Run oxlint with correctness rules and autofix
- `npm run lint:eslint` - Run eslint with autofix
- `npm run format` - Format src/ with Prettier

## Architecture

**Vue 3 + Vite** rental cottage website for "Domek Panorama Rzepiska" (Tatra Mountains, Poland). Uses Composition API (`<script setup>`) throughout, no TypeScript.

### Routing (`src/router/index.js`)

Two routes:
- `/` - HomeView (single-page layout with all sections: Welcome, Reservation toolbar, About, Gallery, ReservationSection)
- `/galeria` - GalleryView (dedicated gallery page with lightbox image viewer)

A `beforeEach` guard updates `usePageStore().isHome` so components (Header, MobileHeader) can adapt behavior based on current page.

### State Management (Pinia stores in `src/stores/`)

- **isHomeStore** - Tracks whether user is on home page (used by Header for navigation behavior)
- **guestStore** - Guest/people count shared between Reservation toolbar and ReservationSection
- **calendarStore** - Calendar popup visibility toggle (used by Reservation toolbar)
- **mobileHeaderStore** - Mobile nav open/closed/animating state

### Key Shared State (`src/utils/reservationRequest.js`)

`dateRange` ref and `sendReservationRequest()` are exported and shared between the Reservation toolbar (popup form) and ReservationSection (inline form). Both components write to the same `dateRange` and call the same API submission function.

### Page Layout Pattern (HomeView)

Sections alternate between dark and light backgrounds:
- Welcome (transparent/hero image) -> Reservation toolbar (dark) -> About (dark `--clr-dark`) -> Gallery welcome (light `--clr-light`) -> Gallery (dark) -> ReservationSection (light `--clr-light`) -> Footer (dark)

When adding or modifying sections, maintain this dark/light alternation.

### VDatePicker / v-calendar

`VCalendar` and `VDatePicker` are registered globally in `main.js` via `setupCalendar`. Global v-calendar styles (`.vc-*` classes) live in `HomeView.vue`'s `<style global>` block - these affect both the Reservation toolbar's popup calendar and the ReservationSection's inline calendar. Use `:deep()` in scoped styles when overriding v-calendar styles for a specific component only.

### i18n (`vue-i18n`)

Default locale is `pl-PL` with `en-US` fallback. Translation keys are defined inline in `main.js`. The site also embeds a Google Translate widget (in `index.html`) for additional languages (de, fr).

### Image Loading (Gallery)

Gallery images use `import.meta.glob()` for dynamic loading of `.avif` files from `src/assets/gallery/`. A blur-up lazy loading technique uses `*_small.jpg` thumbnails as placeholders with a custom `v-intersect` directive (IntersectionObserver). The home page Gallery component has a sliding image viewer with CSS keyframe animations.

### API

Reservation requests POST to a Vercel-hosted API endpoint. Validation uses regex for email and phone (Polish format `+48 123 456 789`).

## Styling

- CSS custom properties defined in `src/assets/main.css`: color palette (`--clr-*`) and size scale (`--size-xxs` through `--size-10xl`)
- Components use `<style scoped>` with responsive breakpoints at: 475px, 550px, 640px, 768px, 1024px, 1280px, 1536px
- Path alias: `@` maps to `./src`

## Code Style

- No semicolons, single quotes, 100 char print width (Prettier)
- Vue Composition API with `<script setup>` (no Options API)
- Polish language for UI text, English for code/comments
