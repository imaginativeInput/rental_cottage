<template>
  <footer id="kontakt">
    <div class="footer-content">
      <div class="contact-info">
        <a class="phone-link" href="tel:+48692434000">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="phone-icon">
            <path fill-rule="evenodd"
              d="M1.5 4.5a3 3 0 0 1 3-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 0 1-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 0 0 6.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 0 1 1.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 0 1-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5Z"
              clip-rule="evenodd" />
          </svg>
          <span class="phone-number">+48 692 434 000</span>
        </a>

        <a class="email-link" href="mailto:rzepiskadomek@gmail.com">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="email-icon">
            <path d="M1.5 8.67v8.58a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V8.67l-8.928 5.493a3 3 0 0 1-3.144 0L1.5 8.67Z" />
            <path
              d="M22.5 6.908V6.75a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3v.158l9.714 5.978a1.5 1.5 0 0 0 1.572 0L22.5 6.908Z" />
          </svg>
          <span class="email-text">rzepiskadomek@gmail.com</span>
        </a>
      </div>

      <div class="social-links">
        <a class="social-item google"
          href="https://www.google.com/maps/place/Domek+Panorama+Rzepiska/@49.358264,20.160799,17z/data=!3m1!4b1!4m6!3m5!1s0x4715f702446785ad:0xc02c34230f66dfb!8m2!3d49.358264!4d20.160799!16s%2Fg%2F1hhhgzcty?entry=ttu&g_ep=EgoyMDI1MDQxMy4wIKXMDSoASAFQAw%3D%3D"
          target="_blank" rel="noopener noreferrer" aria-label="Google Maps">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <defs>
              <linearGradient id="google-logo-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style="stop-color:#4285F4;" />
                <stop offset="25%" style="stop-color:#4285F4;" />
                <stop offset="25%" style="stop-color:#EA4335;" />
                <stop offset="50%" style="stop-color:#EA4335;" />
                <stop offset="50%" style="stop-color:#FBBC05;" />
                <stop offset="75%" style="stop-color:#FBBC05;" />
                <stop offset="75%" style="stop-color:#34A853;" />
                <stop offset="100%" style="stop-color:#34A853;" />
              </linearGradient>
            </defs>
            <path
              d="M12 2C8.1 2 5 5.1 5 9c0 5.3 7 13 7 13s7-7.7 7-13c0-3.9-3.1-7-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z" />
          </svg>
        </a>

        
        
        <!-- FACEBOOK commented out, cause there is no official facebook page at the moment -->
        <!-- <a class="social-item facebook" href="https://facebook.com/" target="_blank" rel="noopener noreferrer"
          aria-label="Facebook">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path
              d="M22 12a10 10 0 1 0-11.5 9.9v-7H8v-3h2.5V9.5a3.5 3.5 0 0 1 3.8-3.8h2.2v3h-1.6c-1.2 0-1.4.6-1.4 1.3V12h3l-.5 3h-2.5v7A10 10 0 0 0 22 12z" />
          </svg>
        </a> -->



        <a class="social-item instagram" href="https://www.instagram.com/domekpanoramarzepiska/" target="_blank"
          rel="noopener noreferrer" aria-label="Instagram">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <defs>
              <linearGradient id="instagram-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#FEDA75; stop-opacity:1" />
                <stop offset="25%" style="stop-color:#F58529; stop-opacity:1" />
                <stop offset="50%" style="stop-color:#DD2A7B; stop-opacity:1" />
                <stop offset="75%" style="stop-color:#8134AF; stop-opacity:1" />
                <stop offset="100%" style="stop-color:#515BD4; stop-opacity:1" />
              </linearGradient>
            </defs>
            <path
              d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8 1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3z" />
          </svg>
        </a>
      </div>
    </div>
  </footer>
</template>

<style scoped>
a {
  text-decoration: none;
/*   color: var(--clr-light); */

  color: var(--clr-warm-beige-400);
}

footer {
  padding: 2rem 1.5rem;
  background-color: var(--clr-dark);
  color: var(--clr-light);
}

.footer-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

/* Contact info */
.contact-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
}

.phone-link {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  transition: color 0.3s ease;
}

.phone-icon {
  width: 1.75rem;
  height: 1.75rem;
}

.phone-number {
  font-size: var(--size-2xl);
  font-weight: 600;
  letter-spacing: 0.05em;
}

.phone-link:hover {
   color: var(--clr-light);
}

.email-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: var(--size-sm);
  transition: color 0.3s ease;
}

.email-icon {
  width: 1.25rem;
  height: 1.25rem;
}

.email-link:hover {
   color: var(--clr-light);
}

/* Social icons */
.social-links {
  display: flex;
  align-items: center;
  gap: 1.25rem;
}

.social-item {
  display: flex;
  transition: all 0.3s ease;
}

.social-item svg {
  width: 1.75rem;
  height: 1.75rem;
  transition: all 0.3s ease;
}

.social-item:hover {
  transform: translateY(-4px);
}

.facebook:hover {
  color: #1877F2;
}

.instagram:hover svg {
  fill: url(#instagram-gradient);
}

.google:hover svg {
  fill: url(#google-logo-gradient);
}

@media (min-width: 640px) {
  footer {
    padding: 2.5rem 2rem;
  }

  .phone-icon {
    width: 2rem;
    height: 2rem;
  }

  .phone-number {
    font-size: var(--size-3xl);
  }

  .email-link {
    font-size: var(--size-base);
  }

  .email-icon {
    width: 1.5rem;
    height: 1.5rem;
  }

  .social-item svg {
    width: 2rem;
    height: 2rem;
  }
}

@media (min-width: 1024px) {
  .footer-content {
    flex-direction: row;
    justify-content: center;
    gap: 3rem;
  }

  .contact-info {
    align-items: flex-end;
  }

  .social-links {
    gap: 1.5rem;
  }

  .social-item svg {
    width: 2.25rem;
    height: 2.25rem;
  }
}
</style>
