<script setup>
import { ref, onMounted, onUnmounted, computed } from "vue";
import { useScreens } from 'vue-screen-utils';

import { useI18n } from 'vue-i18n';
import { useGuestStore } from '@/stores/guestStore';
import { dateRange, sendReservationRequest } from '@/utils/reservationRequest';

// Regex patterns
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\+\d{1,3}(\s?\d{3}){2,3}$/

// Use shared guest store
const guestStore = useGuestStore();

// Form state
const email = ref("");
const phone = ref("");
const questions = ref("");

// Computed properties
const isEmailValid = computed(() => emailRegex.test(email.value))
const isPhoneValid = computed(() => phoneRegex.test(phone.value))

// Config
const maxChars = 300;
const { t } = useI18n();

// Calendar adjustments
const { mapCurrent } = useScreens({
  xs: '0px',
  sm: '550px',
  md: '768px',
  lg: '1024px',
});
const columns = mapCurrent({ sm: 1 }, 1);
const columnsWide = mapCurrent({ sm: 2 }, 2);
const expanded = ref(null);
const attrs = ref([
  {
    key: 'Any',
    dot: true,
    dates: new Date(),
    expanded: true,
  }
]);
const userLocale = ref('pl-PL');

const width = ref(window.innerWidth);
const updateWidth = () => {
  width.value = window.innerWidth;
  if (width.value >= 550) {
    expanded.value = mapCurrent({ lg: false }, true);
  } else {
    expanded.value = null;
  }
};

onMounted(() => {
  window.addEventListener('resize', updateWidth); {
    updateWidth();
  }
})

onUnmounted(() => {
  window.removeEventListener('resize', updateWidth);
})
</script>

<template>
  <section class="reservation" id="reservation-section">
    <div class="reservation-card">
      <h2 class="reservation-title">Rezerwacja</h2>

      <div class="reservation-form">
        <!-- Top row: Number of People, Email, Phone -->
        <div class="form-row">
          <div class="form-group">
            <label for="people">Liczba Osób</label>
            <select id="people" v-model="guestStore.peopleCount" class="form-input">
              <option v-for="n in 13" :key="n" :value="n">{{ n }}</option>
            </select>
          </div>

          <div class="form-group">
            <label for="email" style="display: flex; flex-direction: row;">Email<p style="color:red; font-weight: 200;">*</p></label>
            <input id="email" type="email" v-model="email" placeholder="example@email.com" class="form-input" />
            <p v-if="email && !isEmailValid" style="color:red;">Nieprawidłowy email</p>
          </div>

          <div class="form-group">
            <label for="phone" style="display: flex; flex-direction: row;">Numer telefonu<p style="color:red; font-weight: 200;">*</p></label>
            <input id="phone" type="tel" v-model="phone" placeholder="+48 123 456 789" class="form-input" />
            <p v-if="phone && !isPhoneValid" style="color:red;">Nieprawidłowy numer telefonu</p>
          </div>
        </div>

        <!-- Full-width Calendar -->
        <div class="form-group full-width">
          <label>Wybierz Datę</label>
          <VDatePicker v-if="width < 550" :min-date="new Date()" :columns="columns" :attributes="attrs" :expanded="null"
            :locale="userLocale" v-model.range="dateRange" :masks="masks" class="my-custom-datepicker" />
          <VDatePicker v-else :min-date="new Date()" :columns="columnsWide" :attributes="attrs" :expanded="expanded"
            :locale="userLocale" v-model.range="dateRange" :masks="masks" class="my-custom-datepicker" />

        </div>

        <!-- Full-width Questions -->
        <div class="form-group full-width form-textarea">
          <label for="questions">Zadaj pytanie!</label>
          <textarea id="message" v-model="questions" :maxlength="maxChars" placeholder="Jakieś pytania? Napisz a rozwiejemy wątpliwości."
            class="form-input"></textarea>
          <small class="char-counter">{{ questions.length }} / {{ maxChars }}</small>
        </div>

        <!-- Full-width Submit Button -->
        <div class="form-group full-width">
          <button class="submit-btn" @click="sendReservationRequest('email', 'phone', 'message')">{{
          t('confirm') }}</button>
        </div>
      </div>
    </div>

  </section>
</template>

<style scoped>
/* Section container */
.reservation {
  background-color: var(--clr-slate200);
}

.reservation-card {
  max-width: 900px;
  margin: 0 auto;
  padding-left: 1rem;
  padding-right: 1rem;
  padding-top: 2rem;
  padding-bottom: 2rem;
  background-color: var(--clr-light);
  border-radius: 1rem;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.05);
}

.reservation-title {
  text-align: center;
  margin-bottom: 2rem;
  font-size: 1.8rem;
  color: #333;
  text-transform: uppercase;
}

/* Form layout */
.reservation-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

@media (min-width: 768px) {
  .form-row {
    grid-template-columns: 1fr 1fr 1fr;
    /* 3 columns for desktop/tablets */
  }
}

/* Form groups */
.form-group {
  display: flex;
  flex-direction: column;
}

.full-width {
  width: 100%;
}

/* Labels */
.form-group label {
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #555;
}

/* Inputs & Textarea */
.form-input,
.form-calendar,
textarea {
  padding: 0.7rem 1rem;
  border: 1px solid #ddd;
  border-radius: 0.5rem;
  font-size: 1rem;
  background: white;
  transition: border 0.3s;
}

.form-input:focus,
textarea:focus {
  border-color: #007bff;
  outline: none;
}

textarea {
  min-height: 100px;
  resize: vertical;
}

/* Character counter */
.char-counter {
  text-align: right;
  font-size: 0.85rem;
  color: #888;
  margin-top: 0.3rem;
}

/* Submit button */
.submit-btn{
  padding: 0.8rem 1.5rem;
  background: #007bff;
  color: white;
  width: 100%;

  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: bold;

  text-transform: uppercase;
  transition: background 0.3s;

  letter-spacing: +0.05rem;

  font-size: var(--size-lg);
  box-shadow: 0 4px 4px var(--clr-slate600);
}

.submit-btn:hover {
  background: #0056b3;
}

@media (min-width: 550px) {
  .reservation-card {
    padding-left: 2rem;
    padding-right: 2rem;
  }
}
</style>
