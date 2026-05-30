import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useMobileHeaderStore } from '@/stores/mobileHeaderStore'

describe('useMobileHeaderStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('initialises with isMobileNav=false and animateClose=false', () => {
    const store = useMobileHeaderStore()
    expect(store.isMobileNav).toBe(false)
    expect(store.animateClose).toBe(false)
  })

  describe('openMobileNav()', () => {
    it('sets isMobileNav to true', () => {
      const store = useMobileHeaderStore()
      store.openMobileNav()
      expect(store.isMobileNav).toBe(true)
    })

    it('resets animateClose to false', () => {
      const store = useMobileHeaderStore()
      // put animateClose in a truthy state first
      store.closeMobileNav()
      expect(store.animateClose).toBe(true)
      store.openMobileNav()
      expect(store.animateClose).toBe(false)
    })
  })

  describe('closeMobileNav()', () => {
    it('sets animateClose to true', () => {
      const store = useMobileHeaderStore()
      store.openMobileNav()
      store.closeMobileNav()
      expect(store.animateClose).toBe(true)
    })

    it('does NOT immediately set isMobileNav to false', () => {
      const store = useMobileHeaderStore()
      store.openMobileNav()
      store.closeMobileNav()
      expect(store.isMobileNav).toBe(true)
    })
  })

  describe('handleAnimationEnd()', () => {
    it('clears isMobileNav and animateClose when animateClose is true', () => {
      const store = useMobileHeaderStore()
      store.openMobileNav()   // isMobileNav=true, animateClose=false
      store.closeMobileNav()  // animateClose=true
      store.handleAnimationEnd()
      expect(store.isMobileNav).toBe(false)
      expect(store.animateClose).toBe(false)
    })

    it('is a no-op when animateClose is false', () => {
      const store = useMobileHeaderStore()
      store.openMobileNav()  // isMobileNav=true, animateClose=false
      store.handleAnimationEnd()
      // nothing should change
      expect(store.isMobileNav).toBe(true)
      expect(store.animateClose).toBe(false)
    })

    it('is a no-op on a fresh store (both refs already false)', () => {
      const store = useMobileHeaderStore()
      store.handleAnimationEnd()
      expect(store.isMobileNav).toBe(false)
      expect(store.animateClose).toBe(false)
    })
  })
})
