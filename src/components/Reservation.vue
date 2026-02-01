<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useCalendarStore } from '@/stores/calendarStore';
import { useScreens } from 'vue-screen-utils';
import { useI18n } from 'vue-i18n';

import { useGuestStore } from '@/stores/guestStore';
import { dateRange, formVisible, sendReservationRequest } from '@/utils/reservationRequest';


const { t } = useI18n();
const emit = defineEmits(['toggleElement']);

const months = ['Styczeń', 'Luty', 'Marzec',
  'Kwiecień', 'Maj', 'Czerwiec', 'Lipiec',
  'Sierpień', 'Wrzesień', 'Październik',
  'Listopad', 'Grudzień'
]
const date = new Date();
const month = date.getMonth();
const today = date.getDate();
const tomorrow = today + 1;
const year = date.getFullYear();
const monthFirstLetters = months[month].substr(0, 3);
const dateTomorrow = ref(`${String(today + 1).padStart(2, '0')} ${monthFirstLetters} ${year}`);
const startDateNumber = ref(null);
const endDateNumber = ref(null);

const textareaRef = ref(null);
const charCountRef = ref(null);

const guestStore = useGuestStore();
const guestLimit = 13;
const numberOfPeople = (n) => {
  if (n < 5 && n != 1) {
    return 'osoby';
  } else if (n >= 5) {
    return 'osób';
  } else {
    return 'osoba';
  }
}
// SOMETHING TO GET RID OF
const isDropdown = ref(false);
const changeNumberOfGuests = (id) => {
  const element = document.getElementById(`${id}`);
  isDropdown.value = false
  peopleCount.value = element.innerHTML
  console.log(`PEOPLE COUNT VALUE: ${peopleCount.value}`);
}

// SOMETHING TO GET RID OF
const isCalendarOpen = ref(false);

const calendarStore = useCalendarStore();
const { mapCurrent } = useScreens({
  xs: '0px',
  sm: '550px',
  md: '768px',
  lg: '1024px',
});
const columns = mapCurrent({ sm: 1 }, 1);
const columnsWide = mapCurrent({ sm: 2 }, 2);
const attrs = ref([
  {
    key: 'Any',
    dot: true,
    dates: new Date(),
    expanded: true,
  }
]);
const userLocale = ref('pl-PL');

const masks = {
  input: 'DD MMM YYYY',
}



const expanded = ref(null);
const width = ref(window.innerWidth);
const updateWidth = () => {
  width.value = window.innerWidth;
  if (width.value >= 550) {
    expanded.value = mapCurrent({ lg: false }, true);
  } else {
    expanded.value = null;
  }
};

const toggleReservationForm = () => {
  const element = document.getElementById('reservation-popup-form');
  element.style.display = 'block';
  formVisible.value = !formVisible.value;
};


