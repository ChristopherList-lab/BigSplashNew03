/* ========================================
   BIG SPLASH - Animations & Interactions
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {

  // --- Navbar Scroll Effect ---
  const navbar = document.getElementById('navbar');
  const onScroll = () => {
    if (window.scrollY > 80) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();


  // --- Mobile Menu Toggle ---
  const menuToggle = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = mobileMenu.querySelectorAll('a');

  menuToggle.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
    document.body.classList.toggle('menu-open');
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      document.body.classList.remove('menu-open');
    });
  });


  // --- Scroll Reveal (Intersection Observer) ---
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.style.animationDelay || '0s';
        const ms = parseFloat(delay) * 1000;
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, ms);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  revealElements.forEach(el => revealObserver.observe(el));


  // --- Parallax Scroll ---
  const parallaxElements = document.querySelectorAll('[data-parallax]');
  let ticking = false;

  const updateParallax = () => {
    const scrollY = window.scrollY;
    parallaxElements.forEach(el => {
      const speed = parseFloat(el.getAttribute('data-parallax'));
      const offset = scrollY * speed;
      el.style.transform = `translateY(${offset}px)`;
    });
    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }, { passive: true });


  // --- Number Counter Animation ---
  const counters = document.querySelectorAll('[data-count-to]');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-count-to'));
        const duration = 2000;
        const start = performance.now();

        const animate = (now) => {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.round(target * eased) + '+';
          if (progress < 1) requestAnimationFrame(animate);
        };

        requestAnimationFrame(animate);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => counterObserver.observe(el));


  // --- Cursor Spotlight (Desktop Only) ---
  const spotlight = document.getElementById('cursor-spotlight');
  if (window.matchMedia('(pointer: fine)').matches && spotlight) {
    document.addEventListener('mousemove', (e) => {
      spotlight.style.left = (e.clientX - 200) + 'px';
      spotlight.style.top = (e.clientY - 200) + 'px';
      if (!spotlight.classList.contains('active')) {
        spotlight.classList.add('active');
      }
    });

    document.addEventListener('mouseleave', () => {
      spotlight.classList.remove('active');
    });
  }


  // --- Video Modal ---
  const modal = document.getElementById('video-modal');
  const modalIframe = document.getElementById('modal-iframe');
  const modalClose = document.getElementById('modal-close');

  // Portfolio cards with data-video attribute open the modal
  document.querySelectorAll('[data-video]').forEach(card => {
    card.addEventListener('click', () => {
      const videoUrl = card.getAttribute('data-video');
      modalIframe.src = videoUrl;
      modal.classList.remove('opacity-0', 'pointer-events-none');
      document.body.classList.add('modal-open');
    });
  });

  const closeModal = () => {
    modal.classList.add('opacity-0', 'pointer-events-none');
    modalIframe.src = '';
    document.body.classList.remove('modal-open');
  };

  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modal) modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

});
