/* Project editor, WYSIWYG (24 Oct 2026). The project is edited on a page that looks like the published one:
   the same cover, colophon, chapter headings, type and pictures (assets/css/project-page.css). Every word types
   where it shows; every picture has its own Replace; lists (pieces, numbers, people, posts) add and remove in place.
   While editing, each block shows on its own: on the page the blocks lay themselves out (an image then text sit
   side by side; 4+ photos become the scrolling gallery), and the block menu says so.
   Things visitors never see (date, confidential client, status) live in Settings.
   Saved as you go to localStorage "fama-projects-v1", the same place project.html reads. ?p=desert-light edits a project. */
(function () {
  var F = window.FAMA, esc = F.esc, toast = F.toast, Q = new URLSearchParams(location.search);
  var $ = function (s, r) { return (r || document).querySelector(s); }, $$ = function (s, r) { return [].slice.call((r || document).querySelectorAll(s)); };
  var PROFILE = FAMA_PROFILE.load();
  var MY = PROFILE.skills.map(function (s) { return { id: s.id, name: FAMA_SKILL[s.id].name, specs: FAMA_SKILL[s.id].specs.map(function (x) { return x.name; }) }; });
  var two = function (n) { return String(n).padStart(2, '0'); };
  var ini = function (n) { return String(n || '?').split(/\s+/).filter(Boolean).map(function (w) { return w[0]; }).join('').slice(0, 2).toUpperCase(); };
  var I = function (id) { return '<svg class="pe-i" aria-hidden="true"><use href="#e-' + id + '"/></svg>'; };
  var clone = function (o) { return JSON.parse(JSON.stringify(o)); };

  /* ---- data ---- */
  var KEY = 'fama-projects-v1';
  var DESERT = [
    { t: 'text', v: 'A resort capsule shot at golden hour outside Siwa, built from the collection’s linen base.' },
    { t: 'heading', v: 'The brief' },
    { t: 'text', v: 'Maison Nour wanted the linen to carry the story without a postcard shot. We built every look from the collection’s base pieces and kept anything that pulled the eye away from the cloth off the rail.' },
    { t: 'image', has: true, cap: 'Looks laid out on the table the night before' },
    { t: 'heading', v: 'The palette' },
    { t: 'image', has: true, cap: 'Swatches against sand' },
    { t: 'text', v: 'We kept the palette to sand and bone, and pinned each outfit on the board before the shoot so the team could see the whole edit at once. One accent, a dried-plum silk, came in only where the light dropped.' },
    { t: 'gallery', n: 2, caps: ['The board, day one', 'Final pick, eleven looks'] },
    { t: 'look', has: true, title: 'Look 04', src: 'assets/img/stock/look-04.jpg', items: [{ n: 'Sweatshirt', d: 'Maison Nour · brushed cotton, rust', x: 24, y: 34 }, { n: 'Cable-knit jumper', d: 'Maison Nour · wool, brick', x: 70, y: 34 }, { n: 'Chelsea boots', d: 'Archive, Cairo · tan suede', x: 22, y: 73 }, { n: 'Check trousers', d: 'Maison Nour · wool, rust check', x: 70, y: 75 }] },
    { t: 'quote', v: 'The light did half the work. We just stayed out of its way.', by: 'Omar Saleh, photographer' },
    { t: 'beforeafter', has: true, lb: 'Raw frame', la: 'Final grade', cap: 'The grade warmed the sand and deepened the sky', srcB: 'assets/img/stock/grade-before.jpg', srcA: 'assets/img/stock/grade-after.jpg' },
    { t: 'heading', v: 'On set' },
    { t: 'text', v: 'Two evenings, forty-minute windows. Every look was steamed and hung in order so a change took under a minute.' },
    { t: 'gallery', n: 5, caps: ['The rail at the edge of the dunes', 'Fittings in the tent', 'Pins, swaps, last notes', 'Last light, last look', 'The book, the morning after'] },
    { t: 'video', url: 'https://vimeo.com/fama-desert-light', cap: 'Behind the scenes, Siwa', len: '1:42' },
    { t: 'embed', url: 'https://www.instagram.com/reel/maisonnour-desert-light' },
    { t: 'embed', url: 'https://www.tiktok.com/@demo.talent/video/rail-to-set' },
    { t: 'heading', v: 'What it did' },
    { t: 'results', items: [['1.2M', 'Reach'], ['68%', 'Sell-through'], ['+40%', 'Store visits', 'vs last season']] },
    { t: 'credits', items: [{ n: 'Omar Saleh', r: 'Photographer', st: 'confirmed' }, { n: 'Rania K.', r: 'Key makeup artist', st: 'awaiting' }, { n: 'Hana Mostafa', r: 'Director', st: 'listed' }] }];
  var SEED = { 'desert-light': { id: 'desert-light', title: 'Desert Light', status: 'published', cover: true, client: 'Maison Nour', role: 'Lead stylist', date: '2026-03', link: 'https://maisonnour.com', skills: ['Styling', 'Photography'], specs: ['Fashion', 'Menswear'], blocks: DESERT } };

  var store = {};
  try { store = JSON.parse(FAMA_YEARS(localStorage.getItem(KEY) || '{}')); } catch (e) {}
  var pid = Q.get('p');
  var P = pid && (store[pid] || SEED[pid]) ? clone(store[pid] || SEED[pid]) :
    { id: 'p' + Date.now(), title: '', status: 'draft', cover: false, client: '', role: '', date: '', link: '', skills: MY.length ? [MY[0].name] : [], specs: [], blocks: [{ t: 'text', v: '' }] };
  /* older copies: the sample's look and before/after pictures; the year moves from the title to the date */
  if (P.id === 'desert-light') {
    var L = DESERT[8], BA = DESERT[10];
    (P.blocks || []).forEach(function (b, i) { if (b.t === 'look' && !b.src && b.title === L.title) P.blocks[i] = clone(L); if (b.t === 'beforeafter' && !b.srcA && b.lb === BA.lb) P.blocks[i] = clone(BA); });
  }
  var ty = FAMA_FEATURED.split(P.title || '');
  if (ty.year) { P.title = ty.name; if (!P.date) P.date = ty.year + '-01'; }
  /* pictures the page shows from its samples become the project's own, so the editor and the page show the same */
  (function () {
    var pi = 1, ph = function () { return FAMA_FEATURED.photo(P.id, pi++); };
    if (P.cover && !P.coverSrc) P.coverSrc = FAMA_FEATURED.photo(P.id, 0);
    P.blocks.forEach(function (b) {
      if (b.t === 'image' && b.has) { var u = ph(); if (!b.src) b.src = u; }
      else if (b.t === 'gallery') { b.srcs = b.srcs || []; for (var k = 0; k < (b.n || 0); k++) { var g = ph(); if (!b.srcs[k]) b.srcs[k] = g; } }
      else if (b.t === 'video' && b.url) pi++;
      else if (b.t === 'beforeafter' && b.has) { if (!b.srcA) { b.srcA = ph(); b.srcB = b.srcB || b.srcA; } }
      else if (b.t === 'look' && b.has && !b.src) b.src = ph();
      else if (b.t === 'embed' && b.url) pi++;
    });
  })();

  var saveT, savedEl, hist = []; /* hist: the project after each save, newest last, for Cmd/Ctrl+Z */
  function save() {
    if (savedEl) savedEl.innerHTML = '<i class="busy"></i>Saving…';
    clearTimeout(saveT);
    saveT = setTimeout(function () {
      var title = P.title; store[P.id] = P;
      var snap = JSON.stringify(P); if (hist[hist.length - 1] !== snap) { hist.push(snap); if (hist.length > 60) hist.shift(); }
      try { localStorage.setItem(KEY, JSON.stringify(store)); if (savedEl) savedEl.innerHTML = '<i></i>Saved just now'; }
      catch (e) { if (savedEl) savedEl.innerHTML = '<i class="bad"></i>Not saved'; toast('This browser is out of room for pictures. Use smaller ones, or fewer.'); }
    }, 350);
    if (!Q.get('p')) { var u = new URL(location.href); u.searchParams.set('p', P.id); history.replaceState(null, '', u); }
  }

  /* ---- what can be added, and how it shows on the page ---- */
  var MENU = [
    ['Write', [['text', 'Text', 'A paragraph. Type / in an empty line for this menu', 'text'], ['heading', 'Heading', 'Starts a new chapter on the page', 'heading'], ['quote', 'Quote', 'Set large, with who said it', 'quote']]],
    ['Show', [['image', 'Image', 'Full width. Text right after it sits beside it', 'image'], ['gallery', 'Photos', '2 sit side by side; 4 or more become the scrolling gallery', 'images'], ['beforeafter', 'Before / After', 'One frame twice, with a line to drag', 'split'], ['look', 'Look with tags', 'Numbered pieces on a photo', 'tags'], ['video', 'Video', 'A YouTube or Vimeo link', 'video'], ['embed', 'Social post', 'A post from Instagram, TikTok, Behance or YouTube Shorts', 'reel']]],
    ['Prove', [['results', 'Results', 'Up to four numbers: 1.2M, 68%, +40%', 'chart'], ['credits', 'Credits', 'People you made it with, asked to confirm', 'users']]]];
  var KIND = { text: 'Text', heading: 'Heading', quote: 'Quote', image: 'Image', gallery: 'Photos', beforeafter: 'Before / After', look: 'Look', video: 'Video', embed: 'Social post', results: 'Results', credits: 'Credits' };
  var fresh = function (t) {
    return t === 'beforeafter' ? { t: t, has: false, lb: 'Before', la: 'After', cap: '' } : t === 'look' ? { t: t, has: false, title: '', items: [] } :
      t === 'embed' ? { t: t, url: '' } : t === 'quote' ? { t: t, v: '', by: '' } : t === 'gallery' ? { t: t, n: 0, caps: [], srcs: [] } :
      t === 'results' ? { t: t, items: [['', '']] } : t === 'credits' ? { t: t, items: [{ n: '', r: '', st: 'new' }] } :
      t === 'image' ? { t: t, has: false, cap: '' } : t === 'video' ? { t: t, url: '', cap: '' } : { t: t, v: '' };
  };

  /* ---- render ---- */
  var page = $('#page');
  var ce = function (f, ph, tag, cls, val) { return '<' + tag + ' class="' + (cls || '') + '" contenteditable="true" spellcheck="true" role="textbox" aria-label="' + esc(ph) + '" data-f="' + f + '" data-ph="' + esc(ph) + '">' + esc(val || '') + '</' + tag + '>'; };
  var picBtn = function (act, label, k) { return '<button type="button" class="pe-pic" data-act="' + act + '"' + (k != null ? ' data-k="' + k + '"' : '') + '>' + I('image') + label + '</button>'; };
  var rType = function (v) { return /^\s*[+\-−]/.test(v) ? 'change' : /%\s*$/.test(v) ? 'percent' : 'number'; };
  var platform = function (u) { return /instagram/.test(u) ? 'Instagram' : /tiktok/.test(u) ? 'TikTok' : /behance/.test(u) ? 'Behance' : /youtu/.test(u) ? 'YouTube' : ''; };

  function blockBody(b, i, ctx) {
    if (b.t === 'text') return ce('v', i === ctx.leadAt ? 'Open with one line about the project' : 'Write, or type / to add a block', 'p', i === ctx.leadAt ? 'lead pe-lead' : 'txt', b.v);
    if (b.t === 'heading') return '<div class="ch-h"><span>CHAPTER ' + two(ctx.ch) + '</span>' + ce('v', 'Name this chapter', 'h2', '', b.v) + '</div>';
    if (b.t === 'quote') return '<blockquote class="quote">' + ce('v', 'What was said', 'span', 'pe-q', b.v) + ce('by', 'Who said it, and their role', 'cite', '', b.by) + '</blockquote>';
    if (b.t === 'image') {
      if (!b.has) return '<button type="button" class="pe-drop" data-act="img">' + I('image') + '<b>Add an image</b><small>Pick one of yours, or upload from your device</small></button>';
      return '<figure class="full"><div class="pe-frame"><div class="ph-img" style="background-image:url(' + esc(b.src) + ')"></div>' + picBtn('img', 'Replace') + '</div><figcaption><b>' + two(ctx.fig) + '</b>' + ce('cap', 'Add a caption', 'span', '', b.cap) + '</figcaption></figure>';
    }
    if (b.t === 'gallery') {
      var n = b.n || 0;
      return '<div class="pe-gal"><p class="pe-note">' + I('images') + '<span><b>Photos · ' + n + '</b>' + (n >= 4 ? 'On the page: the scrolling gallery, in this order, under the chapter name.' : n === 2 ? 'On the page: side by side.' : n === 3 ? 'On the page: one wide, then two side by side.' : n === 1 ? 'On the page: full width.' : 'Add pictures. 4 or more become the scrolling gallery.') + '</span></p>' +
        '<ol class="pe-strip">' + Array.from({ length: n }, function (_, k) {
          return '<li class="pe-ph"><div class="pe-ph-img" style="background-image:url(' + esc((b.srcs || [])[k] || '') + ')"><span class="pe-ph-n">' + two(k + 1) + '</span>' +
            '<span class="pe-ph-acts">' + (k ? '<button type="button" data-act="gl" data-k="' + k + '" aria-label="Move picture ' + (k + 1) + ' earlier">' + I('left') + '</button>' : '') +
            (k < n - 1 ? '<button type="button" data-act="gr" data-k="' + k + '" aria-label="Move picture ' + (k + 1) + ' later">' + I('right') + '</button>' : '') +
            '<button type="button" data-act="gimg" data-k="' + k + '" aria-label="Replace picture ' + (k + 1) + '">' + I('image') + '</button><button type="button" data-act="gdel" data-k="' + k + '" aria-label="Remove picture ' + (k + 1) + '">' + I('x') + '</button></span></div>' +
            ce('caps.' + k, 'Caption', 'p', 'pe-ph-cap', (b.caps || [])[k]) + '</li>'; }).join('') +
        (n < 24 ? '<li class="pe-ph add"><button type="button" data-act="gadd">' + I('plus') + '<b>Add pictures</b><small>Pick or upload</small></button></li>' : '') + '</ol></div>';
    }
    if (b.t === 'beforeafter') {
      if (!b.has) return '<button type="button" class="pe-drop" data-act="ba">' + I('split') + '<b>Add the before and after</b><small>The same frame twice works best</small></button>';
      return '<figure class="ba"><div class="ba-box" style="--p:50%"><div class="ph-img ba-after" style="background-image:url(' + esc(b.srcA) + ')"></div><div class="ph-img ba-before real" style="background-image:url(' + esc(b.srcB) + ')"></div>' +
        ce('lb', 'Before', 'span', 'ba-tag l', b.lb) + ce('la', 'After', 'span', 'ba-tag r', b.la) + '<div class="ba-line" aria-hidden="true"><span class="ba-knob">‹ ›</span></div>' +
        '<span class="pe-ba-acts">' + picBtn('baB', 'Before') + picBtn('baA', 'After') + '</span></div><figcaption>' + ce('cap', 'Say what changed', 'span', '', b.cap) + '</figcaption></figure>';
    }
    if (b.t === 'look') {
      if (!b.has) return '<button type="button" class="pe-drop" data-act="look">' + I('tags') + '<b>Add the look’s photo</b><small>Then click on each piece to tag it</small></button>';
      var it = b.items || [];
      return '<div class="look pe-look"><figure class="look-img" data-look><div class="ph-img" style="background-image:url(' + esc(b.src) + ')"></div>' +
        it.map(function (x, k) { return '<button type="button" class="dot" data-dot="' + k + '" style="left:' + (x.x != null ? x.x : 50) + '%;top:' + (x.y != null ? x.y : 50) + '%" aria-label="' + (k + 1) + '. ' + esc(x.n || 'piece') + '. Arrow keys move it">' + (k + 1) + '</button>'; }).join('') +
        picBtn('look', 'Replace photo') + '<p class="pe-look-tip">' + (matchMedia('(hover:none)').matches ? 'Tap the photo to add a piece · drag a number onto its piece' : 'Click the photo to add a piece · drag a number onto its piece') + '</p></figure>' +
        '<div class="look-list"><div class="pe-look-h">' + ce('title', 'Name the look', 'span', 'pe-look-name', b.title) + '<span>What’s in it</span></div><ol>' +
        it.map(function (x, k) { return '<li data-tag="' + (k + 1) + '">' + ce('items.' + k + '.n', 'Piece, e.g. Overshirt', 'b', '', x.n) + ce('items.' + k + '.d', 'Brand · material, colour', 'span', '', x.d) +
          '<span class="pe-row-acts">' + (k ? '<button type="button" data-act="itup" data-k="' + k + '" aria-label="Move up">' + I('up') + '</button>' : '') + '<button type="button" data-act="itdel" data-k="' + k + '" aria-label="Remove ' + esc(x.n || 'this piece') + '">' + I('x') + '</button></span></li>'; }).join('') +
        '</ol>' + (it.length < 8 ? '<button type="button" class="pe-add-row" data-act="itadd">' + I('plus') + 'Add a piece<small>or click on the photo</small></button>' : '') + '</div></div>';
    }
    if (b.t === 'video') {
      var pl = /vimeo/.test(b.url || '') ? 'Vimeo' : /youtu/.test(b.url || '') ? 'YouTube' : '';
      return '<figure class="video">' + (b.url ? '<div class="vposter"><span class="ph-img" style="background-image:url(' + esc(FAMA_FEATURED.photo(P.id, 9)) + ')"></span><span class="vplay" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M8 5.5v13l11-6.5z"/></svg></span>' + (b.len ? '<span class="vlen">' + esc(b.len) + '</span>' : '') + '</div>' : '') +
        '<label class="pe-url">' + I('video') + '<input type="url" dir="ltr" data-f="url" value="' + esc(b.url || '') + '" placeholder="Paste a YouTube or Vimeo link" aria-label="Video link">' + (pl ? '<small>' + pl + '</small>' : '') + '</label>' +
        '<figcaption><b>Film</b>' + ce('cap', 'What it is', 'span', '', b.cap) + '</figcaption></figure>';
    }
    if (b.t === 'embed') {
      var u = b.url || '', p2 = platform(u), who = (u.match(/@([\w.\-]+)/) || u.match(/instagram\.com\/(?:reel\/)?([\w.\-]+?)(?:-|\/|$)/) || [])[1] || (p2 || 'post').toLowerCase();
      return '<div class="pe-emb">' + (u ? '<div class="emb-card" aria-hidden="true"><span class="emb-top"><span class="av">' + esc(ini(who.replace(/[._-]/g, ' '))) + '</span><span><b>' + esc(who) + '</b><i>' + esc(p2 || 'Link') + '</i></span></span><span class="ph-img" style="background-image:url(' + esc(FAMA_FEATURED.photo(P.id, 11 + i)) + ')"></span></div>' : '') +
        '<div class="pe-emb-side"><p class="pe-emb-k">' + (ctx.firstEmbed ? 'Also posted · posts next to each other show side by side' : 'Social post') + '</p><label class="pe-url">' + I('link') + '<input type="url" dir="ltr" data-f="url" value="' + esc(u) + '" placeholder="Paste an Instagram, TikTok, Behance or YouTube Shorts link" aria-label="Post link">' + (p2 ? '<small>' + p2 + '</small>' : '') + '</label></div></div>';
    }
    if (b.t === 'results') {
      var items = b.items || [];
      return '<div class="res">' + items.map(function (m, k) {
        var v = m[0] || '', kk = rType(v), down = kk === 'change' && /^\s*[\-−]/.test(v), pct = Math.max(0, Math.min(100, parseFloat(v) || 0));
        return '<div class="pe-item ' + (kk === 'change' ? (down ? 'up down' : 'up') : '') + '">' + ce('items.' + k + '.0', '1.2M', 'b', '', v) + ce('items.' + k + '.1', 'What it measures', 'span', '', m[1]) +
          (kk === 'percent' ? '<div class="bar" aria-hidden="true"><i style="width:' + pct + '%"></i></div>' : '') + (kk === 'change' ? ce('items.' + k + '.2', 'Compared with, e.g. last season', 'small', '', m[2]) : '') +
          '<button type="button" class="pe-x" data-act="rdel" data-k="' + k + '" aria-label="Remove this number">' + I('x') + '</button></div>'; }).join('') +
        (items.length < 4 ? '<button type="button" class="pe-add-tile" data-act="radd">' + I('plus') + '<b>Add a number</b><small>1.2M · 68% · +40%</small></button>' : '') +
        '</div><p class="pe-hint">Type a number the way it reads. A % gets a bar; a + or − shows a rise or a fall, with what it’s compared to.</p>';
    }
    if (b.t === 'credits') {
      var ppl = b.items || [];
      return '<ul class="cred"><li class="pe-me"><span class="av">DT</span><b>Demo talent</b><span class="r">' + esc(P.role || 'Your role') + '</span><span class="st">Owner</span></li>' +
        ppl.map(function (x, k) {
          var st = x.st === 'confirmed' ? 'Confirmed' : x.st === 'awaiting' ? 'Waiting to confirm' : x.st === 'listed' ? 'Shown, not asked' : 'Asked when you publish';
          return '<li><span class="av">' + esc(ini(x.n)) + '</span>' + ce('items.' + k + '.n', 'Their name', 'b', '', x.n) + ce('items.' + k + '.r', 'Role, e.g. Photographer', 'span', 'r', x.r) +
            '<span class="st pe-st-' + (x.st || 'new') + '">' + st + '</span><button type="button" class="pe-x" data-act="cdel" data-k="' + k + '" aria-label="Remove ' + esc(x.n || 'this person') + '">' + I('x') + '</button></li>'; }).join('') +
        '<li class="pe-add-li"><button type="button" data-act="cadd">' + I('plus') + '<b>Credit someone</b><small>They’re asked to confirm when you publish</small></button></li></ul>';
    }
    return '';
  }

  function tools(i, b) {
    return '<div class="pe-tools" role="toolbar" aria-label="' + KIND[b.t] + ' block"><span class="pe-kind">' + KIND[b.t] + '</span>' +
      '<button type="button" class="pe-grip" data-grip aria-label="Drag to move (or use the arrows)" tabindex="-1">' + I('grip') + '</button>' +
      '<button type="button" data-act="up" aria-label="Move up"' + (i === 0 ? ' disabled' : '') + '>' + I('up') + '</button>' +
      '<button type="button" data-act="down" aria-label="Move down"' + (i === P.blocks.length - 1 ? ' disabled' : '') + '>' + I('down') + '</button>' +
      '<button type="button" data-act="more" aria-label="More" aria-haspopup="menu">' + I('more') + '</button></div>';
  }
  var ins = function (i) { return '<div class="pe-ins"><button type="button" data-act="add" data-at="' + i + '" aria-label="Add a block here"' + (i < P.blocks.length - 1 ? ' tabindex="-1"' : '') + '>' + I('plus') + '</button></div>'; };

  function storyHTML() {
    var ctx = { ch: 0, fig: 0, leadAt: -1 }, out = ins(-1), seenHead = false;
    var firstText = P.blocks.findIndex(function (b) { return b.t === 'text'; }), firstHead = P.blocks.findIndex(function (b) { return b.t === 'heading'; });
    if (firstText >= 0 && (firstHead < 0 || firstText < firstHead)) ctx.leadAt = firstText;
    P.blocks.forEach(function (b, i) {
      if (b.t === 'heading') ctx.ch++;
      if (b.t === 'image' && b.has) ctx.fig++;
      ctx.firstEmbed = b.t === 'embed' && (!P.blocks[i - 1] || P.blocks[i - 1].t !== 'embed');
      out += '<div class="pe-b pe-' + b.t + (b.t === 'heading' ? ' ch' : '') + '" data-i="' + i + '">' + tools(i, b) + blockBody(b, i, ctx) + '</div>' + ins(i);
      if (b.t === 'gallery') ctx.fig += b.n || 0;
    });
    return out;
  }

  function coverHTML() {
    var y = P.date ? P.date.slice(0, 4) : '', kick = [P.nda ? 'Confidential client' : P.client, P.skills[0]].filter(Boolean).join(' · ');
    return '<header class="cover pe-cover' + (P.cover ? '' : ' none') + '">' + (P.cover ? '<div class="ph-img" style="background-image:url(' + esc(P.coverSrc) + ')"></div>' : '') +
      '<div class="pe-cover-acts">' + (P.cover ? '<button type="button" class="btn" data-act="cover">' + I('image') + 'Change cover</button><button type="button" class="btn" data-act="nocover">Remove</button>' :
        '<button type="button" class="btn" data-act="cover">' + I('image') + 'Add a cover</button>') + '</div>' +
      '<div class="cap grid"><div><p class="kick">' + (y ? '<span class="ytag">' + y + '</span>' : '') + esc(kick) + '<span class="pe-auto">' + (kick || y ? 'from Client, Skills and Date' : 'Client, Skills and Date show here') + '</span></p>' +
      '<h1 contenteditable="true" spellcheck="true" data-p="title" data-ph="Name the project">' + esc(P.title) + '</h1>' +
      '<div class="by"><span class="av" aria-hidden="true">DT</span><span><b>Demo talent</b>' + (P.role ? ', ' + esc(P.role.toLowerCase()) : '') + '</span></div></div></div></header>';
  }
  function coloHTML() {
    var specs = P.specs.length ? '<small>' + P.specs.map(function (s) { return '<button type="button" class="pe-chip ghost" data-act="specdel" data-v="' + esc(s) + '" aria-label="Remove ' + esc(s) + '">' + esc(s) + I('x') + '</button>'; }).join('') + '</small>' : '';
    return '<div class="grid"><dl class="colo pe-colo">' +
      '<div><dt>Client</dt><dd contenteditable="true" data-p="client" data-ph="Add a client, or leave empty">' + esc(P.client) + '</dd>' + (P.nda ? '<span class="pe-nda">' + I('lock') + 'Hidden on the page: Confidential</span>' : '') + '</div>' +
      '<div><dt>Role</dt><dd contenteditable="true" data-p="role" data-ph="What did you do on it?">' + esc(P.role) + '</dd></div>' +
      '<div><dt>Skills</dt><dd>' + P.skills.map(function (s) { return '<button type="button" class="pe-chip" data-act="skdel" data-v="' + esc(s) + '" aria-label="Remove ' + esc(s) + '">' + esc(s) + I('x') + '</button>'; }).join('') +
        '<button type="button" class="pe-chip add" data-act="skadd">' + I('plus') + 'Skill</button>' + specs + (P.skills.length ? '<button type="button" class="pe-chip add sm" data-act="specadd">' + I('plus') + 'Speciality</button>' : '') + '</dd></div>' +
      '<div><dt>See it live</dt><dd><input class="pe-link" type="url" dir="ltr" data-p="link" value="' + esc(P.link) + '" placeholder="Paste a link" aria-label="Link to the live work"></dd>' + (P.nda ? '<span class="pe-nda">' + I('lock') + 'Hidden on the page: Confidential</span>' : '') + '</div></dl></div>';
  }

  function render(focusSel) {
    page.innerHTML = coverHTML() + coloHTML() + '<div class="grid"><article class="story pe-story" id="story">' + storyHTML() + '</article></div>';
    renderBar();
    if (focusSel) { var f = $(focusSel); if (f) { f.focus(); placeEnd(f); } }
  }
  function renderStory(focusSel) { $('#story').innerHTML = storyHTML(); if (focusSel) { var f = $(focusSel); if (f) { f.focus(); placeEnd(f); } } }
  function placeEnd(el) { if (!el.isContentEditable) return; var r = document.createRange(); r.selectNodeContents(el); r.collapse(false); var s = getSelection(); s.removeAllRanges(); s.addRange(r); }
  /* the first field of block i (each part of the selector scoped to that block) */
  var at = function (i, sel) { return (sel || '[contenteditable], input, button.pe-drop').split(',').map(function (x) { return '.pe-b[data-i="' + i + '"] ' + x.trim(); }).join(', '); };

  /* ---- the bar ---- */
  var bar = document.createElement('div'); bar.className = 'pe-bar';
  bar.innerHTML = '<div class="in"><a class="back" href="' + F.href('projects.html') + '" aria-label="Back to projects">' + I('left') + '<span class="lbl">Projects</span></a><span class="saved" id="peSaved"><i></i>Saved</span>' +
    '<span class="pill" id="peStatus"></span><button class="btn btn-2" type="button" data-act="settings" aria-haspopup="dialog" aria-label="Settings">' + I('sliders') + '<span class="lbl">Settings</span></button>' +
    '<a class="btn btn-2" id="pePreview" href="#" aria-label="Preview">' + I('eye') + '<span class="lbl">Preview</span></a><button class="btn" type="button" id="pePublish">Publish</button></div>';
  page.parentNode.insertBefore(bar, page);
  savedEl = $('#peSaved');
  function renderBar() {
    var pub = P.status === 'published';
    $('#peStatus').textContent = pub ? 'Published' : 'Draft'; $('#peStatus').className = 'pill ' + (pub ? 'p-live' : 'p-off');
    $('#pePublish').textContent = pub ? 'Update' : 'Publish';
    $('#pePreview').href = F.href('project.html?p=' + P.id + '&preview=1');
  }

  /* ---- settings: what visitors never see ---- */
  var panel = document.createElement('aside'); panel.className = 'pe-panel'; panel.setAttribute('role', 'dialog'); panel.setAttribute('aria-modal', 'true'); panel.setAttribute('aria-label', 'Project settings'); panel.hidden = true;
  var scrim = document.createElement('div'); scrim.className = 'pe-scrim'; scrim.hidden = true;
  document.body.appendChild(scrim); document.body.appendChild(panel);
  function ndaWarn() {
    if (!P.nda || !(P.client || '').trim()) return '';
    var n = P.client.trim().toLowerCase(), hits = P.blocks.filter(function (b) { return JSON.stringify(b).toLowerCase().indexOf(n) >= 0; }).length;
    return hits ? '<p class="pe-warn">' + esc(P.client) + ' is still named in ' + hits + (hits === 1 ? ' block' : ' blocks') + '. Change those words so the page doesn’t give it away.</p>' : '';
  }
  function renderPanel() {
    panel.innerHTML = '<button class="x" type="button" data-act="close" aria-label="Close settings">' + I('x') + '</button><h2>Settings</h2><p class="lead2">Visitors never see these.</p>' +
      '<div class="row"><label for="peDate">Date</label><input id="peDate" type="month" data-p="date" value="' + esc(P.date || '') + '"><small>Sorts your projects, and shows as the year tag.</small></div>' +
      '<div class="row"><div class="tog"><div><label id="peNdaL">Keep the client confidential</label><small>The page says “Confidential client” and hides the link. For work under an NDA.</small></div><button class="sw" role="switch" type="button" data-act="nda" aria-labelledby="peNdaL" aria-checked="' + !!P.nda + '"></button></div>' + ndaWarn() + '</div>' +
      '<div class="row"><label>Status</label><small>' + (P.status === 'published' ? 'Published: it’s on your profile. Changes go live when you press Update.' : 'Draft: only you can see it. Publish puts it on your profile and asks the people you credited to confirm.') + '</small></div>';
  }
  var lastFocus = null;
  function setPanel(on) {
    page.inert = bar.inert = on; /* the page behind can't be reached while Settings is open */
    if (on) { lastFocus = document.activeElement; renderPanel(); panel.hidden = scrim.hidden = false; requestAnimationFrame(function () { panel.classList.add('is-open'); scrim.classList.add('is-open'); $('#peDate').focus(); }); }
    else { panel.classList.remove('is-open'); scrim.classList.remove('is-open'); setTimeout(function () { panel.hidden = scrim.hidden = true; }, 200); if (lastFocus) lastFocus.focus(); }
  }

  /* ---- menus ---- */
  var menu = null;
  function closeMenu() { if (menu) { menu.remove(); menu = null; } }
  function openMenu(anchor, html, onPick) {
    closeMenu(); menu = document.createElement('div'); menu.className = 'pe-menu'; menu.setAttribute('role', 'menu'); menu.innerHTML = html;
    document.body.appendChild(menu);
    var r = anchor.getBoundingClientRect(), w = menu.offsetWidth, h = menu.offsetHeight;
    /* below the anchor when it fits, above it when it doesn't */
    menu.style.top = (r.bottom + 6 + h > innerHeight && r.top - h - 6 > 0 ? scrollY + r.top - h - 6 : scrollY + r.bottom + 6) + 'px'; menu.style.left = Math.max(8, Math.min(scrollX + r.left + r.width / 2 - w / 2, scrollX + innerWidth - w - 8)) + 'px';
    var items = $$('[data-v]', menu); if (items[0]) { items[0].classList.add('is-hl'); items[0].focus(); }
    menu.addEventListener('click', function (e) { var b = e.target.closest('[data-v]'); if (!b) return; var v = b.dataset.v; closeMenu(); onPick(v); });
    menu.addEventListener('keydown', function (e) {
      var l = $$('[data-v]', menu), i = l.indexOf(document.activeElement);
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); var n = l[(i + (e.key === 'ArrowDown' ? 1 : -1) + l.length) % l.length]; l.forEach(function (x) { x.classList.remove('is-hl'); }); n.classList.add('is-hl'); n.focus(); }
      if (e.key === 'Escape') { closeMenu(); anchor.focus(); }
      if (e.key === 'Tab') closeMenu();
      /* typing narrows the block menu: "im" leaves Image */
      if (e.key.length === 1 && /\S/.test(e.key) && !e.metaKey && !e.ctrlKey && $('.ico', menu)) { e.preventDefault(); q += e.key.toLowerCase(); filter(); }
      if (e.key === 'Backspace' && q) { e.preventDefault(); q = q.slice(0, -1); filter(); }
    });
    var q = '', filter = function () {
      var shown = 0; $$('[data-v]', menu).forEach(function (b) { var on = b.textContent.toLowerCase().indexOf(q) >= 0; b.hidden = !on; b.classList.remove('is-hl'); if (on) shown++; });
      $$('p', menu).forEach(function (p) { var n = p.nextElementSibling, any = false; while (n && n.tagName !== 'P') { if (!n.hidden && n.dataset.v) any = true; n = n.nextElementSibling; } p.hidden = !any; });
      var first = $$('[data-v]', menu).find(function (b) { return !b.hidden; }); if (first) { first.classList.add('is-hl'); first.focus(); }
      var qq = $('.pe-q-line', menu); if (!qq) { qq = document.createElement('div'); qq.className = 'pe-q-line'; qq.setAttribute('role', 'status'); menu.insertBefore(qq, menu.firstChild); }
      qq.textContent = q ? (shown ? 'Blocks with “' + q + '”' : 'No block called “' + q + '”') : ''; qq.hidden = !q;
    };
  }
  var blockMenu = MENU.map(function (g) { return '<p>' + g[0] + '</p>' + g[1].map(function (m) { return '<button role="menuitem" data-v="' + m[0] + '"><span class="ico">' + I(m[3]) + '</span><b>' + m[1] + '</b><small>' + m[2] + '</small></button>'; }).join(''); }).join('');
  var list = function (items) { return items.map(function (x) { return '<button role="menuitem" data-v="' + esc(x[0]) + '"' + (x[2] ? ' class="' + x[2] + '"' : '') + '><b>' + esc(x[1]) + '</b></button>'; }).join(''); };
  document.addEventListener('click', function (e) { if (menu && !menu.contains(e.target) && !e.target.closest('[data-act=add],[data-act=more],[data-act=skadd],[data-act=specadd],#pePublish')) closeMenu(); });

  /* ---- pictures: the stock pictures, or one from the device (made smaller so the browser can keep it) ---- */
  var picker = document.createElement('dialog'); picker.className = 'pe-picker'; document.body.appendChild(picker);
  function pickPicture(title, done, many) {
    var pool = FAMA_FEATURED.pool(), chosen = [];
    picker.setAttribute('aria-labelledby', 'pePkT'); picker.innerHTML = '<form method="dialog"><div class="pe-pk-h"><h2 id="pePkT">' + esc(title) + '</h2><button class="x" value="cancel" aria-label="Close">' + I('x') + '</button></div>' +
      '<label class="pe-up">' + I('upload') + '<span><b>Upload from your device</b><small>JPG, PNG or WebP' + (many ? ', several at once' : '') + '</small></span><input type="file" accept="image/jpeg,image/png,image/webp"' + (many ? ' multiple' : '') + '></label>' +
      '<p class="pe-pk-k">Or pick from your pictures</p><div class="pe-pk-grid">' + pool.map(function (u, k) { return '<button type="button" class="pe-pk" data-u="' + esc(u) + '" aria-pressed="false" style="background-image:url(' + esc(u) + ')" aria-label="Picture ' + (k + 1) + '"></button>'; }).join('') + '</div>' +
      (many ? '<div class="pe-pk-foot"><button class="btn btn-2" value="cancel">Cancel</button><button class="btn" value="ok" id="pePkOk" disabled>Add pictures</button></div>' : '') + '</form>';
    var finish = function (list) { picker.close(); if (list && list.length) done(many ? list : list[0]); };
    picker.onclick = function (e) {
      var b = e.target.closest('.pe-pk'); if (!b) return;
      if (!many) return finish([b.dataset.u]);
      var on = b.getAttribute('aria-pressed') !== 'true'; b.setAttribute('aria-pressed', on);
      chosen = on ? chosen.concat(b.dataset.u) : chosen.filter(function (u) { return u !== b.dataset.u; });
      $$('.pe-pk', picker).forEach(function (x) { var n = chosen.indexOf(x.dataset.u); x.textContent = n >= 0 ? n + 1 : ''; });
      $('#pePkOk').disabled = !chosen.length; $('#pePkOk').textContent = chosen.length ? 'Add ' + chosen.length + (chosen.length === 1 ? ' picture' : ' pictures') : 'Add pictures';
    };
    picker.onclose = function () { if (many && picker.returnValue === 'ok' && chosen.length) done(chosen); };
    $('input[type=file]', picker).onchange = function (e) {
      var files = [].slice.call(e.target.files || []).slice(0, many ? 12 : 1);
      Promise.all(files.map(shrink)).then(function (urls) { urls = urls.filter(Boolean); picker.returnValue = ''; picker.close(); if (urls.length) done(many ? urls : urls[0]); });
    };
    picker.returnValue = ''; picker.showModal();
  }
  function shrink(file) {
    return new Promise(function (ok) {
      if (!/^image\//.test(file.type)) return ok(null);
      var img = new Image(), url = URL.createObjectURL(file);
      img.onload = function () { var k = Math.min(1, 1400 / Math.max(img.width, img.height)), c = document.createElement('canvas'); c.width = Math.round(img.width * k); c.height = Math.round(img.height * k);
        c.getContext('2d').drawImage(img, 0, 0, c.width, c.height); URL.revokeObjectURL(url); ok(c.toDataURL('image/jpeg', 0.8)); };
      img.onerror = function () { ok(null); }; img.src = url;
    });
  }

  /* ---- typing ---- */
  var get = function (o, path) { return path.split('.').reduce(function (a, k) { return a == null ? a : a[k]; }, o); };
  var set = function (o, path, v) { var k = path.split('.'), last = k.pop(), t = k.reduce(function (a, x) { return a[x]; }, o); t[last] = v; };
  page.addEventListener('input', function (e) {
    var el = e.target, v = el.isContentEditable ? el.textContent : el.value;
    if (el.dataset.p) { P[el.dataset.p] = v; save(); if (el.dataset.p === 'role') { var by = $('.pe-cover .by span:last-child'); if (by) by.innerHTML = '<b>Demo talent</b>' + (v ? ', ' + esc(v.toLowerCase()) : ''); var me = $('.pe-me .r'); if (me) me.textContent = v || 'Your role'; }
      if (el.dataset.p === 'client') { var k = $('.pe-cover .kick'); if (k) { var keep = k.querySelector('.ytag'); } } return; }
    var bw = el.closest('.pe-b'); if (!bw || !el.dataset.f) return;
    var i = +bw.dataset.i, b = P.blocks[i];
    set(b, el.dataset.f, v); save();
    if (b.t === 'results' && /\.0$/.test(el.dataset.f)) { var box = el.closest('.pe-item'), kk = rType(v); if ((box.classList.contains('up') ? 'change' : box.querySelector('.bar') ? 'percent' : 'number') !== kk) { var path = el.dataset.f; renderStory(at(i, '[data-f="' + path + '"]')); } else { var bi = box.querySelector('.bar i'); if (bi) bi.style.width = Math.max(0, Math.min(100, parseFloat(v) || 0)) + '%'; } }
    if (b.t === 'credits' && /\.n$/.test(el.dataset.f)) { var av = el.parentNode.querySelector('.av'); if (av) av.textContent = ini(v); }
    if (b.t === 'look' && /\.n$/.test(el.dataset.f)) { var dk = +el.dataset.f.split('.')[1], dot = bw.querySelector('[data-dot="' + dk + '"]'); if (dot) dot.setAttribute('aria-label', (dk + 1) + '. ' + (v || 'piece') + '. Arrow keys move it'); }
    if (b.t === 'text' && v === '/') { el.textContent = ''; b.v = ''; openMenu(el, blockMenu, function (t) { if (t === 'text') return el.focus(); P.blocks[i] = fresh(t); save(); renderStory(at(i)); }); }
  });
  page.addEventListener('change', function (e) { var el = e.target; if (el.matches('.pe-url input')) { var bw = el.closest('.pe-b'); P.blocks[+bw.dataset.i].url = el.value.trim(); save(); renderStory(at(+bw.dataset.i, 'input')); } });
  /* paste as plain text, so nothing but words gets in */
  page.addEventListener('paste', function (e) {
    var el = e.target; if (!el.isContentEditable) return; e.preventDefault();
    var txt = (e.clipboardData || window.clipboardData).getData('text/plain').replace(/\r/g, '');
    var paras = txt.split(/\n\s*\n+/).map(function (x) { return x.replace(/\s*\n\s*/g, ' ').trim(); }).filter(Boolean);
    var bw = el.closest('.pe-b'), b = bw && P.blocks[+bw.dataset.i];
    /* several paragraphs pasted into a text block: the first goes here, each of the others becomes its own text block */
    if (paras.length > 1 && b && b.t === 'text' && el.dataset.f === 'v') {
      var i = +bw.dataset.i; document.execCommand('insertText', false, paras[0]); b.v = el.textContent;
      paras.slice(1).forEach(function (v, k) { P.blocks.splice(i + 1 + k, 0, { t: 'text', v: v }); });
      save(); renderStory(at(i + paras.length - 1)); toast(paras.length + ' paragraphs added'); return;
    }
    document.execCommand('insertText', false, paras.join(' '));
  });
  page.addEventListener('keydown', function (e) {
    var el = e.target;
    if (el.isContentEditable && e.key === 'Enter' && el.dataset.p === 'title') { e.preventDefault(); var first = $('#story [contenteditable]'); if (first) first.focus(); return; }
    if (el.isContentEditable && e.key === 'Enter') {
      var bw = el.closest('.pe-b'); if (!bw) { e.preventDefault(); return; }
      var i = +bw.dataset.i, b = P.blocks[i]; e.preventDefault();
      if (b.t === 'text' || b.t === 'heading') { P.blocks.splice(i + 1, 0, fresh('text')); save(); renderStory(at(i + 1)); }
      return;
    }
    if (el.isContentEditable && e.key === 'Backspace' && !el.textContent) {
      var bw2 = el.closest('.pe-b'); if (!bw2) return; var j = +bw2.dataset.i, b2 = P.blocks[j];
      if ((b2.t === 'text' || b2.t === 'heading') && el.dataset.f === 'v' && P.blocks.length > 1) {
        e.preventDefault(); var gone = P.blocks.splice(j, 1)[0]; save(); renderStory();
        toast(KIND[gone.t] + ' removed', function () { P.blocks.splice(j, 0, gone); save(); renderStory(at(j)); });
        var prev = $$('#story [contenteditable]').filter(function (x) { return +x.closest('.pe-b').dataset.i < j; }).pop(); if (prev) { prev.focus(); placeEnd(prev); }
      }
    }
    /* a look's pin moves with the arrow keys */
    var d = el.closest && el.closest('.dot[data-dot]');
    if (d && /^Arrow/.test(e.key)) {
      e.preventDefault(); var b3 = P.blocks[+d.closest('.pe-b').dataset.i], x = b3.items[+d.dataset.dot], st = e.shiftKey ? 5 : 1;
      x.x = Math.max(3, Math.min(97, (x.x != null ? x.x : 50) + (e.key === 'ArrowLeft' ? -st : e.key === 'ArrowRight' ? st : 0)));
      x.y = Math.max(3, Math.min(97, (x.y != null ? x.y : 50) + (e.key === 'ArrowUp' ? -st : e.key === 'ArrowDown' ? st : 0)));
      d.style.left = x.x + '%'; d.style.top = x.y + '%'; save();
    }
  });

  /* ---- a look: click the photo to add a piece, drag a pin onto its piece ---- */
  page.addEventListener('pointerdown', function (e) {
    var fig = e.target.closest('[data-look]'); if (!fig || e.target.closest('.pe-pic')) return;
    var i = +fig.closest('.pe-b').dataset.i, b = P.blocks[i], r = fig.getBoundingClientRect();
    var pos = function (ev) { return [Math.round(Math.max(3, Math.min(97, (ev.clientX - r.left) / r.width * 100))), Math.round(Math.max(3, Math.min(97, (ev.clientY - r.top) / r.height * 100)))]; };
    var d = e.target.closest('.dot');
    if (!d) {
      var sx = e.clientX, sy = e.clientY, t0 = Date.now();
      var tap = function (ev) { fig.removeEventListener('pointerup', tap); fig.removeEventListener('pointercancel', no);
        if (Math.abs(ev.clientX - sx) > 6 || Math.abs(ev.clientY - sy) > 6 || Date.now() - t0 > 600) return;
        if (b.items.length >= 8) return toast('A look holds up to 8 pieces.'); r = fig.getBoundingClientRect(); var p = pos(ev); b.items.push({ n: '', d: '', x: p[0], y: p[1] }); save(); renderStory(at(i, '[data-f="items.' + (b.items.length - 1) + '.n"]')); };
      var no = function () { fig.removeEventListener('pointerup', tap); fig.removeEventListener('pointercancel', no); };
      fig.addEventListener('pointerup', tap); fig.addEventListener('pointercancel', no); return;
    }
    e.preventDefault(); try { d.setPointerCapture(e.pointerId); } catch (er) {} d.classList.add('pe-drag');
    var x = b.items[+d.dataset.dot];
    var move = function (ev) { var p = pos(ev); x.x = p[0]; x.y = p[1]; d.style.left = p[0] + '%'; d.style.top = p[1] + '%'; };
    var up = function () { d.classList.remove('pe-drag'); d.removeEventListener('pointermove', move); d.removeEventListener('pointerup', up); save(); };
    d.addEventListener('pointermove', move); d.addEventListener('pointerup', up);
  });
  /* a block drags by its grip: a purple line shows where it will land */
  page.addEventListener('pointerdown', function (e) {
    var g = e.target.closest('[data-grip]'); if (!g) return;
    var from = +g.closest('.pe-b').dataset.i, blocks = $$('#story > .pe-b'), to = from, line = document.createElement('div');
    line.className = 'pe-drop-line'; $('#story').appendChild(line); e.preventDefault(); try { g.setPointerCapture(e.pointerId); } catch (er) {}
    blocks[from].classList.add('pe-dragging');
    var move = function (ev) {
      to = blocks.length; for (var k = 0; k < blocks.length; k++) { var r = blocks[k].getBoundingClientRect(); if (ev.clientY < r.top + r.height / 2) { to = k; break; } }
      var sr = $('#story').getBoundingClientRect(), ref = blocks[Math.min(to, blocks.length - 1)].getBoundingClientRect();
      line.style.top = ((to < blocks.length ? ref.top : ref.bottom) - sr.top - 2) + 'px';
      if (ev.clientY < 90) scrollBy(0, -12); else if (ev.clientY > innerHeight - 60) scrollBy(0, 12);
    };
    var up = function () {
      g.removeEventListener('pointermove', move); g.removeEventListener('pointerup', up); line.remove(); blocks[from].classList.remove('pe-dragging');
      var j = to > from ? to - 1 : to; if (j !== from && j >= 0) moveBlock(from, j);
    };
    g.addEventListener('pointermove', move); g.addEventListener('pointerup', up);
  });
  page.addEventListener('pointerdown', function (e) {
    var box = e.target.closest('.pe-b .ba-box'); if (!box || e.target.closest('[contenteditable],.pe-pic')) return;
    var set = function (ev) { var r = box.getBoundingClientRect(); box.style.setProperty('--p', Math.max(0, Math.min(100, (ev.clientX - r.left) / r.width * 100)) + '%'); };
    set(e); try { box.setPointerCapture(e.pointerId); } catch (er) {}
    var up = function () { box.removeEventListener('pointermove', set); box.removeEventListener('pointerup', up); };
    box.addEventListener('pointermove', set); box.addEventListener('pointerup', up);
  });
  /* hovering a piece lights its pin, and the other way round */
  page.addEventListener('pointerover', function (e) {
    var t = e.target.closest('.pe-look [data-tag], .pe-look .dot'); if (!t) return; var lk = t.closest('.pe-look'), k = t.dataset.tag ? +t.dataset.tag - 1 : +t.dataset.dot;
    $$('.dot', lk).forEach(function (d) { d.classList.toggle('on', +d.dataset.dot === k); }); $$('li[data-tag]', lk).forEach(function (li) { li.classList.toggle('on', +li.dataset.tag - 1 === k); });
  });

  /* ---- actions ---- */
  function moveBlock(i, j) { var b = P.blocks.splice(i, 1)[0]; P.blocks.splice(j, 0, b); save(); renderStory(at(j, '[data-act=' + (j < i ? 'up' : 'down') + ']')); }
  document.addEventListener('click', function (e) {
    var a = e.target.closest('[data-act]'); if (!a) return;
    var act = a.dataset.act, bw = a.closest('.pe-b'), i = bw ? +bw.dataset.i : -1, b = i >= 0 ? P.blocks[i] : null, k = +a.dataset.k;
    if (act === 'settings') return setPanel(true);
    if (act === 'close') return setPanel(false);
    if (act === 'nda') { P.nda = !P.nda; save(); renderPanel(); render(); $('[data-act=nda]', panel).focus(); return; }
    if (act === 'add') { var after = +a.dataset.at; return openMenu(a, blockMenu, function (t) { P.blocks.splice(after + 1, 0, fresh(t)); save(); renderStory(at(after + 1)); }); }
    if (act === 'up' && i > 0) return moveBlock(i, i - 1);
    if (act === 'down' && i < P.blocks.length - 1) return moveBlock(i, i + 1);
    if (act === 'more') {
      var words = ['text', 'heading', 'quote'].indexOf(b.t) >= 0;
      var opts = [['below', 'Add a block below']].concat(words ? ['text', 'heading', 'quote'].filter(function (t) { return t !== b.t; }).map(function (t) { return ['to-' + t, 'Turn into ' + KIND[t].toLowerCase()]; }) : [])
        .concat([['dup', 'Duplicate'], ['del', 'Delete', 'del']]);
      return openMenu(a, list(opts), function (v) {
        if (v === 'below') return openMenu(a, blockMenu, function (t) { P.blocks.splice(i + 1, 0, fresh(t)); save(); renderStory(at(i + 1)); });
        if (v.indexOf('to-') === 0) { var t = v.slice(3), keep = b.v || ''; P.blocks[i] = fresh(t); P.blocks[i].v = keep; save(); renderStory(at(i)); return; }
        if (v === 'dup') { P.blocks.splice(i + 1, 0, clone(b)); save(); renderStory(at(i + 1, '[data-act=more]')); return; }
        var old = P.blocks.splice(i, 1)[0]; if (!P.blocks.length) P.blocks.push(fresh('text')); save();
        /* focus lands on the block that took its place, not on the page */
        renderStory(at(Math.min(i, P.blocks.length - 1), '[data-act=more]'));
        toast(KIND[old.t] + ' deleted', function () { P.blocks.splice(i, 0, old); save(); renderStory(at(i, '[data-act=more]')); });
      });
    }
    if (act === 'cover') return pickPicture(P.cover ? 'Change the cover' : 'Add a cover', function (u) { P.cover = true; P.coverSrc = u; save(); render('[data-act=cover]'); });
    if (act === 'nocover') { var was = P.coverSrc; P.cover = false; save(); render('[data-act=cover]'); toast('Cover removed', function () { P.cover = true; P.coverSrc = was; save(); render(); }); return; }
    if (act === 'skadd') { var left = MY.filter(function (s) { return P.skills.indexOf(s.name) < 0; }); if (!left.length) return toast('All your skills are on it.'); return openMenu(a, list(left.map(function (s) { return [s.name, s.name]; })), function (v) { P.skills.push(v); save(); render('[data-act=skadd]'); }); }
    if (act === 'skdel') { P.skills = P.skills.filter(function (s) { return s !== a.dataset.v; }); var keep = MY.filter(function (s) { return P.skills.indexOf(s.name) >= 0; }).reduce(function (o, s) { return o.concat(s.specs); }, []); P.specs = P.specs.filter(function (x) { return keep.indexOf(x) >= 0; }); save(); render('[data-act=skadd]'); return; }
    if (act === 'specadd') { var sp = MY.filter(function (s) { return P.skills.indexOf(s.name) >= 0; }).reduce(function (o, s) { return o.concat(s.specs); }, []).filter(function (x, n, arr) { return arr.indexOf(x) === n && P.specs.indexOf(x) < 0; }); if (!sp.length) return toast('All the specialities of these skills are on it.'); return openMenu(a, list(sp.map(function (x) { return [x, x]; })), function (v) { P.specs.push(v); save(); render('[data-act=specadd]'); }); }
    if (act === 'specdel') { P.specs = P.specs.filter(function (s) { return s !== a.dataset.v; }); save(); render('[data-act=specadd]'); return; }
    if (!b) return;
    if (act === 'img') return pickPicture(b.has ? 'Replace the image' : 'Add an image', function (u) { b.has = true; b.src = u; save(); renderStory(at(i, '[data-f=cap]')); });
    if (act === 'look') return pickPicture(b.has ? 'Replace the look’s photo' : 'The look’s photo', function (u) { b.has = true; b.src = u; save(); renderStory(at(i, '[data-f=title]')); });
    if (act === 'ba') return pickPicture('The before picture', function (u1) { pickPicture('The after picture', function (u2) { b.has = true; b.srcB = u1; b.srcA = u2; save(); renderStory(at(i, '[data-f=cap]')); }); });
    if (act === 'baB') return pickPicture('Replace the before', function (u) { b.srcB = u; save(); renderStory(at(i, '[data-act=baB]')); });
    if (act === 'baA') return pickPicture('Replace the after', function (u) { b.srcA = u; save(); renderStory(at(i, '[data-act=baA]')); });
    if (act === 'gadd') return pickPicture('Add pictures', function (us) { b.srcs = (b.srcs || []).concat(us).slice(0, 24); b.caps = b.caps || []; b.n = b.srcs.length; save(); renderStory(at(i, '[data-act=gadd]')); }, true);
    if (act === 'gimg') return pickPicture('Replace picture ' + (k + 1), function (u) { b.srcs[k] = u; save(); renderStory(at(i, '[data-act=gimg][data-k="' + k + '"]')); });
    if (act === 'gl' || act === 'gr') { var j = act === 'gl' ? k - 1 : k + 1; [b.srcs, b.caps].forEach(function (arr) { var t = arr[k]; arr[k] = arr[j]; arr[j] = t; }); save(); renderStory(at(i, '[data-act=' + act + '][data-k="' + j + '"]') ); return; }
    if (act === 'gdel') { var os = b.srcs.splice(k, 1)[0], oc = (b.caps || []).splice(k, 1)[0]; b.n = b.srcs.length; save(); renderStory(at(i, '[data-act=gadd]')); toast('Picture removed', function () { b.srcs.splice(k, 0, os); b.caps.splice(k, 0, oc); b.n = b.srcs.length; save(); renderStory(); }); return; }
    if (act === 'itadd') { if (b.items.length >= 8) return; b.items.push({ n: '', d: '', x: 50, y: 50 }); save(); renderStory(at(i, '[data-f="items.' + (b.items.length - 1) + '.n"]')); return; }
    if (act === 'itdel') { var oi = b.items.splice(k, 1)[0]; save(); renderStory(at(i, '[data-act=itadd]')); toast('Piece removed', function () { b.items.splice(k, 0, oi); save(); renderStory(); }); return; }
    if (act === 'itup') { var t2 = b.items[k]; b.items[k] = b.items[k - 1]; b.items[k - 1] = t2; save(); renderStory(at(i, '[data-f="items.' + (k - 1) + '.n"]')); return; }
    if (act === 'radd') { b.items.push(['', '']); save(); renderStory(at(i, '[data-f="items.' + (b.items.length - 1) + '.0"]')); return; }
    if (act === 'rdel') { var or = b.items.splice(k, 1)[0]; save(); renderStory(at(i, '[data-act=radd]')); toast('Number removed', function () { b.items.splice(k, 0, or); save(); renderStory(); }); return; }
    if (act === 'cadd') { b.items.push({ n: '', r: '', st: 'new' }); save(); renderStory(at(i, '[data-f="items.' + (b.items.length - 1) + '.n"]')); return; }
    if (act === 'cdel') { var oc2 = b.items.splice(k, 1)[0]; save(); renderStory(at(i, '[data-act=cadd]')); toast((oc2.n || 'Person') + ' removed from the credits', function () { b.items.splice(k, 0, oc2); save(); renderStory(); }); return; }
  });
  page.addEventListener('focusin', function (e) { var bw = e.target.closest('.pe-b'); $$('.pe-b.is-on').forEach(function (x) { if (x !== bw) x.classList.remove('is-on'); }); if (bw) bw.classList.add('is-on'); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !panel.hidden) setPanel(false);
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 's') { e.preventDefault(); save(); }
    /* Cmd/Ctrl+Z outside a text field undoes the last change to the project (in a field, typing keeps its own undo) */
    var typing = e.target.isContentEditable || /^(INPUT|TEXTAREA)$/.test(e.target.tagName);
    if ((e.metaKey || e.ctrlKey) && !e.shiftKey && e.key.toLowerCase() === 'z' && !typing && panel.hidden) {
      e.preventDefault(); clearTimeout(saveT);
      if (hist.length < 2) { toast('Nothing to undo'); return; }
      hist.pop(); var prev = JSON.parse(hist[hist.length - 1]); Object.keys(P).forEach(function (k) { delete P[k]; }); Object.assign(P, prev);
      store[P.id] = P; try { localStorage.setItem(KEY, JSON.stringify(store)); } catch (er) {} render(); toast('Undone');
    }
  });
  scrim.addEventListener('click', function () { setPanel(false); });
  panel.addEventListener('keydown', function (e) {
    if (e.key !== 'Tab') return; var f = $$('button, input, [href]', panel).filter(function (x) { return !x.disabled; }), a = f[0], z = f[f.length - 1];
    if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); } else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
  });
  panel.addEventListener('input', function (e) { if (e.target.dataset.p) { P[e.target.dataset.p] = e.target.value; save(); render(); } });
  panel.addEventListener('click', function (e) { var a = e.target.closest('[data-act]'); if (a && a.dataset.act === 'nda') e.stopPropagation(), (P.nda = !P.nda), save(), renderPanel(), render(), $('[data-act=nda]', panel).focus(); }, true);

  /* publish: a project needs a name, a skill and something to look at */
  $('#pePublish').onclick = function () {
    /* everything that's missing, at once; each line takes you to its field */
    var miss = [];
    if (!(P.title || '').trim()) miss.push(['[data-p=title]', 'Name the project']);
    if (!P.skills.length) miss.push(['[data-act=skadd]', 'Pick at least one skill']);
    if (!(P.cover || P.blocks.some(function (b) { return (b.t === 'gallery' && b.n) || (b.t === 'image' && b.has) || (b.t === 'video' && b.url) || (b.t === 'beforeafter' && b.has) || (b.t === 'look' && b.has) || (b.t === 'embed' && b.url); })))
      miss.push(['[data-act=cover]', 'Add a cover, or some pictures or a video']);
    if (miss.length) {
      return openMenu(this, '<p>Before it goes on your profile</p>' + miss.map(function (m) { return '<button role="menuitem" data-v="' + esc(m[0]) + '" class="pe-need"><b>' + esc(m[1]) + '</b></button>'; }).join(''),
        function (sel) { var el = $(sel); if (el) { el.scrollIntoView({ block: 'center', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }); el.focus(); } });
    }
    var first = P.status !== 'published'; P.status = 'published';
    var asked = P.blocks.filter(function (b) { return b.t === 'credits'; }).reduce(function (o, b) { return o.concat(b.items); }, []).filter(function (x) { return x.n && x.st === 'new'; });
    asked.forEach(function (x) { x.st = 'awaiting'; }); save(); renderBar(); renderStory();
    toast(first ? (asked.length ? 'Published. ' + (asked.length === 1 ? asked[0].n + ' is' : asked.length + ' people are') + ' asked to confirm their credit.' : 'Published to your profile.') : 'Changes are live.',
      function () { location.href = F.href('project.html?p=' + P.id); }, 'See it');
  };

  render(pid ? null : '[data-p=title]');
  if (pid) save(); /* a new, untouched project isn't kept: it is saved on its first edit */
})();
