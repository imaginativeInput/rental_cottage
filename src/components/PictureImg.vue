<script setup>
import { computed } from 'vue'
import { srcsetFor } from '@/utils/responsiveImages'

const props = defineProps({
  name: { type: String, required: true },
  alt: { type: String, required: true },
  sizes: { type: String, default: '(min-width: 1024px) 33vw, 100vw' },
  widths: { type: Array, default: () => [480, 960, 1440] },
  format: { type: String, default: 'avif' },
  loading: { type: String, default: 'lazy' },
  fetchpriority: { type: String, default: 'auto' },
  imgClass: { type: [String, Array, Object], default: '' },
})

const sources = computed(() =>
  srcsetFor(props.name, { widths: props.widths, format: props.format })
)
</script>

<template>
  <picture v-if="sources.src">
    <source :type="sources.type" :srcset="sources.srcset" :sizes="sizes" />
    <img
      :src="sources.src"
      :srcset="sources.srcset"
      :sizes="sizes"
      :alt="alt"
      :loading="loading"
      :fetchpriority="fetchpriority"
      :class="imgClass"
      decoding="async"
    />
  </picture>
</template>
