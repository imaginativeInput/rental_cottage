<script setup>
import { onMounted, ref } from 'vue';
import { RouterLink } from 'vue-router';

import lava from '@/assets/lawa.jpg';
import panorama from '@/assets/panorama.jpg';

const lastScrollY = ref(0);
const hideNavbar = ref(false);
const handleScroll = () => {
  if (window.scrollY > lastScrollY.value) {
    hideNavbar.value = true;
  } else {
    hideNavbar.value = false;
  }
  lastScrollY.value = window.scrollY;
}

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
})

beforeDestroy(() => {
  window.removeEventListener("scroll", handleScroll);
})
</script>


<template>
  <header class="header container" :style="{ '--panorama-url': `url(${panorama})` }">

    <nav :class="['navbar', { 'hidden-nav': hideNavbar }]">
      <ul>
        <RouterLink to="/" class="header__link header__home">
          Domek
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path
              d="M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.061l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06l8.69-8.689Z" />
            <path
              d="m12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.432Z" />
          </svg>
          Rzepiska
        </RouterLink>
      </ul>

      <ul class="header__menu">
        <li>
          <RouterLink href="/o-nas" class="header__link">O nas</RouterLink>
        </li>
        <li>
          <a href="#galeria" class="header__link">Galeria</a>
        </li>
        <li>
          <a href="#cennik" class="header__link">Cennik</a>
        </li>
        <li>
          <a href="#kontakt" class="header__link">Kontakt</a>
        </li>
        <li class="header__line"></li>
        <li>
          <button id="reservationButton" class="btn header__btn" style="text-transform: uppercase;">
            Rezerwacja
          </button>
        </li>
      </ul>
      <button class="header__bars">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path fill-rule="evenodd"
            d="M3 6.75A.75.75 0 0 1 3.75 6h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 6.75ZM3 12a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 12Zm0 5.25a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1-.75-.75Z"
            clip-rule="evenodd" />
        </svg>
      </button>
    </nav>
  </header>
</template>

<style scoped>
.navbar {
  display: none;
}

.header {
  display: flex;
  align-items: center;
  padding-top: 1rem;
  padding-bottom: 1rem;
  background: var(--panorama-url);
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
  /* margin-right: 2em; */
  gap: 1em;
}

.header__menu {
  display: none;
}

.header__bars {
  color: var(--clr-light);
  width: var(--size-2xl);
  height: var(--size-2xl);
  display: block;
}


.header__home {
  display: flex;
  align-items: center;
  gap: 0.5em;
  color: var(--clr-light);
  text-decoration: none;
  font-size: var(--size-xxs);
  font-weight: 600;
}

.header__home svg {
  width: var(--size-base);
  height: var(--size-base);

}


.header__link {
  font-size: var(--size-xxs);
  text-decoration: none;
  font-weight: 600;
  color: var(--clr-light);
  letter-spacing: -0.05em;
  transition: color 0.3s;
}

.header__link:hover {
  color: var(--clr-gold);
}

.header__line {
  border: 1px solid var(--clr-slate400);
  padding-top: 1.5em;
}

.header__btn {
  height: 3rem;
  font-size: var(--size-xxs);
}



@media (min-width: 475px) {
  .header__menu {
    gap: 1.25em;
  }


  .header__home {
    font-size: var(--size-xxs);
  }

  .header__home svg {
    width: var(--size-base);
    height: var(--size-base);
  }

  .header__link {
    font-size: var(--size-xxs);
  }

  .header__btn {
    height: 3rem;
    font-size: var(--size-xxs);
  }
}

@media (min-width: 640px) {
  .header__menu {
    gap: 1.5em;
  }


  .header__home {
    font-size: var(--size-xs);
  }

  .header__home svg {
    width: var(--size-lg);
    height: var(--size-lg);
  }

  .header__link {
    font-size: var(--size-xs);
  }

  .header__btn {
    height: 4rem;
    font-size: var(--size-xs);
  }
}

@media (min-width: 768px) {
  .navbar {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    background: #333;
    color: var(--clr-light);
    padding: 15px 20px;
    display: flex;
    justify-content: space-between;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    z-index: 10000;
    transition: transform 0.3s ease-in-out;
  }

  .hidden-nav {
    transform: translateY(-100%);
  }

  .header__menu {
    display: flex;
    align-items: center;
    list-style: none;
    padding: 0;
    gap: 2em;
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
