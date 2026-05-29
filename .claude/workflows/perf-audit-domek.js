export const meta = {
  name: 'perf-audit-domek',
  description: 'Audit Vue3+Vite site for performance wins across 6 dimensions, adversarially verify each finding, rank by impact/effort',
  phases: [
    { title: 'Audit', detail: 'parallel finders per perf dimension' },
    { title: 'Verify', detail: 'adversarially verify + estimate each finding' },
  ],
}

const REPO = '/home/pexny/pxn/rzepiska/domek'

// Shared context fed to every finder so they don't rediscover the obvious and stay grounded.
const CONTEXT = `
Project: Vue 3 + Vite SPA, Polish vacation-house rental landing page ("Domek Rzepiska"). Repo: ${REPO}
Deployed on Vercel (also has a public/.htaccess for Apache fallback). Two routes: '/' (HomeView, eager) and '/galeria' (GalleryView, lazy).
A LOT of perf work already landed (read PROGRESS.md). Current production build numbers:
  - main chunk: dist/assets/index-*.js = 360 KB raw / 130.7 KB gzip  <-- the dominant cost, the thing to shrink
  - index CSS: 51.75 KB / 9.42 KB gzip
  - async chunks already split: Attractions (6.2KB), ReservationSection (13.2KB), GalleryView (13.6KB)
  - deps: vue, vue-router, pinia, vue-i18n, v-calendar (11M in node_modules, pulls @popperjs + date-fns 25M), axios (2.3M), date-fns, @popperjs/core, vue-screen-utils
Hero LCP = an <img> in HomeView.vue served from stable /hero/NZF_4359-{480,960,1440}.avif, preloaded in index.html.
Fonts: self-hosted Playfair Display woff2 (latin preloaded), font-display swap.

KNOWN findings already confirmed by the lead (DO NOT just re-report these; instead VERIFY the cleanest fix and find ADJACENT/RELATED issues):
  A) axios is DEAD WEIGHT. reservationRequest.js uses fetch(). axios is imported ONLY in src/App.vue for an onMounted axios.get('/api/data') whose result (message) is never rendered (template is just <RouterView/><Footer/>). No /api/data endpoint exists (.htaccess SPA-fallbacks it to index.html). => removing axios import+call from App.vue and dropping axios from package.json should be a pure win.
  B) v-calendar is registered globally + imported eagerly in src/main.js (setupCalendar + Calendar + DatePicker components). VDatePicker is used by hero Reservation.vue (eager in HomeView) and ReservationSection.vue (async), but ALWAYS gated behind a toggle (calendarStore.isCalendarVisible / v-if width). So its DOM is never on first paint, yet its JS sits in the main chunk. This is likely the bulk of the 130KB. Deferring v-calendar off the critical path is the headline win.

Your job: be exhaustive and concrete. Every finding MUST cite file:line, give the exact change, estimate impact (KB saved gzip, ms, or LCP/CLS effect), rate effort (trivial/small/medium/large) and risk (none/low/med/high), and note any behavior/test impact. Read actual files; do not speculate. There are 64 vitest tests (npm test) and the build is 'npm run build' — note which findings could break tests.`

const FINDING_SCHEMA = {
  type: 'object',
  properties: {
    dimension: { type: 'string' },
    findings: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'short kebab slug' },
          title: { type: 'string' },
          location: { type: 'string', description: 'file:line(s)' },
          problem: { type: 'string' },
          fix: { type: 'string', description: 'exact, concrete change' },
          impact: { type: 'string', description: 'KB gzip / ms / LCP / CLS estimate' },
          effort: { type: 'string', enum: ['trivial', 'small', 'medium', 'large'] },
          risk: { type: 'string', enum: ['none', 'low', 'med', 'high'] },
          breaksTests: { type: 'boolean' },
          notes: { type: 'string' },
        },
        required: ['id', 'title', 'location', 'problem', 'fix', 'impact', 'effort', 'risk', 'breaksTests'],
      },
    },
  },
  required: ['dimension', 'findings'],
}

