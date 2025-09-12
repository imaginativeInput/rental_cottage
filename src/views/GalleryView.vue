<script setup>
import { ref, computed, onMounted } from 'vue';

import Header from '@/components/Header.vue';

import table01 from '@/assets/gallery/Mobile-livingroom03.jpg';
import livingRoom01 from '@/assets/gallery/living-room01.jpg';
import livingRoom02 from '@/assets/gallery/livingroom02.jpg';
import kitchen01 from '@/assets/gallery/kitchen01.jpg';
import kitchen02 from '@/assets/gallery/kitchen02.jpg';
import bedroom01 from '@/assets/gallery/bedroom01.jpg';
import bedroom02 from '@/assets/gallery/bedroom02.jpg';
import benches from '@/assets/gallery/fireplace02.jpg';
import balcony01 from '@/assets/gallery/balcony02.jpg';

import tatraMountains from '@/assets/gallery/NZF_4359.jpg';
import tatraMountainsGreen from '@/assets/gallery/NZF_4358.jpg';
import tatraMountainsClean from '@/assets/gallery/NZF_4473.jpg';
import tatraMountainsCleanOrange from '@/assets/gallery/NZF_4375.jpg';
import tatraMountainsHousePanorama from '@/assets/gallery/NZF_4268-fixed.png';
import tatraMountainsClouds from '@/assets/gallery/NZF_4513.jpg';

// Balcony
import balconyPurpleSky from '@/assets/gallery/purple-sky.jpg';
import balconySunset from '@/assets/gallery/balcony-sunset.jpg';

const imgs = [
  tatraMountainsCleanOrange,
  table01, kitchen02, balcony01,
  livingRoom02,
  tatraMountains, tatraMountainsGreen, tatraMountainsClouds, tatraMountainsClean,
  balconySunset, balconyPurpleSky,
  benches, tatraMountainsHousePanorama
];

const isHovered = ref(false);

const elementStyle = computed(() => ({
  backgroundColor: isHovered.value ? 'rgba(0, 0, 0, 0.5)' : '#2980b9',
  color: isHovered.value ? '#fff' : '#eee',
  borderRadius: '8px',
  border: 'transparent',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
}))


const viewerSrc = ref('');
const viewerVisible = ref(false);

const showImage = (src) => {
  viewerSrc.value = src;
  viewerVisible.value = true;
};

const closeViewer = () => {
  viewerVisible.value = false;
};
</script>

<template>

  <span id="close" @click="closeViewer" v-if="viewerVisible">&times;</span>

  <!-- Lightbox -->
  <div v-if="viewerVisible" class="lightbox" @click="closeViewer">
    <img :src="viewerSrc" alt="A gallery image">
  </div>

  <Header :isLightTheme="true" />
  <div class="gallery__body" id="galeria">
    <h1 class="gallery__title">Galeria</h1>
    <div class="gallery__img-grid">
      <div v-for="(img, index) in imgs" :key="index" 
      :class="[`img-${index}`, 'img-container', { expanded: expandedIndex === index }]"
      class="gallery-item"
      :id="`img-${index}`"
      @click="showImage(img)">
        <img :src="img" alt="image" :style="elementStyle">
    </div>
  </div>

  </div>
</template>


<style>
.lightbox {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10002;
}

.lightbox img {
  max-width: 90%;
  max-height: 90%;
  border-radius: 8px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
}

.lightbox .close {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  text-decoration: none;
}


.img-container:hover .img-overlay {
  opacity: 1;
  cursor: pointer;
}

.gallery__title {
  font-family: 'Playfair Display', serif;
  color: var(--clr-warm-beige-400);
  width: 100%;
  font-size: var(--size-8xl);
  justify-self: center;
  padding-top: 5rem;
  padding-bottom: 1rem;
}

.gallery__body {
  background-color: var(--clr-light);
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  text-align: center;
  align-items: center;
}

.gallery-item {
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease-in-out;
  border-radius: 0.7rem;
  grid-column: span 1;
  border: 6px solid transparent;
}

.gallery-item:hover {
  transform: scale(1.015);
  box-shadow: 1rem 1rem 1rem 0 (0, 0, 0, 1);
  border: 5px solid white;
}

.gallery-item.expanded {
  z-index: 10;
}

.gallery-item img {
  width: 100%;
  height: 100%;
}



.gallery__img-grid {
  display: grid;
  grid-template-columns: 400px;
  grid-template-rows: 300px;
  background-color: var(--clr-light);
  margin-bottom: 5rem;
}

#close {
  position: fixed;
  top: 0.5rem;
  right: 1rem;
  color: var(--clr-light);
  font-size: 3.5rem;
  z-index: 10003;
}

#close:hover,
#close:focus {
  cursor: pointer;
  opacity: 0.6;
}

@media (min-width: 475px) {
  .gallery__img-grid {
    grid-template-columns: 450px;
    grid-template-rows: 335px;
  }
}

@media (min-width: 640px) {
  .gallery__img-grid {
    grid-template-columns: 600px;
    grid-template-rows: 450px;
  }
}

@media (min-width: 768px) {
  .gallery__img-grid {
    grid-template-columns: 700px;
    grid-template-rows: 525px;
  }
}

@media (min-width: 1024px) {
  .gallery__img-grid {
    grid-template-columns: 300px 300px 300px;
    grid-template-rows: 225px 225px 225px 225px 225px;
  }

  .img-0 {
    grid-row: span 2;
    grid-column: span 3;
  }

  .img-1 {
    grid-row: span 1;
    grid-column: span 1;
  }


  .img-3 {
    grid-row: 3 / 3;
    grid-column: 1;

  }

  .img-4 {
    grid-row: 4 / 4;
    grid-column: 1;
  }

  .img-5 {
    grid-row: 5 / 6;
    grid-column: 1 / 2;
  }

  .img-6 {
    grid-column: span 2;
    grid-row: span 2;
  }

  .img-7 {
    grid-column: span 2;
    grid-row: span 2;
  }

  .img-8 {
    grid-column: span 1;
  }

  .img-9 {
    grid-column: span 1;
    grid-row: span 1;
  }

  .img-10 {
    grid-column: span 1;
  }

  .img-11 {
    grid-column: span 2;
  }

  .img-12 {
    grid-column: span 3;
    grid-row: span 2;
  }
}

@media (min-width: 1280px) {
  .gallery__img-grid {
    grid-template-columns: 400px 400px 400px;
    grid-template-rows: 300px;
  }
}

@media (min-width: 1536px) {
  .gallery__img-grid {
    grid-template-columns: 475px 475px 475px;
    grid-template-rows: 325px;
  }
}

@media screen and (orientation: portrait) {
  /* #image-viewer img {
    width: 100%;
    height: auto;
  } */
}

@media screen and (orientation: landscape) {
  /* #image-viewer img {
    width: 90%;
    height: auto;
  } */
}
</style>