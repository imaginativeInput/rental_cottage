// src/stores/mobileHeaderStore.js
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useMobileHeaderStore = defineStore('mobileHeader', () => {
  const isMobileNav = ref(false);
  const animateClose = ref(false);

  const openMobileNav = () => {
    isMobileNav.value = true;
    animateClose.value = false;
  };

  const closeMobileNav = () => {
    animateClose.value = true;
  };

  const handleAnimationEnd = () => {
    if (animateClose.value) {
      isMobileNav.value = false;
      animateClose.value = false;
    }
  };

  return {
    isMobileNav,
    animateClose,
    openMobileNav,
    closeMobileNav,
    handleAnimationEnd
  };
});
