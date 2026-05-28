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
const isSubmitting = ref(false);

// Computed validation
const isEmailValid = computed(() => emailRegex.test(email.value))
const isPhoneValid = computed(() => phoneRegex.test(phone.value))

// Config
const maxChars = 500;
const { t } = useI18n();

// Polish plural helpers
const adultsLabel = (n) => (n === 1 ? 'dorosły' : 'dorosłych');
const childrenLabel = (n) => (n === 1 ? 'dziecko' : 'dzieci');

const nightsCount = computed(() => {
  const { start, end } = dateRange.value || {};
  if (!start || !end) return 0;
  return Math.max(0, Math.round((new Date(end) - new Date(start)) / 86400000));
});
const nightsLabel = computed(() => {
  const n = nightsCount.value;
  if (n === 1) return 'noc';
  if (n >= 2 && n <= 4) return 'noce';
  return 'nocy';
});
const hasValidRange = computed(() => nightsCount.value > 0);

// Combined capacity: adults + children must stay ≤ 13
const MAX_GUESTS = 13;
const totalGuests = computed(() => guestStore.peopleCount + guestStore.childrenCount);
const isAtCapacity = computed(() => totalGuests.value >= MAX_GUESTS);

// Counter actions
const incGuests = () => { if (!isAtCapacity.value && guestStore.peopleCount < MAX_GUESTS) guestStore.peopleCount++; };
const decGuests = () => { if (guestStore.peopleCount > 1) guestStore.peopleCount--; };
const incChildren = () => { if (!isAtCapacity.value) guestStore.childrenCount++; };
const decChildren = () => { if (guestStore.childrenCount > 0) guestStore.childrenCount--; };

