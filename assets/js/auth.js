/* FAMA — shared bits for the sign-in screens: the showcase panel, show/hide
   password, strength meter and inline field errors. Needs ds.js first. */
(function () {
  'use strict';
  var ar = FAMA.lang === 'ar';
  FAMA.showcase = function (el) {
    el.innerHTML = '<div class="au-in"><div><h1>' + (ar ? 'شغلك، وناسك.' : 'Your work,<br>your people.') + '</h1>' +
      '<p>' + (ar ? 'ابني بروفايل الصناعة بتقراه فعلاً.' : 'Build a profile the industry actually reads.') + '</p></div>' +
      '</div>' +
      '<div class="au-photo" role="presentation"></div><svg class="hstar" viewBox="10 80 760 690" aria-hidden="true"><polygon points="314.63 635.59 16.74 747.68 217.29 533.15 86.97 370.29 403.26 356.02 701.63 87.21 636.51 355.76 760 356.91 574.68 534.04 422.33 756.79 314.63 635.59"/></svg>';
  };
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-pw]'); if (!b) return;
    var i = document.getElementById(b.dataset.pw), show = i.type === 'password';
    i.type = show ? 'text' : 'password';
    b.textContent = show ? (ar ? 'إخفاء' : 'Hide') : (ar ? 'إظهار' : 'Show');
    b.setAttribute('aria-pressed', show);
  });
  /* 0–4: length, mixed case, a number, a symbol */
  FAMA.strength = function (v) {
    var s = 0; if (v.length >= 8) s++; if (/[a-z]/.test(v) && /[A-Z]/.test(v)) s++; if (/\d/.test(v)) s++; if (/[^\w\s]/.test(v)) s++;
    return v ? Math.max(s, 1) : 0;
  };
  FAMA.fieldError = function (input, msg) {
    var f = input.closest('.f'), help = f.querySelector('.help');
    f.classList.toggle('bad', !!msg); input.setAttribute('aria-invalid', msg ? 'true' : 'false');
    if (help) { if (!help.dataset.orig) help.dataset.orig = help.textContent; help.textContent = msg || help.dataset.orig; help.classList.toggle('err', !!msg); }
    return !msg;
  };
})();
