/* FAMA — the talent's own numbers, shown only to them (7 Oct 2026: the dashboard was folded into Profile structure).
   famaViews(el) draws the profile-views card; famaGate(el, live) draws the path to a ready profile: Go Live, then Stand out.
   Needs assets/js/profile.js (FAMA_INDEX_REQ). Placeholder data: one daily series since the profile was created. */
(function () {
  'use strict';
  var END = new Date(2026, 8, 24), DAYS = 180, seed = 7;
  var rnd = function () { return (seed = (seed * 16807) % 2147483647) / 2147483647; };
  var daily = [];
  for (var i = 0; i < DAYS; i++) {
    var d = new Date(END); d.setDate(END.getDate() - (DAYS - 1 - i));
    var wk = [.7, 1, 1.1, 1, 1.2, .8, .6][d.getDay()];
    daily.push({ d: d, v: Math.round((4 + i / 12) * wk * (.4 + rnd() * 1.2)) });
  }
  var num = function (n) { return n.toLocaleString('en-GB'); };
  var sum = function (a) { return a.reduce(function (s, x) { return s + x.v; }, 0); };
  var fmt = function (d) { return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }); };
  var ic = function (id) { return '<svg class="icon" aria-hidden="true"><use href="#' + id + '"/></svg>'; };

  window.famaViews = function (el) {
    var range = '30';
    var wkv = sum(daily.slice(-7)), prev = sum(daily.slice(-14, -7)), up = wkv >= prev;
    el.innerHTML =
      /* 24 Oct 2026 (critique): the card is a heading, the number and one line; the chart opens on request */
      '<div class="vw-head"><div><h2 class="vw-label">Profile views · all time</h2><span class="vw-n">' + num(sum(daily)) + '</span>' +
      '<span class="vw-d">This week <b>' + (up ? '▲' : '▼') + ' ' + num(Math.round(Math.abs(wkv - prev) / prev * 100)) + '%</b> on last week</span></div>' +
      '<div class="vw-hr"><span class="vw-only">' + ic('i-lock') + 'Only you see this</span>' +
      '<button type="button" class="vw-link vw-open" data-chart aria-expanded="false" aria-controls="vwMore">See chart' + ic('i-down') + '</button></div></div>' +
      '<div class="vw-more" id="vwMore" hidden>' +
      '<div class="vw-sh"><p class="vw-sum" data-sum></p><div class="vw-seg" role="group" aria-label="Period">' +
      [['7', '7 days'], ['30', '30 days'], ['90', '90 days'], ['all', 'All time']].map(function (r) { return '<button type="button" data-r="' + r[0] + '" aria-pressed="' + (r[0] === range) + '">' + r[1] + '</button>'; }).join('') +
      '</div></div>' +
      '<div class="vw-plot"><div class="vw-yax" data-yax aria-hidden="true"></div><div class="vw-area"><div class="vw-grid"><i></i><i></i><i></i><i></i></div><div class="vw-bars" data-bars></div><div class="vw-tip" data-tip role="status"></div></div>' +
      '<div class="vw-xax" data-xax aria-hidden="true"></div></div>' +
      '<button type="button" class="vw-link" data-table aria-expanded="false">Show as a table</button><div data-tablewrap hidden></div></div>';
    var q = function (s) { return el.querySelector(s); };
    function buckets() {
      if (range === '7' || range === '30') return daily.slice(-range).map(function (x) { return { d: x.d, v: x.v, label: fmt(x.d) }; });
      var src = range === '90' ? daily.slice(-91) : daily, size = range === '90' ? 7 : 30, out = [];
      for (var i = 0; i < src.length; i += size) { var g = src.slice(i, i + size); out.push({ d: g[0].d, v: sum(g), label: fmt(g[0].d) + ' – ' + fmt(g[g.length - 1].d) }); }
      return out;
    }
    function draw() {
      var b = buckets(), max = Math.max.apply(null, b.map(function (x) { return x.v; }));
      var step = [1, 2, 5, 10, 20, 25, 50, 100, 200, 250, 500].find(function (s) { return s * 3 >= max; }) || Math.ceil(max / 3), top = step * 3;
      q('[data-yax]').innerHTML = [3, 2, 1, 0].map(function (i) { return '<span>' + num(i * step) + '</span>'; }).join('');
      q('[data-bars]').innerHTML = b.map(function (x, i) { return '<button type="button" data-i="' + i + '" aria-label="' + x.label + ': ' + num(x.v) + ' views"><span style="height:' + (x.v / top * 100) + '%"></span></button>'; }).join('');
      var n = b.length, picks = n <= 7 ? b.map(function (_, i) { return i; }) : [0, Math.round(n / 4), Math.round(n / 2), Math.round(3 * n / 4), n - 1];
      q('[data-xax]').innerHTML = picks.map(function (i) { return '<span>' + fmt(b[i].d) + '</span>'; }).join('');
      q('[data-sum]').textContent = num(sum(b)) + ' views in this period';
      q('[data-tablewrap]').innerHTML = '<table class="vw-table"><thead><tr><th>Date</th><th>Views</th></tr></thead><tbody>' + b.map(function (x) { return '<tr><td>' + x.label + '</td><td>' + num(x.v) + '</td></tr>'; }).join('') + '</tbody></table>';
      var tip = q('[data-tip]'), area = q('[data-bars]').parentElement;
      q('[data-bars]').querySelectorAll('button').forEach(function (bt) {
        var show = function () { var x = b[+bt.dataset.i], r = bt.getBoundingClientRect(), a = area.getBoundingClientRect(), s = bt.firstChild.getBoundingClientRect();
          tip.innerHTML = '<b>' + num(x.v) + ' views</b> · ' + x.label;
          var w = tip.offsetWidth / 2, cx = Math.min(Math.max(r.left - a.left + r.width / 2, w), a.width - w);
          tip.style.left = cx + 'px'; tip.style.top = (s.top - a.top) + 'px'; tip.style.opacity = 1; };
        var hide = function () { tip.style.opacity = 0; };
        bt.addEventListener('mouseenter', show); bt.addEventListener('focus', show); bt.addEventListener('mouseleave', hide); bt.addEventListener('blur', hide);
      });
    }
    q('.vw-seg').onclick = function (e) { var bt = e.target.closest('button'); if (!bt) return; range = bt.dataset.r;
      q('.vw-seg').querySelectorAll('button').forEach(function (x) { x.setAttribute('aria-pressed', x === bt); }); draw(); };
    q('[data-chart]').onclick = function () { var m = q('#vwMore'), open = m.hidden; m.hidden = !open; this.setAttribute('aria-expanded', open); this.firstChild.textContent = open ? 'Hide chart' : 'See chart'; if (open) draw(); };
    q('[data-table]').onclick = function () { var w = q('[data-tablewrap]'); w.hidden = !w.hidden; this.setAttribute('aria-expanded', !w.hidden); this.textContent = w.hidden ? 'Show as a table' : 'Hide table'; };
    draw();
  };

  /* The path to a ready profile, in two parts (24 Oct 2026):
       Go Live   (FAMA_INDEX_REQ) the link works and can be shared.
       Stand out (FAMA_INDEX_REC) not needed to go Live. Its first step (FAMA_INDEX_KEY, something to show) puts the
                 profile in the Creatives Index; the rest is what gets a profile picked.
     The card lists both parts. The tracker under the nav stays put while the talent scrolls: a ring for the part
     they are in, one segment per step with a star where they go Live, and the next step. It is black while they
     work towards Live and turns lavender once they are Live. It goes when everything is done.
     Each step lands on its own field (centred, focused, flashed), so nobody scrolls back up.
     opts.go maps a step to a selector on this page; opts.done(key) says live whether a step is done (null keeps it). */
  window.famaGate = function (el, live, opts) {
    opts = opts || {};
    var REQ = window.FAMA_INDEX_REQ || [], REC = window.FAMA_INDEX_REC || [], ALL = REQ.concat(REC), GO = opts.go || {};
    var KEY = window.FAMA_INDEX_KEY;
    var done = {}; (live ? REQ.map(function (r) { return r[0]; }) : ['name', 'skill']).forEach(function (k) { done[k] = true; });
    var STAR = '<svg class="gt-star" viewBox="10 80 760 690"><polygon points="314.63 635.59 16.74 747.68 217.29 533.15 86.97 370.29 403.26 356.02 701.63 87.21 636.51 355.76 760 356.91 574.68 534.04 422.33 756.79 314.63 635.59"/></svg>';
    var bar = document.querySelector('.fx-notice'), open = false, expanded = false, lastSig = null, lastStage = null, was = null;
    if (!bar) { var nav = document.querySelector('.fx-nav'); if (nav) { bar = document.createElement('div'); bar.className = 'fx-notice'; bar.setAttribute('role', 'region'); bar.setAttribute('aria-label', 'Profile steps'); nav.appendChild(bar); } }
    var link = function (r, cls, inner) {
      return GO[r[0]] ? '<button type="button" class="' + cls + '" data-go="' + r[0] + '">' + inner + '</button>' : '<a class="' + cls + '" href="' + r[3] + '">' + inner + '</a>';
    };
    var tick = function (ok) { return '<span class="tick">' + (ok ? ic('i-check') : '') + '</span>'; };
    var left = function (L) { return L.filter(function (r) { return !done[r[0]]; }); };
    /* the track: one segment per step (each one jumps to its step), with labelled milestones between the parts:
       Live after Go Live, Index after something to show, Ready at the end. A milestone turns solid once reached. */
    function track(all, next, fresh) {
      fresh = fresh || [];
      var listed = all || !!done[KEY], isLive = all || !left(REQ).length, ready = all || (!left(REQ).length && !left(REC).length);
      var seg = function (r) {
        var ok = all || done[r[0]], cls = 'gt-s' + (ok ? ' ok' : '') + (next && r === next ? ' cur' : '') + (fresh.indexOf(r[0]) >= 0 ? ' new' : '');
        return link(r, cls, '<span class="vh">' + r[1] + (ok ? ', done' : '') + '</span>').replace(/^<(button|a) /, '<$1 title="' + r[1] + '" ');
      };
      var ms = function (on, icon, label) { return '<span class="gt-ms' + (on ? ' on' : '') + '">' + icon + '<span class="gt-msl">' + label + '</span></span>'; };
      var n = ALL.filter(function (r) { return all || done[r[0]]; }).length;
      var cnt = function (L) { return L.filter(function (r) { return all || done[r[0]]; }).length + ' of ' + L.length; };
      return '<div class="gt-track" role="group" aria-label="Go Live ' + cnt(REQ) + ' done, Stand out ' + cnt(REC) + ' done">' +
        REQ.map(seg).join('') + ms(isLive, STAR.replace('gt-star', 'gt-msi'), 'Live') +
        seg(REC[0]) + ms(listed, ic('i-search'), 'Index') +
        REC.slice(1).map(seg).join('') + ms(ready, ic('i-check'), 'Ready') + '</div>';
    }
    function part(L, n, title, sub, state) {
      var got = L.length - left(L).length;
      return '<section class="jr-part' + (state ? ' ' + state : '') + '">' +
        '<div class="jr-ph"><span class="jr-num">' + (state === 'is-done' ? ic('i-check') : n) + '</span><div><h3>' + title + '</h3><p>' + sub + '</p></div><span class="jr-c">' + got + '/' + L.length + '</span></div>' +
        (state === 'is-done' ? '<p class="jr-got">' + L.map(function (r) { return r[1]; }).join(' · ') + '</p>' :
        '<ol class="vw-todo jr-steps" style="--cols:' + Math.min(L.length, 4) + '">' + L.map(function (r, i) { var ok = done[r[0]], nx = state === 'is-now' && r === left(L)[0];
          return '<li class="' + (ok ? 'ok' : '') + (nx ? ' jr-next' : '') + (r[0] === KEY ? ' jr-key' : '') + '"><span class="jr-n" aria-hidden="true">' + (ok ? ic('i-check') : (i + 1 < 10 ? '0' : '') + (i + 1)) + '</span>' + '<span class="txt"><b>' + r[1] + (r[0] === KEY ? '<span class="jr-tag">' + (ok ? 'In the Creatives Index' : 'Gets you into the Creatives Index') + '</span>' : '') + '</b>' + (ok ? '' : '<p>' + r[2] + '</p>') + '</span>' +
            link(r, 'vw-link', (ok ? 'Edit' : 'Add') + '<span class="vh"> ' + r[1] + '</span>' + ic('i-arrow')) + '</li>'; }).join('') + '</ol>') +
      '</section>';
    }
    function draw() {
      if (opts.done) ALL.forEach(function (r) { var v = opts.done(r[0]); if (v != null) done[r[0]] = v; });
      var reqLeft = left(REQ), recLeft = left(REC);
      var stage = reqLeft.length ? 'live' : recLeft.length ? 'stand' : 'done';
      var sig = ALL.map(function (r) { return done[r[0]] ? 1 : 0; }).join('') + open;
      if (sig === lastSig) return;
      var fresh = was ? ALL.filter(function (r) { return done[r[0]] && !was[r[0]]; }).map(function (r) { return r[0]; }) : [];
      var listed = !!done[KEY], gotListed = was && !was[KEY] && listed && stage !== 'live';
      var wentLive = lastStage === 'live' && stage !== 'live', finished = !!lastStage && lastStage !== 'done' && stage === 'done';
      if (opts.onState) opts.onState({ live: stage !== 'live', listed: listed && stage !== 'live', wentLive: wentLive });
      lastSig = sig; lastStage = stage; was = {}; ALL.forEach(function (r) { was[r[0]] = done[r[0]]; });

      el.hidden = stage === 'done';
      el.classList.toggle('jr-compact', stage !== 'live' && !expanded);
      /* once Live the card folds to one line: where they stand and the next step. "All steps" opens the rest */
      if (!el.hidden && stage !== 'live' && !expanded) {
        var nx = left(REC)[0], got = REC.length - left(REC).length;
        el.innerHTML = '<div class="jr-row">' +
          '<h2 class="jr-rt">' + (listed ? 'Stand out <span class="jr-c">' + got + '/' + REC.length + '</span>' : '1 step to the Creatives Index') + '</h2>' +
          (nx ? link(nx, 'btn btn-2 jr-go', '<span class="jr-gl">Next:</span> ' + nx[1] + ic('i-arrow')) : '') +
          '<button type="button" class="vw-link jr-more" data-jr="open" aria-expanded="false">All steps' + ic('i-down') + '</button></div>';
      } else if (!el.hidden) el.innerHTML = '<div class="vw-head"><div><span class="vw-label">Your profile</span><h2 class="vw-h">' +
          (stage === 'live' ? reqLeft.length + ' more ' + (reqLeft.length === 1 ? 'step' : 'steps') + ' to go Live' : listed ? 'You’re Live. Now stand out' : 'You’re Live. Next, the Creatives Index') + '</h2>' +
          '<p class="vw-lead">' + (stage === 'live' ? 'Two parts. Go Live takes a minute, and then your link works. Stand out starts with something to show, which puts you in the Creatives Index where brands search. The rest gets you picked.' :
            listed ? 'Your link works and brands find you in the Creatives Index. Fama recommends these next: they are what gets a profile picked.' : 'Your link works and you can share it. Add something to show and brands find you in the Creatives Index too.') + '</p></div>' +
          '<span class="vw-only">' + ic('i-lock') + 'Only you see this</span></div>' +
        part(REQ, 1, 'Go Live', 'Your link works and you can share it.', stage === 'live' ? 'is-now' : 'is-done') +
        part(REC, 2, 'Stand out', 'Not needed to go Live. Something to show gets you into the Creatives Index; the rest gets you picked.', stage === 'live' ? 'is-later' : 'is-now') +
        (stage !== 'live' ? '<p class="vw-note"><button type="button" class="vw-link jr-more" data-jr="close" aria-expanded="true">Fold steps' + ic('i-down') + '</button></p>' : '');

      if (!bar) return;
      /* the last Stand out step: one moment of credit, then the tracker goes */
      if (finished) {
        bar.classList.add('gt', 'gt-soft', 'gt-live'); bar.hidden = false;
        bar.innerHTML = '<div class="fx-wrap gt-in gt-win"><span class="gt-sum"><span class="gt-ring" aria-hidden="true"><svg viewBox="0 0 36 36"><circle cx="18" cy="18" r="15"/><circle class="fg" cx="18" cy="18" r="15"/></svg>' + ic('i-check') + STAR + '</span>' +
          '<span class="gt-t"><b class="gt-h"><span>Your profile is ready</span></b><span class="gt-sub">Live, and standing out. Nice work.</span></span></span>' +
          track(true) + '</div>' +
          '<p class="vh" role="status">Your profile is ready.</p>';
        setTimeout(function () { if (lastStage === 'done') bar.hidden = true; }, 3200);
        return;
      }
      if (stage === 'done') { bar.hidden = true; return; }
      bar.hidden = false;
      var L = stage === 'live' ? REQ : REC, todo = left(L), n = L.length - todo.length, next = todo[0];
      var won = fresh.length > 0, C = 2 * Math.PI * 15;
      var head = wentLive ? 'You’re Live. Your link works' : gotListed ? 'You’re in the Creatives Index' : won ? 'Nice. ' + todo.length + ' to go' : stage === 'live' ? (todo.length === 1 ? 'Last step to go Live' : todo.length + ' more steps to go Live') : !listed ? 'Next: the Creatives Index' : 'Stand out · ' + todo.length + ' to go';
      var short = wentLive ? 'You’re Live' : gotListed ? 'In the Index!' : won ? 'Nice!' : stage === 'live' ? todo.length + ' to go Live' : !listed ? 'Get listed' : 'Stand out';
      bar.classList.add('gt'); bar.classList.add('gt-soft'); /* one colour in every stage; the win moments are motion and yellow accents, not a black bar */ bar.classList.toggle('gt-live', wentLive || gotListed);
      bar.innerHTML = '<div class="fx-wrap gt-in' + (won || wentLive ? ' gt-win' : '') + '">' +
        '<button type="button" class="gt-sum" aria-expanded="' + open + '" aria-controls="gtList">' +
          '<span class="gt-ring" aria-hidden="true"><svg viewBox="0 0 36 36"><circle cx="18" cy="18" r="15"/><circle class="fg" cx="18" cy="18" r="15" style="stroke-dasharray:' + C.toFixed(1) + ';stroke-dashoffset:' + (C * (1 - n / L.length)).toFixed(1) + '"/></svg>' +
            '<b>' + n + '/' + L.length + '</b>' + STAR + '</span>' +
          '<span class="gt-t"><b class="gt-h"><span class="gt-hl">' + head + '</span><span class="gt-hs">' + short + '</span></b><span class="gt-sub">' + (stage === 'live' ? 'Part 1 of 2 · Go Live' : listed ? 'Part 2 of 2 · Recommended by Fama' : 'Part 2 of 2 · Live, not in the Creatives Index yet') + '</span></span>' + ic('i-down') + '</button>' +
        track(false, next, fresh) +
        (next ? link(next, 'gt-next', '<span class="gt-nl">Next: </span><span class="gt-nn">' + next[1] + '</span>' + ic('i-arrow')) : '') +
      '</div>' +
      '<div class="gt-pop" id="gtList"' + (open ? '' : ' hidden') + '><div class="fx-wrap">' +
        [[REQ, '1 · Go Live'], [REC, '2 · Stand out']].map(function (g) {
          return '<p class="gt-ph">' + g[1] + '<span>' + (g[0].length - left(g[0]).length) + '/' + g[0].length + '</span></p><ul>' + g[0].map(function (r) { var ok = done[r[0]];
            return '<li class="' + (ok ? 'ok' : '') + (next && r === next ? ' cur' : '') + '">' + link(r, 'gt-step', tick(ok) + '<span>' + r[1] + '</span>' + ic('i-arrow')) + '</li>'; }).join('') + '</ul>'; }).join('') +
      '</div></div>' +
      '<p class="vh" role="status">' + (wentLive ? 'You are Live. Your link works.' : gotListed ? 'You are in the Creatives Index. Brands can find you now.' : won ? n + ' of ' + L.length + ' done' : '') + '</p>';
      if (won || wentLive) setTimeout(function () { if (lastSig === sig) { lastSig = null; was = null; draw(); } }, wentLive || gotListed ? 3200 : 2400);
    }
    function go(k) {
      var t = document.querySelector(GO[k]); if (!t) return;
      setOpen(false);
      t.scrollIntoView({ block: 'center', behavior: 'smooth' });
      var f = t.matches('input,textarea,button') ? t : t.querySelector('input,textarea,button');
      if (f) f.focus({ preventScroll: true });
      var w = t.closest('.f') || t; w.classList.remove('gt-flash'); void w.offsetWidth; w.classList.add('gt-flash');
      setTimeout(function () { w.classList.remove('gt-flash'); }, 1800);
    }
    function setOpen(v) { open = v; lastSig = null; if (!bar) return; var p = bar.querySelector('.gt-pop'), b = bar.querySelector('.gt-sum'); if (p) p.hidden = !v; if (b) b.setAttribute('aria-expanded', v); }
    function onClick(e) {
      var j = e.target.closest('[data-jr]');
      if (j) { expanded = j.dataset.jr === 'open'; lastSig = null; draw(); var f = el.querySelector('[data-jr]'); if (f) f.focus(); return; }
      var g = e.target.closest('[data-go]'); if (g) { go(g.dataset.go); return; }
      if (e.target.closest('.gt-sum')) setOpen(!open);
    }
    el.addEventListener('click', onClick);
    if (bar) {
      bar.addEventListener('click', onClick);
      document.addEventListener('click', function (e) { if (open && !bar.contains(e.target)) setOpen(false); });
      document.addEventListener('keydown', function (e) { if (open && e.key === 'Escape') { setOpen(false); bar.querySelector('.gt-sum').focus(); } });
    }
    draw();
    /* phones: the tracker steps aside while a field has focus, so the keyboard and the Save bar leave room to type */
    if (bar) {
      var typing = function (e) { var f = e.target; return f && f.matches && f.matches('input:not([type=checkbox]):not([type=radio]),textarea,select,[contenteditable]') && !bar.contains(f); };
      document.addEventListener('focusin', function (e) { if (typing(e)) document.documentElement.classList.add('fx-typing'); });
      document.addEventListener('focusout', function (e) { if (typing(e)) document.documentElement.classList.remove('fx-typing'); });
    }
    if (bar && window.IntersectionObserver) {
      var navH = function () { var n = document.querySelector('.fx-nav'); return n ? n.firstElementChild && n.querySelector('.fx-in') ? n.querySelector('.fx-in').offsetHeight : 64 : 0; };
      bar.classList.add('gt-float', 'gt-away');
      new IntersectionObserver(function (es) {
        var seen = es[0].isIntersecting && !el.hidden;
        bar.classList.toggle('gt-away', seen);
        if (seen && open) setOpen(false);
      }, { rootMargin: '-' + navH() + 'px 0px 0px 0px' }).observe(el);
    }
    return { refresh: function () { var a = document.activeElement, id = a && a.dataset && a.dataset.go; draw(); if (id) { var b = bar && bar.querySelector('[data-go="' + id + '"]'); if (b) b.focus(); } } };
  };
})();
