/* ============================================================
   ba-slider.js — Before/After image comparison slider
============================================================ */
(function () {
  'use strict';

  function initSlider(slider) {
    var before  = slider.querySelector('.ba-before');
    var handle  = slider.querySelector('.ba-handle');
    var pct     = parseInt(slider.dataset.active, 10) || 50;
    var active  = false;

    function clamp(v) { return Math.max(2, Math.min(98, v)); }

    function set(v) {
      pct = clamp(v);
      before.style.clipPath = 'inset(0 ' + (100 - pct) + '% 0 0)';
      handle.style.left     = pct + '%';
      handle.setAttribute('aria-valuenow', Math.round(pct));
    }

    function toPercent(clientX) {
      var rect = slider.getBoundingClientRect();
      return ((clientX - rect.left) / rect.width) * 100;
    }

    set(pct);

    handle.addEventListener('mousedown', function (e) {
      e.preventDefault();
      active = true;
      slider.classList.add('ba-dragging');
    });

    document.addEventListener('mousemove', function (e) {
      if (!active) return;
      set(toPercent(e.clientX));
    });

    document.addEventListener('mouseup', function () {
      if (!active) return;
      active = false;
      slider.classList.remove('ba-dragging');
    });

    var baTouchStartY = 0;
    var baTouchLocked = null;

    handle.addEventListener('touchstart', function (e) {
      baTouchStartY = e.touches[0].clientY;
      baTouchLocked = null;
      active = true;
      slider.classList.add('ba-dragging');
    }, { passive: true });

    document.addEventListener('touchmove', function (e) {
      if (!active) return;

      var dx = Math.abs(e.touches[0].clientX - slider.getBoundingClientRect().left - (slider.getBoundingClientRect().width * pct / 100));
      var dy = Math.abs(e.touches[0].clientY - baTouchStartY);

      if (baTouchLocked === null && (dx > 8 || dy > 8)) {
        baTouchLocked = dx > dy ? 'h' : 'v';
      }

      if (baTouchLocked !== 'h') return;

      e.preventDefault();
      set(toPercent(e.touches[0].clientX));
    }, { passive: false });

    document.addEventListener('touchend', function () {
      if (!active) return;
      active = false;
      baTouchLocked = null;
      slider.classList.remove('ba-dragging');
    });

    handle.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft')  { e.preventDefault(); set(pct - 5); }
      if (e.key === 'ArrowRight') { e.preventDefault(); set(pct + 5); }
      if (e.key === 'Home')       { e.preventDefault(); set(2);  }
      if (e.key === 'End')        { e.preventDefault(); set(98); }
    });

    slider.addEventListener('click', function (e) {
      if (e.target === handle || handle.contains(e.target)) return;
      set(toPercent(e.clientX));
    });
  }

  document.querySelectorAll('.ba-slider').forEach(initSlider);
})();
