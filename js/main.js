(function () {
  'use strict';

  function domReady(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }

  /* ===============================
     SCROLL ANIMATIONS (IMPROVED)
  =============================== */
  function initScrollAnimations() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const targets = document.querySelectorAll(
      '.hero h1, .hero .lead, .hero .hero-actions, ' +
      '.section-title, .page-title h1, .page-title .lead, ' +
      '.card-grid .card, .bento-item, .step, .cta-block .container, ' +
      '.download-options a, .legal-content, .form-width'
    );

    targets.forEach((el, i) => {
      el.classList.add('animate-in');

      // smarter stagger effect
      const delay = Math.min(i * 0.08, 0.6);
      el.style.transitionDelay = `${delay}s`;
    });

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); // performance boost
        }
      });
    }, {
      rootMargin: '0px 0px -60px 0px',
      threshold: 0.15
    });

    targets.forEach(el => observer.observe(el));
  }

  /* ===============================
     HEADER SCROLL EFFECT
  =============================== */
  function initHeaderScroll() {
    const header = document.querySelector('.site-header');
    if (!header) return;

    let lastScroll = 0;

    function onScroll() {
      const current = window.scrollY;

      header.classList.toggle('scrolled', current > 20);

      // hide on scroll down, show on scroll up
      if (current > lastScroll && current > 100) {
        header.classList.add('hide');
      } else {
        header.classList.remove('hide');
      }

      lastScroll = current;
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ===============================
     MOBILE NAV TOGGLE
  =============================== */
  function initNavToggle() {
    const toggle = document.querySelector('.nav-toggle');
    const nav = document.querySelector('.nav-desktop');

    if (!toggle || !nav) return;

    toggle.setAttribute('aria-expanded', 'false');

    toggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', isOpen);
    });

    // close when clicking outside
    document.addEventListener('click', (e) => {
      if (
        nav.classList.contains('is-open') &&
        !nav.contains(e.target) &&
        !toggle.contains(e.target)
      ) {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });

    // close on ESC key (accessibility)
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ===============================
     ACTIVE NAV LINK
  =============================== */
  function setActiveNavLink() {
    const path = window.location.pathname.replace(/\/$/, '') || '/';
    let base = path.split('/').pop() || 'index.html';

    if (base === '' || base === '/') base = 'index.html';

    document.querySelectorAll('.nav-desktop a').forEach(a => {
      const href = a.getAttribute('href') || '';

      if (
        href === base ||
        (base === 'index.html' && ['/', '.', 'index.html'].includes(href))
      ) {
        a.classList.add('active');
      } else {
        a.classList.remove('active');
      }
    });
  }

  /* ===============================
     SMOOTH SCROLL (NEW)
  =============================== */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (!target) return;

        e.preventDefault();

        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      });
    });
  }

  /* ===============================
     BUTTON RIPPLE EFFECT (NEW)
  =============================== */
  function initButtonEffects() {
    document.querySelectorAll('.btn').forEach(btn => {
      btn.addEventListener('click', function (e) {
        const circle = document.createElement('span');
        const diameter = Math.max(this.clientWidth, this.clientHeight);
        const radius = diameter / 2;

        circle.style.width = circle.style.height = `${diameter}px`;
        circle.style.left = `${e.clientX - this.offsetLeft - radius}px`;
        circle.style.top = `${e.clientY - this.offsetTop - radius}px`;
        circle.classList.add('ripple');

        const ripple = this.querySelector('.ripple');
        if (ripple) ripple.remove();

        this.appendChild(circle);
      });
    });
  }

  /* ===============================
     INIT ALL
  =============================== */
  domReady(() => {
    initScrollAnimations();
    initHeaderScroll();
    initNavToggle();
    setActiveNavLink();
    initSmoothScroll();
    initButtonEffects();
  });

})();