<script setup>
import { defineAsyncComponent } from 'vue';
import Header from '../components/Header.vue';
import Welcome from '../components/Welcome.vue';
import Reservation from '@/components/Reservation.vue';
import About from '../components/About.vue';
import Gallery from '../components/Gallery.vue';

const Attractions = defineAsyncComponent(() => import('@/components/Attractions.vue'));
const ReservationSection = defineAsyncComponent(() => import('@/components/ReservationSection.vue'));
</script>


<template>
  <img
    class="hero__bg"
    src="/hero/NZF_4359-960.avif"
    srcset="/hero/NZF_4359-480.avif 480w, /hero/NZF_4359-960.avif 960w, /hero/NZF_4359-1440.avif 1440w"
    sizes="100vw"
    alt="Domek Rzepiska na tle panoramy Tatr"
    fetchpriority="high"
    loading="eager"
    decoding="async"
  />
  <Header />
  <main>
    <Welcome />
    <Reservation />
    <About />
    <Gallery />
    <Attractions />
    <ReservationSection />
    <!-- <Contact /> -->
  </main>
</template>


<style global>
.hero__bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 120vh;
  object-fit: cover;
  object-position: center;
  z-index: -1;
  filter: brightness(50%);
}

/* Responsive hero variants are handled by the <img> srcset. */

.calendar-container {
  position: fixed;
  display: grid;
  grid-template-rows: 2;
  gap: 20px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1001;
  margin: 20px auto;
}


.vc-pane {
  width: 92vw;
}

@media (min-width: 550px) {
  .vc-pane {
    width: auto;
  }
}

@media (min-width: 768px) {
  .vc-pane {
    width: 350px;
  }

  .vc-container {
    justify-self: center;
    align-self: center;
  }
}


.vc-title {
  color: var(--clr-light);
}

.vc-weeks {
  height: auto;
}

.vc-highlight-bg-light {
  background-color: var(--clr-slate200);
}

.vc-light.vc-attr,
.vc-light .vc-attr {
  --vc-highlight-solid-bg: var(--clr-dark);

  --vc-highlight-outline-border: var(--clr-warm-beige-600);
  --vc-highlight-outline-content-color: var(--clr-warm-beige-800);
  --vc-highlight-light-content-color: var(--clr-slate600);

  --vc-dot-bg: var(--clr-warm-beige-600);
  --vc-dot-bg: var(--clr-slate600);

  --vc-bar-bg: var(--clr-warm-beige-600);
}

.vc-container,
.vc-container * {
  text-transform: uppercase;
  box-sizing: unset;
}

button.vc-arrow.vc-next,
button.vc-arrow.vc-prev {
  height: 3rem;
  width: 3rem;

  border-radius: 2rem;
  background-color: var(--clr-slate200);
  color: var(--clr-slate800);
}

.vc-weekday {
  padding-top: 2rem;
}
</style>