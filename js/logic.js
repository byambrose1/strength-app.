/* Holdfast programme rules. Pure functions only: no screen, no storage. Tested in tests/logic.test.js. */
const C = typeof CONTENT !== 'undefined' ? CONTENT : require('./content.js');

const iso = d => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
const parseDay = s => { const a = s.split('-'); return new Date(+a[0], +a[1] - 1, +a[2]); };
const monday = d => iso(addDays(d, -((d.getDay() + 6) % 7)));

/* Choose the exercise for one movement, from the member's kit and what they asked us to look after.
   A member who needs to stay seated always gets the seated programme.
   Otherwise, in order: a gentler swap for a flagged area, then the best kit they own, then a floor-free version if they cannot get down to the floor. */
function pick(slot, p) {
  const care = p.care || [];
  if (care.includes('seated')) {
    if (slot === 'press' && care.includes('shoulders')) return C.SEATED_SHOULDERS;
    const s = C.SEATED[slot], up = C.PROGRESS && C.PROGRESS[s[0]];
    return up && (p.stage || 0) >= up[0] ? up[1] : s;
  }
  let e = null;
  for (const a of (C.ALT[slot] || [])) if (care.includes(a[0])) { e = a[1]; break; }
  if (!e && slot === 'push' && p.equip.includes('dumbbells') && p.equip.includes('bench') && !p.equip.includes('gym')) e = C.BENCH_PRESS;
  if (!e) for (const k of C.ORDER) if ((k === 'none' || p.equip.includes(k)) && C.LIB[slot][k]) { e = C.LIB[slot][k]; break; }
  const up = C.PROGRESS && C.PROGRESS[e[0]];
  if (up && (p.stage || 0) >= up[0] && !(C.ALT[slot] || []).some(a => care.includes(a[0]) && a[1][0] === e[0])) e = up[1];
  if (care.includes('floor') && e[2].includes('f') && C.FLOORFREE[slot]) e = C.FLOORFREE[slot];
  return e;
}

/* Session A or B, sized to the minutes the member has. */
function sessionList(p, which) {
  let s = which === 'A' ? ['squat', 'push', 'pull', 'core'] : ['hinge', 'lunge', 'press', 'carry'];
  if (which === 'B' && (p.care || []).includes('seated')) s = ['hinge', 'lunge', 'press', 'arms'];  // seated: curls in place of the hold, which moves to the longer session
  if (p.len === 15) s = s.slice(0, 3);
  if (p.len === 35) s = s.concat(which === 'A' ? 'carry' : (p.care || []).includes('seated') ? 'fly' : 'core');  // for seated members, A's extra is the seated suitcase hold
  return s.map(k => pick(k, p)).filter(e => !(p.skip || []).includes(e[0]));  // p.skip: exercises the member has left out
}

/* What a given weekday holds.
   Weekly injection: nothing on injection day, rest the day after, strength on the days furthest from it.
   Daily medication or none: sessions spread evenly from the member's chosen first training day. */
function dayPlan(p, dow) {
  const off = (dow - p.jab + 7) % 7;
  const walk = (p.care || []).includes('seated')
    ? { type: 'walk', short: 'Move', title: 'Move day', text: 'Ten to twenty minutes of movement that suits you: seated marching, wheeling, or a short walk if you can.' }
    : { type: 'walk', short: 'Walk', title: 'Walk day', text: 'Walk for 20 to 30 minutes at a pace where you can still chat.' };
  if (p.med === 'weekly') {
    if (off === 0) return { type: 'jab', short: 'Jab', title: 'Injection day', text: 'No strength today. If you feel up to it, do 10 to 20 minutes of easy movement.' };
    const map = p.sessions === 3 ? { 2: 'A', 4: 'B', 6: 'A' } : { 3: 'A', 6: 'B' };
    if (map[off]) return { type: 'strength', short: 'Lift', title: 'Strength session ' + map[off], session: map[off] };
    if (off === 1) return { type: 'easy', short: 'Rest', title: 'Rest day', text: 'The day after your injection is for rest. Eat what you can and keep sipping water.' };
    return walk;
  }
  const map = p.sessions === 3 ? { 0: 'A', 2: 'B', 4: 'A' } : { 0: 'A', 3: 'B' };
  if (map[off]) return { type: 'strength', short: 'Lift', title: 'Strength session ' + map[off], session: map[off] };
  if (off === 6) return { type: 'easy', short: 'Rest', title: 'Rest day', text: 'A full day off. Eat well and get to bed on time: that is when muscle rebuilds.' };
  return walk;
}

