/* FAMA — shared header and footer, one source for every page.
   A page adds <div data-fama-nav></div> and <div data-fama-foot></div>,
   loads assets/css/shell.css, and this script fills them in.
   The current page is found from the file name; ?lang=ar gives the Arabic labels
   and is carried through every link. */
/* features that are built but switched off for now. Turn one back on here and it returns everywhere. */
window.FAMA_FEATURES = { reviews: false }; /* reviews are dropped for good (12 Oct 2026): Recognitions take their place */
(function () {
  'use strict';

  var lang = 'en'; // Arabic paused (27 Sep 2026). Strings are kept; restore: new URLSearchParams(location.search).get('lang') === 'ar' ? 'ar' : 'en'
  var here = (location.pathname.split('/').pop() || 'index.html');
  /* prototype only: ?state= says where the profile is in approval, and follows every link */
  var state = new URLSearchParams(location.search).get('state') || '';
  if (['incomplete', 'complete'].indexOf(state) < 0) state = '';
  var review = new URLSearchParams(location.search).get('review') === '1';
  var guestView = new URLSearchParams(location.search).get('view') === 'guest';

  var L = {
    en: {
      dashboard: 'Dashboard', feed: 'Feed', activity: 'Activity', structure: 'Edit profile',
      content: 'Profile content', projects: 'Projects', credits: 'Credits', preview: 'View profile', viewMine: 'View your profile',
      activityT: 'Saved, liked, and the people you follow', joinShort: 'Join', fold: 'Collapse', unfold: 'Expand',
      newProject: 'New project', create: 'Create', newPost: 'New post', newMedia: 'Photos or video', notifs: 'Notifications', gWork: 'Your work', gProfile: 'Your profile',
      menu: 'Menu', account: 'Your account', logout: 'Log out', role: 'fama.so/demo-talent', login: 'Log in', join: 'Join as talent',
      brand: 'Fama', foot: 'Where creative talent gets seen.',
      gIncomplete: 'Your profile is Private: only you can see it. Complete it to go Live and share your link.',
      gIncompleteShort: 'Your profile is Private.', gIncompleteCta: 'Complete your profile', gLabel: 'Profile status'
    },
    ar: {
      dashboard: 'لوحة التحكم', feed: 'المستجدات', activity: 'النشاط', structure: 'هيكل البروفايل',
      content: 'محتوى البروفايل', projects: 'المشاريع', credits: 'المشاركات', preview: 'معاينة البروفايل',
      menu: 'القائمة', account: 'حسابك', logout: 'تسجيل الخروج', role: 'fama.so/demo-talent', login: 'تسجيل الدخول', join: 'انضم كموهبة',
      brand: 'فاما', foot: 'هنا المواهب الإبداعية بتتشاف.'
    }
  }[lang];

  /* the whole talent space, in the blueprint's menu order.
     Credits has no page yet; Activity opens the Following view for now. */
  /* 30 Oct 2026: ordered by how often a talent goes there; "Profile structure" reads as "Edit profile" */
  var items = [
    ['feed', 'feed.html', 'home'],
    ['projects', 'projects.html', 'grid'],
    /* Profile content is folded into Profile structure (brands) and Credits (recognitions), 3 Oct 2026 */
    ['structure', 'profile-structure.html', 'upen'],
    ['credits', 'credits.html', 'award'],
    ['activity', 'following.html', 'heart']
  ];

  function href(file) {
    var i = file.indexOf('#'), h = i < 0 ? '' : file.slice(i), b = i < 0 ? file : file.slice(0, i), qs = [];
    if (lang === 'ar') qs.push('lang=ar');
    if (state) qs.push('state=' + state);
    if (review) qs.push('review=1');
    if (guestView && b.indexOf('view=') < 0 && !/^(login|register|forgot-password|reset-password)\.html/.test(b)) qs.push('view=guest');
    return b + (qs.length ? (b.indexOf('?') < 0 ? '?' : '&') + qs.join('&') : '') + h;
  }
  function cur(file) { return file === here ? ' aria-current="page"' : ''; }
  /* 24 Oct 2026: one account block, the same in the desktop menu and the phone menu */
  function acct() {
    return '<span class="fx-acct"><span class="fx-av fx-av-s" aria-hidden="true">DT</span><span class="fx-who"><b>Demo talent</b><span>' + L.role + '</span></span></span>';
  }
  function list(ic) {
    return items.map(function (it) {
      return '<li><a href="' + href(it[1]) + '"' + cur(it[1]) + (L[it[0] + 'T'] ? ' title="' + L[it[0] + 'T'] + '"' : '') + '>' +
        (ic ? '<svg class="fx-icon" aria-hidden="true"><use href="#fx-i-' + it[2] + '"/></svg><span class="fx-sl">' + L[it[0]] + '</span>' : L[it[0]]) + '</a></li>';
    }).join('');
  }
  /* 30 Oct 2026: on wide screens the talent's links live in a side bar (as on Upwork and Contra).
     It folds to an icon rail; the choice is kept in this browser.
     31 Oct 2026: the project editor sits in the same shell, so it reads as part of the site. */
  var SIDE_KEY = 'fama-side-folded', side = !!document.querySelector('[data-fama-nav]:not([data-mode])'), folded = false;
  folded = true; /* folded by default; opening it is remembered in this browser */
  try { folded = localStorage.getItem(SIDE_KEY) !== '0'; } catch (e) {}
  if (side) { document.documentElement.classList.add('fx-has-side'); document.documentElement.classList.toggle('fx-folded', folded); }
  /* 30 Oct 2026, from the Contra and Upwork references: no top bar on wide screens. The side bar holds the account,
     New project and every link, in three groups; the page sits in a rounded panel beside it.
     Open, it reads like Contra (icon and name in a row); folded, like Upwork (icon over a short name). */
  function sItem(file, icon, label, extra) {
    return '<li><a href="' + href(file) + '"' + cur(file.split('#')[0]) + '>' +
      '<span class="fx-si"><svg class="fx-icon" aria-hidden="true"><use href="#fx-i-' + icon + '"/></svg>' + (extra || '') + '</span>' +
      '<span class="fx-sl">' + label + '</span></a></li>';
  }
  function sideHTML() {
    return '<aside class="fx-side" aria-label="Main">' +
      '<div class="fx-shead">' +
        '<a class="fx-slogo" href="' + href('index.html') + '" aria-label="Fama"><img class="fx-sfull" src="assets/img/fama-logo-tight.svg" alt=""><img class="fx-smark" src="assets/img/fama-emblem-rev.svg" alt=""></a>' +
        '<button type="button" class="fx-fold" id="fxFold" aria-pressed="' + folded + '"><svg class="fx-icon" aria-hidden="true"><use href="#fx-i-panel"/></svg></button>' +
      '</div>' +
      '<button type="button" class="fx-sme" id="fxSMe" aria-expanded="false" aria-controls="fxSPop">' +
        '<span class="fx-av fx-av-s" aria-hidden="true">DT</span><span class="fx-sl">Demo talent</span>' +
        '<svg class="fx-icon fx-chev" aria-hidden="true"><use href="#fx-i-chev"/></svg></button>' +
      /* 1 Nov 2026: + opens a short menu of what can be made, instead of going straight to a new project */
      '<button type="button" class="fx-snew" id="fxSNew" aria-haspopup="menu" aria-expanded="false" aria-controls="fxSNewPop"><svg class="fx-icon" aria-hidden="true"><use href="#fx-i-plus"/></svg><span class="fx-sl">' + L.create + '</span></button>' +
      '<nav class="fx-snav" aria-label="' + L.menu + '">' +
        '<ul class="fx-slinks">' +
          sItem('feed.html', 'home', L.feed) +
          sItem('notifications.html', 'bell', L.notifs, '<span class="fx-count" id="fxSCount" aria-hidden="true" hidden></span>') +
          sItem('following.html', 'heart', L.activity) +
        '</ul>' +
        '<p class="fx-sgroup">' + L.gWork + '</p><ul class="fx-slinks">' +
          sItem('projects.html', 'grid', L.projects) + sItem('credits.html', 'award', L.credits) +
        '</ul>' +
        '<p class="fx-sgroup">' + L.gProfile + '</p><ul class="fx-slinks">' +
          sItem('profile-structure.html', 'upen', L.structure) + sItem('preview.html', 'eye', L.preview) +
        '</ul>' +
      '</nav>' +
      '<div class="fx-spop" id="fxSPop" hidden>' +
        '<div class="fx-spop-h">' + acct() + '</div>' +
        '<a href="' + href('preview.html') + '"><svg class="fx-icon" aria-hidden="true"><use href="#fx-i-eye"/></svg>' + L.viewMine + '</a>' +
        '<a href="' + href('profile-structure.html') + '"><svg class="fx-icon" aria-hidden="true"><use href="#fx-i-upen"/></svg>' + L.structure + '</a>' +
        '<a class="fx-sout" href="login.html"><svg class="fx-icon" aria-hidden="true"><use href="#fx-i-out"/></svg>' + L.logout + '</a>' +
      '</div>' +
      '<div class="fx-spop fx-newpop" id="fxSNewPop" role="menu" aria-label="' + L.create + '" hidden>' +
        '<a role="menuitem" href="' + href('project-edit.html') + '"><svg class="fx-icon" aria-hidden="true"><use href="#fx-i-grid"/></svg><span><b>' + L.newProject + '</b><small>A case study for your profile</small></span></a>' +
        '<a role="menuitem" href="' + href('feed.html?new=post') + '"><svg class="fx-icon" aria-hidden="true"><use href="#fx-i-msg"/></svg><span><b>' + L.newPost + '</b><small>Share an update with your people</small></span></a>' +
        '<a role="menuitem" href="' + href('feed.html?new=photo') + '"><svg class="fx-icon" aria-hidden="true"><use href="#fx-i-image"/></svg><span><b>' + L.newMedia + '</b><small>A post that leads with pictures</small></span></a>' +
      '</div>' +
      /* 30 Oct 2026: hovering Notifications opens the latest six beside the bar; the link itself still opens the page */
      '<div class="fx-npop fx-snpop" id="fxSNPop" hidden role="region" aria-label="' + L.notifs + '">' +
        '<div class="fx-nh"><b>' + L.notifs + '</b><button type="button" class="fx-nall">Mark all as read</button></div>' +
        '<ul class="fx-nlist" id="fxSNList"></ul>' +
        '<a class="fx-nmore" href="' + href('notifications.html') + '">See all notifications</a>' +
      '</div>' +
    '</aside>';
  }

  var icons =
    '<svg width="0" height="0" style="position:absolute" aria-hidden="true">' +
    '<symbol id="fx-i-menu" viewBox="0 0 24 24"><path d="M4 6h16"/><path d="M4 12h16"/><path d="M4 18h16"/></symbol>' +
    '<symbol id="fx-i-x" viewBox="0 0 24 24"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></symbol>' +
    '<symbol id="fx-i-eye" viewBox="0 0 24 24"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></symbol>' +
    '<symbol id="fx-i-check" viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"/></symbol>' +
    '<symbol id="fx-i-bell" viewBox="0 0 24 24"><path d="M10.268 21a2 2 0 0 0 3.464 0"/><path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326"/></symbol>' +
    '<symbol id="fx-i-at" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8"/></symbol>' +
    '<symbol id="fx-i-award" viewBox="0 0 24 24"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></symbol>' +
    '<symbol id="fx-i-msg" viewBox="0 0 24 24"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></symbol>' +
    '<symbol id="fx-i-uplus" viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M19 8v6"/><path d="M22 11h-6"/></symbol>' +
    '<symbol id="fx-i-heart" viewBox="0 0 24 24"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></symbol>' +
    '<symbol id="fx-i-star" viewBox="0 0 24 24"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/></symbol>' +
    '<symbol id="fx-i-lock" viewBox="0 0 24 24"><rect width="18" height="11" x="3" y="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></symbol>' +
    '<symbol id="fx-i-arrow" viewBox="0 0 24 24"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></symbol>' +
    '<symbol id="fx-i-home" viewBox="0 0 24 24"><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></symbol>' +
    '<symbol id="fx-i-grid" viewBox="0 0 24 24"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></symbol>' +
    '<symbol id="fx-i-upen" viewBox="0 0 24 24"><path d="M11.5 15H7a4 4 0 0 0-4 4v2"/><path d="M21.378 16.626a1 1 0 0 0-3.004-3.004l-4.01 4.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z"/><circle cx="10" cy="7" r="4"/></symbol>' +
    '<symbol id="fx-i-image" viewBox="0 0 24 24"><rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></symbol>' +
    '<symbol id="fx-i-plus" viewBox="0 0 24 24"><path d="M5 12h14"/><path d="M12 5v14"/></symbol>' +
    '<symbol id="fx-i-chev" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></symbol>' +
    '<symbol id="fx-i-out" viewBox="0 0 24 24"><path d="m16 17 5-5-5-5"/><path d="M21 12H9"/><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/></symbol>' +
    '<symbol id="fx-i-panel" viewBox="0 0 24 24"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 3v18"/></symbol>' +
    '<symbol id="fx-i-ext" viewBox="0 0 24 24"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></symbol>' +
    '</svg>';

  /* notifications — placeholder data. Read state is kept in this browser (prototype only). */
  var NOTIFS = [
    { id: 'n1', t: 'mention', who: 'Lina Haddad', txt: 'mentioned you in a post', ex: 'New story for @maison-nour, shot at golden hour with @demo-talent\u2026', url: 'post.html?id=4812', ago: '12m', day: 0 },
    { id: 'n2', t: 'credit', who: 'Hana Mostafa', txt: 'credited you on Zeina Swim \u2014 2027', ex: 'Confirm it to add it to your profile.', url: 'credits.html', ago: '1h', day: 0 },
    { id: 'n3', t: 'comment', who: 'Karim F.', txt: 'commented on your post', ex: '\u201cWhich archive was the double-breasted from?\u201d', url: 'post.html?id=4799', ago: '3h', day: 0 },
    { id: 'n4', t: 'mention', who: 'Omar Saleh', txt: 'mentioned you in a comment', ex: '@demo-talent pulled the whole rail in forty seconds.', url: 'post.html?id=4807', ago: '5h', day: 0 },
    { id: 'n5', t: 'follow', who: 'Mariam Fouad', txt: 'started following you', ex: '', url: 'preview.html?view=guest', ago: '1d', day: 1 },
    { id: 'n6', t: 'like', who: 'Rania K.', txt: 'and 12 others liked your post', ex: 'Rail to set in forty seconds.', url: 'post.html?id=4799', ago: '1d', day: 1 },
    { id: 'n8', t: 'credit-ok', who: 'Karim F.', txt: 'sees you confirmed the Atlas Watches credit', ex: 'It now shows in your Styling tab.', url: 'credits.html', ago: '6d', day: 6 },
    { id: 'n9', t: 'system', who: 'Fama', txt: 'listed your profile in the Creatives Index', ex: 'Brands can find you when they search now.', url: 'index.html', ago: '2w', day: 14 }
  ];
  var READ_KEY = 'fama-notif-read-v1', read = {};
  try { read = JSON.parse(localStorage.getItem(READ_KEY) || '{}'); } catch (e) {}
  if (!read.__seeded) { read = { n5: 1, n6: 1, n7: 1, n8: 1, n9: 1, __seeded: 1 }; } /* the older ones start read */
  function saveRead() { try { localStorage.setItem(READ_KEY, JSON.stringify(read)); } catch (e) {} }
  var NI = { mention: 'fx-i-at', credit: 'fx-i-award', 'credit-ok': 'fx-i-award', comment: 'fx-i-msg', follow: 'fx-i-uplus', like: 'fx-i-heart', review: 'fx-i-star', system: 'fx-i-check' };
  window.FAMA_NOTIFS = {
    all: function () { return NOTIFS; },
    isRead: function (id) { return !!read[id]; },
    unread: function () { return NOTIFS.filter(function (n) { return !read[n.id]; }).length; },
    read: function (id) { read[id] = 1; saveRead(); paintBell(); },
    readAll: function () { NOTIFS.forEach(function (n) { read[n.id] = 1; }); saveRead(); paintBell(); },
    icon: function (n) { return NI[n.t]; },
    href: function (u) { return href(u); }
  };
  function notifItem(n) {
    var unread = !read[n.id];
    return '<li><a class="fx-n' + (unread ? ' unread' : '') + '" href="' + href(n.url) + '" data-nid="' + n.id + '">' +
      '<span class="fx-nic" aria-hidden="true"><svg class="fx-icon"><use href="#' + NI[n.t] + '"/></svg></span>' +
      '<span class="fx-nb"><span><b>' + n.who + '</b> ' + n.txt + '</span>' + (n.ex ? '<span class="fx-nex">' + n.ex + '</span>' : '') +
      '<span class="fx-nago">' + n.ago + (unread ? '<span class="fx-vh"> \u00b7 unread</span>' : '') + '</span></span>' +
      (unread ? '<span class="fx-ndot" aria-hidden="true"></span>' : '') + '</a></li>';
  }
  function paintBell() {
    var b = document.getElementById('fxBell'); if (!b) return;
    var u = window.FAMA_NOTIFS.unread(), c = b.querySelector('.fx-count');
    c.textContent = u > 9 ? '9+' : u; c.hidden = !u;
    var sc = document.getElementById('fxSCount'); if (sc) { sc.textContent = c.textContent; sc.hidden = !u; }
    b.setAttribute('aria-label', 'Notifications' + (u ? ', ' + u + ' unread' : ''));
    var html = NOTIFS.slice(0, 6).map(notifItem).join('');
    ['fxNList', 'fxSNList'].forEach(function (id) { var l = document.getElementById(id); if (l) l.innerHTML = html; });
  }

  var navHTML =
    icons +
    '<div class="fx-wrap fx-in">' +
      '<a class="fx-logo" href="' + href('index.html') + '"><img src="assets/img/fama-logo-tight.svg" alt="Fama"></a>' +
      '<ul class="fx-links">' + list() + '</ul>' +
      '<div class="fx-end">' +
        '<a class="fx-preview" href="' + href('preview.html') + '"' + cur('preview.html') + '>' +
          '<svg class="fx-icon" aria-hidden="true"><use href="#fx-i-eye"/></svg><span class="fx-lbl">' + L.preview + '</span></a>' +
        '<div class="fx-bellw">' +
          '<button class="fx-bell" id="fxBell" aria-expanded="false" aria-controls="fxNPop" aria-label="Notifications">' +
            '<svg class="fx-icon" aria-hidden="true"><use href="#fx-i-bell"/></svg><span class="fx-count" aria-hidden="true"></span></button>' +
          '<div class="fx-npop" id="fxNPop" hidden role="region" aria-label="Notifications">' +
            '<div class="fx-nh"><b>Notifications</b><button type="button" id="fxNAll">Mark all as read</button></div>' +
            '<ul class="fx-nlist" id="fxNList"></ul>' +
            '<a class="fx-nmore" href="' + href('notifications.html') + '">See all notifications</a>' +
          '</div>' +
        '</div>' +
        '<div class="fx-me">' +
          '<button class="fx-av" id="fxMe" aria-expanded="false" aria-controls="fxPop" aria-label="' + L.account + '">DT</button>' +
          '<ul class="fx-pop" id="fxPop" hidden>' +
            '<li><a class="fx-acct-link" href="' + href('preview.html') + '">' + acct() + '<span class="fx-acct-go">' + L.viewMine + '</span></a></li>' +
            '<li><a class="fx-out" href="login.html">' + L.logout + '</a></li>' +
          '</ul>' +
        '</div>' +
        '<button class="fx-burger" id="fxBurger" aria-expanded="false" aria-controls="fxDrawer" aria-label="' + L.menu + '">' +
          '<svg class="fx-icon"><use href="#fx-i-menu"/></svg></button>' +
      '</div>' +
    '</div>' +
    /* 24 Oct 2026: the menu opens over the page (it no longer pushes it down) and carries the account,
       so phones need one menu, not two */
    '<div class="fx-dwrap"><nav class="fx-drawer" id="fxDrawer" hidden aria-label="' + L.menu + '"><div class="fx-wrap"><ul>' + list(true) + '</ul>' +
      '<div class="fx-dacc">' + acct() + '<a class="fx-dlink fx-out" href="login.html">' + L.logout + '</a></div>' +
    '</div></nav></div>' +
    notice();

  /* fixed notice under the nav until the profile is sent for review. It can't be dismissed. */
  function notice() {
    var K = { incomplete: 'gIncomplete' }[state];
    if (!K) return '';
    var icon = state === 'approved' ? 'fx-i-check' : 'fx-i-lock';
    return '<div class="fx-notice" role="region" aria-label="' + L.gLabel + '"><div class="fx-wrap fx-in">' +
      '<svg class="fx-icon" aria-hidden="true"><use href="#' + icon + '"/></svg>' +
      '<p><span class="fx-long">' + L[K] + '</span><span class="fx-short">' + L[K + 'Short'] + '</span></p>' +
      '<a class="fx-ncta" href="' + href('profile-structure.html#gate') + '">' + L[K + 'Cta'] +
      '<svg class="fx-icon fx-flip" aria-hidden="true"><use href="#fx-i-arrow"/></svg></a>' +
    '</div></div>';
  }

  var footHTML =
    '<div class="fx-wrap"><div class="fx-in">' +
      '<img src="assets/img/fama-logo-tight.svg" alt="Fama">' +
      '<span>© ' + new Date().getFullYear() + ' ' + L.brand + '. ' + L.foot + '</span>' +
    '</div></div>';

  var nav = document.querySelector('[data-fama-nav]');
  if (nav && (nav.dataset.mode === 'public' || nav.dataset.mode === 'auth')) {
    var auth = nav.dataset.mode === 'auth';
    /* signed-out headers: every way to the feed opens it as a visitor */
    var ph = document.createElement('header');
    ph.className = 'fx-nav';
    ph.innerHTML = icons + '<div class="fx-wrap fx-in">' +
      '<a class="fx-logo" href="' + href('feed.html?view=guest') + '"><img src="assets/img/fama-logo-tight.svg" alt="Fama"></a>' +
      /* sign-in pages: no nav tabs, just a quiet way out for someone who only wants to look */
      (auth ? '<div class="fx-end"><a class="fx-browse" href="' + href('feed.html?view=guest') + '"><span class="fx-lbl2">Just looking? </span><b>Browse the feed</b>' +
        '<svg class="fx-icon fx-flip" aria-hidden="true"><use href="#fx-i-arrow"/></svg></a></div>' : '<ul class="fx-links fx-keep"><li><a href="' + href('feed.html?view=guest') + '"' + cur('feed.html') + '>' + L.feed + '</a></li></ul>' +
      '<div class="fx-end"><a class="fx-preview fx-login" href="' + href('login.html') + '"' + cur('login.html') + '>' + L.login + '</a>' +
      '<a class="fx-join" href="' + href('register.html') + '">' + L.joinShort + '</a></div>') + '</div>';
    nav.replaceWith(ph);
    nav = null;
  }
  if (nav) {
    var header = document.createElement('header');
    header.className = 'fx-nav';
    header.innerHTML = navHTML;
    nav.replaceWith(header);
    if (side) {
      header.insertAdjacentHTML('beforebegin', sideHTML());
      var fold = document.getElementById('fxFold');
      var paintFold = function () {
        fold.setAttribute('aria-pressed', String(folded));
        fold.setAttribute('aria-label', (folded ? L.unfold : L.fold) + ' the menu');
        fold.dataset.tip = (folded ? L.unfold : L.fold) + ' the menu';
      };
      paintFold();
      fold.addEventListener('click', function () {
        folded = !folded;
        document.documentElement.classList.add('fx-side-anim'); /* the fold animates; the first paint does not */
        document.documentElement.classList.toggle('fx-folded', folded);
        try { localStorage.setItem(SIDE_KEY, folded ? '1' : '0'); } catch (e) {}
        paintFold();
        setTimeout(function () { window.dispatchEvent(new Event('resize')); }, 260); /* banners refit their star once the fold settles */
      });
      /* the account menu opens beside the bar (as on Upwork), lined up with the account button */
      var sme = document.getElementById('fxSMe'), spop = document.getElementById('fxSPop');
      var closeS = function () { if (spop.hidden) return; (window.FX_SHUT ? window.FX_SHUT(spop) : (spop.hidden = true)); sme.setAttribute('aria-expanded', 'false'); };
      sme.addEventListener('click', function (e) {
        e.stopPropagation();
        if (!spop.hidden) return closeS();
        var r = sme.getBoundingClientRect();
        spop.style.top = r.top + 'px';
        spop.classList.remove('is-closing'); spop.hidden = false; sme.setAttribute('aria-expanded', 'true');
        var f = spop.querySelector('a'); if (f) f.focus();
      });
      document.addEventListener('click', function (e) { if (!spop.contains(e.target)) closeS(); });
      document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !spop.hidden) { closeS(); sme.focus(); } });

      /* Create menu: opens beside the bar, lined up with the + button */
      var snew = document.getElementById('fxSNew'), snewPop = document.getElementById('fxSNewPop');
      var closeNew = function () { if (snewPop.hidden) return; (window.FX_SHUT ? window.FX_SHUT(snewPop) : (snewPop.hidden = true)); snew.setAttribute('aria-expanded', 'false'); };
      snew.addEventListener('click', function (e) {
        e.stopPropagation(); closeS();
        if (!snewPop.hidden) return closeNew();
        snewPop.style.top = snew.getBoundingClientRect().top + 'px';
        snewPop.classList.remove('is-closing'); snewPop.hidden = false; snew.setAttribute('aria-expanded', 'true');
        snewPop.querySelector('a').focus();
      });
      snewPop.addEventListener('keydown', function (e) {
        var it = [].slice.call(snewPop.querySelectorAll('a')), i = it.indexOf(document.activeElement);
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); it[(i + (e.key === 'ArrowDown' ? 1 : -1) + it.length) % it.length].focus(); }
      });
      document.addEventListener('click', function (e) { if (!snewPop.contains(e.target)) closeNew(); });
      document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !snewPop.hidden) { closeNew(); snew.focus(); } });

      /* notifications on hover: opens after a short wait (so passing over it does nothing), and stays open
         while the pointer moves from the link into the panel */
      var nlink = document.querySelector('.fx-slinks a[href^="notifications.html"]'), snpop = document.getElementById('fxSNPop'), nT;
      if (nlink && here !== 'notifications.html') {
        nlink.setAttribute('aria-haspopup', 'true'); nlink.setAttribute('aria-expanded', 'false');
        var openN = function () {
          clearTimeout(nT); if (!snpop.hidden) return;
          var r = nlink.getBoundingClientRect();
          snpop.style.top = Math.max(8, Math.min(r.top - 8, window.innerHeight - 560)) + 'px';
          snpop.classList.remove('is-closing'); snpop.hidden = false; nlink.setAttribute('aria-expanded', 'true');
        };
        var shutN = function () { clearTimeout(nT); if (snpop.hidden) return; (window.FX_SHUT ? window.FX_SHUT(snpop) : (snpop.hidden = true)); nlink.setAttribute('aria-expanded', 'false'); };
        var later = function (fn, ms) { return function () { clearTimeout(nT); nT = setTimeout(fn, ms); }; };
        nlink.addEventListener('mouseenter', later(openN, 120));
        nlink.addEventListener('mouseleave', later(shutN, 220));
        snpop.addEventListener('mouseenter', function () { clearTimeout(nT); });
        snpop.addEventListener('mouseleave', later(shutN, 220));
        /* keyboard: the down arrow opens it from the link */
        nlink.addEventListener('keydown', function (e) { if (e.key === 'ArrowDown') { e.preventDefault(); openN(); var f = snpop.querySelector('a'); if (f) f.focus(); } });
        snpop.addEventListener('focusout', function (e) { if (!snpop.contains(e.relatedTarget) && e.relatedTarget !== nlink) shutN(); });
        document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !snpop.hidden) { shutN(); nlink.focus(); } });
        snpop.addEventListener('click', function (e) {
          var a = e.target.closest('[data-nid]'); if (a) window.FAMA_NOTIFS.read(a.dataset.nid);
          if (e.target.closest('.fx-nall')) { e.stopPropagation(); window.FAMA_NOTIFS.readAll(); }
        });
      }
    }

    var me = document.getElementById('fxMe'), pop = document.getElementById('fxPop');
    var burger = document.getElementById('fxBurger'), drawer = document.getElementById('fxDrawer');
    function closePop() { (window.FX_SHUT ? window.FX_SHUT(pop) : (pop.hidden = true)); me.setAttribute('aria-expanded', 'false'); }
    me.addEventListener('click', function (e) {
      e.stopPropagation();
      if (pop.hidden) { pop.classList.remove('is-closing'); pop.hidden = false; me.setAttribute('aria-expanded', 'true'); } else closePop();
    });
    /* closes play a short exit (150ms) before the element is hidden; opens animate in CSS */
    function shut(el, done) {
      if (el.hidden || el.classList.contains('is-closing')) return;
      if (matchMedia('(prefers-reduced-motion: reduce)').matches) { el.hidden = true; if (done) done(); return; }
      el.classList.add('is-closing');
      setTimeout(function () { el.classList.remove('is-closing'); el.hidden = true; if (done) done(); }, 150);
    }
    window.FX_SHUT = shut;
    function setDrawer(open) {
      if (open) { drawer.classList.remove('is-closing'); drawer.hidden = false; } else shut(drawer);
      burger.setAttribute('aria-expanded', String(open));
      var ic = burger.querySelector('svg');
      burger.querySelector('use').setAttribute('href', open ? '#fx-i-x' : '#fx-i-menu');
      ic.classList.remove('is-swap'); void ic.getBoundingClientRect(); ic.classList.add('is-swap');
      document.documentElement.classList.toggle('fx-menu-open', open);
    }
    burger.addEventListener('click', function (e) { e.stopPropagation(); setDrawer(drawer.hidden); if (!drawer.hidden) { var a = drawer.querySelector('a'); if (a) a.focus(); } });
    document.addEventListener('click', function (e) { if (!drawer.hidden && !drawer.contains(e.target)) setDrawer(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !drawer.hidden) { setDrawer(false); burger.focus(); } });
    window.addEventListener('resize', function () { if (!drawer.hidden && window.innerWidth > 1100) setDrawer(false); });
    document.addEventListener('click', function (e) { if (!pop.contains(e.target)) closePop(); });

    /* notifications: the bell opens the latest six; opening one marks it read */
    var bell = document.getElementById('fxBell'), npop = document.getElementById('fxNPop');
    function closeN() { (window.FX_SHUT ? window.FX_SHUT(npop) : (npop.hidden = true)); bell.setAttribute('aria-expanded', 'false'); }
    paintBell();
    bell.addEventListener('click', function (e) {
      e.stopPropagation(); closePop();
      if (npop.hidden) { npop.classList.remove('is-closing'); npop.hidden = false; bell.setAttribute('aria-expanded', 'true'); var f = npop.querySelector('a'); if (f) f.focus(); } else closeN();
    });
    me.addEventListener('click', closeN);
    npop.addEventListener('click', function (e) {
      var a = e.target.closest('[data-nid]'); if (a) window.FAMA_NOTIFS.read(a.dataset.nid);
      if (e.target.id === 'fxNAll') { e.stopPropagation(); window.FAMA_NOTIFS.readAll(); }
    });
    document.addEventListener('click', function (e) { if (!npop.contains(e.target) && e.target !== bell) closeN(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !npop.hidden) { closeN(); bell.focus(); } });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !pop.hidden) { closePop(); me.focus(); }
    });
  }

  /* 30 Oct 2026: the header lifts off the page once it scrolls under it */
  (function () { var h = document.querySelector('.fx-nav'); if (!h) return; var on = function () { h.classList.toggle('fx-lifted', scrollY > 4); }; on(); addEventListener('scroll', on, { passive: true }); })();

  /* carry ?state= (and a visitor's ?view=guest) through links the page builds itself */
  if (state || guestView) document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a) return;
    var u = a.getAttribute('href');
    if (/^[\w-]+\.html/.test(u) && u.indexOf('state=') < 0 && u.indexOf('view=') < 0 && u.indexOf('states.html') !== 0) a.setAttribute('href', href(u));
  }, true);

  /* client review bar: which approval state this is, with the previous and next ones */
  if (review && state) {
    var ORDER = [['incomplete', 'Not in the Creatives Index yet'], ['complete', 'Listed in the Creatives Index']];
    var at = ORDER.map(function (x) { return x[0]; }).indexOf(state);
    var go = function (i) { var q = new URLSearchParams(location.search); q.set('state', ORDER[i][0]); return here + '?' + q.toString(); };
    var bar = document.createElement('div');
    bar.className = 'fx-review'; bar.setAttribute('role', 'region'); bar.setAttribute('aria-label', 'Client review, not part of the design');
    bar.innerHTML =
      '<span class="fx-rtag">Client review \u00b7 not part of the design</span>' +
      '<span class="fx-rnow">' +
        (at > 0 ? '<a href="' + go(at - 1) + '">\u2190 Previous</a>' : '<span class="fx-roff">\u2190 Previous</span>') +
        '<b>State ' + (at + 1) + ' of ' + ORDER.length + ': ' + ORDER[at][1] + '</b>' +
        (at < ORDER.length - 1 ? '<a href="' + go(at + 1) + '">Next \u2192</a>' : '<span class="fx-roff">Next \u2192</span>') +
      '</span>' +
      '<a href="states.html" class="fx-rall">All states</a>';
    document.body.insertBefore(bar, document.body.firstChild);
  }

  var foot = document.querySelector('[data-fama-foot]');
  if (foot) {
    var footer = document.createElement('footer');
    footer.className = 'fx-foot';
    footer.innerHTML = footHTML;
    foot.replaceWith(footer);
  }
  /* page hero: the purple opening block, one per page */

