import { describe, it, expect, afterEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import Contact from '@/components/Contact.vue'

let wrapper

afterEach(() => {
  wrapper?.unmount()
  vi.restoreAllMocks()
})

describe('Contact.vue', () => {
  it('renders a root <section> element', () => {
    wrapper = mount(Contact)
    expect(wrapper.element.tagName).toBe('SECTION')
  })

  it('.price text is "900"', () => {
    wrapper = mount(Contact)
    const price = wrapper.find('.price')
    expect(price.exists()).toBe(true)
    expect(price.text()).toBe('900')
  })

  it('.price is a <strong> inside .contact__title', () => {
    wrapper = mount(Contact)
    const title = wrapper.find('.contact__title')
    expect(title.exists()).toBe(true)
    const strong = title.find('strong.price')
    expect(strong.exists()).toBe(true)
  })

  it('element with id="atrakcje" exists and has class attractions', () => {
    wrapper = mount(Contact)
    const el = wrapper.find('#atrakcje')
    expect(el.exists()).toBe(true)
    expect(el.classes()).toContain('attractions')
  })

  it('element with id="faq" exists and has class faq', () => {
    wrapper = mount(Contact)
    const el = wrapper.find('#faq')
    expect(el.exists()).toBe(true)
    expect(el.classes()).toContain('faq')
  })

  it('.faq__title text is "FAQ"', () => {
    wrapper = mount(Contact)
    const title = wrapper.find('.faq__title')
    expect(title.exists()).toBe(true)
    expect(title.text()).toBe('FAQ')
  })

  it('.faq__subtitle exists inside #faq', () => {
    wrapper = mount(Contact)
    const subtitle = wrapper.find('#faq .faq__subtitle')
    expect(subtitle.exists()).toBe(true)
  })

  it('.faq__questions ul exists', () => {
    wrapper = mount(Contact)
    const ul = wrapper.find('ul.faq__questions')
    expect(ul.exists()).toBe(true)
  })

  it('there are exactly 8 .faq__question list items', () => {
    wrapper = mount(Contact)
    const questions = wrapper.findAll('.faq__question')
    expect(questions).toHaveLength(8)
  })

  it('there are exactly 8 .faq__answer list items', () => {
    wrapper = mount(Contact)
    const answers = wrapper.findAll('.faq__answer')
    expect(answers).toHaveLength(8)
  })

  it('.faq__questions contains exactly 16 <li> elements total', () => {
    wrapper = mount(Contact)
    const ul = wrapper.find('ul.faq__questions')
    const items = ul.findAll('li')
    expect(items).toHaveLength(16)
  })

  it('.attractions__title exists inside #atrakcje', () => {
    wrapper = mount(Contact)
    const title = wrapper.find('#atrakcje .attractions__title')
    expect(title.exists()).toBe(true)
  })
})
