import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'

import Gallery from '@/components/Gallery.vue'

// Collect every FakeImage instance so tests can fire onload manually.
const fakeImages = []
class FakeImage {
  constructor() { fakeImages.push(this) }
  set src(v) { this._src = v }
  get src() { return this._src }
}

describe('Gallery (home carousel)', () => {
  let wrapper
  let originalImage

  beforeEach(() => {
    fakeImages.length = 0
    originalImage = window.Image
    window.Image = FakeImage
  })

  afterEach(() => {
    window.Image = originalImage
    wrapper?.unmount()
    vi.restoreAllMocks()
  })

  // Mount helper — onMounted fires preload(slides[1]) which creates one FakeImage.
  const mountGallery = async () => {
    wrapper = mount(Gallery, { attachTo: document.body })
    await wrapper.vm.$nextTick()
    return wrapper
  }

  it('renders exactly one .slide on initial mount', async () => {
    await mountGallery()
    expect(wrapper.findAll('.slide').length).toBe(1)
  })

  it('does NOT render a second slide (v-if nextSlide) on initial mount', async () => {
    await mountGallery()
    // The only slide is the current one — no nextSlide yet.
    expect(wrapper.findAll('.slide').length).toBe(1)
  })

  it('renders the title text exactly', async () => {
    await mountGallery()
    expect(wrapper.find('.home-gallery__title').text()).toBe('Coś więcej niż dom. . .')
  })

  it('has #prev-img-btn and #next-img-btn buttons', async () => {
    await mountGallery()
    expect(wrapper.find('#prev-img-btn').exists()).toBe(true)
    expect(wrapper.find('#next-img-btn').exists()).toBe(true)
  })

  it('clicking #next-img-btn -> advance("left"): shows second slide with slide-in-right, first slide gets slide-out-left', async () => {
    await mountGallery()
    // After mount, one FakeImage was created by onMounted preload(slides[1]).
    const countBeforeClick = fakeImages.length // should be 1

    await wrapper.find('#next-img-btn').trigger('click')
    // advance() calls preload which creates another FakeImage (for slides[1]).
    // We want the newest one.
    expect(fakeImages.length).toBeGreaterThan(countBeforeClick)

    const latestFake = fakeImages[fakeImages.length - 1]
    // Fire onload so the preload promise resolves.
    latestFake.onload()
    await flushPromises()

    const slides = wrapper.findAll('.slide')
    expect(slides.length).toBe(2)

    // First slide (currentSlide) should be sliding out to the left.
    expect(slides[0].classes()).toContain('slide-out-left')
    // Second slide (nextSlide) slides in from the right.
    expect(slides[1].classes()).toContain('slide-in-right')
  })

  it('triggering animationend on the incoming slide collapses back to one slide and advances currentSlide', async () => {
    await mountGallery()
    const countBeforeClick = fakeImages.length

    await wrapper.find('#next-img-btn').trigger('click')
    expect(fakeImages.length).toBeGreaterThan(countBeforeClick)

    const latestFake = fakeImages[fakeImages.length - 1]
    latestFake.onload()
    await flushPromises()

    // Two slides visible now.
    let slides = wrapper.findAll('.slide')
    expect(slides.length).toBe(2)

    // Fire animationend on the incoming (second) slide.
    await slides[1].trigger('animationend')

    // handleAnimationEnd: nextSlide -> null, isAnimating -> false.
    slides = wrapper.findAll('.slide')
    expect(slides.length).toBe(1)

    // currentSlide is now slides[1] from the component (livingroom05-best).
    // PictureImg renders an <img> whose alt == slides[1].alt.
    const img = wrapper.find('img')
    expect(img.attributes('alt')).toBe('Living room')
  })

  it('clicking #prev-img-btn -> advance("right"): incoming slide gets slide-in-left, current gets slide-out-right', async () => {
    await mountGallery()
    const countBeforeClick = fakeImages.length

    await wrapper.find('#prev-img-btn').trigger('click')
    expect(fakeImages.length).toBeGreaterThan(countBeforeClick)

    const latestFake = fakeImages[fakeImages.length - 1]
    latestFake.onload()
    await flushPromises()

    const slides = wrapper.findAll('.slide')
    expect(slides.length).toBe(2)
    expect(slides[0].classes()).toContain('slide-out-right')
    expect(slides[1].classes()).toContain('slide-in-left')
  })

  it('guard: second call to advance() while isLoading/isAnimating is in progress does NOT add extra slides', async () => {
    await mountGallery()

    // Click next-img twice in quick succession without resolving the preload.
    await wrapper.find('#next-img-btn').trigger('click')
    await wrapper.find('#next-img-btn').trigger('click') // should be ignored

    // Resolve the first (and only) preload.
    const latestFake = fakeImages[fakeImages.length - 1]
    latestFake.onload()
    await flushPromises()

    // Still only two slides — the second click was swallowed.
    expect(wrapper.findAll('.slide').length).toBe(2)
  })
})