/* famaStar(banner, textBox, photo): a photo clipped to the brand star, drawn as SVG on the right of a soft banner.
   The star fills the banner's height and is cut flat at the top and bottom; on a narrow banner it shrinks
   (showing more of its points) so it never covers the text and never runs off the right edge. */
window.famaStar = (function () {
  var PTS = '314.63 635.59 16.74 747.68 217.29 533.15 86.97 370.29 403.26 356.02 701.63 87.21 636.51 355.76 760 356.91 574.68 534.04 422.33 756.79',
      X0 = 16.74, Y0 = 87.21, VW = 743.26, VH = 669.58,
      BAND = 2.55,   /* star width ÷ banner height at full size */
      GAP = 26, TEXT = 340, SPACE = 32, MOB = 342,
      FOCUS = { feed: [.52, .45], activity: [.5, .45], notifications: [.55, .5], projects: [.42, .5], credits: [.5, .35], 'profile-structure': [.55, .4] },
      NS = 'http://www.w3.org/2000/svg', n = 0;
  return function (sec, hb, photo, opts) {
    var minText = (opts && opts.text) || TEXT;
    var name = (photo.match(/([\w-]+?)(-star)?\.(png|jpg)$/) || [])[1] || '', src = photo.replace(/-star\.png$/, '.jpg') + '?v=6', /* v=2: real photos replaced the generated ones (24 Oct 2026) */
        f = FOCUS[name] || [.5, .5], id = 'fxstar' + (++n);
    sec.style.backgroundImage = 'none';
    var svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('class', 'fx-star'); svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('viewBox', X0 + ' ' + Y0 + ' ' + VW + ' ' + VH); svg.setAttribute('preserveAspectRatio', 'xMidYMid slice');
    svg.innerHTML = '<defs><clipPath id="' + id + '"><polygon points="' + PTS + '"/></clipPath></defs>' +
      /* a clipping mask: the photo always covers the whole star (slice), never stretched, whatever its proportions */
      '<image href="' + src + '" preserveAspectRatio="xMidYMid slice" clip-path="url(#' + id + ')"/>' +
      '<polygon points="' + PTS + '" fill="none" stroke="#FFEB73" stroke-width="3" stroke-linejoin="round" vector-effect="non-scaling-stroke"/>';
    sec.appendChild(svg);
    var img = svg.querySelector('image');
    function place(w, h) {
      svg.style.width = w + 'px'; svg.style.height = h + 'px';
      var k = Math.max(w / VW, h / VH), vw = w / k, vh = h / k, vx = X0 + (VW - vw) / 2, vy = Y0 + (VH - vh) / 2,
          s = Math.max(vw, vh) * 1.02, x = vx + vw / 2 - s * f[0], y = vy + vh / 2 - s * f[1];
      x = Math.min(vx, Math.max(vx + vw - s, x)); y = Math.min(vy, Math.max(vy + vh - s, y));
      img.setAttribute('x', x); img.setAttribute('y', y); img.setAttribute('width', s); img.setAttribute('height', s);
    }
    function fit() {
      var W, H, w;
      /* 23 Oct 2026: on a phone the star keeps its own shape (it was squeezed into a wide strip and lost its points).
         It is big and runs off the top right corner on purpose (see .fx-star in shell.css), so the photo reads */
      if (window.innerWidth <= 760) { hb.style.paddingRight = ''; place(MOB * VW / VH, MOB); return; }
      for (var i = 0; i < 4; i++) {
        W = sec.offsetWidth; H = sec.offsetHeight;
        w = Math.min(H * BAND, W - parseFloat(getComputedStyle(hb).paddingLeft) - minText - SPACE - GAP);
        hb.style.paddingRight = (w + SPACE + GAP) + 'px';
      }
      place(w, sec.offsetHeight);
    }
    requestAnimationFrame(fit); window.addEventListener('resize', fit);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);
    /* pages fill in their text and buttons after the banner is built (translations), so fit again when they change */
    var queued = false;
    if (window.MutationObserver) new MutationObserver(function () {
      if (queued) return; queued = true;
      requestAnimationFrame(function () { queued = false; fit(); });
    }).observe(hb, { childList: true, subtree: true, characterData: true });
  };
})();

  var heroSlot = document.querySelector('[data-fama-hero]');
  if (heroSlot) {
    var d = heroSlot.dataset, wrap = document.createElement('div');
    wrap.className = 'fx-hero-wrap';
    /* data-tone="soft" (cream) and data-photo="…" (a photo inside the star, right side) are opt-in per page */
    var cls = 'fx-hero' + (d.tone === 'soft' ? ' fx-soft' : '') + (d.photo ? ' fx-photo' : '');
    wrap.innerHTML =
      '<section class="' + cls + '"><div class="fx-hb"><div>' +
        (d.label ? '<span class="fx-hl">' + d.label + '</span>' : '') +
        '<h1>' + d.title + '</h1>' +
        (d.lead ? '<p class="fx-lead">' + d.lead + '</p>' : '') +
      '</div><div class="fx-ha"></div></div>' + (d.photo ? '' : '<div class="fx-band" role="presentation"></div>') + '</section>';
    var actions = wrap.querySelector('.fx-ha');
    /* photo banner: the photo sits inside a big brand star on the right (see window.famaStar) */
    if (d.photo) window.famaStar(wrap.querySelector('.fx-hero'), wrap.querySelector('.fx-hb'), d.photo);
    while (heroSlot.firstChild) actions.appendChild(heroSlot.firstChild);
    heroSlot.replaceWith(wrap);
  }
})();
