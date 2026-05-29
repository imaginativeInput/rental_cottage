import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  // vue-i18n production feature flags. The app is composition-API only
  // (createI18n legacy:false, useI18n) and uses no <i18n-t>/<i18n-n> components
  // or global $t, so the legacy API, full-install component registration, and
  // prod devtools are all dead weight. We deliberately KEEP the message
  // compiler: messages are passed to createI18n as plain strings, which the
  // runtime must compile on demand — dropping it (or aliasing to the
  // runtime-only build) makes vue-i18n throw "unhandled node type: 0" at render.
  define: {
    __VUE_I18N_FULL_INSTALL__: 'false',
    __VUE_I18N_LEGACY_API__: 'false',
    __INTLIFY_PROD_DEVTOOLS__: 'false',
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    // Keep small variants out of JS bundles so they cache as separate files.
    assetsInlineLimit: 0,
    rollupOptions: {
      output: {
        // Split the rarely-changing framework into a long-cached vendor chunk so
        // app-code edits don't bust its cache on repeat visits.
        manualChunks: {
          vendor: ['vue', 'vue-router', 'pinia', 'vue-i18n'],
        },
      },
    },
  },
})
