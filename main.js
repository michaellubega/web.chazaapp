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

  function initSupportForm() {
    var form = document.getElementById('support-form');
    if (!form) return;

    var statusEl = document.getElementById('support-status');
    var submitBtn = document.getElementById('support-submit');
    var hintEl = document.getElementById('support-hint');
    var fieldsEl = document.getElementById('support-fields');
    var successEl = document.getElementById('support-success');
    var againBtn = document.getElementById('support-again');
    var endpoint = '/api/v1/support/';
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function setStatus(message, ok) {
      if (!statusEl) return;
      statusEl.hidden = !message;
      statusEl.textContent = message || '';
      statusEl.classList.toggle('is-ok', !!ok);
      statusEl.classList.toggle('is-err', !ok && !!message);
    }

    function showSuccess() {
      form.reset();
      setStatus('', false);
      if (hintEl) hintEl.hidden = false;
      form.classList.add('is-success');

      if (fieldsEl) {
        fieldsEl.setAttribute('aria-hidden', 'true');
        fieldsEl.querySelectorAll('input, select, textarea, button').forEach(function (el) {
          el.disabled = true;
          el.setAttribute('tabindex', '-1');
        });
      }

      if (successEl) {
        successEl.hidden = false;
        // Restart CSS animations on repeat sends
        successEl.classList.remove('is-visible');
        void successEl.offsetWidth;
        successEl.classList.add('is-visible');
        if (!reduceMotion) {
          successEl.classList.add('is-animating');
        }
      }

      if (againBtn) {
        window.setTimeout(function () {
          againBtn.focus();
        }, reduceMotion ? 0 : 650);
      }
    }

    function showFormAgain() {
      form.classList.remove('is-success');
      setStatus('', false);
      if (successEl) {
        successEl.hidden = true;
        successEl.classList.remove('is-visible', 'is-animating');
      }
      if (fieldsEl) {
        fieldsEl.removeAttribute('aria-hidden');
        fieldsEl.querySelectorAll('input, select, textarea, button').forEach(function (el) {
          el.disabled = false;
          el.removeAttribute('tabindex');
        });
      }
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send message';
      }
      var nameInput = form.querySelector('#name');
      if (nameInput) nameInput.focus();
    }

    if (againBtn) {
      againBtn.addEventListener('click', showFormAgain);
    }

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      setStatus('', false);

      var name = (form.name && form.name.value || '').trim();
      var email = (form.email && form.email.value || '').trim();
      var subject = (form.subject && form.subject.value || 'ChazaApp Support').trim();
      var message = (form.message && form.message.value || '').trim();
      var website = (form.website && form.website.value || '').trim();

      if (name.length < 2) {
        setStatus('Please enter your name.', false);
        return;
      }
      if (!email || email.indexOf('@') < 1) {
        setStatus('Please enter a valid email address.', false);
        return;
      }
      if (message.length < 10) {
        setStatus('Please write a bit more detail (at least 10 characters).', false);
        return;
      }

      var imageInput = form.querySelector('#images');
      var files = imageInput && imageInput.files ? Array.prototype.slice.call(imageInput.files) : [];
      var allowed = { 'image/jpeg': 1, 'image/png': 1, 'image/gif': 1, 'image/webp': 1 };
      if (files.length > 5) {
        setStatus('You can attach at most 5 images.', false);
        return;
      }
      for (var i = 0; i < files.length; i++) {
        var f = files[i];
        var ext = (f.name.split('.').pop() || '').toLowerCase();
        if (ext === 'svg' || !allowed[f.type]) {
          setStatus('Only JPEG, PNG, GIF, or WebP images are allowed.', false);
          return;
        }
        if (f.size > 5 * 1024 * 1024) {
          setStatus('Each image must be 5 MB or smaller.', false);
          return;
        }
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending…';
      }

      var body;
      var headers = { Accept: 'application/json' };
      if (files.length) {
        body = new FormData();
        body.append('name', name);
        body.append('email', email);
        body.append('subject', subject);
        body.append('message', message);
        body.append('website', website);
        files.forEach(function (file) {
          body.append('images', file);
        });
      } else {
        headers['Content-Type'] = 'application/json';
        body = JSON.stringify({
          name: name,
          email: email,
          subject: subject,
          message: message,
          website: website,
        });
      }

      fetch(endpoint, {
        method: 'POST',
        headers: headers,
        body: body,
      })
        .then(function (res) {
          return res.json().then(function (data) {
            return { ok: res.ok, status: res.status, data: data };
          }).catch(function () {
            return { ok: res.ok, status: res.status, data: {} };
          });
        })
        .then(function (result) {
          var dataOk = result.data && result.data.ok === true;
          if (result.ok || result.status === 201 || dataOk) {
            showSuccess();
            return;
          }
          if (result.status === 429) {
            setStatus('Too many messages. Please try again later.', false);
            return;
          }
          var detail = result.data && (result.data.detail || result.data.message);
          if (!detail && result.data) {
            var keys = Object.keys(result.data);
            if (keys.length) {
              var first = result.data[keys[0]];
              detail = Array.isArray(first) ? first[0] : String(first);
            }
          }
          setStatus(detail || 'Something went wrong. Please try again or email us directly.', false);
        })
        .catch(function () {
          setStatus('Network error. Please check your connection and try again.', false);
        })
        .finally(function () {
          if (form.classList.contains('is-success')) return;
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Send message';
          }
        });
    });
  }

  function initHomeCatalog() {
    var box = document.querySelector('[data-home-catalog]');
    if (!box) return;
    fetch('/api/v1/storefront/catalog/?limit=8')
      .then(function (r) { return r.json(); })
      .then(function (data) {
        var items = (data && data.results) || [];
        if (!items.length) {
          box.innerHTML = '<p style="color:var(--text-muted)">Public shops appear here. <a href="/shop/">Browse the directory</a>.</p>';
          return;
        }
        box.innerHTML = items.map(function (p) {
          var img = p.image_url
            ? '<img src="' + p.image_url + '" alt="" loading="lazy">'
            : '<div class="catalog-ph" aria-hidden="true"></div>';
          return '<a class="catalog-card" href="' + (p.url || '/shop/') + '">' +
            img + '<div class="body"><h3>' + (p.name || '') + '</h3>' +
            '<p class="price">' + (p.currency_symbol || '') + (p.price || '') + '</p>' +
            '<p class="shop">' + (p.shop_name || '') + '</p></div></a>';
        }).join('');
      })
      .catch(function () {
        box.innerHTML = '<p style="color:var(--text-muted)"><a href="/shop/">Browse public shops</a></p>';
      });
  }

  onReady(function () {
    initMobileNav();
    initHeader();
    initReveal();
    initAnchors();
    setActiveNavLink();
    initSupportForm();
    initHomeCatalog();

    document.querySelectorAll('[data-play-store]').forEach(function (el) {
      el.setAttribute('href', PLAY_STORE_URL);
    });
  });
})();
