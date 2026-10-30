/* FAMA — the talent's profile, one copy shared by Profile structure (which edits it)
   and Preview (which shows it). Prototype only: it lives in this browser's localStorage,
   so an edit in Profile structure shows up in Preview. ?reset=1 on any page starts over.
   Needs assets/js/skills.js first. */
(function () {
  'use strict';
  var KEY = 'fama-profile-v1';
  /* after the skill tabs, always in this order. No Credits section (7 Oct 2026): a confirmed credit makes the talent a co-owner,
     so the project shows with their other projects, in the tab of its skill. */
  var PW = ['recognitions', 'brands', 'explore']; /* reviews dropped for Recognitions, 12 Oct 2026 */
  function def() {
    var p = {
      display: 'Demo talent', user: 'demo-talent', headline: 'Art director & stylist',
      bio: 'Stylist and art director based in Cairo, working on campaigns for local and regional brands.',
      pov: 'I notice fabric before colour. If the cloth isn’t at ease on the body, the whole picture looks forced.',
      city: 'Cairo', country: 'Egypt', taking: true, travel: false,
      links: [{ u: 'https://instagram.com/demotalent' }, { u: 'https://behance.net/demotalent' }, { u: 'https://demotalent.studio' }],
      skills: [
        { id: 'styling', primary: true, specs: ['fashion', 'menswear'] },
        { id: 'modelling', primary: false, specs: ['commercial-and-lifestyle'] },
        { id: 'photography', primary: false, specs: ['fashion', 'portrait'] }
      ],
      place: 'below', /* fixed: the work leads, the rest follows */
      groups: { pw: [{ b: 'recognitions', v: true }, { b: 'brands', v: true }, { b: 'explore', v: true }] },
      /* each skill's custom fields (assets/js/fields.js), once per profile */
      fields: {
        height: 178, measure: { chest: 92, waist: 76, hips: 94, inseam: 82 }, sizes: { r: 'EU', c: '48', s: '43' },
        digitals: { d: '2026-09-12' }, comfort: { a: ['Short sleeves', 'Fitted cuts'], b: ['Closed set'] },
        sourcing: ['Brand showrooms', 'Multi-brand boutiques', 'Private archive']
      },
      wte: [{ s: 'creative', sp: 'campaigns', n: 'I’d like to lead a full campaign concept' }],
      /* experience (9 Oct 2026, LinkedIn-style roles): kept under the key `brands` so saved profiles carry over.
         t = job title, n = company or brand, et = employment type, loc = location, lt = location type,
         sm/sy = start month/year, em/ey = end month/year, cur = works here now, hl = highlights (one per line), sk = skill ids */
      brands: [
        { t: 'In-house stylist', n: 'Maison Nour', et: 'Part-time', loc: 'Cairo', lt: 'Hybrid', sm: 2, sy: 2025, em: 0, ey: 0, cur: true, sk: ['styling'],
          hl: 'Style every season’s lookbook and e-commerce shoots\nPull and fit samples from the atelier and partner showrooms\nLead stylist on Desert Light — 2026' },
        { t: 'Lead stylist', n: 'Nefertari Cosmetics', et: 'Freelance', loc: 'Cairo', lt: 'On-site', sm: 1, sy: 2026, em: 3, ey: 2026, cur: false, sk: ['styling', 'modelling'],
          hl: '2026 campaign: twelve looks across beauty and fashion\nCast and fitted four models in two days' },
        { t: 'Stylist', n: 'Nomad Coffee Co.', et: 'Freelance', loc: 'Cairo', lt: 'On-site', sm: 9, sy: 2025, em: 10, ey: 2025, cur: false, sk: ['styling'], hl: 'Autumn launch campaign, in store and online' },
        { t: 'Stylist', n: 'Cairo Linen', et: 'Contract', loc: 'Cairo', lt: 'On-site', sm: 3, sy: 2025, em: 5, ey: 2025, cur: false, sk: ['styling'], hl: 'Heritage collection lookbook' },
        { t: 'Wardrobe assistant', n: 'Cairo Linen', et: 'Contract', loc: 'Cairo', lt: 'On-site', sm: 6, sy: 2023, em: 12, ey: 2024, cur: false, sk: ['styling'], hl: '' },
        { t: 'Art director', n: 'El Gouna Resorts', et: 'Contract', loc: 'El Gouna', lt: 'Remote', sm: 3, sy: 2024, em: 6, ey: 2024, cur: false, sk: [], hl: 'Resort lookbook, from concept to the final edit' }
      ]
    };
    p.featured = 'desert-light'; /* the project that opens the profile; '' lets Fama show the latest (featured.js) */
    p.skills.forEach(function (s) { p.groups[s.id] = window.FAMA_SKILL[s.id].blocks.map(function (b) { return { b: b, v: true }; }); });
    return p;
  }
  /* 24 Oct 2026: seasons read as plain years (SS26 is 2026, ’24 is 2024); copies saved before that are read the new way */
  var years = window.FAMA_YEARS = function (s) {
    return s == null ? s : String(s).replace(/Resort 26\b/g, 'Red Sea 2026').replace(/\b(?:SS|AW|FW)(\d\d)\b/g, '20$1').replace(/(?:\u2019|\\u2019)(2\d)\b/g, '20$1');
  };
  var store = { get: function () { try { return years(localStorage.getItem(KEY)); } catch (e) { return null; } },
    set: function (v) { try { localStorage.setItem(KEY, v); } catch (e) {} },
    del: function () { try { localStorage.removeItem(KEY); } catch (e) {} } };
  var CKEY = 'fama-credits-v2'; /* v2: more examples waiting for a yes */
  if (new URLSearchParams(location.search).get('reset') === '1') { store.del(); try { localStorage.removeItem(CKEY); } catch (e) {} }

  window.FAMA_PROFILE = {
    load: function () {
      var p = def(), s = store.get();
      if (s) { try { var saved = JSON.parse(s); for (var k in saved) p[k] = saved[k]; } catch (e) {} }
      if (!p.fields || typeof p.fields !== 'object') p.fields = {};
      /* old entries (company, role, project, year) become roles */
      p.brands = (p.brands || []).map(function (b) {
        if (b.t != null) return b;
        var y = parseInt(b.y, 10) || 0;
        return { t: b.r || '', n: b.n || '', et: '', loc: '', lt: '', sm: 0, sy: y, em: 0, ey: y, cur: false, sk: [], hl: b.p || '' };
      });
      p.links = (p.links || []).filter(function (l) { return l.u || l.h; }).map(function (l) { return { u: l.u || l.h }; });
      /* a skill that no longer exists in skills.js is dropped, with its sections */
      p.skills = p.skills.filter(function (x) { return window.FAMA_SKILL[x.id]; });
      /* no primary skill (7 Oct 2026): the order of the skills is the order of the profile tabs, and the first opens first.
         A profile saved before that keeps its primary skill in front, once. `primary` stays true on the first one for older readers. */
      if (!p.ordered) {
        var pi = -1; p.skills.forEach(function (x, i) { if (x.primary && pi < 0) pi = i; });
        if (pi > 0) p.skills.unshift(p.skills.splice(pi, 1)[0]);
        p.ordered = true;
      }
      p.skills.forEach(function (x, i) { x.primary = i === 0; });
      /* one standard layout for every profile (3 Oct 2026): sections can be switched off, never moved or reordered.
         Whatever order was saved before, rebuild it in the standard order and keep only the on/off choice. */
      var was = {};
      Object.keys(p.groups || {}).forEach(function (g) { (p.groups[g] || []).forEach(function (x) { was[g + ':' + x.b] = x.v; }); });
      var keep = function (g, b) { var k = g + ':' + b; return k in was ? was[k] : true; };
      p.place = 'below';
      p.groups = { pw: PW.map(function (b) { return { b: b, v: keep('pw', b) }; }) };
      p.skills.forEach(function (sk) { p.groups[sk.id] = window.FAMA_SKILL[sk.id].blocks.map(function (b) { return { b: b, v: keep(sk.id, b) }; }); });
      return p;
    },
    save: function (p) { store.set(JSON.stringify(p)); }
  };

  /* credits: other people's projects that name this talent. Waiting ones need the talent's yes;
     confirmed ones show in that skill's tab, or in the profile-wide area if the talent doesn't hold the skill. */
  function cdef() {
    return {
      waiting: [
        { id: 'resort', p: 'Maison Nour \u2014 Red Sea 2026', slug: 'resort26', who: 'Lina Haddad', skill: 'styling', role: 'Lead stylist' },
        { id: 'noon', p: 'Noon Beauty launch', slug: 'noon', who: 'Rania K.', skill: 'makeup', role: 'Makeup assistant' },
        { id: 'zeina', p: 'Zeina Swim \u2014 2027', slug: 'zeina-ss27', who: 'Hana Mostafa', skill: 'modelling', role: 'Model' },
        { id: 'nile', p: 'Nile Studio lookbook', slug: 'nile-lookbook', who: 'Mariam Fouad', skill: 'photography', role: 'Second photographer' },
        { id: 'carmen', p: 'Carmen at the Cairo Opera', slug: 'carmen', who: 'Yara Adel', skill: 'costume', role: 'Wardrobe assistant' }
      ],
      confirmed: [
        { id: 'atlas', p: 'Atlas Watches \u2014 Winter', slug: 'atlas', who: 'Karim F.', skill: 'styling', role: 'Stylist', d: '2026-08-02' },
        { id: 'cfw25', p: 'Cairo Fashion Week 2025 backstage', slug: 'cfw25', who: 'Omar Saleh', skill: 'hair', role: 'Hair assistant', d: '2026-06-14' }
      ]
    };
  }
  window.FAMA_CREDITS = {
    load: function () { try { var s = years(localStorage.getItem(CKEY)); if (s) return JSON.parse(s); } catch (e) {} return cdef(); },
    save: function (c) { try { localStorage.setItem(CKEY, JSON.stringify(c)); } catch (e) {} }
  };

  /* recognitions: what peers say about the talent. Managed in Credits (3 Oct 2026, was Profile content);
     the talent can hide one from the profile and show it again. */
  var RKEY = 'fama-recs-v1';
  if (new URLSearchParams(location.search).get('reset') === '1') { try { localStorage.removeItem(RKEY); } catch (e) {} }
  function rdef() {
    return [
      { id: 'r1', q: 'Finds the story in a rail of clothes before anyone else does.', who: 'Omar Saleh', role: 'Photographer · shot three campaigns together', d: '2026-09-21' },
      { id: 'r2', q: 'Generous with credit and exact about fit. Every look arrives pressed and labelled.', who: 'Rania K.', role: 'Makeup artist · Nefertari 2026', d: '2026-09-02' },
      { id: 'r3', q: 'Calm under a tight call sheet. The rail was ready before we were.', who: 'Mariam Fouad', role: 'Creative director · Studio Nile', d: '2026-08-18' },
      { id: 'r4', q: 'Knows Cairo’s archives better than anyone. Pulled pieces we didn’t know existed.', who: 'Karim F.', role: 'Director · Atlas Watches', d: '2026-07-30' },
      { id: 'r5', q: 'Thinks like an art director, works like a producer.', who: 'Hana Mostafa', role: 'Producer · Cairo Films', d: '2026-07-04' },
      { id: 'r6', q: 'The best eye for menswear I’ve worked with in the region.', who: 'Tarek Sobhy', role: 'Photographer', d: '2026-06-11' }
    ];
  }
  window.FAMA_RECS = {
    load: function () { try { var s = years(localStorage.getItem(RKEY)); if (s) return JSON.parse(s); } catch (e) {} return rdef(); },
    save: function (r) { try { localStorage.setItem(RKEY, JSON.stringify(r)); } catch (e) {} }
  };


  /* social links: the talent pastes a link, the platform is worked out from it, and the profile shows its icon.
     Brand marks from Simple Icons (CC0), filled on a 24px grid. Anything else is a website, shown with Lucide's globe. */
  var SOC = [
    { id: 'instagram', name: 'Instagram', hosts: ['instagram.com', 'instagr.am'], d: 'M7.0301.084c-1.2768.0602-2.1487.264-2.911.5634-.7888.3075-1.4575.72-2.1228 1.3877-.6652.6677-1.075 1.3368-1.3802 2.127-.2954.7638-.4956 1.6365-.552 2.914-.0564 1.2775-.0689 1.6882-.0626 4.947.0062 3.2586.0206 3.6671.0825 4.9473.061 1.2765.264 2.1482.5635 2.9107.308.7889.72 1.4573 1.388 2.1228.6679.6655 1.3365 1.0743 2.1285 1.38.7632.295 1.6361.4961 2.9134.552 1.2773.056 1.6884.069 4.9462.0627 3.2578-.0062 3.668-.0207 4.9478-.0814 1.28-.0607 2.147-.2652 2.9098-.5633.7889-.3086 1.4578-.72 2.1228-1.3881.665-.6682 1.0745-1.3378 1.3795-2.1284.2957-.7632.4966-1.636.552-2.9124.056-1.2809.0692-1.6898.063-4.948-.0063-3.2583-.021-3.6668-.0817-4.9465-.0607-1.2797-.264-2.1487-.5633-2.9117-.3084-.7889-.72-1.4568-1.3876-2.1228C21.2982 1.33 20.628.9208 19.8378.6165 19.074.321 18.2017.1197 16.9244.0645 15.6471.0093 15.236-.005 11.977.0014 8.718.0076 8.31.0215 7.0301.0839m.1402 21.6932c-1.17-.0509-1.8053-.2453-2.2287-.408-.5606-.216-.96-.4771-1.3819-.895-.422-.4178-.6811-.8186-.9-1.378-.1644-.4234-.3624-1.058-.4171-2.228-.0595-1.2645-.072-1.6442-.079-4.848-.007-3.2037.0053-3.583.0607-4.848.05-1.169.2456-1.805.408-2.2282.216-.5613.4762-.96.895-1.3816.4188-.4217.8184-.6814 1.3783-.9003.423-.1651 1.0575-.3614 2.227-.4171 1.2655-.06 1.6447-.072 4.848-.079 3.2033-.007 3.5835.005 4.8495.0608 1.169.0508 1.8053.2445 2.228.408.5608.216.96.4754 1.3816.895.4217.4194.6816.8176.9005 1.3787.1653.4217.3617 1.056.4169 2.2263.0602 1.2655.0739 1.645.0796 4.848.0058 3.203-.0055 3.5834-.061 4.848-.051 1.17-.245 1.8055-.408 2.2294-.216.5604-.4763.96-.8954 1.3814-.419.4215-.8181.6811-1.3783.9-.4224.1649-1.0577.3617-2.2262.4174-1.2656.0595-1.6448.072-4.8493.079-3.2045.007-3.5825-.006-4.848-.0608M16.953 5.5864A1.44 1.44 0 1 0 18.39 4.144a1.44 1.44 0 0 0-1.437 1.4424M5.8385 12.012c.0067 3.4032 2.7706 6.1557 6.173 6.1493 3.4026-.0065 6.157-2.7701 6.1506-6.1733-.0065-3.4032-2.771-6.1565-6.174-6.1498-3.403.0067-6.156 2.771-6.1496 6.1738M8 12.0077a4 4 0 1 1 4.008 3.9921A3.9996 3.9996 0 0 1 8 12.0077' },
    { id: 'tiktok', name: 'TikTok', hosts: ['tiktok.com'], d: 'M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z' },
    { id: 'x', name: 'X', hosts: ['x.com', 'twitter.com'], d: 'M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z' },
    { id: 'behance', name: 'Behance', hosts: ['behance.net'], d: 'M16.969 16.927a2.561 2.561 0 0 0 1.901.677 2.501 2.501 0 0 0 1.531-.475c.362-.235.636-.584.779-.99h2.585a5.091 5.091 0 0 1-1.9 2.896 5.292 5.292 0 0 1-3.091.88 5.839 5.839 0 0 1-2.284-.433 4.871 4.871 0 0 1-1.723-1.211 5.657 5.657 0 0 1-1.08-1.874 7.057 7.057 0 0 1-.383-2.393c-.005-.8.129-1.595.396-2.349a5.313 5.313 0 0 1 5.088-3.604 4.87 4.87 0 0 1 2.376.563c.661.362 1.231.87 1.668 1.485a6.2 6.2 0 0 1 .943 2.133c.194.821.263 1.666.205 2.508h-7.699c-.063.79.184 1.574.688 2.187ZM6.947 4.084a8.065 8.065 0 0 1 1.928.198 4.29 4.29 0 0 1 1.49.638c.418.303.748.711.958 1.182.241.579.357 1.203.341 1.83a3.506 3.506 0 0 1-.506 1.961 3.726 3.726 0 0 1-1.503 1.287 3.588 3.588 0 0 1 2.027 1.437c.464.747.697 1.615.67 2.494a4.593 4.593 0 0 1-.423 2.032 3.945 3.945 0 0 1-1.163 1.413 5.114 5.114 0 0 1-1.683.807 7.135 7.135 0 0 1-1.928.259H0V4.084h6.947Zm-.235 12.9c.308.004.616-.029.916-.099a2.18 2.18 0 0 0 .766-.332c.228-.158.411-.371.534-.619.142-.317.208-.663.191-1.009a2.08 2.08 0 0 0-.642-1.715 2.618 2.618 0 0 0-1.696-.505h-3.54v4.279h3.471Zm13.635-5.967a2.13 2.13 0 0 0-1.654-.619 2.336 2.336 0 0 0-1.163.259 2.474 2.474 0 0 0-.738.62 2.359 2.359 0 0 0-.396.792c-.074.239-.12.485-.137.734h4.769a3.239 3.239 0 0 0-.679-1.785l-.002-.001Zm-13.813-.648a2.254 2.254 0 0 0 1.423-.433c.399-.355.607-.88.56-1.413a1.916 1.916 0 0 0-.178-.891 1.298 1.298 0 0 0-.495-.533 1.851 1.851 0 0 0-.711-.274 3.966 3.966 0 0 0-.835-.073H3.241v3.631h3.293v-.014ZM21.62 5.122h-5.976v1.527h5.976V5.122Z' },
    { id: 'vimeo', name: 'Vimeo', hosts: ['vimeo.com'], d: 'M23.9765 6.4168c-.105 2.338-1.739 5.5429-4.894 9.6088-3.2679 4.247-6.0258 6.3699-8.2898 6.3699-1.409 0-2.578-1.294-3.553-3.881l-1.9179-7.1138c-.719-2.584-1.488-3.878-2.312-3.878-.179 0-.806.378-1.8809 1.132l-1.129-1.457a315.06 315.06 0 003.501-3.1279c1.579-1.368 2.765-2.085 3.5539-2.159 1.867-.18 3.016 1.1 3.447 3.838.465 2.953.789 4.789.971 5.5069.5389 2.45 1.1309 3.674 1.7759 3.674.502 0 1.256-.796 2.265-2.385 1.004-1.589 1.54-2.797 1.612-3.628.144-1.371-.395-2.061-1.614-2.061-.574 0-1.167.121-1.777.391 1.186-3.8679 3.434-5.7568 6.7619-5.6368 2.4729.06 3.6279 1.664 3.4929 4.7969z' },
    { id: 'youtube', name: 'YouTube', hosts: ['youtube.com', 'youtu.be'], d: 'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z' },
    { id: 'linkedin', name: 'LinkedIn', hosts: ['linkedin.com'], d: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z' },
    { id: 'facebook', name: 'Facebook', hosts: ['facebook.com', 'fb.com'], d: 'M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z' },
    { id: 'pinterest', name: 'Pinterest', hosts: ['pinterest.com', 'pin.it'], d: 'M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z' },
    { id: 'dribbble', name: 'Dribbble', hosts: ['dribbble.com'], d: 'M12 24C5.385 24 0 18.615 0 12S5.385 0 12 0s12 5.385 12 12-5.385 12-12 12zm10.12-10.358c-.35-.11-3.17-.953-6.384-.438 1.34 3.684 1.887 6.684 1.992 7.308 2.3-1.555 3.936-4.02 4.395-6.87zm-6.115 7.808c-.153-.9-.75-4.032-2.19-7.77l-.066.02c-5.79 2.015-7.86 6.025-8.04 6.4 1.73 1.358 3.92 2.166 6.29 2.166 1.42 0 2.77-.29 4-.814zm-11.62-2.58c.232-.4 3.045-5.055 8.332-6.765.135-.045.27-.084.405-.12-.26-.585-.54-1.167-.832-1.74C7.17 11.775 2.206 11.71 1.756 11.7l-.004.312c0 2.633.998 5.037 2.634 6.855zm-2.42-8.955c.46.008 4.683.026 9.477-1.248-1.698-3.018-3.53-5.558-3.8-5.928-2.868 1.35-5.01 3.99-5.676 7.17zM9.6 2.052c.282.38 2.145 2.914 3.822 6 3.645-1.365 5.19-3.44 5.373-3.702-1.81-1.61-4.19-2.586-6.795-2.586-.825 0-1.63.1-2.4.285zm10.335 3.483c-.218.29-1.935 2.493-5.724 4.04.24.49.47.985.68 1.486.08.18.15.36.22.53 3.41-.43 6.8.26 7.14.33-.02-2.42-.88-4.64-2.31-6.38z' },
    { id: 'threads', name: 'Threads', hosts: ['threads.net', 'threads.com'], d: 'M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.361-.218-3.259-.801-1.063-.689-1.685-1.74-1.752-2.964-.065-1.19.408-2.285 1.33-3.082.88-.76 2.119-1.207 3.583-1.291a13.853 13.853 0 0 1 3.02.142c-.126-.742-.375-1.332-.75-1.757-.513-.586-1.308-.883-2.359-.89h-.029c-.844 0-1.992.232-2.721 1.32L7.734 7.847c.98-1.454 2.568-2.256 4.478-2.256h.044c3.194.02 5.097 1.975 5.287 5.388.108.046.216.094.321.142 1.49.7 2.58 1.761 3.154 3.07.797 1.82.871 4.79-1.548 7.158-1.85 1.81-4.094 2.628-7.277 2.65Zm1.003-11.69c-.242 0-.487.007-.739.021-1.836.103-2.98.946-2.916 2.143.067 1.256 1.452 1.839 2.784 1.767 1.224-.065 2.818-.543 3.086-3.71a10.5 10.5 0 0 0-2.215-.221z' }
  ];
  var PRE = { instagram: 'instagram.com/', tiktok: 'tiktok.com/@', x: 'x.com/', behance: 'behance.net/', vimeo: 'vimeo.com/', youtube: 'youtube.com/@',
    linkedin: 'linkedin.com/in/', facebook: 'facebook.com/', pinterest: 'pinterest.com/', dribbble: 'dribbble.com/', threads: 'threads.net/@' };
  var GLOBE = '<svg class="soc-ic" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>';
  window.FAMA_SOCIAL = {
    list: SOC,
    /* "instagram.com/x", "https://www.instagram.com/x" → Instagram; anything else with a dot → Website */
    detect: function (u) {
      var h = String(u || '').trim().toLowerCase().replace(/^[a-z]+:\/\//, '').replace(/^www\./, '').split(/[\/?#]/)[0];
      if (!h || h.indexOf('.') < 0) return null;
      for (var i = 0; i < SOC.length; i++) for (var j = 0; j < SOC[i].hosts.length; j++) {
        var x = SOC[i].hosts[j]; if (h === x || h.slice(-x.length - 1) === '.' + x) return SOC[i];
      }
      return { id: 'web', name: 'Website' };
    },
    href: function (u) { u = String(u || '').trim(); return /^[a-z]+:\/\//i.test(u) ? u : 'https://' + u; },
    /* 9 Oct 2026: pick the platform, type the username. The address before it is fixed per platform. */
    prefix: function (id) { return PRE[id] || ''; },
    /* "https://www.instagram.com/demotalent/" or "@demotalent" → "demotalent" */
    handle: function (u, id) {
      var v = String(u || '').trim(); if (!v) return '';
      if (id === 'web') return v.replace(/^https?:\/\//i, '');
      var pre = (PRE[id] || '').replace(/@$/, '');
      v = v.replace(/^[a-z]+:\/\//i, '').replace(/^www\./i, '');
      var host = pre.split('/')[0];
      if (v.toLowerCase().indexOf(host) === 0) v = v.slice(pre.length);
      else { var d = this.detect(v); if (d && d.id !== 'web') v = v.replace(/^[^\/]+\/(in\/)?/i, ''); }
      return v.replace(/^@/, '').split(/[\/?#]/)[0];
    },
    build: function (id, h) { h = String(h || '').trim(); if (!h) return ''; return id === 'web' ? this.href(h) : 'https://' + (PRE[id] || '') + h; },
    icon: function (id) {
      for (var i = 0; i < SOC.length; i++) if (SOC[i].id === id) return '<svg class="soc-ic" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="' + SOC[i].d + '"/></svg>';
      return GLOBE;
    }
  };

  /* experience: dates, durations, and the list Profile structure and the public profile both draw */
  var MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var NOW = { y: 2026, m: 10 }; /* the prototype's today */
  var esc = function (x) { return String(x == null ? '' : x).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  function months(r) { var ey = r.cur ? NOW.y : (r.ey || r.sy), em = r.cur ? NOW.m : (r.em || (r.ey ? 12 : r.sm || 12)), sm = r.sm || 1;
    return Math.max(1, (ey - r.sy) * 12 + (em - sm) + 1); }
  function dur(m) { var y = Math.floor(m / 12), mo = m % 12, out = [];
    if (y) out.push(y + (y === 1 ? ' yr' : ' yrs')); if (mo) out.push(mo + (mo === 1 ? ' mo' : ' mos')); return out.join(' '); }
  function when(m, y) { return y ? (m ? MON[m - 1] + ' ' : '') + y : ''; }
  function range(r) { return when(r.sm, r.sy) + ' – ' + (r.cur ? 'Present' : when(r.em, r.ey) || when(r.sm, r.sy)) + (r.sy ? ' · ' + dur(months(r)) : ''); }
  /* current roles first (the latest start on top), then by when they ended */
  function key(r) { return r.cur ? 1e6 + r.sy * 12 + (r.sm || 1) : (r.ey || r.sy) * 12 + (r.em || 12); }
  function initials(n) { return String(n || '?').split(/\s+/).filter(Boolean).map(function (w) { return w[0]; }).slice(0, 2).join('').toUpperCase(); }
  window.FAMA_EXP = {
    MON: MON, range: range, dur: dur, months: months,
    /* newest first; roles at the same company in a row are grouped under it */
    groups: function (list) {
      var rows = list.map(function (r, i) { return { r: r, i: i }; }).filter(function (x) { return x.r.n || x.r.t; })
        .sort(function (a, b) { return key(b.r) - key(a.r); });
      var out = [];
      rows.forEach(function (x) { var g = out[out.length - 1];
        if (g && g.n.toLowerCase() === (x.r.n || '').toLowerCase()) g.roles.push(x); else out.push({ n: x.r.n || '', roles: [x] }); });
      return out;
    },
    /* opts.edit: a pencil per role (data-edit-role="index"); opts.skill: id → name */
    html: function (list, opts) {
      opts = opts || {};
      var pen = function (i, t) { return opts.edit ? '<button type="button" class="iconbtn plain xp-ed" data-edit-role="' + i + '" aria-label="Edit ' + esc(t) + '"><svg class="icon" aria-hidden="true"><use href="#i-pen"/></svg></button>' : ''; };
      var hl = function (r) { var l = String(r.hl || '').split('\n').map(function (x) { return x.replace(/^[\s·\-•]+/, '').trim(); }).filter(Boolean);
        return l.length ? '<ul class="xp-hl">' + l.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>' : ''; };
      var sk = function (r) { var n = (r.sk || []).map(function (id) { return opts.skill ? opts.skill(id) : id; }).filter(Boolean);
        return n.length ? '<p class="xp-sk"><b>Skills:</b> ' + esc(n.join(', ')) + '</p>' : ''; };
      var place = function (r) { return [r.loc, r.lt].filter(Boolean).join(' · '); };
      return '<ol class="xp">' + this.groups(list).map(function (g) {
        /* 30 Oct 2026: a work briefcase for every role, not the company's initials (two companies shared "NC") */
        var logo = '<span class="xp-logo" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/><rect width="20" height="14" x="2" y="6" rx="2"/></svg></span>';
        if (g.roles.length === 1) { var x = g.roles[0], r = x.r;
          return '<li class="xp-g one">' + logo + '<div class="xp-b"><div class="xp-top"><div><h3 class="xp-t">' + esc(r.t) + '</h3>' +
            '<p class="xp-m">' + esc([g.n, r.et].filter(Boolean).join(' · ')) + '</p><p class="xp-d">' + esc(range(r)) + '</p>' +
            (place(r) ? '<p class="xp-d">' + esc(place(r)) + '</p>' : '') + '</div>' + pen(x.i, r.t) + '</div>' + hl(r) + sk(r) + '</div></li>'; }
        var total = 0, first = g.roles[g.roles.length - 1].r, last = g.roles[0].r;
        total = Math.max(1, ((last.cur ? NOW.y : (last.ey || last.sy)) - first.sy) * 12 + ((last.cur ? NOW.m : (last.em || 12)) - (first.sm || 1)) + 1);
        var et = g.roles.every(function (y) { return y.r.et === last.et; }) ? last.et : '';
        return '<li class="xp-g">' + logo + '<div class="xp-b"><h3 class="xp-org">' + esc(g.n) + '</h3><p class="xp-m">' + esc([et, dur(total)].filter(Boolean).join(' · ')) + '</p>' +
          (place(last) ? '<p class="xp-d">' + esc(place(last)) + '</p>' : '') +
          '<ol class="xp-roles">' + g.roles.map(function (x) { var r = x.r;
            return '<li class="xp-r"><div class="xp-top"><div><h4 class="xp-t">' + esc(r.t) + '</h4><p class="xp-d">' + esc(range(r)) + '</p></div>' + pen(x.i, r.t) + '</div>' + hl(r) + sk(r) + '</li>'; }).join('') +
          '</ol></div></li>';
      }).join('') + '</ol>';
    }
  };

  /* 24 Oct 2026: one path in two parts, with two moments.
     Go Live (FAMA_INDEX_REQ): the profile goes Live, so its link works and can be shared. Kept to what takes a minute.
     Stand out (FAMA_INDEX_REC): not needed to go Live. Its first step, something to show, puts the profile in the
     Creatives Index, where brands search (so the index never lists a profile with no work). The rest gets it picked,
     most useful first. No review step: nobody needs to approve any of it. */
  window.FAMA_INDEX_REQ = [
    ['name', 'Display name', 'The name brands see in search results.', 'profile-structure.html#core'],
    ['skill', 'A skill and a speciality', 'What brands search for.', 'profile-structure.html#skills'],
    ['place', 'Your city', 'Brands filter by where you are.', 'profile-structure.html#core']
  ];
  window.FAMA_INDEX_KEY = 'show';
  window.FAMA_INDEX_REC = [
    ['show', 'Something to show', 'A project, three photos or a showreel. This puts you in the Creatives Index.', 'projects.html'],
    ['projects3', 'Three projects', 'One project shows you can do it. Three show a style.', 'projects.html'],
    ['headline', 'A headline', 'One line under your name in search, like “Art director & stylist”.', 'profile-structure.html#core'],
    ['photo', 'A profile photo', 'Profiles with a photo get opened more.', 'profile-structure.html#core'],
    ['brands', 'Experience', 'The brands and teams you have worked with.', 'profile-structure.html#brands'],
    ['links', 'Your Instagram or website', 'Brands look at where else your work lives.', 'profile-structure.html#social'],
    ['bio', 'A short bio', 'A few lines on how you work.', 'profile-structure.html#core']
  ];
})();
