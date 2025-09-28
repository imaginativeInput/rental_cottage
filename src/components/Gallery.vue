<script setup>
import { ref, onMounted, computed } from 'vue';

import benches from '@/assets/gallery/fireplace02.avif';
import livingRoom from '@/assets/gallery/livingroom05-best.avif';
import room01 from '@/assets/gallery/bedroom01.avif';
import panorama01 from '@/assets/NZF_4359.avif';
import night01 from '@/assets/gallery/NZF_4375.avif';
import parkingLot from '@/assets/gallery/outside01.avif';
import rockMountains from '@/assets/gallery/NZF_4473.avif';


// ADDED CONTENT
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

const processedImgs = computed(() => {
  return imgOrder.map(name => {
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
    };
  });
});
// ADDED CONTENT END


const homeGalleryImages = {
  benches01: { img: benches, description: 'Fireplace and benches outside with Tatra Mountains view' },
  livingRoom01: { img: livingRoom, description: 'Kitchen image' },
  room01: { img: room01, description: 'Bathroom image' },
  panorama01: { img: panorama01, description: 'Sunset in Tatra Mountain village' },
  night01: { img: night01, description: 'Tatra Mountains panorama at night with moon shining above' },
  parkingLot: { img: parkingLot, description: 'Parking lot view from rental cottage with beautiful Tatra Mountains panorama' },
  rockMountains: { img: rockMountains, description: 'Tatra Mountains with great rock detail visible from the cottage' },

};

const imgs = Object.keys(homeGalleryImages);
const currentIndex = ref(0);
const currentImg = ref(homeGalleryImages[imgs[currentIndex.value]].img);

// TEST
const nextImgPath = ref(null);
const slidingDirection = ref('');
const isAnimating = ref(false);
let nextIndex = 0;

// ADDED
const isLoading = ref(false);
const loadImage = (src) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = src;
    img.onload = resolve;
  })
}
// ADDED^

const nextImg = async () => {
  if (isAnimating.value || isLoading.value) return;
  isLoading.value = true;

  nextIndex = (currentIndex.value + 1) % imgs.length;
  const newImg = homeGalleryImages[imgs[nextIndex]].img;

  await loadImage(newImg);

  nextImgPath.value = newImg;
  slidingDirection.value = 'left';
  isAnimating.value = true;
  isLoading.value = false;
}

const prevImg = async () => {
  if (isAnimating.value || isLoading.value) return;
  isLoading.value = true;

  nextIndex = (currentIndex.value - 1 + imgs.length) % imgs.length;
  const newImg = homeGalleryImages[imgs[nextIndex]].img;

  await loadImage(newImg);

  nextImgPath.value = homeGalleryImages[imgs[nextIndex]].img;  
  slidingDirection.value = 'right';
  isAnimating.value = true;
  isLoading.value = false;
};

const handleAnimationEnd = () => {
  currentIndex.value = nextIndex;
  currentImg.value = nextImgPath.value;
  nextImgPath.value = null;
  isAnimating.value = false;
  slidingDirection.value = '';
};

// LAZY LOADING WIP
// const processedImgs = computed(() =>
//   imgs.map(img => {
//     const ext = img.split(".").pop();
//     const noExt = img.slice(0, -(ext.length + 1));
//     return {
//       original: img,
//       bgUrl: `${noExt}_small.${ext}`,
//     };
//   })
// );

const galleryItems = ref([])

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


onMounted(() => {
  imgs.forEach(key => {
    const img = new Image();
    img.src = homeGalleryImages[key].img;
  });

  // LAZY LOADING WIP
    galleryItems.value.forEach((item) => {
    const imgToLoad = item.querySelector('img');
    const loaded = () => item.classList.add('loaded');

    if (img.complete) {
      loaded();
    } else {
      imgToLoad.addEventListener('load', loaded);
    }
  })
});
</script>

<template>
  <div class="home-gallery__welcome-section">
    <h2 class="home-gallery__title">Coś więcej niż dom. . .</h2>
  </div>
  <section class="home-gallery">
    <div class="image-wrapper gallery-item" v-intersect>
      <div class="image-container">
        <img :src="currentImg" alt="Current Image" class="slide-image" :class="{
          'slide-out-left': slidingDirection === 'left',
          'slide-out-right': slidingDirection === 'right'
        }"
        loading="lazy"
        >

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
/* LAZY LOADING START */
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
/* LAZY LOADING END */

.home-gallery {
  background-color: transparent;
  height: 100vh;
  position: relative;

  width: 100vw;
  overflow: hidden;
}

.image-wrapper {
  position: relative;
  display: inline-block;
  width: 100vw;
  height: 100%;
  position: relative;
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
}

.slide-image {
  position: absolute;
  top: 0;
  left: 0;

  width: 100%;
  height: 100%;
  object-fit: contain;
  background: var(--clr-dark);
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

.slide-out-left,
.slide-out-right {
  z-index: 2;
}

.slide-in-left,
.slide-in-right {
  z-index: 1;
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