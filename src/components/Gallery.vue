<script setup>
import { ref, onMounted } from 'vue';
import PictureImg from '@/components/PictureImg.vue';
import { srcsetFor } from '@/utils/responsiveImages';

const slides = [
  { name: 'fireplace02', alt: 'Fireplace and benches with Tatra Mountains panorama' },
  { name: 'livingroom05-best', alt: 'Living room' },
  { name: 'bedroom01', alt: 'Bedroom' },
  { name: 'NZF_4359', alt: 'Sunset in Tatra Mountain village' },
  { name: 'NZF_4375', alt: 'Tatra Mountains panorama at night with moon' },
  { name: 'outside01', alt: 'Parking lot with Tatra Mountains panorama' },
  { name: 'NZF_4473', alt: 'Tatra Mountains rock detail' },
];

const currentIndex = ref(0);
const currentSlide = ref(slides[0]);
const nextSlide = ref(null);
const slidingDirection = ref('');
const isAnimating = ref(false);
const isLoading = ref(false);

const preload = (name) => new Promise((resolve) => {
  const { src } = srcsetFor(name, { widths: [960], format: 'avif' });
  if (!src) return resolve();
  const img = new Image();
  img.onload = resolve;
  img.onerror = resolve;
  img.src = src;
});

const advance = async (dir) => {
  if (isAnimating.value || isLoading.value) return;
  isLoading.value = true;
  const newIndex = (currentIndex.value + (dir === 'left' ? 1 : -1) + slides.length) % slides.length;
  const target = slides[newIndex];
  await preload(target.name);
  nextSlide.value = target;
  slidingDirection.value = dir;
  isAnimating.value = true;
  isLoading.value = false;
};

const nextImg = () => advance('left');
const prevImg = () => advance('right');

const handleAnimationEnd = () => {
  currentIndex.value = (currentIndex.value + (slidingDirection.value === 'left' ? 1 : -1) + slides.length) % slides.length;
  currentSlide.value = nextSlide.value;
  nextSlide.value = null;
  isAnimating.value = false;
  slidingDirection.value = '';
};

onMounted(() => {
  // Warm the cache for the immediately-next slide so the first click is snappy.
  preload(slides[1].name);
});
</script>

<template>
  <div class="home-gallery__welcome-section">
    <h2 class="home-gallery__title">Coś więcej niż dom. . .</h2>
  </div>
  <section class="home-gallery">
    <div class="image-wrapper">
      <div class="image-container">
        <div class="slide" :class="{
          'slide-out-left': slidingDirection === 'left',
          'slide-out-right': slidingDirection === 'right',
        }">
          <PictureImg
            :name="currentSlide.name"
            :alt="currentSlide.alt"
            :widths="[480, 960, 1440]"
            sizes="100vw"
            loading="eager"
            fetchpriority="high"
            img-class="slide-image" />
        </div>

        <div v-if="nextSlide" class="slide" :class="{
          'slide-in-right': slidingDirection === 'left',
          'slide-in-left': slidingDirection === 'right',
        }" @animationend="handleAnimationEnd">
          <PictureImg
            :name="nextSlide.name"
            :alt="nextSlide.alt"
            :widths="[480, 960, 1440]"
            sizes="100vw"
            loading="eager"
            img-class="slide-image" />
        </div>
      </div>

      <button @click="prevImg" class="home-gallery-btn" id="prev-img-btn" aria-label="Poprzednie zdjęcie">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="arrow">
          <path fill-rule="evenodd"
            d="M7.72 12.53a.75.75 0 0 1 0-1.06l7.5-7.5a.75.75 0 1 1 1.06 1.06L9.31 12l6.97 6.97a.75.75 0 1 1-1.06 1.06l-7.5-7.5Z"
            clip-rule="evenodd" />
        </svg>
      </button>
      <button @click="nextImg" class="home-gallery-btn" id="next-img-btn" aria-label="Następne zdjęcie">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path fill-rule="evenodd"
            d="M16.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 0 1-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 0 1 1.06-1.06l7.5 7.5Z"
            clip-rule="evenodd" />
        </svg>
      </button>
    </div>
  </section>
</template>

<style scoped>
.home-gallery {
  background-color: transparent;
  width: 100%;
  aspect-ratio: 16 / 10;
  position: relative;
  overflow: hidden;
}

.image-wrapper {
  position: relative;
  display: block;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.image-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.home-gallery__welcome-section {
  padding-top: 4rem;
  padding-bottom: 4rem;
  background-color: var(--clr-light);
}

.home-gallery__title {
  font-family: 'Playfair Display', serif;
  text-align: center;
  font-size: var(--size-2xl);
  color: var(--clr-warm-beige-400);
  padding: 0 2rem;
  text-transform: uppercase;
}

.home-gallery-btn {
  display: inline-block;
  position: absolute;
  font-weight: 600;
  text-decoration: none;
  letter-spacing: +0.05rem;
  background-color: transparent;
  padding: 0.5em 1em;
  transition: transform 0.3s, color 0.3s, background-color 0.3s;
  border: none;
  color: var(--clr-light);
  z-index: 2;
  height: 100%;
  width: 125px;
}

#prev-img-btn { top: 0; left: 0; }
#next-img-btn { top: 0; right: 0; }
#prev-img-btn:hover { transform: translateX(-5px); cursor: pointer; }
#next-img-btn:hover { transform: translateX(5px); cursor: pointer; }
.home-gallery-btn:hover { color: gold; }

.slide {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.slide :deep(picture) {
  display: block;
  width: 100%;
  height: 100%;
}

.slide-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  background: var(--clr-dark);
  display: block;
}

@keyframes slideOutLeft {
  from { transform: translateX(0); }
  to { transform: translateX(-100%); }
}
@keyframes slideInRight {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}
@keyframes slideOutRight {
  from { transform: translateX(0); }
  to { transform: translateX(100%); }
}
@keyframes slideInLeft {
  from { transform: translateX(-100%); }
  to { transform: translateX(0); }
}

.slide-out-left { animation: slideOutLeft 0.5s forwards; }
.slide-in-right { animation: slideInRight 0.5s forwards; }
.slide-out-right { animation: slideOutRight 0.5s forwards; }
.slide-in-left { animation: slideInLeft 0.5s forwards; }

.slide-out-left, .slide-out-right { z-index: 2; }
.slide-in-left, .slide-in-right { z-index: 1; }

@media (min-width: 640px) {
  .home-gallery__title { font-size: var(--size-3xl); }
}

@media (min-width: 1024px) {
  .home-gallery {
    aspect-ratio: auto;
    height: 100vh;
  }
  .home-gallery__welcome-section {
    padding-top: 5rem;
    padding-bottom: 5rem;
  }
  .home-gallery__title { font-size: var(--size-4xl); }
}
</style>