// Submit wrapper. Skip the loading flag when client-side validation will fail
// so the spinner only shows for actual network round-trips.
const handleSubmit = async () => {
  if (isSubmitting.value) return;
  if (!email.value || !isEmailValid.value || !isPhoneValid.value) {
    await sendReservationRequest('email', 'phone', 'message');
    return;
  }
  isSubmitting.value = true;
  try { await sendReservationRequest('email', 'phone', 'message'); }
  finally { isSubmitting.value = false; }
};

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
    <div class="reservation__container">

      <header class="reservation__header">
        <p class="reservation__eyebrow">Zarezerwuj pobyt</p>
        <h2 class="reservation__title">Rezerwacja</h2>
        <span class="reservation__divider" aria-hidden="true"></span>
        <p class="reservation__lead">
          Sprawdź dostępność i zarezerwuj swój pobyt — odpowiemy w ciągu 24 godzin.
        </p>
      </header>

      <div class="reservation__card">
        <form class="reservation__form" @submit.prevent="handleSubmit" novalidate>

          <div class="reservation__fields">

            <div class="field-row">
              <div class="field">
                <span class="field__label" id="adults-label">Dorośli</span>
                <div class="counter" role="group" aria-labelledby="adults-label">
                  <button type="button" class="counter__btn" @click="decGuests"
                    :disabled="guestStore.peopleCount <= 1" aria-label="Mniej dorosłych">−</button>
                  <span class="counter__value">{{ guestStore.peopleCount }}</span>
                  <button type="button" class="counter__btn" @click="incGuests"
                    :disabled="isAtCapacity" aria-label="Więcej dorosłych">+</button>
                </div>
              </div>

              <div class="field">
                <span class="field__label" id="children-label">Dzieci</span>
                <div class="counter" role="group" aria-labelledby="children-label">
                  <button type="button" class="counter__btn" @click="decChildren"
                    :disabled="guestStore.childrenCount <= 0" aria-label="Mniej dzieci">−</button>
                  <span class="counter__value">{{ guestStore.childrenCount }}</span>
                  <button type="button" class="counter__btn" @click="incChildren"
                    :disabled="isAtCapacity" aria-label="Więcej dzieci">+</button>
                </div>
              </div>
            </div>

            <p v-if="isAtCapacity" class="capacity-hint">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8"
                stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
              </svg>
              Maksymalna liczba gości to {{ MAX_GUESTS }}.
            </p>

            <label class="pets-toggle" :class="{ 'is-on': guestStore.hasPets }">
              <input type="checkbox" class="pets-toggle__input" v-model="guestStore.hasPets" />
              <span class="pets-toggle__box" aria-hidden="true">
                <svg v-if="guestStore.hasPets" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                  stroke-width="3" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
              </span>
              <span class="pets-toggle__text">
                <span class="pets-toggle__title">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <ellipse cx="6.5" cy="11" rx="1.8" ry="2.4" />
                    <ellipse cx="9.5" cy="6.5" rx="1.6" ry="2.1" />
                    <ellipse cx="14.5" cy="6.5" rx="1.6" ry="2.1" />
                    <ellipse cx="17.5" cy="11" rx="1.8" ry="2.4" />
                    <path d="M12 11c-2.8 0-5 2.5-5 5 0 2 1.5 3 3 3 1 0 1.5-0.5 2-0.5s1 0.5 2 0.5c1.5 0 3-1 3-3 0-2.5-2.2-5-5-5z" />
                  </svg>
                  Zwierzęta
                </span>
                <span class="pets-toggle__hint">Zabieram ze sobą zwierzaka</span>
              </span>
            </label>

            <div class="field">
              <label class="field__label" for="email">
                Email <span class="field__required" aria-hidden="true">*</span>
              </label>
              <div class="field__wrap"
                :class="{ 'is-invalid': email && !isEmailValid, 'is-valid': isEmailValid }">
                <svg class="field__icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                  stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round"
                    d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                </svg>
                <input id="email" type="email" v-model="email" autocomplete="email"
                  placeholder="example@email.com" class="field__input" />
                <svg v-if="isEmailValid" class="field__check" xmlns="http://www.w3.org/2000/svg" fill="none"
                  viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
              </div>
              <p v-if="email && !isEmailValid" class="field__error">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8"
                  stroke="currentColor" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round"
                    d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                </svg>
                Nieprawidłowy email
              </p>
            </div>

            <div class="field">
              <label class="field__label" for="phone">
                Numer telefonu <span class="field__required" aria-hidden="true">*</span>
              </label>
              <div class="field__wrap"
                :class="{ 'is-invalid': phone && !isPhoneValid, 'is-valid': isPhoneValid }">
                <svg class="field__icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                  stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round"
                    d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                </svg>
                <input id="phone" type="tel" v-model="phone" autocomplete="tel"
                  placeholder="+48 123 456 789" class="field__input" />
                <svg v-if="isPhoneValid" class="field__check" xmlns="http://www.w3.org/2000/svg" fill="none"
                  viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
              </div>
              <p v-if="phone && !isPhoneValid" class="field__error">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8"
                  stroke="currentColor" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round"
                    d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                </svg>
                Nieprawidłowy numer telefonu
              </p>
            </div>

            <div class="field field--textarea">
              <label class="field__label" for="message">{{ t('askQuestion') }}</label>
              <div class="field__wrap field__wrap--textarea">
                <textarea id="message" v-model="questions" :maxlength="maxChars"
                  placeholder="Jakieś pytania? Napisz a rozwiejemy wątpliwości."
                  class="field__input field__input--textarea" rows="4"></textarea>
              </div>
              <small class="field__counter">{{ questions.length }} / {{ maxChars }}</small>
            </div>
          </div>

          <div class="reservation__calendar">
            <span class="field__label">Wybierz datę</span>
            <div class="calendar-wrap">
              <VDatePicker v-if="width < 550" :min-date="new Date()" :columns="columns" :attributes="attrs"
                :expanded="null" :locale="userLocale" v-model.range="dateRange" :masks="masks" />
              <VDatePicker v-else :min-date="new Date()" :columns="columnsWide" :attributes="attrs"
                :expanded="expanded" :locale="userLocale" v-model.range="dateRange" :masks="masks" />
            </div>
          </div>

          <div class="reservation__footer">
            <div class="summary" v-if="hasValidRange">
              <span class="summary__item">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                  stroke="currentColor" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round"
                    d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
                </svg>
                <strong>{{ nightsCount }}</strong> {{ nightsLabel }}
              </span>
              <span class="summary__sep" aria-hidden="true">•</span>
              <span class="summary__item">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                  stroke="currentColor" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round"
                    d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                </svg>
                <strong>{{ guestStore.peopleCount }}</strong> {{ adultsLabel(guestStore.peopleCount) }}
              </span>
              <template v-if="guestStore.childrenCount > 0">
                <span class="summary__sep" aria-hidden="true">•</span>
                <span class="summary__item">
                  <strong>{{ guestStore.childrenCount }}</strong> {{ childrenLabel(guestStore.childrenCount) }}
                </span>
              </template>
              <template v-if="guestStore.hasPets">
                <span class="summary__sep" aria-hidden="true">•</span>
                <span class="summary__item summary__item--pets" aria-label="Ze zwierzakiem">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <ellipse cx="6.5" cy="11" rx="1.8" ry="2.4" />
                    <ellipse cx="9.5" cy="6.5" rx="1.6" ry="2.1" />
                    <ellipse cx="14.5" cy="6.5" rx="1.6" ry="2.1" />
                    <ellipse cx="17.5" cy="11" rx="1.8" ry="2.4" />
                    <path d="M12 11c-2.8 0-5 2.5-5 5 0 2 1.5 3 3 3 1 0 1.5-0.5 2-0.5s1 0.5 2 0.5c1.5 0 3-1 3-3 0-2.5-2.2-5-5-5z" />
                  </svg>
                  Zwierzak
                </span>
              </template>
            </div>

            <button class="submit-btn" type="submit" :disabled="isSubmitting">
              <template v-if="!isSubmitting">
                <span>{{ t('confirm') }}</span>
                <svg class="submit-btn__arrow" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                  stroke-width="2" stroke="currentColor" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </template>
              <template v-else>
                <svg class="spinner" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                  stroke-width="2" stroke="currentColor" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round"
                    d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                </svg>
                <span>Wysyłanie…</span>
              </template>
            </button>
          </div>

        </form>
      </div>

    </div>
  </section>
