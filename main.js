(function () {
  'use strict';

  var PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.chazaapp';

  function onReady(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
      return;
    }
    fn();
  }

  function initMobileNav() {
    var toggle = document.getElementById('nav-toggle');
    var mobile = document.getElementById('mobile-nav');
    if (!toggle || !mobile) return;

    toggle.addEventListener('click', function () {
      var isOpen = mobile.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    mobile.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        mobile.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        mobile.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }

  function initHeader() {
    var header = document.getElementById('site-header');
    if (!header) return;

    window.addEventListener('scroll', function () {
      header.classList.toggle('scrolled', window.scrollY > 8);
    }, { passive: true });
  }

  function initThemeToggle() {
    var toggle = document.getElementById('theme-toggle');
    if (!toggle) return;

    var key = 'chaza-theme';

    toggle.addEventListener('click', function () {
      var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      if (isDark) {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem(key, 'light');
      } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem(key, 'dark');
      }
    });
  }

  function initReveal() {
    var items = document.querySelectorAll('.reveal');
    if (!items.length) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      items.forEach(function (el) { el.classList.add('visible'); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    items.forEach(function (item, index) {
      item.style.transitionDelay = Math.min(index * 0.04, 0.3) + 's';
      observer.observe(item);
    });
  }

  function initAnchors() {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (event) {
        var href = anchor.getAttribute('href');
        if (!href || href === '#') return;
        var target = document.querySelector(href);
        if (!target) return;
        event.preventDefault();
        var top = target.getBoundingClientRect().top + window.scrollY - 56;
        window.scrollTo({ top: top, behavior: 'smooth' });
      });
    });
  }

  function setActiveNavLink() {
    var path = window.location.pathname.replace(/\/$/, '') || '/';
    var base = path.split('/').pop() || 'index.html';
    if (base === '' || base === '/') base = 'index.html';

    document.querySelectorAll('.nav-link').forEach(function (a) {
      var href = a.getAttribute('href') || '';
      var linkFile = href.split('#')[0] || 'index.html';
      if (linkFile === '' || linkFile === '/') linkFile = 'index.html';

      if (linkFile === base || (base === 'index.html' && linkFile === 'index.html' && !href.includes('#'))) {
        if (href.includes('#') && base !== 'index.html') return;
        if (href.includes('#') && window.location.hash !== '#' + href.split('#')[1]) return;
        a.classList.add('active');
      } else if (linkFile === base) {
        a.classList.add('active');
      } else {
        a.classList.remove('active');
      }
    });
  }

  onReady(function () {
    initMobileNav();
    initHeader();
    initThemeToggle();
    initReveal();
    initAnchors();
    setActiveNavLink();

    document.querySelectorAll('[data-play-store]').forEach(function (el) {
      el.setAttribute('href', PLAY_STORE_URL);
    });
  });
})();
