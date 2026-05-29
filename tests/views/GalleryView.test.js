import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'

import GalleryView from '@/views/GalleryView.vue'

// Hold every fake-Image instance so tests can fire onload manually
const fakeImages = []
class FakeImage {
  constructor() { fakeImages.push(this) }
  set src(v) { this._src = v }
  get src() { return this._src }
}

const mountGallery = async () => {
  const wrapper = mount(GalleryView, { attachTo: document.body })
  await wrapper.vm.$nextTick()
  return wrapper
}

describe('GalleryView setViewerImage', () => {
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

  it('shows the bundled light image first and swaps to /gallery-hd/<name>.avif on HD onload', async () => {
    wrapper = await mountGallery()

    // Open the lightbox on the first tile.
    await wrapper.findAll('.gallery-item')[0].trigger('click')
    const img = wrapper.find('#img-big')
    const light = img.attributes('src')
    expect(light).toBeTruthy()
    // Light source is bundled — Vite hashes/transforms it, so it won't
    // start with /gallery-hd/. The HD URL must.
    expect(light.startsWith('/gallery-hd/')).toBe(false)

    expect(fakeImages.length).toBe(1)
    expect(fakeImages[0].src).toBe('/gallery-hd/NZF_4375.avif')

    fakeImages[0].onload()
    await flushPromises()
    expect(wrapper.find('#img-big').attributes('src')).toBe('/gallery-hd/NZF_4375.avif')
  })

  it('does NOT overwrite viewerSrc if the user already moved on by the time HD loads', async () => {
    wrapper = await mountGallery()

    await wrapper.findAll('.gallery-item')[0].trigger('click')
    expect(fakeImages.length).toBe(1)
    const staleHd = fakeImages[0]

    // User clicks next — currentViewerIndex moves to 1
    await wrapper.find('#next-img-btn').trigger('click')
    expect(fakeImages.length).toBe(2)
    const freshHd = fakeImages[1]

    // The stale HD finally loads — it should be ignored
    staleHd.onload()
    await flushPromises()
    expect(wrapper.find('#img-big').attributes('src')).not.toBe('/gallery-hd/NZF_4375.avif')

    // The fresh HD loads — it should swap in
    freshHd.onload()
    await flushPromises()
    expect(wrapper.find('#img-big').attributes('src')).toBe(freshHd.src)
  })

  it('wraps around with prev from index 0', async () => {
    wrapper = await mountGallery()
    await wrapper.findAll('.gallery-item')[0].trigger('click')
    fakeImages[0].onload?.()
    await wrapper.find('#prev-img-btn').trigger('click')
    // 13 images total, so prev from 0 lands on index 12
    expect(fakeImages.at(-1).src).toBe('/gallery-hd/NZF_4359.avif')
  })
})
