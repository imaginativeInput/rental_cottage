import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'

import HomeView from '@/views/HomeView.vue'

const CHILD_STUBS = {
  Welcome: true,
  Reservation: true,
  About: true,
  Gallery: true,
  Attractions: true,
  ReservationSection: true,
}

const mountHome = () =>
  mount(HomeView, {
    global: { stubs: CHILD_STUBS },
  })

describe('HomeView', () => {
  let wrapper

  beforeEach(() => {
    setActivePinia(createPinia())
  })

  afterEach(() => {
    wrapper?.unmount()
    vi.restoreAllMocks()
  })

  it('renders the hero img with correct src', async () => {
    wrapper = mountHome()
    await flushPromises()
    const img = wrapper.find('img.hero__bg')
    expect(img.exists()).toBe(true)
    expect(img.attributes('src')).toBe('/hero/NZF_4359-960.avif')
  })

  it('hero img has fetchpriority="high"', async () => {
    wrapper = mountHome()
    await flushPromises()
    const img = wrapper.find('img.hero__bg')
    expect(img.attributes('fetchpriority')).toBe('high')
  })

  it('hero img has loading="eager"', async () => {
    wrapper = mountHome()
    await flushPromises()
    const img = wrapper.find('img.hero__bg')
    expect(img.attributes('loading')).toBe('eager')
  })

  it('hero img has decoding="async"', async () => {
    wrapper = mountHome()
    await flushPromises()
    const img = wrapper.find('img.hero__bg')
    expect(img.attributes('decoding')).toBe('async')
  })

  it('hero img srcset contains 480w, 960w, and 1440w variants', async () => {
    wrapper = mountHome()
    await flushPromises()
    const srcset = wrapper.find('img.hero__bg').attributes('srcset')
    expect(srcset).toContain('480w')
    expect(srcset).toContain('960w')
    expect(srcset).toContain('1440w')
  })

  it('renders a <main> element', async () => {
    wrapper = mountHome()
    await flushPromises()
    expect(wrapper.find('main').exists()).toBe(true)
  })

  it('renders the Welcome stub inside <main>', async () => {
    wrapper = mountHome()
    await flushPromises()
    const main = wrapper.find('main')
    expect(main.find('welcome-stub').exists()).toBe(true)
  })

  it('renders the Gallery stub inside <main>', async () => {
    wrapper = mountHome()
    await flushPromises()
    const main = wrapper.find('main')
    expect(main.find('gallery-stub').exists()).toBe(true)
  })

  it('renders the About stub inside <main>', async () => {
    wrapper = mountHome()
    await flushPromises()
    const main = wrapper.find('main')
    expect(main.find('about-stub').exists()).toBe(true)
  })

  it('renders the Reservation stub inside <main>', async () => {
    wrapper = mountHome()
    await flushPromises()
    const main = wrapper.find('main')
    expect(main.find('reservation-stub').exists()).toBe(true)
  })

  it('renders the Attractions stub inside <main> after async resolution', async () => {
    wrapper = mountHome()
    await flushPromises()
    const main = wrapper.find('main')
    expect(main.find('attractions-stub').exists()).toBe(true)
  })

  it('renders the ReservationSection stub inside <main> after async resolution', async () => {
    wrapper = mountHome()
    await flushPromises()
    const main = wrapper.find('main')
    expect(main.find('reservationsection-stub').exists()).toBe(true)
  })
})
