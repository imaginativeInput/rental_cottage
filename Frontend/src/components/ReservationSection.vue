<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { useCalendarStore } from '@/stores/calendarStore';
import { setupCalendar, Calendar, DatePicker } from 'v-calendar';
import { useScreens } from 'vue-screen-utils';
import { useI18n } from 'vue-i18n';

import { useGuestStore } from '@/stores/guestStore';
import { dateRange, formVisible, sendReservationRequest } from '@/utils/reservationRequest';


const { t } = useI18n();
const calendarStore = useCalendarStore();
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


// DROPDOWN START
const numbers = Array.from({ length: 13 }, (_, i) => i + 1); // Creates [1, 2, ..., 13]
const guestStore = useGuestStore();
// DROPDOWN END


onMounted(() => {
  // TEXTAREA
  const textarea = document.getElementById('message-input-inSection');
  const charCount = document.getElementById('charCount-inSection');

  textarea.addEventListener('input', () => {
    console.log('INPUT EVENT TRIGGERED!!!');
    const currentLength = textarea.value.length;
    const maxLength = textarea.getAttribute('maxlength');
    charCount.textContent = `${currentLength}/${maxLength} znaków`;

    if (parseInt(currentLength, 10) === parseInt(maxLength, 10)) {
      charCount.style.color = 'red';
      charCount.textContent = `${currentLength}/${maxLength} znaków - osiągnięto limit znaków.`;
    } else {
      charCount.style.color = 'var(--clr-dark)';
      charCount.textContent = `${currentLength}/${maxLength} znaków`;
    };
  })
  // TEXTAREA END

  // CALENDAR RESIZE
  window.addEventListener('resize', updateWidth); {
    updateWidth();
  }
  // CALENDAR RESIZE END
})

onUnmounted(() => {
  window.removeEventListener('resize', updateWidth);
})
</script>


<template>
  <section class="reservation section" id="reservation-section">

    <div class="form-wrapper">

      <h2 class="reservation__title">REZERWACJA</h2>
      <p style="align-self: center;">Wypełnij formularz, aby złożyć prośbę rezerwacji terminu</p>

      <!-- DROPDOWN START -->
      <div class="dropdown">
        <p class="selection-display">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
            <path
              d="M12 12c2.7 0 4.9-2.2 4.9-4.9S14.7 2.2 12 2.2 7.1 4.4 7.1 7.1 9.3 12 12 12zm0 2.3c-3.1 0-9.2 1.6-9.2 4.8v2.2h18.4v-2.2c0-3.2-6.1-4.8-9.2-4.8z" />
          </svg>
        </p>

        <select id="number-select" v-model="guestStore.peopleCount">
          <option class="number" v-for="number in numbers" :key="number" :value="number">
            {{ number }}
          </option>
        </select>
      </div>
      <!-- DROPDOWN END -->

      <!-- Calendar -->
      <div id="calendars" class="calendars-wrapper">
        <div id="calendarNarrow-inSection" v-if="width < 550">
          <VDatePicker :min-date="new Date()" :columns="columns" :attributes="attrs" :expanded="null"
            :locale="userLocale" v-model.range="dateRange" :masks="masks" class="my-custom-datepicker" />
        </div>
        <div id="calendarWide-inSection" v-else>
          <VDatePicker :min-date="new Date()" :columns="columnsWide" :attributes="attrs" :expanded="expanded"
            :locale="userLocale" v-model.range="dateRange" :masks="masks" class="my-custom-datepicker" />
        </div>
      </div>

      <div class="user-data-container">

        <div class="email-field">
          <svg style="height: 2rem; fill: var(--clr-dark);" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
            fill="">
            <path d="M1.5 8.67v8.58a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V8.67l-8.928 5.493a3 3 0 0 1-3.144 0L1.5 8.67Z" />
            <path
              d="M22.5 6.908V6.75a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3v.158l9.714 5.978a1.5 1.5 0 0 0 1.572 0L22.5 6.908Z" />
          </svg>
          <input id="email-input-inSection" class="email-input" type="text" placeholder="email@mail.com">
        </div>

        <div class="email-field">
          <span class="contact-cell">
            <svg style="height: 2rem; fill: var(--clr-dark);" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
              fill="">
              <path fill-rule="evenodd"
                d="M1.5 4.5a3 3 0 0 1 3-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 0 1-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 0 0 6.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 0 1 1.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 0 1-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5Z"
                clip-rule="evenodd" />
            </svg>
          </span>
          <input id="phone-input-inSection" class="email-input" type="text" placeholder="+48 123 456 789">
        </div>
      </div>

      <div class="message-field">
        <textarea class="message-input" id="message-input-inSection" placeholder="Napisz wiadomość..."
          maxlength="500"></textarea>
        <p id="charCount-inSection" class="counter">0/500 znaków</p>
      </div>

      <button class="confirm-date-btn"
        @click="sendReservationRequest('email-input-inSection', 'phone-input-inSection', 'message-input-inSection')">{{
          t('confirm') }}</button>
    </div>

  </section>