const DIMENSIONS = [
  {
    key: 'bundle-js',
    prompt: `${CONTEXT}\n\nDIMENSION: JavaScript bundle & dependencies. Focus: how to shrink the 130KB gzip main chunk. Investigate the CLEANEST way to lazy-load v-calendar (it's globally registered in main.js but only ever shown behind a toggle in both Reservation.vue (eager) and ReservationSection.vue (async)) — propose a concrete refactor (async component / dynamic import / move setupCalendar off main.js) and estimate the gzip drop. Confirm axios removal (finding A) and check for OTHER unused/heavy deps (date-fns direct use? @popperjs? vue-screen-utils? are they tree-shaken?). Check vue-i18n usage vs cost (only ~12 keys, legacy:false). Look at vite.config.js for missing manualChunks/build optimizations. Run actual analysis: read package.json, main.js, the importing components, and reason about what lands in index-*.js. List every dependency and whether it's on the critical path.`,
  },
  {
    key: 'critical-path',
    prompt: `${CONTEXT}\n\nDIMENSION: Critical rendering path, LCP, fonts, preloads. Read index.html, main.js, App.vue, HomeView.vue, src/assets/fonts.css, src/assets/main.css (and base.css). Evaluate: is the hero <img> truly the LCP and is the preload optimal (correct sizes/fetchpriority/duplicate with the <img>)? Is the latin-ext font preload missing/over-eager? Is there render-blocking CSS or @import chains? Is v-calendar/style.css (imported in main.js) and main.css render-blocking and heavy? Does main.js do synchronous work before mount that delays FCP? Is there a CLS risk from the hero/header/fonts? Propose concrete changes with ms/LCP estimates.`,
  },
  {
    key: 'images',
    prompt: `${CONTEXT}\n\nDIMENSION: Image delivery. Read HomeView.vue, components/Gallery.vue, components/About.vue, components/Attractions.vue, components/PictureImg.vue, views/GalleryView.vue, src/utils/responsiveImages.js, and ls the dist/assets + public/gallery-hd + src/assets dirs (sizes). Evaluate: hero variants sizing vs actual display, gallery slider images (are off-screen slides lazy? is fetchpriority correct?), Attractions 8 cards (lazy? sized? still JPEG not AVIF — should they be AVIF?), About images (eager — justified?). Are there oversized AVIFs in the bundle (some are 300KB+)? Is width/height set on <img> to prevent CLS? Is public/gallery-hd (67MB) shipped/cached well? Any images that should use width/height attrs or aspect-ratio. Concrete fixes + KB/CLS estimates.`,
  },
  {
    key: 'css',
    prompt: `${CONTEXT}\n\nDIMENSION: CSS. The index CSS is 51.75KB (9.42KB gzip). Read src/assets/main.css, base.css, fonts.css, and scan component <style> blocks for: large unused/dead CSS (e.g. .calendar-container/.vc-* overrides in HomeView for a deferred calendar, dropped popup-form leftovers), duplicate resets, expensive selectors, unscoped global leakage. Is the 51KB justified? What can be deferred or removed? Note any *.vc-* / v-calendar override CSS that ships in the critical CSS but is only needed when the (deferred) calendar opens. Concrete deletions/moves with gzip estimates.`,
  },
  {
    key: 'network-caching',
    prompt: `${CONTEXT}\n\nDIMENSION: Network, caching, headers, wasted requests. Read vercel.json, public/.htaccess, App.vue. Evaluate: (1) the dead axios.get('/api/data') request fired on every load (finding A) — confirm it's a real wasted round-trip and what it returns. (2) Cache headers: vercel.json covers /assets /fonts /hero /gallery-hd but NOT the html or other paths; .htaccess and vercel.json may disagree — does the deployed (Vercel) config miss anything (e.g. immutable on hashed assets is fine, but is there a default)? (3) Missing preconnect/dns-prefetch to the reservation API origin (rental-cottage-api-*.vercel.app) used on form submit, or to fonts/Instagram? (4) Is Brotli/gzip on? (5) Any third-party (Google Translate, Instagram) loaded eagerly? Concrete fixes + ms estimates.`,
  },
  {
    key: 'runtime-vue',
    prompt: `${CONTEXT}\n\nDIMENSION: Vue runtime cost & dead code. Read App.vue, HomeView.vue, Reservation.vue, ReservationSection.vue, Gallery.vue, Header.vue, MobileHeader.vue, the stores, src/utils/closeMobileNav.js. Find: (1) App.vue's onMounted axios debug call + unused useI18n import (dead). (2) Reservation.vue dead code (it has "SOMETHING TO GET RID OF" markers, console.logs, a changeNumberOfGuests referencing an undefined peopleCount.value) — what ships and what's dead. (3) eager components in HomeView that could be deferred (Welcome/About/Gallery below fold?) vs the LCP tradeoff. (4) expensive watchers, resize listeners without passive/debounce, re-render triggers, v-calendar attrs recomputed. (5) v-for without :key, large reactive objects. Concrete fixes + impact.`,
  },
]

