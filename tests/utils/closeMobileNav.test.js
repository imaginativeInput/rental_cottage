import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { animateClose, closeMobileNav } from '@/utils/closeMobileNav'

describe('closeMobileNav utils', () => {
  beforeEach(() => {
    animateClose.value = false
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('animateClose is initially false after reset', () => {
    expect(animateClose.value).toBe(false)
  })

  it('closeMobileNav() sets animateClose.value to true', () => {
    closeMobileNav()
    expect(animateClose.value).toBe(true)
  })

  it('animateClose stays true on repeated calls', () => {
    closeMobileNav()
    closeMobileNav()
    closeMobileNav()
    expect(animateClose.value).toBe(true)
  })
})