/* The numbers behind a set: how many sets, and either reps or seconds. */
function prescription(stage, light, flags) {
  let [sets, reps] = C.STAGES[stage];
  if (light) sets = Math.max(1, sets - 1);
  return (flags || '').includes('h') ? { sets, secs: reps * 3 } : { sets, reps };
}

function dose(stage, light, flags) {
  let [s, r] = C.STAGES[stage];
  if (light) s = Math.max(1, s - 1);
  return (flags || '').includes('h') ? s + ' × ' + (r * 3) + ' sec' : s + ' × ' + r;
}

const feelLevel = (log, level) => !!log && (log.feel || []).some(id => (C.FEEL.find(f => f.id === id) || {}).level === level);
/* Offer the lighter session: hardly eaten, or feeling queasy or wiped out. */
function shouldEase(log) { return !!log && (log.eaten === 'no' || feelLevel(log, 'ease')); }
/* No strength at all today: dizzy, or stomach pain. */
function mustSkip(log) { return feelLevel(log, 'skip') || feelLevel(log, 'stop'); }
/* A dose change in the last 7 days makes every session default to the lighter version. */
function inEaseWeek(p, today) { return !!p.easeUntil && today <= p.easeUntil; }

/* Weekly review: step up, hold or step back. */
function review(p, logs, dates) {
  let done = 0, easy = 0, right = 0, hard = 0, fed = 0;
  dates.forEach(d => { const l = logs[d]; if (!l) return;
    if (l.finished) { done++; if (l.felt === 'easy') easy++; else if (l.felt === 'hard') hard++; else right++; }
    if (l.eaten === 'yes' || (l.protein || 0) >= 3) fed++; });
  let move = 0, why;
  if (done === 0) why = 'No sessions logged this week. Next week stays the same. One session is a win.';
  else if (hard > right + easy) { move = -1; why = 'Most sessions felt too hard. Next week drops back a step so you can finish strong.'; }
  else if (done < p.sessions) why = 'You did ' + done + ' of ' + p.sessions + '. Next week stays the same so you can hit them all.';
  else if (fed < 4) why = 'You trained well but ate enough on only ' + fed + ' days. Hold here until food catches up. Muscle needs fuel.';
  else { move = 1; why = 'Every session done and it felt manageable. Next week steps up.'; }
  const next = Math.max(0, Math.min(C.STAGES.length - 1, p.stage + move));
  return { done, easy, right, hard, fed, move: next - p.stage, next, why };
}

/* Scrambles an access code so the code itself is not written in the app. This keeps honest people honest; it is not strong security. */
function codeHash(str) { let h = 2166136261; for (const ch of String(str)) { h ^= ch.codePointAt(0); h = Math.imul(h, 16777619) >>> 0; } return h.toString(36); }

const weekNo = (start, today) => Math.max(1, Math.floor((parseDay(today) - parseDay(start)) / 6048e5) + 1);
const phase = w => w <= 4 ? 'Foundations' : w <= 8 ? 'Build' : w <= 12 ? 'Strong' : 'For life';

