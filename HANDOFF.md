# FAMA — Developer Handoff

*Updated 15 Nov 2026*

FAMA is a platform for creative talent, covering profiles, projects, posts and credits. This repository holds the **front-end prototype**: every screen, state and interaction the product needs.

The prototype has **no backend**. The sample data lives in each browser's `localStorage`, and building the real backend and API is the next phase.

- **Live prototype:** https://fama-ui.vercel.app
- **Repository:** `faresabotaleb/fama-ui`. Vercel deploys `main` to production on every push.

---

## 1. Run it locally

The prototype is static HTML, CSS and JavaScript, with no build step and no dependencies to install.

```bash
git clone git@github.com:faresabotaleb/fama-ui.git
cd fama-ui
python3 -m http.server 8090      # any static server works
# open http://localhost:8090
```

`index.html` redirects to the user's home page:
- `projects.html` once the profile is complete.
- `profile-structure.html` until it is.

### Useful URL switches (prototype only)

| Switch | What it does |
|---|---|
| `?view=guest` | Shows any page as a signed-out visitor. Links keep the switch as you click around. |
| `?state=incomplete` / `?state=complete` | Forces the profile's approval state. |
| `states.html` | One page linking to every screen in every state, for review. |

To reset the sample data, clear the site's `localStorage` in DevTools.

---

## 2. Screens

| Screen | File | Suggested route |
|---|---|---|
| Projects (home once the profile is complete) | `projects.html` | `/talent/projects` |
| Project page (public) | `project.html?p={id}` | `/{username}/work/{project}` |
| Project editor (WYSIWYG) | `project-edit.html` | — |
| Profile structure (the talent edits their profile) | `profile-structure.html` | `/talent/profile` |
| Public profile | `preview.html` | `/{username}` |
| Credits & recognitions | `credits.html` | `/talent/credits` |
| Recognise a peer | `recognise.html` | — |
| Feed | `feed.html` | `/feed` |
| Post | `post.html` | `/posts/{id}` |
| Activity | `following.html` | `/talent/feed/activity` |
| Notifications | `notifications.html` | `/notifications` |
| Log in, Create account, Forgot / Reset password | `login.html`, `register.html`, `forgot-password.html`, `reset-password.html` | — |
| 404 | `404.html` | — |
| Review index of all states | `states.html` | prototype only |

`profile-content.html` is legacy. Its content was folded into Profile structure (brands) and Credits (recognitions).

### Sidebar order (shell.js)
1. **Your work:** Projects, Credits
2. **Your profile**
3. **Community:** Feed, Notifications, Activity

---

## 3. Code map

```
assets/
  css/   ds.css (design tokens) · fama.css (base) · shell.css (header, sidebar, motion tokens)
         project-page.css · project-editor.css · posts.css · views.css · fields.css · auth.css · exp.css
  js/    ds.js        shared helpers: FAMA.t() strings, FAMA.href(), icon sprite. Load first.
         shell.js     header, sidebar and footer for every page (<div data-fama-nav>)
         profile.js   the talent profile (shared by Profile structure and Preview), FAMA_HOME
         skills.js    the 41 skills · fields.js: each skill's custom fields · skillfield.js: skill search
         project-editor.js  WYSIWYG project editor · featured.js: featured project
         posts.js     posts, comments + one level of replies, report sheet, guest sign-in prompt
         views.js     the talent's own numbers and the steps to the Creatives Index
         profile-motion.js  GSAP profile entrance · auth.js: sign-in screens · app.js: small shell bits
  fonts/ Oswald, Sofia Sans (self-hosted)
  img/   logo, emblem, star pattern, banners, stock/ (Unsplash placeholders, see stock/SOURCES.md)
```

Every page loads its scripts with a version query (`?v=N`). **Bump the number when you change a file**, or browsers will keep the old copy.

### Data the prototype keeps in localStorage

These are the objects the real API will need to provide:

| Key | Holds |
|---|---|
| `fama-profile-v1` | The talent profile: skills, fields, experience, links, brands |
| `fama-projects-v1` | Projects: content, team, results, gallery |
| `fama-credits-v2` | Credits between talents (pending / confirmed) |
| `fama-recs-v1` | Recognitions |
| `fama-notif-read-v1` | Which notifications have been read |
| `fama-side-folded` | Sidebar folded or open (UI preference only) |

---

## 4. Design system

Use the CSS token, never the raw value. The tokens are in `assets/css/ds.css`.

- **Colour:**
  - cream `#FBFAF2`, ink `#14110F`, grey `#6B6560`, line `#E6E2D8`
  - purple `#8A2FA8`, yellow `#FFEB73`, lavender `#F3EAF8`
- **Type:** Oswald 600 for display text, H1 and H2. Sofia Sans for body (16) and labels (14).
- **Spacing:** 4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 104
- **Shape:** cards have a 1px line, radius 20 and no shadow. Pills are fully rounded. Content width is 1060.
- **Breakpoints:** ≤760 is mobile (one column). At ≤960 the feed's side column moves between posts.
- **Brand reference:** FAMA Branding Phase 3. Do not add new colours or fonts.

External libraries come from CDNs:
- GSAP 3.12.5 and ScrollTrigger (cdnjs)
- Google Fonts: Sofia Sans, IBM Plex Sans Arabic, Newsreader

---

## 5. Product rules (decided; please keep them)

- **Projects belong to the whole team.**
  - The lead and the confirmed people show as equals ("By A and B", and a "Made by" list on the project page).
  - Confirming a credit makes you a co-owner.
  - Any owner can edit or leave a project; only a sole owner can delete it.
- **No "Work with" / hire flow** on project pages.
  - Visitors get Share and Like.
  - Owners get "See it as a visitor" and Edit.
- **No primary skill.** The order of skills is the order of the profile tabs.
- **Live / Private.** A private profile shows no public link, only its "Private" status.
- **Draft and save.** Profile structure edits in place, and a bottom bar saves or discards (with Undo).
- **No reviews.** Recognitions replace them, so ignore any leftover review code.
- **Posts.** Text and skills can be edited for 15 minutes after posting; media is locked.
- **Comments.** Replies go one level deep, prefilled with @username.
- **Visitors** who like, save, comment or follow get the sign-in prompt, and then the action completes.
- **Limits:**
  - posts, comments and replies: 2,200 characters
  - photos per post: 10
  - results per project: 4
  - social links: 9
- **Language:** English only for V1. Arabic strings are kept in the code (`FAMA.T.ar`) and switched off in `ds.js`.

---

## 6. Open items

- **Delete / Leave project.** These were removed from the project card in the 13 Nov review, and their new place is still to be decided.
- **Notifications.** A client note (an arrow between the All / Unread / Mentions filters and "Mark all as read") is still to be clarified.
- **Backend.** Accounts, storage, uploads, search and moderation (the report sheet), plus an API for the localStorage objects above.

---

## 7. Related material

- **Figma:** the Desktop (1440), Mobile (390) and Design system pages in the FAMA Figma file (ask the owner for access).
- **Review reports:** English PDFs of each review round, with before/after screenshots. The owner can share them.
