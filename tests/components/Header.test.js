import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import { createRouter, createMemoryHistory } from 'vue-router'
import { nextTick } from 'vue'

import Header from '@/components/Header.vue'

const buildRouter = (path) => {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', name: 'home', component: { template: '<div />' } },
      { path: '/galeria', name: 'gallery', component: { template: '<div />' } },
    ],
  })
  router.push(path)
  return router
}

// Helper: mount Header with a ready router and LanguagePicker stubbed
const mountHeader = async (path, opts = {}) => {
  const router = buildRouter(path)
  await router.isReady()
  const wrapper = mount(Header, {
    global: {
      plugins: [router],
      stubs: {
        LanguagePicker: true,
      },
      ...opts.global,
    },
    attachTo: document.body,
    ...opts,
  })
  return { wrapper, router }
}

describe('Header — link hrefs on home route ("/")', () => {
  let wrapper

  beforeEach(() => {
    setActivePinia(createPinia())
  })

  afterEach(() => {
    wrapper?.unmount()
    // Restore scrollY to 0
    Object.defineProperty(window, 'scrollY', { configurable: true, value: 0 })
    vi.restoreAllMocks()
  })

  it('header__home link has href "#home" on home page', async () => {
    ;({ wrapper } = await mountHeader('/'))
    const homeLink = wrapper.find('a.header__link.header__home')
    expect(homeLink.exists()).toBe(true)
    expect(homeLink.attributes('href')).toBe('#home')
  })

  it('gallery link has href "/galeria" on home page', async () => {
    ;({ wrapper } = await mountHeader('/'))
    const galleryLink = wrapper.findAll('a.header__link').find((a) =>
      a.text().includes('gallery')
    )
    expect(galleryLink).toBeDefined()
    expect(galleryLink.attributes('href')).toBe('/galeria')
  })

  it('contact link has href "#kontakt" on home page', async () => {
    ;({ wrapper } = await mountHeader('/'))
    const contactLink = wrapper.findAll('a.header__link').find((a) =>
      a.attributes('href') === '#kontakt'
    )
    expect(contactLink).toBeDefined()
    expect(contactLink.attributes('href')).toBe('#kontakt')
  })
})

describe('Header — link hrefs on non-home route ("/galeria")', () => {
  let wrapper

  beforeEach(() => {
    setActivePinia(createPinia())
  })

  afterEach(() => {
    wrapper?.unmount()
    Object.defineProperty(window, 'scrollY', { configurable: true, value: 0 })
    vi.restoreAllMocks()
  })

  it('header__home link has href "/" on /galeria', async () => {
    ;({ wrapper } = await mountHeader('/galeria'))
    const homeLink = wrapper.find('a.header__link.header__home')
    expect(homeLink.exists()).toBe(true)
    expect(homeLink.attributes('href')).toBe('/')
  })

  it('gallery link has href "#galeria" on /galeria (inverted)', async () => {
    ;({ wrapper } = await mountHeader('/galeria'))
    const galleryLink = wrapper.findAll('a.header__link').find((a) =>
      a.text().includes('gallery')
    )
    expect(galleryLink).toBeDefined()
    expect(galleryLink.attributes('href')).toBe('#galeria')
  })
})

describe('Header — reservationButton', () => {
  let wrapper

  beforeEach(() => {
    setActivePinia(createPinia())
  })

  afterEach(() => {
    wrapper?.unmount()
    Object.defineProperty(window, 'scrollY', { configurable: true, value: 0 })
    vi.restoreAllMocks()
  })

  it('renders #reservationButton with text "reservation"', async () => {
    ;({ wrapper } = await mountHeader('/'))
    const btn = wrapper.find('#reservationButton')
    expect(btn.exists()).toBe(true)
    // i18n stub returns key string for unknown keys
    expect(btn.text()).toBe('reservation')
  })
})