</template>

<style scoped>
.card {
  box-shadow: 0 4px 6px black;
  background-color: var(--clr-light);
}

.dropdown {
  display: flex;
  flex-direction: row;
  gap: 0.3rem;
  margin-left: 0.2rem;
  margin-top: 1.5rem;
}

.selection-display {
  display: flex;
  flex-direction: row;
  gap: 0.3rem;
}

.reservation {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 3rem;
  padding-bottom: 3rem;
  width: 100%;
  box-sizing: border-box;
}

.reservation__title {
  text-align: center;
  font-size: var(--size-2xl);
  font-weight: 500;
  padding-top: 2rem;
}

.form-wrapper {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  max-width: 800px;
  padding: 0 1.5rem;
  box-sizing: border-box;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.6);
  border-radius: 16px;
  background-color: var(--clr-light);
}

.my-custom-datepicker {
  width: 100%;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.user-data-container {
  display: flex;
  gap: 1.5rem;
  width: 100%;
}

.email-field {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border: 1px solid #cbd5e1;
  border-radius: 2rem;
  padding: 0.5rem 1rem;
  background-color: #fff;
}

.email-input {
  flex-grow: 1;
  border: none;
  outline: none;
  background-color: transparent;
  font-size: 1rem;
  width: 100%;
}

.email-field:focus-within {
  border: 2px solid var(--clr-dark);
}

.message-field {
  width: 100%;
}

.message-input {
  width: 100%;
  min-height: 200px;
  padding: 1rem;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  box-sizing: border-box;
  resize: vertical;
  font-family: inherit;
  font-size: 1rem;
}

.counter {
  text-align: right;
  font-size: 0.8rem;
  color: #666;
  margin-top: 0.5rem;
}

.confirm-date-btn {
  align-self: flex-end;
  background-color: var(--clr-dark);
  color: #fff;

  border: none;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;

  text-transform: uppercase;
  transition: all 0.3s;

  letter-spacing: +0.05rem;

  font-size: var(--size-lg);
  height: 5rem;

  margin-bottom: 2rem;
  box-shadow: 0 4px 6px var(--clr-slate600);
}

.confirm-date-btn:hover {
  background-color: var(--clr-warm-beige-400);
  border-bottom: 2px solid var(--clr-dark);
  box-shadow: 0 3px 6px var(--clr-dark);
  transform: translateY(-5px);
}

/* DROPDOWN START */
#number-select {
  width: 100%;
  font-size: var(--size-base);
}

.number {
  background-color: var(--clr-light);
  color: var(--clr-dark);
  font-size: var(--size-base);

  display: block;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* DROPDOWN END */

@media (max-width: 768px) {
  .form-wrapper {
    padding: 0 1rem;
  }

  .user-data-container {
    flex-direction: column;
    gap: 1rem;
  }
}

@media (min-width: 640px) {
  .reservation__title {
    font-size: var(--size-3xl);
  }


  .message-input {
    min-height: 250px;
  }
}

@media (min-width: 1024px) {

  .reservation__title {
    font-size: var(--size-4xl);
  }

  .confirm-date-btn {
    padding: 1rem 1.5rem;
    height: 5rem;
    font-size: var(--size-xl);
  }


  .message-input {
    min-height: 300px;
  }
}

@media (min-width: 1280px) {}
</style>