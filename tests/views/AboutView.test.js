import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'

import AboutView from '@/views/AboutView.vue'

// Helper to set window.scrollY via Object.defineProperty (configurable)
function setScrollY(value) {
  Object.defineProperty(window, 'scrollY', { configurable: true, value })
}

describe('AboutView (StickyNavbar scaffold)', () => {
  let wrapper

  afterEach(() => {
    wrapper?.unmount()
    vi.restoreAllMocks()
    // Restore scrollY to 0 so tests are independent
    setScrollY(0)
  })

  describe('initial render', () => {
    beforeEach(() => {
      setScrollY(0)
      wrapper = mount(AboutView)
    })

    it('renders a nav element with class "navbar"', () => {
      expect(wrapper.find('nav.navbar').exists()).toBe(true)
    })

    it('does NOT have "hidden-nav" class on nav initially', () => {
      expect(wrapper.find('nav.navbar').classes()).not.toContain('hidden-nav')
    })

    it('renders an h1.logo with text "My Website"', () => {
      const logo = wrapper.find('h1.logo')
      expect(logo.exists()).toBe(true)
      expect(logo.text()).toBe('My Website')
    })

    it('renders exactly 4 anchor elements inside ul.nav-links', () => {
      const links = wrapper.findAll('ul.nav-links li a')
      expect(links).toHaveLength(4)
    })

    it('nav-links contain Home, About, Services, Contact', () => {
      const texts = wrapper.findAll('ul.nav-links li a').map((a) => a.text())
      expect(texts).toEqual(['Home', 'About', 'Services', 'Contact'])
    })

    it('renders a .content div', () => {
      expect(wrapper.find('div.content').exists()).toBe(true)
    })
  })

  describe('data defaults', () => {
    it('lastScrollY starts at 0', () => {
      wrapper = mount(AboutView)
      expect(wrapper.vm.lastScrollY).toBe(0)
    })

    it('hideNavbar starts as false', () => {
      wrapper = mount(AboutView)
      expect(wrapper.vm.hideNavbar).toBe(false)
    })
  })

  describe('handleScroll — scrolling DOWN hides navbar', () => {
    it('adds "hidden-nav" when scrollY increases', async () => {
      setScrollY(0)
      wrapper = mount(AboutView)

      setScrollY(100)
      wrapper.vm.handleScroll()
      await nextTick()

      expect(wrapper.find('nav.navbar').classes()).toContain('hidden-nav')
    })

    it('sets lastScrollY to new scroll position after scroll down', async () => {
      setScrollY(0)
      wrapper = mount(AboutView)

      setScrollY(100)
      wrapper.vm.handleScroll()
      await nextTick()

      expect(wrapper.vm.lastScrollY).toBe(100)
    })

    it('sets hideNavbar to true when scrollY increases', async () => {
      setScrollY(0)
      wrapper = mount(AboutView)

      setScrollY(200)
      wrapper.vm.handleScroll()
      await nextTick()

      expect(wrapper.vm.hideNavbar).toBe(true)
    })
  })

  describe('handleScroll — scrolling UP shows navbar', () => {
    it('removes "hidden-nav" when scrollY decreases after going down', async () => {
      setScrollY(0)
      wrapper = mount(AboutView)

      // First scroll down
      setScrollY(100)
      wrapper.vm.handleScroll()
      await nextTick()
      expect(wrapper.find('nav.navbar').classes()).toContain('hidden-nav')

      // Then scroll up
      setScrollY(50)
      wrapper.vm.handleScroll()
      await nextTick()
      expect(wrapper.find('nav.navbar').classes()).not.toContain('hidden-nav')
    })

    it('sets hideNavbar to false when scrollY decreases', async () => {
      setScrollY(0)
      wrapper = mount(AboutView)

      setScrollY(100)
      wrapper.vm.handleScroll()
      await nextTick()

      setScrollY(50)
      wrapper.vm.handleScroll()
      await nextTick()

      expect(wrapper.vm.hideNavbar).toBe(false)
    })

    it('updates lastScrollY to the new (lower) position', async () => {
      setScrollY(0)
      wrapper = mount(AboutView)

      setScrollY(100)
      wrapper.vm.handleScroll()
      await nextTick()

      setScrollY(50)
      wrapper.vm.handleScroll()
      await nextTick()

      expect(wrapper.vm.lastScrollY).toBe(50)
    })
  })

  describe('handleScroll via real scroll event', () => {
    it('responds to a dispatched window scroll event', async () => {
      setScrollY(0)
      wrapper = mount(AboutView)

      setScrollY(150)
      window.dispatchEvent(new Event('scroll'))
      await nextTick()

      expect(wrapper.vm.hideNavbar).toBe(true)
      expect(wrapper.find('nav.navbar').classes()).toContain('hidden-nav')
    })
  })

  describe('handleScroll — same scrollY (no change)', () => {
    it('sets hideNavbar to false when scrollY equals lastScrollY (not strictly greater)', async () => {
      setScrollY(100)
      wrapper = mount(AboutView)
      // prime lastScrollY to 100 by scrolling down first from 0
      // but since we set scrollY=100 before mount, lastScrollY starts at 0
      // so first handleScroll from 0 -> 100 = scroll down => hideNavbar=true, lastScrollY=100
      wrapper.vm.handleScroll()
      await nextTick()
      expect(wrapper.vm.hideNavbar).toBe(true)
      expect(wrapper.vm.lastScrollY).toBe(100)

      // Now call again with same scrollY=100: 100 > 100 is false => hideNavbar=false
      wrapper.vm.handleScroll()
      await nextTick()
      expect(wrapper.vm.hideNavbar).toBe(false)
    })
  })
})