phase('Audit')
log('Fanning out 6 perf-dimension finders, each verifies as it completes...')

const results = await pipeline(
  DIMENSIONS,
  d => agent(d.prompt, { label: `audit:${d.key}`, phase: 'Audit', schema: FINDING_SCHEMA }),
  (audit, d) => {
    if (!audit || !audit.findings || !audit.findings.length) return { dimension: d.key, verified: [] }
    return parallel(audit.findings.map(f => () =>
      agent(
        `You are an adversarial verifier on the Vue3+Vite repo at ${REPO}. A perf finding was proposed. Your job: independently CHECK it against the actual code, then judge.\n\nFINDING:\n${JSON.stringify(f, null, 2)}\n\nDo this:\n1. Open the cited file(s):line(s). Confirm the problem description is ACCURATE (the code really does what the finding claims). Quote the relevant lines.\n2. Confirm the proposed fix is CORRECT and SAFE — would it actually build (npm run build) and not break the 64 vitest tests? Would it change user-visible behavior? Check imports/usages elsewhere with grep before declaring something "unused".\n3. Re-estimate impact realistically (don't trust the finding's number — gzip savings of a dep only count if nothing else pulls it in; a request only matters if it's on the critical path).\n4. Verdict: isReal (problem is genuine), fixIsSafe (fix won't break build/tests/behavior, or describe the guard needed), and a corrected impact/effort/risk if the finding's were off.\nDefault to skeptical: if you can't confirm from the code, say isReal=false and explain.`,
        { label: `verify:${d.key}:${f.id}`, phase: 'Verify', schema: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            title: { type: 'string' },
            isReal: { type: 'boolean' },
            fixIsSafe: { type: 'boolean' },
            evidence: { type: 'string', description: 'quoted code / grep result proving the verdict' },
            correctedImpact: { type: 'string' },
            correctedEffort: { type: 'string', enum: ['trivial', 'small', 'medium', 'large'] },
            correctedRisk: { type: 'string', enum: ['none', 'low', 'med', 'high'] },
            recommendation: { type: 'string', description: 'do-now / do-with-care / skip + one-line why' },
          },
          required: ['id', 'title', 'isReal', 'fixIsSafe', 'evidence', 'recommendation'],
        } }
      ).then(v => ({ ...f, dimension: d.key, verdict: v }))
    ))
  }
)

const all = results.flat().filter(Boolean)
const confirmed = all.filter(f => f.verdict && f.verdict.isReal)
log(`${all.length} findings, ${confirmed.length} verified real`)

return {
  totalFindings: all.length,
  confirmedReal: confirmed.length,
  findings: all.map(f => ({
    dimension: f.dimension,
    id: f.id,
    title: f.title,
    location: f.location,
    problem: f.problem,
    fix: f.fix,
    proposedImpact: f.impact,
    proposedEffort: f.effort,
    proposedRisk: f.risk,
    breaksTests: f.breaksTests,
    verdict: f.verdict,
  })),
}
