<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';

import Header from '@/components/Header.vue';

const fullImgs = import.meta.glob('@/assets/gallery/*.avif', { eager: true, import: 'default' });
const smallImgs = import.meta.glob('@/assets/gallery/*_small.{jpg,png}', { eager: true, import: 'default' });

const imgOrder = [
  'NZF_4375',
  'Mobile-livingroom03',
  'Mobile-kitchen02',
  'Mobile-livingroom-balcony01',
  'livingroom02',
  'outside01',
  'NZF_4358',
  'NZF_4513',
  'NZF_4473',
  'bedroom01',
  'Mobile-balcony-livingroom01',
  'fireplace02',
  'NZF_4359',
];


const fullImgKeys = Object.keys(fullImgs);
const smallImgKeys = Object.keys(smallImgs);

const windowSize = 10;
const startIndex = ref(0);

const displayedImages = computed(() => {
  return Array.from({ length: windowSize }, (_, i) => {
    return imgOrder[(startIndex.value + i) % imgOrder.length];
  });
});

function next() {
  startIndex.value = (startIndex.value + 1) % imgOrder.length;
}

function prev() {
  startIndex.value = (startIndex.value - 1 + imgOrder.length) % imgOrder.length;
}


const expandedIndex = ref(null);
const viewerSrc = ref('');
const viewerVisible = ref(false);
const isHovered = ref(false);
const currentViewerIndex = ref(0);

const processedImgs = computed(() => {
  return imgOrder.map((name, index) => {
    const fullKey = fullImgKeys.find(key => key.includes(`/${name}.avif`));
    const smallKey = smallImgKeys.find(key => key.includes(`/${name}_small.`));

    const originalUrl = fullKey ? fullImgs[fullKey] : null;
    const smallUrl = smallKey ? smallImgs[smallKey] : null;

    if (!smallUrl) {
      console.warn(`[BUILD_DEBUG] No small image found for: ${name}`);
    }

    return {
      original: originalUrl,
      bgUrl: smallUrl,
      name: name,
      index: index,
    };
  });
});

const getImageByName = (name) => {
  const fullKey = fullImgKeys.find(key => key.includes(`/${name}.avif`));
  return fullKey ? fullImgs[fullKey] : null;
};

const nextImg = () => {
  currentViewerIndex.value = (currentViewerIndex.value + 1) % imgOrder.length;
  const nextImgName = imgOrder[currentViewerIndex.value];
  viewerSrc.value = getImageByName(nextImgName);
  startIndex.value = currentViewerIndex.value;
}

const prevImg = () => {
  currentViewerIndex.value = (currentViewerIndex.value - 1 + imgOrder.length) % imgOrder.length;
  const prevImgName = imgOrder[currentViewerIndex.value];
  viewerSrc.value = getImageByName(prevImgName);
  startIndex.value = currentViewerIndex.value;
}

const goToImage = (index) => {
  currentViewerIndex.value = index;
  const imgName = imgOrder[index];
  viewerSrc.value = getImageByName(imgName);
  startIndex.value = index;
}


const elementStyle = computed(() => ({
  backgroundColor: isHovered.value ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0)',
  color: isHovered.value ? '#fff' : '#eee',
  borderRadius: '8px',
  border: 'transparent',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
}))


const showImage = (src, index) => {
  viewerSrc.value = src;
  currentViewerIndex.value = index;
  startIndex.value = index;
  viewerVisible.value = true;
};
const closeViewer = () => {
  viewerVisible.value = false;
};

const handleKeydown = (e) => {
  if (!viewerVisible.value) return
  if (e.key === 'ArrowLeft') prevImg()
  if (e.key === 'ArrowRight') nextImg()
}

onMounted(() => window.addEventListener('keydown', handleKeydown))
onUnmounted(() => window.removeEventListener('keydown', handleKeydown))

const vIntersect = {
  mounted(el) {
    const observer = new IntersectionObserver((entires) => {
      entires.forEach(entry => {
        if (entry.isIntersecting) {
          const img = el.querySelector('img');
          const onLoad = () => {
            el.classList.add('loaded');
            observer.unobserve(el);
          };

          if (img.complete) {
            onLoad();
          } else {
            img.addEventListener('load', onLoad);
          }
        }
      })
    }, { threshold: 0.1 });
    observer.observe(el);
  }
}
</script>

