/* FAMA — the 41 skills, from the owner's Skills spec (final, 27 Sep 2026).
   Each skill: id, English name, kind (the spec's own grouping), specialities, and the
   sections Fama adds to a profile when the talent picks that skill.
   Specialities are translated from the Arabic spec; check the wording with the owner.
   Each skill's custom fields (height, sizes, dialects…) are in assets/js/fields.js. */
(function () {
  'use strict';
  var G = 'genre', O = 'output', C = 'craft'; /* النوع الفني · المنتج النهائي · الدور الحِرفي */
  var S = [
    ['photography', 'Photography', G, ['Fashion', 'Beauty', 'Portrait', 'Product & still life', 'Food & drink', 'Interiors & architecture', 'Events & documentary', 'Automotive'], ['gallery', 'projects', 'equipment']],
    ['modelling', 'Modelling', G, ['Fashion', 'Commercial & lifestyle', 'Beauty', 'Runway', 'Modest fashion', 'Fitness', 'Parts & hands'], ['gallery', 'looks', 'digitals', 'projects']],
    ['styling', 'Styling', G, ['Fashion', 'Commercial wardrobe', 'Modest fashion', 'Menswear', 'Set & props', 'Food'], ['gallery', 'looks', 'projects']],
    ['makeup', 'Makeup', G, ['Beauty', 'Editorial & fashion', 'Bridal & occasion', 'SFX & prosthetics', 'Grooming'], ['gallery', 'looks', 'projects']],
    ['hair', 'Hair', G, ['Editorial & fashion', 'Beauty & commercial', 'Bridal & occasion', 'Barbering & grooming', 'Wigs & hairpieces'], ['gallery', 'looks', 'projects']],
    ['creative', 'Creative direction', O, ['Campaigns', 'Brand world', 'Content & social', 'Film & video', 'Experiential'], ['gallery', 'projects']],
    ['artdirection', 'Art direction', O, ['Shoot & set', 'Print & layout', 'Digital & social', 'Packaging & retail'], ['gallery', 'projects']],
    ['graphic', 'Brand & graphic design', O, ['Brand identity', 'Packaging', 'Editorial & layout', 'Campaign & marketing', 'Environmental & wayfinding', 'Digital & social'], ['gallery', 'projects', 'software']],
    ['type', 'Type & lettering', C, ['Arabic type design', 'Latin type design', 'Custom lettering', 'Arabic calligraphy', 'Bilingual typesetting'], ['gallery', 'projects', 'software']],
    ['direction', 'Direction', G, ['Commercials', 'Fashion film', 'Music video', 'Documentary', 'Narrative & short', 'Social & short-form'], ['showreel', 'projects']],
    ['cinematography', 'Cinematography', G, ['Commercials', 'Fashion film', 'Music video', 'Documentary', 'Narrative'], ['showreel', 'projects', 'equipment']],
    ['retouch', 'Retouching', G, ['Beauty', 'Fashion', 'Product & packshot', 'Compositing & CGI'], ['gallery', 'projects', 'software']],
    ['editing', 'Editing', G, ['Commercial & branded', 'Documentary', 'Narrative', 'Social & short-form', 'Trailers & promos'], ['showreel', 'projects', 'software']],
    ['producing', 'Producing', G, ['Commercial & branded', 'Film & series', 'Photo shoots', 'Events & experiences', 'Music video'], ['projects']],
    ['casting', 'Casting', G, ['Commercial & talent', 'Film & series', 'Street casting', 'Extras'], ['projects']],
    ['acting', 'Acting', G, ['Commercials & TV', 'Film & series', 'Theatre', 'Extras & featured', 'Improv & branded'], ['showreel', 'gallery', 'projects']],
    ['voice', 'Voice', G, ['Commercial voiceover', 'Narration & documentary', 'Dubbing', 'Character & animation', 'Audiobooks & podcasts'], ['audio', 'projects']],
    ['content', 'Content creation', O, ['UGC & branded', 'Short-form video', 'Podcasts', 'Livestreaming', 'Community & social'], ['showreel', 'gallery', 'projects']],
    ['presenting', 'Presenting & hosting', G, ['Event hosting', 'TV & radio', 'Brand & content', 'Panel moderation'], ['showreel', 'projects']],
    ['writing', 'Writing', G, ['Brand & campaign copy', 'Screenwriting & scripts', 'Long-form & editorial', 'Digital & performance', 'UX & product writing'], ['samples', 'projects']],
    ['translation', 'Translation & localisation', C, ['Arabic to English', 'English to Arabic', 'Transcreation', 'Subtitling & captions', 'Cultural consulting'], ['samples', 'projects']],
    ['strategy', 'Brand strategy', C, ['Positioning & narrative', 'Naming & verbal identity', 'Research & insight', 'Content & channels'], ['samples', 'projects']],
    ['product', 'Product & interface design', C, ['UX & product', 'UI & visual design', 'Design systems', 'Prototyping', 'User research'], ['gallery', 'projects', 'software']],
    ['illustration', 'Illustration', G, ['Editorial', 'Brand & advertising', 'Children’s & publishing', 'Fashion illustration', 'Technical & infographic'], ['gallery', 'projects']],
    ['motion', 'Motion design', O, ['Titles & broadcast', 'Brand motion', 'Explainers & infographics', 'Social & short-form'], ['showreel', 'projects', 'software']],
    ['animation', 'Animation', C, ['2D', '3D', 'Character animation', 'Stop motion'], ['showreel', 'projects', 'software']],
    ['cgi', '3D & CGI', C, ['Product visualisation', 'Environments & architecture', 'Characters & creatures', 'Look development'], ['gallery', 'showreel', 'projects', 'software']],
    ['grading', 'Colour grading', G, ['Commercial', 'Narrative & documentary', 'Music video & fashion', 'Conform & finishing'], ['showreel', 'projects', 'software']],
    ['vfx', 'VFX', C, ['Compositing', 'Roto & clean-up', 'CG integration', 'Simulation & FX'], ['showreel', 'projects', 'software']],
    ['camera', 'Camera department', C, ['Camera operator', '1st AC', '2nd AC', 'Steadicam & gimbal', 'DIT'], ['showreel', 'projects', 'equipment']],
    ['lighting', 'Lighting & grip', C, ['Gaffer', 'Electrician', 'Key grip', 'Rigging grip'], ['projects', 'equipment']],
    ['sound', 'Production sound', C, ['Production sound mixer', 'Boom operator', 'Live & event sound', 'Field recording'], ['audio', 'projects', 'equipment']],
    ['soundpost', 'Sound post', C, ['Sound design', 'Dialogue & ADR', 'Foley', 'Mixing & mastering'], ['audio', 'projects', 'software']],
    ['music', 'Music', C, ['Original composition', 'Arrangement & production', 'Music supervision', 'Sonic branding & idents'], ['audio', 'projects']],
    ['costume', 'Costume & wardrobe', C, ['Costume design', 'Wardrobe supervision', 'Tailoring & alterations', 'Sourcing & buying'], ['gallery', 'looks', 'projects']],
    ['set', 'Spatial & set design', O, ['Set design', 'Exhibition & retail', 'Events & stages', 'Scenic art & build', 'Props'], ['gallery', 'projects']],
    ['dance', 'Dance & movement', G, ['Commercial & music video', 'Choreography', 'Theatre & performance', 'Movement direction'], ['showreel', 'gallery', 'projects']],
    ['drone', 'Aerial & drone', O, ['Aerial photography', 'Aerial video', 'FPV & action', 'Survey & industrial'], ['showreel', 'gallery', 'projects', 'equipment']],
    ['prodmgmt', 'Production management', C, ['Line producer', 'Production coordinator', '1st AD', '2nd AD', 'Production assistant'], ['projects']],
    ['location', 'Location', C, ['Location scouting', 'Location management', 'Permits & clearances', 'Fixing & local coordination'], ['gallery', 'projects']],
    ['live', 'Live & experiential', C, ['Show calling', 'Technical management', 'Stage management', 'Audio, video & lighting', 'Rigging'], ['projects']]
  ];
  var slug = function (s) { return s.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); };
  var list = S.map(function (x) {
    /* a skill's tab is its projects, nothing else (3 Oct 2026): photos, video, looks and the rest live inside projects.
       The old per-skill sections (x[4]) are kept in the data in case they come back. */
    return { id: x[0], name: x[1], kind: x[2], specs: x[3].map(function (n) { return { id: slug(n), name: n }; }),
      blocks: ['projects'], oldBlocks: x[4] };
  }).sort(function (a, b) { return a.name.localeCompare(b.name); });
  window.FAMA_SKILLS = list;
  window.FAMA_SKILL = {};
  list.forEach(function (s) { window.FAMA_SKILL[s.id] = s; });
  window.FAMA_SKILL_NAMES = list.map(function (s) { return s.name; });
})();
