import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { nextTick } from 'vue'
import { useCalendarStore } from '@/stores/calendarStore'

describe('useCalendarStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  afterEach(() => {
    document.body.style.overflowX = ''
  })

  it('defaults isCalendarVisible to false', () => {
    const store = useCalendarStore()
    expect(store.isCalendarVisible).toBe(false)
  })

  it('toggleCalendar() flips isCalendarVisible from false to true', () => {
    const store = useCalendarStore()
    store.toggleCalendar()
    expect(store.isCalendarVisible).toBe(true)
  })

  it('toggleCalendar() called twice returns isCalendarVisible to false', () => {
    const store = useCalendarStore()
    store.toggleCalendar()
    store.toggleCalendar()
    expect(store.isCalendarVisible).toBe(false)
  })

  it('watcher sets document.body.style.overflowX to "hidden" when isCalendarVisible becomes true', async () => {
    const store = useCalendarStore()
    store.toggleCalendar()
    await nextTick()
    expect(document.body.style.overflowX).toBe('hidden')
  })

  it('watcher sets document.body.style.overflowX to "" when isCalendarVisible becomes false after being true', async () => {
    const store = useCalendarStore()
    store.toggleCalendar()
    await nextTick()
    store.toggleCalendar()
    await nextTick()
    expect(document.body.style.overflowX).toBe('')
  })
})
