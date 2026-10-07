/* Writes docs/FILMING.md from the app's own content, so titles always match. Run: node scripts/filming.js */
const C = require('../js/content.js'), G = require('../js/guides.js'), fs = require('fs');
const seen = new Set(), tiers = { none: [], adapted: [], bands: [], dumbbells: [], kettlebell: [], gym: [] };
const add = (tier, e) => { if (!seen.has(e[0])) { seen.add(e[0]); tiers[tier].push(e); } };
['none', 'bands', 'dumbbells', 'kettlebell', 'gym'].forEach(k => Object.values(C.LIB).forEach(m => m[k] && add(k, m[k])));
Object.values(C.ALT).forEach(l => l.forEach(a => add('adapted', a[1])));
Object.values(C.FLOORFREE).forEach(e => add('adapted', e));
add('dumbbells', C.BENCH_PRESS);
const row = e => { const g = G[e[0]]; return `| ${e[0]} | ${g.s} ${g.m.join(' ')} | ${e[2].includes('h') ? 'Hold 10 sec' : '3 slow reps'} |`; };
const table = list => '| Title (exact) | What to show | Film |\n|---|---|---|\n' + list.map(row).join('\n');
const total = Object.values(tiers).reduce((a, l) => a + l.length, 0);
const out = `# Filming list

Generated from the app, so every title here matches the app exactly. ${total} exercise clips, plus ${Object.keys(C.ROUTINES).length} routines, ${C.LESSONS.length} lessons, ${Object.keys(C.COACH).length} coach notes, a test demo and a short film for the home page.

## How to film

- **Landscape**, phone on a tripod or propped at hip height.
- **Whole body in frame** the whole time, with the chair or kit visible.
- **Side-on view** for most moves. Add a front view if it helps.
- **15 to 30 seconds** per exercise. Slow reps.
- Plain background, good light, no music.
- Talking is optional. If you talk, say the cues in the "What to show" column.
- Filming each one is also your review: if the written steps are wrong, change them in \`js/guides.js\` or tell the developer.

## How to get them into the app

1. Upload each clip to YouTube as **Unlisted**, "not made for kids".
2. Give it the exact title from the table.
3. Paste the link next to that title in \`js/videos.js\`.

Unlisted means anyone with the link can watch, but it does not appear in search.

## Day one: film these first (${tiers.none.length + tiers.adapted.length} clips)

These cover every member with no equipment, including the floor-free and supported versions. The app is usable with only these.

### Bodyweight

${table(tiers.none)}

### Gentler, floor-free and supported versions

${table(tiers.adapted)}

### Also day one

| Title (exact) | What to show | Length |
|---|---|---|
| How to do the test | The 30-second sit to stand: arms crossed, full stand, full sit | 30 sec |
| See how Holdfast works | The home page film: who it is for and what it does | 60 sec |
${Object.keys(C.COACH).map(k => `| Coach note: ${k} | Say this in your own words: "${C.COACH[k]}" | 30 sec |`).join('\n')}

## Next: by kit

### Resistance bands (${tiers.bands.length})

${table(tiers.bands)}

### Dumbbells (${tiers.dumbbells.length})

${table(tiers.dumbbells)}

### Kettlebell (${tiers.kettlebell.length})

${table(tiers.kettlebell)}

### Gym (${tiers.gym.length})

${table(tiers.gym)}

## Guided routines (${Object.keys(C.ROUTINES).length})

Optional. Each routine already works as timed on-screen steps. A video plays above the first step if you add one.

| Title (exact) | Length |
|---|---|
${Object.values(C.ROUTINES).map(r => `| ${r.title} | ${r.mins} min |`).join('\n')}

## Lessons (${C.LESSONS.length})

Talking to camera. These are where the nutrition guidance lives on video.

| Title (exact) | Length |
|---|---|
${C.LESSONS.map(l => `| ${l[0]} | ${l[1]} |`).join('\n')}
`;
fs.writeFileSync(__dirname + '/../docs/FILMING.md', out);
console.log('clips', total, '| day one', tiers.none.length + tiers.adapted.length + 2 + Object.keys(C.COACH).length);
