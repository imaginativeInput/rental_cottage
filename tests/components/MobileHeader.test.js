import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'

import MobileHeader from '@/components/MobileHeader.vue'

const defaultProps = { isOpen: false, animateClose: false }

const mountMobileHeader = (props = {}, extra = {}) =>
  mount(MobileHeader, {
    props: { ...defaultProps, ...props },
    global: {
      stubs: { LanguagePicker: true },
      ...extra.global,
    },
    ...extra,
  })

describe('MobileHeader', () => {
  let wrapper
  let originalLocation

  beforeEach(() => {
    setActivePinia(createPinia())
    originalLocation = window.location
    delete window.location
    window.location = { ...originalLocation, href: '' }
  })

  afterEach(() => {
    wrapper?.unmount()
    window.location = originalLocation
    vi.restoreAllMocks()
  })

  // ── animationClass ──────────────────────────────────────────────────────────

  describe('animationClass computed', () => {
    it('adds slide-in when isOpen=true, animateClose=false', () => {
      wrapper = mountMobileHeader({ isOpen: true, animateClose: false })
      expect(wrapper.find('.mobile-nav').classes()).toContain('slide-in')
    })

    it('adds slide-out when animateClose=true (regardless of isOpen)', () => {
      wrapper = mountMobileHeader({ isOpen: false, animateClose: true })
      expect(wrapper.find('.mobile-nav').classes()).toContain('slide-out')
    })

    it('has no slide class when isOpen=false, animateClose=false', () => {
      wrapper = mountMobileHeader({ isOpen: false, animateClose: false })
      const classes = wrapper.find('.mobile-nav').classes()
      expect(classes).not.toContain('slide-in')
      expect(classes).not.toContain('slide-out')
    })

    it('slide-out takes priority: animateClose=true, isOpen=true -> slide-out', () => {
      wrapper = mountMobileHeader({ isOpen: true, animateClose: true })
      const classes = wrapper.find('.mobile-nav').classes()
      expect(classes).toContain('slide-out')
      expect(classes).not.toContain('slide-in')
    })
  })

  // ── anchor hrefs ────────────────────────────────────────────────────────────

  describe('navigation anchors', () => {
    it('renders exactly four anchors inside <ul>', () => {
      wrapper = mountMobileHeader()
      const anchors = wrapper.findAll('ul a')
      expect(anchors).toHaveLength(4)
    })

    it('first anchor href is "/"', () => {
      wrapper = mountMobileHeader()
      const anchors = wrapper.findAll('ul a')
      expect(anchors[0].attributes('href')).toBe('/')
    })

    it('second anchor href is "/#o-nas"', () => {
      wrapper = mountMobileHeader()
      const anchors = wrapper.findAll('ul a')
      expect(anchors[1].attributes('href')).toBe('/#o-nas')
    })

    it('third anchor href is "/galeria"', () => {
      wrapper = mountMobileHeader()
      const anchors = wrapper.findAll('ul a')
      expect(anchors[2].attributes('href')).toBe('/galeria')
    })

    it('fourth anchor href is "#kontakt"', () => {
      wrapper = mountMobileHeader()
      const anchors = wrapper.findAll('ul a')
      expect(anchors[3].attributes('href')).toBe('#kontakt')
    })
  })

  // ── anchor clicks emit 'close' ──────────────────────────────────────────────

  describe('anchor click emits close', () => {
    it('first anchor click emits close', async () => {
      wrapper = mountMobileHeader()
      await wrapper.findAll('ul a')[0].trigger('click')
      expect(wrapper.emitted('close')).toBeTruthy()
    })

    it('second anchor click emits close', async () => {
      wrapper = mountMobileHeader()
      await wrapper.findAll('ul a')[1].trigger('click')
      expect(wrapper.emitted('close')).toBeTruthy()
    })

    it('third anchor click emits close', async () => {
      wrapper = mountMobileHeader()
      await wrapper.findAll('ul a')[2].trigger('click')
      expect(wrapper.emitted('close')).toBeTruthy()
    })

    it('fourth anchor click emits close', async () => {
      wrapper = mountMobileHeader()
      await wrapper.findAll('ul a')[3].trigger('click')
      expect(wrapper.emitted('close')).toBeTruthy()
    })
  })

  // ── phone button ────────────────────────────────────────────────────────────

  describe('#phoneCallButton', () => {
    it('sets window.location.href to tel: number', async () => {
      wrapper = mountMobileHeader()
      await wrapper.find('#phoneCallButton').trigger('click')
      expect(window.location.href).toBe('tel:+48692434000')
    })

    it('emits close after click', async () => {
      wrapper = mountMobileHeader()
      await wrapper.find('#phoneCallButton').trigger('click')
      expect(wrapper.emitted('close')).toBeTruthy()
    })
  })

  // ── maps button ─────────────────────────────────────────────────────────────

  describe('#mapsButton', () => {
    it('calls window.open when clicked', async () => {
      const openSpy = vi.fn()
      vi.stubGlobal('open', openSpy)
      wrapper = mountMobileHeader()
      await wrapper.find('#mapsButton').trigger('click')
      expect(openSpy).toHaveBeenCalledOnce()
      expect(openSpy.mock.calls[0][0]).toContain('google.com/maps')
    })

    it('emits close when clicked', async () => {
      vi.stubGlobal('open', vi.fn())
      wrapper = mountMobileHeader()
      await wrapper.find('#mapsButton').trigger('click')
      expect(wrapper.emitted('close')).toBeTruthy()
    })
  })

  // ── reservation button ──────────────────────────────────────────────────────

  describe('#reservationButton', () => {
    it('emits close when clicked', async () => {
      wrapper = mountMobileHeader()
      await wrapper.find('#reservationButton').trigger('click')
      expect(wrapper.emitted('close')).toBeTruthy()
    })
  })

  // ── animationend event ──────────────────────────────────────────────────────

  describe('animationend event', () => {
    it('triggering animationend on root emits animationEnd', async () => {
      wrapper = mountMobileHeader({ isOpen: true, animateClose: false })
      await wrapper.find('.mobile-nav').trigger('animationend')
      expect(wrapper.emitted('animationEnd')).toBeTruthy()
    })
  })

  // ── structure ───────────────────────────────────────────────────────────────

  describe('structure', () => {
    it('renders three buttons in .button-grid', () => {
      wrapper = mountMobileHeader()
      const buttons = wrapper.findAll('.button-grid button')
      expect(buttons).toHaveLength(3)
    })

    it('root element has id=mobile-nav and class=mobile-nav', () => {
      wrapper = mountMobileHeader()
      const root = wrapper.find('#mobile-nav')
      expect(root.exists()).toBe(true)
      expect(root.classes()).toContain('mobile-nav')
    })

    it('renders LanguagePicker (stub)', () => {
      wrapper = mountMobileHeader()
      expect(wrapper.findComponent({ name: 'LanguagePicker' }).exists()).toBe(true)
    })
  })
})
