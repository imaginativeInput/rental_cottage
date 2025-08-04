<script setup>

const toggleReservationForm = () => {
  element = document.getElementById('reservation-form');
  element.style.display = 'block';
};
</script>

<template>
  <div class="reservation-form" id="reservation-form">
    <div class="email-field">
      <span><strong>email:</strong></span>
      <input type="text">
    </div>
  </div>
</template>

<style scoped>
.reservation-form {
  width: 80%;
  height: 50%;
  display: none;
  transform: translate(-50%, -50%);
  background-color: white;
  z-index: 10000;
}

.email-field {
  display: flex;
  flex-direction: row;
}

@media (min-width: 1024px) {
  .reservation-final-form {
    width: 600px;
    height: 400px;
  }
}
</style>