</template>

<style scoped>
.reservation {
  background-color: var(--clr-light);
  padding: 5rem 0;
}

.reservation__container {
  max-width: 1180px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* Header */
.reservation__header {
  text-align: center;
  margin-bottom: 2.5rem;
}

.reservation__eyebrow {
  text-transform: uppercase;
  font-size: var(--size-xs);
  letter-spacing: 0.2em;
  color: var(--clr-warm-beige-600);
  font-weight: 600;
  margin: 0 0 0.5rem;
}

.reservation__title {
  font-family: 'Playfair Display', serif;
  font-weight: 600;
  color: var(--clr-slate800);
  font-size: var(--size-3xl);
  letter-spacing: -0.02em;
  margin: 0;
  line-height: 1.1;
}

.reservation__divider {
  display: block;
  width: 60px;
  height: 2px;
  background: var(--clr-warm-beige-400);
  margin: 1rem auto;
  border-radius: 2px;
}

.reservation__lead {
  color: var(--clr-slate600);
  font-size: var(--size-base);
  max-width: 540px;
  margin: 0 auto;
  line-height: 1.5;
}

/* Card + form grid */
.reservation__card {
  background: #fff;
  border-radius: 1rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
  padding: 1.5rem;
}

.reservation__form {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

.reservation__fields {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  min-width: 0;
}

.reservation__calendar {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-width: 0;
}

.reservation__footer {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: stretch;
}

/* Field primitives */
.field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.field-row {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

@media (min-width: 480px) {
  .field-row {
    grid-template-columns: 1fr 1fr;
  }
}

.field__label {
  text-transform: uppercase;
  font-size: var(--size-xs);
  font-weight: 600;
  color: var(--clr-slate600);
  letter-spacing: 0.08em;
}

.field__required {
  color: var(--clr-rose);
  font-weight: 400;
  margin-left: 0.15rem;
}

.field__wrap {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  background: #fff;
  border: 1px solid var(--clr-slate200);
  border-radius: 0.625rem;
  padding: 0.7rem 0.9rem;
  transition: border-color 0.2s, box-shadow 0.2s, background-color 0.2s;
}

.field__wrap:hover {
  border-color: var(--clr-slate400);
}

.field__wrap:focus-within {
  border-color: var(--clr-warm-beige-600);
  box-shadow: 0 0 0 4px rgba(193, 151, 112, 0.18);
}

.field__wrap.is-invalid {
  border-color: var(--clr-rose);
  background: rgba(225, 29, 72, 0.04);
}

.field__wrap.is-invalid:focus-within {
  box-shadow: 0 0 0 4px rgba(225, 29, 72, 0.15);
}

.field__wrap.is-valid {
  border-color: var(--clr-warm-beige-600);
}

.field__wrap--textarea {
  align-items: flex-start;
  padding: 0.8rem 0.9rem;
}

.field__icon {
  width: 1.15rem;
  height: 1.15rem;
  color: var(--clr-slate400);
  flex-shrink: 0;
  transition: color 0.2s;
}

.field__wrap:focus-within .field__icon {
  color: var(--clr-warm-beige-600);
}

.field__wrap.is-invalid .field__icon {
  color: var(--clr-rose);
}

.field__input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  color: var(--clr-slate800);
  font-size: var(--size-base);
  font-family: inherit;
  padding: 0;
  min-width: 0;
}

.field__input::placeholder {
  color: var(--clr-slate400);
}

.field__input--textarea {
  min-height: 6rem;
  resize: vertical;
  line-height: 1.5;
  width: 100%;
}

.field__check {
  width: 1.1rem;
  height: 1.1rem;
  color: var(--clr-warm-beige-600);
  flex-shrink: 0;
}

.field__counter {
  text-align: right;
  font-size: var(--size-xs);
  color: var(--clr-slate400);
}

.field__error {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  color: var(--clr-rose);
  font-size: var(--size-xs);
  font-weight: 600;
  margin: 0;
}

.field__error svg {
  width: 0.95rem;
  height: 0.95rem;
  flex-shrink: 0;
}

/* Guest counter */
.counter {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  background: #fff;
  border: 1px solid var(--clr-slate200);
  border-radius: 0.625rem;
  padding: 0.4rem;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.counter:focus-within {
  border-color: var(--clr-warm-beige-600);
  box-shadow: 0 0 0 4px rgba(193, 151, 112, 0.18);
}

.counter__btn {
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 0.5rem;
  border: none;
  background: var(--clr-light);
  color: var(--clr-slate800);
  font-size: var(--size-lg);
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s, transform 0.15s;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}

.counter__btn:hover:not(:disabled) {
  background: var(--clr-warm-beige-200);
}

.counter__btn:active:not(:disabled) {
  transform: scale(0.94);
}

.counter__btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.counter__value {
  flex: 1;
  min-width: 2rem;
  text-align: center;
  font-size: var(--size-lg);
  font-weight: 600;
  color: var(--clr-slate800);
}

/* Capacity hint */
.capacity-hint {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  color: var(--clr-warm-beige-800);
  font-size: var(--size-xs);
  font-weight: 600;
  margin: 0;
}

.capacity-hint svg {
  width: 1rem;
  height: 1rem;
  flex-shrink: 0;
}

/* Pets checkbox */
.pets-toggle {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  background: #fff;
  border: 1px solid var(--clr-slate200);
  border-radius: 0.625rem;
  padding: 0.85rem 1rem;
  cursor: pointer;
  transition: border-color 0.2s, background-color 0.2s, box-shadow 0.2s;
  user-select: none;
}

.pets-toggle:hover {
  border-color: var(--clr-slate400);
}

.pets-toggle.is-on {
  border-color: var(--clr-warm-beige-600);
  background: rgba(193, 151, 112, 0.06);
}

.pets-toggle__input {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.pets-toggle__input:focus-visible + .pets-toggle__box {
  box-shadow: 0 0 0 4px rgba(193, 151, 112, 0.25);
}

.pets-toggle__box {
  width: 1.4rem;
  height: 1.4rem;
  border-radius: 0.4rem;
  border: 1.5px solid var(--clr-slate400);
  background: #fff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--clr-light);
  transition: background-color 0.2s, border-color 0.2s;
  flex-shrink: 0;
}

.pets-toggle__box svg {
  width: 0.9rem;
  height: 0.9rem;
}

.pets-toggle.is-on .pets-toggle__box {
  background: var(--clr-warm-beige-600);
  border-color: var(--clr-warm-beige-600);
}

.pets-toggle__text {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  min-width: 0;
}

.pets-toggle__title {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  color: var(--clr-slate800);
  font-weight: 600;
  font-size: var(--size-base);
}

.pets-toggle__title svg {
  width: 1.05rem;
  height: 1.05rem;
  color: var(--clr-warm-beige-600);
}

.pets-toggle__hint {
  color: var(--clr-slate400);
  font-size: var(--size-xs);
}

/* Summary chip */
.summary {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.4rem 0.6rem;
  max-width: 100%;
  background: var(--clr-warm-beige-200);
  color: var(--clr-warm-beige-800);
  padding: 0.6rem 1rem;
  border-radius: 1rem;
  font-size: var(--size-sm);
  font-weight: 500;
  align-self: flex-start;
}

.summary__item {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
}

.summary__item svg {
  width: 1rem;
  height: 1rem;
}

.summary__item strong {
  color: var(--clr-warm-beige-800);
  font-weight: 700;
}

.summary__sep {
  color: var(--clr-warm-beige-400);
}

/* Submit button */
.submit-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.95rem 1.5rem;
  background: var(--clr-warm-beige-600);
  color: var(--clr-light);
  border: none;
  border-radius: 0.75rem;
  font-weight: 700;
  font-size: var(--size-base);
  font-family: inherit;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  cursor: pointer;
  transition: background-color 0.25s, transform 0.2s, box-shadow 0.25s;
  box-shadow: 0 4px 14px rgba(193, 151, 112, 0.35);
  width: 100%;
}

.submit-btn:hover:not(:disabled) {
  background: var(--clr-warm-beige-800);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(166, 122, 91, 0.4);
}

.submit-btn:hover:not(:disabled) .submit-btn__arrow {
  transform: translateX(4px);
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.submit-btn__arrow {
  width: 1.1rem;
  height: 1.1rem;
  transition: transform 0.2s;
}

.spinner {
  width: 1.1rem;
  height: 1.1rem;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Calendar wrapper + v-calendar deep overrides */
.calendar-wrap {
  background: var(--clr-light);
  border-radius: 0.75rem;
  padding: 0.75rem;
  display: flex;
  justify-content: center;
}

:deep(.vc-container) {
  border: none;
  background: transparent;
  width: 100%;
  font-family: inherit;
  --vc-highlight-solid-bg: var(--clr-warm-beige-600);
  --vc-highlight-light-bg: var(--clr-warm-beige-200);
  --vc-highlight-outline-border: var(--clr-warm-beige-600);
  --vc-highlight-outline-content-color: var(--clr-warm-beige-800);
}

/* Match HomeView's global selector specificity so today's attribute
   uses warm-beige instead of the dark color set by global styles */
:deep(.vc-light.vc-attr),
:deep(.vc-light .vc-attr) {
  --vc-highlight-solid-bg: var(--clr-warm-beige-600);
  --vc-highlight-outline-border: var(--clr-warm-beige-600);
  --vc-highlight-outline-content-color: var(--clr-warm-beige-800);
  --vc-highlight-light-bg: var(--clr-warm-beige-200);
  --vc-highlight-light-content-color: var(--clr-warm-beige-800);
  --vc-dot-bg: var(--clr-warm-beige-600);
  --vc-bar-bg: var(--clr-warm-beige-600);
}

:deep(.vc-pane) {
  width: auto;
}

:deep(.vc-title) {
  color: var(--clr-slate800);
  font-weight: 600;
  font-size: var(--size-base);
}

:deep(.vc-weekday) {
  color: var(--clr-slate400);
  font-weight: 600;
  padding-top: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: var(--size-xs);
}

:deep(.vc-day-content:hover) {
  background-color: var(--clr-warm-beige-200);
  color: var(--clr-slate800);
}

:deep(.vc-arrow) {
  color: var(--clr-slate600);
  background-color: transparent;
  border-radius: 0.5rem;
}

:deep(.vc-arrow:hover) {
  background-color: var(--clr-warm-beige-200);
}

/* Responsive */
@media (min-width: 550px) {
  .reservation__container {
    padding: 0 1.5rem;
  }
}

@media (min-width: 768px) {
  .reservation__container {
    padding: 0 2rem;
  }

  .reservation__card {
    padding: 2.5rem;
  }
}

@media (min-width: 1024px) {
  .reservation__title {
    font-size: var(--size-4xl);
  }

  .reservation__form {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1.15fr);
    gap: 2.5rem;
  }

  .reservation__footer {
    grid-column: 1 / -1;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: 2rem;
    padding-top: 0.5rem;
    border-top: 1px solid var(--clr-slate200);
    margin-top: 0.5rem;
  }

  .submit-btn {
    width: auto;
    min-width: 14rem;
  }
}

@media (min-width: 1280px) {
  .reservation__title {
    font-size: var(--size-5xl);
  }

  .reservation__card {
    padding: 3rem;
  }
}
</style>
