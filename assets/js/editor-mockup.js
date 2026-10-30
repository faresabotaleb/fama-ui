/* Project editor, WYSIWYG mockup (24 Oct 2026). Runs on _mockup-editor.html, a copy of the project page:
   the editor is the published page with an editing layer. ?state= shows one moment for review:
   (none) editing a text block · menu: the block menu open · settings: the settings panel · media: a picture's tools */
(function () {
  var page = document.getElementById('page'); if (!page || !page.querySelector('.cover')) return;
  var Q = new URLSearchParams(location.search), STATE = Q.get('state') || '';
  var I = {
    back: '<svg viewBox="0 0 24 24"><path d="m15 18-6-6 6-6"/></svg>',
    grip: '<svg viewBox="0 0 24 24"><circle cx="9" cy="6" r="1"/><circle cx="15" cy="6" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="9" cy="18" r="1"/><circle cx="15" cy="18" r="1"/></svg>',
    up: '<svg viewBox="0 0 24 24"><path d="m18 15-6-6-6 6"/></svg>', down: '<svg viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></svg>',
    more: '<svg viewBox="0 0 24 24"><circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/></svg>',
    plus: '<svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>', x: '<svg viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></svg>',
    img: '<svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3-3-9 9"/></svg>',
    set: '<svg viewBox="0 0 24 24"><path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M2 14h4M10 8h4M18 16h4"/></svg>',
    eye: '<svg viewBox="0 0 24 24"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></svg>',
    text: '<svg viewBox="0 0 24 24"><path d="M4 7V4h16v3M9 20h6M12 4v16"/></svg>', head: '<svg viewBox="0 0 24 24"><path d="M6 4v16M18 4v16M6 12h12"/></svg>',
    quote: '<svg viewBox="0 0 24 24"><path d="M7 7h4v6H5V9a2 2 0 0 1 2-2ZM15 7h4v6h-6V9a2 2 0 0 1 2-2Z"/></svg>',
    grid: '<svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>',
    vid: '<svg viewBox="0 0 24 24"><path d="m22 8-6 4 6 4V8Z"/><rect x="2" y="6" width="14" height="12" rx="2"/></svg>',
    ba: '<svg viewBox="0 0 24 24"><path d="M12 3v18"/><rect x="3" y="5" width="18" height="14" rx="2"/></svg>',
    tag: '<svg viewBox="0 0 24 24"><path d="M12 2 2 12l10 10 10-10V2H12Z"/><circle cx="16.5" cy="7.5" r="1.5"/></svg>',
    num: '<svg viewBox="0 0 24 24"><path d="M3 3v18h18"/><path d="m7 14 4-4 4 4 5-5"/></svg>',
    link: '<svg viewBox="0 0 24 24"><path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1"/><path d="M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1"/></svg>',
    ppl: '<svg viewBox="0 0 24 24"><circle cx="9" cy="7" r="4"/><path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2M16 3a4 4 0 0 1 0 8M21 21v-2a4 4 0 0 0-3-3.9"/></svg>'
  };
  document.documentElement.classList.add('emk');

  /* review strip: the moments of the mockup */
  var states = [['', 'Editing a text block'], ['menu', 'Adding a block'], ['media', 'A picture'], ['gallery', 'The gallery'], ['look', 'A look'], ['results', 'Results and credits'], ['settings', 'Settings']];
  var rv = document.createElement('div'); rv.className = 'emk-review';
  rv.innerHTML = '<span>Mockup · <b>WYSIWYG project editor</b> · not part of the design</span><span>' + states.map(function (s) {
    return '<a href="?state=' + s[0] + '"' + (s[0] === STATE ? ' aria-current="true"' : '') + '>' + s[1] + '</a>'; }).join(' · ') + '</span>';
  document.body.insertBefore(rv, document.body.firstChild);

  /* editor bar */
  var bar = document.createElement('div'); bar.className = 'emk-bar';
  bar.innerHTML = '<div class="in"><a class="back" href="projects.html">' + I.back + 'Projects</a>' +
    '<span class="saved"><i></i>Saved just now</span><span class="pill">Draft</span>' +
    '<button class="btn btn-2" type="button" data-emk="settings">' + I.set + 'Settings</button>' +
    '<a class="btn btn-2" href="project.html?p=desert-light&preview=1">' + I.eye + 'Preview</a>' +
    '<button class="btn" type="button">Publish</button></div>';
  page.parentNode.insertBefore(bar, page);

  var edit = function (el, ph) { if (!el) return; el.setAttribute('contenteditable', 'true'); el.setAttribute('data-emk-edit', ''); el.setAttribute('data-ph', ph); el.setAttribute('spellcheck', 'true'); };

  /* cover: title types in place; the line above it is made from Client, Skills and Date */
  var cover = page.querySelector('.cover');
  var cb = document.createElement('div'); cb.className = 'emk-cover';
  cb.innerHTML = '<button class="btn" type="button">' + I.img + 'Change cover</button>';
  cover.appendChild(cb);
  edit(cover.querySelector('h1'), 'Name the project');
  var kick = cover.querySelector('.kick'); if (kick) kick.insertAdjacentHTML('beforeend', '<span class="emk-auto">from Client, Skills and Date</span>');

  /* colophon: Client and Role in place, Skills as chips, the live link as a field */
  page.querySelectorAll('.colo > div').forEach(function (d) {
    var k = d.querySelector('dt').textContent.trim(), dd = d.querySelector('dd');
    if (k === 'Client') edit(dd, 'Add a client');
    if (k === 'Role') edit(dd, 'What did you do on it?');
    if (k === 'Skills') dd.innerHTML = dd.textContent.split(/\s*·\s*|\n/).filter(Boolean).slice(0, 2).map(function (s) { return '<span class="emk-chip">' + s + I.x + '</span>'; }).join('') + '<span class="emk-chip add">' + I.plus + 'Skill</span>';
    if (k === 'See it live') edit(dd.querySelector('a') || dd, 'Paste a link');
  });

  /* blocks: each part of the story gets its tools; text types in place */
  var KIND = [['lead', 'Opening'], ['ch-h', 'Heading'], ['txt', 'Text'], ['full', 'Image'], ['spread', 'Image + text'], ['pair', 'Two images'], ['look', 'Look'], ['cases', 'Gallery'], ['video', 'Video'], ['embeds', 'Embed'], ['res', 'Results'], ['cred', 'Credits'], ['quote', 'Quote'], ['ba', 'Before / After']];
  var blocks = [];
  var story = page.querySelector('.story');
  story.querySelectorAll(':scope > .lead, :scope > .ch > *, :scope > figure, :scope > blockquote').forEach(function (b) {
    var kind = (KIND.find(function (k) { return b.classList.contains(k[0]); }) || [0, 'Block'])[1];
    b.classList.add('emk-b'); blocks.push(b);
    b.insertAdjacentHTML('afterbegin', '<div class="emk-tools" role="toolbar" aria-label="' + kind + ' block"><span class="kind">' + kind + '</span><button class="grip" aria-label="Drag to move">' + I.grip + '</button><button aria-label="Move up">' + I.up + '</button><button aria-label="Move down">' + I.down + '</button><button aria-label="More">' + I.more + '</button></div>');
    if (b.matches('.lead')) { b.querySelectorAll('.w').forEach(function (w) { w.replaceWith(document.createTextNode(w.textContent)); }); edit(b, 'Open with one line about the project'); }
    if (b.matches('.ch-h')) edit(b.querySelector('h2'), 'Heading');
    if (b.matches('.txt')) edit(b, 'Write, or type / to add a block');
    b.querySelectorAll('figcaption span, figcaption b').forEach(function (c) { edit(c, 'Add a caption'); });
    /* the scrolling gallery: on the page it is pinned and moves sideways, which can't be edited in place.
       Here it becomes a strip in the same order, each picture with its caption and its own tools */
    if (b.matches('.cases')) { galleryEditor(b); }
    else if (b.matches('.look')) { lookEditor(b); }
    else if (b.matches('.quote, .spread, .pair, .ba, .video, .embeds, .res, .cred')) { partEditor(b); }
    else if (b.querySelector('.ph-img, .ba-box, .look-img')) b.insertAdjacentHTML('beforeend', '<button class="emk-media" type="button">' + I.img + (b.matches('.cases, .pair') ? 'Edit pictures' : 'Replace') + '</button>');
    var ins = document.createElement('div'); ins.className = 'emk-ins';
    ins.innerHTML = '<button type="button" aria-label="Add a block here">' + I.plus + '</button>';
    b.after(ins);
  });

  /* the look: each piece is a numbered pin on the photo and a line in the list. Pins drag to their piece, a click on the
     photo adds one, the name and details type in place, and the numbers follow the order of the list */
  function lookEditor(b) {
    var fig = b.querySelector('.look-img'), list = b.querySelector('.look-list'), ol = list.querySelector('ol'), lab = list.querySelector('small');
    var name = (lab.textContent.split('·')[0] || '').trim();
    lab.outerHTML = '<div class="emk-look-h"><span class="emk-look-name" data-emk-edit contenteditable="true" data-ph="Name the look">' + name.charAt(0) + name.slice(1).toLowerCase() + '</span><span>What’s in it</span></div>';
    fig.insertAdjacentHTML('beforeend', '<button class="emk-media emk-look-rep" type="button">' + I.img + 'Replace photo</button><p class="emk-look-tip">Click the photo to add a piece · drag a number onto its piece</p>');
    var renum = function () {
      ol.querySelectorAll('li').forEach(function (li, i) { li.dataset.tag = i + 1; li.style.counterSet = 't ' + (i + 1); });
      fig.querySelectorAll('.dot').forEach(function (d, i) { d.dataset.tag = i + 1; d.textContent = i + 1; d.setAttribute('aria-label', (i + 1) + '. ' + ((ol.children[i] || {}).querySelector ? ol.children[i].querySelector('b').textContent : 'piece')); });
    };
    var row = function (li) {
      li.querySelector('b').setAttribute('data-emk-edit', ''); li.querySelector('b').contentEditable = 'true'; li.querySelector('b').dataset.ph = 'Piece, e.g. Overshirt';
      var sp = li.querySelector('span'); sp.setAttribute('data-emk-edit', ''); sp.contentEditable = 'true'; sp.dataset.ph = 'Brand · material, colour';
      li.insertAdjacentHTML('beforeend', '<span class="emk-li-acts"><button type="button" class="g" aria-label="Drag to reorder">' + I.grip + '</button><button type="button" class="rm" aria-label="Remove this piece">' + I.x + '</button></span>');
    };
    ol.querySelectorAll('li').forEach(row);
    ol.insertAdjacentHTML('afterend', '<button type="button" class="emk-look-add">' + I.plus + 'Add a piece<small>or click on the photo</small></button>');
    var add = function (x, y) {
      var n = ol.children.length; if (n >= 8) return;
      var li = document.createElement('li'); li.innerHTML = '<b></b><span></span>'; ol.appendChild(li); row(li);
      var d = document.createElement('button'); d.type = 'button'; d.className = 'dot'; d.style.left = x + '%'; d.style.top = y + '%'; fig.appendChild(d);
      renum(); li.querySelector('b').focus();
      fig.querySelectorAll('.dot').forEach(function (o) { o.classList.toggle('on', o === d); });
    };
    list.querySelector('.emk-look-add').onclick = function () { add(50, 50); };
    list.addEventListener('click', function (e) {
      var rm = e.target.closest('.rm'); if (!rm) return;
      var li = rm.closest('li'), i = [].indexOf.call(ol.children, li); li.remove(); var d = fig.querySelectorAll('.dot')[i]; if (d) d.remove(); renum();
    });
    /* drag a pin; a click without a drag on the photo adds a piece there */
    var drag = null;
    fig.addEventListener('pointerdown', function (e) {
      if (e.target.closest('.emk-look-rep')) return;
      var d = e.target.closest('.dot'), r = fig.getBoundingClientRect();
      var at = function (ev) { return [Math.max(3, Math.min(97, (ev.clientX - r.left) / r.width * 100)), Math.max(3, Math.min(97, (ev.clientY - r.top) / r.height * 100))]; };
      if (!d) { var p = at(e); add(Math.round(p[0]), Math.round(p[1])); return; }
      e.preventDefault(); drag = d; d.setPointerCapture(e.pointerId); d.classList.add('emk-drag');
      var move = function (ev) { var p = at(ev); d.style.left = p[0] + '%'; d.style.top = p[1] + '%'; };
      var up = function () { d.classList.remove('emk-drag'); d.removeEventListener('pointermove', move); d.removeEventListener('pointerup', up); drag = null; };
      d.addEventListener('pointermove', move); d.addEventListener('pointerup', up);
    });
    /* arrow keys move a focused pin, for keyboards */
    fig.addEventListener('keydown', function (e) {
      var d = e.target.closest('.dot'); if (!d || !/^Arrow/.test(e.key)) return; e.preventDefault();
      var st = e.shiftKey ? 5 : 1, x = parseFloat(d.style.left), y = parseFloat(d.style.top);
      if (e.key === 'ArrowLeft') x -= st; if (e.key === 'ArrowRight') x += st; if (e.key === 'ArrowUp') y -= st; if (e.key === 'ArrowDown') y += st;
      d.style.left = Math.max(3, Math.min(97, x)) + '%'; d.style.top = Math.max(3, Math.min(97, y)) + '%';
    });
    renum();
  }

  /* the other parts: every word types where it shows; each picture has its own Replace; links show as a field;
     lists (numbers, people, posts) get Add and Remove in place */
  function partEditor(b) {
    var pin = function (el, label) { if (!el || el.querySelector(':scope > .emk-media')) return; if (getComputedStyle(el).position === 'static') el.style.position = 'relative';
      el.insertAdjacentHTML('beforeend', '<button class="emk-media" type="button">' + I.img + label + '</button>'); };
    var rm = function (el, what) { el.classList.add('emk-item'); el.insertAdjacentHTML('beforeend', '<button type="button" class="emk-x" aria-label="Remove ' + what + '">' + I.x + '</button>'); };
    var drop = function () { var m = b.querySelector(':scope > .emk-media'); if (m) m.remove(); };
    if (b.matches('.quote')) {
      var t = [].find.call(b.childNodes, function (n) { return n.nodeType === 3 && n.textContent.trim(); });
      if (t) { var sp = document.createElement('span'); sp.textContent = t.textContent.trim(); t.replaceWith(sp); edit(sp, 'What was said'); }
      edit(b.querySelector('cite'), 'Who said it, and their role');
    }
    if (b.matches('.spread')) { drop(); edit(b.querySelector('.side .txt'), 'Write about this picture'); pin(b.querySelector('figure'), 'Replace'); }
    if (b.matches('.pair')) { drop(); b.querySelectorAll(':scope > figure').forEach(function (f, i) { pin(f, 'Replace'); }); }
    if (b.matches('.ba')) {
      drop();
      b.querySelectorAll('.ba-tag').forEach(function (tg) { edit(tg, tg.classList.contains('l') ? 'Before' : 'After'); });
      var box = b.querySelector('.ba-box');
      box.insertAdjacentHTML('beforeend', '<span class="emk-ba-acts"><button type="button" class="emk-media-s">' + I.img + 'Before</button><button type="button" class="emk-media-s">' + I.img + 'After</button></span>');
      var cap = b.querySelector('figcaption'); if (cap) { var bb = cap.querySelector('b'); if (bb) bb.remove(); }
      b.insertAdjacentHTML('beforeend', '<p class="emk-note">The title above the caption comes from the two labels. Drag the line to check the match.</p>');
    }
    if (b.matches('.video')) {
      drop();
      b.querySelector('figcaption').insertAdjacentHTML('beforebegin', '<label class="emk-url">' + I.vid + '<input type="url" dir="ltr" value="https://vimeo.com/fama-desert-light" aria-label="Video link"><small>Vimeo · 1:42, read from the link</small></label>');
      var fb = b.querySelector('figcaption b'); if (fb) { fb.setAttribute('data-emk-edit', ''); fb.contentEditable = 'true'; fb.dataset.ph = 'Title'; }
    }
    if (b.matches('.embeds')) {
      drop(); edit(b.querySelector('.emb-h small'), 'A label, e.g. Also posted');
      /* the heading next to the posts is plain text after the label: wrap it so it types in place */
      var h = b.querySelector('.emb-h'), ht = h && [].find.call(h.childNodes, function (n) { return n.nodeType === 3 && n.textContent.trim(); });
      if (ht) { var hsp = document.createElement('span'); hsp.className = 'emk-emb-t'; hsp.textContent = ht.textContent.trim(); ht.replaceWith(hsp); edit(hsp, 'A line about where it went out'); }
      b.querySelectorAll('figure.emb').forEach(function (f) {
        var a = f.querySelector('.emb-card'); if (a) a.addEventListener('click', function (e) { e.preventDefault(); });
        var link = (a && a.getAttribute('href')) || '';
        f.insertAdjacentHTML('beforeend', '<label class="emk-url sm">' + I.link + '<input type="url" dir="ltr" value="' + link + '" aria-label="Post link"></label>'); rm(f, 'this post'); });
      /* Add sits under the heading, so the posts keep their row */
      h.insertAdjacentHTML('beforeend', '<button type="button" class="emk-add-inline">' + I.plus + '<b>Add a post</b><small>Instagram, TikTok, Behance or YouTube Shorts</small></button>');
    }
    if (b.matches('.res')) {
      b.querySelectorAll(':scope > div:not(.emk-tools)').forEach(function (m) {
        var n = m.querySelector('b'), ar = n.querySelector('.ar'); if (ar) ar.remove();
        edit(n, '1.2M'); edit(m.querySelector(':scope > span'), 'What it measures'); var sm = m.querySelector('small'); if (sm) edit(sm, 'Compared with');
        rm(m, 'this number'); });
      if (b.querySelectorAll(':scope > div:not(.emk-tools)').length < 4) b.insertAdjacentHTML('beforeend', '<button type="button" class="emk-add-tile">' + I.plus + '<b>Add a number</b><small>1.2M · 68% · +40%</small></button>');
      b.insertAdjacentHTML('afterend', '<p class="emk-note emk-note-res">Type a number the way it reads. A % gets a bar; a + or − shows a rise or a fall, with what it’s compared to.</p>');
    }
    if (b.matches('.cred')) {
      b.querySelectorAll('li').forEach(function (li) {
        var st = li.querySelector('.st'), owner = st && /Owner/.test(st.textContent);
        if (!owner || !/Demo talent/.test(li.textContent)) { edit(li.querySelector('b'), 'Name, or search Fama'); }
        edit(li.querySelector('.r'), 'Role, e.g. Photographer');
        if (!/Demo talent/.test(li.textContent)) rm(li, 'this person');
      });
      b.insertAdjacentHTML('beforeend', '<li class="emk-add-li"><button type="button">' + I.plus + '<b>Credit someone</b><small>They’re asked to confirm when you publish</small></button></li>');
    }
  }

  function galleryEditor(b) {
    var stage = b.querySelector('.cs-stage'); if (!stage) return;
    var k = stage.querySelector('.cs-k'), intro = stage.querySelector('.cs-intro .txt'), title = stage.querySelector('.cs-title');
    var figs = [].slice.call(stage.querySelectorAll('.cs-fig')).map(function (f) {
      var bg = (f.querySelector('.ph-img') || {}).style || {}, cap = f.querySelector('figcaption');
      return { src: (bg.backgroundImage || '').replace(/"/g, "'"), w: /w-l/.test(f.className) ? 'l' : /w-s/.test(f.className) ? 's' : 'm', cap: cap ? cap.textContent.replace(/^\s*\d+\s*\/\s*\d+\s*/, '').trim() : '' };
    });
    var g = document.createElement('div'); g.className = 'emk-gal';
    g.innerHTML = '<div class="emk-gal-head"><div><span class="emk-gal-k">' + (k ? k.textContent : '') + '</span>' +
        '<h2 class="emk-gal-t" data-emk-edit contenteditable="true" data-ph="Name this part">' + (title ? title.textContent : '') + '</h2>' +
        '<p class="emk-gal-i" data-emk-edit contenteditable="true" data-ph="A line about these pictures">' + (intro ? intro.textContent : '') + '</p></div>' +
        '<p class="emk-gal-note">' + I.grid + '<span><b>Gallery · ' + figs.length + ' pictures</b>On the page it holds still and scrolls sideways, in this order.</span></p></div>' +
      '<ol class="emk-strip">' + figs.map(function (f, i) {
        return '<li class="emk-ph w-' + f.w + '"><div class="emk-ph-img" style="background-image:' + f.src + '"><span class="emk-ph-n">' + (i + 1 < 10 ? '0' : '') + (i + 1) + '</span>' +
          '<span class="emk-ph-acts"><button type="button" aria-label="Drag to reorder">' + I.grip + '</button><button type="button" aria-label="Replace picture ' + (i + 1) + '">' + I.img + '</button><button type="button" aria-label="Remove picture ' + (i + 1) + '">' + I.x + '</button></span></div>' +
          '<p class="emk-ph-cap" data-emk-edit contenteditable="true" data-ph="Caption">' + f.cap + '</p></li>'; }).join('') +
        '<li class="emk-ph add"><button type="button">' + I.plus + '<b>Add pictures</b><small>or drop them here</small></button></li></ol>' +
      '<p class="emk-gal-hint">Drag a picture to change its place. Wide and tall pictures keep their shape on the page.</p>';
    stage.replaceWith(g);
  }

  /* the block menu, opened under the first heading's text */
  var MENU = [['Write', [['text', 'Text', 'A paragraph. Type / anywhere for this menu'], ['head', 'Heading', 'Starts a new chapter on the page'], ['quote', 'Quote', 'Set large, with who said it']]],
    ['Show', [['img', 'Image', 'Full width. An image then text sit side by side'], ['grid', 'Photos', '4 or more become the scrolling gallery'], ['ba', 'Before / After', 'One frame twice, with a line to drag'], ['tag', 'Look with tags', 'Numbered pieces on a photo'], ['vid', 'Video', 'YouTube or Vimeo link'], ['link', 'Embed', 'Instagram, TikTok, Behance post']]],
    ['Prove', [['num', 'Results', 'Up to four numbers: 1.2M, 68%, +40%'], ['ppl', 'Credits', 'People who worked on it, asked to confirm']]]];
  var menuHTML = '<div class="emk-menu" role="menu" aria-label="Add a block">' + MENU.map(function (g) {
    return '<p>' + g[0] + '</p>' + g[1].map(function (m, i) { return '<button role="menuitem"' + (g[0] === 'Show' && i === 0 ? ' class="is-hl"' : '') + '><span class="ico">' + I[m[0]] + '</span><b>' + m[1] + '</b><small>' + m[2] + '</small></button>'; }).join(''); }).join('') + '</div>';

  /* settings: what visitors never see */
  var panel = document.createElement('aside'); panel.className = 'emk-panel'; panel.setAttribute('aria-label', 'Project settings');
  panel.innerHTML = '<button class="x" type="button" aria-label="Close" data-emk="close">' + I.x + '</button><h2>Settings</h2><p class="lead2">Visitors never see these.</p>' +
    '<div class="row"><label for="emkDate">Date</label><input id="emkDate" type="month" value="2026-03"><small>Sorts your projects, and shows as the year tag.</small></div>' +
    '<div class="row"><div class="tog"><div><label>Keep the client confidential</label><small>The page says “Confidential client” and hides the link. Use it for work under an NDA.</small></div><button class="sw" role="switch" aria-checked="false" type="button" aria-label="Keep the client confidential"></button></div></div>' +
    '<div class="row"><label>Status</label><small>Draft: only you can see it. Publish puts it on your profile and asks the people you credited to confirm.</small></div>';
  var scrim = document.createElement('div'); scrim.className = 'emk-scrim';
  document.body.appendChild(scrim); document.body.appendChild(panel);
  var setPanel = function (on) { panel.classList.toggle('is-open', on); scrim.classList.toggle('is-open', on); };
  document.addEventListener('click', function (e) {
    var a = e.target.closest('[data-emk]'); if (a) { setPanel(a.dataset.emk === 'settings'); return; }
    if (e.target === scrim) setPanel(false);
    var sw = e.target.closest('.emk-panel .sw'); if (sw) sw.setAttribute('aria-checked', sw.getAttribute('aria-checked') !== 'true');
    var ins = e.target.closest('.emk-ins button'); if (ins) { var box = ins.parentNode, open = !box.classList.contains('is-open');
      document.querySelectorAll('.emk-ins.is-open').forEach(function (o) { o.classList.remove('is-open'); var m = o.querySelector('.emk-menu'); if (m) m.remove(); });
      if (open) { box.classList.add('is-open'); box.insertAdjacentHTML('beforeend', menuHTML); } }
  });
  document.addEventListener('focusin', function (e) { var b = e.target.closest('.emk-b'); document.querySelectorAll('.emk-b.emk-on').forEach(function (x) { if (x !== b) x.classList.remove('emk-on'); }); if (b) b.classList.add('emk-on'); });

  /* the moment under review */
  var heading = blocks.find(function (b) { return b.matches('.ch-h'); }), text = blocks.find(function (b) { return b.matches('.txt'); });
  var pic = blocks.find(function (b) { return b.matches('.full, .spread'); });
  var show = function (el) { if (el && !Q.has('still')) setTimeout(function () { el.scrollIntoView({ block: 'center' }); }, 60); };
  if (STATE === 'menu' && text) { var ins = text.nextElementSibling; ins.classList.add('is-open'); ins.insertAdjacentHTML('beforeend', menuHTML); show(text); }
  else if (STATE === 'media' && pic) { pic.classList.add('emk-on'); show(pic); }
  else if (STATE === 'gallery') { var gal = blocks.find(function (b) { return b.matches('.cases'); }); if (gal) { gal.classList.add('emk-on'); show(gal); } }
  else if (STATE === 'look') { var lk = blocks.find(function (b) { return b.matches('.look'); }); if (lk) { lk.classList.add('emk-on'); show(lk); } }
  else if (STATE === 'results') { var rs = blocks.find(function (b) { return b.matches('.res'); }); if (rs) { rs.classList.add('emk-on'); show(rs); } }
  else if (STATE === 'settings') setPanel(true);
  else if (text) { text.classList.add('emk-on'); show(heading || text); }
})();
