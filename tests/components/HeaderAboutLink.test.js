import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import { createRouter, createMemoryHistory } from 'vue-router'

import Header from '@/components/Header.vue'

const buildRouter = (path) => {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', name: 'home', component: { template: '<div />' } },
      { path: '/galeria', name: 'gallery', component: { template: '<div />' } },
    ],
  })
  router.push(path)
  return router
}

describe('Header — "O nas" link', () => {
  let wrapper

  beforeEach(() => {
    setActivePinia(createPinia())
  })

  afterEach(() => {
    wrapper?.unmount()
    vi.restoreAllMocks()
  })

  it('uses #o-nas on the home page', async () => {
    const router = buildRouter('/')
    await router.isReady()
    wrapper = mount(Header, { global: { plugins: [router] }, attachTo: document.body })
    const links = wrapper.findAll('a')
    const aboutLink = links.find((a) => a.text().includes('about') || a.text().toLowerCase().includes('o nas') || a.text().includes('O nas'))
    // i18n stub returns 'about' for the t('about') key — find by class instead
    const aboutByClass = wrapper.findAll('a.header__link').find((a) => a.attributes('href')?.includes('o-nas'))
    expect(aboutByClass).toBeDefined()
    expect(aboutByClass.attributes('href')).toBe('#o-nas')
  })

  it('uses /#o-nas on non-home routes', async () => {
    const router = buildRouter('/galeria')
    await router.isReady()
    wrapper = mount(Header, { global: { plugins: [router] }, attachTo: document.body })
    const aboutByClass = wrapper.findAll('a.header__link').find((a) => a.attributes('href')?.includes('o-nas'))
    expect(aboutByClass.attributes('href')).toBe('/#o-nas')
  })
})
