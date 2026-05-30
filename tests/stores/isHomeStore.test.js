import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { usePageStore } from '@/stores/isHomeStore'

describe('usePageStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('defaults isHome to true', () => {
    const store = usePageStore()
    expect(store.isHome).toBe(true)
  })

  it('setHome(false) sets isHome to false', () => {
    const store = usePageStore()
    store.setHome(false)
    expect(store.isHome).toBe(false)
  })

  it('setHome(true) sets isHome to true after being false', () => {
    const store = usePageStore()
    store.setHome(false)
    store.setHome(true)
    expect(store.isHome).toBe(true)
  })
})
