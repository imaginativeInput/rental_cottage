<script setup>
import PictureImg from '@/components/PictureImg.vue';

const attractions = [
  {
    icon: 'thermal',
    title: 'Termy Bukovina',
    distance: '3 km',
    tag: 'Termy',
    description: 'Kompleks 20+ basenów mineralnych, saun i strefa wellness z panoramicznym widokiem na Tatry.',
    name: 'termy-bukovina',
    url: 'https://www.termybukovina.pl/',
  },
  {
    icon: 'thermal',
    title: 'Terma Bania',
    distance: '8 km',
    tag: 'Termy',
    description: 'Baseny zewnętrzne z panoramą Tatr, strefa SPA i wellness w Białce Tatrzańskiej.',
    name: 'terma-bania',
    url: 'https://www.termabania.pl/',
  },
  {
    icon: 'ski',
    title: 'Białka Tatrzańska — Kotelnica',
    distance: '10 km',
    tag: 'Narty',
    description: 'Największa stacja narciarska w okolicy. Trasy dla każdego poziomu, snowpark, wypożyczalnia.',
    name: 'kotelnica',
    url: 'https://bialkatatrzanska.pl/',
  },
  {
    icon: 'mountain',
    title: 'Tatrzański Park Narodowy',
    distance: 'od 15 km',
    tag: 'Szlaki',
    description: 'Morskie Oko, Dolina Kościeliska, Giewont — najpiękniejsze szlaki w zasięgu jednodniowej wycieczki.',
    name: 'morskie-oko',
    url: 'https://tpn.pl/',
  },
  {
    icon: 'tree',
    title: 'Chodník Korunami Stromov — Bachledka',
    distance: '25 km',
    tag: 'Słowacja',
    description: 'Słowacka ścieżka w koronach drzew, 600 m kładki i 32-metrowa wieża widokowa.',
    name: 'bachledka',
    url: 'https://chodnikkorunamistromov.sk/',
  },
  {
    icon: 'water',
    title: 'Spływ Dunajcem',
    distance: '30 km',
    tag: 'Pieniny',
    description: 'Tradycyjne tratwy flisackie przez malowniczy Przełom Dunajca między Polską a Słowacją.',
    name: 'dunajec',
    url: 'https://flisacy.pl/',
  },
  {
    icon: 'church',
    title: 'Kościół drewniany w Jurgowie',
    distance: '3 km',
    tag: 'Kultura',
    description: 'Zabytkowy modrzewiowy kościół z XVII wieku — perła góralskiej architektury sakralnej.',
    name: 'jurgow-kosciol',
  },
  {
    icon: 'town',
    title: 'Zakopane',
    distance: '25 km',
    tag: 'Miasto',
    description: 'Stolica polskich Tatr. Krupówki, kolejka na Gubałówkę, restauracje i sklepy z regionalnymi wyrobami.',
    name: 'zakopane',
  },
];
</script>

<template>
  <section class="attractions" id="atrakcje">
    <div class="attractions__container">

      <header class="attractions__header">
        <p class="attractions__eyebrow">Okolica</p>
        <h2 class="attractions__title">Atrakcje w pobliżu</h2>
        <span class="attractions__divider" aria-hidden="true"></span>
        <p class="attractions__lead">
          Od term i tras narciarskich po wycieczki w Tatrach — wszystko w zasięgu krótkiej trasy z domku.
        </p>
      </header>

      <div class="attractions__grid">
        <article v-for="(item, i) in attractions" :key="i" class="attraction-card">
          <div class="attraction-card__media">
            <PictureImg
              :name="item.name"
              :alt="item.title"
              format="jpeg"
              :widths="[480, 960]"
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
              img-class="attraction-card__image" />
            <span class="attraction-card__distance">{{ item.distance }}</span>
          </div>

          <div class="attraction-card__body">
            <div class="attraction-card__head">
              <span class="attraction-card__icon" aria-hidden="true">

                <svg v-if="item.icon === 'thermal'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                  stroke-width="1.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round"
                    d="M12 3c-2.5 4-5.5 7-5.5 10.5a5.5 5.5 0 0 0 11 0C17.5 10 14.5 7 12 3Z" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M10 14.5c.5 1 2.5 1 3 0" />
                </svg>

                <svg v-else-if="item.icon === 'ski'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                  stroke-width="1.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round"
                    d="M4 20l16-6M6 22l14-4M14 5l4 8M14 5l-3 1M16 8l-3 1M18 11l-3 1" />
                </svg>

                <svg v-else-if="item.icon === 'mountain'" xmlns="http://www.w3.org/2000/svg" fill="none"
                  viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3 20l5-9 4 6 2.5-4L21 20H3Z" />
                  <circle cx="9" cy="6" r="1.5" stroke-linecap="round" stroke-linejoin="round" />
                </svg>

                <svg v-else-if="item.icon === 'tree'" xmlns="http://www.w3.org/2000/svg" fill="none"
                  viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round"
                    d="M12 3l-4 6h2.5l-3 5H10l-3 4h10l-3-4h2.5l-3-5H16l-4-6Z" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 18v3" />
                </svg>

                <svg v-else-if="item.icon === 'water'" xmlns="http://www.w3.org/2000/svg" fill="none"
                  viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round"
                    d="M2 7c3 0 3-2 6-2s3 2 6 2 3-2 6-2M2 13c3 0 3-2 6-2s3 2 6 2 3-2 6-2M2 19c3 0 3-2 6-2s3 2 6 2 3-2 6-2" />
                </svg>

                <svg v-else-if="item.icon === 'church'" xmlns="http://www.w3.org/2000/svg" fill="none"
                  viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round"
                    d="M12 2v6M9 4h6M4 21V11l8-5 8 5v10M9 21v-5h6v5" />
                </svg>

                <svg v-else-if="item.icon === 'town'" xmlns="http://www.w3.org/2000/svg" fill="none"
                  viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round"
                    d="M3 21h18M5 21V8l5-3 5 3v13M15 21V12h5v9M8 11h2M8 14h2M8 17h2M17 15h1M17 18h1" />
                </svg>

              </span>
              <span class="attraction-card__tag">{{ item.tag }}</span>
            </div>

            <h3 class="attraction-card__title">{{ item.title }}</h3>
            <p class="attraction-card__description">{{ item.description }}</p>

            <a v-if="item.url" :href="item.url" target="_blank" rel="noopener noreferrer"
              class="attraction-card__link">
              Dowiedz się więcej
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2"
                stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M7 17 17 7M7 7h10v10" />
              </svg>
            </a>
          </div>
        </article>
      </div>

    </div>
  </section>
