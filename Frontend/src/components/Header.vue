<script setup>
import { useCalendarStore } from '@/stores/calendarStore';
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { nextTick } from 'vue';
import { useI18n } from 'vue-i18n';

import MobileHeader from './MobileHeader.vue';
import panorama from '@/assets/panorama.jpg';


const props = defineProps({
  isLightTheme: {
    type: Boolean,
    default: false,
  },
})

const { t, locale, availableLocales } = useI18n({ useScope: 'global' });
const route = useRoute();
const router = useRouter();
const lastScrollY = ref(0);
const scrolled = ref(false);
const hideNavbar = ref(false);

const calendarStore = useCalendarStore();

const isHomePage = computed(() => route.path === '/');

const handleHomeClick = (event) => {
  if (isHomePage.value) {
    event.preventDefault(); // Keine reloading
    window.scrollTo({ top: 0, behavior: "smooth" });
  } else {
    router.push('/');
  }
}

const handleScroll = () => {
  if (window.scrollY > lastScrollY.value) {
    hideNavbar.value = true;
  } else {
    hideNavbar.value = false;
  }

  scrolled.value = window.scrollY > 50;
  lastScrollY.value = window.scrollY;
}

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
});
onBeforeUnmount(() => {
  window.removeEventListener("scroll", handleScroll);
});

const linkThemeClass = computed(() => {
  if (scrolled.value) return 'link--light'
  return props.isLightTheme ? 'link--dark' : 'link--light'
})


const isMobileNav = ref(false);
const animateClose = ref(false);

const openMobileNav = () => {
  isMobileNav.value = true;
  animateClose.value = false;
}

const closeMobileNav = () => {
  animateClose.value = true;
}

const handleAnimationEnd = () => {
  if (animateClose.value) {
    isMobileNav.value = false;
    animateClose.value = false;
  }
}

const scrollToSection = (section) => {
  const target = document.getElementById(`${section}`);
  if (target) {
    const yOffset = -64;
    const yPosition = target.getBoundingClientRect().top + window.pageYOffset + yOffset;
    window.scrollTo({ top: yPosition, behavior: 'smooth' });
  }
};

const routeAndScroll = (url, section) => {
  router.push({ path: `${url}` }).then(() => {
    nextTick(() => scrollToSection(section));
  });
}

const reservationButtonClass = computed(() => {
  // const baseClass = scrolled.value || !props.isLightTheme ? 'btn header__btn' : 'header__btn-scrolled';
  // return [baseClass, linkThemeClass.value]

  let base = 'header__btn';

  if (scrolled.value) {
    return ['header__btn--scrolled', linkThemeClass.value];
  }

  if (props.isLightTheme) {
    return [base, 'btn header__btn--light', linkThemeClass.value];
  }

  return ['btn', base, linkThemeClass.value];

})
</script>


<template>
  <div id="overlay" v-if="isMobileNav" @click="closeMobileNav"></div>
  <header id="home" class="header container" :style="{ '--panorama-url': `url(${panorama})` }">

    <nav v-if="!isMobileNav" :class="['navbar', { 'hidden-nav': hideNavbar, 'scrolled-nav': scrolled }]">
      <ul>
        <a :href="isHomePage ? '#home' : '/'" @click="handleHomeClick" class="header__link header__home"
          :class="linkThemeClass">
          Domek
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path
              d="M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.061l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06l8.69-8.689Z" />
            <path
              d="m12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.432Z" />
          </svg>
          Rzepiska
        </a>
      </ul>

      <ul class="header__menu">
        <li>
          <a @click="isHomePage ? scrollToSection('o-nas') : routeAndScroll('/', 'o-nas')" class="header__link"
            :class="linkThemeClass">{{ t('about') }}</a>
        </li>
        <li>
          <a :href="isHomePage ? '/galeria' : '#galeria'" class="header__link" :class="linkThemeClass">{{ t('gallery')
          }}</a>
        </li>
        <li>
          <a :href="isHomePage ? '#kontakt' : '#kontakt'" class="header__link" :class="linkThemeClass">{{ t('contact')
            }}</a>
        </li>
        <li class="header__line"></li>
        <li>
          <!-- <button id="reservationButton" :class="scrolled ? 'header__btn-scrolled' : 'btn header__btn'"
            style="text-transform: uppercase;" @click="scrollToSection('reservation-section')">
            {{ t('reservation') }}
          </button> -->

          <button id="reservationButton" :class="reservationButtonClass" style="text-transform: uppercase;"
            @click="scrollToSection('reservation-section')">
            {{ t('reservation') }}
          </button>
        </li>
      </ul>
      <button class="header__bars" @click="openMobileNav" :class="linkThemeClass">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path fill-rule="evenodd"
            d="M3 6.75A.75.75 0 0 1 3.75 6h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 6.75ZM3 12a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 12Zm0 5.25a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1-.75-.75Z"
            clip-rule="evenodd" />
        </svg>
      </button>
    </nav>
  </header>

  <MobileHeader v-if="isMobileNav || animateClose" :isOpen="isMobileNav" :animateClose="animateClose"
    @animation-end="handleAnimationEnd" />
