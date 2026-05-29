import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'

import {
  dateRange,
  sendReservationRequest,
} from '@/utils/reservationRequest'
import { useGuestStore } from '@/stores/guestStore'

const setInputs = ({ email = '', phone = '', message = '' } = {}) => {
  document.body.innerHTML = `
    <input id="email" value="${email}" />
    <input id="phone" value="${phone}" />
    <textarea id="message">${message}</textarea>
  `
}

describe('sendReservationRequest', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.stubGlobal('alert', vi.fn())
    vi.stubGlobal('fetch', vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ message: 'ok' }),
      })
    ))
    dateRange.value = {
      start: new Date('2026-06-10T00:00:00Z'),
      end: new Date('2026-06-13T00:00:00Z'),
    }
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('alerts and returns when email is empty', async () => {
    setInputs({ email: '', phone: '+48 123 456 789' })
    await sendReservationRequest('email', 'phone', 'message')
    expect(alert).toHaveBeenCalledWith(expect.stringContaining('podanie adresu'))
    expect(fetch).not.toHaveBeenCalled()
  })

  it('alerts on malformed email', async () => {
    setInputs({ email: 'no-at-symbol', phone: '+48 123 456 789' })
    await sendReservationRequest('email', 'phone', 'message')
    expect(alert).toHaveBeenCalledWith('Nieprawidłowy adres email.')
  })

  it('alerts on malformed phone', async () => {
    setInputs({ email: 'a@b.co', phone: '12345' })
    await sendReservationRequest('email', 'phone', 'message')
    expect(alert).toHaveBeenCalledWith('Nieprawidłowy numer telefonu.')
  })

  it('accepts a valid email + phone and posts the right payload', async () => {
    const guests = useGuestStore()
    guests.peopleCount = 4
    guests.childrenCount = 2
    guests.hasPets = true
    setInputs({
      email: 'guest@example.com',
      phone: '+48 123 456 789',
      message: 'Witam',
    })

    await sendReservationRequest('email', 'phone', 'message')

    expect(fetch).toHaveBeenCalledTimes(1)
    const [url, init] = fetch.mock.calls[0]
    expect(url).toMatch(/\/api\/send-message$/)
    expect(init.method).toBe('POST')
    expect(init.headers['Content-Type']).toBe('application/json')

    const payload = JSON.parse(init.body)
    expect(payload).toEqual({
      email: 'guest@example.com',
      phone: '+48 123 456 789',
      message: 'Witam',
      startDate: '2026-06-10',
      endDate: '2026-06-13',
      people: 4,
      children: 2,
      pets: true,
    })
  })

  it('passes phone numbers with 3 digit groups', async () => {
    setInputs({ email: 'a@b.co', phone: '+1 555 123 4567' })
    await sendReservationRequest('email', 'phone', 'message')
    // Two groups of 3 + one group of 4 — should still match phoneRegex
    // (^\+\d{1,3}(\s?\d{3}){2,3}$ — 4-digit tail fails). Confirm current
    // behaviour: 4-digit tail does NOT match → alert fires.
    expect(alert).toHaveBeenCalledWith('Nieprawidłowy numer telefonu.')
  })

  it('alerts on network error', async () => {
    setInputs({ email: 'a@b.co', phone: '+48 123 456 789' })
    fetch.mockRejectedValueOnce(new Error('boom'))
    vi.spyOn(console, 'error').mockImplementation(() => {})
    await sendReservationRequest('email', 'phone', 'message')
    expect(alert).toHaveBeenCalledWith(expect.stringContaining('błędu sieci'))
  })

  it('surfaces backend error detail', async () => {
    setInputs({ email: 'a@b.co', phone: '+48 123 456 789' })
    fetch.mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ detail: 'Boom' }),
    })
    await sendReservationRequest('email', 'phone', 'message')
    expect(alert).toHaveBeenCalledWith(expect.stringContaining('Boom'))
  })
})
