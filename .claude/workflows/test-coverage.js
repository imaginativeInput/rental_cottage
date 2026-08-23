export const meta = {
  name: 'test-coverage',
  description: 'Write+verify Vitest tests for every untested source file, then harden assertions',
  phases: [
    { title: 'Write', detail: 'one agent per untested file: write tests, loop vitest until green' },
    { title: 'Harden', detail: 'strengthen assertions, add edge cases, re-verify green' },
  ],
}

const SHARED = `
PROJECT: "domek" — Vue 3 + Vite vacation-house landing site. Stack: Vue 3 (script setup, Composition API), Pinia, vue-router, vue-i18n (createI18n legacy:false).

TEST STACK: Vitest + @vue/test-utils + jsdom. Config vitest.config.js: { environment:'jsdom', globals:true, setupFiles:['./tests/setup.js'], include:['tests/**/*.test.{js,ts}'] }. '@' alias maps to ./src.

tests/setup.js ALREADY EXISTS — DO NOT EDIT IT, DO NOT EDIT ANY SOURCE FILE. It:
 - Registers a vue-i18n plugin GLOBALLY for all mounts (locale 'pl'). Messages define ONLY { confirm:'Potwierdź', askQuestion:'Zadaj pytanie' }. EVERY OTHER key returns the key string itself, e.g. t('gallery') -> 'gallery'.
 - Both composition t() (from useI18n) and template $t() resolve.
 - Globally stubs child components VDatePicker, Header, MobileHeader. (This only stubs them when they appear as CHILDREN. Mounting Header/MobileHeader as the ROOT of your test renders the REAL component.) Extra global.stubs you pass MERGE with these.
 - Polyfills window.IntersectionObserver and window.matchMedia.

CONVENTIONS (match the existing passing tests):
 - import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
 - import { mount, flushPromises } from '@vue/test-utils'
 - import Thing from '@/...'
 - let wrapper; afterEach(() => { wrapper?.unmount(); vi.restoreAllMocks() })
 - { attachTo: document.body } when querying document.* directly.
 - PINIA: any store usage (incl. components that call a store) needs an active pinia: import { setActivePinia, createPinia } from 'pinia'; setActivePinia(createPinia()) in beforeEach.
 - vue-router: to assert hrefs from <RouterLink>, stub via global:{ stubs:{ RouterLink:{ props:['to'], template:'<a :href="to"><slot /></a>' } } }. For components that call useRoute/useRouter (Header), install a real memory router: createRouter({history:createMemoryHistory(), routes:[...]}) then mount with global:{ plugins:[router] } and await router.isReady() — see tests/components/HeaderAboutLink.test.js.
 - i18n: DO NOT assert translated copy except for confirm/askQuestion. Assert structure (elements, classes, attrs, counts, hrefs), store side-effects, and event wiring.

HARD RULES:
 - Create exactly ONE new test file at the given path. Do not modify any source file, setup.js, vitest.config.js, or any other existing test.
 - TRUST THE SOURCE FILE over this brief. Read the file first; if any detail below mismatches the real code, follow the code.
 - Do NOT over-mock: mount the real unit and assert observable behavior; mock only true externals (fetch, navigator.clipboard, window.location, window.open, window.Image, timers).
 - Every test must make a meaningful assertion that would FAIL if the logic broke. No smoke-only/assert-true tests.
 - VERIFY: run \`npx vitest run <yourTestFilePath>\` and iterate until ALL tests in your file pass. Then run \`npx vitest run\` once to confirm the whole suite is still green (8 files / 64 tests existed before you started; total must stay all-green).
 - If a test reveals a real source bug, do NOT fix source — assert the ACTUAL current behavior and note the bug in 'notes'.
 - Deterministic only: no real network/timers (use vi.useFakeTimers / mocks).
`

