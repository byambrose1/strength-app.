/* Run with: node tests/logic.test.js */
const assert = require('assert');
const L = require('../js/logic.js');

const base = { jab: 0, sessions: 3, len: 25, equip: ['dumbbells'], care: [], stage: 1, med: 'weekly' };
const week = p => [0, 1, 2, 3, 4, 5, 6].map(d => L.dayPlan(p, d).short).join(' ');

// Weekly injection on Sunday: nothing on the day, rest the day after, strength furthest away.
assert.strictEqual(week(base), 'Jab Rest Lift Walk Lift Walk Lift');
assert.strictEqual(week({ ...base, sessions: 2 }), 'Jab Rest Walk Lift Walk Walk Lift');
// Daily medication, first training day Monday: evenly spread, no injection day.
assert.strictEqual(week({ ...base, med: 'daily', jab: 1 }), 'Rest Lift Walk Lift Walk Lift Walk');
assert.strictEqual(week({ ...base, med: 'none', jab: 1, sessions: 2 }), 'Rest Lift Walk Walk Lift Walk Walk');

// Kit: best available wins; bench upgrades the dumbbell press; bodyweight is the fallback.
assert.strictEqual(L.pick('squat', base)[0], 'Goblet squat');
assert.strictEqual(L.pick('squat', { ...base, equip: ['gym', 'dumbbells'] })[0], 'Leg press');
assert.strictEqual(L.pick('push', { ...base, equip: ['dumbbells', 'bench'] })[0], 'Dumbbell bench press');
assert.strictEqual(L.pick('pull', { ...base, equip: ['none'] })[0], 'Chair-supported row');
// Areas to look after swap in gentler movements.
assert.strictEqual(L.pick('squat', { ...base, care: ['knees'] })[0], 'Sit to stand, high seat');
assert.strictEqual(L.pick('press', { ...base, care: ['shoulders'] })[0], 'Wall slide');
assert.strictEqual(L.pick('hinge', { ...base, care: ['back'] })[0], 'Glute bridge');

// Members who cannot get down to the floor never get a floor exercise.
const noFloor = { ...base, equip: ['none'], care: ['floor'] };
assert.strictEqual(L.pick('push', { ...base, care: ['floor'] })[0], 'Wall press-up');
assert.strictEqual(L.pick('core', noFloor)[0], 'Seated knee lift');
assert.strictEqual(L.pick('hinge', noFloor)[0], 'Chair hip hinge');
assert.strictEqual(L.pick('lunge', { ...base, care: ['knees', 'floor'] })[0], 'Supported step-back');
assert.strictEqual(L.pick('hinge', { ...base, care: ['back', 'floor'] })[0], 'Chair hip hinge');
['A', 'B'].forEach(w => ['none', 'bands', 'dumbbells', 'kettlebell', 'gym'].forEach(k => [15, 25, 35].forEach(len =>
  L.sessionList({ ...base, equip: [k], care: ['floor', 'knees', 'back'], len }, w).forEach(e => assert.ok(!e[2].includes('f'), e[0] + ' is a floor exercise')))));
// A member who must stay seated gets a fully seated programme, whatever kit or other needs they have.
['A', 'B'].forEach(w => [15, 25, 35].forEach(len => ['none', 'gym', 'dumbbells'].forEach(k =>
  L.sessionList({ ...base, equip: [k], care: ['seated', 'knees'], len }, w).forEach(e => assert.ok(/^Seated/.test(e[0]), e[0] + ' is not seated')))));