const formattedStartDate = computed(() => {
  const { start, end } = dateRange.value;
  if (start && end) {
    const startDate = start.toLocaleDateString('pl-PL', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
    return startDate;
  }
});


const formattedEndDate = computed(() => {
  const { start, end } = dateRange.value;
  if (start && end) {
    const endDate = end.toLocaleDateString('pl-PL', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

    const replacement = tomorrow < 10 ? '0' + tomorrow : tomorrow.toString();
    const endDateFinal = endDate.replace(/^\d{1,2}/, replacement);
    const endDateDay = endDate.substring(0, 2);

    if (endDateDay < tomorrow) {
      return endDateFinal;
    } else {
      return endDate;
    }
  }
});

onMounted(() => {
  const selectedStartDate = formattedStartDate.value.substr(0, 2);
  const selectedEndDate = formattedEndDate.value.substr(0, 2);
  startDateNumber.value = Number(selectedStartDate);
  endDateNumber.value = Number(selectedEndDate);
  console.log(`${typeof startDateNumber}: ${startDateNumber}, nDay: ${endDateNumber}... 1: ${typeof 1}`);

  // RESERVATION FORM
  // const textarea = document.getElementById('message-input-popUpForm');
  // const charCount = document.getElementById('charCount');

  // textarea.addEventListener('input', () => {
  //   const currentLength = textarea.value.length;
  //   const maxLength = textarea.getAttribute('maxlength');
  //   charCount.textContent = `${currentLength}/${maxLength} znaków`;

  //   if (parseInt(currentLength, 10) === parseInt(maxLength, 10)) {
  //     charCount.style.color = 'red';
  //     charCount.textContent = `${currentLength}/${maxLength} znaków - osiągnięto limit znaków.`;
  //   } else {
  //     charCount.style.color = 'var(--clr-dark)';
  //     charCount.textContent = `${currentLength}/${maxLength} znaków`;
  //   };
  // })
  // RESERVATION FORM^

  if (textareaRef.value && charCountRef.value) {
    textareaRef.value.addEventListener('input', () => {
      const currentLength = textareaRef.value.value.length;
      const maxLength = textareaRef.value.getAttribute('maxlength');
      charCountRef.value.textContent = `${currentLength}/${maxLength} znaków`;

      if (parseInt(currentLength) === parseInt(maxLength)) {
        charCountRef.value.style.color = 'red';
        charCountRef.value.textContent = `${currentLength}/${maxLength} znaków - osiągnięto limit znaków.`;
      } else {
        charCountRef.value.style.color = 'var(--clr-dark)';
        charCountRef.value.textContent = `${currentLength}/${maxLength} znaków`;
      }
    })
  }

  window.addEventListener('resize', updateWidth); {
    updateWidth();
  }
});


onUnmounted(() => {
  window.removeEventListener('resize', updateWidth);
})

</script>

<template>
  <div id="overlay" v-if="calendarStore.isCalendarVisible" @click="calendarStore.toggleCalendar()"></div>
  <div id="overlay" v-else-if="formVisible" @click="toggleReservationForm()"></div>

  <div id="calendar-container" class="calendar-container" v-if="calendarStore.isCalendarVisible">
    <div id="calendarNarrow-inSection" v-if="width < 550">
      <VDatePicker :min-date="new Date()" :columns="columns" :attributes="attrs" :expanded="null" :locale="userLocale"
        v-model.range="dateRange" :masks="masks" class="my-custom-datepicker" />
    </div>
    <div id="calendarWide-inSection" v-else>
      <VDatePicker :min-date="new Date()" :columns="columnsWide" :attributes="attrs" :expanded="expanded"
        :locale="userLocale" v-model.range="dateRange" :masks="masks" class="my-custom-datepicker" />
    </div>
  </div>

  <!-- FORM for sending messages -->
  <div class="reservation-popup-form" id="reservation-popup-form" v-show="formVisible"
    :style="{ display: formVisible ? 'block' : 'none' }">

    <div class="user-data-container">
      <div class="email-field">
        <svg style="height: 2rem; fill: var(--clr-dark);" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
          fill="">
          <path d="M1.5 8.67v8.58a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V8.67l-8.928 5.493a3 3 0 0 1-3.144 0L1.5 8.67Z" />
          <path
            d="M22.5 6.908V6.75a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3v.158l9.714 5.978a1.5 1.5 0 0 0 1.572 0L22.5 6.908Z" />
        </svg>
        <input id="email-input-popUpForm" class="email-input" type="text" placeholder="email@mail.com">
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
        <input id="phone-input-popUpForm" class="email-input" type="text" placeholder="+48 123 456 789">
      </div>
    </div>

    <div class="message-field">
      <span>{{ t('anyQuestions') }} {{ t('messageUs') }}</span>
      <textarea id="message-input-popUpForm" ref="textareaRef" class="message-input" placeholder="Napisz wiadomość..."
        maxlength="500"></textarea>
      <p id="charCount" ref="charCountRef">0/500 znaków</p>
    </div>
    <button class="send-btn"
      @click="sendReservationRequest('email-input-popUpForm', 'phone-input-popUpForm', 'message-input-popUpForm')">
      Wyślij
    </button>
  </div>

  <!-- The section with buttons and datepicker(toggleable) -->
  <section class=" rezerwacja section">
    <div class="rezerwacja__form" id="formCalendar">
      <div class="rezerwacja__date" id="arrival" @click="calendarStore.toggleCalendar()">
        <span>{{ formattedStartDate }}</span>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
          style="margin-left: -1rem;width: 6rem; height: 3rem;" class="arrow">
          <path fill-rule="evenodd"
            d="M16.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 0 1-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 0 1 1.06-1.06l7.5 7.5Z"
            clip-rule="evenodd" class="arrow" />
        </svg>

        <span>{{ formattedEndDate ? formattedEndDate : dateTomorrow }}</span>
      </div>
      <div class="rezerwacja__guests" id="guestsButton">{{ guestStore.peopleCount }} {{
        numberOfPeople(guestStore.peopleCount) }}
        <div id="guest-dropdown-menu" class="dropdown-content">
          <ul class="guest-ul">
            <li v-for="n in guestLimit" :key="n" :class="{ 'guest-li': true, 'active': guestStore.peopleCount === n }"
              @click="guestStore.peopleCount = n">
              {{ n }}
            </li>
          </ul>
        </div>
      </div>
      <button class="rezerwacja__btn" @click="toggleReservationForm()">Sprawdź
        dostępność</button>
    </div>
  </section>
</template>


<style scoped>
ul {
  margin: 0;
  padding: 0;
  list-style: none;
}

li {
  margin: 0;
  padding: 0;
}

.calendars-wrapper {
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}


.rezerwacja {
  display: flex;
  text-transform: uppercase;
  color: var(--clr-dark);
  justify-content: center;
}

.rezerwacja__form {
  display: flex;
  width: 356px;
  font-size: var(--size-sm);
}

.rezerwacja__header {
  text-transform: uppercase;
  color: var(--clr-dark);
}

.rezerwacja__date {
  width: 400px;
  display: flex;
  flex-direction: row;

  padding-left: 1em;
  align-items: center;
  height: 60px;

  background-color: var(--clr-light);
  border-top-left-radius: 6px;
  border-bottom-left-radius: 6px;
}

.rezerwacja__date:hover,
.rezerwacja__guests:hover {
  background-color: var(--clr-warm-beige-200);
  cursor: pointer;
}

.rezerwacja__btn {
  background-color: var(--clr-warm-beige-400);
  color: var(--clr-dark);
  border: none;
  font-size: var(--size-sm);
  text-transform: uppercase;
  transition: color 0.3s;
  border-top-right-radius: 6px;
  border-bottom-right-radius: 6px;

  padding-left: 1rem;
  padding-right: 1rem;
}

.rezerwacja__btn:hover {
  background-color: var(--clr-warm-beige-200);
  cursor: pointer;
}

.show {
  display: block;
}

.rezerwacja__guests {
  display: flex;
  width: 150px;
  padding-right: 0.5rem;
  padding-left: 0.5rem;
  background-color: var(--clr-slate200);
  align-items: center;
  justify-content: center;
  position: relative;
}

.dropdown-content {
  display: none;
  position: absolute;
  box-shadow: 0 8px 16px 0px rgba(0, 0, 0, 0.3);
  z-index: 1;
  margin-top: 60px;
}

.rezerwacja__guests:hover .dropdown-content {
  display: flex;
  align-self: flex-start;
}

.guest-ul {
  text-align: center;
}

.guest-li {
  background-color: var(--clr-light);
  color: var(--clr-dark);
  width: 100%;
  list-style: none;
  z-index: 1;
  width: 70.900px;
}

.guest-li:hover {
  cursor: pointer;
  background-color: var(--clr-slate200);
  background-color: var(--clr-warm-beige-200);
}

.guest-li-none {
  display: none;
}

/* RESERVATION POP UP FORM */
.reservation-popup-form {
  position: fixed;
  width: calc(100% - 2rem);
  max-width: 500px;
  display: none;

  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  background-color: var(--clr-light);
  color: var(--clr-dark);
  border-radius: 0.5rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.25);

  z-index: 10000;
  padding: 1.5rem;
}

.user-data-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
}