/* ---------- side-effect diary, body trend and calendar ---------- */
const SYMPTOMS = ['queasy', 'bunged', 'tired', 'dizzy', 'pain'];
/* Everything the member logged between two dates (inclusive), counted up for the diary and the GP report. */
function diarySummary(p, logs, from, to) {
  const out = { days: 0, logged: 0, good: 0, sym: {}, after: {}, eaten: { yes: 0, bit: 0, no: 0 }, protein: [], water: [], sessions: 0, light: 0, skipped: 0, pain: 0 };
  SYMPTOMS.forEach(k => { out.sym[k] = 0; out.after[k] = [0, 0, 0, 0, 0, 0, 0]; });
  for (let d = parseDay(from); iso(d) <= to; d = addDays(d, 1)) {
    out.days++; const l = logs[iso(d)]; if (!l) continue;
    const feel = l.feel || [];
    if (feel.length || l.eaten || l.protein || l.water || l.finished) out.logged++;
    if (feel.includes('good')) out.good++;
    SYMPTOMS.forEach(k => { if (feel.includes(k)) { out.sym[k]++; out.after[k][(d.getDay() - p.jab + 7) % 7]++; } });
    if (l.eaten) out.eaten[l.eaten]++;
    if (l.protein) out.protein.push(l.protein);
    if (l.water) out.water.push(l.water);
    if (l.finished) { out.sessions++; if (l.light) out.light++; }
    if (dayPlan(p, d.getDay()).type === 'strength' && !l.finished && mustSkip(l)) out.skipped++;
    out.pain += l.pain || 0;
  }
  return out;
}
/* The day after injection when a symptom shows up most, or -1. */
function peakDay(after) { let best = -1, n = 0; after.forEach((v, i) => { if (v > n) { n = v; best = i; } }); return best; }
const avg = a => a.length ? Math.round(10 * a.reduce((x, y) => x + y, 0) / a.length) / 10 : 0;

/* Percent change from the first value, for drawing weight and strength on one chart. */
function pctSeries(points) { if (!points.length) return []; const b = points[0].v || 1; return points.map(x => ({ d: x.d, v: Math.round(1000 * (x.v - b) / b) / 10 })); }
const kgToSt = kg => { const lb = Math.round(kg * 2.20462); return [Math.floor(lb / 14), lb % 14]; };
const stToKg = (st, lb) => Math.round(((+st || 0) * 14 + (+lb || 0)) / 2.20462 * 10) / 10;

/* A calendar file with the member's weekly strength sessions and injection day as repeating events. */
const ICSDAY = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];
function calendar(p, time, today) {
  const t = String(time).replace(':', '') + '00', stamp = today.replace(/-/g, '') + 'T000000';
  const days = [0, 1, 2, 3, 4, 5, 6].filter(d => dayPlan(p, d).type === 'strength');
  const next = dow => { const d = parseDay(today); while (d.getDay() !== dow) d.setDate(d.getDate() + 1); return iso(d).replace(/-/g, ''); };
  const ev = [];
  if (days.length) ev.push(['BEGIN:VEVENT', 'UID:strength-' + stamp + '@app', 'DTSTAMP:' + stamp, 'DTSTART:' + days.map(next).sort()[0] + 'T' + t, 'DURATION:PT' + p.len + 'M',
    'RRULE:FREQ=WEEKLY;BYDAY=' + days.map(d => ICSDAY[d]).join(','), 'SUMMARY:Strength session', 'DESCRIPTION:Open the app and press Start session. Eat something with protein afterwards.',
    'BEGIN:VALARM', 'ACTION:DISPLAY', 'DESCRIPTION:Strength session in 15 minutes', 'TRIGGER:-PT15M', 'END:VALARM', 'END:VEVENT'].join('\r\n'));
  if (p.med === 'weekly') ev.push(['BEGIN:VEVENT', 'UID:injection-' + stamp + '@app', 'DTSTAMP:' + stamp, 'DTSTART;VALUE=DATE:' + next(p.jab), 'RRULE:FREQ=WEEKLY',
    'SUMMARY:Injection day', 'DESCRIPTION:No strength today. Eat what you can and keep sipping water.', 'TRANSP:TRANSPARENT', 'END:VEVENT'].join('\r\n'));
  return ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Strength app//EN', 'CALSCALE:GREGORIAN'].concat(ev, 'END:VCALENDAR').join('\r\n') + '\r\n';
}

if (typeof module !== 'undefined') module.exports = { iso, addDays, parseDay, monday, pick, sessionList, dayPlan, prescription, dose, shouldEase, mustSkip, inEaseWeek, review, weekNo, phase, codeHash, SYMPTOMS, diarySummary, peakDay, avg, pctSeries, kgToSt, stToKg, calendar };
