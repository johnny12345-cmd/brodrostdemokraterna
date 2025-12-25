/**
 * Brödrostdemokraterna - Interaktivitet
 * Hanterar klickbara personkort på ledningssidan och shrinking header
 */

// Sticky Navigation - Dölj header-top vid scroll, behåll endast nav
document.addEventListener('DOMContentLoaded', function() {
  const header = document.querySelector('header');
  const headerTop = document.querySelector('.header-top');
  const scrollThreshold = 50;

  function handleScroll() {
    // När användaren scrollar ner mer än threshold, dölj header-top
    if (window.scrollY > scrollThreshold) {
      header.classList.add('header-scrolled');
      // Justera body padding när header-top döljs
      document.body.style.paddingTop = '60px';
    } else {
      header.classList.remove('header-scrolled');
      // Återställ body padding
      document.body.style.paddingTop = '220px';
    }
  }

  // Lyssna på scroll-event med throttling för bättre prestanda
  let ticking = false;
  window.addEventListener('scroll', function() {
    if (!ticking) {
      window.requestAnimationFrame(function() {
        handleScroll();
        ticking = false;
      });
      ticking = true;
    }
  });

  // Kör en gång vid laddning
  handleScroll();
});

document.addEventListener('DOMContentLoaded', function() {
    // Hämta alla ledarkort
    const leaderCards = document.querySelectorAll('.leader-card');

    // Lägg till klickhändelse för varje kort
    leaderCards.forEach(card => {
        card.addEventListener('click', function() {
            // Stäng alla andra kort först
            leaderCards.forEach(otherCard => {
                if (otherCard !== card) {
                    otherCard.classList.remove('expanded');
                }
            });

            // Toggla det aktuella kortet
            this.classList.toggle('expanded');
        });

        // Lägg till tangentbordsstöd för tillgänglighet
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');
        card.setAttribute('aria-expanded', 'false');

        card.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });

        // Uppdatera aria-expanded när kortet expanderas/kollapsar
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.attributeName === 'class') {
                    const isExpanded = card.classList.contains('expanded');
                    card.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
                }
            });
        });

        observer.observe(card, { attributes: true });
    });

    // Smooth scroll för alla interna länkar
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Markera aktiv sida i navigationen
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('nav a').forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage) {
            link.classList.add('active');
        }
    });
});

/**
 * Förbättra videouppspeolning på mobila enheter
 */
const heroVideo = document.querySelector('.hero-video');
if (heroVideo) {
    // Försök starta videon igen om den stoppas (vissa mobila webbläsare stoppar autoplay)
    heroVideo.addEventListener('pause', function() {
        if (this.currentTime < this.duration) {
            this.play().catch(err => {
                console.log('Autoplay förhindrades:', err);
            });
        }
    });
}

/**
 * Unmute/Mute knapp för hero-video
 */
document.addEventListener('DOMContentLoaded', function() {
    const video = document.getElementById('heroVideo');
    const unmuteBtn = document.getElementById('unmuteBtn');
    const unmuteText = document.querySelector('.unmute-text');

    if (video && unmuteBtn) {
        // Sätt initial status (video är muted)
        unmuteBtn.classList.add('muted');

        // Klickhändelse för unmute-knappen
        unmuteBtn.addEventListener('click', function() {
            if (video.muted) {
                // Slå på ljud
                video.muted = false;
                unmuteBtn.classList.remove('muted');
                if (unmuteText) {
                    unmuteText.textContent = 'Tysta';
                }
                unmuteBtn.setAttribute('aria-label', 'Stäng av ljud');
            } else {
                // Slå av ljud
                video.muted = true;
                unmuteBtn.classList.add('muted');
                if (unmuteText) {
                    unmuteText.textContent = 'Lyssna på budskapet';
                }
                unmuteBtn.setAttribute('aria-label', 'Slå på ljud');
            }
        });

        // Tangentbordsstöd
        unmuteBtn.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    }
});
