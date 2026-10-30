// FAMA — shared shell behaviour (nav burger, avatar menu, toggle switches)
(function () {
  'use strict';

  // mobile nav burger
  document.querySelectorAll('[data-nav-burger]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var row = document.querySelector('.nav-row');
      row.classList.toggle('menu-open');
      btn.setAttribute('aria-expanded', row.classList.contains('menu-open'));
    });
  });

  // avatar dropdown
  document.querySelectorAll('[data-avatar-menu]').forEach(function (trigger) {
    var panel = document.getElementById(trigger.getAttribute('aria-controls'));
    if (!panel) return;
    trigger.addEventListener('click', function (e) {
      e.stopPropagation();
      var isOpen = panel.classList.toggle('open');
      trigger.setAttribute('aria-expanded', isOpen);
    });
    document.addEventListener('click', function (e) {
      if (!panel.contains(e.target) && e.target !== trigger) {
        panel.classList.remove('open');
        trigger.setAttribute('aria-expanded', 'false');
      }
    });
  });

  // generic toggle switches: <button class="switch" role="switch" aria-checked="true|false">
  document.querySelectorAll('.switch[role="switch"]').forEach(function (sw) {
    sw.addEventListener('click', function () {
      var next = sw.getAttribute('aria-checked') !== 'true';
      sw.setAttribute('aria-checked', String(next));
      var evt = new CustomEvent('switch-change', { detail: { checked: next } });
      sw.dispatchEvent(evt);
    });
  });

  window.famaToast = function (message) {
    var el = document.getElementById('toast');
    if (!el) return;
    el.textContent = message;
    el.classList.add('show');
    clearTimeout(el._t);
    el._t = setTimeout(function () { el.classList.remove('show'); }, 2600);
  };
})();
