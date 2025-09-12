import { ref } from 'vue'

export const animateClose = ref(false)

export const closeMobileNav = () => {
  animateClose.value = true
}
