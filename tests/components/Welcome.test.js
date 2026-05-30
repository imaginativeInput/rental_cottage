import { describe, it, expect, afterEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import Welcome from '@/components/Welcome.vue'

let wrapper

afterEach(() => {
  wrapper?.unmount()
  vi.restoreAllMocks()
})

describe('Welcome', () => {
  it('renders a section with class welcome', () => {
    wrapper = mount(Welcome)
    expect(wrapper.find('section.welcome').exists()).toBe(true)
  })

  it('renders welcome__name with text "Domek Rzepiska"', () => {
    wrapper = mount(Welcome)
    const name = wrapper.find('h2.welcome__name')
    expect(name.exists()).toBe(true)
    expect(name.text()).toBe('Domek Rzepiska')
  })

  it('renders an hr with class welcome__hr', () => {
    wrapper = mount(Welcome)
    expect(wrapper.find('hr.welcome__hr').exists()).toBe(true)
  })

  it('renders welcome__title with text "Panorama Tatr"', () => {
    wrapper = mount(Welcome)
    const title = wrapper.find('h1.welcome__title')
    expect(title.exists()).toBe(true)
    expect(title.text()).toBe('Panorama Tatr')
  })

  it('renders welcome__subtitle containing "Niezapomniane"', () => {
    wrapper = mount(Welcome)
    const subtitle = wrapper.find('h2.welcome__subtitle')
    expect(subtitle.exists()).toBe(true)
    expect(subtitle.text()).toContain('Niezapomniane')
  })

  it('title is an h1 element', () => {
    wrapper = mount(Welcome)
    expect(wrapper.find('h1.welcome__title').element.tagName).toBe('H1')
  })

  it('name and subtitle are h2 elements', () => {
    wrapper = mount(Welcome)
    const h2s = wrapper.findAll('h2')
    expect(h2s.length).toBe(2)
    expect(h2s[0].classes()).toContain('welcome__name')
    expect(h2s[1].classes()).toContain('welcome__subtitle')
  })
})
