<script setup>
</script>

<template>
  <section class="welcome">
    <h2 class="welcome__name">Domek Rzepiska</h2>
    <hr class="welcome__hr" style="width: 40%">
    <h1 class="welcome__title">Panorama Tatr</h1>
    <h2 class="welcome__subtitle">Niezapomniane chwile i piękne widoki</h2>
  </section>
</template>

<style scoped>
.welcome {
  padding-top: 1rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  /* Tall enough that the hero (Welcome + Reservation + the bar's bottom gap)
     fills the viewport, so the panorama's mountains show below the booking bar
     instead of being cut off by the dark About section. See the matching
     `.rezerwacja { margin-bottom }` in Reservation.vue. */
  height: 58vh;
}

.welcome__name {
  color: var(--clr-light);
  color: var(--clr-warm-beige-400);

  text-transform: uppercase;
  font-size: var(--size-3xl);
  letter-spacing: -0.05rem;
  line-height: 0.9;
}

.welcome__title {
  color: var(--clr-warm-beige-400);
  text-transform: uppercase;
  font-size: var(--size-4xl);
  letter-spacing: -0.05rem;
  line-height: 0.9;
}

.welcome__subtitle {
  font-family: 'Playfair Display', serif;

  color: var(--clr-warm-beige-400);
  color: var(--clr-slate200);

  font-size: var(--size-sm);
  line-height: 0.9;
}

.welcome__hr-container {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: center;


  color: black;
}

.welcome__hr {
  border: solid 1px var(--clr-slate400);
}


@media (min-width: 475px) {
  .welcome__hr {
    color: var(--clr-slate400);
  }

  .welcome__name {
    font-size: var(--size-4xl);
  }

  .welcome__title {
    font-size: var(--size-5xl);
  }

  .welcome__subtitle {
    font-size: var(--size-base);
  }
}

@media (min-width: 640px) {
  .welcome__subtitle {
    font-size: var(--size-lg);
  }
}

@media (min-width: 768px) {
  .welcome {
    padding-top: 5rem;
    padding-bottom: 5rem;
    height: 60vh;
  }

  .welcome__name {
    font-size: var(--size-4xl);
  }

  .welcome__title {
    font-size: var(--size-6xl);
  }

  .welcome__subtitle {
    font-size: var(--size-xl);
  }
}

@media (min-width: 1024px) {
  .welcome {
    /* Taller hero on desktop so the panorama (mountains + foreground) shows
       below the title instead of being cut off by the dark About section.
       Pairs with `.rezerwacja { margin-bottom }` in Reservation.vue, which
       opens the gap under the booking bar where the mountains are revealed. */
    height: 72vh;
  }

  .welcome__name {
    font-size: var(--size-5xl);
  }

  .welcome__title {
    font-size: var(--size-7xl);
  }

  .welcome__subtitle {
    font-size: var(--size-2xl);
  }

}

@media (min-width: 1280px) {
  .welcome__name {
    font-size: var(--size-6xl);
  }

  .welcome__title {
    font-size: var(--size-8xl);
  }

  .welcome__subtitle {
    font-size: var(--size-3xl);
  }
}


@media (min-width: 1536px) {}
</style>
