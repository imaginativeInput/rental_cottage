import { ref, watch } from 'vue'
import { defineStore } from 'pinia'

export const useCalendarStore = defineStore('calendar', () => {
  const isCalendarVisible = ref(false)

  const toggleCalendar = () => {
    isCalendarVisible.value = !isCalendarVisible.value
  }

  watch(isCalendarVisible, (newValue) => {
    if (newValue) {
      document.body.style.overflowX = 'hidden'
    } else {
      document.body.style.overflowX = ''
    }
  })

  return { isCalendarVisible, toggleCalendar }
})
