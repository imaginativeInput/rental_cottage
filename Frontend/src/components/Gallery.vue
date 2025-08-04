<script setup>
import { ref } from 'vue';

import kitchen from '@/assets/gallery/kitchen-new.jpg';
import bathroom from '@/assets/gallery/bathroom01-fhd.png';
import livingRoom from '@/assets/gallery/living-room02.jpg';
import villageSunset from '@/assets/village-sunset.jpg';

const homeGalleryImages = {
  livingRoom: { img: livingRoom, description: 'Living room image' },
  kitchen: { img: kitchen, description: 'Kitchen image' },
  bathroom: { img: bathroom, description: 'Bathroom image' },
  // benches: { img: benches, description: 'Fireplace with a mountain view image' },
  villageSunset: { img: villageSunset, description: 'Sunset in Tatra Mountain village' },
};

const imgs = Object.keys(homeGalleryImages);
const currentIndex = ref(0);
const currentImg = ref(homeGalleryImages[imgs[currentIndex.value]].img);

// TEST
const nextImgPath = ref(null);
const slidingDirection = ref('');
const isAnimating = ref(false);
let nextIndex = 0;

const nextImg = () => {
  if (isAnimating.value) return;
  isAnimating.value = true;
  slidingDirection.value = 'left';
  nextIndex = (currentIndex.value + 1) % imgs.length;
  nextImgPath.value = homeGalleryImages[imgs[nextIndex]].img;
}

const prevImg = () => {
  if (isAnimating.value) return;
  isAnimating.value = true;
  slidingDirection.value = 'right';
  nextIndex = (currentIndex.value - 1 + imgs.length) % imgs.length;
  nextImgPath.value = homeGalleryImages[imgs[nextIndex]].img;
};

const handleAnimationEnd = () => {
  currentIndex.value = nextIndex;
  currentImg.value = nextImgPath.value;
  nextImgPath.value = null;
  isAnimating.value = false;
  slidingDirection.value = '';
};
</script>

<template>
  <div class="home-gallery__welcome-section">
    <h2 class="home-gallery__title">Coś więcej niż dom. . .</h2>
  </div>
  <section class="home-gallery">
    <div class="image-wrapper">
      <div class="image-container">
        <img :src="currentImg" alt="Current Image" class="slide-image" :class="{
          'slide-out-left': slidingDirection === 'left',
          'slide-out-right': slidingDirection === 'right'
        }">

        <img v-if="nextImgPath" class="slide-image" :src="nextImgPath" alt="Next" :class="{
          'slide-in-right': slidingDirection === 'left',
          'slide-in-left': slidingDirection === 'right'
        }" @animationend="handleAnimationEnd">
      </div>

      <button @click="prevImg" class="home-gallery-btn" id="prev-img-btn">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="arrow">
          <path fill-rule="evenodd"
            d="M7.72 12.53a.75.75 0 0 1 0-1.06l7.5-7.5a.75.75 0 1 1 1.06 1.06L9.31 12l6.97 6.97a.75.75 0 1 1-1.06 1.06l-7.5-7.5Z"
            clip-rule="evenodd" />
        </svg>
      </button>
      <button @click="nextImg" class="home-gallery-btn" id="next-img-btn">
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
  /* background-color: var(--clr-light); */
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
  /* color: var(--clr-slate600); */

  padding: 0 2rem;
  text-transform: uppercase;
}

.image-wrapper {
  position: relative;
  display: inline-block;
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

#prev-img-btn {
  top: 0;
  left: 0;
  transition: transform 0.3s;
}

#next-img-btn {
  top: 0;
  right: 0;
  transform: transform 0.3s;
}

#prev-img-btn:hover {
  transform: translateX(-5px);
}

#next-img-btn:hover {
  transform: translateX(5px);
}


.home-gallery__img {
  width: 100vw;
  height: 100vh;
  object-fit: cover;
}

/* TEST */
.image-wrapper {
  overflow: hidden;
  width: 100vw;
  /* height: 100vh; */
  /* height: calc(100vh - 65px); */
}

.slide-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  object-fit: cover;
}

@keyframes slideOutLeft {
  from {
    transform: translateX(0);
  }

  to {
    transform: translateX(-100%);
  }
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
  }

  to {
    transform: translateX(0);
  }
}

@keyframes slideOutRight {
  from {
    transform: translateX(0);
  }

  to {
    transform: translateX(100%);
  }
}

@keyframes slideInLeft {
  from {
    transform: translateX(-100%);
  }

  to {
    transform: translateX(0);
  }
}

.slide-out-left {
  animation: slideOutLeft 0.5s forwards;
}

.slide-in-right {
  animation: slideInRight 0.5s forwards;
}

.slide-out-right {
  animation: slideOutRight 0.5s forwards;
}

.slide-in-left {
  animation: slideInLeft 0.5s forwards;
}


#prev-img-btn {
  left: 0;
}

#next-img-btn {
  right: 0;
}

.home-gallery-btn:hover {
  cursor: pointer;
  color: gold;
}


/* MEDIA */
@media (min-width: 640px) {
  .home-gallery__title {
    font-size: var(--size-3xl);
  }
}

@media (min-width: 1024px) {
  .home-gallery__welcome-section {
    padding-top: 5rem;
    padding-bottom: 5rem;
  }

  .home-gallery__title {
    font-size: var(--size-4xl);
  }
}
</style>