<template>
  <div class="gallery-container" style="overflow: hidden">
    <span id="close" @click="closeViewer" v-if="viewerVisible">&times;</span>
    <div v-if="viewerVisible" id="lightbox" class="lightbox">
      <img :src="viewerSrc" id="img-big" alt="A gallery image" loading="lazy">

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

      <div id="small-img-grid" class="small-img-grid">
        <div v-for="(imgName, i) in displayedImages" :key="i" class="img-item"
          :class="{ 'active-thumb': imgOrder.indexOf(imgName) === currentViewerIndex }">
          <img :src="getImageByName(imgName)" class="img-viewer-small-img"
            alt="thumbnail" @click="goToImage(imgOrder.indexOf(imgName))">
        </div>
      </div>
    </div>

    <Header :isLightTheme="true" />
    <div class="gallery__body" id="galeria">
      <h1 class="gallery__title">Galeria</h1>
      <div class="gallery__img-grid">
        <div v-for="(img, index) in processedImgs" :key="index"
          :class="[`img-${index}`, 'img-container', { expanded: expandedIndex === index }]" class="gallery-item"
          :id="`img-${index}`" @click="showImage(img.original, index)" :style="{
            backgroundImage: `url(${img.bgUrl})`
          }" v-intersect>
          <img :src="img.original" :alt="img.name" :style="elementStyle" loading="lazy">
        </div>
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
  background: rgba(0, 0, 0, 1);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10002;
}

.lightbox #img-big {
  max-width: 90%;
  max-height: 90%;
  border-radius: 2px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
  margin-bottom: 2rem;
}

.lightbox .close {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  text-decoration: none;
}

.small-img-grid {
  display: grid;
  grid-template-columns: repeat(10, 1rem);
  position: absolute;
  bottom: 0rem;
  left: 50%;
  transform: translateX(-50%) scale(3);
  background-color: black;
  gap: 0.1rem;
}

.img-viewer-small-img img {
  width: 100%;
  height: auto;
}

.img-viewer-small-img:hover {
  cursor: pointer;
}

.img-item.active-thumb {
  border: 2px solid var(--clr-warm-beige-400);
  border-radius: 2px;
}

/* NEXT/PREV IMG BUTTON */
.home-gallery-btn {
  display: inline-block;
  position: fixed;
  font-weight: 600;
  text-decoration: none;
  letter-spacing: +0.05rem;

  background-color: transparent;

  padding: 0.5em 1em;
  padding-inline: 0;

  transition: transform 0.3s, color 0.3s, background-color 0.3s;
  border: none;
  color: rgba(235, 235, 235, 0.65);
  z-index: 10004;

  height: 100%;
  width: 125px;
}

.home-gallery-btn:hover {
  color: var(--clr-warm-beige-400);
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
  cursor: pointer;
}

#next-img-btn:hover {
  transform: translateX(5px);
  cursor: pointer;
}

/* NEXT/PREV IMG BUTTON END */


.gallery-item {
  background-repeat: no-repeat;
  background-size: cover;
}

.gallery-item::before {
  content: '';
  position: absolute;
  inset: 0;
  opacity: 0;
  animation: pulse 3.5s infinite;
  background-color: rgba(0, 0, 0);
}

.gallery-item.loaded::before {
  animation: none;
  content: none;
}

.gallery-item img {
  opacity: 0;
  transition: opacity 250ms ease-in-out;
}

.gallery-item.loaded img {
  opacity: 1;
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
  right: 2rem;

  color: rgba(235, 235, 235, 0.65);
  font-size: 3.5rem;
  z-index: 10003;
}

#close:hover,
#close:focus {
  cursor: pointer;
  /* opacity: 0.6; */
  color: var(--clr-warm-beige-400)
}

@keyframes pulse {
  0% {
    opacity: 0;
  }

  50% {
    opacity: 0.35;
  }

  100% {
    opacity: 0;
  }
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