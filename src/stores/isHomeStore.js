import { ref} from 'vue'
import { defineStore } from 'pinia'

export const usePageStore = defineStore('page', () => {
  const isHome = ref(true);
  function setHome(value) {
    isHome.value = value;
  }

  return { isHome, setHome }
})
