/* FAMA — small shared helpers for product pages.
   Load before a page's own script:  <script src="assets/js/ds.js?v=N"></script>
   V1 has no language switcher; Arabic lives at its own address. Here ?lang=ar shows it. */
(function () {
  'use strict';
  var lang = 'en'; // Arabic paused (27 Sep 2026). Strings are kept; restore: new URLSearchParams(location.search).get('lang') === 'ar' ? 'ar' : 'en'
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';

  /* action icons (Lucide, ISC) — buttons carry the icon that says what they do */
  var SPRITE = '<svg width="0" height="0" style="position:absolute" aria-hidden="true">' +
    '<symbol id="a-eye" viewBox="0 0 24 24"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></symbol>' +
    '<symbol id="a-send" viewBox="0 0 24 24"><path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"/><path d="m21.854 2.147-10.94 10.939"/></symbol>' +
    '<symbol id="a-check" viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"/></symbol>' +
    '<symbol id="a-user-plus" viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M19 8v6"/><path d="M22 11h-6"/></symbol>' +
    '<symbol id="a-user-check" viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="m16 11 2 2 4-4"/></symbol>' +
    '<symbol id="a-log-in" viewBox="0 0 24 24"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><path d="m10 17 5-5-5-5"/><path d="M15 12H3"/></symbol>' +
    '<symbol id="a-home" viewBox="0 0 24 24"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></symbol>' +
    '</svg>';
  if (document.body) document.body.insertAdjacentHTML('afterbegin', SPRITE);
  else document.addEventListener('DOMContentLoaded', function () { document.body.insertAdjacentHTML('afterbegin', SPRITE); });

  var FAMA = window.FAMA = { lang: lang, T: { en: {}, ar: {} } };

  /* t('key', ...args) — a string or a function in the page's dictionary */
  FAMA.t = function (k) {
    var v = (FAMA.T[lang] && FAMA.T[lang][k]);
    if (v === undefined) v = FAMA.T.en[k];
    if (v === undefined) return k;
    return typeof v === 'function' ? v.apply(null, [].slice.call(arguments, 1)) : v;
  };
  FAMA.num = function (n) { return Number(n).toLocaleString(lang === 'ar' ? 'ar-EG' : 'en-GB'); };
  FAMA.date = function (d, o) { return new Date(d).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-GB', o || { day: 'numeric', month: 'short', year: 'numeric' }); };
  FAMA.esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  /* keep ?lang=ar on links a page builds */
  var guestView = new URLSearchParams(location.search).get('view') === 'guest';
  /* links a page builds keep ?lang=ar and, for a visitor, ?view=guest (the sign-in pages drop it) */
  FAMA.href = function (f) {
    var add = [];
    if (lang === 'ar') add.push('lang=ar');
    if (guestView && f.indexOf('view=') < 0 && !/^(login|register|forgot-password|reset-password)\.html/.test(f)) add.push('view=guest');
    if (!add.length) return f;
    var i = f.indexOf('#'), h = i < 0 ? '' : f.slice(i), b = i < 0 ? f : f.slice(0, i);
    return b + (b.indexOf('?') < 0 ? '?' : '&') + add.join('&') + h;
  };
  /* fill [data-t], [data-t-aria], [data-t-ph] from the dictionary */
  FAMA.apply = function (root) {
    root = root || document;
    root.querySelectorAll('[data-t]').forEach(function (el) { el.textContent = FAMA.t(el.dataset.t); });
    root.querySelectorAll('[data-t-aria]').forEach(function (el) { el.setAttribute('aria-label', FAMA.t(el.dataset.tAria)); });
    root.querySelectorAll('[data-t-ph]').forEach(function (el) { el.placeholder = FAMA.t(el.dataset.tPh); });
    if (lang === 'ar') root.querySelectorAll('a[href$=".html"],a[href*=".html#"],a[href*=".html?"]').forEach(function (a) {
      if (a.getAttribute('href').indexOf('lang=ar') < 0) a.setAttribute('href', FAMA.href(a.getAttribute('href')));
    });
  };

  /* toast with optional Undo (5 seconds) */
  var toastEl, timer, undoFn;
  FAMA.toast = function (msg, undo) {
    if (!toastEl) {
      toastEl = document.createElement('div');
      toastEl.className = 'toast'; toastEl.setAttribute('role', 'status'); toastEl.hidden = true;
      toastEl.innerHTML = '<span></span><button type="button"></button>';
      document.body.appendChild(toastEl);
      toastEl.querySelector('button').addEventListener('click', function () {
        if (undoFn) undoFn(); toastEl.hidden = true; undoFn = null;
      });
    }
    toastEl.querySelector('span').textContent = msg;
    var b = toastEl.querySelector('button');
    b.textContent = lang === 'ar' ? 'تراجع' : 'Undo';
    b.hidden = !undo; undoFn = undo || null; toastEl.hidden = false;
    clearTimeout(timer); timer = setTimeout(function () { toastEl.hidden = true; undoFn = null; }, 5000);
  };

  /* confirm(title, body, okLabel, danger) → Promise<boolean>, using a real <dialog> */
  FAMA.confirm = function (title, body, ok, danger) {
    return new Promise(function (resolve) {
      var d = document.createElement('dialog');
      d.className = 'dlg';
      d.innerHTML = '<form method="dialog"><h2></h2><p class="d"></p><div class="acts">' +
        '<button class="btn btn-2" value="cancel"></button><button class="btn' + (danger ? ' btn-danger' : '') + '" value="ok"></button></div></form>';
      d.querySelector('h2').textContent = title;
      d.querySelector('p').textContent = body || '';
      d.querySelector('[value=cancel]').textContent = lang === 'ar' ? 'إلغاء' : 'Cancel';
      d.querySelector('[value=ok]').textContent = ok;
      document.body.appendChild(d);
      d.addEventListener('close', function () { resolve(d.returnValue === 'ok'); d.remove(); });
      d.showModal();
    });
  };
})();
