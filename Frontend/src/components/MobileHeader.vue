<script setup>
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
  animateClose: {
    type: Boolean,
    required: true,
  },
});


const { t } = useI18n();
const emit = defineEmits(['animationEnd']);
const overlay = document.getElementById('overlay');
const mobileNav = document.getElementById('mobile-nav');

const animationClass = computed(() => {
  if (props.animateClose) return 'slide-out';
  if (props.isOpen) return 'slide-in';
  return '';
});

const openGoogleMaps = () => {
  window.open('https://www.google.com/maps/place/Domek+Panorama+Rzepiska/@49.358264,20.160799,17z/data=!3m1!4b1!4m6!3m5!1s0x4715f702446785ad:0xc02c34230f66dfb!8m2!3d49.358264!4d20.160799!16s%2Fg%2F1hhhgzcty?entry=ttu&g_ep=EgoyMDI1MDQxMy4wIKXMDSoASAFQAw%3D%3D');
}

const callPhone = () => {
  window.location.href = 'tel:+48692434000';
}

const isReservationSection = ref(null);

const scrollToReservation = () => {
  isReservationSection.value?.scrollIntoView({ behavior: 'smooth' });
}

const closeMobileNav = () => {

  overlay.style.display = 'none';
  mobileNav.style.display = 'none';
  if (overlay && mobileNav) {
    overlay.style.display = 'none';
    mobileNav.style.display = 'none';
  }
}
</script>

<template>
  <div id="mobile-nav" class="mobile-nav" :class="animationClass" @animationend="emit('animationEnd')">
    <div class="button-grid">
      <button id="phoneCallButton" class="btn header__btn" style="text-transform: uppercase;" @click="callPhone">
        {{ t('call') }}
      </button>
      <button id="reservationButton" class="btn header__btn" style="text-transform: uppercase;"
        @click="scrollToReservation">
        {{ t('reservation') }}
      </button>
      <button id="mapsButton" class="btn header__btn" style="text-transform: uppercase;" @click="openGoogleMaps">
        {{ t('navigate') }}
      </button>
    </div>
    <ul>
      <li>
        <a href="/#home" @click="closeMobileNav">{{ t('homepage') }}</a>
      </li>
      <li>
        <a href="/#o-nas" @click="closeMobileNav">{{ t('about') }}</a>
      </li>
      <li>
        <a href="/galeria">{{ t('gallery') }}</a>
      </li>
      <!-- <li>
        <a href="#atrakcje">Atrakcje</a>
      </li> -->
      <!-- <li>
        <a href="#faq">FAQ</a>
      </li> -->
      <li>
        <a href="#kontakt">{{ t('contact') }}</a>
      </li>
    </ul>
  </div>
</template>


<style scoped>
.mobile-nav {
  position: fixed;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 400px;
  width: 100vw;
  background-color: var(--clr-light);
  box-shadow: 0 4px 2px -2px black;
  z-index: 10001;
}


.slide-in {
  animation: slide-in 0.3s forwards;
}

.slide-out {
  animation: slide-out 0.3s forwards;
}

@keyframes slide-in {
  from {
    transform: translateY(-100%);
  }

  to {
    transform: translateY(0%);
  }
}

@keyframes slide-out {
  from {
    transform: translateY(0%);
  }

  to {
    transform: translateY(-100%);
  }
}

li {
  justify-self: center;
  list-style: none;
  padding-right: 2.5rem;
  padding-bottom: 2rem;
}

.mobile-nav a {
  color: var(--clr-dark);

  text-decoration: none;
  font-size: var(--size-xl);
  font-weight: bold;
  transition: color 0.3s;
}

.mobile-nav a:hover {
  color: var(--clr-warm-beige-400);
}

/* BUTTONS */
.button-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-columns: 1 1 1;
  padding-bottom: 3rem;
  width: 100%;
}

.btn {
  font-weight: 600;
  text-decoration: none;
  letter-spacing: +0.05rem;

  color: var(--clr-light);
  background-color: var(--clr-dark);

  padding: 0.5em 1em;
  transition: transform 0.3s, color 0.3s, background-color 0.3s;
  border: 1px solid var(--clr-dark);
}

.btn:hover {
  transform: translateY(-5px);
  background-color: var(--clr-warm-beige-200);
  color: var(--clr-dark);
  cursor: pointer;
}

.header__btn {
  height: 5rem;
  font-size: var(--size-base);
}

.header__btn,
.header__btn-scrolled {
  transition: all 0.3s ease-in-out;
}

/* BUTTON END */
@media (min-width: 350px) {}

@media (min-height: 600px) {
  /* .mobile-nav {
    width: 380px;
  } */
}


@media (min-height: 750px) {
  .mobile-nav {
    height: 500px;
  }

  .mobile-nav a {
    font-size: var(--size-2xl);
  }

  li {
    margin-top: 1.4rem;
  }

  .header__btn {
    height: 6rem;
    /* font-size: var(--size-lg); */
  }

}



@media (min-height: 900px) {
  .mobile-nav {
    height: 600px;
  }

  .mobile-nav a {
    /* font-size: var(--size-3xl); */
  }

  .header__btn {
    height: 7rem;
    /* font-size: var(--size-xl); */
  }


  li {
    margin-top: 1.8rem;
  }

}
</style>