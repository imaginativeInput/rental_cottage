<script setup>
import { ref, computed, watch, onMounted, onUnmounted, defineAsyncComponent } from 'vue';
import { useCalendarStore } from '@/stores/calendarStore';
import { useScreens } from 'vue-screen-utils';

import { useGuestStore } from '@/stores/guestStore';
import { dateRange } from '@/utils/reservationRequest';

// v-calendar + its deps (@popperjs, date-fns) are ~47 KB gzip. The picker only
// renders behind the calendarStore.isCalendarVisible toggle, so load it lazily
// (incl. its CSS) the first time it's opened instead of in the eager entry chunk.
const VDatePicker = defineAsyncComponent(async () => {
  await import('v-calendar/style.css');
  const m = await import('v-calendar');
  return m.DatePicker;
});

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

const guestStore = useGuestStore();
const guestLimit = 13;

const selectGuests = (n) => {
  guestStore.peopleCount = n;
  if (n + guestStore.childrenCount > guestLimit) {
    guestStore.childrenCount = 0;
  }
  isDropdown.value = false;
};
const numberOfPeople = (n) => {
  if (n < 5 && n != 1) {
    return 'osoby';
  } else if (n >= 5) {
    return 'osób';
  } else {
    return 'osoba';
  }
}
const isDropdown = ref(false);

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

watch(dateRange, (newValue) => {
  if (calendarStore.isCalendarVisible && newValue.start && newValue.end) {
    const start = new Date(newValue.start).getTime()
    const end = new Date(newValue.end).getTime()
    if (start !== end) {
      setTimeout(() => {
        if (calendarStore.isCalendarVisible) {
          calendarStore.isCalendarVisible = false
        }
      }, 300)
    }
  }
}, { deep: true })

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

const scrollToReservation = () => {
  const target = document.getElementById('reservation-section');
  if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
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

  window.addEventListener('resize', updateWidth);
  updateWidth();
});


onUnmounted(() => {
  window.removeEventListener('resize', updateWidth);
})

</script>

<template>
  <div id="overlay" v-if="calendarStore.isCalendarVisible" @click="calendarStore.toggleCalendar()"></div>

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
      <div class="rezerwacja__guests" id="guestsButton" @mouseenter="isDropdown = true"
        @mouseleave="isDropdown = false">{{ guestStore.peopleCount }} {{
          numberOfPeople(guestStore.peopleCount) }}
        <div id="guest-dropdown-menu" class="dropdown-content" v-show="isDropdown">
          <ul class="guest-ul">
            <li v-for="n in guestLimit" :key="n"
              :class="{ 'guest-li': true, 'active': guestStore.peopleCount === n }"
              @click="selectGuests(n)">
              {{ n }}
            </li>
          </ul>
        </div>
      </div>
      <button class="rezerwacja__btn" @click="scrollToReservation()">Sprawdź
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
  /* Gap below the booking bar before the dark About section, so the hero
     fills the viewport and the panorama shows beneath the bar. Tuned per
     breakpoint (desktop overrides this to 18vh below). */
  margin-bottom: 22vh;
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
  display: flex;
  align-self: flex-start;
  position: absolute;
  box-shadow: 0 8px 16px 0px rgba(0, 0, 0, 0.3);
  z-index: 1;
  margin-top: 60px;
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
}

@media (min-width: 1024px) {
  /* Push the dark About section down to the viewport bottom so the hero fills
     the screen and the Tatra panorama (mountains + trees) is revealed below
     the booking bar. Pairs with `.welcome { height: 72vh }` in Welcome.vue. */
  .rezerwacja {
    margin-bottom: 18vh;
  }

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