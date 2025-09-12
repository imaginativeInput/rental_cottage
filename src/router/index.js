import { createRouter, createWebHistory } from 'vue-router'
import { usePageStore } from '@/stores/isHomeStore'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/galeria',
      name: 'gallery',
      component: () => import('../views/GalleryView.vue'),
    },
  ],
})

router.beforeEach((to, from, next) => {
  const pageStore = usePageStore();
  
  pageStore.setHome(to.name === 'home');

  next();
})

export default router