assert.strictEqual(L.pick('press', { ...base, care: ['seated', 'shoulders'] })[0], 'Seated arm raise');
// Seated session B has curls; the seated hold moves to the longer session A.
assert.deepStrictEqual(L.sessionList({ ...base, care: ['seated'] }, 'B').map(e => e[0]), ['Seated hip hinge', 'Seated march', 'Seated overhead press', 'Seated bicep curl']);
assert.ok(L.sessionList({ ...base, care: ['seated'], len: 35 }, 'A').some(e => e[0] === 'Seated suitcase hold'));
assert.ok(!L.sessionList(base, 'B').some(e => /curl/.test(e[0])));
assert.strictEqual(L.sessionList({ ...base, care: ['seated'], len: 35 }, 'B').slice(-1)[0][0], 'Seated reverse fly');
assert.strictEqual(L.sessionList({ ...base, len: 35 }, 'B').slice(-1)[0][0], 'Dead bug');
assert.strictEqual(L.dayPlan({ ...base, med: 'daily', jab: 1, care: ['seated'] }, 2).title, 'Move day');
// Wrists and hips.
assert.strictEqual(L.pick('push', { ...base, care: ['wrists'] })[0], 'Wall press-up');
// No-kit push: wall press-up first, worktop press-up from level 4, but never for sore wrists.
assert.strictEqual(L.pick('push', { ...base, equip: ['none'] })[0], 'Wall press-up');
assert.strictEqual(L.pick('push', { ...base, equip: ['none'], stage: 3 })[0], 'Incline press-up');
assert.strictEqual(L.pick('push', { ...base, equip: ['none'], care: ['wrists'], stage: 5 })[0], 'Wall press-up');
assert.strictEqual(L.pick('squat', { ...base, care: ['hips'] })[0], 'Sit to stand, high seat');
assert.strictEqual(L.pick('lunge', { ...base, care: ['hips'] })[0], 'Supported step-back');
assert.strictEqual(L.pick('hinge', { ...base, care: ['hips', 'floor'] })[0], 'Chair hip hinge');
// An exercise the member has left out does not come back.
assert.ok(!L.sessionList({ ...base, skip: ['Goblet squat'] }, 'A').some(e => e[0] === 'Goblet squat'));
assert.strictEqual(L.sessionList({ ...base, skip: ['Goblet squat'] }, 'A').length, 3);
// No-kit members move on to a single-leg bridge from level 4, unless the bridge was chosen to protect the back or hips.
assert.strictEqual(L.pick('hinge', { ...base, equip: ['none'], stage: 2 })[0], 'Glute bridge');
assert.strictEqual(L.pick('hinge', { ...base, equip: ['none'], stage: 3 })[0], 'Single-leg glute bridge');
assert.strictEqual(L.pick('hinge', { ...base, care: ['back'], stage: 5 })[0], 'Glute bridge');
assert.strictEqual(L.pick('hinge', { ...base, equip: ['none'], care: ['floor'], stage: 5 })[0], 'Chair hip hinge');
assert.strictEqual(L.pick('pull', { ...base, care: ['seated'], stage: 2 })[0], 'Seated row');
assert.strictEqual(L.pick('pull', { ...base, care: ['seated'], stage: 3 })[0], 'Single-arm seated row');
assert.strictEqual(L.pick('lunge', { ...base, care: ['seated'], stage: 3 })[0], 'Weighted seated march');
assert.strictEqual(L.pick('core', { ...base, care: ['seated'], stage: 3 })[0], 'Seated weighted bicycle');
assert.strictEqual(L.pick('squat', { ...base, care: ['seated'], stage: 3 })[0], 'Seated double leg extension');
assert.strictEqual(L.pick('carry', { ...base, care: ['seated'], stage: 3 })[0], 'Seated weighted side bend');
assert.strictEqual(L.pick('core', { ...base, equip: ['none'], care: ['floor'], stage: 5 })[0], 'Seated knee lift');
// Every four weeks the plan moves to a new block; where there is more than one suitable exercise, members swap between them.
const seatB = (blk, extra) => L.pick('lunge', { ...base, care: ['seated'], ...extra }, blk)[0];
assert.strictEqual(seatB(0), 'Seated march'); assert.strictEqual(seatB(1), 'Seated side taps'); assert.strictEqual(seatB(2), 'Seated march');
assert.strictEqual(seatB(0, { stage: 3 }), 'Weighted seated march'); assert.strictEqual(seatB(1, { stage: 3 }), 'Seated side taps');
assert.strictEqual(seatB(1, { skip: ['Seated side taps'] }), 'Seated march');
assert.strictEqual(L.pick('lunge', { ...base, equip: ['none'] }, 1)[0], 'Split squat with chop');
assert.strictEqual(L.pick('lunge', { ...base, equip: ['none'], care: ['knees'] }, 1)[0], 'Glute bridge march');
assert.strictEqual(L.pick('carry', { ...base, equip: ['none'] }, 1)[0], 'Standing side reach');
assert.strictEqual(L.pick('carry', { ...base, equip: ['none'], care: ['shoulders'] }, 1)[0], 'Suitcase hold');
assert.strictEqual(L.blockNo({ start: '2026-10-01' }, '2026-10-28'), 0); assert.strictEqual(L.blockNo({ start: '2026-10-01' }, '2026-10-29'), 1);
assert.ok(L.sessionList({ ...base, care: ['seated'], start: '2026-10-01' }, 'B', '2026-11-05').some(e => e[0] === 'Seated side taps'));
// Balance support.
assert.strictEqual(L.pick('lunge', { ...base, care: ['balance'] })[0], 'Supported step-back');
assert.strictEqual(L.pick('carry', { ...base, care: ['balance'] })[0], 'Suitcase hold by a worktop');
// Every exercise a member can be given has a step-by-step guide.
const G = require('../js/guides.js'), CN = require('../js/content.js');
const all = new Set([CN.BENCH_PRESS[0]]);
Object.values(CN.LIB).forEach(m => Object.values(m).forEach(e => all.add(e[0])));
Object.values(CN.ALT).forEach(l => l.forEach(a => all.add(a[1][0])));
Object.values(CN.FLOORFREE).forEach(e => all.add(e[0]));
Object.values(CN.SEATED).forEach(e => all.add(e[0])); Object.values(CN.PROGRESS).forEach(x => all.add(x[1][0])); Object.values(CN.ROTATE).forEach(l => l.forEach(a => all.add(a[0]))); all.add(CN.SEATED_SHOULDERS[0]);
all.forEach(n => assert.ok(G[n] && G[n].s && G[n].m.length >= 2 && G[n].f && G[n].e, 'No complete guide for ' + n));