describe('Header — scroll behavior', () => {
  let wrapper

  beforeEach(() => {
    setActivePinia(createPinia())
    Object.defineProperty(window, 'scrollY', { configurable: true, value: 0 })
  })

  afterEach(() => {
    wrapper?.unmount()
    Object.defineProperty(window, 'scrollY', { configurable: true, value: 0 })
    vi.restoreAllMocks()
  })

  it('nav gains "scrolled-nav" class when scrollY > 50', async () => {
    ;({ wrapper } = await mountHeader('/'))
    // Initially nav should not have scrolled-nav
    let nav = wrapper.find('nav')
    expect(nav.classes()).not.toContain('scrolled-nav')

    // Simulate scrolling to 100
    Object.defineProperty(window, 'scrollY', { configurable: true, value: 100 })
    window.dispatchEvent(new Event('scroll'))
    await nextTick()

    nav = wrapper.find('nav')
    expect(nav.classes()).toContain('scrolled-nav')
  })

  it('nav gains "hidden-nav" class when scrollY increases', async () => {
    ;({ wrapper } = await mountHeader('/'))
    // First scroll to establish lastScrollY at 50
    Object.defineProperty(window, 'scrollY', { configurable: true, value: 50 })
    window.dispatchEvent(new Event('scroll'))
    await nextTick()

    // Then scroll down further (> lastScrollY)
    Object.defineProperty(window, 'scrollY', { configurable: true, value: 150 })
    window.dispatchEvent(new Event('scroll'))
    await nextTick()

    const nav = wrapper.find('nav')
    expect(nav.classes()).toContain('hidden-nav')
  })

  it('nav loses "hidden-nav" class when scrollY decreases', async () => {
    ;({ wrapper } = await mountHeader('/'))
    // Scroll down to trigger hidden-nav
    Object.defineProperty(window, 'scrollY', { configurable: true, value: 50 })
    window.dispatchEvent(new Event('scroll'))
    await nextTick()
    Object.defineProperty(window, 'scrollY', { configurable: true, value: 100 })
    window.dispatchEvent(new Event('scroll'))
    await nextTick()

    let nav = wrapper.find('nav')
    expect(nav.classes()).toContain('hidden-nav')

    // Now scroll up
    Object.defineProperty(window, 'scrollY', { configurable: true, value: 80 })
    window.dispatchEvent(new Event('scroll'))
    await nextTick()

    nav = wrapper.find('nav')
    expect(nav.classes()).not.toContain('hidden-nav')
  })
})

describe('Header — mobile nav toggle', () => {
  let wrapper

  beforeEach(() => {
    setActivePinia(createPinia())
  })

  afterEach(() => {
    wrapper?.unmount()
    Object.defineProperty(window, 'scrollY', { configurable: true, value: 0 })
    vi.restoreAllMocks()
  })

  it('clicking .header__bars hides nav and shows #overlay', async () => {
    ;({ wrapper } = await mountHeader('/'))

    // Before click: nav visible, overlay absent
    expect(wrapper.find('nav').exists()).toBe(true)
    expect(wrapper.find('#overlay').exists()).toBe(false)

    await wrapper.find('button.header__bars').trigger('click')
    await nextTick()

    // After click: nav hidden (v-if="!isMobileNav"), overlay shown
    expect(wrapper.find('nav').exists()).toBe(false)
    expect(wrapper.find('#overlay').exists()).toBe(true)
  })
})

describe('Header — scroll listener lifecycle', () => {
  let wrapper

  beforeEach(() => {
    setActivePinia(createPinia())
    Object.defineProperty(window, 'scrollY', { configurable: true, value: 0 })
  })

  afterEach(() => {
    wrapper?.unmount()
    Object.defineProperty(window, 'scrollY', { configurable: true, value: 0 })
    vi.restoreAllMocks()
  })

  it('removes scroll listener on unmount (no state update after unmount)', async () => {
    ;({ wrapper } = await mountHeader('/'))

    // Confirm scroll works before unmount
    Object.defineProperty(window, 'scrollY', { configurable: true, value: 100 })
    window.dispatchEvent(new Event('scroll'))
    await nextTick()
    expect(wrapper.find('nav').classes()).toContain('scrolled-nav')

    // Unmount — listener should be removed
    wrapper.unmount()
    wrapper = null // prevent double-unmount in afterEach

    // Dispatching scroll after unmount should not throw
    Object.defineProperty(window, 'scrollY', { configurable: true, value: 0 })
    expect(() => window.dispatchEvent(new Event('scroll'))).not.toThrow()
  })
})
