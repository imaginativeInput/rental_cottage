import { describe, it, expect, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'

import About from '@/components/About.vue'

describe('About', () => {
  let wrapper

  afterEach(() => wrapper?.unmount())

  it('renders a <section> with id="o-nas" and class "o-nas"', () => {
    wrapper = mount(About)
    const section = wrapper.find('section.o-nas')
    expect(section.exists()).toBe(true)
    expect(section.attributes('id')).toBe('o-nas')
  })

  it('renders the exact heading text', () => {
    wrapper = mount(About)
    const h2 = wrapper.find('h2.o-nas__title')
    expect(h2.exists()).toBe(true)
    expect(h2.text()).toBe('Dom z widokiem na panoramę Tatr')
  })

  it('renders a non-empty description paragraph', () => {
    wrapper = mount(About)
    const p = wrapper.find('p.o-nas__description')
    expect(p.exists()).toBe(true)
    expect(p.text().trim().length).toBeGreaterThan(0)
  })

  it('renders an img-wrapper div with class "gallery" inside the section', () => {
    wrapper = mount(About)
    const imgWrapper = wrapper.find('div.o-nas__img-wrapper.gallery')
    expect(imgWrapper.exists()).toBe(true)
  })

  it('renders exactly two <picture> elements', () => {
    wrapper = mount(About)
    const pictures = wrapper.findAll('picture')
    expect(pictures).toHaveLength(2)
  })

  it('each <picture> has an avif <source> with 480w, 960w, and 1440w in its srcset', () => {
    wrapper = mount(About)
    const pictures = wrapper.findAll('picture')
    pictures.forEach((pic) => {
      const source = pic.find('source[type="image/avif"]')
      expect(source.exists()).toBe(true)
      const srcset = source.attributes('srcset') || ''
      expect(srcset).toMatch(/480w/)
      expect(srcset).toMatch(/960w/)
      expect(srcset).toMatch(/1440w/)
    })
  })

  it('each <picture> has an <img> with class "o-nas__img"', () => {
    wrapper = mount(About)
    const pictures = wrapper.findAll('picture')
    pictures.forEach((pic) => {
      const img = pic.find('img')
      expect(img.exists()).toBe(true)
      expect(img.classes()).toContain('o-nas__img')
    })
  })

  it('has a <br class="img-separator"> between the content and img-wrapper', () => {
    wrapper = mount(About)
    const br = wrapper.find('br.img-separator')
    expect(br.exists()).toBe(true)
  })

  it('the section carries the section-wide class', () => {
    wrapper = mount(About)
    const section = wrapper.find('section')
    expect(section.classes()).toContain('section-wide')
  })
})