.email-field {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  border: 1px solid var(--clr-slate400);
  border-radius: 6px;
  padding: 0.7rem 1rem;
  background-color: white;
  transition: border-color 0.3s;
}

.email-field:focus-within {
  border-color: var(--clr-warm-beige-600);
}

.email-field svg {
  flex-shrink: 0;
}

.email-input {
  flex-grow: 1;
  border: none;
  outline: none;
  background-color: transparent;
  font-size: 1rem;
  width: 100%;
  color: var(--clr-dark);
}

.email-input::placeholder {
  color: var(--clr-slate400);
}

.message-field {
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.message-field span {
  font-weight: 600;
  color: var(--clr-slate600);
  font-size: var(--size-sm);
}

.message-input {
  height: 10rem;
  width: 100%;
  padding: 0.7rem 1rem;
  font-size: 1rem;
  border: 1px solid var(--clr-slate400);
  border-radius: 6px;
  resize: none;
  box-sizing: border-box;
  background-color: white;
  color: var(--clr-dark);
  transition: border-color 0.3s;
  overflow-y: auto;
}

.message-input:focus {
  outline: none;
  border-color: var(--clr-warm-beige-600);
}

.message-input::placeholder {
  color: var(--clr-slate400);
}

#charCount {
  text-align: right;
  font-size: var(--size-xs);
  color: var(--clr-slate600);
  margin: 0;
}

