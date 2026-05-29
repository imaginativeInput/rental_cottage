import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'

import LanguagePicker from '@/components/LanguagePicker.vue'

const clearCookies = () => {
  document.cookie
    .split(';')
    .map((s) => s.trim().split('=')[0])
    .filter(Boolean)
    .forEach((name) => {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`
    })
}

describe('LanguagePicker', () => {
  let wrapper
  let reloadSpy
  let originalLocation

  beforeEach(() => {
    clearCookies()
    document.querySelectorAll('script#gt-script, #google_translate_element').forEach((el) => el.remove())
    delete window.google
    delete window.googleTranslateElementInit
    originalLocation = window.location
    reloadSpy = vi.fn()
    delete window.location
    window.location = { ...originalLocation, reload: reloadSpy, hostname: 'localhost' }
  })

  afterEach(() => {
    wrapper?.unmount()
    window.location = originalLocation
    vi.restoreAllMocks()
  })

  it('does not inject the Google Translate script on mount (pl visitor)', () => {
    wrapper = mount(LanguagePicker, { attachTo: document.body })
    expect(document.getElementById('gt-script')).toBeNull()
  })

  it('does not toggle the sheet open by default', () => {
    wrapper = mount(LanguagePicker, { attachTo: document.body })
    expect(document.querySelector('.lang-picker__sheet')).toBeNull()
  })

  it('clicking the button opens a sheet with 4 language options', async () => {
    wrapper = mount(LanguagePicker, { attachTo: document.body })
    await wrapper.find('button.lang-picker__btn').trigger('click')
    await flushPromises()
    const sheet = document.querySelector('.lang-picker__sheet')
    expect(sheet).not.toBeNull()
    const options = sheet.querySelectorAll('.lang-picker__option')
    expect(options).toHaveLength(4)
    const codes = Array.from(options).map((o) => o.dataset.code)
    expect(codes).toEqual(['pl', 'en', 'de', 'fr'])
  })

  it('marks the active language with is-current', async () => {
    wrapper = mount(LanguagePicker, { attachTo: document.body })
    await wrapper.find('button.lang-picker__btn').trigger('click')
    await flushPromises()
    const current = document.querySelector('.lang-picker__option.is-current')
    expect(current?.dataset.code).toBe('pl')
  })

  it('reads the active language from the googtrans cookie', async () => {
    document.cookie = 'googtrans=/pl/en; path=/'
    wrapper = mount(LanguagePicker, { attachTo: document.body })
    await flushPromises()
    expect(wrapper.find('.lang-picker__code').text()).toBe('EN')
  })

  it('picking a language sets the cookie and reloads', async () => {
    wrapper = mount(LanguagePicker, { attachTo: document.body })
    await wrapper.find('button.lang-picker__btn').trigger('click')
    await flushPromises()
    const en = document.querySelector('.lang-picker__option[data-code="en"]')
    en.click()
    await flushPromises()
    expect(document.cookie).toMatch(/googtrans=\/pl\/en/)
    expect(reloadSpy).toHaveBeenCalledOnce()
  })

  it('picking the current language closes the sheet without reload', async () => {
    wrapper = mount(LanguagePicker, { attachTo: document.body })
    await wrapper.find('button.lang-picker__btn').trigger('click')
    await flushPromises()
    document.querySelector('.lang-picker__option[data-code="pl"]').click()
    await flushPromises()
    expect(reloadSpy).not.toHaveBeenCalled()
    expect(document.querySelector('.lang-picker__sheet')).toBeNull()
  })

  it('switching to pl clears the googtrans cookie', async () => {
    document.cookie = 'googtrans=/pl/en; path=/'
    wrapper = mount(LanguagePicker, { attachTo: document.body })
    await wrapper.find('button.lang-picker__btn').trigger('click')
    await flushPromises()
    document.querySelector('.lang-picker__option[data-code="pl"]').click()
    await flushPromises()
    expect(document.cookie).not.toMatch(/googtrans=\/pl\/en/)
    expect(reloadSpy).toHaveBeenCalledOnce()
  })
})
