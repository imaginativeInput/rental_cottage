import './assets/main.css'
import 'v-calendar/style.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { setupCalendar, Calendar, DatePicker } from 'v-calendar'
import { createI18n } from 'vue-i18n'

import App from './App.vue'
import router from './router'

const i18n = createI18n({
  legacy: false,
  locale: 'pl-PL',
  // locale: 'en-US',
  fallbackLocale: 'pl-PL',
  messages: {
    'pl-PL': {
      about: 'O nas',
      gallery: 'Galeria',
      contact: 'Kontakt',
      reservation: 'Rezerwacja',
      call: 'Zadzwoń',
      homepage: 'Strona główna',
      navigate: 'Dojazd',
      anyQuestions: 'Masz pytania?',
      messageUs: 'Napisz do nas!',
      message: 'Wiadomość',
      confirm: 'potwierdź',
      sign: 'znak',
    },
    'en-US': {
      about: 'About us',
      gallery: 'Gallery',
      contact: 'Contact',
      reservation: 'Reservation',
      call: 'Call',
      homepage: 'Homepage',
      navigate: 'Navigate',
      anyQuestions: 'Have any questions?',
      messageUs: 'Message us!',
      message: 'Message',
      confirm: 'confirm',
      sign: 'sign',
    },
  },
})

const app = createApp(App)

app.use(i18n)
app.use(createPinia())
app.use(router)
app.use(setupCalendar, {})
app.component('VCalendar', Calendar)
app.component('VDatePicker', DatePicker)

app.mount('#app')
