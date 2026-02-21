/* ============================================================
   EXPAT.STLUCIA.STUDIO — Core App Logic
   Vanilla JS — no frameworks, no build tools
   ============================================================ */

(function () {
  'use strict';

  /* ── Hamburger / Mobile Nav ──────────────────────────────── */
  function initHamburger() {
    const btn = document.querySelector('.navbar__hamburger');
    const nav = document.querySelector('.mobile-nav');
    if (!btn || !nav) return;

    btn.addEventListener('click', function () {
      const isOpen = nav.classList.toggle('open');
      btn.classList.toggle('open', isOpen);
      btn.setAttribute('aria-expanded', isOpen);
    });

    // Close on link click
    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('open');
        btn.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
      });
    });

    // Close on outside click
    document.addEventListener('click', function (e) {
      if (!btn.contains(e.target) && !nav.contains(e.target)) {
        nav.classList.remove('open');
        btn.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ── Accordion ───────────────────────────────────────────── */
  function initAccordions() {
    document.querySelectorAll('.accordion__header').forEach(function (header) {
      // Keyboard accessible
      header.setAttribute('role', 'button');
      header.setAttribute('tabindex', '0');

      function toggle() {
        var isOpen = header.classList.contains('open');
        var body = header.nextElementSibling;

        if (!isOpen) {
          header.classList.add('open');
          body.classList.add('open');
          header.setAttribute('aria-expanded', 'true');
        } else {
          header.classList.remove('open');
          body.classList.remove('open');
          header.setAttribute('aria-expanded', 'false');
        }
      }

      header.addEventListener('click', toggle);
      header.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggle();
        }
      });
    });

    // Auto-open first accordion if present
    var first = document.querySelector('.accordion__header');
    if (first && !first.classList.contains('no-auto')) {
      first.click();
    }
  }

  /* ── Sidebar Scroll Spy ──────────────────────────────────── */
  function initScrollSpy() {
    var sidebar = document.querySelector('.sidebar');
    if (!sidebar) return;

    var links = sidebar.querySelectorAll('a[href^="#"]');
    if (!links.length) return;

    var sections = [];
    links.forEach(function (link) {
      var id = link.getAttribute('href').slice(1);
      var el = document.getElementById(id);
      if (el) sections.push({ link: link, el: el });
    });

    var navH = (document.querySelector('.super-nav') ? 28 : 0) +
               (document.querySelector('.navbar') ? 60 : 0) + 16;

    function onScroll() {
      var scrollY = window.scrollY || window.pageYOffset;
      var current = null;

      sections.forEach(function (s) {
        if (s.el.getBoundingClientRect().top + scrollY - navH <= scrollY + 2) {
          current = s;
        }
      });

      links.forEach(function (l) { l.classList.remove('active'); });
      if (current) current.link.classList.add('active');
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ── Smooth Scroll for anchor links ─────────────────────── */
  function initSmoothScroll() {
    var navH = (document.querySelector('.super-nav') ? 28 : 0) +
               (document.querySelector('.navbar') ? 60 : 0) + 8;

    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var id = a.getAttribute('href').slice(1);
        var target = document.getElementById(id);
        if (!target) return;
        e.preventDefault();
        var top = target.getBoundingClientRect().top + window.scrollY - navH;
        window.scrollTo({ top: top, behavior: 'smooth' });
      });
    });
  }

  /* ── Active nav link highlighter ────────────────────────── */
  function initActiveNav() {
    var page = window.location.pathname.split('/').pop() || 'index.html';

    // Main navbar
    document.querySelectorAll('.navbar__links a, .mobile-nav a').forEach(function (a) {
      var href = a.getAttribute('href');
      if (!href) return;
      var file = href.split('/').pop();
      if (file === page || (page === '' && file === 'index.html')) {
        a.classList.add('active');
      }
    });

    // Super nav — expat is always active here
    document.querySelectorAll('.super-nav a').forEach(function (a) {
      if (a.classList.contains('active')) return; // already set in HTML
    });
  }

  /* ── Simple table row highlight ─────────────────────────── */
  function initTableHighlight() {
    document.querySelectorAll('tbody tr').forEach(function (tr) {
      tr.addEventListener('mouseenter', function () {
        tr.style.cursor = 'default';
      });
    });
  }

  /* ── Back to Top ─────────────────────────────────────────── */
  function initBackToTop() {
    var btn = document.getElementById('back-to-top');
    if (!btn) return;

    window.addEventListener('scroll', function () {
      btn.style.display = window.scrollY > 400 ? 'flex' : 'none';
    }, { passive: true });

    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ── Collapsible Table of Contents ─────────────────────── */
  function initTOC() {
    var toc = document.getElementById('toc-toggle');
    if (!toc) return;
    toc.addEventListener('click', function () {
      var list = document.getElementById('toc-list');
      if (list) list.style.display = list.style.display === 'none' ? 'block' : 'none';
    });
  }

  /* ── EC$/US$ Currency Toggle ─────────────────────────────── */
  function initCurrencyToggles() {
    document.querySelectorAll('[data-ec]').forEach(function (el) {
      var ec = el.dataset.ec;
      var us = el.dataset.us;
      if (!ec || !us) return;
      el.title = 'EC$' + ec + ' / US$' + us;
    });
  }

  /* ── Lazy load images (IntersectionObserver) ─────────────── */
  function initLazyImages() {
    if (!('IntersectionObserver' in window)) return;
    var imgs = document.querySelectorAll('img[data-src]');
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          io.unobserve(img);
        }
      });
    }, { rootMargin: '200px' });
    imgs.forEach(function (img) { io.observe(img); });
  }

  /* ── Print button ────────────────────────────────────────── */
  function initPrint() {
    document.querySelectorAll('[data-print]').forEach(function (btn) {
      btn.addEventListener('click', function () { window.print(); });
    });
  }

  /* ── Year auto-update ────────────────────────────────────── */
  function initYear() {
    document.querySelectorAll('.js-year').forEach(function (el) {
      el.textContent = new Date().getFullYear();
    });
  }

  /* ── Bootstrap ───────────────────────────────────────────── */
  function init() {
    initHamburger();
    initAccordions();
    initScrollSpy();
    initSmoothScroll();
    initActiveNav();
    initTableHighlight();
    initBackToTop();
    initTOC();
    initCurrencyToggles();
    initLazyImages();
    initPrint();
    initYear();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
