/* FAMA — each skill's custom fields, from the owner's Skills spec (skills-spec-ar.html, final).
   27 fields across 30 skills; 11 skills have none. A field describes the practice itself:
   true of every job, and not visible in the portfolio.
   Values live once per profile (profile.fields), so a field two skills share, like Dialects
   for Acting and Voice, is filled in once. Edited in Profile structure, shown in each skill's tab.
   English wording is translated from the Arabic spec; check it with the owner. */
(function () {
  'use strict';
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var COVER = ['Fully covered', 'With hijab', 'Without hijab on camera', 'Short sleeves', 'Sleeveless', 'Above the knee', 'Fitted cuts', 'Swimwear', 'Underwear'];
  var TERMS = ['All-female crew', 'No physical contact with the opposite sex', 'No alcohol or tobacco', 'A chaperone present', 'Closed set'];
  var DIALECTS = ['Modern Standard Arabic', 'Egyptian', 'Levantine', 'Gulf (Najdi)', 'Gulf (Hijazi)', 'Iraqi', 'Maghrebi', 'Sudanese', 'Yemeni'];
  var LEVELS = ['Native', 'Fluent', 'Good'];
  var SOFTWARE = ['DaVinci Resolve', 'Premiere Pro', 'Avid', 'After Effects', 'Nuke', 'Flame', 'Pro Tools', 'Capture One', 'Blender', 'Houdini', 'Cinema 4D', 'Maya'];
  var REGISTER = ['Formal', 'Conversational', 'Advertising', 'Youthful', 'Literary'];
  var PLATFORMS = ['Instagram', 'TikTok', 'YouTube', 'Snapchat', 'X', 'LinkedIn', 'Podcasts'];
  var REACH = ['Under 10K', '10K–50K', '50K–100K', '100K–500K', '500K–1M', 'Over 1M'];
  var LANGS = ['Arabic', 'English', 'French', 'Spanish', 'German', 'Italian', 'Turkish', 'Urdu', 'Hindi', 'Persian', 'Russian', 'Portuguese', 'Chinese', 'Japanese', 'Korean'];
  var KIT = ['Full professional kit', 'Partial kit, details on request', 'Production provides the kit'];
  var OWNOP = ['Owns and operates', 'Owns part of the kit', 'Operates hired kit only'];
  var SOURCING = ['Brand showrooms', 'Multi-brand boutiques', 'Regional distributors', 'Direct with designers', 'Rental archives', 'Private archive'];
  /* Monk Skin Tone scale, 10 shades */
  var MONK = ['#f6ede4', '#f3e7db', '#f7ead0', '#eadaba', '#d7bd96', '#a07e56', '#825c43', '#604134', '#3a312a', '#292420'];
  var DIGI = ['Face, front', 'Face, side', 'Full length, front', 'Full length, side'];

  /* id: [name, type, options, help] */
  var F = {
    height: ['Height', 'num', { unit: 'cm', min: 120, max: 220 }, 'The first thing any casting filters on.'],
    measure: ['Measurements', 'nums', [['chest', 'Chest'], ['waist', 'Waist'], ['hips', 'Hips'], ['inseam', 'Inside leg', 1]], 'In centimetres. Sample sizes are fixed, so brands filter on these.'],
    sizes: ['Clothing and shoe size', 'sizes', ['EU', 'UK', 'US'], 'So the stylist can pull the rail before the fitting.'],
    digitals: ['Digitals', 'digitals', DIGI, 'Plain background, no retouching, daylight. Dated when you upload, and flagged after six months.'],
    comfort: ['Comfort and coverage', 'two', [['Coverage', COVER], ['Conditions', TERMS]], 'Brands only offer work inside what you choose here, so nobody is asked on set.'],
    sourcing: ['Sourcing access', 'many', SOURCING, 'Where you can pull pieces from.'],
    kit: ['Your kit', 'one', KIT, ''],
    skintone: ['Skin tone range', 'swatch', MONK, 'The Monk scale, 10 shades. Choose every shade you work on confidently.'],
    hairtypes: ['Hair type range', 'many', ['Straight', 'Wavy', 'Curly', 'Coily', 'Locs', 'Protective styles', 'Wigs and extensions'], ''],
    arabic: ['Working in Arabic', 'one', ['Designs in Arabic and Latin', 'Latin only', 'Arabic only', 'Typesets Arabic, doesn’t design it'], ''],
    scripts: ['Scripts', 'many', ['Arabic: Naskh', 'Arabic: Kufi', 'Arabic: Thuluth', 'Arabic: Diwani', 'Arabic: Ruq’ah', 'Latin', 'Arabic and Latin together'], ''],
    ownop: ['Owner-operator or hired kit', 'one', OWNOP, ''],
    software: ['Software', 'many', SOFTWARE, ''],
    networks: ['Talent networks', 'many', ['Agency-represented talent', 'Street casting', 'Specialist communities', 'Children and families', 'Specific nationalities', 'Sport and specialist skills'], 'The talent you can reach.'],
    agerange: ['Playing age', 'range', { min: 5, max: 90, span: 5 }, 'At least five years wide. Separate from your real age.'],
    dialects: ['Dialects', 'levels', [DIALECTS, LEVELS], 'Choose a level for each one you speak.'],
    booth: ['Recording booth', 'one', ['Treated booth', 'Treated room', 'Portable booth', 'Untreated'], ''],
    direct: ['Live direction', 'one', ['Source-Connect', 'ipDTL', 'Zoom or Teams', 'Phone patch', 'Not available'], 'How a client can direct a session remotely.'],
    register: ['Register', 'many', REGISTER, ''],
    platforms: ['Platforms', 'many', PLATFORMS, ''],
    reach: ['Reach on each platform', 'reach', REACH, 'Ranges, not exact numbers. Verified by connecting the platform where we can.'],
    langpairs: ['Language pairs', 'pairs', LANGS, 'From the source language to the target.'],
    expertise: ['Specialist areas', 'many', ['Legal', 'Medical', 'Financial', 'Technical', 'Marketing and creative'], ''],
    build: ['Build in-house', 'one', ['Designs and builds', 'Designs, works with a build partner', 'Designs only, the client builds'], ''],
    licence: ['Operating licence', 'licence', null, 'Your remote pilot certificate from GACA and the drone’s registration.'],
    permits: ['Permit experience', 'many', ['GCAM filming permit', 'GACA airspace permit', 'Municipal and site permits', 'Heritage sites and AlUla', 'Airports and transport hubs', 'Government buildings', 'Private property'], ''],
    special: ['Special skills', 'many', ['Driving', 'Horse riding', 'Swimming', 'Combat', 'Musical instruments', 'Sports', 'Languages'], '']
  };
  /* skill → fields, in the spec's order. [id, optional] */
  var SW = 'software', OO = 'ownop';
  var BY = {
    modelling: ['height', 'measure', 'sizes', 'digitals', 'comfort'],
    styling: ['sourcing'], costume: ['sourcing'],
    makeup: ['kit', 'skintone'], hair: ['kit', 'hairtypes'],
    graphic: ['arabic'], product: ['arabic'], type: ['scripts'],
    cinematography: [OO], camera: [OO], lighting: [OO], sound: [OO],
    retouch: [SW], editing: [SW], motion: [SW], animation: [SW], cgi: [SW], grading: [SW], vfx: [SW], soundpost: [SW],
    casting: ['networks'],
    acting: ['agerange', 'dialects', 'comfort', ['special', 1]],
    voice: ['dialects', 'booth', 'direct', ['register', 1]],
    content: ['platforms', 'reach', 'dialects'],
    presenting: ['dialects', ['agerange', 1]],
    writing: ['langpairs', 'register'],
    translation: ['langpairs', 'dialects', ['expertise', 1]],
    set: ['build'], dance: ['comfort'], drone: ['licence'], location: ['permits']
  };
  var forSkill = function (sk) { return (BY[sk] || []).map(function (x) { return typeof x === 'string' ? { id: x, opt: false } : { id: x[0], opt: !!x[1] }; }); };

  var arr = function (v) { return Array.isArray(v) ? v : []; };
  var inch = function (cm) { var i = Math.round(cm / 2.54); return Math.floor(i / 12) + '′' + (i % 12) + '″'; };
  var age = function (d) { return d ? (Date.now() - new Date(d)) / 864e5 : 0; };
  var date = function (d) { return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }); };
  var chips = function (id, list, on, g) {
    return '<div class="fx-chips" role="group" aria-labelledby="fl-' + id + '">' + list.map(function (o) {
      return '<button type="button" class="chip" data-opt="' + esc(o) + '"' + (g != null ? ' data-g="' + g + '"' : '') + ' aria-pressed="' + (on.indexOf(o) > -1) + '">' + esc(o) + '</button>';
    }).join('') + '</div>';
  };
  var sel = function (k, list, v, blank, label) {
    return '<select class="sel" data-k="' + k + '"' + (label ? ' aria-label="' + esc(label) + '"' : '') + '>' + (blank != null ? '<option value="">' + esc(blank) + '</option>' : '') +
      list.map(function (o) { return '<option' + (o === v ? ' selected' : '') + '>' + esc(o) + '</option>'; }).join('') + '</select>';
  };

  /* ---- editor ---- */
  /* closed, a field is one row: name, what's in it, Edit. Open, it shows its inputs and Done. One opens at a time. */
  function editor(id, v, opt, all, open) {
    var f = F[id], type = f[1], o = f[2], h = '';
    if (!open) {
      var sm = summary(id, v, all), has = filled(id, v);
      return '<div class="fld fx-closed" data-fld="' + id + '"><div class="fx-rowhead"><div class="fx-rt"><p class="fx-name" id="fl-' + id + '">' + f[0] + (opt ? ' <small>Optional</small>' : '') + '</p>' +
        '<p class="fx-val' + (has ? '' : ' fx-empty') + '">' + (has ? sm : 'Not added') + '</p></div>' +
        '<button type="button" class="btn btn-2 fx-open" data-fxopen aria-label="' + (has ? 'Edit ' : 'Add ') + esc(f[0].toLowerCase()) + '">' + (has ? 'Edit' : '<svg class="icon" aria-hidden="true"><use href="#i-plus"/></svg>Add') + '</button></div></div>';
    }
    v = v == null ? null : v;
    if (type === 'num') {
      h = '<div class="fx-row"><input class="in fx-n" type="number" inputmode="numeric" data-k="v" min="' + o.min + '" max="' + o.max + '" value="' + esc(v || '') + '" aria-labelledby="fl-' + id + '"><span class="fx-unit">' + o.unit + '</span><span class="fx-out" data-out>' + (v ? inch(v) : '') + '</span></div>';
    } else if (type === 'nums') {
      v = v || {};
      h = '<div class="fx-grid">' + o.map(function (p) {
        return '<label><span class="fx-sub">' + p[1] + (p[2] ? ' <small>Optional</small>' : '') + '</span><span class="fx-row"><input class="in fx-n" type="number" inputmode="numeric" data-k="' + p[0] + '" value="' + esc(v[p[0]] || '') + '"><span class="fx-unit">cm</span></span></label>';
      }).join('') + '</div>';
    } else if (type === 'sizes') {
      v = v || {};
      h = '<div class="fx-grid"><label><span class="fx-sub">Size scale</span>' + sel('r', o, v.r || 'EU') + '</label>' +
        '<label><span class="fx-sub">Clothing size</span><input class="in" data-k="c" value="' + esc(v.c || '') + '" maxlength="8"></label>' +
        '<label><span class="fx-sub">Shoe size</span><input class="in" data-k="s" value="' + esc(v.s || '') + '" maxlength="6" inputmode="decimal"></label></div>';
    } else if (type === 'one' || type === 'many') {
      h = chips(id, o, type === 'one' ? (v ? [v] : []) : arr(v));
    } else if (type === 'two') {
      v = v || {};
      h = o.map(function (g, i) { return '<p class="fx-sub">' + g[0] + '</p>' + chips(id, g[1], arr(v[i ? 'b' : 'a']), i); }).join('');
    } else if (type === 'swatch') {
      var on = arr(v);
      h = '<div class="fx-sw" role="group" aria-labelledby="fl-' + id + '">' + o.map(function (c, i) {
        return '<button type="button" data-opt="' + (i + 1) + '" aria-pressed="' + (on.indexOf(i + 1) > -1) + '" aria-label="Monk ' + (i + 1) + '" title="Monk ' + (i + 1) + '" style="background:' + c + '"></button>';
      }).join('') + '</div><p class="fx-meta">' + (on.length ? on.length + ' of 10 shades' : 'No shades chosen') + '</p>';
    } else if (type === 'range') {
      v = v || {};
      var bad = v.min && v.max && (v.max - v.min) < o.span;
      h = '<div class="fx-row"><input class="in fx-n" type="number" inputmode="numeric" data-k="min" min="' + o.min + '" max="' + o.max + '" value="' + esc(v.min || '') + '" aria-label="From"><span class="fx-unit">to</span><input class="in fx-n" type="number" inputmode="numeric" data-k="max" min="' + o.min + '" max="' + o.max + '" value="' + esc(v.max || '') + '" aria-label="To"><span class="fx-unit">years</span></div>' +
        '<p class="fx-err" data-err' + (bad ? '' : ' hidden') + '>Make it at least ' + o.span + ' years wide.</p>';
    } else if (type === 'levels') {
      v = v || {};
      h = '<ul class="fx-lv">' + o[0].map(function (d) { return '<li><span>' + esc(d) + '</span>' + sel('lv:' + d, o[1], v[d], 'Not spoken', d) + '</li>'; }).join('') + '</ul>';
    } else if (type === 'reach') {
      var pl = arr(all.platforms); v = v || {};
      h = pl.length ? '<ul class="fx-lv">' + pl.map(function (p) { return '<li><span>' + esc(p) + '</span>' + sel('rc:' + p, o, v[p], 'Choose a range', p) + '</li>'; }).join('') + '</ul>'
        : '<p class="fx-meta">Choose your platforms first, then set the reach for each.</p>';
    } else if (type === 'pairs') {
      var ps = arr(v);
      h = '<ul class="fx-pairs">' + ps.map(function (p, i) {
        return '<li>' + sel('p0:' + i, o, p[0], null, 'From') + '<span class="fx-unit" aria-hidden="true">→</span>' + sel('p1:' + i, o, p[1], null, 'To') +
          '<button type="button" class="iconbtn" data-rmpair="' + i + '" aria-label="Remove ' + esc(p[0] + ' to ' + p[1]) + '"><svg class="icon"><use href="#i-trash"/></svg></button></li>';
      }).join('') + '</ul><button type="button" class="btn btn-2 fx-add" data-addpair><svg class="icon"><use href="#i-plus"/></svg>Add a pair</button>';
    } else if (type === 'licence') {
      v = v || {};
      h = '<div class="fx-grid"><label><span class="fx-sub">Certificate number</span><input class="in" data-k="cert" value="' + esc(v.cert || '') + '" dir="ltr"></label>' +
        '<label><span class="fx-sub">Drone registration</span><input class="in" data-k="reg" value="' + esc(v.reg || '') + '" dir="ltr"></label>' +
        '<label><span class="fx-sub">Valid until</span><input class="in" type="date" data-k="exp" value="' + esc(v.exp || '') + '"></label></div>' +
        '<button type="button" class="btn btn-2 fx-add" data-upload="file"><svg class="icon"><use href="#i-upload"/></svg>' + (v.file ? 'Replace certificate' : 'Upload certificate') + '</button>' +
        (v.file ? '<span class="fx-meta fx-file">' + esc(v.file) + '</span>' : '');
    } else if (type === 'digitals') {
      v = v || {};
      var old = v.d && age(v.d) > 182;
      h = '<div class="fx-digi">' + o.map(function (n) { return '<figure><div class="fx-ph' + (v.d ? ' on' : '') + '"></div><figcaption>' + n + '</figcaption></figure>'; }).join('') + '</div>' +
        (v.d ? '<p class="fx-meta' + (old ? ' fx-old' : '') + '">' + (old ? 'Taken ' + date(v.d) + '. Over six months old, so brands see it flagged. Upload a new set.' : 'Taken ' + date(v.d)) + '</p>' : '') +
        '<button type="button" class="btn btn-2 fx-add" data-upload="set"><svg class="icon"><use href="#i-upload"/></svg>' + (v.d ? 'Upload a new set' : 'Upload digitals') + '</button>';
    }
    /* a filled field can be emptied in one go; it then drops off the profile */
    var clr = filled(id, v) ? '<button type="button" class="fx-clear" data-clear aria-label="Clear ' + esc(f[0].toLowerCase()) + '">Clear</button>' : '';
    return '<div class="fld fx-opened" data-fld="' + id + '"><div class="fx-l"><p id="fl-' + id + '"><span>' + f[0] + '</span>' + (opt ? ' <small>Optional</small>' : '') + '</p>' + clr + '</div>' +
      (f[3] ? '<p class="fx-help">' + esc(f[3]) + '</p>' : '') + h +
      '<div class="fx-done"><button type="button" class="btn btn-2" data-fxdone><svg class="icon" aria-hidden="true"><use href="#i-check"/></svg>Done</button></div></div>';
  }

  /* one listener for every field on the page. vals is profile.fields; done(id) saves and redraws the field */
  function bind(root, vals, done, cleared) {
    var key = function (el) { return el.closest('[data-fld]').dataset.fld; };
    root.addEventListener('click', function (e) {
      var b = e.target.closest('[data-fld] [data-opt]');
      if (b) {
        var id = key(b), t = F[id][1], o = t === 'swatch' ? +b.dataset.opt : b.dataset.opt;
        if (t === 'one') vals[id] = vals[id] === o ? '' : o;
        else if (t === 'two') { var v = vals[id] = vals[id] || {}, g = b.dataset.g === '1' ? 'b' : 'a', l = arr(v[g]); v[g] = l.indexOf(o) > -1 ? l.filter(function (x) { return x !== o; }) : l.concat(o); }
        else { var l2 = arr(vals[id]); vals[id] = l2.indexOf(o) > -1 ? l2.filter(function (x) { return x !== o; }) : l2.concat(o); }
        done(id, b); return;
      }
      var c = e.target.closest('[data-fld] [data-clear]');
      if (c) { var idc = key(c), was = vals[idc]; delete vals[idc]; done(idc, null); if (cleared) cleared(idc, was, F[idc][0]); return; }
      var a = e.target.closest('[data-fld] [data-addpair]');
      if (a) { var id2 = key(a); (vals[id2] = arr(vals[id2])).push(['English', 'Arabic']); done(id2, a); return; }
      var r = e.target.closest('[data-fld] [data-rmpair]');
      if (r) { var id3 = key(r); vals[id3].splice(+r.dataset.rmpair, 1); done(id3, null); return; }
      var u = e.target.closest('[data-fld] [data-upload]');
      if (u) {
        var id4 = key(u), v4 = vals[id4] = vals[id4] || {};
        if (u.dataset.upload === 'set') v4.d = new Date().toISOString().slice(0, 10); else v4.file = 'gaca-certificate.pdf';
        done(id4, u);
      }
    });
    var put = function (e, redraw) {
      var el = e.target, k = el.dataset && el.dataset.k; if (!k || !el.closest('[data-fld]')) return;
      var id = key(el), t = F[id][1], val = el.value.trim();
      if (t === 'num') vals[id] = val ? +val : '';
      else if (t === 'levels' || t === 'reach') { var m = vals[id] = vals[id] || {}, n = k.slice(3); if (val) m[n] = val; else delete m[n]; }
      else if (t === 'pairs') { var ix = +k.slice(3); vals[id][ix][k[1] === '0' ? 0 : 1] = val; }
      else { var o = vals[id] = vals[id] || {}; o[k] = (t === 'range' || t === 'nums') && val ? +val : val; }
      done(id, el, !redraw);
    };
    root.addEventListener('input', function (e) { if (e.target.tagName === 'INPUT') put(e, false); });
    root.addEventListener('change', function (e) { put(e, true); });
  }

  /* ---- on the profile ---- */
  function filled(id, v) {
    var t = F[id][1];
    if (v == null || v === '') return false;
    if (t === 'two') return arr(v.a).length + arr(v.b).length > 0;
    if (Array.isArray(v)) return v.length > 0;
    if (typeof v === 'object') return Object.keys(v).some(function (k) { return v[k] !== '' && v[k] != null; });
    return true;
  }
  /* the short read-out on a closed row */
  function summary(id, v, all) {
    var t = F[id][1];
    if (t === 'many') return esc(v.join(', '));
    if (t === 'two') return esc(arr(v.a).concat(arr(v.b)).join(', '));
    if (t === 'digitals') return v.d ? 'Taken ' + date(v.d) + (age(v.d) > 182 ? ' · <span class="fx-old">over six months old</span>' : '') : '';
    if (t === 'licence') return [v.cert ? 'Certificate ' + esc(v.cert) : '', v.exp ? 'valid until ' + date(v.exp) : '', v.file ? 'file added' : ''].filter(Boolean).join(' · ');
    var m = view(id, v, all).match(/<dd>([\s\S]*)<\/dd>/);
    return m ? m[1] : '';
  }
  function view(id, v, all) {
    if (!filled(id, v)) return '';
    var f = F[id], t = f[1], o = f[2], h;
    var pills = function (l) { return '<span class="fx-pills">' + l.map(function (x) { return '<span class="chip">' + esc(x) + '</span>'; }).join('') + '</span>'; };
    if (t === 'num') h = v + ' ' + o.unit + ' <span class="fx-dim">' + inch(v) + '</span>';
    else if (t === 'nums') h = o.filter(function (p) { return v[p[0]]; }).map(function (p) { return p[1] + ' ' + v[p[0]]; }).join(' · ') + ' cm';
    else if (t === 'sizes') h = [v.c ? (v.r || 'EU') + ' ' + esc(v.c) : '', v.s ? 'Shoe ' + esc(v.s) : ''].filter(Boolean).join(' · ');
    else if (t === 'one') h = esc(v);
    else if (t === 'many') h = pills(v);
    else if (t === 'two') h = [['a', o[0][0]], ['b', o[1][0]]].filter(function (g) { return arr(v[g[0]]).length; }).map(function (g) { return '<span class="fx-dim fx-gl">' + g[1] + '</span>' + pills(v[g[0]]); }).join('');
    else if (t === 'swatch') h = '<span class="fx-sw view">' + v.slice().sort(function (a, b) { return a - b; }).map(function (i) { return '<span style="background:' + o[i - 1] + '" title="Monk ' + i + '"></span>'; }).join('') + '</span><span class="fx-vh">Monk ' + v.join(', ') + '</span>';
    else if (t === 'range') h = (v.min || '?') + '–' + (v.max || '?') + ' years';
    else if (t === 'levels') h = Object.keys(v).map(function (d) { return esc(d) + ' <span class="fx-dim">' + esc(v[d]) + '</span>'; }).join(' · ');
    else if (t === 'reach') { var pl = arr(all && all.platforms); var ks = Object.keys(v).filter(function (p) { return pl.indexOf(p) > -1; }); if (!ks.length) return ''; h = ks.map(function (p) { return esc(p) + ' <span class="fx-dim">' + esc(v[p]) + '</span>'; }).join(' · '); }
    else if (t === 'pairs') h = v.map(function (p) { return esc(p[0]) + ' → ' + esc(p[1]); }).join(' · ');
    else if (t === 'licence') h = 'Licensed remote pilot' + (v.exp ? ' <span class="fx-dim">valid until ' + date(v.exp) + '</span>' : '');
    else if (t === 'digitals') {
      if (!v.d) return '';
      var old = age(v.d) > 182;
      h = '<span class="fx-digi view">' + o.map(function (n) { return '<span class="fx-ph on" title="' + n + '"></span>'; }).join('') + '</span>' +
        '<span class="fx-dim' + (old ? ' fx-old' : '') + '">Taken ' + date(v.d) + (old ? ' · over six months old' : '') + '</span>';
    }
    return '<div class="fx-fact"><dt>' + f[0] + '</dt><dd>' + h + '</dd></div>';
  }

  window.FAMA_FIELDS = { summary: summary, def: F, forSkill: forSkill, editor: editor, bind: bind, view: view, filled: filled };
})();
