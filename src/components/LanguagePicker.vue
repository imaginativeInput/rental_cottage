<script setup>
import { ref, onMounted } from 'vue';

const LANGUAGES = [
  { code: 'pl', label: 'Polski', flag: '🇵🇱' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
];

const visible = ref(false);
const current = ref('pl');

// Google Translate uses a `googtrans=/pl/<target>` cookie. We set it
// ourselves and reload — the GT script (loaded silently if the cookie is
// non-default) then auto-translates the page on the next paint.
const readCookie = () => {
  const m = document.cookie.match(/(?:^|;\s*)googtrans=\/pl\/([a-z]{2})/i);
  return m ? m[1].toLowerCase() : 'pl';
};

const writeCookie = (code) => {
  const expire = 'expires=Thu, 01 Jan 1970 00:00:00 GMT';
  const host = window.location.hostname;
  // Wipe both bare-host and dotted-host variants before writing.
  for (const scope of ['', `; domain=${host}`, `; domain=.${host}`]) {
    document.cookie = `googtrans=; ${expire}; path=/${scope}`;
  }
  if (code !== 'pl') {
    document.cookie = `googtrans=/pl/${code}; path=/`;
    document.cookie = `googtrans=/pl/${code}; path=/; domain=.${host}`;
  }
};

const ensureWidget = () => {
  if (document.getElementById('gt-script')) return;
  if (!document.getElementById('google_translate_element')) {
    const el = document.createElement('div');
    el.id = 'google_translate_element';
    el.className = 'gt-mount';
    document.body.appendChild(el);
  }
  window.googleTranslateElementInit = () => {
    new window.google.translate.TranslateElement(
      {
        pageLanguage: 'pl',
        includedLanguages: 'en,pl,de,fr',
        layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
        autoDisplay: false,
      },
      'google_translate_element'
    );
  };
  const s = document.createElement('script');
  s.id = 'gt-script';
  s.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
  s.async = true;
  document.head.appendChild(s);
};

const setLanguage = (code) => {
  if (code === current.value) {
    visible.value = false;
    return;
  }
  writeCookie(code);
  window.location.reload();
};

const onToggle = () => { visible.value = !visible.value; };
const onClose = () => { visible.value = false; };

onMounted(() => {
  current.value = readCookie();
  // Returning visitors with an active translation: load GT silently so the
  // translation applies. First-time / pl users: never load GT.
  if (current.value !== 'pl') {
    const load = () => ensureWidget();
    if (typeof window.requestIdleCallback === 'function') {
      window.requestIdleCallback(load, { timeout: 2000 });
    } else {
      setTimeout(load, 1200);
    }
  }
});
</script>

<template>
  <div class="lang-picker">
    <button
      type="button"
      class="lang-picker__btn"
      :aria-expanded="visible"
      aria-haspopup="true"
      :aria-label="`Język: ${current.toUpperCase()}`"
      @click="onToggle"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18" />
        <path d="M12 3a14 14 0 0 1 0 18" />
        <path d="M12 3a14 14 0 0 0 0 18" />
      </svg>
      <span class="lang-picker__code">{{ current.toUpperCase() }}</span>
    </button>

    <Teleport to="body">
      <div v-if="visible" class="lang-picker__sheet" role="dialog" aria-label="Wybierz język">
        <button type="button" class="lang-picker__close" @click="onClose" aria-label="Zamknij">×</button>
        <p class="lang-picker__hint">Wybierz język / Choose language</p>
        <ul class="lang-picker__list">
          <li v-for="lang in LANGUAGES" :key="lang.code">
            <button
              type="button"
              class="lang-picker__option"
              :class="{ 'is-current': lang.code === current }"
              :data-code="lang.code"
              :aria-current="lang.code === current ? 'true' : undefined"
              @click="setLanguage(lang.code)"
            >
              <span class="lang-picker__flag" aria-hidden="true">{{ lang.flag }}</span>
              <span class="lang-picker__name">{{ lang.label }}</span>
            </button>
          </li>
        </ul>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.lang-picker {
  display: inline-flex;
}

.lang-picker__btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  background: transparent;
  border: 1px solid var(--clr-light);
  color: var(--clr-light);
  padding: 0.35rem 0.7rem;
  border-radius: 6px;
  font-size: var(--size-xs);
  font-weight: 700;
  letter-spacing: 0.04em;
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s, border-color 0.2s;
}

/* Unscrolled gallery navbar: light background → dark text + border. */
.lang-picker.link--dark .lang-picker__btn {
  border-color: var(--clr-dark);
  color: var(--clr-dark);
}

.lang-picker__btn:hover {
  background-color: var(--clr-warm-beige-400);
  color: var(--clr-dark);
  border-color: var(--clr-warm-beige-400);
}

.lang-picker__btn svg {
  width: 1.05rem;
  height: 1.05rem;
}

.lang-picker__code {
  font-variant-numeric: tabular-nums;
}

.lang-picker__sheet {
  position: fixed;
  top: 4.5rem;
  right: 1rem;
  z-index: 10010;
  background: var(--clr-light);
  color: var(--clr-dark);
  border-radius: 10px;
  padding: 1rem 1rem 1.25rem;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.25);
  min-width: 220px;
}

.lang-picker__close {
  position: absolute;
  top: 0.25rem;
  right: 0.5rem;
  background: transparent;
  border: none;
  font-size: 1.6rem;
  line-height: 1;
  cursor: pointer;
  color: var(--clr-slate600);
}

.lang-picker__hint {
  margin: 0 0 0.75rem;
  font-size: var(--size-xs);
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--clr-slate600);
}

.lang-picker__list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.lang-picker__option {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 6px;
  padding: 0.55rem 0.6rem;
  font-size: var(--size-sm);
  font-weight: 500;
  color: var(--clr-slate800);
  cursor: pointer;
  text-align: left;
  transition: background-color 0.15s, border-color 0.15s;
}

.lang-picker__option:hover {
  background-color: var(--clr-warm-beige-200);
}

.lang-picker__option.is-current {
  background-color: var(--clr-warm-beige-200);
  border-color: var(--clr-warm-beige-400);
  font-weight: 700;
}

.lang-picker__flag {
  font-size: 1.15rem;
  line-height: 1;
}
</style>

<style>
/* Google Translate banner shifts layout — hide it. */
.goog-te-banner-frame,
.skiptranslate {
  display: none !important;
}
body {
  top: 0 !important;
}

/* Hidden mount node for the Translate widget. */
.gt-mount {
  position: fixed;
  top: -9999px;
  left: -9999px;
}
</style>
