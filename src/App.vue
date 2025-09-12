<script setup>
import axios from 'axios';

import { RouterLink, RouterView } from 'vue-router'
import { ref, onMounted } from 'vue';
import Footer from '@/components/Footer.vue'
import { useI18n } from 'vue-i18n';

const message = ref('');

onMounted(async () => {
  // const response = await axios.get('https://127.0.0.1:8000/api/data');
  const response = await axios.get('/api/data');
  message.value = response.data.message;

});
</script>

<template>
  <RouterView />
  <Footer />
</template>

<style scoped></style>
