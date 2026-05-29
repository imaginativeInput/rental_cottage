import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'

import ReservationSection from '@/components/ReservationSection.vue'
import { useGuestStore } from '@/stores/guestStore'
import * as req from '@/utils/reservationRequest'

const buildWrapper = () =>
  mount(ReservationSection, {
    attachTo: document.body,
  })

describe('ReservationSection', () => {
  let wrapper

  beforeEach(() => {
    setActivePinia(createPinia())
    vi.spyOn(req, 'sendReservationRequest').mockResolvedValue(undefined)
    req.dateRange.value = { start: null, end: null }
  })

  afterEach(() => {
    wrapper?.unmount()
    vi.restoreAllMocks()
  })

  it('renders Dorośli starting at 2, Dzieci at 0', () => {
    wrapper = buildWrapper()
    const values = wrapper.findAll('.counter__value').map((n) => n.text())
    expect(values).toEqual(['2', '0'])
  })

  describe('adults counter', () => {
    it('does not go below 1', async () => {
      wrapper = buildWrapper()
      const store = useGuestStore()
      store.peopleCount = 1
      await wrapper.vm.$nextTick()
      const minus = wrapper.find('[aria-label="Mniej dorosłych"]')
      expect(minus.element.disabled).toBe(true)
      await minus.trigger('click')
      expect(store.peopleCount).toBe(1)
    })

    it('does not go above MAX_GUESTS (13) when alone', async () => {
      wrapper = buildWrapper()
      const store = useGuestStore()
      store.peopleCount = 13
      store.childrenCount = 0
      await wrapper.vm.$nextTick()
      const plus = wrapper.find('[aria-label="Więcej dorosłych"]')
      expect(plus.element.disabled).toBe(true)
      await plus.trigger('click')
      expect(store.peopleCount).toBe(13)
    })

    it('increments normally', async () => {
      wrapper = buildWrapper()
      const store = useGuestStore()
      store.peopleCount = 3
      await wrapper.vm.$nextTick()
      await wrapper.find('[aria-label="Więcej dorosłych"]').trigger('click')
      expect(store.peopleCount).toBe(4)
    })
  })

  describe('children counter', () => {
    it('does not go below 0', async () => {
      wrapper = buildWrapper()
      const store = useGuestStore()
      const minus = wrapper.find('[aria-label="Mniej dzieci"]')
      expect(minus.element.disabled).toBe(true)
      await minus.trigger('click')
      expect(store.childrenCount).toBe(0)
    })

    it('increments normally', async () => {
      wrapper = buildWrapper()
      const store = useGuestStore()
      await wrapper.find('[aria-label="Więcej dzieci"]').trigger('click')
      expect(store.childrenCount).toBe(1)
    })
  })

  describe('combined cap', () => {
    it('disables both + buttons at total = 13', async () => {
      wrapper = buildWrapper()
      const store = useGuestStore()
      store.peopleCount = 10
      store.childrenCount = 3
      await wrapper.vm.$nextTick()
      expect(wrapper.find('[aria-label="Więcej dorosłych"]').element.disabled).toBe(true)
      expect(wrapper.find('[aria-label="Więcej dzieci"]').element.disabled).toBe(true)
      expect(wrapper.find('.capacity-hint').exists()).toBe(true)
      expect(wrapper.text()).toContain('Maksymalna liczba gości to 13.')
    })

    it('clicking + at capacity is a no-op for both', async () => {
      wrapper = buildWrapper()
      const store = useGuestStore()
      store.peopleCount = 7
      store.childrenCount = 6
      await wrapper.vm.$nextTick()
      await wrapper.find('[aria-label="Więcej dorosłych"]').trigger('click')
      await wrapper.find('[aria-label="Więcej dzieci"]').trigger('click')
      expect(store.peopleCount).toBe(7)
      expect(store.childrenCount).toBe(6)
    })

    it('hides the hint below capacity', async () => {
      wrapper = buildWrapper()
      const store = useGuestStore()
      store.peopleCount = 5
      store.childrenCount = 4
      await wrapper.vm.$nextTick()
      expect(wrapper.find('.capacity-hint').exists()).toBe(false)
    })
  })

  describe('pets toggle', () => {
    it('reflects hasPets on the store when clicked', async () => {
      wrapper = buildWrapper()
      const store = useGuestStore()
      expect(store.hasPets).toBe(false)
      await wrapper.find('.pets-toggle__input').setValue(true)
      expect(store.hasPets).toBe(true)
    })

    it('toggles the is-on class', async () => {
      wrapper = buildWrapper()
      const store = useGuestStore()
      store.hasPets = true
      await wrapper.vm.$nextTick()
      expect(wrapper.find('.pets-toggle').classes()).toContain('is-on')
    })
  })

  describe('summary chip', () => {
    it('is hidden when there is no valid date range', () => {
      wrapper = buildWrapper()
      expect(wrapper.find('.summary').exists()).toBe(false)
    })

    it('renders nights/adults/children/pets with Polish plurals', async () => {
      req.dateRange.value = {
        start: new Date('2026-06-10T00:00:00Z'),
        end: new Date('2026-06-13T00:00:00Z'),
      }
      wrapper = buildWrapper()
      const store = useGuestStore()
      store.peopleCount = 1
      store.childrenCount = 1
      store.hasPets = true
      await wrapper.vm.$nextTick()

      const summary = wrapper.find('.summary')
      expect(summary.exists()).toBe(true)
      const text = summary.text()
      expect(text).toMatch(/3\s+noce/)
      expect(text).toMatch(/1\s+dorosły/)
      expect(text).toMatch(/1\s+dziecko/)
      expect(text).toContain('Zwierzak')
    })

    it.each([
      [1, 'noc'],
      [2, 'noce'],
      [4, 'noce'],
      [5, 'nocy'],
      [10, 'nocy'],
    ])('nights label: %i → "%s"', async (nights, label) => {
      const start = new Date('2026-06-10T00:00:00Z')
      const end = new Date(start.getTime() + nights * 86400000)
      req.dateRange.value = { start, end }
      wrapper = buildWrapper()
      await wrapper.vm.$nextTick()
      const text = wrapper.find('.summary').text()
      expect(text).toMatch(new RegExp(`${nights}\\s+${label}\\b`))
    })

    it.each([
      [1, 'dorosły'],
      [2, 'dorosłych'],
      [5, 'dorosłych'],
    ])('adults label: %i → "%s"', async (n, label) => {
      req.dateRange.value = {
        start: new Date('2026-06-10T00:00:00Z'),
        end: new Date('2026-06-11T00:00:00Z'),
      }
      wrapper = buildWrapper()
      const store = useGuestStore()
      store.peopleCount = n
      await wrapper.vm.$nextTick()
      expect(wrapper.find('.summary').text()).toMatch(new RegExp(`${n}\\s+${label}\\b`))
    })

    it.each([
      [1, 'dziecko'],
      [2, 'dzieci'],
      [10, 'dzieci'],
    ])('children label: %i → "%s"', async (n, label) => {
      req.dateRange.value = {
        start: new Date('2026-06-10T00:00:00Z'),
        end: new Date('2026-06-11T00:00:00Z'),
      }
      wrapper = buildWrapper()
      const store = useGuestStore()
      store.childrenCount = n
      await wrapper.vm.$nextTick()
      expect(wrapper.find('.summary').text()).toMatch(new RegExp(`${n}\\s+${label}\\b`))
    })

    it('omits the children chip when childrenCount = 0', async () => {
      req.dateRange.value = {
        start: new Date('2026-06-10T00:00:00Z'),
        end: new Date('2026-06-11T00:00:00Z'),
      }
      wrapper = buildWrapper()
      await wrapper.vm.$nextTick()
      const text = wrapper.find('.summary').text()
      expect(text).not.toMatch(/dziecko|dzieci/)
    })

    it('omits the pets chip when hasPets = false', async () => {
      req.dateRange.value = {
        start: new Date('2026-06-10T00:00:00Z'),
        end: new Date('2026-06-11T00:00:00Z'),
      }
      wrapper = buildWrapper()
      await wrapper.vm.$nextTick()
      expect(wrapper.find('.summary').text()).not.toContain('Zwierzak')
    })
  })

  describe('handleSubmit', () => {
    const fillInputs = async (w, { email = '', phone = '' }) => {
      await w.find('#email').setValue(email)
      await w.find('#phone').setValue(phone)
    }

    it('does not flip isSubmitting when client validation fails (no email)', async () => {
      wrapper = buildWrapper()
      await fillInputs(wrapper, { email: '', phone: '+48 123 456 789' })
      const button = wrapper.find('button[type="submit"]')
      await wrapper.find('form').trigger('submit.prevent')
      await flushPromises()
      expect(button.element.disabled).toBe(false)
      expect(req.sendReservationRequest).toHaveBeenCalledOnce()
    })

    it('flips isSubmitting around a valid network call', async () => {
      let resolveCall
      req.sendReservationRequest.mockImplementation(
        () => new Promise((r) => { resolveCall = r })
      )
      wrapper = buildWrapper()
      await fillInputs(wrapper, {
        email: 'guest@example.com',
        phone: '+48 123 456 789',
      })
      wrapper.find('form').trigger('submit.prevent')
      await flushPromises()
      expect(wrapper.find('button[type="submit"]').element.disabled).toBe(true)
      expect(wrapper.text()).toContain('Wysyłanie')
      resolveCall()
      await flushPromises()
      expect(wrapper.find('button[type="submit"]').element.disabled).toBe(false)
    })

    it('guards against re-entry while isSubmitting', async () => {
      let resolveCall
      req.sendReservationRequest.mockImplementation(
        () => new Promise((r) => { resolveCall = r })
      )
      wrapper = buildWrapper()
      await fillInputs(wrapper, {
        email: 'guest@example.com',
        phone: '+48 123 456 789',
      })
      wrapper.find('form').trigger('submit.prevent')
      await flushPromises()
      wrapper.find('form').trigger('submit.prevent')
      await flushPromises()
      expect(req.sendReservationRequest).toHaveBeenCalledTimes(1)
      resolveCall()
    })
  })
})