</template>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 1000;
  transition: all 0.3s ease-in-out;
  transform: translateY(0);
}

.scrolled-nav {
  background: black;
  background: var(--clr-dark);

  transition: transform 0.3 ease-in-out, padding 0.3s ease-in-out;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 0;
}

.header {
  display: flex;
  align-items: center;
}

.header nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.header__menu {
  display: flex;
  align-items: center;
  list-style: none;
  padding: 0;
  gap: 1em;
}

.header__menu {
  display: none;
}

.header__bars {
  background: none;
  border: none;
  width: var(--size-6xl);
  height: var(--size-6xl);
  display: block;
  margin-right: 2rem;

  transition: 0.5s background-color, 0.5s color;
}

.header__bars:hover {
  cursor: pointer;
  color: var(--clr-gold);
}

.header__home {
  display: flex;
  align-items: center;
  gap: 0.2em;
  color: var(--clr-light);
  text-decoration: none;
  font-size: var(--size-base);
  font-weight: 600;
}

.header__home svg {
  width: var(--size-2xl);
  height: var(--size-2xl);
}

.header__link {
  font-size: var(--size-base);
  text-decoration: none;
  font-weight: 600;
  letter-spacing: -0.05em;
  transition: color 0.3s;
}

.header__link.link--light {
  color: var(--clr-light);
}

.header__link.link--dark {
  color: var(--clr-dark);
}

.header__bars.link--light {
  color: var(--clr-light);
}

.header__bars.link--dark {
  color: var(--clr-dark);
}

.header__link:hover {
  color: var(--clr-warm-beige-400);
  cursor: pointer;
}

.header__line {
  border: 1px solid var(--clr-slate400);
  padding-top: 2.5em;
}


.btn {
  display: inline-block;
  font-weight: 600;
  text-decoration: none;
  letter-spacing: +0.05rem;

  background-color: var(--clr-light);
  color: var(--clr-dark);

  padding: 0.5em 1em;
  border-radius: 6px;
  transition: transform 0.3s, color 0.3s, background-color 0.3s;
  border: none;
}

.btn:hover {
  transform: translateY(-5px);
  background-color: var(--clr-warm-beige-400);
  cursor: pointer;
}

.header__btn {
  height: 3rem;
  font-size: var(--size-xxs);
  margin-top: 0.5rem;
  margin-right: 2rem;
}

.header__btn--light {
  color: var(--clr-light);
  background-color: var(--clr-dark);
}

.header__btn,
.header__btn--scrolled {
  transition: all 0.3s ease-in-out;
}

.header__btn--scrolled {
  padding-top: 1.5rem;
  padding-bottom: 1.5rem;
  font-size: var(--size-xl);
  font-weight: bold;
  color: var(--clr-dark);
  background-color: var(--clr-light);
  border: none;
}

.header__btn--scrolled:hover {
  cursor: pointer;
  background-color: var(--clr-warm-beige-400);
}



@media (min-width: 475px) {}

@media (min-width: 640px) {}

@media (min-width: 768px) {
  .header__menu {
    display: flex;
    align-items: center;
    list-style: none;
    padding: 0;
    gap: 2em;
    margin-left: 0;
    margin-right: 0;
  }

  .header__bars {
    display: none;
  }

  .header__home {
    font-size: var(--size-sm);
  }

  .header__home svg {
    width: var(--size-xl);
    height: var(--size-xl);
  }

  .header__link {
    font-size: var(--size-sm);
  }

  .header__btn {
    height: 4rem;
    font-size: var(--size-sm);
  }
}

@media (min-width: 1024px) {
  .header__home {
    font-size: var(--size-base);
  }

  .header__home svg {
    width: var(--size-2xl);
    height: var(--size-2xl);
  }

  .header__link {
    font-size: var(--size-base);
  }

  .header__btn {
    height: 4rem;
    font-size: var(--size-base);
  }
}


@media (min-width: 1280px) {
  .header__btn {
    height: 5rem;
    font-size: var(--size-lg);
  }
}

@media (min-width: 1536px) {
  .header__home {
    font-size: var(--size-lg);
  }

  .header__home svg {
    width: var(--size-3xl);
    height: var(--size-3xl);
  }

  .header__link {
    font-size: var(--size-lg);
  }

}
</style>
