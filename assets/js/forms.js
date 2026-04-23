(function () {
  'use strict';

  var form     = document.getElementById('contact-form');
  var modal    = document.getElementById('success-modal');
  var closeBtn = document.getElementById('success-close');

  if (!form || !modal) return;

  /* ── Validation rules per field ── */
  var rules = {
    name: {
      test: function (v) {
        return v.length >= 3 && /^[a-zA-Z\u00C0-\u024F\s\-']+$/.test(v);
      },
      msg: 'Lettres uniquement, minimum 3 caractères.'
    },
    phone: {
      test: function (v) {
        /* Strip spaces, dashes, dots, parens, plus — then check digit count */
        var digits = v.replace(/[\s\-.()+]/g, '');
        return /^\d{8,13}$/.test(digits);
      },
      msg: 'Numéro invalide. Exemple\u00a0: 06 12 34 56 78 ou +212 6 12 34 56 78.'
    }
  };

  /* ── State helpers ── */
  function setInvalid(field, errorEl, msg) {
    field.classList.add('is-invalid');
    field.classList.remove('is-valid');
    if (errorEl) errorEl.textContent = msg;
  }

  function setValid(field, errorEl) {
    field.classList.remove('is-invalid');
    field.classList.add('is-valid');
    if (errorEl) errorEl.textContent = '';
  }

  function clearState(field, errorEl) {
    field.classList.remove('is-invalid', 'is-valid');
    if (errorEl) errorEl.textContent = '';
  }

  /* ── Validate a single field ── */
  function validateField(field) {
    var value   = field.value.trim();
    var errorEl = field.parentNode.querySelector('.form-error');
    var rule    = rules[field.id];

    if (!value) {
      setInvalid(field, errorEl, 'Ce champ est requis.');
      return false;
    }

    if (rule && !rule.test(value)) {
      setInvalid(field, errorEl, rule.msg);
      return false;
    }

    setValid(field, errorEl);
    return true;
  }

  /* ── Validate the whole form ── */
  function validate() {
    var valid = true;
    form.querySelectorAll('[required]').forEach(function (field) {
      if (!validateField(field)) valid = false;
    });
    return valid;
  }

  /* ── Build WhatsApp message ── */
  function buildWhatsAppMessage(data) {
    var lines = [
      'Hello, I would like to book an appointment.',
      '',
      'Nom\u00a0: ' + data.name,
      'T\u00e9l\u00e9phone\u00a0: ' + data.phone,
      'Motif\u00a0: ' + data.motif,
    ];
    if (data.message) lines.push('Message\u00a0: ' + data.message);
    return encodeURIComponent(lines.join('\n'));
  }

  /* ── Modal ── */
  function openModal() {
    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    if (closeBtn) closeBtn.focus();
  }

  function closeModal() {
    modal.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  /* ── Submit ── */
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!validate()) return;

    var data = {
      name:    form.querySelector('#name').value.trim(),
      phone:   form.querySelector('#phone').value.trim(),
      motif:   form.querySelector('#motif').value,
      message: form.querySelector('#message') ? form.querySelector('#message').value.trim() : '',
    };

    var waURL = 'https://wa.me/1234567890?text=' + buildWhatsAppMessage(data);

    openModal();
    setTimeout(function () {
      window.open(waURL, '_blank', 'noopener,noreferrer');
    }, 800);
  });

  /* ── Close modal ── */
  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', function (e) {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
  });

  /* ── Real-time feedback ── */
  form.querySelectorAll('[required]').forEach(function (field) {
    /* Validate on blur so user is not interrupted while typing */
    field.addEventListener('blur', function () {
      if (field.value.trim()) validateField(field);
    });

    /* Clear error as soon as the user starts correcting */
    field.addEventListener('input', function () {
      if (field.classList.contains('is-invalid')) {
        clearState(field, field.parentNode.querySelector('.form-error'));
      }
    });
  });

})();
