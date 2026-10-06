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
assert.strictEqual(L.pick('pull', { ...base, equip: ['none'] })[0], 'Loaded bag row');
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
// Balance support.
assert.strictEqual(L.pick('lunge', { ...base, care: ['balance'] })[0], 'Supported step-back');
assert.strictEqual(L.pick('carry', { ...base, care: ['balance'] })[0], 'Suitcase hold by a worktop');
// Every exercise a member can be given has a step-by-step guide.
const G = require('../js/guides.js'), CN = require('../js/content.js');
const all = new Set([CN.BENCH_PRESS[0]]);
Object.values(CN.LIB).forEach(m => Object.values(m).forEach(e => all.add(e[0])));
Object.values(CN.ALT).forEach(l => l.forEach(a => all.add(a[1][0])));
Object.values(CN.FLOORFREE).forEach(e => all.add(e[0]));
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

console.log('All logic tests passed');