</template>

<style scoped>
.attractions {
  background-color: var(--clr-warm-beige-200);
  padding: 5rem 0;
}

.attractions__container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1rem;
}

.attractions__header {
  text-align: center;
  margin-bottom: 2.5rem;
}

.attractions__eyebrow {
  text-transform: uppercase;
  font-size: var(--size-xs);
  letter-spacing: 0.2em;
  color: var(--clr-warm-beige-800);
  font-weight: 600;
  margin: 0 0 0.5rem;
}

.attractions__title {
  font-family: 'Playfair Display', serif;
  font-weight: 600;
  color: var(--clr-slate800);
  font-size: var(--size-3xl);
  letter-spacing: -0.02em;
  margin: 0;
  line-height: 1.1;
}

.attractions__divider {
  display: block;
  width: 60px;
  height: 2px;
  background: var(--clr-warm-beige-600);
  margin: 1rem auto;
  border-radius: 2px;
}

.attractions__lead {
  color: var(--clr-slate600);
  font-size: var(--size-base);
  max-width: 540px;
  margin: 0 auto;
  line-height: 1.5;
}

/* Grid */
.attractions__grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

/* Card */
.attraction-card {
  background: #fff;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  text-align: left;
  transition: transform 0.3s, box-shadow 0.3s;
}

.attraction-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.1);
}

.attraction-card__media {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 10;
  overflow: hidden;
  background: var(--clr-warm-beige-200);
}

.attraction-card__media > picture {
  display: block;
  width: 100%;
  height: 100%;
}

/* The <img> is rendered by the child PictureImg component, so a plain scoped
   selector on `.attraction-card__image` never reaches it — the image then keeps
   the global `max-width: 100%` + natural aspect and spills out of the 16:10
   media box (most visible on terma-bania, whose source is ~4:3). `:deep()`
   crosses the component boundary so object-fit: cover applies. */
.attraction-card__media :deep(.attraction-card__image) {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.5s ease;
}

.attraction-card:hover .attraction-card__media :deep(.attraction-card__image) {
  transform: scale(1.04);
}

.attraction-card__distance {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  background: rgba(255, 255, 255, 0.95);
  color: var(--clr-slate800);
  padding: 0.35rem 0.7rem;
  border-radius: 999px;
  font-size: var(--size-xs);
  font-weight: 700;
  white-space: nowrap;
  backdrop-filter: blur(4px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.attraction-card__body {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  padding: 1.25rem 1.5rem 1.5rem;
  flex: 1;
}

.attraction-card__head {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.attraction-card__icon {
  width: 2.25rem;
  height: 2.25rem;
  flex-shrink: 0;
  background: var(--clr-warm-beige-200);
  border-radius: 0.6rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--clr-warm-beige-800);
}

.attraction-card__icon svg {
  width: 1.25rem;
  height: 1.25rem;
}

.attraction-card__tag {
  background: var(--clr-warm-beige-200);
  color: var(--clr-warm-beige-800);
  font-size: var(--size-xs);
  font-weight: 700;
  padding: 0.25rem 0.55rem;
  border-radius: 0.35rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.attraction-card__title {
  font-family: 'Playfair Display', serif;
  font-size: var(--size-xl);
  color: var(--clr-slate800);
  font-weight: 600;
  margin: 0;
  line-height: 1.2;
}

.attraction-card__description {
  color: var(--clr-slate600);
  font-size: var(--size-sm);
  margin: 0;
  line-height: 1.5;
  flex: 1;
}

.attraction-card__link {
  color: var(--clr-warm-beige-800);
  font-size: var(--size-sm);
  font-weight: 600;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  margin-top: 0.25rem;
  align-self: flex-start;
  transition: color 0.2s;
}

.attraction-card__link:hover {
  color: var(--clr-warm-beige-600);
}

.attraction-card__link svg {
  width: 0.95rem;
  height: 0.95rem;
  transition: transform 0.2s;
}

.attraction-card__link:hover svg {
  transform: translate(2px, -2px);
}

/* Responsive */
@media (min-width: 640px) {
  .attractions__grid {
    grid-template-columns: 1fr 1fr;
    gap: 1.25rem;
  }
}

@media (min-width: 1024px) {
  .attractions__container {
    padding: 0 2rem;
  }

  .attractions__title {
    font-size: var(--size-4xl);
  }

  .attractions__grid {
    grid-template-columns: 1fr 1fr 1fr 1fr;
    gap: 1.5rem;
  }
}

@media (min-width: 1280px) {
  .attractions__title {
    font-size: var(--size-5xl);
  }
}
</style>