.send-btn {
  width: 100%;
  margin-top: 1rem;
  padding: 0.9rem 1.5rem;

  text-transform: uppercase;
  letter-spacing: +0.05rem;
  font-size: var(--size-base);
  font-weight: 600;

  color: var(--clr-light);
  background-color: var(--clr-warm-beige-600);

  transition: transform 0.2s, background-color 0.3s;
  border: none;
  border-radius: 6px;
  cursor: pointer;

  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.15);
}

.send-btn:hover {
  background-color: var(--clr-warm-beige-800);
  transform: translateY(-2px);
}

.send-btn:active {
  transform: translateY(0);
}

/* RESERVATION POP UP FORM END */

@media (min-width: 475px) {
  .rezerwacja__form {
    width: 400px;
  }
}

@media (min-width: 640px) {
  .rezerwacja__form {
    width: 475px;
    font-size: var(--size-lg);
  }

  .guest-li {
    width: 89.425px;
  }

  .user-data-container {
    flex-direction: row;
  }

  .reservation-popup-form {
    max-width: 560px;
    padding: 2rem;
  }
}

@media (min-width: 768px) {
  .reservation-popup-form {
    max-width: 600px;
    border-radius: 0.75rem;
  }

  .message-input {
    height: 12rem;
  }
}

@media (min-width: 1024px) {
  .rezerwacja__form {
    width: 33rem;
    font-size: var(--size-xl);
  }

  .rezerwacja__date {
    width: 24rem;
  }

  .rezerwacja__guests {
    width: 9rem;
  }

  .guest-li {
    width: 98.588px;
  }

  .reservation-popup-form {
    max-width: 640px;
    padding: 2.5rem;
  }

  .send-btn {
    font-size: var(--size-lg);
  }
}


@media (min-width: 1280px) {
  .rezerwacja__form {
    width: 36rem;
    font-size: var(--size-xl);
  }

  .rezerwacja__date {
    width: 26rem;
  }

  .rezerwacja__guests {
    width: 10rem;
  }


  .guest-li {
    width: 112.675px;
  }
}


@media (min-width: 1536px) {}
</style>