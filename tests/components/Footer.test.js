import { describe, it, expect, afterEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import Footer from '@/components/Footer.vue'

let wrapper

afterEach(() => {
  wrapper?.unmount()
  vi.restoreAllMocks()
})

describe('Footer', () => {
  it('renders a <footer> element with id="kontakt"', () => {
    wrapper = mount(Footer)
    const footer = wrapper.find('footer')
    expect(footer.exists()).toBe(true)
    expect(footer.attributes('id')).toBe('kontakt')
  })

  it('renders phone link with correct href', () => {
    wrapper = mount(Footer)
    const phoneLink = wrapper.find('a.phone-link')
    expect(phoneLink.exists()).toBe(true)
    expect(phoneLink.attributes('href')).toBe('tel:+48692434000')
  })

  it('renders phone number text inside .phone-number span', () => {
    wrapper = mount(Footer)
    const phoneNumber = wrapper.find('.phone-number')
    expect(phoneNumber.exists()).toBe(true)
    expect(phoneNumber.text()).toBe('+48 692 434 000')
  })

  it('renders email link with correct href', () => {
    wrapper = mount(Footer)
    const emailLink = wrapper.find('a.email-link')
    expect(emailLink.exists()).toBe(true)
    expect(emailLink.attributes('href')).toBe('mailto:rzepiskadomek@gmail.com')
  })

  it('renders email address text inside .email-text span', () => {
    wrapper = mount(Footer)
    const emailText = wrapper.find('.email-text')
    expect(emailText.exists()).toBe(true)
    expect(emailText.text()).toBe('rzepiskadomek@gmail.com')
  })

  it('renders .social-links container', () => {
    wrapper = mount(Footer)
    expect(wrapper.find('.social-links').exists()).toBe(true)
  })

  it('renders exactly 2 .social-item links', () => {
    wrapper = mount(Footer)
    const socialItems = wrapper.findAll('.social-item')
    expect(socialItems).toHaveLength(2)
  })

  it('google social link has href containing google.com/maps', () => {
    wrapper = mount(Footer)
    const googleLink = wrapper.find('a.social-item.google')
    expect(googleLink.exists()).toBe(true)
    expect(googleLink.attributes('href')).toContain('google.com/maps')
  })

  it('google social link opens in new tab with noopener', () => {
    wrapper = mount(Footer)
    const googleLink = wrapper.find('a.social-item.google')
    expect(googleLink.attributes('target')).toBe('_blank')
    expect(googleLink.attributes('rel')).toContain('noopener')
  })

  it('instagram social link has href containing instagram.com', () => {
    wrapper = mount(Footer)
    const instaLink = wrapper.find('a.social-item.instagram')
    expect(instaLink.exists()).toBe(true)
    expect(instaLink.attributes('href')).toContain('instagram.com')
  })

  it('instagram social link opens in new tab with noopener', () => {
    wrapper = mount(Footer)
    const instaLink = wrapper.find('a.social-item.instagram')
    expect(instaLink.attributes('target')).toBe('_blank')
    expect(instaLink.attributes('rel')).toContain('noopener')
  })

  it('facebook link is NOT rendered (commented out)', () => {
    wrapper = mount(Footer)
    expect(wrapper.find('a.social-item.facebook').exists()).toBe(false)
  })
})