const TARGETS = [
  {
    src: 'src/stores/calendarStore.js',
    test: 'tests/stores/calendarStore.test.js',
    brief: `defineStore('calendar', setup): state isCalendarVisible=ref(false); action toggleCalendar() flips it; a watch(isCalendarVisible) sets document.body.style.overflowX to 'hidden' when true, '' when false. Cover: default isCalendarVisible===false; toggleCalendar() -> true; toggle again -> false. The watcher is async: after toggling, await flushPromises()/nextTick, then assert document.body.style.overflowX === 'hidden' (when visible) and '' (when hidden). setActivePinia(createPinia()) per test; reset document.body.style.overflowX in afterEach.`,
  },
  {
    src: 'src/stores/guestStore.js',
    test: 'tests/stores/guestStore.test.js',
    brief: `defineStore('guest'): refs peopleCount=2, childrenCount=0, hasPets=false; action setPeopleCount(v). Cover: defaults; setPeopleCount(5) updates peopleCount; directly mutating childrenCount.value and hasPets.value works (these have no setters). Note: there is NO reset() action. setActivePinia per test.`,
  },
  {
    src: 'src/stores/isHomeStore.js',
    test: 'tests/stores/isHomeStore.test.js',
    brief: `defineStore('page') exported as usePageStore: ref isHome=true; setHome(value). Cover: default isHome===true; setHome(false) -> false; setHome(true) -> true. setActivePinia per test.`,
  },
  {
    src: 'src/stores/mobileHeaderStore.js',
    test: 'tests/stores/mobileHeaderStore.test.js',
    brief: `useMobileHeaderStore: refs isMobileNav=false, animateClose=false; openMobileNav() -> isMobileNav=true & animateClose=false; closeMobileNav() -> animateClose=true (isMobileNav stays true); handleAnimationEnd() -> IF animateClose is true: isMobileNav=false & animateClose=false; IF animateClose is false: no-op. Cover all branches incl. the no-op branch of handleAnimationEnd. setActivePinia per test.`,
  },
  {
    src: 'src/utils/closeMobileNav.js',
    test: 'tests/utils/closeMobileNav.test.js',
    brief: `Plain module (NO pinia/store). Exports a module-singleton ref animateClose and closeMobileNav() which sets animateClose.value=true. Cover: import both; in beforeEach reset animateClose.value=false; calling closeMobileNav() sets animateClose.value===true; it stays true on repeated calls.`,
  },
  {
    src: 'src/utils/responsiveImages.js',
    test: 'tests/utils/responsiveImages.test.js',
    brief: `Exports srcsetFor(name, { widths=[480,960,1440], format='avif' }={}) -> { srcset, src, type }. Resolves variant files via import.meta.glob over /src/assets/**/*-{480,960,1440}.{avif,jpg,jpeg}. Known-good names: AVIF variants (480/960/1440) exist for e.g. 'fireplace02','NZF_4358','bedroom01','livingroom02','NZF_4513'. JPG variants (480/960 only) exist for attractions e.g. 'terma-bania','zakopane','morskie-oko'. Cover: srcsetFor('fireplace02') -> type==='image/avif', srcset contains '480w' '960w' '1440w' with URLs, src equals the MIDDLE entry's url (entries[floor(len/2)]), widths in ascending order. srcsetFor('terma-bania',{format:'jpeg',widths:[480,960]}) -> type==='image/jpeg', srcset has '480w' & '960w'. srcsetFor('definitely-not-real') -> { srcset:'', src:'', type:'' }. Partial: srcsetFor('terma-bania',{format:'jpeg',widths:[480,960,1440]}) silently skips the missing 1440 (only 480w,960w present). NO mount/pinia — plain import.`,
  },
  {
    src: 'src/components/Welcome.vue',
    test: 'tests/components/Welcome.test.js',
    brief: `STATIC hero. Empty <script setup>, no store, no i18n. Template: <section class="welcome"> with <h2 class="welcome__name">Domek Rzepiska</h2>, <hr class="welcome__hr">, <h1 class="welcome__title">Panorama Tatr</h1>, <h2 class="welcome__subtitle">Niezapomniane chwile i piękne widoki</h2>. Cover: section.welcome exists; welcome__name text === 'Domek Rzepiska'; welcome__title text === 'Panorama Tatr'; welcome__subtitle text contains 'Niezapomniane'; the hr.welcome__hr exists. Plain mount, no pinia.`,
  },
  {
    src: 'src/components/About.vue',
    test: 'tests/components/About.test.js',
    brief: `STATIC component; <script setup> only imports PictureImg (no i18n, no store). Template: <section class="o-nas section-wide" id="o-nas"> with .o-nas__content containing <h2 class="o-nas__title">Dom z widokiem na panoramę Tatr</h2> and <p class="o-nas__description">…</p>; a <br class="img-separator">; then <div class="o-nas__img-wrapper gallery"> with EXACTLY TWO <PictureImg> (names 'NZF_4359' and 'NZF_4375', img-class "o-nas__img", :widths=[480,960,1440]). PictureImg renders a real <picture> with an avif <source>. Cover: the section's id is 'o-nas'; .o-nas__title text === 'Dom z widokiem na panoramę Tatr'; .o-nas__description present and non-empty; exactly 2 <picture> elements, each with a <source type="image/avif"> whose srcset includes 480w/960w/1440w. No pinia.`,
  },
  {
    src: 'src/components/Contact.vue',
    test: 'tests/components/Contact.test.js',
    brief: `STATIC; <script setup></script> is EMPTY (no i18n, no store, no interactivity). Template is a single <section> with three blocks: (1) <div class="contact"> > <h2 class="contact__title"> containing <strong class="price">900</strong>; (2) <div id="atrakcje" class="attractions"> > <h2 class="attractions__title">; (3) <div id="faq" class="faq"> > <h1 class="faq__title">FAQ</h1>, <h2 class="faq__subtitle">, and <ul class="faq__questions"> with EXACTLY 8 <li class="faq__question"> and 8 <li class="faq__answer"> (16 li total). Cover: .price text === '900'; element #atrakcje exists; element #faq exists; .faq__title text === 'FAQ'; exactly 8 .faq__question and exactly 8 .faq__answer. Plain mount, no pinia.`,
  },
  {
    src: 'src/components/Footer.vue',
    test: 'tests/components/Footer.test.js',
    brief: `STATIC, template-only (no <script>): <footer id="kontakt">. Contains: a phone link <a class="phone-link" href="tel:+48692434000"> with <span class="phone-number">+48 692 434 000</span>; an email link <a class="email-link" href="mailto:rezerwacja@domekrzepiska.pl"> with <span class="email-text">rezerwacja@domekrzepiska.pl</span>; a <div class="social-links"> with <a class="social-item google" target="_blank" rel="noopener noreferrer"> (href contains 'google.com/maps') and <a class="social-item instagram" target="_blank" rel="noopener noreferrer"> (href contains 'instagram.com/domekpanoramarzepiska'). The Facebook link is commented out. Cover: footer id 'kontakt'; phone-link href === 'tel:+48692434000' and phone-number text === '+48 692 434 000'; email-link href === 'mailto:rezerwacja@domekrzepiska.pl'; exactly 2 .social-item; the google link href contains 'google.com/maps' with target==='_blank' and rel includes 'noopener'; the instagram link href contains 'instagram.com'. No pinia, no RouterLink, no i18n, no year.`,
  },
  {
    src: 'src/components/Gallery.vue',
    test: 'tests/components/Gallery.test.js',
    brief: `Home-page image CAROUSEL (NOT a grid; distinct from views/GalleryView.vue). script setup imports PictureImg and srcsetFor. const slides = 7 objects {name,alt} (first {name:'fireplace02'}, second {name:'livingroom05-best'}). Refs: currentIndex=0, currentSlide=ref(slides[0]), nextSlide=ref(null), slidingDirection=ref(''), isAnimating=ref(false), isLoading=ref(false). preload(name): const {src}=srcsetFor(name,{widths:[960],format:'avif'}); if(!src) resolve(); else { const img=new Image(); img.onload=resolve; img.onerror=resolve; img.src=src }. advance(dir): returns early if isAnimating||isLoading; sets isLoading=true; newIndex=(currentIndex + (dir==='left'?1:-1) + len) % len; target=slides[newIndex]; await preload(target.name); nextSlide=target; slidingDirection=dir; isAnimating=true; isLoading=false. nextImg=()=>advance('left'); prevImg=()=>advance('right'). handleAnimationEnd(): currentIndex advances, currentSlide=nextSlide, nextSlide=null, isAnimating=false, slidingDirection=''. onMounted preloads slides[1].name. Template: <div class="home-gallery__welcome-section"><h2 class="home-gallery__title">Coś więcej niż dom. . .</h2></div>; <section class="home-gallery"><div class="image-wrapper"><div class="image-container"> with a current <div class="slide" :class="{'slide-out-left':dir==='left','slide-out-right':dir==='right'}"> (PictureImg currentSlide) and v-if="nextSlide" a second <div class="slide" :class="{'slide-in-right':dir==='left','slide-in-left':dir==='right'}" @animationend="handleAnimationEnd"> (PictureImg nextSlide); plus <button id="prev-img-btn" class="home-gallery-btn" @click="prevImg"> and <button id="next-img-btn" class="home-gallery-btn" @click="nextImg">.
TESTING: preload uses new Image() and resolves on img.onload — you MUST mock window.Image exactly like tests/views/GalleryView.test.js (a FakeImage class collected into an array so you can fire .onload() manually), so advance() proceeds deterministically. NOTE onMounted itself calls preload(slides[1]) -> one FakeImage is created on mount; account for that when locating "the latest" image instance. Cover: initially exactly ONE .slide and no v-if nextSlide slide; .home-gallery__title text === 'Coś więcej niż dom. . .'; #prev-img-btn and #next-img-btn both exist. Click #next-img-btn -> advance('left'); fire the newly-created FakeImage's onload() + await flushPromises -> a SECOND .slide appears and the FIRST slide has class 'slide-out-left'. Then trigger('animationend') on the incoming (second) .slide -> handleAnimationEnd: back to ONE .slide and currentSlide is now the previous slides[1]. Guard test: immediately calling nextImg twice (second call while isLoading/isAnimating) must NOT create extra slides. No pinia, no RouterLink.`,
  },
  {
    src: 'src/components/Header.vue',
    test: 'tests/components/Header.test.js',
    brief: `Desktop header (complex). script setup imports useCalendarStore, usePageStore, useRoute, useRouter, useI18n({useScope:'global'}), MobileHeader (child, globally stubbed) and LanguagePicker (child). Refs lastScrollY, scrolled, hideNavbar (+ local isMobileNav, animateClose). isHomePage=computed(()=>route.path==='/'). handleScroll: hideNavbar=window.scrollY>lastScrollY; scrolled=window.scrollY>50; 'scroll' listener added onMounted / removed onBeforeUnmount. openMobileNav sets isMobileNav=true. Template: <div id="overlay" v-if="isMobileNav">; <header id="home" class="header container"> > <nav v-if="!isMobileNav" :class="['navbar',{'hidden-nav':hideNavbar,'scrolled-nav':scrolled}]"> containing <a class="header__link header__home" :href="isHomePage ? '#home' : '/'">; <ul class="header__menu"> with about <a class="header__link" :href="isHomePage ? '#o-nas' : '/#o-nas'">{{t('about')}}, gallery <a class="header__link" :href="isHomePage ? '/galeria' : '#galeria'">{{t('gallery')}} (NOTE inversion: '/galeria' on home, '#galeria' off-home), contact <a class="header__link" :href="'#kontakt'">{{t('contact')}}, li.header__line, <LanguagePicker/>, <button id="reservationButton">{{t('reservation')}}; plus <button class="header__bars" @click="openMobileNav">. Then <MobileHeader v-if="isMobileNav||animateClose"/>.
NOTE: tests/components/HeaderAboutLink.test.js ALREADY covers the about #o-nas / /#o-nas href in both states (real memory router + setActivePinia, finds a.header__link by href). READ it; reuse the SAME router+pinia pattern; DO NOT duplicate the about-link assertions. Complement: setActivePinia(createPinia()); memory router with routes for '/' and '/galeria'; stub LanguagePicker via global.stubs (MobileHeader stubbed globally). Cover: on '/' -> header__home href '#home', gallery link href '/galeria', contact link href '#kontakt'; on '/galeria' -> header__home href '/', gallery link href '#galeria'; the reservationButton exists with text 'reservation'; set window.scrollY>50 (Object.defineProperty(window,'scrollY',{configurable:true,value:N})) and dispatch a 'scroll' event + await nextTick -> nav gains 'scrolled-nav'; with scrollY greater than the previous lastScrollY -> nav gains 'hidden-nav'; clicking .header__bars sets isMobileNav -> the <nav v-if="!isMobileNav"> disappears and #overlay appears. Restore window.scrollY in afterEach. i18n t() returns the key.`,
  },
  {
    src: 'src/components/MobileHeader.vue',
    test: 'tests/components/MobileHeader.test.js',
    brief: `Presentational mobile menu, PROP-DRIVEN. defineProps({ isOpen:{type:Boolean,required:true}, animateClose:{type:Boolean,required:true} }). Uses useMobileHeaderStore (needs active pinia), usePageStore, useI18n t(), imports router and LanguagePicker (child). computed animationClass: props.animateClose ? 'slide-out' : props.isOpen ? 'slide-in' : ''. emit=defineEmits(['animationEnd','close']). Template root: <div id="mobile-nav" class="mobile-nav" :class="animationClass" @animationend="emit('animationEnd')"> with <div class="button-grid"> of three <button class="btn header__btn">: #phoneCallButton (text t('call'); @click="callPhone(); emit('close')"), #reservationButton (text t('reservation'); @click="handleResevationClick(); emit('close')"), #mapsButton (text t('navigate'); @click="openGoogleMaps(); emit('close')"); then <ul> with FOUR <a> each @click="emit('close')": href="/" {{t('homepage')}}, href="/#o-nas" {{t('about')}}, href="/galeria" {{t('gallery')}}, href="#kontakt" {{t('contact')}}; then <LanguagePicker/>. callPhone sets window.location.href='tel:+48692434000'; openGoogleMaps calls window.open(...). NOTE: at setup it runs document.getElementById('overlay') (returns null — harmless).
TESTING: setActivePinia(createPinia()); stub LanguagePicker via global.stubs; isOpen & animateClose props are REQUIRED so always pass them. Cover: animationClass — {isOpen:true,animateClose:false} -> root .mobile-nav has class 'slide-in'; {isOpen:false,animateClose:true} -> 'slide-out'; {isOpen:false,animateClose:false} -> neither. The four anchor hrefs are exactly '/','/#o-nas','/galeria','#kontakt'. Clicking any anchor -> wrapper.emitted('close') is truthy. Clicking #mapsButton -> window.open called (mock with vi.fn via vi.stubGlobal('open',fn) or spy) AND emits 'close'. Clicking #phoneCallButton -> window.location.href === 'tel:+48692434000' (mock window.location like tests/components/LanguagePicker.test.js: save originalLocation, delete window.location, set window.location={...originalLocation, href:''}; restore in afterEach) AND emits 'close'. Trigger 'animationend' on root .mobile-nav -> emits 'animationEnd'. No RouterLink (plain <a>).`,
  },
  {
    src: 'src/views/HomeView.vue',
    test: 'tests/views/HomeView.test.js',
    brief: `Home view. Imports Header (globally stubbed), Welcome, Reservation, About, Gallery, and async Attractions & ReservationSection; HomeView itself has NO scroll handler/store. Template: a hero <img class="hero__bg" src="/hero/NZF_4359-960.avif" srcset="...480w,960w,1440w" fetchpriority="high" loading="eager" decoding="async">, then <Header/>, then <main> with <Welcome/><Reservation/><About/><Gallery/><Attractions/><ReservationSection/>. Cover: stub the child components via global.stubs (Welcome, Reservation, About, Gallery, Attractions, ReservationSection — Header is already stubbed globally) so the view mounts light. Assert: img.hero__bg exists with src '/hero/NZF_4359-960.avif', fetchpriority 'high', loading 'eager', srcset containing '480w','960w','1440w'; a <main> exists; the stubbed Welcome / Gallery / About children are present. setActivePinia(createPinia()). (There is NO Contact in HomeView and NO scroll handler — do not test those.)`,
  },
  {
    src: 'src/views/AboutView.vue',
    test: 'tests/views/AboutView.test.js',
    brief: `IMPORTANT: leftover scaffold "StickyNavbar" — an Options API component (NOT script setup), no i18n, no store, not used by the router. data(): lastScrollY=0, hideNavbar=false. mounted() adds window 'scroll' -> handleScroll; beforeDestroy() (Vue 2 hook name, does NOT fire in Vue 3 — note this leak in 'notes'). handleScroll(): if window.scrollY > this.lastScrollY -> hideNavbar=true else false; then lastScrollY=window.scrollY. Template: <div><nav class="navbar" :class="{'hidden-nav':hideNavbar}"> with <h1 class="logo">My Website</h1> and ul.nav-links of 4 <li><a> (Home/About/Services/Contact); a .content div. Cover: nav.navbar renders; exactly 4 .nav-links anchors; .logo text === 'My Website'; behavior: set window.scrollY=100 and call wrapper.vm.handleScroll() (or dispatch a real 'scroll' event) + await nextTick -> nav gains 'hidden-nav'; then set window.scrollY=50 (< previous lastScrollY 100) and handleScroll again -> 'hidden-nav' removed. Manage window.scrollY via Object.defineProperty(window,'scrollY',{configurable:true,value:N}); restore in afterEach. No pinia.`,
  },
  {
    src: 'src/views/ReservationView.vue',
    test: 'tests/views/ReservationView.test.js',
    brief: `Tiny view: <div class="reservation-view"><ReservationSection /></div>. (NO props — there is NO isModal.) Cover: stub ReservationSection (global.stubs) and assert the .reservation-view div renders and contains the ReservationSection child (findComponent or the stub element). setActivePinia(createPinia()) to be safe.`,
  },
]

