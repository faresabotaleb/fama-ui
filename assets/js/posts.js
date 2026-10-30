/* FAMA — posts: data, the post frame, its actions, the report sheet and the guest
   sign-in prompt. Shared by feed.html and post.html. Needs ds.js first.
   Blueprint (Area 3): Like · Comment · Share (copy link) · Save · More (Report; for the
   author: Edit, Delete, Pin). Text and skills can be edited for 15 minutes; media is locked.
   One pinned post per talent. One report per person per post; 5 open reports hide it. */
(function () {
  'use strict';
  var ar = FAMA.lang === 'ar', t = FAMA.t, esc = FAMA.esc;
  var guest = new URLSearchParams(location.search).get('view') === 'guest';
  FAMA.guest = guest;

  Object.assign(FAMA.T.en, {
    'p.like': 'Like', 'p.unlike': 'Unlike', 'p.comment': 'Comment', 'p.share': 'Share', 'p.save': 'Save', 'p.saved': 'Saved', 'p.more': 'More',
    'p.likes': function (n) { return FAMA.num(n) + (n === 1 ? ' like' : ' likes'); }, 'p.comments': function (n) { return FAMA.num(n) + (n === 1 ? ' comment' : ' comments'); },
    'p.copied': 'Link copied', 'p.repost': 'Share to your feed', 'p.copy': 'Copy link', 'p.shareOn': function (n) { return 'Share on ' + n; }, 'p.more2': 'More options',
    'p.rpT': 'Share to your feed', 'p.rpPh': 'Add your thoughts (optional). Type @ to credit someone.', 'p.rpGo': 'Share', 'p.rpDone': 'Shared to your feed', 'p.rpBy': function (n) { return 'Shared from ' + n; },
    'p.cAll': function (n) { return 'View all ' + n + ' comments'; }, 'p.cAdd': 'Add a comment\u2026', 'p.cSend': 'Post', 'p.cGuest': 'Log in to comment', 'p.cNone': 'No comments yet. Start the conversation.', 'p.cHide': 'Hide comments', 'p.report': 'Report', 'p.reported': 'You reported this', 'p.edit': 'Edit', 'p.delete': 'Delete', 'p.pin': 'Pin to top of my posts', 'p.unpin': 'Unpin',
    'p.pinned': 'Pinned', 'p.editLeft': function (m) { return 'Edit · ' + m + ' min left'; },
    'p.delT': 'Delete this post?', 'p.delB': 'It comes off the feed and your profile, with its comments.', 'p.delOk': 'Delete post', 'p.deleted': 'Post deleted',
    'p.pinT': 'Pinned. It stays at the top of your posts.', 'p.pinReplace': 'Pinned. Your previous pin was replaced.',
    'p.project': 'Project', 'p.with': function (who) { return 'with ' + who; },
    'p.signin': function (a) { return 'Sign in to ' + a + ' this'; }, 'p.signinP': "We'll finish the " + '{a}' + " for you, then bring you back here.",
    'p.login': 'Log in', 'p.join': 'Join as talent',
    'r.title': 'Report this post', 'r.titleC': 'Report this comment', 'r.why': 'Why are you reporting it?', 'r.more': 'Tell us more', 'r.moreReq': 'Required for “Something else”',
    'r.send': 'Send report', 'r.cancel': 'Cancel', 'r.thanks': "Thanks. We'll take a look.", 'r.need': 'Pick a reason first.', 'r.needNote': 'Tell us what’s wrong, in a line or two.',
    'r.reasons': ['Spam', 'Nudity', 'Harassment', 'Hate', 'Impersonation', 'Intellectual property', 'Something else'],
    'p.alt': 'Image'
  });
  Object.assign(FAMA.T.ar, {
    'p.like': 'إعجاب', 'p.unlike': 'إلغاء الإعجاب', 'p.comment': 'تعليق', 'p.share': 'مشاركة', 'p.save': 'حفظ', 'p.saved': 'محفوظ', 'p.more': 'المزيد',
    'p.likes': function (n) { return FAMA.num(n) + ' إعجاب'; }, 'p.comments': function (n) { return FAMA.num(n) + ' تعليق'; },
    'p.copied': 'اتنسخ الرابط', 'p.report': 'إبلاغ', 'p.reported': 'بلّغت عن ده', 'p.edit': 'تعديل', 'p.delete': 'حذف', 'p.pin': 'ثبّته أول منشوراتي', 'p.unpin': 'إلغاء التثبيت',
    'p.pinned': 'مثبّت', 'p.editLeft': function (m) { return 'تعديل · فاضل ' + m + ' دقيقة'; },
    'p.delT': 'حذف المنشور؟', 'p.delB': 'هيتشال من المستجدات ومن بروفايلك، مع تعليقاته.', 'p.delOk': 'حذف المنشور', 'p.deleted': 'اتحذف المنشور',
    'p.pinT': 'اتثبّت. هيفضل أول منشوراتك.', 'p.pinReplace': 'اتثبّت، واتشال التثبيت القديم.',
    'p.project': 'مشروع', 'p.with': function (who) { return 'مع ' + who; },
    'p.signin': function (a) { return 'سجّل دخول عشان ' + a; }, 'p.signinP': 'هنكمّل {a} لك ونرجّعك هنا.',
    'p.login': 'تسجيل الدخول', 'p.join': 'انضم كموهبة',
    'r.title': 'الإبلاغ عن المنشور', 'r.titleC': 'الإبلاغ عن التعليق', 'r.why': 'ليه بتبلّغ؟', 'r.more': 'قولنا أكتر', 'r.moreReq': 'مطلوب مع «حاجة تانية»',
    'r.send': 'إرسال البلاغ', 'r.cancel': 'إلغاء', 'r.thanks': 'شكراً. هنراجعه.', 'r.need': 'اختار سبب الأول.', 'r.needNote': 'قولنا المشكلة في سطر أو اتنين.',
    'r.reasons': ['سبام', 'عُري', 'تحرّش', 'كراهية', 'انتحال شخصية', 'ملكية فكرية', 'حاجة تانية'],
    'p.alt': 'صورة'
  });

  var ME = { name: 'Demo talent', user: 'demo-talent', init: 'DT' };
  var SAMPLE_C = [
    ['Omar Saleh', 'omar-saleh', 'This light is unreal. Which hour did you shoot?', '1h'],
    ['Rania K.', 'rania-k', 'Love the palette here. @demo-talent you\u2019d style this so well.', '3h'],
    ['Karim F.', 'karim-f', 'Saving this for the next brief.', '5h']
  ];
  function inlineComments(p) {
    if (!p._c) p._c = SAMPLE_C.slice(0, Math.min(2, p.comments)).map(function (c, i) { return { n: c[0], u: c[1], tx: c[2], ago: c[3], id: p.id + '-' + i }; });
    return p._c;
  }
  FAMA.ME = ME;
  FAMA.POSTS = [
    { id: 4812, a: { name: 'Lina Haddad', user: 'lina-haddad', init: 'LH' }, ago: '2h', text: 'New story for @maison-nour, shot at golden hour with @omar-saleh. https://youtube.com/watch?v=bts', media: 3, skills: ['Photography', 'Styling'], likes: 128, comments: 14 },
    { id: 4807, kind: 'project', a: { name: 'Omar Saleh', user: 'omar-saleh', init: 'OS' }, ago: '5h', project: { title: 'Desert Light — 2026', client: 'Maison Nour', year: 2026, credits: 'Omar Saleh · Styling — with Lina Haddad' }, skills: ['Styling'], likes: 86, comments: 6 },
    { id: 4799, a: ME, mine: true, pinned: true, ago: '1d', text: 'Rail to set in forty seconds. Tailoring pulled from two Cairo archives for @nomad-coffee.', media: 2, skills: ['Styling'], likes: 41, comments: 3 },
    { id: 4790, a: { name: 'Rania K.', user: 'rania-k', init: 'RK' }, ago: '1d', text: 'Testing a matte base for the 2026 beauty story. Notes on Behance: https://behance.net/gallery/rania', media: 1, skills: ['Makeup'], likes: 57, comments: 9 },
    { id: 4781, a: { name: 'Karim F.', user: 'karim-f', init: 'KF' }, ago: '2d', text: 'Looking for a stylist who can source modest evening wear in Cairo next month. Tag someone.', media: 0, skills: ['Photography'], likes: 23, comments: 17 },
    { id: 4770, a: { name: 'Tarek Sobhy', user: 'tarek-sobhy', init: 'TS' }, ago: '3d', text: 'Behind the scenes on the Nefertari 2026 shoot.', media: 4, skills: ['Cinematography'], likes: 64, comments: 5 }
  ];
  FAMA.PEOPLE = [
    { name: 'Omar Saleh', user: 'omar-saleh', skill: 'Photography', why: 'follows' },
    { name: 'Lina Haddad', user: 'lina-haddad', skill: 'Photography', why: 'follows' },
    { name: 'Rania K.', user: 'rania-k', skill: 'Makeup', why: 'follows' },
    { name: 'Omar Farouk', user: 'omar-farouk', skill: 'Direction' },
    { name: 'Karim F.', user: 'karim-f', skill: 'Photography' },
    { name: 'Nour Adel', user: 'nour-adel', skill: 'Styling' }
  ];

  /* text: @mentions become links, pasted links become chips */
  var PLATFORMS = [['youtube', 'YouTube'], ['youtu.be', 'YouTube'], ['instagram', 'Instagram'], ['tiktok', 'TikTok'], ['behance', 'Behance'], ['vimeo', 'Vimeo'], ['x.com', 'X'], ['linkedin', 'LinkedIn'], ['pinterest', 'Pinterest'], ['dribbble', 'Dribbble'], ['spotify', 'Spotify'], ['soundcloud', 'SoundCloud'], ['facebook', 'Facebook'], ['snapchat', 'Snapchat']];
  FAMA.platform = function (url) { for (var i = 0; i < PLATFORMS.length; i++) if (url.indexOf(PLATFORMS[i][0]) >= 0) return PLATFORMS[i][1]; try { return new URL(url).hostname.replace('www.', ''); } catch (e) { return url; } };
  FAMA.links = function (s) { return (s.match(/https?:\/\/\S+/g) || []); };
  /* skill hashtags: "Lighting & grip" is #LightingGrip. A tag that names one of the 41 skills links to the feed filtered by it. */
  FAMA.hashTag = function (name) { return name.split(/[^A-Za-z0-9]+/).filter(Boolean).map(function (w) { return w[0].toUpperCase() + w.slice(1); }).join(''); };
  var tagSkill = function (tag) { var l = window.FAMA_SKILLS || []; for (var i = 0; i < l.length; i++) if (FAMA.hashTag(l[i].name).toLowerCase() === tag.toLowerCase()) return l[i].name; return null; };
  FAMA.tagsIn = function (text) { var out = []; (text || '').replace(/#([a-z0-9]+)/gi, function (_, t) { var n = tagSkill(t); if (n && out.indexOf(n) < 0) out.push(n); }); return out; };
  FAMA.fmt = function (s) {
    return esc(s).replace(/https?:\/\/\S+/g, '').replace(/@([a-z0-9-]+)/gi, '<a class="mention" href="' + FAMA.href('preview.html?view=guest') + '">@$1</a>')
      .replace(/#([a-z0-9]+)/gi, function (m, t) { var n = tagSkill(t); return n ? '<a class="mention" href="' + FAMA.href('feed.html?skill=' + n.toLowerCase().replace(/ & /g, '-').replace(/\s+/g, '-')) + '">#' + FAMA.hashTag(n) + '</a>' : m; }).trim();
  };

  var ico = function (id) { return '<svg class="icon" aria-hidden="true"><use href="#' + id + '"/></svg>'; };
  /* photos: a grid of up to four on wide screens; on a phone every photo sits in a row you swipe,
     the next one peeks in, a counter shows where you are and dots follow the swipe (11 Oct 2026, Muhammad's review) */
  function mediaHTML(p) {
    var n = p.media, many = n > 1;
    return '<div class="pmedia n' + Math.min(n, 4) + (many ? ' many' : '') + '" data-dbl data-n="' + n + '"><div class="ptrack">' + Array.from({ length: n }, function (_, i) {
      return '<button class="ph' + (i > 3 ? ' extra' : '') + '" data-open="' + i + '" aria-label="' + t('p.alt') + ' ' + (i + 1) + ' / ' + n + '">' + ico('i-image') + (i === 3 && n > 4 ? '<span class="plus">+' + (n - 4) + '</span>' : '') + '</button>';
    }).join('') + '</div>' + (many ? '<span class="pcount" aria-hidden="true">1 / ' + n + '</span><span class="pdots" aria-hidden="true">' + Array.from({ length: n }, function (_, i) { return '<i' + (i ? '' : ' class="on"') + '></i>'; }).join('') + '</span>' : '') + '</div>';
  }
  FAMA.postHTML = function (p, full) {
    var head = '<header class="ph-head"><a class="av" href="' + FAMA.href('preview.html' + (p.mine ? '' : '?view=guest')) + '" aria-hidden="true" tabindex="-1">' + p.a.init + '</a>' +
      '<div class="grow"><a class="who" href="' + FAMA.href('preview.html' + (p.mine ? '' : '?view=guest')) + '"><b dir="auto">' + esc(p.a.name) + '</b></a>' +
      '<span class="meta"><span dir="ltr">@' + p.a.user + '</span> · ' + p.ago + (p.pinned ? ' · <span class="pinned">' + t('p.pinned') + '</span>' : '') + (p.edited ? ' · edited' : '') + '</span></div>' +
      '<div class="more-wrap"><button class="iconbtn plain" data-more aria-haspopup="menu" aria-expanded="false" aria-label="' + t('p.more') + '">' + ico('i-more') + '</button></div></header>';
    var body;
    if (p.kind === 'repost') {
      var o = p.orig;
      body = (p.text ? '<p class="ptext" dir="auto">' + FAMA.fmt(p.text) + '</p>' : '') +
        '<a class="rp" href="' + FAMA.href('post.html?id=' + o.id) + '"><span class="rp-h"><span class="av sm" aria-hidden="true">' + o.a.init + '</span><b>' + esc(o.a.name) + '</b> <span class="meta" dir="ltr">@' + o.a.user + ' · ' + o.ago + '</span></span>' +
        (o.kind === 'project' ? '<span class="rp-t"><span class="label">' + t('p.project') + '</span> ' + esc(o.project.title) + '</span>' : '<span class="rp-t" dir="auto">' + esc((o.text || '').replace(/https?:\/\/\S+/g, '').trim()) + '</span>') +
        (o.media ? '<span class="meta rp-m">' + ico('i-image') + ' ' + o.media + '</span>' : '') + '</a>';
    } else if (p.kind === 'project') {
      body = (p.text ? '<p class="ptext" dir="auto">' + FAMA.fmt(p.text) + '</p>' : '') +
        '<a class="projframe" href="' + FAMA.href('project.html?p=' + (p.project.slug || 'desert-light')) + '"><div class="ph cover">' + ico('i-image') + '</div><div class="pf-b"><span class="label">' + t('p.project') + ' · ' + esc(p.project.client) + ' · ' + p.project.year + '</span>' +
        '<b class="pf-t">' + esc(p.project.title) + '</b><span class="meta">' + esc(p.project.credits) + '</span></div></a>';
    } else {
      var links = FAMA.links(p.text || '');
      body = '<p class="ptext" dir="auto">' + FAMA.fmt(p.text || '') + '</p>' +
        (links.length ? '<div class="chips lchips">' + links.map(function (u) { return '<a class="chip" href="' + esc(u) + '" target="_blank" rel="noopener">' + ico('i-link') + esc(FAMA.platform(u)) + '</a>'; }).join('') + '</div>' : '') +
        (p.media ? mediaHTML(p) : '');
    }
    /* posts tagged with #skills in their text don't repeat them as chips below */
    var tags = p.skills && p.skills.length && !FAMA.tagsIn(p.text).length ? '<div class="chips ptags">' + p.skills.map(function (s) { return '<span class="tag">' + esc(s) + '</span>'; }).join('') + '</div>' : '';
    var counts = '<p class="counts meta"><span data-likes>' + t('p.likes', p.likes) + '</span> · ' + (full ? '<a href="#comments">' + t('p.comments', p.comments) + '</a>' :
      '<button class="clink" data-comments aria-expanded="' + !!p._open + '" aria-controls="pc-' + p.id + '">' + t('p.comments', p.comments) + '</button>') + '</p>';
    var acts = '<div class="pacts">' +
      '<button data-like aria-label="' + t('p.like') + '" aria-pressed="' + !!p.liked + '">' + ico(p.liked ? 'i-heart-f' : 'i-heart') + '<span>' + t('p.like') + '</span></button>' +
      (full ? '<button data-focus-comment aria-label="' + t('p.comment') + '">' + ico('i-msg') + '<span>' + t('p.comment') + '</span></button>' : '<button data-comments aria-expanded="' + !!p._open + '" aria-controls="pc-' + p.id + '" aria-label="' + t('p.comment') + '">' + ico('i-msg') + '<span>' + t('p.comment') + '</span></button>') +
      '<button data-share aria-haspopup="menu" aria-expanded="false" aria-label="' + t('p.share') + '">' + ico('i-share') + '<span>' + t('p.share') + '</span></button>' +
      '<button data-save aria-label="' + t('p.save') + '" aria-pressed="' + !!p.saved + '">' + ico(p.saved ? 'i-bm-f' : 'i-bm') + '<span>' + (p.saved ? t('p.saved') : t('p.save')) + '</span></button></div>';
    /* comments open right here, under the post: the latest few, a box to add one, and the way to the full thread */
    var panel = '';
    if (!full && p._open) {
      var cs = inlineComments(p);
      panel = '<div class="pcomments" id="pc-' + p.id + '">' +
        (guest ? '<p class="cguest"><a class="link" href="' + FAMA.href('login.html?next=feed') + '">' + t('p.cGuest') + '</a></p>' :
          '<form class="cadd" data-cadd><span class="av sm" aria-hidden="true">' + ME.init + '</span><label class="fx-vh" for="ci-' + p.id + '">' + t('p.cAdd') + '</label>' +
          '<span class="cpill"><input id="ci-' + p.id + '" maxlength="2200" placeholder="' + t('p.cAdd') + '" autocomplete="off"><button class="csend" disabled aria-label="' + t('p.cSend') + '">' + ico('i-send-up') + '</button></span></form>') +
        (cs.length ? '<ul class="clist">' + cs.map(function (c) {
          return '<li><a class="av sm" href="' + FAMA.href('preview.html?view=guest') + '" aria-hidden="true" tabindex="-1">' + c.n.split(' ').map(function (w) { return w[0]; }).join('').slice(0, 2).toUpperCase() + '</a>' +
            '<div class="cb"><p><a class="who" href="' + FAMA.href('preview.html?view=guest') + '"><b>' + esc(c.n) + '</b></a> <span class="meta">' + c.ago + '</span></p><p dir="auto">' + FAMA.fmt(c.tx) + '</p></div></li>';
        }).join('') + '</ul>' : '<p class="meta cnone">' + t('p.cNone') + '</p>') +
        (p.comments > cs.length ? '<a class="link call" href="' + FAMA.href('post.html?id=' + p.id) + '">' + t('p.cAll', FAMA.num(p.comments)) + '</a>' : '') +
        '</div>';
    }
    return '<article class="post" data-id="' + p.id + '">' + head + body + tags + counts + acts + panel + '</article>';
  };

  FAMA.ICONS = '<svg width="0" height="0" style="position:absolute" aria-hidden="true">' +
    '<symbol id="i-image" viewBox="0 0 24 24"><rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></symbol>' +
    '<symbol id="i-heart" viewBox="0 0 24 24"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></symbol>' +
    '<symbol id="i-heart-f" viewBox="0 0 24 24"><path fill="currentColor" d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></symbol>' +
    '<symbol id="i-msg" viewBox="0 0 24 24"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></symbol>' +
    '<symbol id="i-share" viewBox="0 0 24 24"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="m16 6-4-4-4 4"/><path d="M12 2v13"/></symbol>' +
    '<symbol id="i-bm" viewBox="0 0 24 24"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></symbol>' +
    '<symbol id="i-bm-f" viewBox="0 0 24 24"><path fill="currentColor" d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></symbol>' +
    '<symbol id="i-more" viewBox="0 0 24 24"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></symbol>' +
    '<symbol id="i-link" viewBox="0 0 24 24"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></symbol>' +
    '<symbol id="i-x" viewBox="0 0 24 24"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></symbol>' +
'<symbol id="i-repost" viewBox="0 0 24 24"><path d="m2 9 3-3 3 3"/><path d="M13 18H7a2 2 0 0 1-2-2V6"/><path d="m22 15-3 3-3-3"/><path d="M11 6h6a2 2 0 0 1 2 2v10"/></symbol>' +
    '<symbol id="i-ext" viewBox="0 0 24 24"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></symbol>' +
    '<symbol id="i-plus" viewBox="0 0 24 24"><path d="M12 5v14"/><path d="M5 12h14"/></symbol>' +
    '<symbol id="i-send-up" viewBox="0 0 24 24"><path d="m5 12 7-7 7 7"/><path d="M12 19V5"/></symbol>' +
    '</svg>';

  /* guests: a sign-in dialog in the middle of the screen (7 Oct 2026, was a small box inside the post).
     The action is remembered and finished after login; focus goes back to what they pressed. */
  FAMA.signInPrompt = function (anchor, verbKey) {
    var from = document.activeElement;
    document.querySelectorAll('dialog.signdlg').forEach(function (x) { x.close(); });
    var v = t(verbKey).toLowerCase(), d = document.createElement('dialog');
    d.className = 'signdlg'; d.setAttribute('aria-labelledby', 'signT');
    d.innerHTML = '<button type="button" class="iconbtn plain sx" data-x aria-label="Close">' + ico('i-x') + '</button>' +
      '<svg class="sstar" viewBox="10 80 760 690" aria-hidden="true"><polygon points="314.63 635.59 16.74 747.68 217.29 533.15 86.97 370.29 403.26 356.02 701.63 87.21 636.51 355.76 760 356.91 574.68 534.04 422.33 756.79 314.63 635.59"/></svg>' +
      '<h2 id="signT">' + t('p.signin', v) + '</h2><p>' + t('p.signinP').replace('{a}', v) + '</p><div class="row">' +
      '<a class="btn" href="' + FAMA.href('login.html?next=feed') + '">' + t('p.login') + '</a><a class="btn btn-2" href="' + FAMA.href('register.html') + '">' + t('p.join') + '</a></div>';
    document.body.appendChild(d);
    d.querySelector('[data-x]').onclick = function () { d.close(); };
    d.addEventListener('click', function (e) { if (e.target === d) d.close(); });
    d.addEventListener('close', function () { d.remove(); if (from && from.focus) from.focus(); });
    d.showModal(); d.querySelector('.row a').focus();
  };

  /* More menu */
  function menu(btn, p, onDone) {
    document.querySelectorAll('.pmenu').forEach(function (m) { m.remove(); });
    var m = document.createElement('div'); m.className = 'pmenu'; m.setAttribute('role', 'menu');
    var items = [];
    if (p.mine) {
      if (p.kind !== 'project') items.push(['edit', t('p.editLeft', 12)]);
      items.push(['pin', p.pinned ? t('p.unpin') : t('p.pin')]);
      items.push(['delete', t('p.delete')]);
    } else items.push(['report', p.reported ? t('p.reported') : t('p.report')]);
    m.innerHTML = items.map(function (i) { return '<button role="menuitem" data-m="' + i[0] + '"' + (i[0] === 'report' && p.reported ? ' disabled' : '') + '>' + i[1] + '</button>'; }).join('');
    btn.parentElement.appendChild(m); btn.setAttribute('aria-expanded', 'true');
    m.querySelector('button:not([disabled])') && m.querySelector('button:not([disabled])').focus();
    var close = function () { m.remove(); btn.setAttribute('aria-expanded', 'false'); document.removeEventListener('click', off, true); };
    var off = function (e) { if (!m.contains(e.target) && e.target !== btn && !btn.contains(e.target)) close(); };
    setTimeout(function () { document.addEventListener('click', off, true); });
    m.addEventListener('keydown', function (e) { if (e.key === 'Escape') { close(); btn.focus(); } });
    m.addEventListener('click', function (e) { var b = e.target.closest('[data-m]'); if (!b) return; close(); onDone(b.dataset.m); });
  }

  /* report sheet: pick a reason, add a note, send. One per person per post. */
  FAMA.report = function (kind) {
    return new Promise(function (resolve) {
      var d = document.createElement('dialog'); d.className = 'dlg';
      var R = t('r.reasons');
      d.innerHTML = '<form method="dialog" novalidate><div class="dh"><h2>' + (kind === 'comment' ? t('r.titleC') : t('r.title')) + '</h2><button type="button" class="iconbtn plain" data-x aria-label="' + t('r.cancel') + '">' + ico('i-x') + '</button></div>' +
        '<fieldset style="border:0;padding:0;margin:var(--s5) 0 0"><legend class="lbl" style="padding:0">' + t('r.why') + '</legend><div class="chips" role="radiogroup">' +
        R.map(function (r, i) { return '<button type="button" class="chip" role="radio" aria-checked="false" aria-pressed="false" data-r="' + i + '">' + r + '</button>'; }).join('') + '</div></fieldset>' +
        '<label class="f" style="margin-top:var(--s5)"><span>' + t('r.more') + '<small id="rq"></small></span><textarea class="ta" maxlength="500" style="min-height:96px"></textarea><p class="help err" id="rerr"></p></label>' +
        '<div class="acts"><button type="button" class="btn btn-2" data-x>' + t('r.cancel') + '</button><button class="btn" value="send">' + t('r.send') + '</button></div></form>';
      document.body.appendChild(d);
      var pick = -1, form = d.querySelector('form');
      d.querySelector('[role=radiogroup]').addEventListener('click', function (e) {
        var b = e.target.closest('[data-r]'); if (!b) return; pick = +b.dataset.r;
        d.querySelectorAll('[data-r]').forEach(function (x) { var on = x === b; x.setAttribute('aria-pressed', on); x.setAttribute('aria-checked', on); });
        d.querySelector('#rq').textContent = pick === R.length - 1 ? t('r.moreReq') : '';
      });
      d.querySelectorAll('[data-x]').forEach(function (x) { x.onclick = function () { d.close(); }; });
      form.addEventListener('submit', function (e) {
        e.preventDefault(); var err = d.querySelector('#rerr');
        if (pick < 0) { err.textContent = t('r.need'); return; }
        if (pick === R.length - 1 && !d.querySelector('textarea').value.trim()) { err.textContent = t('r.needNote'); d.querySelector('textarea').focus(); return; }
        form.innerHTML = '<div class="done-r" role="status"><h2>' + t('r.thanks') + '</h2><div class="acts"><button class="btn" value="ok">OK</button></div></div>';
        form.querySelector('button').focus(); d.dataset.sent = '1';
      });
      d.addEventListener('close', function () { resolve(d.dataset.sent === '1'); d.remove(); });
      d.showModal();
    });
  };

  /* share: to your own feed, out to other channels, or copy the link */
  var NETS = [['LinkedIn', 'https://www.linkedin.com/sharing/share-offsite/?url={u}'], ['X', 'https://x.com/intent/post?url={u}'],
    ['Facebook', 'https://www.facebook.com/sharer/sharer.php?u={u}'], ['WhatsApp', 'https://wa.me/?text={u}']];
  function shareMenu(btn, p, art, onRepost) {
    document.querySelectorAll('.pmenu').forEach(function (m) { m.remove(); });
    var url = 'https://fama.so/posts/' + p.id, u = encodeURIComponent(url);
    var m = document.createElement('div'); m.className = 'pmenu smenu'; m.setAttribute('role', 'menu');
    /* a visitor has no feed of their own, so the repost option isn't offered at all */
    m.innerHTML = (guest ? '' : '<button role="menuitem" data-s="repost">' + ico('i-repost') + t('p.repost') + '</button>') +
      '<button role="menuitem" data-s="copy">' + ico('i-link') + t('p.copy') + '</button><hr>' +
      NETS.map(function (n) { return '<a role="menuitem" href="' + n[1].replace('{u}', u) + '" target="_blank" rel="noopener">' + ico('i-ext') + t('p.shareOn', n[0]) + '<span class="fx-vh"> (opens in a new tab)</span></a>'; }).join('') +
      (navigator.share ? '<button role="menuitem" data-s="native">' + ico('i-share') + t('p.more2') + '</button>' : '');
    btn.parentElement.appendChild(m); btn.setAttribute('aria-expanded', 'true');
    m.querySelector('[role=menuitem]').focus();
    var close = function () { m.remove(); btn.setAttribute('aria-expanded', 'false'); document.removeEventListener('click', off, true); };
    var off = function (e) { if (!m.contains(e.target) && !btn.contains(e.target)) close(); };
    setTimeout(function () { document.addEventListener('click', off, true); });
    m.addEventListener('keydown', function (e) {
      var items = [].slice.call(m.querySelectorAll('[role=menuitem]')), i = items.indexOf(document.activeElement);
      if (e.key === 'Escape') { close(); btn.focus(); }
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); items[(i + (e.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length].focus(); }
    });
    m.addEventListener('click', function (e) {
      var it = e.target.closest('[role=menuitem]'); if (!it) return;
      var s = it.dataset.s; close();
      if (s === 'copy') { try { navigator.clipboard.writeText(url); } catch (_) {} FAMA.toast(t('p.copied') + ': fama.so/posts/' + p.id); }
      if (s === 'native') navigator.share({ url: url }).catch(function () {});
      if (s === 'repost') { if (guest) FAMA.signInPrompt(art, 'p.share'); else repostDialog(p, onRepost); }
    });
  }
  function repostDialog(p, onRepost) {
    var d = document.createElement('dialog'); d.className = 'dlg';
    d.innerHTML = '<form method="dialog"><div class="dh"><h2>' + t('p.rpT') + '</h2><button type="button" class="iconbtn plain" data-x aria-label="Close">' + ico('i-x') + '</button></div>' +
      '<label class="fx-vh" for="rpText">' + t('p.rpPh') + '</label><textarea class="ta" id="rpText" maxlength="2200" style="margin-top:var(--s4);min-height:88px" placeholder="' + t('p.rpPh') + '"></textarea>' +
      '<div class="rpprev">' + FAMA.postHTML({ id: 'x', kind: 'repost', a: ME, orig: p, likes: 0, comments: 0 }).replace(/^[\s\S]*?(<a class="rp")/, '$1').replace(/<\/a>[\s\S]*$/, '</a>') + '</div>' +
      '<div class="acts"><button type="button" class="btn btn-2" data-x>Cancel</button><button class="btn" value="ok">' + ico('i-repost') + t('p.rpGo') + '</button></div></form>';
    document.body.appendChild(d);
    d.querySelectorAll('[data-x]').forEach(function (x) { x.onclick = function () { d.close(); }; });
    d.querySelector('.rpprev .rp').removeAttribute('href');
    d.addEventListener('close', function () {
      if (d.returnValue === 'ok') onRepost({ id: Date.now(), kind: 'repost', a: ME, mine: true, ago: 'now', text: d.querySelector('textarea').value.trim(), orig: p, likes: 0, comments: 0 });
      d.remove();
    });
    d.showModal(); d.querySelector('textarea').focus();
  }

  /* wire a container of posts */
  FAMA.bindPosts = function (root, list, rerender) {
    root.addEventListener('click', function (e) {
      var art = e.target.closest('.post'); if (!art) return;
      var p = list.find(function (x) { return String(x.id) === art.dataset.id; }); if (!p) return;
      var b;
      if ((b = e.target.closest('[data-comments]'))) {
        p._open = !p._open; rerender(p);
        var na = root.querySelector('.post[data-id="' + p.id + '"]');
        if (p._open) { var f = na.querySelector('.pcomments input, .pcomments a'); if (f) f.focus(); } else na.querySelector('.pacts [data-comments]').focus();
        return;
      }
      if (guest && (b = e.target.closest('[data-like],[data-save],[data-focus-comment]'))) {
        FAMA.signInPrompt(art, b.dataset.like !== undefined ? 'p.like' : b.dataset.save !== undefined ? 'p.save' : 'p.comment'); return;
      }
      if ((b = e.target.closest('[data-like]'))) { p.liked = !p.liked; p.likes += p.liked ? 1 : -1; rerender(p); return; }
      if ((b = e.target.closest('[data-save]'))) { p.saved = !p.saved; rerender(p); return; }
      if ((b = e.target.closest('[data-share]'))) {
        /* the feed puts a repost at the top; other pages just confirm it went to your feed */
        shareMenu(b, p, art, function (np) { if (FAMA.onRepost) FAMA.onRepost(np); FAMA.toast(t('p.rpDone')); });
        return;
      }
      if ((b = e.target.closest('[data-more]'))) {
        if (guest) { FAMA.signInPrompt(art, 'p.report'); return; }
        menu(b, p, async function (act) {
          if (act === 'report') { if (await FAMA.report('post')) { p.reported = true; } }
          if (act === 'delete' && await FAMA.confirm(t('p.delT'), t('p.delB'), t('p.delOk'), true)) { var i = list.indexOf(p); list.splice(i, 1); rerender(null); FAMA.toast(t('p.deleted'), function () { list.splice(i, 0, p); rerender(null); }); }
          if (act === 'pin') { var had = list.some(function (x) { return x.mine && x.pinned && x !== p; }); list.forEach(function (x) { if (x.mine && x !== p) x.pinned = false; }); p.pinned = !p.pinned; rerender(null); if (p.pinned) FAMA.toast(had ? t('p.pinReplace') : t('p.pinT')); }
          if (act === 'edit' && FAMA.editPost) FAMA.editPost(p);
        });
      }
    });
    /* inline comment box: enable Post once there's text, add it on top, keep the box open */
    root.addEventListener('input', function (e) {
      var f = e.target.closest('[data-cadd]'); if (f) f.querySelector('button').disabled = !e.target.value.trim();
    });
    root.addEventListener('submit', function (e) {
      var f = e.target.closest('[data-cadd]'); if (!f) return; e.preventDefault();
      var art = f.closest('.post'), p = list.find(function (x) { return String(x.id) === art.dataset.id; }), v = f.querySelector('input').value.trim(); if (!v) return;
      inlineComments(p).unshift({ n: ME.name, u: ME.user, tx: v, ago: 'now' }); p.comments++; rerender(p);
      var na = root.querySelector('.post[data-id="' + p.id + '"] .pcomments input'); if (na) na.focus();
    });
    /* the swipe row keeps its counter and dots in step */
    root.addEventListener('scroll', function (e) {
      var tr = e.target; if (!tr.classList || !tr.classList.contains('ptrack')) return;
      var m = tr.parentElement, n = +m.dataset.n, w = tr.firstElementChild ? tr.firstElementChild.offsetWidth + 8 : 1, i = Math.min(n - 1, Math.round(tr.scrollLeft / w));
      var c = m.querySelector('.pcount'); if (c) c.textContent = (i + 1) + ' / ' + n;
      m.querySelectorAll('.pdots i').forEach(function (d, j) { d.classList.toggle('on', j === i); });
    }, true);
    /* double-tap media to like */
    root.addEventListener('dblclick', function (e) {
      var m = e.target.closest('[data-dbl]'); if (!m) return; var art = m.closest('.post');
      var p = list.find(function (x) { return String(x.id) === art.dataset.id; });
      if (guest) { FAMA.signInPrompt(art, 'p.like'); return; }
      if (!p.liked) { p.liked = true; p.likes++; rerender(p); }
    });
  };
})();
