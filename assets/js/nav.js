/* ============================================================
   nav.js — Two-row nav: info bar (burgundy) + main nav (white)
   Each page sets data-root and data-page on <body>
============================================================ */
(function () {
  var root    = document.body.dataset.root || '';
  var current = document.body.dataset.page || '';

  var WA_SVG = '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.815 0 00-3.48-8.413z"/></svg>';

  var PHONE_SVG = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>';

  var CLOCK_SVG = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>';

  var PIN_SVG = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>';

  var IG_SVG = '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>';

  var LI_SVG = '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>';

  var ARROW_SVG = '<svg class="nav-dropdown-arrow" viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="M2 4l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  var services = [
    ['implant-dentaire.html',       'Implants dentaires'],
    ['facettes-dentaires.html',     'Facettes dentaires'],
    ['hollywood-smile.html',        'Hollywood Smile'],
    ['gouttiere-dentaire.html',     'Gouttieres dentaires'],
    ['couronne-dentaire.html',      'Couronnes dentaires'],
    ['orthodontie.html',            'Orthodontie'],
    ['blanchiment-dentaire.html',   'Blanchiment dentaire'],
    ['soins-dentaires.html',        'Soins dentaires'],
    ['urgence-dentaire.html',       'Urgence dentaire']
  ];

  function svcDropdownItems() {
    return services.map(function (s) {
      var isCurrent = s[0] === current;
      return '<a href="' + root + s[0] + '" class="nav-dropdown-item" role="menuitem"'
        + (isCurrent ? ' aria-current="page"' : '') + '>' + s[1] + '</a>';
    }).join('\n            ');
  }

  function svcDrawerItems() {
    return services.map(function (s) {
      var isCurrent = s[0] === current;
      return '<a href="' + root + s[0] + '" class="nav-drawer-sub-link"'
        + (isCurrent ? ' aria-current="page"' : '') + '>' + s[1] + '</a>';
    }).join('\n        ');
  }

  function topLink(href, label) {
    var isCurrent = (current === href.split('/').pop());
    return '<a href="' + root + href + '" class="nav-link" role="menuitem"'
      + (isCurrent ? ' aria-current="page"' : '') + '>' + label + '</a>';
  }

  function drawerLink(href, label) {
    var isCurrent = (current === href.split('/').pop());
    return '<a href="' + root + href + '" class="nav-drawer-link"'
      + (isCurrent ? ' aria-current="page"' : '') + '>' + label + '</a>';
  }

  var CLOSE_SVG = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';

  var html = '\
  <!-- Top info bar (burgundy) -->\
  <div class="nav-topbar" id="nav-topbar">\
    <div class="nav-topbar-inner">\
      <div class="nav-topbar-left">\
        <a href="tel:+212520939575/0770193085" class="nav-topbar-item">' + PHONE_SVG + ' 05 20 93 95 75 / 07 70 19 30 85</a>\
        <span class="nav-topbar-sep"></span>\
        <span class="nav-topbar-item">' + CLOCK_SVG + ' Lun-Ven 09h-18h, Sam 09h-14h</span>\
        <span class="nav-topbar-sep"></span>\
        <span class="nav-topbar-item">' + PIN_SVG + ' Oulfa, Casablanca</span>\
      </div>\
      <div class="nav-topbar-right">\
        <div class="nav-topbar-social">\
          <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Instagram">' + IG_SVG + '</a>\
          <a href="#" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">' + LI_SVG + '</a>\
        </div>\
      </div>\
    </div>\
  </div>\
  <!-- Main nav bar (white) -->\
  <nav class="nav" id="nav" role="navigation" aria-label="Navigation principale">\
    <div class="nav-inner">\
      <a href="' + root + 'index.html" class="nav-logo" aria-label="Accueil">\
        <span class="nav-logo-text">LOGO</span>\
      </a>\
      <div class="nav-links" role="menubar">\
        <div class="nav-dropdown" role="none">\
          <button class="nav-dropdown-toggle" aria-haspopup="true" aria-expanded="false" id="services-toggle">\
            Nos Soins ' + ARROW_SVG + '\
          </button>\
          <div class="nav-dropdown-menu" role="menu" aria-labelledby="services-toggle">\
            ' + svcDropdownItems() + '\
          </div>\
        </div>\
        ' + topLink('notre-dentiste.html', 'WeCare Dental Clinic') + '\
        ' + topLink('avant-apres.html', 'Avant / Apr\u00e8s') + '\
        ' + topLink('contact.html', 'Contact') + '\
      </div>\
      <div class="nav-actions">\
        <a href="' + root + 'contact.html" class="btn btn-primary">Prendre RDV</a>\
        <button class="nav-hamburger" id="hamburger" aria-label="Ouvrir le menu" aria-expanded="false" aria-controls="nav-drawer">\
          <span></span><span></span><span></span>\
        </button>\
      </div>\
    </div>\
  </nav>\
  <div class="nav-drawer-overlay" id="drawer-overlay" aria-hidden="true"></div>\
  <aside class="nav-drawer" id="nav-drawer" role="dialog" aria-label="Menu" aria-modal="true">\
    <div class="nav-drawer-header">\
      <a href="' + root + 'index.html" class="nav-drawer-logo" aria-label="Accueil">\
        <span class="nav-drawer-logo-text">LOGO</span>\
      </a>\
      <button class="nav-drawer-close" id="drawer-close" aria-label="Fermer le menu">' + CLOSE_SVG + '</button>\
    </div>\
    <nav class="nav-drawer-links">\
      <div class="nav-drawer-item" data-drawer-stagger>\
        ' + drawerLink('index.html', 'Accueil') + '\
      </div>\
      <div class="nav-drawer-item" data-drawer-stagger>\
        <button class="nav-drawer-accordion" id="drawer-svc-toggle" aria-expanded="false" aria-controls="drawer-svc-panel">\
          <span>Nos Soins</span>\
          <svg class="nav-drawer-accordion-arrow" width="16" height="16" viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="M2 4l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>\
        </button>\
        <div class="nav-drawer-sub" id="drawer-svc-panel" role="region" aria-labelledby="drawer-svc-toggle">\
          ' + svcDrawerItems() + '\
        </div>\
      </div>\
      <div class="nav-drawer-item" data-drawer-stagger>\
        ' + drawerLink('notre-dentiste.html', 'WeCare Dental Clinic') + '\
      </div>\
      <div class="nav-drawer-item" data-drawer-stagger>\
        ' + drawerLink('avant-apres.html', 'Avant / Apr\u00e8s') + '\
      </div>\
      <div class="nav-drawer-item" data-drawer-stagger>\
        ' + drawerLink('contact.html', 'Contact') + '\
      </div>\
    </nav>\
    <div class="nav-drawer-actions" data-drawer-stagger>\
      <a href="' + root + 'contact.html" class="btn btn-primary btn-block">Prendre rendez-vous</a>\
      <a href="tel:+212520939575/0770193085" class="btn btn-ghost btn-block">\
        ' + PHONE_SVG + ' 05 20 93 95 75 / 07 70 19 30 85\
      </a>\
    </div>\
    <div class="nav-drawer-footer" data-drawer-stagger>\
      <div class="nav-drawer-info">\
        <div class="nav-drawer-info-item">\
          ' + CLOCK_SVG + '\
          <span>Lun-Ven 09h-18h, Sam 09h-14h</span>\
        </div>\
        <div class="nav-drawer-info-item">\
          ' + PIN_SVG + '\
          <span>Oulfa, Casablanca</span>\
        </div>\
      </div>\
      <div class="nav-drawer-social">\
        <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Instagram">' + IG_SVG + '</a>\
        <a href="#" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">' + LI_SVG + '</a>\
      </div>\
    </div>\
  </aside>';

  var placeholder = document.getElementById('nav-placeholder');
  if (placeholder) {
    placeholder.outerHTML = html;
  }
})();
