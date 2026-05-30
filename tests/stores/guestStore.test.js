import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useGuestStore } from '@/stores/guestStore'

describe('guestStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('has default peopleCount of 2', () => {
    const store = useGuestStore()
    expect(store.peopleCount).toBe(2)
  })

  it('has default childrenCount of 0', () => {
    const store = useGuestStore()
    expect(store.childrenCount).toBe(0)
  })

  it('has default hasPets of false', () => {
    const store = useGuestStore()
    expect(store.hasPets).toBe(false)
  })

  it('setPeopleCount updates peopleCount', () => {
    const store = useGuestStore()
    store.setPeopleCount(5)
    expect(store.peopleCount).toBe(5)
  })

  it('setPeopleCount replaces the previous value', () => {
    const store = useGuestStore()
    store.setPeopleCount(3)
    store.setPeopleCount(7)
    expect(store.peopleCount).toBe(7)
  })

  it('childrenCount can be mutated directly', () => {
    const store = useGuestStore()
    store.childrenCount = 3
    expect(store.childrenCount).toBe(3)
  })

  it('hasPets can be mutated directly', () => {
    const store = useGuestStore()
    store.hasPets = true
    expect(store.hasPets).toBe(true)
  })

  it('each store instance from a fresh pinia starts with defaults', () => {
    const store1 = useGuestStore()
    store1.setPeopleCount(9)
    store1.childrenCount = 4

    // New pinia — should reset to defaults
    setActivePinia(createPinia())
    const store2 = useGuestStore()
    expect(store2.peopleCount).toBe(2)
    expect(store2.childrenCount).toBe(0)
    expect(store2.hasPets).toBe(false)
  })

  it('exposes only the four expected keys (no hidden reset action)', () => {
    const store = useGuestStore()
    expect(typeof store.setPeopleCount).toBe('function')
    // No reset action exists
    expect(store.reset).toBeUndefined()
  })
})