// Session length changes the number of exercises.
assert.strictEqual(L.sessionList({ ...base, len: 15 }, 'A').length, 3);
assert.strictEqual(L.sessionList(base, 'A').length, 4);
assert.strictEqual(L.sessionList({ ...base, len: 35 }, 'B').length, 5);

// Sets and reps, lighter version, timed holds.
assert.strictEqual(L.dose(1, false, ''), '2 × 10');
assert.strictEqual(L.dose(1, true, 'h'), '1 × 30 sec');
assert.strictEqual(L.dose(5, false, 'l'), '3 × 12');
assert.deepStrictEqual(L.prescription(1, false, 'l'), { sets: 2, reps: 10 });
assert.deepStrictEqual(L.prescription(1, true, 'h'), { sets: 1, secs: 30 });

// How the member feels changes the day.
assert.strictEqual(L.shouldEase({ eaten: 'no' }), true);
assert.strictEqual(L.shouldEase({ eaten: 'yes', feel: ['tired'] }), true);
assert.strictEqual(L.shouldEase({ eaten: 'yes', feel: ['bunged'] }), false);
assert.strictEqual(L.mustSkip({ feel: ['dizzy'] }), true);
assert.strictEqual(L.mustSkip({ feel: ['pain'] }), true);
assert.strictEqual(L.mustSkip({ feel: ['queasy'] }), false);
assert.strictEqual(L.inEaseWeek({ easeUntil: '2026-10-10' }, '2026-10-08'), true);
assert.strictEqual(L.inEaseWeek({ easeUntil: '2026-10-10' }, '2026-10-11'), false);

// Weekly review.
const good = { a: { finished: true, felt: 'right', eaten: 'yes' }, b: { finished: true, felt: 'easy', eaten: 'yes' }, c: { finished: true, felt: 'right', eaten: 'yes' }, d: { eaten: 'yes' } };
assert.strictEqual(L.review(base, good, ['a', 'b', 'c', 'd']).move, 1);
assert.strictEqual(L.review(base, { a: { finished: true, felt: 'hard' } }, ['a']).move, -1);
assert.strictEqual(L.review(base, { a: good.a, b: good.b }, ['a', 'b']).move, 0);
assert.strictEqual(L.review(base, { a: { finished: true, felt: 'right' }, b: { finished: true, felt: 'right' }, c: { finished: true, felt: 'right' } }, ['a', 'b', 'c']).move, 0);
assert.strictEqual(L.review({ ...base, stage: 5 }, good, ['a', 'b', 'c', 'd']).move, 0);

// The journey does not stop at 12 weeks.
assert.strictEqual(L.weekNo('2026-10-01', '2026-10-01'), 1);
assert.strictEqual(L.weekNo('2026-10-01', '2026-10-08'), 2);
assert.strictEqual(L.phase(4), 'Foundations');
assert.strictEqual(L.phase(9), 'Strong');
assert.strictEqual(L.phase(30), 'For life');

// Access codes: same code gives the same scramble, different codes differ.
assert.strictEqual(L.codeHash('STRONG26'), L.codeHash('STRONG26'));
assert.notStrictEqual(L.codeHash('STRONG26'), L.codeHash('STRONG27'));
assert.notStrictEqual(L.codeHash('STRONG26'), 'STRONG26');

// Side-effect diary: counts symptom days, and which day after injection they fall on.
const dlogs = { '2026-10-05': { feel: ['queasy'], eaten: 'bit', protein: 2, water: 5 }, '2026-10-06': { feel: ['queasy', 'tired'], eaten: 'no' }, '2026-10-08': { feel: ['good'], eaten: 'yes', protein: 3, finished: true } };
const ds = L.diarySummary({ ...base, jab: 0 }, dlogs, '2026-10-04', '2026-10-10');
assert.strictEqual(ds.days, 7); assert.strictEqual(ds.logged, 3); assert.strictEqual(ds.sym.queasy, 2); assert.strictEqual(ds.sym.tired, 1);
assert.strictEqual(L.peakDay(ds.after.queasy), 1); // 4 Oct 2026 is a Sunday, so the 5th is the day after a Sunday injection
assert.strictEqual(ds.sessions, 1); assert.strictEqual(L.avg(ds.protein), 2.5); assert.strictEqual(ds.eaten.no, 1);
// Body trend and units.
assert.deepStrictEqual(L.pctSeries([{ d: 'a', v: 100 }, { d: 'b', v: 95 }]).map(x => x.v), [0, -5]);
assert.deepStrictEqual(L.kgToSt(80), [12, 8]); assert.strictEqual(L.stToKg(12, 8), 79.8);
// Calendar file: weekly strength events on the right days, injection day as an all-day event.
const ics = L.calendar({ ...base, jab: 0 }, '18:00', '2026-10-07');
assert.ok(ics.includes('RRULE:FREQ=WEEKLY;BYDAY=TU,TH,SA')); assert.ok(ics.includes('DTSTART:20261008T180000')); assert.ok(ics.includes('DTSTART;VALUE=DATE:20261011'));
assert.ok(!L.calendar({ ...base, med: 'daily', jab: 1 }, '07:30', '2026-10-07').includes('Injection day'));

console.log('All logic tests passed');
