<template>
  <section class="reservation" id="reservation-section">

    <h2 class="reservation__title">REZERWACJA</h2>

    <!-- This new wrapper controls the alignment and width of all form elements -->
    <div class="form-wrapper">

      <!-- Calendar -->
      <div id="calendars" class="calendars-wrapper">
        <div id="calendarNarrow" v-if="width < 768">
          <VDatePicker :min-date="new Date()" :columns="columns" :attributes="attrs" :expanded="null"
            :locale="userLocale" v-model.range="dateRange" :masks="masks" class="my-custom-datepicker" />
        </div>
        <div id="calendarWide" v-else>
          <VDatePicker :min-date="new Date()" :columns="columnsWide" :attributes="attrs" :expanded="expanded"
            :locale="userLocale" v-model.range="dateRange" :masks="masks" class="my-custom-datepicker" />
        </div>
      </div>

      <!-- User Data: Email & Phone -->
      <div class="user-data-container">
        <div class="email-field">
          <svg style="height: 2rem;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M1.5 8.67v8.58a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V8.67l-8.928 5.493a3 3 0 0 1-3.144 0L1.5 8.67Z" />
            <path
              d="M22.5 6.908V6.75a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3v.158l9.714 5.978a1.5 1.5 0 0 0 1.572 0L22.5 6.908Z" />
          </svg>
          <input class="email-input" type="text" placeholder="email@mail.com">
        </div>

        <div class="email-field">
          <span class="contact-cell">
            <svg style="height: 2rem;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path fill-rule="evenodd"
                d="M1.5 4.5a3 3 0 0 1 3-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 0 1-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 0 0 6.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 0 1 1.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 0 1-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5Z"
                clip-rule="evenodd" />
            </svg>
          </span>
          <input class="email-input" type="text" placeholder="+48 123 456 789">
        </div>
      </div>

      <!-- Message Textarea -->
      <div class="message-field">
        <textarea class="message-input" id="message-input-inSection" placeholder="Napisz wiadomość..."
          maxlength="500"></textarea>
        <p id="charCount-inSection" class="counter">0/500 znaków</p>
      </div>

      <!-- Submit Button -->
      <button class="confirm-date-btn" @click="console.log(width)">{{ t('confirm') }}</button>

    </div>

  </section>
</template>

<style scoped>
/* Main section container */
.reservation {
  display: flex;
  flex-direction: column;
  align-items: center;
  /* Center the title and the form wrapper */
  padding: 2rem 0;
  gap: 2rem;
  width: 100%;
  box-sizing: border-box;
}

.reservation__title {
  text-align: center;
}

/* New wrapper for all form elements */
.form-wrapper {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  /* Vertical spacing between form elements */
  width: 100%;
  /* Set a max-width for the form on larger screens */
  max-width: 800px;
  /* Provides the 1-2rem space from the device edges */
  padding: 0 1.5rem;
  box-sizing: border-box;
}

/* Ensure the date picker component takes up the full width */
.my-custom-datepicker {
  width: 100%;
  border: 1px solid #ddd;
  border-radius: 8px;
}

/* Container for Email and Phone inputs */
.user-data-container {
  display: flex;
  gap: 1.5rem;
  width: 100%;
}

/* Individual field (icon + input) */
.email-field {
  flex: 1;
  /* Each field takes up equal space */
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 2rem;
  padding: 0.5rem 1rem;
  background-color: #fff;
}

/* Input fields within the .email-field */
.email-input {
  flex-grow: 1;
  border: none;
  outline: none;
  background-color: transparent;
  font-size: 1rem;
  width: 100%;
  /* Fix for potential flex bugs */
}

/* Message field styling */
.message-field {
  width: 100%;
}

.message-input {
  width: 100%;
  min-height: 150px;
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-sizing: border-box;
  resize: vertical;
  font-family: inherit;
  font-size: 1rem;
}

/* Character counter for the textarea */
.counter {
  text-align: right;
  font-size: 0.8rem;
  color: #666;
  margin-top: 0.5rem;
}

/* The final button, aligned to the right */
.confirm-date-btn {
  align-self: flex-end;
  background-color: #2c3e50;
  /* A dark color similar to the screenshot */
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
}

/* Responsive adjustments for smaller screens */
@media (max-width: 768px) {
  .form-wrapper {
    padding: 0 1rem;
    /* Less padding on smaller screens */
  }

  .user-data-container {
    flex-direction: column;
    /* Stack email and phone */
    gap: 1rem;
  }
}
</style>