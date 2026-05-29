import { describe, it, expect, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'

import PictureImg from '@/components/PictureImg.vue'

describe('PictureImg', () => {
  let wrapper

  afterEach(() => wrapper?.unmount())

  it('renders a picture with avif srcset for known variants', () => {
    wrapper = mount(PictureImg, {
      props: {
        name: 'NZF_4359',
        alt: 'Tatra Mountains',
      },
    })
    const source = wrapper.find('source')
    expect(source.exists()).toBe(true)
    expect(source.attributes('type')).toBe('image/avif')
    const srcset = source.attributes('srcset') || ''
    expect(srcset).toMatch(/480w/)
    expect(srcset).toMatch(/960w/)
    expect(srcset).toMatch(/1440w/)
  })

  it('mirrors srcset on the inner img and passes alt', () => {
    wrapper = mount(PictureImg, {
      props: { name: 'NZF_4359', alt: 'Tatra Mountains' },
    })
    const img = wrapper.find('img')
    expect(img.attributes('alt')).toBe('Tatra Mountains')
    expect(img.attributes('srcset')).toBe(wrapper.find('source').attributes('srcset'))
    expect(img.attributes('decoding')).toBe('async')
  })

  it('honors fetchpriority and loading props', () => {
    wrapper = mount(PictureImg, {
      props: {
        name: 'NZF_4359',
        alt: 'eager',
        loading: 'eager',
        fetchpriority: 'high',
      },
    })
    const img = wrapper.find('img')
    expect(img.attributes('loading')).toBe('eager')
    expect(img.attributes('fetchpriority')).toBe('high')
  })

  it('renders nothing when no variants exist for the name', () => {
    wrapper = mount(PictureImg, {
      props: { name: 'definitely-not-an-image', alt: 'x' },
    })
    expect(wrapper.find('picture').exists()).toBe(false)
  })

  it('uses jpeg type when format=jpeg', () => {
    wrapper = mount(PictureImg, {
      props: {
        name: 'termy-bukovina',
        alt: 'Bukovina',
        format: 'jpeg',
        widths: [480, 960],
      },
    })
    expect(wrapper.find('source').attributes('type')).toBe('image/jpeg')
  })
})
