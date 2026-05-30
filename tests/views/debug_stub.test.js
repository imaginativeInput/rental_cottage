import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import HomeView from '@/views/HomeView.vue'

describe('debug', () => {
  let wrapper
  beforeEach(() => { setActivePinia(createPinia()) })
  afterEach(() => { wrapper?.unmount() })

  it('prints html', async () => {
    wrapper = mount(HomeView, { global: { stubs: { Welcome: true, Reservation: true, About: true, Gallery: true, Attractions: true, ReservationSection: true } } })
    await flushPromises()
    console.log(wrapper.html())
    expect(true).toBe(true)
  })
})
