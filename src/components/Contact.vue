<script setup></script>

<template>
  <section>
    <div class="contact">
      <h2 class="contact__title">Wynajem już od <strong class="price">900</strong> złotych za dobę</h2>
    </div>

    <div id="atrakcje" class="attractions">
      <h2 class="attractions__title">
        Świetne atrakcje w pięknej okolicy
      </h2>
    </div>

    <div id="faq" class="faq">
      <h1 class="faq__title">
        FAQ
      </h1>
      <h2 class="faq__subtitle">
        Najczęściej zadawane pytania:
      </h2>

      <ul class="faq__questions">
        <li class="faq__question">
          Pytanie 1... Lorem ipsum dolor, sit amet consectetur adipisicing elit. Reiciendis, officiis?
        </li>
        <li class="faq__answer">
          Odpowiedź 1...
        </li>
        <li class="faq__question">
          Pytanie 2... Lorem ipsum dolor, sit amet consectetur adipisicing elit?
        </li>

        <li class="faq__answer">
          Odpowiedź 2...
        </li>
        <li class="faq__question">Pytanie 3... Lorem ipsum dolor sit amet?
        </li>

        <li class="faq__answer">
          Odpowiedź 3...
        </li>
        <li class="faq__question">Pytanie 4...</li>

        <li class="faq__answer">
          Odpowiedź 4...
        </li>
        <li class="faq__question">Pytanie 5...</li>

        <li class="faq__answer">
          Odpowiedź 5...
        </li>
        <li class="faq__question">Pytanie 6...</li>

        <li class="faq__answer">
          Odpowiedź 6...
        </li>
        <li class="faq__question">Pytanie 7...</li>

        <li class="faq__answer">
          Odpowiedź 7...
        </li>
        <li class="faq__question">Pytanie 8...</li>

        <li class="faq__answer">
          Odpowiedź 8...
        </li>
      </ul>
    </div>
  </section>
</template>

<style>
.contact {
  padding-top: 4rem;
  padding-bottom: 4rem;

  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  text-align: center;

  /* background-color: var(--clr-warm-beige-400); */
  background-color: var(--clr-light);
  color: var(--clr-warm-beige-400);


}

.price {
  /* color: var(--clr-light); */
  color: var(--clr-dark-blue);
  text-decoration: underline var(--clr-rose);
}

.contact__title {
  align-self: center;
  text-transform: uppercase;
  font-size: var(--size-2xl);
}

.contact__subtitle {
  align-self: center;
  text-transform: uppercase;
  font-size: var(--size-xl)
}


.contact__info {
  text-align: left;
  align-self: left;
}

@media (min-width: 640px) {
  .contact__title {
    font-size: var(--size-3xl);
  }
}

@media (min-width: 1024px) {
  .contact {
    padding-top: 5rem;
    padding-bottom: 5rem;
  }

  .contact__title {
    font-size: var(--size-4xl);
  }
}



/* ATTRACTIONS */
.attractions {
  padding-top: 5rem;
  padding-bottom: 5rem;
  background-color: var(--clr-warm-beige-400);
  display: flex;
  justify-content: center;
  text-align: center;
}

.attractions__title {
  align-self: center;
  text-transform: uppercase;
  font-size: var(--size-3xl);
  font-weight: 600;
}

/* ATTRACTIONS END */

/* FAQ */
.faq {
  padding-top: 5rem;
  padding-bottom: 5rem;
  /* background-color: var(--clr-warm-beige-400); */
  background-color: var(--clr-dark-blue);
  color: var(--clr-light);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.faq__title {
  /* align-self: center; */
  text-transform: uppercase;
  font-size: var(--size-4xl);
  font-weight: 600;
}

.faq__questions {
  width: 350px;
}

.faq__question {
  align-self: left;
  padding-top: 1rem;
  font-weight: 600;
  font-size: var(--size-lg);
}

.faq__answer {
  list-style: none;
  color: var(--clr-warm-beige-400);
  padding-left: 1rem;
  font-size: var(--size-lg);
}

.faq__subtitle {}

/* FAQ END */
</style>