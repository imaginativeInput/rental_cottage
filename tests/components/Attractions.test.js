import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'

import Attractions from '@/components/Attractions.vue'

describe('Attractions', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(Attractions, { attachTo: document.body })
  })

  afterEach(() => wrapper?.unmount())

  it('renders 8 attraction cards', () => {
    expect(wrapper.findAll('.attraction-card')).toHaveLength(8)
  })

  it('each card image alt matches its title', () => {
    const cards = wrapper.findAll('.attraction-card')
    cards.forEach((card) => {
      const title = card.find('.attraction-card__title').text()
      const alt = card.find('img').attributes('alt')
      expect(alt).toBe(title)
    })
  })

  it('cards with a url expose an external link with safe rel', () => {
    const linked = wrapper.findAll('.attraction-card__link')
    // 6 of 8 (Jurgów + Zakopane have no url)
    expect(linked).toHaveLength(6)
    linked.forEach((a) => {
      expect(a.attributes('href')).toMatch(/^https?:\/\//)
      expect(a.attributes('target')).toBe('_blank')
      expect(a.attributes('rel')).toBe('noopener noreferrer')
    })
  })

  it('Jurgów + Zakopane cards omit the link', () => {
    const cards = wrapper.findAll('.attraction-card')
    const titles = cards.map((c) => c.find('.attraction-card__title').text())
    const jurgowIdx = titles.findIndex((t) => t.includes('Jurgowie'))
    const zakopaneIdx = titles.findIndex((t) => t === 'Zakopane')
    expect(jurgowIdx).toBeGreaterThan(-1)
    expect(zakopaneIdx).toBeGreaterThan(-1)
    expect(cards[jurgowIdx].find('.attraction-card__link').exists()).toBe(false)
    expect(cards[zakopaneIdx].find('.attraction-card__link').exists()).toBe(false)
  })

  it('every card shows a distance pill', () => {
    const pills = wrapper.findAll('.attraction-card__distance')
    expect(pills).toHaveLength(8)
    pills.forEach((p) => expect(p.text().length).toBeGreaterThan(0))
  })
})
