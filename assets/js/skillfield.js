/* FAMA — skill field: type to find one of the 41 skills instead of scrolling a long dropdown.
   FAMA.skillField({value, attrs, label, placeholder, empty}) returns the HTML.
   The input holds the skill's name. Picking one sets it and fires a normal "change" event,
   so pages keep their usual change handlers. Typing matches skill names and specialities.
   `empty` (optional) is a label for "no skill", e.g. "All skills" in a filter.
   Needs assets/js/skills.js and ds.js. */
(function () {
  'use strict';
  var esc = function (s) { return FAMA.esc(s); }, n = 0;

  FAMA.skillField = function (o) {
    var id = 'skf' + (++n);
    return '<div class="skf">' +
      '<input class="in" type="text" role="combobox" aria-autocomplete="list" aria-expanded="false" aria-controls="' + id + '" autocomplete="off" spellcheck="false"' +
      ' data-skf data-last="' + esc(o.value || '') + '"' + (o.empty ? ' data-empty="' + esc(o.empty) + '"' : '') +
      ' value="' + esc(o.value || (o.empty || '')) + '" placeholder="' + esc(o.placeholder || 'Search skills') + '"' +
      (o.label ? ' aria-label="' + esc(o.label) + '"' : '') + ' ' + (o.attrs || '') + '>' +
      '<svg class="icon" aria-hidden="true" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>' +
      '<ul class="skf-list" role="listbox" id="' + id + '" hidden></ul></div>';
  };

  /* a word has to start with what's typed: "dr" finds Aerial & drone, not "Children's" */
  function hit(name, q) { return (' ' + name.toLowerCase().replace(/[^a-z0-9]+/g, ' ')).indexOf(' ' + q) >= 0; }
  function matches(q) {
    q = q.trim().toLowerCase().replace(/[^a-z0-9 ]+/g, ' ').trim();
    return window.FAMA_SKILLS.map(function (s) {
      if (!q || hit(s.name, q)) return { s: s, via: '' };
      var sp = s.specs.find(function (x) { return hit(x.name, q); });
      return sp ? { s: s, via: sp.name } : null;
    }).filter(Boolean);
  }
  function open(inp, all) {
    var ul = inp.parentNode.querySelector('.skf-list'), q = all ? '' : inp.value, m = matches(q), empty = inp.dataset.empty;
    var items = (empty && !q ? '<li role="option" data-v="" aria-selected="false">' + esc(empty) + '</li>' : '') +
      m.map(function (x) {
        return '<li role="option" data-v="' + esc(x.s.name) + '" aria-selected="' + (x.s.name === inp.dataset.last) + '">' + esc(x.s.name) +
          (x.via ? '<small>' + esc(x.via) + '</small>' : '') + '</li>';
      }).join('');
    ul.innerHTML = items || '<li class="none">No skill matches that</li>';
    ul.hidden = false; inp.setAttribute('aria-expanded', 'true');
    /* near the bottom of the screen (or a dialog's footer) it opens upwards instead */
    var r = inp.getBoundingClientRect(), d = inp.closest('dialog'), foot = d && d.querySelector('.foot');
    var bottom = foot ? foot.getBoundingClientRect().top : innerHeight;
    ul.classList.toggle('up', bottom - r.bottom < Math.min(ul.scrollHeight, 288) + 8 && r.top > bottom - r.bottom);
    var on = ul.querySelector('[aria-selected="true"]') || ul.querySelector('[role=option]');
    active(inp, on);
  }
  function close(inp) {
    var ul = inp.parentNode.querySelector('.skf-list');
    ul.hidden = true; inp.setAttribute('aria-expanded', 'false'); inp.removeAttribute('aria-activedescendant');
  }
  function active(inp, li) {
    var ul = inp.parentNode.querySelector('.skf-list');
    ul.querySelectorAll('.on').forEach(function (x) { x.classList.remove('on'); x.removeAttribute('id'); });
    if (!li) return;
    li.classList.add('on'); li.id = ul.id + '-on'; inp.setAttribute('aria-activedescendant', li.id);
    li.scrollIntoView({ block: 'nearest' });
  }
  function pick(inp, v) {
    var label = v || inp.dataset.empty || '';
    inp.value = label; close(inp);
    if (v === inp.dataset.last) return;
    inp.dataset.last = v;
    inp.dispatchEvent(new CustomEvent('skillpick', { bubbles: true, detail: { value: v } }));
    inp.dispatchEvent(new Event('change', { bubbles: true }));
  }
  /* what the rest of the page reads: the chosen skill's name, or "" */
  FAMA.skillValue = function (inp) { return inp.dataset.last || ''; };

  document.addEventListener('focusin', function (e) {
    var inp = e.target.closest && e.target.closest('[data-skf]'); if (!inp) return;
    inp.select(); open(inp, true);
  });
  document.addEventListener('click', function (e) {
    var inp = e.target.closest && e.target.closest('[data-skf]');
    if (inp && inp.parentNode.querySelector('.skf-list').hidden) open(inp, true);
  });
  document.addEventListener('input', function (e) {
    var inp = e.target.closest && e.target.closest('[data-skf]'); if (inp) open(inp);
  });
  document.addEventListener('mousedown', function (e) {
    var li = e.target.closest && e.target.closest('.skf-list [role=option]'); if (!li) return;
    e.preventDefault(); pick(li.closest('.skf').querySelector('[data-skf]'), li.dataset.v);
  });
  document.addEventListener('keydown', function (e) {
    var inp = e.target.closest && e.target.closest('[data-skf]'); if (!inp) return;
    var ul = inp.parentNode.querySelector('.skf-list'), opts = [].slice.call(ul.querySelectorAll('[role=option]')), cur = ul.querySelector('.on'), i = opts.indexOf(cur);
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault(); if (ul.hidden) return open(inp, true);
      active(inp, opts[Math.max(0, Math.min(opts.length - 1, i + (e.key === 'ArrowDown' ? 1 : -1)))]);
    } else if (e.key === 'Enter') {
      if (!ul.hidden && cur) { e.preventDefault(); pick(inp, cur.dataset.v); }
    } else if (e.key === 'Escape') {
      if (!ul.hidden) { e.preventDefault(); e.stopPropagation(); inp.value = inp.dataset.last || inp.dataset.empty || ''; close(inp); }
    }
  });
  /* leaving the field without picking puts the last choice back, so the value is always a real skill */
  document.addEventListener('focusout', function (e) {
    var inp = e.target.closest && e.target.closest('[data-skf]'); if (!inp) return;
    var exact = window.FAMA_SKILLS.find(function (s) { return s.name.toLowerCase() === inp.value.trim().toLowerCase(); });
    if (exact) pick(inp, exact.name); else { inp.value = inp.dataset.last || inp.dataset.empty || ''; close(inp); }
  });
})();
