<script setup>
import { ref } from 'vue';

import Header from '../components/Header.vue';
import Welcome from '../components/Welcome.vue';
import Reservation from '@/components/Reservation.vue';
import About from '../components/About.vue';
import Gallery from '../components/Gallery.vue';
import ReservationForm from '../components/ReservationForm.vue';
import ReservationSection from '@/components/ReservationSection.vue';


import Attractions from '@/components/Attractions.vue';
import Contact from '../components/Contact.vue';
</script>


<template>
  <!doctype html>
  <html lang="en">

  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&display=swap" rel="stylesheet">
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Domek Rzepiska</title>
  </head>

  <body>
    <div class="hero__bg"></div>
    <Header />

    <div id="app">
      <main>
        <Welcome />
        <Reservation />
        <About />
        <Gallery />
        <ReservationSection />
        <!-- <Attractions /> -->
        <!-- <Contact /> -->
      </main>
    </div>
  </body>

  </html>
</template>


<style global>
.hero__bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 120vh;
  background: url('../assets/panorama.jpg') no-repeat center/cover;
  z-index: -1;
  filter: brightness(50%);
}

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

/* .vc-highlight-bg-light {
  background-color: var(--clr-warm-beige-200);
} */

.vc-highlight-bg-light {
  background-color: var(--clr-slate200);
}

.vc-light.vc-attr,
.vc-light .vc-attr {
  /* --vc-highlight-solid-bg: var(--clr-warm-beige-600); */
  /* --vc-highlight-solid-bg: var(--clr-slate800); */
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