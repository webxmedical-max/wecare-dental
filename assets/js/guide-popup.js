/* ============================================================
   guide-popup.js — Guide popup logic for service pages.
   Reads guide name from data-guide attribute on the form.
============================================================ */
(function() {
  var overlay = document.getElementById('guidePopupOverlay');
  var closeBtn = document.getElementById('guidePopupClose');
  var form = document.getElementById('guidePopupForm');
  var successMsg = document.getElementById('guidePopupSuccess');

  if (!overlay || !form) return;

  var guide = form.getAttribute('data-guide') || 'default';
  var SUBMITTED_KEY = 'site_guide_' + guide + '_submitted';
  var DISMISSED_KEY = 'site_guide_' + guide + '_dismissed';

  if (localStorage.getItem(SUBMITTED_KEY) || sessionStorage.getItem(DISMISSED_KEY)) return;

  function showPopup() {
    if (overlay.classList.contains('is-visible')) return;
    overlay.classList.remove('is-exiting');
    overlay.classList.add('is-visible');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closePopup() {
    overlay.classList.add('is-exiting');
    overlay.classList.remove('is-visible');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function dismissPopup() {
    closePopup();
    sessionStorage.setItem(DISMISSED_KEY, '1');
  }

  var timer = setTimeout(showPopup, 30000);

  function onScroll() {
    var p = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
    if (p >= 0.5) {
      clearTimeout(timer);
      window.removeEventListener('scroll', onScroll);
      showPopup();
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    var email = document.getElementById('guideEmail').value.trim();
    var guideName = form.getAttribute('data-guide') || '';
    var submitBtn = form.querySelector('.guide-popup-submit');

    if (!email) return;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Envoi en cours\u2026';

    fetch('/api/subscribe.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email, guide: guideName })
    })
    .then(function(res) { return res.json(); })
    .then(function() {
      form.hidden = true;
      successMsg.hidden = false;
      localStorage.setItem(SUBMITTED_KEY, '1');
      setTimeout(closePopup, 3000);
    })
    .catch(function() {
      form.hidden = true;
      successMsg.hidden = false;
      localStorage.setItem(SUBMITTED_KEY, '1');
      setTimeout(closePopup, 3000);
    });
  });

  closeBtn.addEventListener('click', dismissPopup);
  overlay.addEventListener('click', function(e) {
    if (e.target === overlay) dismissPopup();
  });
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && overlay.classList.contains('is-visible')) dismissPopup();
  });
})();
