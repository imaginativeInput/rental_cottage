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
const maxChars = 500;
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
const masks = { input: 'DD MMM YYYY' };

const width = ref(window.innerWidth);
const updateWidth = () => {
  width.value = window.innerWidth;
  if (width.value >= 550) {
    expanded.value = true;
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
          <label for="questions">{{ t('askQuestion') }}</label>
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
  background-color: var(--clr-light);
  padding: 5rem 0;
}

.reservation-card {
  max-width: 960px;
  margin: 0 auto;
  padding: 0 1rem;
}

.reservation-title {
  text-align: center;
  margin-bottom: 2.5rem;
  font-size: var(--size-2xl);
  color: var(--clr-slate800);
  text-transform: uppercase;
  letter-spacing: 0.05em;
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
  color: var(--clr-slate600);
  font-size: var(--size-sm);
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

/* Inputs & Textarea */
.form-input,
.form-calendar,
textarea {
  padding: 0.7rem 1rem;
  border: 1px solid var(--clr-slate200);
  border-radius: 0.5rem;
  font-size: 1rem;
  background: #fff;
  color: var(--clr-slate800);
  transition: border-color 0.3s;
}

.form-input::placeholder,
textarea::placeholder {
  color: var(--clr-slate400);
}

.form-input:focus,
textarea:focus {
  border-color: var(--clr-warm-beige-600);
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
  color: var(--clr-slate400);
  margin-top: 0.3rem;
}

/* Submit button */
.submit-btn {
  padding: 0.8rem 1.5rem;
  background: var(--clr-warm-beige-600);
  color: var(--clr-light);
  width: 100%;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: bold;
  text-transform: uppercase;
  transition: transform 0.2s, background-color 0.3s ease;
  letter-spacing: 0.05rem;
  font-size: var(--size-lg);

  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.15);
}

.submit-btn:hover {
  background: var(--clr-warm-beige-800);
  transform: translateY(-2px);
}

/* Responsive */
@media (min-width: 550px) {
  .reservation-card {
    padding: 0 2rem;
  }
}

@media (min-width: 640px) {
  .reservation-title {
    font-size: var(--size-3xl);
  }
}

@media (min-width: 768px) {
  .form-row {
    grid-template-columns: 1fr 1fr 1fr;
  }
}

@media (min-width: 1024px) {
  .reservation-title {
    font-size: var(--size-4xl);
  }
}

/* Calendar styling */
:deep(.vc-container) {
  width: 100%;
  border: 1px solid var(--clr-slate200);
  border-radius: 0.75rem;
}

:deep(.vc-pane) {
  width: auto;
}

:deep(.vc-title) {
  color: var(--clr-slate800);
}

:deep(.vc-weekday) {
  padding-top: 1rem;
  color: var(--clr-slate600);
}

:deep(.vc-day-content:hover) {
  background-color: var(--clr-warm-beige-200);
}
</style>
