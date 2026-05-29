<script setup>
import PictureImg from '@/components/PictureImg.vue';
</script>

<template>
  <section class="o-nas section-wide" id="o-nas">
    <div class="o-nas__content">
      <h2 class="o-nas__title">Dom z widokiem na panoramę Tatr</h2>
      <p class="o-nas__description">
        Ze wszystkich pomieszczeń rozpościera się niewiarygodnie cudowny widok na całą panoramę Tatr polskich i
        słowackich…

        <br><br>
        Domek ma 127m² powierzchni, trzy kondygnacje, może pomieścić 10 – 13 osób. Przed budynkiem znajduje się parking
        dla czterech samochodów oraz garaż na jedno auto. Dostęp do internetu – WIFI w całym domu
      </p>
    </div>
    <br class="img-separator">
    <!-- <br> -->
    <div class="o-nas__img-wrapper gallery">
      <PictureImg name="NZF_4359"
        alt="Tatra Mountains panorama view from balcony"
        img-class="o-nas__img"
        sizes="(min-width: 1024px) 60vw, 94vw"
        :widths="[480, 960, 1440]"
        loading="eager" />
      <PictureImg name="NZF_4375"
        alt="Tatra Mountains panorama view green grass and coffee"
        img-class="o-nas__img"
        sizes="(min-width: 1024px) 60vw, 94vw"
        :widths="[480, 960, 1440]"
        loading="eager" />
    </div>

  </section>
</template>

<style scoped>
/* TEST */
.gallery {
  /* --g: 8px; */
  --g: 3px;
  /* the gap */

  display: grid;
  clip-path: inset(1px);
  /* to avoid visual glitchs */
}

.gallery>picture {
  --_p: calc(-1*var(--g));
  grid-area: 1/1;
  aspect-ratio: 16 / 10;
  cursor: pointer;
  transition: .4s .1s;
}

.gallery>picture>img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.gallery>picture:first-child {
  clip-path: polygon(0 0, calc(100% + var(--_p)) 0, 0 calc(100% + var(--_p)));
}

.gallery>picture:last-child {
  clip-path: polygon(100% 100%, 100% calc(0% - var(--_p)), calc(0% - var(--_p)) 100%);
}

.gallery:hover>picture:last-child,
.gallery:hover>picture:first-child:hover {
  --_p: calc(50% - var(--g));
}

.gallery:hover>picture:first-child,
.gallery:hover>picture:first-child:hover+picture {
  --_p: calc(-50% - var(--g));
}

/* TEST */

br {
  display: block;
}

.o-nas {
  display: flex;
  align-items: center;
  flex-direction: column;

  position: relative;
  background-color: var(--clr-dark);
  text-align: left;

  padding-top: 5rem;
}

.o-nas__title {
  font-size: var(--size-2xl);
  color: var(--clr-light);

  justify-self: left;
  padding-bottom: 1rem;
  padding-left: 1rem;
}


.o-nas__description {
  max-width: 60ch;
  font-size: var(--size-sm);
  color: var(--clr-slate200);
  padding-left: 1rem;
  padding-right: 1rem;
}

.o-nas__img {
  width: 94%;
  justify-self: center;
  /* border-radius: 18px; */
  box-shadow: 10px 10px 10px rgba(255, 255, 255, 1);
}

.o-nas__line {
  border: 1px solid var(--clr-slate800);
  padding-top: 50%;
  display: none;
  margin-right: 1rem;
  margin-left: 1rem;
}

.o-nas__hr {
  width: 100%;
  padding-left: 0;
  padding-right: 0;
  color: var(--clr-dark);
}

@media (min-width: 475px) {}

@media (min-width: 640px) {
  .o-nas__title {
    font-size: var(--size-3xl);
  }

  .o-nas__description {
    max-width: 80ch;
    font-size: var(--size-lg);
  }
}

@media (min-width: 768px) {}

@media (min-width: 1024px) {
  .img-separator {
    display: none;
  }

  .o-nas {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    padding-top: 5rem;
    padding-bottom: 5rem;
  }

  .o-nas__content {
    flex: 2;
    min-width: 30%;
  }

  .o-nas__img-wrapper {
    flex: 3;
    max-width: 60%;
  }

  .o-nas__img {
    width: 100%;
  }

  .o-nas__title,
  .o-nas__description {
    padding-left: 2rem;
  }

  .o-nas__description {
    max-width: 60ch;
    padding-bottom: 1rem;
  }

  .o-nas__line {
    display: inline-block;
  }

}


@media (min-width: 1200px) {
  .o-nas__description {
    max-width: 50ch;
  }
}

@media (min-width: 1280px) {}


@media (min-width: 1536px) {

  .o-nas__title {
    font-size: var(--size-5xl);
    margin-right: 0.5rem;
  }

  .o-nas__description {
    font-size: var(--size-xl);
  }

}

@media (min-width: 1675px) {
  .o-nas__description {
    max-width: 80ch;
  }
}

@media (min-width: 1920px) {
  .o-nas__title {
    font-size: var(--size-6xl);
  }

  .o-nas__description {
    font-size: var(--size-2xl);
  }
}
</style>