const WRITE_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: {
    testFile: { type: 'string' },
    testCount: { type: 'integer' },
    status: { type: 'string', enum: ['green', 'failing', 'blocked'] },
    summary: { type: 'string', description: 'one line: what is covered' },
    notes: { type: 'string', description: 'bugs found, behavior asserted as-is, anything notable' },
  },
  required: ['testFile', 'testCount', 'status', 'summary'],
}

const HARDEN_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: {
    testFile: { type: 'string' },
    testCount: { type: 'integer' },
    status: { type: 'string', enum: ['green', 'failing', 'blocked'] },
    changed: { type: 'boolean' },
    improvements: { type: 'string' },
    notes: { type: 'string' },
  },
  required: ['testFile', 'testCount', 'status', 'changed'],
}

phase('Write')

const results = await pipeline(
  TARGETS,
  (t) =>
    agent(
      `${SHARED}\n\nYOUR TASK — write the test file ${t.test} for ${t.src}.\n\nFirst READ ${t.src} (and any file it imports that you need, e.g. PictureImg). Then write ${t.test} following the conventions.\n\nFile-specific brief (trust the source over this if they disagree):\n${t.brief}\n\nThen run \`npx vitest run ${t.test}\` and iterate until every test passes; finally run \`npx vitest run\` to confirm the whole suite stays green. Return the structured result.`,
      { label: `write:${t.src.split('/').pop()}`, phase: 'Write', schema: WRITE_SCHEMA, model: 'sonnet', agentType: 'general-purpose' }
    ),
  (writeResult, t) =>
    agent(
      `${SHARED}\n\nYOUR TASK — HARDEN the test file ${t.test} (just written for ${t.src}, currently green).\n\nREAD both ${t.test} and ${t.src}. Then review the tests adversarially:\n - Delete or fix any vacuous test (would still pass if the unit's logic were broken/removed).\n - Cut excessive mocking that hides real behavior; mount the real unit where practical.\n - Add missing high-value cases: edge cases, every conditional branch, event wiring, store side-effects, prop/state variations, listener cleanup on unmount.\n - Make assertions specific (exact counts, exact hrefs/classes/attrs/store values), not loose truthiness.\n - Keep deterministic and convention-matching. Do NOT edit source.\n\nFile-specific brief for reference:\n${t.brief}\n\nAfter editing: run \`npx vitest run ${t.test}\` until green, then \`npx vitest run\` to confirm the whole suite is green. Return the result (changed=true only if you modified the file).\n\nWrite stage reported: ${JSON.stringify(writeResult)}`,
      { label: `harden:${t.src.split('/').pop()}`, phase: 'Harden', schema: HARDEN_SCHEMA, model: 'sonnet', agentType: 'general-purpose' }
    )
)

const clean = results.filter(Boolean)
log(`Done: ${clean.length}/${TARGETS.length} files processed`)

return {
  processed: clean.length,
  total: TARGETS.length,
  files: clean.map((r) => ({ testFile: r.testFile, tests: r.testCount, status: r.status, changed: r.changed, improvements: r.improvements, notes: r.notes })),
}
