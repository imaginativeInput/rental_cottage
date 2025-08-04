import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useGuestStore = defineStore('guest', () => {
  const peopleCount = ref(2)

  const setPeopleCount = (value) => {
    peopleCount.value = value
  }

  return {
    peopleCount,
    setPeopleCount,
  }
})
