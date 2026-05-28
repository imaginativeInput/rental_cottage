import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useGuestStore = defineStore('guest', () => {
  const peopleCount = ref(2)
  const childrenCount = ref(0)
  const hasPets = ref(false)

  const setPeopleCount = (value) => {
    peopleCount.value = value
  }

  return {
    peopleCount,
    childrenCount,
    hasPets,
    setPeopleCount,
  }
})
