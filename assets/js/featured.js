/* Featured project (24 Oct 2026): the project that opens the talent's public profile.
   The talent picks it with the star on a project card in Projects; it is saved as profile.featured.
   No choice, or a project that is gone, means Fama shows the latest project. */
(function () {
  var PROJECTS = [ /* placeholder: the talent's own projects, newest first by date */
    { id: 'desert-light', title: 'Desert Light — 2026', client: 'Maison Nour', date: '2026-03-02' },
    { id: 'nefertari-ss26', title: 'Nefertari Cosmetics — 2026', client: 'Nefertari Cosmetics', date: '2026-01-20' },
    { id: 'nomad-autumn', title: 'Nomad Coffee — Autumn launch', client: 'Nomad Coffee Co.', date: '2025-10-10' },
    { id: 'linen', title: 'Cairo Linen — Heritage', client: 'Personal project', date: '2025-05-01' }
  ];
  /* 24 Oct 2026: real photos (Unsplash, see assets/img/stock/SOURCES.md), with no faces and no women.
     Each demo project has its own set; anything else borrows from the whole pool, always the same picture for the same id */
  var STOCK = { 'desert-light': 6, 'nomad-autumn': 4, 'nefertari-ss26': 5, 'linen': 4, 'atlas': 4, 'cfw24': 3, 'studio': 3 };
  var POOL = []; Object.keys(STOCK).forEach(function (k) { for (var i = 1; i <= STOCK[k]; i++) POOL.push('assets/img/stock/' + k + '-' + i + '.jpg'); });
  var own = function (id) { var n = STOCK[id] || 0, out = []; for (var i = 1; i <= n; i++) out.push('assets/img/stock/' + id + '-' + i + '.jpg'); return out; };
  var hash = function (s) { var h = 0; for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return h; };
  var latest = function (list) { return list.slice().sort(function (a, b) { return String(b.date || '').localeCompare(String(a.date || '')); })[0] || null; };

  var F = window.FAMA_FEATURED = {
    /* the talent's projects and the credits they confirmed in a skill they hold: co-owned projects can be featured too */
    list: function () {
      var out = PROJECTS.slice();
      try {
        var held = (window.FAMA_PROFILE.load().skills || []).map(function (x) { return x.id; });
        window.FAMA_CREDITS.load().confirmed.forEach(function (c) {
          if (held.indexOf(c.skill) >= 0 && !out.some(function (x) { return x.id === c.slug; })) out.push({ id: c.slug, title: c.p, client: 'With ' + c.who, date: c.d });
        });
      } catch (e) {}
      return out;
    },
    /* the same picture for a project on every page */
    pic: function (id) { return F.photo(id, 0); },
    /* every stock picture, for the editor's picture picker */
    pool: function () { return POOL.slice(); },
    /* the i-th picture of a project: its own photos first, then the rest of the pool */
    photo: function (id, i) {
      var mine = own(id), rest = POOL.filter(function (x) { return mine.indexOf(x) < 0; }), off = hash(String(id)) % rest.length;
      i = i || 0;
      return i < mine.length ? mine[i] : rest[(off + i - mine.length) % rest.length];
    },
    /* "Desert Light — 2026" → { name: "Desert Light", year: "2026", sub: "" }. The year shows as a tag on the picture,
       anything else after the dash stays in the name (24 Oct 2026) */
    split: function (title) {
      var parts = String(title || '').split(/\s+[\u2014\u2013-]\s+/), last = parts.length > 1 ? parts[parts.length - 1] : '';
      var year = /^(19|20)\d\d$/.test(last) ? last : '';
      return { name: year ? parts.slice(0, -1).join(' \u2014 ') : String(title || ''), year: year };
    },
    /* the year a project shows as its tag: from the title when it has one, otherwise from the project's date */
    year: function (id, title, date) {
      var y = F.split(title).year; if (y) return y;
      var p = F.list().find(function (x) { return x.id === id; }), d = date || (p && p.date) || '';
      return /^\d{4}/.test(d) ? d.slice(0, 4) : '';
    },
    /* what the profile shows: the chosen project, or the latest when nothing is chosen or it is gone */
    resolve: function (chosen, list) {
      list = list || F.list();
      var p = chosen && list.find(function (x) { return x.id === chosen; });
      return p ? { project: p, auto: false } : { project: latest(list), auto: true };
    }
  };

})();
