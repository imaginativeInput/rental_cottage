import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'

import Reservation from '@/components/Reservation.vue'
import { useGuestStore } from '@/stores/guestStore'

const openDropdown = async (w) => {
  await w.find('#guestsButton').trigger('mouseenter')
}

describe('Reservation (hero) selectGuests', () => {
  let wrapper

  beforeEach(() => {
    setActivePinia(createPinia())
  })

  afterEach(() => {
    wrapper?.unmount()
    vi.restoreAllMocks()
  })

  it('renders all 13 selectable entries', async () => {
    wrapper = mount(Reservation, { attachTo: document.body })
    await openDropdown(wrapper)
    expect(wrapper.findAll('.guest-li')).toHaveLength(13)
  })

  it('updates peopleCount when a value is picked', async () => {
    wrapper = mount(Reservation, { attachTo: document.body })
    const store = useGuestStore()
    await openDropdown(wrapper)
    await wrapper.findAll('.guest-li')[6].trigger('click') // value=7
    expect(store.peopleCount).toBe(7)
  })

  it('resets childrenCount to 0 when new total would exceed 13', async () => {
    wrapper = mount(Reservation, { attachTo: document.body })
    const store = useGuestStore()
    store.peopleCount = 2
    store.childrenCount = 8
    await wrapper.vm.$nextTick()
    await openDropdown(wrapper)
    await wrapper.findAll('.guest-li')[12].trigger('click') // value=13
    expect(store.peopleCount).toBe(13)
    expect(store.childrenCount).toBe(0)
  })

  it('keeps childrenCount intact when new total still fits', async () => {
    wrapper = mount(Reservation, { attachTo: document.body })
    const store = useGuestStore()
    store.peopleCount = 2
    store.childrenCount = 3
    await wrapper.vm.$nextTick()
    await openDropdown(wrapper)
    await wrapper.findAll('.guest-li')[4].trigger('click') // value=5; 5+3=8 ≤ 13
    expect(store.peopleCount).toBe(5)
    expect(store.childrenCount).toBe(3)
  })

  it('"Sprawdź dostępność" scrolls to #reservation-section', async () => {
    document.body.innerHTML = '<div id="reservation-section"></div>'
    const scroll = vi.fn()
    Element.prototype.scrollIntoView = scroll
    wrapper = mount(Reservation, { attachTo: document.body })
    await wrapper.find('.rezerwacja__btn').trigger('click')
    expect(scroll).toHaveBeenCalledWith({ behavior: 'smooth', block: 'start' })
  })
})
