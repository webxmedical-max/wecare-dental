/* ============================================================
   main.js — Fluid interactions · Parallax · Scroll reveal
   Rhode-inspired: smooth, elastic, rhythmic — never flat
============================================================ */

(function () {
  'use strict';

  var nav        = document.getElementById('nav');
  var hamburger  = document.getElementById('hamburger');
  var drawer     = document.getElementById('nav-drawer');
  var overlay    = document.getElementById('drawer-overlay');
  var dropdownEl = document.querySelector('.nav-dropdown');
  var dropdownBtn = document.getElementById('services-toggle');
  var topbar     = document.getElementById('nav-topbar');

  /* Homepage hero: make nav transparent until scroll */
  var isHeroPage = document.querySelector('.hero-section .hero-bg');
  if (nav && isHeroPage) {
    nav.classList.add('nav-hero-mode');
  }

  /* ----------------------------------------------------------
     1. NAV — scrolled state + topbar collapse
  ---------------------------------------------------------- */
  var topbarH = topbar ? topbar.offsetHeight : 0;
  var ticking = false;

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(function () {
        var y = window.scrollY;

        if (y > 20) {
          nav.classList.add('scrolled');
        } else {
          nav.classList.remove('scrolled');
        }

        if (topbar && window.innerWidth >= 768) {
          if (y > topbarH) {
            nav.classList.add('scrolled-past-topbar');
            topbar.style.transform = 'translateY(-100%)';
          } else {
            nav.classList.remove('scrolled-past-topbar');
            topbar.style.transform = '';
          }
        }

        // Hero parallax
        updateParallax(y);

        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ----------------------------------------------------------
     2. MOBILE DRAWER — hamburger toggle + close + accordion
  ---------------------------------------------------------- */
  var drawerClose = document.getElementById('drawer-close');
  var svcToggle   = document.getElementById('drawer-svc-toggle');
  var svcPanel    = document.getElementById('drawer-svc-panel');

  function openDrawer() {
    drawer.classList.add('open');
    overlay.classList.add('open');
    hamburger.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    drawer.classList.remove('open');
    overlay.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (hamburger) hamburger.addEventListener('click', function () {
    drawer.classList.contains('open') ? closeDrawer() : openDrawer();
  });

  if (drawerClose) drawerClose.addEventListener('click', closeDrawer);
  if (overlay) overlay.addEventListener('click', closeDrawer);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && drawer && drawer.classList.contains('open')) {
      closeDrawer();
    }
  });

  /* Services accordion inside drawer */
  if (svcToggle && svcPanel) {
    svcToggle.addEventListener('click', function () {
      var isOpen = svcPanel.classList.toggle('is-open');
      svcToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    /* Auto-expand if current page is a service page */
    if (svcPanel.querySelector('[aria-current="page"]')) {
      svcPanel.classList.add('is-open');
      svcToggle.setAttribute('aria-expanded', 'true');
    }
  }

  /* ----------------------------------------------------------
     3. SERVICES DROPDOWN — click toggle (desktop)
  ---------------------------------------------------------- */
  if (dropdownBtn && dropdownEl) {
    dropdownBtn.addEventListener('click', function () {
      var isOpen = dropdownEl.classList.toggle('open');
      dropdownBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    document.addEventListener('click', function (e) {
      if (!dropdownEl.contains(e.target)) {
        dropdownEl.classList.remove('open');
        dropdownBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ----------------------------------------------------------
     4. SCROLL REVEAL — fluid viewport entry animations
     Handles: .animate-enter, .animate-rise, .animate-scale, .animate-clip
  ---------------------------------------------------------- */
  var animateSelectors = '.animate-enter, .animate-rise, .animate-scale, .animate-clip';
  var animateEls = document.querySelectorAll(animateSelectors);

  if (animateEls.length && 'IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    animateEls.forEach(function (el) { observer.observe(el); });
  } else {
    animateEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ----------------------------------------------------------
     5. HERO PARALLAX — subtle depth on scroll
     Image moves slower than scroll, creating depth
  ---------------------------------------------------------- */
  var heroPhoto = document.querySelector('.hero-photo');
  var heroImageCol = document.querySelector('.hero-image-col');

  function updateParallax(scrollY) {
    if (!heroPhoto || !heroImageCol) return;

    var rect = heroImageCol.getBoundingClientRect();
    var windowH = window.innerHeight;

    // Only apply when hero image is in or near viewport
    if (rect.bottom < -100 || rect.top > windowH + 100) return;

    // Parallax factor: how much slower the image moves (0.15 = subtle)
    var progress = (windowH - rect.top) / (windowH + rect.height);
    var offset = (progress - 0.5) * 60; // max 30px movement

    heroPhoto.style.transform = 'translateY(' + offset + 'px) scale(1.05)';
  }

  /* ----------------------------------------------------------
     6. SERVICES CAROUSEL — swipe / drag / arrows
  ---------------------------------------------------------- */
  var track   = document.getElementById('svc-track');
  var btnPrev = document.getElementById('svc-prev');
  var btnNext = document.getElementById('svc-next');

  if (track && btnPrev && btnNext) {
    var idx = 0;
    var dragging = false;
    var startX = 0;
    var currentX = 0;
    var hasMoved = false;
    var startTime = 0;

    function cardStep() {
      var card = track.querySelector('.svc-card');
      if (!card) return 300;
      return card.offsetWidth + (parseFloat(getComputedStyle(track).gap) || 0);
    }

    function maxIdx() {
      var cards = track.querySelectorAll('.svc-card').length;
      var visible = Math.floor(track.parentElement.offsetWidth / cardStep()) || 1;
      return Math.max(0, cards - visible);
    }

    function goTo(i) {
      idx = Math.max(0, Math.min(i, maxIdx()));
      track.style.transform = 'translateX(' + (-idx * cardStep()) + 'px)';
      btnPrev.disabled = idx === 0;
      btnNext.disabled = idx >= maxIdx();
    }

    function onStart(x) {
      dragging = true;
      hasMoved = false;
      startX = x;
      currentX = x;
      startTime = Date.now();
      track.classList.add('is-dragging');
    }

    function onMove(x) {
      if (!dragging) return;
      currentX = x;
      var dx = currentX - startX;
      if (Math.abs(dx) > 4) hasMoved = true;
      var offset = -idx * cardStep() + dx;
      track.style.transform = 'translateX(' + offset + 'px)';
    }

    function onEnd() {
      if (!dragging) return;
      dragging = false;
      track.classList.remove('is-dragging');

      var dx = currentX - startX;
      var dt = Date.now() - startTime;
      var velocity = dx / (dt || 1);
      var threshold = cardStep() * 0.2;

      if (Math.abs(dx) > threshold || Math.abs(velocity) > 0.4) {
        goTo(dx < 0 ? idx + 1 : idx - 1);
      } else {
        goTo(idx);
      }
    }

    /* Arrow buttons */
    btnNext.addEventListener('click', function () { goTo(idx + 1); });
    btnPrev.addEventListener('click', function () { goTo(idx - 1); });

    /* Mouse */
    track.addEventListener('mousedown', function (e) {
      if (e.button !== 0) return;
      e.preventDefault();
      onStart(e.clientX);
    });
    window.addEventListener('mousemove', function (e) { onMove(e.clientX); });
    window.addEventListener('mouseup', onEnd);

    /* Touch — direction lock: only swipe horizontally if intent is clear */
    var touchStartY = 0;
    var touchLocked = null; // null = undecided, 'h' = horizontal, 'v' = vertical

    track.addEventListener('touchstart', function (e) {
      touchStartY = e.touches[0].clientY;
      touchLocked = null;
      onStart(e.touches[0].clientX);
    }, { passive: true });

    track.addEventListener('touchmove', function (e) {
      if (!dragging) return;

      var dx = Math.abs(e.touches[0].clientX - startX);
      var dy = Math.abs(e.touches[0].clientY - touchStartY);

      // Decide direction on first significant movement (8px dead zone)
      if (touchLocked === null && (dx > 8 || dy > 8)) {
        touchLocked = dx > dy ? 'h' : 'v';
      }

      // If vertical or undecided, let the page scroll normally
      if (touchLocked !== 'h') return;

      // Horizontal swipe — prevent page scroll, move carousel
      e.preventDefault();
      onMove(e.touches[0].clientX);
    }, { passive: false });

    track.addEventListener('touchend', function () {
      if (touchLocked !== 'h') {
        // Was a vertical scroll, snap back without changing slide
        dragging = false;
        track.classList.remove('is-dragging');
        goTo(idx);
        return;
      }
      onEnd();
    });
    track.addEventListener('touchcancel', function () {
      dragging = false;
      track.classList.remove('is-dragging');
      touchLocked = null;
      goTo(idx);
    });

    /* Block clicks after drag */
    track.addEventListener('click', function (e) {
      if (hasMoved) { e.preventDefault(); e.stopPropagation(); }
    }, true);

    /* Resize */
    window.addEventListener('resize', function () { goTo(idx); }, { passive: true });

    goTo(0);
  }

  /* ----------------------------------------------------------
     7. SMOOTH COUNTER — animate trust strip numbers
     Numbers count up when they enter the viewport
  ---------------------------------------------------------- */
  var counterEls = document.querySelectorAll('.trust-strip-number');

  if (counterEls.length && 'IntersectionObserver' in window) {
    var counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;

        var el = entry.target;
        var text = el.textContent.trim();
        var match = text.match(/^([\d.]+)(\+?)$/);

        if (match) {
          var target = parseFloat(match[1]);
          var suffix = match[2] || '';
          var isFloat = text.indexOf('.') !== -1;
          var duration = 1200;
          var start = performance.now();

          function easeOutExpo(t) {
            return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
          }

          function animate(now) {
            var elapsed = now - start;
            var progress = Math.min(elapsed / duration, 1);
            var eased = easeOutExpo(progress);
            var current = eased * target;

            el.textContent = (isFloat ? current.toFixed(1) : Math.round(current)) + suffix;

            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          }

          requestAnimationFrame(animate);
        }

        counterObserver.unobserve(el);
      });
    }, { threshold: 0.5 });

    counterEls.forEach(function (el) { counterObserver.observe(el); });
  }

  /* ----------------------------------------------------------
     8. PAGE LOAD — trigger entrance animations
  ---------------------------------------------------------- */
  document.body.classList.add('is-loaded');

})();
