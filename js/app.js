/* Holdfast screens and interactions. Programme rules live in logic.js, reviewable content in content.js. */
const KEY = 'holdfast-v4';
const NOW = new Date(), TODAY = iso(NOW);
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const blank = () => ({ profile: null, logs: {}, draft: {}, tests: [], loads: {}, wins: [], msgs: [], voice: false, unlocked: false });

function example() {
  const p = { name: 'Sam', goal: 'muscle', med: 'weekly', jab: (NOW.getDay() + 5) % 7, sessions: 3, len: 25, equip: ['dumbbells', 'bands'], care: [], cond: ['diabetes'], level: 'some', stage: 1, start: iso(addDays(NOW, -16)), example: true };
  const logs = {};
  for (let i = 1; i <= 16; i++) { const d = addDays(NOW, -i), pl = dayPlan(p, d.getDay());
    logs[iso(d)] = { eaten: i % 5 === 3 ? 'bit' : 'yes', protein: i % 5 === 3 ? 2 : 3, water: 6, feel: ['good'], finished: pl.type === 'strength', felt: 'right' }; }
  return { profile: p, logs, draft: {}, tests: [{ d: iso(addDays(NOW, -16)), n: 11 }, { d: iso(addDays(NOW, -2)), n: 13 }], loads: { 'Goblet squat': 8, 'Floor press': 6, 'One-arm row': 8 },
    wins: [{ d: iso(addDays(NOW, -9)), t: 'Stairs felt easier' }, { d: iso(addDays(NOW, -3)), t: 'Carried the shopping' }], msgs: [] };
}

let S; try { S = JSON.parse(localStorage.getItem(KEY)); } catch (e) {}
if (!S || typeof S !== 'object') S = blank();
Object.entries(blank()).forEach(([k, v]) => { if (S[k] === undefined || (S[k] === null && k !== 'profile')) S[k] = v; });
if (location.hash === '#example') S = example();
function save() { if (S.profile && S.profile.example) return; try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} }
function log() { return S.logs[TODAY] || (S.logs[TODAY] = {}); }

const hashCode = (location.hash.match(/^#join-([\w-]+)$/) || [])[1];
if (hashCode && typeof codeHash === 'function' && codeHash(hashCode.toUpperCase()) === C.LAUNCH.codeHash) { S.unlocked = true; try { history.replaceState(null, '', location.pathname); } catch (e) {} }
let view = S.profile ? 'today' : 'welcome', step = 0, msg = '', timer = null;
let T = { left: 30, count: 0, state: 'idle' };          // strength test
let R = { id: null, i: 0, left: 0, paused: false };     // guided routine
let G = { mode: 'idle', set: 1, t: 0, left: 0 };        // guided set: idle, rep, rest, done
let X = { help: null, hurt: null };                     // help open on the current exercise
function resetEx() { clearInterval(timer); G = { mode: 'idle', set: 1, t: 0, left: 0 }; X = { help: null, hurt: null }; }

const app = document.getElementById('app'), hd = document.getElementById('hd'), tabs = document.getElementById('tabs');
const on = (cur, val) => Array.isArray(cur) ? cur.includes(val) : String(cur) === String(val);
const chip = (act, val, cur, text) => `<button class="chip" data-act="${act}" data-val="${val}" aria-pressed="${on(cur, val)}">${text}</button>`;
const tile = (act, val, cur, text, sub) => `<button class="tile" data-act="${act}" data-val="${val}" aria-pressed="${on(cur, val)}">${text}<small>${sub}</small></button>`;
/* A video is a real player once its link is in js/videos.js. Until then it is a labelled placeholder. */
function videoId(title) { const v = (typeof VIDEOS !== 'undefined' && VIDEOS[title]) || ''; const m = String(v).match(/(?:youtu\.be\/|v=|shorts\/|embed\/)([\w-]{6,})/); return m ? m[1] : /^[\w-]{6,}$/.test(v) ? v : ''; }
const hasVideo = title => !!videoId(title);
function video(title, sub, cls) {
  const id = videoId(title);
  if (id) return `<div class="video real"><iframe src="https://www.youtube-nocookie.com/embed/${id}?rel=0&playsinline=1" title="${esc(title)}" allow="accelerometer; encrypted-media; picture-in-picture; fullscreen" allowfullscreen loading="lazy"></iframe></div>`;
  return `<div class="video ${cls || ''}" role="img" aria-label="Video coming soon: ${title}"><span class="play"></span>${cls ? '' : `<strong>${title}</strong><small>${sub}</small>`}</div>`;
}
/* A row with a small video tile; becomes a full player above the text once the video exists. */
const mediaRow = (title, body) => hasVideo(title) ? `<div class="stack">${video(title, '')}${body}</div>` : `<div class="lesson">${video(title, '', 'thumb')}${body}</div>`;
const proto = t => `<p class="proto"><b>Prototype note</b> ${t}</p>`;
const mail = (subject, body) => { location.href = 'mailto:' + C.LAUNCH.coachEmail + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body); };

/* ---------- derived ---------- */
const wk = () => weekNo(S.profile.start, TODAY);
function weeksMap() { const m = {}; Object.keys(S.logs).forEach(d => { if (S.logs[d].finished) { const k = monday(parseDay(d)); m[k] = (m[k] || 0) + 1; } }); return m; }
function streak() { const m = weeksMap(), need = S.profile.sessions; let n = 0, d = parseDay(monday(NOW)); if ((m[iso(d)] || 0) < need) d = addDays(d, -7); while ((m[iso(d)] || 0) >= need) { n++; d = addDays(d, -7); } return n; }
function badges() {
  const m = weeksMap(), tot = Object.values(m).reduce((a, b) => a + b, 0), all = Object.values(S.logs);
  const fed = all.filter(l => l.eaten === 'yes' || (l.protein || 0) >= 3).length, calm = all.reduce((a, l) => a + (l.routines || []).length, 0);
  return [['1', 'First session', tot >= 1], ['★', 'A full week', Object.values(m).some(v => v >= S.profile.sessions)], ['S', 'Strength score set', S.tests.length >= 1], ['10', 'Ten sessions', tot >= 10], ['P', 'Fuelled 5 days', fed >= 5], ['↑', 'Score improved', S.tests.length >= 2 && S.tests[S.tests.length - 1].n > S.tests[0].n], ['~', 'Three calm moments', calm >= 3], ['♥', 'Three wins noted', S.wins.length >= 3], ['25', 'Twenty-five sessions', tot >= 25]];
}
function shareText() {
  const t = S.tests, tot = Object.values(weeksMap()).reduce((a, b) => a + b, 0);
  const score = t.length > 1 ? `My strength score has gone from ${t[0].n} to ${t[t.length - 1].n}. ` : t.length ? `My strength score is ${t[0].n}. ` : '';
  return `I'm ${wk()} weeks into Holdfast, the strength programme for people on weight-loss medication. ${tot} sessions done. ${score}Losing the weight, keeping the strength.`;
}

/* ---------- shared pieces ---------- */
function weekStrip() {
  const p = S.profile, mon = parseDay(monday(NOW));
  let h = '<div class="week" aria-label="This week">';
  for (let i = 0; i < 7; i++) { const d = addDays(mon, i), pl = dayPlan(p, d.getDay()), l = S.logs[iso(d)];
    h += `<div class="day ${pl.type}${iso(d) === TODAY ? ' today' : ''}${l && l.finished ? ' done' : ''}"><b>${C.DAYS[d.getDay()]}</b><i></i><span>${pl.short}</span></div>`; }
  return h + '</div>';
}
function ring(done, need) { const c = 2 * Math.PI * 36, f = Math.min(1, done / need);
  return `<div class="ring" role="img" aria-label="${done} of ${need} sessions this week"><svg viewBox="0 0 84 84"><circle cx="42" cy="42" r="36" fill="none" stroke="rgba(255,255,255,.15)" stroke-width="9"/><circle cx="42" cy="42" r="36" fill="none" stroke="#FFC23C" stroke-width="9" stroke-linecap="round" stroke-dasharray="${c * f} ${c}"/></svg><b>${done}/${need}</b></div>`; }
const exNote = () => S.profile.example ? `<div class="note"><p class="small"><strong>You are looking at an example member, Sam, in week 3.</strong> Nothing here is saved.</p><button class="btn" data-act="start">Build my own plan</button></div>` : '';
const routineRow = id => { const r = C.ROUTINES[id]; return `<button class="rowbtn" data-act="routine" data-val="${id}"><span class="glyph ${r.group === 'mind' ? 'g3' : 'g2'}">${r.mins}</span><span><strong>${r.title}</strong><small>${r.blurb} · ${r.mins} min</small></span></button>`; };

/* ---------- screens ---------- */
/* A small, static picture of the app for the landing page. Example data, not a real member. */
function phoneMock() {
  const days = [['Mon', 'walk', 'Walk'], ['Tue', 'strength done', 'Lift'], ['Wed', 'jab', 'Jab'], ['Thu', 'easy', 'Rest'], ['Fri', 'strength today', 'Lift'], ['Sat', 'walk', 'Walk'], ['Sun', 'strength', 'Lift']];
  return `<div class="phone" role="img" aria-label="The Holdfast app showing an example member's week and today's strength session"><div class="phonein">
    <section class="stage"><div class="stagehead"><div><span class="pill">Week 3 · Foundations</span><h2>Hi Sam</h2><p class="soft small">2 more this week to keep your muscle.</p></div>${ring(1, 3)}</div>
      <div class="week">${days.map(d => `<div class="day ${d[1]}"><b>${d[0]}</b><i></i><span>${d[2]}</span></div>`).join('')}</div></section>
    <section class="todaycard strength"><p class="eyebrow">Today · Friday</p><h2>Strength session A</h2><p>4 exercises · about 25 minutes</p><span class="btn white">Start session</span></section>
    <div class="card"><h3>How are you feeling today?</h3><div class="chips"><span class="chip">Good</span><span class="chip">Queasy</span><span class="chip">Wiped out</span></div></div>
  </div></div>`;
}

function viewWelcome() {
  const mine = S.profile && !S.profile.example;
  const cta = mine ? `<button class="btn" data-go="today">Open my plan</button>` : `<button class="btn" data-act="start">Start my plan</button>`;
  const join = C.LAUNCH.joinUrl ? `<a class="btn ghost" href="${C.LAUNCH.joinUrl}" target="_blank" rel="noopener">Join now</a>` : '';
  const faqs = [['I have never done strength training. Is this for me?', 'Yes. It is made for beginners. Every exercise is shown on video and explained step by step, and you can make any of them easier with one tap.'], ['Which medication does it work with?', 'All of them: weekly injections, daily tablets, or if you have stopped. We never ask for the name or the dose.'], ['Do I need a gym or equipment?', 'No. A sturdy chair is enough. If you cannot get down on the floor, tell us and everything will be standing or seated.'], ['What does it cost?', 'Setting up your plan is free. You will always see the price before you pay anything.']];
  return `<section class="lhero"><div class="lcopy"><h1>Lose the weight.<br>Keep your strength.</h1>
    <p class="lead">Holdfast is the strength and nutrition app for people on weight-loss medication. Short workouts, simple food guidance, and help on the days you feel rough.</p>
    <div class="row">${cta}${join}</div><p class="small muted">Two minutes to set up. No card needed.</p></div>${hasVideo('See how Holdfast works') ? video('See how Holdfast works', '') : phoneMock()}</section>

  <section class="lsec"><h2>What you do with it</h2><div class="plain">
    <div><h3>Move</h3><p>Two or three short strength sessions a week. Every exercise is shown on video and explained step by step. No gym needed.</p></div>
    <div><h3>Eat</h3><p>Simple guidance on protein, fluids and what to eat when you are not hungry. No calorie counting.</p></div>
    <div><h3>Feel better</h3><p>Tell the app how you feel each day. If you are sick, tired or sore, it gives you something gentler.</p></div></div></section>

  <section class="who"><h2>Made by the people your GP would send you to</h2><p>When a doctor wants a patient to exercise safely with a health condition, they refer them to an exercise referral specialist. That is who built Holdfast, and every Holdfast coach is one. We work every day with people living with obesity, type 2 diabetes, high blood pressure and sore joints.</p></section>

  <section class="lsec"><h2>How to start</h2><div class="steps">
    <div class="step"><b>1</b><div><strong>Answer a few questions</strong><p class="small muted">About your medication, your body and what you have at home.</p></div></div>
    <div class="step"><b>2</b><div><strong>Get your plan</strong><p class="small muted">Built for you, on the days that suit you.</p></div></div>
    <div class="step"><b>3</b><div><strong>Press start</strong><p class="small muted">We show you each move and count with you.</p></div></div></div><div>${cta}</div></section>

  <section class="lsec narrow"><h2>Good questions</h2>${faqs.map(f => `<details class="card faq"><summary>${f[0]}</summary><p>${f[1]}</p></details>`).join('')}</section>
  ${mine ? '' : `<button class="link" data-act="example">Look around an example plan first</button>`}`;
}

/* ---------- sign-up quiz: one question at a time, with a short fact every few questions ---------- */
const SEQ = ['name', 'med', 'fact1', 'jab', 'goal', 'fact2', 'screen', 'cond', 'equip', 'fact3', 'care', 'shape'];
const AUTO = ['med', 'jab', 'goal'];
const seq = () => S.draft.editing ? SEQ.filter(k => !k.startsWith('fact')) : SEQ;
function say(key) {
  const d = S.draft, n = esc((d.name || '').trim()), has = (k, v) => (d[k] || []).includes(v);
  switch (key) {
    case 'name': return 'Hello. A few quick questions, then I will build your plan. Two minutes, and no trick questions.';
    case 'med': return `Good to meet you, ${n}. First, the practical bit.`;
    case 'jab': return d.med === 'weekly' ? 'So I will keep your hardest sessions well away from injection day.' : d.med === 'daily' ? 'With a daily dose there is no rough day to plan round, so I will spread things evenly.' : 'Coming off is when strength matters most. You are in the right place.';
    case 'goal': return `${C.FULL[d.jab]} it is. Now the important one.`;
    case 'screen': return 'Next, a safety check. I take this bit seriously.';
    case 'cond': return has('screen', 'none') ? 'Nothing there to hold you back. Good.' : 'Thank you for telling me. Your GP\'s say-so comes first, always.';
    case 'equip': return has('cond', 'none') ? 'Noted. Now, what have you got to train with?' : 'Useful to know. I will put the right safety notes into your sessions.';
    case 'care': return 'Nearly there.';
    default: return has('care', 'none') ? 'Lovely. Last one.' : has('care', 'floor') ? 'No floor work for you, then. Everything standing or seated. Last one.' : 'I will work round that. Last one.';
  }
}
function viewSetup() {
  const d = S.draft, order = seq(), key = order[step]; let body, ok = true, auto = false;
  if (key.startsWith('fact')) { const f = C.FACTS[key];
    return `<div class="quiz"><div class="bar" style="grid-template-columns:repeat(${order.length},1fr)">${order.map((_, i) => `<i class="${i <= step ? 'on' : ''}"></i>`).join('')}</div>
      <section class="factcard"><p class="eyebrow">${f.label}</p><h2>${f.head}</h2><p>${f.body}</p>${f.source ? `<p class="small source">${f.source}</p>` : ''}</section>
      <div class="row"><button class="btn ghost" data-act="back">Back</button><button class="btn" id="nextbtn" data-act="next">${f.button}</button></div></div>`; }
  if (key === 'name') { ok = !!(d.name && d.name.trim());
    body = `<h2>What should I call you?</h2><div class="card"><label for="name" class="small muted">First name</label><input type="text" id="name" maxlength="24" autocomplete="given-name" value="${esc(d.name || '')}"></div>`;
  } else if (key === 'med') { auto = true;
    body = `<h2>How do you take your medication?</h2><p class="muted">I only need the rhythm. Never the name, never the dose.</p><div class="tiles one">${tile('med', 'weekly', d.med, 'A weekly injection', 'Your week is built around injection day')}${tile('med', 'daily', d.med, 'A daily tablet or injection', 'Sessions spread evenly across your week')}${tile('med', 'none', d.med, 'I am coming off it, or already have', 'A plan for keeping the weight off and the strength on')}</div>`;
  } else if (key === 'jab') { auto = true;
    body = (d.med === 'weekly' ? `<h2>Which day is your injection?</h2><p class="muted">No strength that day, and rest the day after.</p>` : `<h2>Which day shall we start your week?</h2><p class="muted">Your first strength session lands here.</p>`) + `<div class="card"><div class="chips">${C.FULL.map((n, i) => chip('jab', i, d.jab, n)).join('')}</div></div>`;
  } else if (key === 'goal') { auto = true;
    body = `<h2>What do you want most from this?</h2><div class="tiles">${tile('goal', 'muscle', d.goal, 'Keep my muscle', 'Lose fat, not strength')}${tile('goal', 'stronger', d.goal, 'Feel stronger', 'Stairs, shopping, life')}${tile('goal', 'energy', d.goal, 'More energy', 'Less wiped out')}${tile('goal', 'confidence', d.goal, 'Confidence', 'Know what I am doing')}</div>`;
  } else if (key === 'screen') { const sc = d.screen || [], flagged = sc.length && !sc.includes('none'); ok = sc.length && (!flagged || d.cleared);
    body = `<h2>Do any of these apply to you?</h2><p class="muted">Tap any that do. Be honest, it only makes your plan safer.</p><div class="tiles one">${C.SCREEN.map((q, i) => tile('screen', 'q' + i, sc, q, '')).join('')}${tile('screen', 'none', sc, 'None of these apply to me', '')}</div>
    ${flagged ? `<div class="note"><p><strong>Please check with your GP or prescriber before you start.</strong> Most people get a yes. It just needs to come from them, not from me.</p><label class="check small"><input type="checkbox" id="cleared" data-act="cleared" ${d.cleared ? 'checked' : ''}><span>My GP or prescriber has told me strength training is safe for me.</span></label></div>` : ''}`;
  } else if (key === 'cond') { ok = !!(d.cond && d.cond.length);
    body = `<h2>Are you living with any of these?</h2><p class="muted">No judgement. It just changes the safety notes I give you.</p><div class="tiles">${Object.keys(C.CONDITIONS).map(k => tile('cond', k, d.cond || [], C.CONDITIONS[k][0], C.CONDITIONS[k][1])).join('')}</div>`;
  } else if (key === 'equip') { ok = !!(d.equip && d.equip.length);
    body = `<h2>What can you train with?</h2><p class="muted">Pick everything you have.</p><div class="tiles">${Object.keys(C.KIT).map(k => tile('equip', k, d.equip || [], C.KIT[k][0], C.KIT[k][1])).join('')}</div>`;
  } else if (key === 'care') { ok = !!(d.care && d.care.length);
    body = `<h2>Anything you want me to look after?</h2><p class="muted">Pick all that apply. I will swap in exercises that suit you.</p><div class="tiles">${Object.keys(C.CARE).map(k => tile('care', k, d.care || [], C.CARE[k][0], C.CARE[k][1])).join('')}</div>`;
  } else { ok = !!(d.sessions && d.len && d.level);
    body = `<h2>Last one: shape your sessions</h2><div class="card"><fieldset><legend>How many a week?</legend><div class="chips">${chip('sessions', 2, d.sessions, '2')}${chip('sessions', 3, d.sessions, '3')}</div><p class="small muted">Two is plenty to start.</p></fieldset>
    <fieldset><legend>How long have you got?</legend><div class="chips">${chip('len', 15, d.len, '15 min')}${chip('len', 25, d.len, '25 min')}${chip('len', 35, d.len, '35 min')}</div></fieldset>
    <fieldset><legend>Done strength training before?</legend><div class="chips">${chip('level', 'new', d.level, 'Never')}${chip('level', 'some', d.level, 'A little')}${chip('level', 'regular', d.level, 'Regularly')}</div></fieldset></div>`;
  }
  const next = auto && !d.editing ? '' : `<button class="btn" id="nextbtn" data-act="next" ${ok ? '' : 'disabled'}>${step === order.length - 1 ? 'Build my plan' : 'Next'}</button>`;
  return `<div class="quiz"><div class="bar" style="grid-template-columns:repeat(${order.length},1fr)" role="img" aria-label="Step ${step + 1} of ${order.length}">${order.map((_, i) => `<i class="${i <= step ? 'on' : ''}"></i>`).join('')}</div>
    <div class="say"><span class="mark"></span><p>${say(key)}</p></div>${body}<div class="row"><button class="btn ghost" data-act="back">Back</button>${next}</div></div>`;
}

/* ---------- paywall: on when a payment link is set in LAUNCH ---------- */
const paid = () => !C.LAUNCH.joinUrl || S.unlocked === true || (S.profile && S.profile.example);
function tryCode(raw) { const ok = !!raw && codeHash(raw) === C.LAUNCH.codeHash; if (ok) { S.unlocked = true; save(); } return ok; }
function viewPaywall() {
  const L = C.LAUNCH, p = S.profile;
  return `<div class="quiz"><div class="say"><span class="mark"></span><p>${p ? esc(p.name) + ', your plan is ready and waiting.' : 'Your plan is waiting.'} One step left.</p></div>
    <section class="factcard"><p class="eyebrow">Join Holdfast</p><h2>${L.price}</h2><p>${L.priceNote}</p></section>
    <div class="card"><ul class="ticks"><li><span>Your full plan, adjusting every week</span></li><li><span>Every exercise on video, step by step</span></li><li><span>Nutrition guidance and help on rough days</span></li><li><span>A qualified coach to ask</span></li></ul>
      <a class="btn" href="${L.joinUrl}" target="_blank" rel="noopener">Join now</a><p class="small muted">Secure payment by Stripe. You come straight back here afterwards.</p></div>
    <div class="card"><label for="code" class="small"><strong>Already joined? Enter your access code</strong></label><input type="text" id="code" autocomplete="off" autocapitalize="characters" maxlength="24"><button class="btn ghost" data-act="unlock">Unlock</button>${msg ? `<p role="status" class="small"><strong>${msg}</strong></p>` : ''}</div>
    <button class="link" data-act="home">Not now</button></div>`;
}

/* The plan, shown back to the member before they go in. */
function viewReveal() {
  const p = S.profile; let first = null;
  for (let i = 0; i < 7 && !first; i++) { const d = addDays(NOW, i), pl = dayPlan(p, d.getDay()); if (pl.type === 'strength') first = { when: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : C.FULL[d.getDay()], pl }; }
  const built = [p.med === 'weekly' ? `Strength kept well away from your ${C.FULL[p.jab]} injection` : p.med === 'daily' ? 'Sessions spread evenly across your week' : 'A plan for keeping the weight off and the strength on',
    `${p.sessions} sessions a week, ${p.len} minutes each, starting at level ${p.stage + 1} of 6`, 'Using ' + p.equip.map(k => C.KIT[k][0].toLowerCase()).join(', ')];
  if (!p.care.includes('none')) built.push('Adapted for: ' + p.care.map(k => C.CARE[k][0].toLowerCase()).join(', '));
  if (!p.cond.includes('none')) built.push('Safety notes for ' + p.cond.map(k => C.CONDITIONS[k][0].toLowerCase()).join(', '));
  return `<div class="quiz"><div class="say"><span class="mark"></span><p>Here it is, ${esc(p.name)}. Built round you, and it will keep adjusting as you go.</p></div>
    <section class="stage"><div><span class="pill">Your week</span></div>${weekStrip()}</section>
    <div class="card"><h3>What I built in</h3><ul class="ticks">${built.map(x => `<li><span>${x}</span></li>`).join('')}</ul></div>
    <div class="card"><h3>Your first session: ${first.when}</h3><p class="small muted">${sessionList(p, first.pl.session).map(e => e[0]).join(', ')}</p><p class="small">Never done these? Every one comes with a step-by-step guide, and I will count with you.</p></div>
    <button class="btn" data-go="today">Take me in</button></div>`;
}

function viewToday() {
  const p = S.profile, pl = dayPlan(p, NOW.getDay()), l = log(), strength = pl.type === 'strength', w = wk(), ph = phase(w);
  const done = weeksMap()[monday(NOW)] || 0, st = streak(), last = S.tests[S.tests.length - 1];
  const due = !last || ((parseDay(TODAY) - parseDay(last.d)) / 864e5 >= 28);
  const skip = mustSkip(l), easeWeek = inEaseWeek(p, TODAY), ease = shouldEase(l) || easeWeek, light = l.light === undefined ? easeWeek : l.light;
  let h = exNote() + `<section class="stage"><div class="stagehead"><div><span class="pill">Week ${w} · ${ph}</span><h2>Hi ${esc(p.name)}</h2><p class="soft small">${done >= p.sessions ? 'Week complete. That is how you ' + C.GOALS[p.goal] + '.' : (p.sessions - done) + ' more this week to ' + C.GOALS[p.goal] + '.'}${st > 1 ? ' ' + st + ' weeks in a row.' : ''}</p></div>${ring(done, p.sessions)}</div>${weekStrip()}</section>`;

  h += `<div class="card"><div><h3>How are you feeling today?</h3><p class="small muted">Tap all that apply. Your day adjusts to match.</p></div><div class="chips">${C.FEEL.map(f => chip('feel', f.id, l.feel || [], f.label)).join('')}</div>`;
  C.FEEL.filter(f => f.level && (l.feel || []).includes(f.id)).forEach(f => {
    h += `<div class="resp ${f.level}"><strong>${f.title}</strong><p class="small">${f.text}</p>${f.routine ? routineRow(f.routine) : ''}</div>`; });
  h += `</div>`;

  h += `<section class="todaycard ${strength && !skip ? 'strength' : pl.type === 'strength' ? 'easy' : pl.type}"><p class="eyebrow">Today · ${C.FULL[NOW.getDay()]}</p>`;
  if (strength && skip) h += `<h2>Strength can wait</h2><p>Today's session moves to your next good day. Looking after yourself is the plan.</p>`;
  else if (strength) h += l.finished ? `<h2>Done for today</h2><p>Session logged. Eat something with protein in the next hour or two.</p>`
    : `<h2>${pl.title}</h2><p>${sessionList(p, pl.session).length} exercises · about ${p.len - (light ? 5 : 0)} minutes${light ? ' · lighter version' : ''}</p><button class="btn white" data-act="begin">${l.pos ? 'Carry on' : 'Start session'}</button>`;
  else h += `<h2>${pl.title}</h2><p>${pl.text}</p>`;
  h += `</section>`;
  if (strength && !l.finished && !skip && ease) h += light
    ? `<div class="note"><p><strong>Lighter session switched on.</strong> ${easeWeek ? 'Your dose changed this week, so every session is lighter until it settles. ' : ''}One set fewer and about half your usual weight.</p><button class="link" data-act="unlight">Switch back to the full session</button></div>`
    : `<div class="note"><p><strong>Drop the weights today.</strong> A lighter session will do you more good than a heavy one.</p><button class="btn" data-act="light">Switch to the lighter session</button></div>`;

  if (due && !skip) h += `<div class="card"><h3>${last ? 'Time to re-test your strength score' : 'Set your strength score'}</h3><p class="small muted">${last ? 'It has been 4 weeks. See what has changed.' : 'A 30-second test from a chair. It is how you will see your strength holding while the weight comes off.'}</p><button class="btn ghost" data-act="test">Take the 30-second test</button></div>`;

  h += `<div class="card"><div><h3>Fuel check</h3><p class="small muted">Muscle is built from what you eat. Three taps.</p></div>
    <fieldset><legend>Have you eaten enough today?</legend><div class="chips">${chip('eaten', 'yes', l.eaten, 'Yes')}${chip('eaten', 'bit', l.eaten, 'A bit')}${chip('eaten', 'no', l.eaten, 'Hardly anything')}</div></fieldset>
    ${l.eaten === 'no' ? '<p class="small"><strong>Small and often works better than big meals.</strong> <button class="link inline" data-go="food">See what to eat when you cannot face food</button></p>' : ''}
    <fieldset><legend>Protein portions <span class="muted small">(aim for 3, each the size of your palm)</span></legend><div class="dots">${[1, 2, 3, 4].map(n => `<button class="dot${(l.protein || 0) >= n ? ' on' : ''}" data-act="protein" data-val="${n}" aria-label="${n} protein portions">${n}</button>`).join('')}</div></fieldset>
    <fieldset><legend>Drinks <span class="muted small">(aim for 6 to 8)</span></legend><div class="stepper"><button data-act="waterdown" aria-label="One fewer drink">−</button><b>${l.water || 0}</b><button data-act="waterup" aria-label="One more drink">+</button></div></fieldset></div>

  <div class="card coachnote"><p class="eyebrow">This week from your coach</p>${mediaRow('Coach note: ' + ph, `<p>"${C.COACH[ph]}"</p>`)}</div>
  <div class="insight"><p class="eyebrow">Today's insight</p><h3>${C.INSIGHT[pl.type][0]}</h3><p class="small">${C.INSIGHT[pl.type][1]}</p></div>
  <details class="note stop"><summary>When to stop and get help</summary><ul class="small"><li>Chest pain, fainting or severe breathlessness: stop and call 999.</li><li>Severe stomach pain that will not settle, pain spreading to your back, or being sick repeatedly: call 111.</li><li>Dizzy or shaky during a session: stop, sit down, eat or drink something.</li><li>Changes in your eyesight if you have diabetes: contact your GP.</li><li>New joint or back pain that lasts past the session: rest it and message your coach.</li></ul></details>`;
  return h;
}

function guideHtml(name, open) {
  const g = GUIDES[name]; if (!g) return '';
  return `<details class="guidebox" ${open ? 'open' : ''}><summary>How to do it, step by step</summary>
    <p class="small"><strong>Set up.</strong> ${g.s}</p><ol class="small">${g.m.map(x => `<li>${x}</li>`).join('')}</ol>
    <p class="small"><strong>You should feel it in:</strong> ${g.f.charAt(0).toLowerCase() + g.f.slice(1)}.</p>
    <p class="small"><strong>Breathing.</strong> ${C.BREATHE}</p></details>`;
}

function viewSession() {
  const p = S.profile, pl = dayPlan(p, NOW.getDay()), l = log(), list = sessionList(p, pl.session), n = list.length, pos = l.pos || 0;
  const light = l.light === undefined ? inEaseWeek(p, TODAY) : l.light;
  const everDone = Object.values(S.logs).some(x => x.finished);
  if (!everDone && !pos && !l.ready) return `<div><p class="eyebrow muted">Before your first session</p><h2>Let us get you set up safely</h2><p class="muted">Two minutes now makes every session easier.</p></div>
    <div class="card"><h3>Have these ready</h3><ul class="ticks">${C.READY.map(x => `<li><span>${x}</span></li>`).join('')}</ul></div>
    <div class="card"><h3>How hard should it feel?</h3><p class="small">${C.EFFORT}</p><p class="small">${C.BREATHE}</p></div>
    <div class="card"><h3>You are in charge</h3><p class="small">Every exercise has three buttons: make it easier, this hurts, and am I doing it right. Use them. Stopping early is always allowed.</p></div>
    <div class="row"><button class="btn ghost" data-act="prev">Not now</button><button class="btn" data-act="ready">I am ready</button></div>`;
  const bar = `<div class="bar" style="grid-template-columns:repeat(${n},1fr)">${list.map((_, i) => `<i class="${i <= pos ? 'on' : ''}"></i>`).join('')}</div>`;
  if (pos >= n) return `${bar}<h2>That is the session</h2><div class="card"><fieldset><legend>How did it feel?</legend><div class="chips">${chip('felt', 'easy', l.felt, 'Too easy')}${chip('felt', 'right', l.felt, 'About right')}${chip('felt', 'hard', l.felt, 'Too hard')}</div><p class="small muted">Your answer shapes next week.</p></fieldset></div>
    <div class="row"><button class="btn ghost" data-act="prev">Back</button><button class="btn" data-act="finish" ${l.felt ? '' : 'disabled'}>Finish</button></div>`;

  const e = list[pos], name = e[0], load = e[2].includes('l'), kg = S.loads[name], rx = prescription(p.stage, light, e[2]), g = GUIDES[name] || {};
  const safety = pos === 0 ? (p.cond || []).filter(c => C.SAFETY[c]).map(c => C.SAFETY[c][0]) : [];
  const unit = rx.reps ? rx.reps + ' reps' : rx.secs + ' seconds';
  let set;
  if (G.mode === 'rep') set = `<p class="eyebrow muted">Set ${G.set} of ${rx.sets}</p><p class="big" id="gnum">${rx.reps ? Math.floor(G.t / 4) + 1 : G.left}</p><p class="muted">${rx.reps ? 'of ' + rx.reps + '. Slow and steady.' : 'seconds left. Keep breathing.'}</p>${rx.reps ? '<div class="pace"><i></i></div>' : ''}<button class="btn ghost" data-act="gstop">Stop the set</button>`;
  else if (G.mode === 'rest') set = `<p class="eyebrow muted">Rest</p><p class="big" id="gnum">${G.left}</p><p class="muted">Shake it out. Have a sip of water.</p><button class="btn ghost" data-act="gskip">I am ready for set ${G.set + 1}</button>`;
  else if (G.mode === 'done') set = `<span class="glyph g2">✓</span><p><strong>All ${rx.sets} ${rx.sets > 1 ? 'sets' : 'set'} done.</strong> Nicely done.</p>`;
  else set = `<p class="eyebrow muted">Set ${G.set} of ${rx.sets}${light ? ' · lighter version' : ''}</p><p class="dose">${unit}</p><button class="btn" data-act="gstart">Start set ${G.set}</button><label class="check small"><input type="checkbox" id="voice" data-act="voice" ${S.voice ? 'checked' : ''}><span>Count out loud for me</span></label>`;

  let help = '';
  if (X.help === 'easier') help = `<div class="resp info"><strong>Try this</strong><p class="small">${g.e || 'Do fewer reps, or use less weight.'}</p><p class="small">Easier is not cheating. It is how you get to do it again next week.</p></div>`;
  else if (X.help === 'hurts' && !X.hurt) help = `<div class="resp ease"><strong>What kind of feeling is it?</strong><div class="chips">${chip('hurt', 'sharp', X.hurt, 'Sharp or sudden pain')}${chip('hurt', 'work', X.hurt, 'Hard work or a dull ache')}</div></div>`;
  else if (X.hurt === 'sharp') help = `<div class="resp stop"><strong>Stop this exercise.</strong><p class="small">Sharp pain is your body saying no, and you should listen. We have noted it for your coach. Move on to the next exercise, or stop here for today.</p><button class="btn" data-act="skipex">Skip this exercise</button></div>`;
  else if (X.hurt === 'work') help = `<div class="resp info"><strong>That sounds like muscles working.</strong><p class="small">Warm, tired or a bit shaky is normal and it passes within a minute of stopping. If you want it gentler: ${(g.e || 'do fewer reps.').charAt(0).toLowerCase() + (g.e || 'do fewer reps.').slice(1)}</p></div>`;
  else if (X.help === 'form') help = `<div class="resp info"><strong>Let a coach look</strong><p class="small">Prop your phone up, film two or three reps from the side, and a coach will tell you what to keep and what to change.</p><button class="btn" data-act="formcheck">Ask for a form check</button></div>`;
  else if (X.help === 'formsent') help = `<div class="resp info"><strong>Form check requested for ${name}.</strong>${C.LAUNCH.coachEmail ? `<p class="small">Your email app opens. Attach your clip and press send. Your coach replies by email.</p>` : proto('Saved on this device. Add a coach email in js/content.js to send requests by email.')}</div>`;

  return `<div><p class="eyebrow muted">Exercise ${pos + 1} of ${n}</p>${bar}</div>
    ${safety.length ? `<div class="note"><p class="small"><strong>Before you start.</strong> ${safety.join(' ')}</p></div>` : ''}
    ${video(name, 'Video coming soon')}
    <div><h2>${name}</h2><p class="muted">${e[1]}</p></div>
    <div class="card">${guideHtml(name, p.level === 'new' || !everDone)}</div>
    <div class="card guided">${set}</div>
    <div class="card"><p class="small"><strong>Need a hand?</strong></p><div class="chips">${chip('help', 'easier', X.help, 'Make it easier')}${chip('help', 'hurts', X.help, 'This hurts')}${chip('help', 'form', X.help === 'formsent' ? 'form' : X.help, 'Am I doing it right?')}</div>${help}</div>
    ${load ? `<div class="card"><div><h3>Weight used</h3><p class="small muted">${kg ? 'Saved for next time, so you can see it go up.' : 'Start light. Log it once and we remember it.'}</p></div><div class="stepper"><button data-act="loaddown" data-val="${esc(name)}" aria-label="Less weight">−</button><b>${kg || 0} kg</b><button data-act="loadup" data-val="${esc(name)}" aria-label="More weight">+</button></div></div>` : ''}
    <div class="row"><button class="btn ghost" data-act="prev">${pos ? 'Back' : 'Exit'}</button><button class="btn" data-act="nextex">Done, next</button></div>`;
}

function viewMoves() {
  const p = S.profile;
  return `<div><p class="eyebrow muted">My plan</p><h2>Learn your exercises</h2><p class="muted">Read them through, or try one with no weight, before your first session. Nothing here is timed.</p></div>` +
    ['A', 'B'].map(w => `<h3>Session ${w}</h3>` + sessionList(p, w).map(e => `<div class="card">${mediaRow(e[0], `<div><strong>${e[0]}</strong><p class="small muted">${e[1]}</p></div>`)}${guideHtml(e[0], false)}<p class="small"><strong>To make it easier:</strong> ${(GUIDES[e[0]] || {}).e || ''}</p></div>`).join('')).join('') +
    `<button class="btn ghost" data-go="plan">Back to my plan</button>`;
}

function viewTest() {
  const body = T.state === 'idle' ? `<p class="big">30</p><p class="muted">seconds</p><button class="btn" data-act="timer">Start the timer</button>`
    : T.state === 'run' ? `<p class="big" id="clock">${T.left}</p><p class="muted">Stand up and sit down. Count each stand.</p>`
    : `<p class="muted">Time. How many full stands did you do?</p><div class="stepper" style="justify-content:center"><button data-act="cdown" aria-label="One fewer">−</button><b>${T.count}</b><button data-act="cup" aria-label="One more">+</button></div><button class="btn" data-act="savetest" ${T.count ? '' : 'disabled'}>Save my score</button>`;
  return `<div><p class="eyebrow muted">Strength score</p><h2>The 30-second sit to stand</h2><p class="muted">Sit on a sturdy chair, arms crossed over your chest. Stand fully up and sit back down as many times as you can in 30 seconds.</p></div>
    ${video('How to do the test', 'Video coming soon')}
    <div class="card" style="text-align:center;align-items:center">${body}</div>
    <button class="link" data-act="exittest">Not now</button>`;
}

function viewRoutine() {
  const r = C.ROUTINES[R.id];
  if (R.i >= r.steps.length) return `<div class="card" style="text-align:center;align-items:center"><span class="glyph g2">✓</span><h2>Done</h2><p class="muted">${r.group === 'mind' ? 'That was time for you. It counts as much as a session.' : 'Notice how you feel now compared with five minutes ago.'}</p><button class="btn" data-act="endroutine">Back</button></div>`;
  const s = r.steps[R.i];
  return `<div><p class="eyebrow muted">${r.title} · step ${R.i + 1} of ${r.steps.length}</p><div class="bar" style="grid-template-columns:repeat(${r.steps.length},1fr)">${r.steps.map((_, i) => `<i class="${i <= R.i ? 'on' : ''}"></i>`).join('')}</div></div>
    ${R.i === 0 && hasVideo(r.title) ? video(r.title, '') : ''}<div class="card guided">${s[2] ? `<div class="breath${R.paused ? ' still' : ''}" aria-hidden="true"></div>` : ''}<p class="guide">${s[0]}</p><p class="big" id="rclock">${R.left}</p></div>
    <div class="row"><button class="btn ghost" data-act="rpause">${R.paused ? 'Resume' : 'Pause'}</button><button class="btn" data-act="rskip">Next step</button></div>
    <button class="link" data-act="endroutine">Stop</button>`;
}

function viewPlan() {
  const p = S.profile, w = wk(), ph = phase(w);
  const title = p.med === 'weekly' ? 'Built around ' + C.FULL[p.jab] : p.med === 'daily' ? 'Spread across your week' : 'Your keep-it-off plan';
  let h = exNote() + `<div><p class="eyebrow muted">My plan</p><h2>${title}</h2><p class="muted">It does not stop at 12 weeks. The first three phases build you up, then it becomes how you train for good.</p></div>
  <div class="phases">${[['Foundations', 'Weeks 1 to 4'], ['Build', 'Weeks 5 to 8'], ['Strong', 'Weeks 9 to 12'], ['For life', 'Week 13 on']].map(x => `<div class="phase${ph === x[0] ? ' now' : ''}"><b>${x[0]}</b><span class="small">${x[1]}</span></div>`).join('')}</div>
  <div class="card"><h3>Your week</h3><div class="list">`;
  for (let i = 0; i < 7; i++) { const dow = (p.jab + i) % 7, pl = dayPlan(p, dow);
    h += `<div class="item"><strong>${C.DAYS[dow]}</strong><div><span class="tag ${pl.type}">${pl.title}</span><p class="small muted">${pl.type === 'strength' ? sessionList(p, pl.session).map(e => e[0]).join(', ') : pl.text}</p></div></div>`; }
  h += `</div><button class="btn ghost" data-go="moves">Learn your exercises</button></div>`;
  const notes = (p.cond || []).filter(c => C.SAFETY[c]);
  if (notes.length) h += `<div class="card"><h3>Your safety notes</h3>${notes.map(c => `<div><p class="small"><strong>${C.CONDITIONS[c][0]}</strong></p><ul class="small">${C.SAFETY[c].map(x => `<li>${x}</li>`).join('')}</ul></div>`).join('')}</div>`;
  h += `<div class="card"><h3>Built for you</h3><p class="small muted">Kit: ${p.equip.map(k => C.KIT[k][0].toLowerCase()).join(', ')}. ${p.sessions} sessions a week, ${p.len} minutes each.${p.care.includes('none') ? '' : ' Adapted for: ' + p.care.map(k => C.CARE[k][0].toLowerCase()).join(', ') + '.'}</p>${p.example ? '' : '<button class="btn ghost" data-act="edit">Change my plan</button>'}</div>`;
  if (p.med !== 'none') h += `<div class="card"><h3>Coming off your medication?</h3><p class="small muted">Research shows weight tends to return after stopping. Strength training and daily movement are your best defence. Tell us when you stop and your plan switches to keeping it off.</p>${p.example ? '' : '<button class="btn ghost" data-act="comeoff">I have stopped my medication</button>'}</div>`;
  return h;
}

function viewToolkit() {
  const group = g => Object.keys(C.ROUTINES).filter(k => C.ROUTINES[k].group === g).map(routineRow).join('');
  return exNote() + `<div><p class="eyebrow muted">Toolkit</p><h2>For the days that need more than a workout</h2></div>
  <div class="card"><div><h3>Feel better</h3><p class="small muted">Gentle movement for common side effects.</p></div>${group('relief')}</div>
  <div class="card"><div><h3>Mind moments</h3><p class="small muted">Short guided pauses for cravings, mealtimes and hard days.</p></div>${group('mind')}</div>
  <div class="card"><div><h3>Eating well on less</h3><p class="small muted">Simple ideas, not a diet plan.</p></div><button class="btn ghost" data-go="food">Open food ideas</button></div>
  <div class="card"><div><h3>Understand your body</h3><p class="small muted">Short lessons. A new one unlocks each week.</p></div>${C.LESSONS.map((x, i) => mediaRow(x[0], `<div><strong>${x[0]}</strong><p class="small muted">Lesson ${i + 1} · ${x[1]}${hasVideo(x[0]) ? '' : ' · coming soon'}</p></div>`)).join('')}</div>`;
}

function viewFood() {
  return `<div><p class="eyebrow muted">Toolkit</p><h2>Eating well on less</h2><p class="muted">When appetite is low, what you eat matters more, not less.</p></div>
  ${C.FOOD.map(f => `<div class="card"><h3>${f[0]}</h3><ul class="small">${f[1].map(x => `<li>${x}</li>`).join('')}</ul></div>`).join('')}
  <p class="small muted">${C.FOOD_NOTE}</p><button class="btn ghost" data-go="toolkit">Back to toolkit</button>`;
}

function viewProgress() {
  const p = S.profile, dates = [...Array(7)].map((_, i) => iso(addDays(NOW, -i))), r = review(p, S.logs, dates), d = S.draft;
  const t = S.tests, first = t[0], last = t[t.length - 1], max = Math.max(1, ...t.map(x => x.n));
  let h = exNote() + `<div><p class="eyebrow muted">Progress</p><h2>Proof you are holding strong</h2></div><div class="card"><h3>Strength score</h3>`;
  h += t.length ? `<div class="row" style="align-items:flex-end"><p class="big">${last.n}</p><p class="small muted">stands in 30 seconds${t.length > 1 ? '<br><strong>' + (last.n - first.n >= 0 ? '+' : '') + (last.n - first.n) + ' since you started</strong>' : ''}</p></div><div class="tests">${t.slice(-6).map(x => `<div style="height:${Math.round(30 + 60 * x.n / max)}%">${x.n}</div>`).join('')}</div><button class="btn ghost" data-act="test">Re-test now</button>`
    : `<p class="small muted">Take the 30-second test to set your starting score. Re-test every 4 weeks.</p><button class="btn" data-act="test">Take the test</button>`;
  h += `</div><div class="stats"><div class="stat"><b>${r.done}/${p.sessions}</b><span class="small muted">sessions, 7 days</span></div><div class="stat"><b>${r.fed}/7</b><span class="small muted">days well fed</span></div><div class="stat"><b>${streak()}</b><span class="small muted">weeks in a row</span></div></div>`;
  const lifts = Object.keys(S.loads).filter(k => S.loads[k] > 0);
  if (lifts.length) h += `<div class="card"><h3>Your lifts</h3><div class="list">${lifts.map(k => `<div class="item" style="grid-template-columns:1fr auto"><span>${esc(k)}</span><strong>${S.loads[k]} kg</strong></div>`).join('')}</div></div>`;
  h += `<div class="card"><div><h3>Wins the scales cannot see</h3><p class="small muted">Tap one when it happens. These are the real proof.</p></div><div class="chips">${C.WINS.map(x => `<button class="chip" data-act="win" data-val="${esc(x)}">+ ${x}</button>`).join('')}</div>
    ${S.wins.length ? `<div class="list">${S.wins.slice(-5).reverse().map(x => `<div class="item" style="grid-template-columns:1fr auto"><span>${esc(x.t)}</span><span class="small muted">${parseDay(x.d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</span></div>`).join('')}</div>` : ''}</div>
  <div class="card"><h3>Milestones</h3><div class="badges">${badges().map(b => `<div class="badge${b[2] ? ' won' : ''}"><i>${b[0]}</i>${b[1]}</div>`).join('')}</div></div>
  <div class="card"><h3>Weekly check-in</h3><p class="small muted">Level ${p.stage + 1} of 6: ${C.STAGES[p.stage][0]} sets of ${C.STAGES[p.stage][1]}</p><div class="bar" style="grid-template-columns:repeat(6,1fr)">${C.STAGES.map((_, i) => `<i class="${i <= p.stage ? 'on' : ''}"></i>`).join('')}</div>
    <fieldset><legend>Any new pain that lasted beyond a session?</legend><div class="chips">${chip('pain', 'no', d.pain, 'No')}${chip('pain', 'yes', d.pain, 'Yes')}</div></fieldset>
    ${p.med === 'none' ? '' : `<fieldset><legend>Did your dose change this week?</legend><div class="chips">${chip('dosechg', 'no', d.dosechg, 'No')}${chip('dosechg', 'yes', d.dosechg, 'Yes')}</div></fieldset>`}`;
  if (d.pain === 'yes') h += `<p><strong>Next week stays the same.</strong> Skip the movement that hurts and message your coach before your next session. If it is getting worse, see your GP or a physio.</p>`;
  else if (d.dosechg === 'yes') h += `<p><strong>Easy week ahead.</strong> Side effects are often stronger after a dose change, so your sessions switch to the lighter version for 7 days and your level stays where it is.</p><button class="btn" data-act="easeweek">Set my easy week</button>`;
  else h += `<p><strong>${r.move > 0 ? 'Step up.' : r.move < 0 ? 'Step back.' : 'Hold steady.'}</strong> ${r.why}</p><button class="btn" data-act="apply" data-val="${r.next}">Set next week to ${C.STAGES[r.next][0]} sets of ${C.STAGES[r.next][1]}</button>`;
  h += `</div>`;
  if (msg) h += `<p role="status"><strong>${msg}</strong></p>`;
  h += `<button class="link" data-act="reset">${d.resetArmed ? 'Tap again to erase everything' : (p.example ? 'Leave the example' : 'Erase my plan and start again')}</button>`;
  return h;
}

function viewCircle() {
  const p = S.profile, month = parseDay(p.start).toLocaleDateString('en-GB', { month: 'long' });
  let h = exNote() + `<div><p class="eyebrow muted">Circle</p><h2>You are not doing this on your own</h2></div>
  <div class="card"><h3>Your coach</h3><p class="small muted">A qualified coach reads every message. You get a reply from a person within one working day.</p>
    <label for="coachmsg" class="small"><strong>Ask anything about your training</strong></label><textarea id="coachmsg" rows="3" maxlength="600" placeholder="My knee aches on the step-ups. What should I do instead?"></textarea>
    <button class="btn" data-act="sendmsg">Send to my coach</button>
    ${S.msgs.length ? `<div class="list">${S.msgs.slice(-3).reverse().map(m => `<div class="item" style="grid-template-columns:1fr"><span class="small">${esc(m.t)}</span></div>`).join('')}</div>` : ''}
    ${C.LAUNCH.coachEmail ? `<p class="small muted">Your email app opens with your message ready. Press send and it reaches your coach. Or write to <strong>${C.LAUNCH.coachEmail}</strong>.</p>` : proto('Messages are saved on this device only. Add a coach email in js/content.js to send them by email.')}</div>
  <div class="card"><h3>The ${month} circle</h3><p class="small muted">Up to 12 members who started the same month as you. Small enough that people notice when you go quiet.</p>
    <div class="resp info"><strong>This week's question</strong><p class="small">${C.CIRCLE_PROMPT}</p></div>
    <label for="circlepost" class="small"><strong>Your answer</strong></label><textarea id="circlepost" rows="2" maxlength="300" placeholder="Getting up off the sofa without using my hands."></textarea>
    <button class="btn ghost" data-act="postwin">Share with my circle</button>
    ${proto('No other members are shown because none exist yet. Your answer is saved to your wins.')}</div>
  <div class="card"><h3>Live session</h3><p class="small muted">A coached group class on video every week. Cameras optional. The recording stays up for 7 days.</p>${proto('The booking link goes here once live sessions launch.')}</div>
  <div class="card"><h3>Bring a friend</h3><p class="small muted">People who train with someone they know stick at it. Share where you have got to.</p><textarea id="sharetext" rows="4" readonly>${esc(shareText())}</textarea><button class="btn ghost" data-act="copy">Copy to share</button></div>`;
  if (msg) h += `<p role="status"><strong>${msg}</strong></p>`;
  return h;
}

function viewPrivacy() {
  const L = C.LAUNCH;
  return `<div><h2>Privacy</h2><p class="muted">Plain English. Last updated ${L.updated}.</p></div>
  <div class="card"><h3>What you tell us stays with you</h3><p>Everything you enter in Holdfast, including your name, your health check answers, how you feel and your sessions, is saved in the browser on your own phone or computer. It is not sent to us and we cannot see it.</p><p>You can delete it at any time: open Progress and choose "Erase my plan and start again".</p></div>
  <div class="card"><h3>When you contact your coach</h3><p>If you send a message or a form check, it goes by email to our coaching team. We use it only to reply to you, and we delete it within 12 months.</p></div>
  <div class="card"><h3>Videos and fonts</h3><p>Videos are played from YouTube in privacy-enhanced mode, and fonts are loaded from Google. Both are run by Google, which may record that your device requested them.</p></div>
  <div class="card"><h3>Payments</h3><p>Payments are handled by Stripe. We never see or store your card details.</p></div>
  <div class="card"><h3>Who we are and your rights</h3><p>Holdfast is run by ${L.business}. To ask what we hold about you, or to have it corrected or deleted, write to ${L.contact}. You can also complain to the Information Commissioner's Office at ico.org.uk.</p></div>
  <button class="btn ghost" data-act="home">Back</button>`;
}
function viewTerms() {
  const L = C.LAUNCH;
  return `<div><h2>Terms</h2><p class="muted">Plain English. Last updated ${L.updated}.</p></div>
  <div class="card"><h3>What Holdfast is</h3><p>Holdfast gives exercise, nutrition and wellbeing guidance for adults aged 18 and over who are taking, or have taken, weight-loss medication. It is run by ${L.business}.</p></div>
  <div class="card"><h3>What it is not</h3><p>Holdfast is not medical advice and does not replace your GP, prescriber, pharmacist or dietitian. We never advise on your medication or dose. In an emergency call 999.</p></div>
  <div class="card"><h3>Your part</h3><ul><li>Answer the health check honestly, and tell us if anything changes.</li><li>If the health check asks you to speak to your GP or prescriber first, do that before you start.</li><li>Stop if you feel unwell or have pain, and get medical advice if it does not settle.</li><li>Exercise in a safe, clear space.</li></ul></div>
  <div class="card"><h3>Paying and cancelling</h3><p>${L.payTerms}</p></div>
  <div class="card"><h3>Our responsibility</h3><p>We take care that our guidance is safe and accurate. Nothing in these terms limits our liability for death or personal injury caused by our negligence, or any liability that cannot be limited by law. Beyond that, we are not responsible for loss caused by guidance not being followed or by information you did not give us.</p></div>
  <div class="card"><h3>Contact</h3><p>${L.contact}. These terms are governed by the law of England and Wales.</p></div>
  <button class="btn ghost" data-act="home">Back</button>`;
}
const VIEWS = { paywall: viewPaywall, privacy: viewPrivacy, terms: viewTerms, welcome: viewWelcome, setup: viewSetup, today: viewToday, session: viewSession, test: viewTest, routine: viewRoutine, reveal: viewReveal, moves: viewMoves, plan: viewPlan, toolkit: viewToolkit, food: viewFood, progress: viewProgress, circle: viewCircle };
const TABBED = ['today', 'plan', 'toolkit', 'progress', 'circle'];
function render() {
  const inApp = S.profile && (TABBED.includes(view) || view === 'food' || view === 'moves');
  tabs.hidden = !inApp;
  document.body.className = view === 'welcome' ? 'landing' : inApp ? 'inapp' : 'focus';
  tabs.querySelectorAll('button').forEach(b => b.setAttribute('aria-current', b.dataset.go === (view === 'food' ? 'toolkit' : view === 'moves' ? 'plan' : view)));
  hd.innerHTML = `<button class="brand" data-act="home" aria-label="Holdfast home"><span class="mark"></span>Holdfast</button>${view === 'welcome' && !(S.profile && !S.profile.example) ? '<button class="btn small" data-act="start">Start my plan</button>' : ''}`;
  app.innerHTML = VIEWS[view]();
}
const GATED = ['today', 'session', 'test', 'routine', 'plan', 'moves', 'toolkit', 'food', 'progress', 'circle'];
function go(v, keep) { view = GATED.includes(v) && !paid() ? 'paywall' : v; if (!keep) msg = ''; render(); window.scrollTo(0, 0); }
function toggle(arr, val, solo) { arr = arr || []; if (val === solo) return arr.includes(val) ? [] : [val]; arr = arr.filter(x => x !== solo); return arr.includes(val) ? arr.filter(x => x !== val) : arr.concat(val); }

/* ---------- guided routine timer ---------- */
function tick() {
  if (R.paused) return;
  R.left--;
  const c = document.getElementById('rclock'); if (c) c.textContent = R.left;
  if (R.left <= 0) nextStep();
}
function nextStep() {
  const r = C.ROUTINES[R.id]; R.i++;
  if (R.i >= r.steps.length) { clearInterval(timer); const l = log(); l.routines = (l.routines || []).concat(R.id); save(); }
  else R.left = r.steps[R.i][1];
  if (view === 'routine') if (hashCode && S.unlocked) save();
if (GATED.includes(view) && !paid()) view = 'paywall';
render();
}
let back = 'today';

/* ---------- guided set: counts reps at 4 seconds each, then times the rest ---------- */
function speak(t) { if (!S.voice) return; try { speechSynthesis.cancel(); speechSynthesis.speak(new SpeechSynthesisUtterance(String(t))); } catch (e) {} }
const setNum = v => { const el = document.getElementById('gnum'); if (el) el.textContent = v; };
function endSet() {
  if (G.set >= G.rx.sets) { G.mode = 'done'; clearInterval(timer); speak('Done'); } else { G.mode = 'rest'; G.left = 60; speak('Rest'); }
  if (view === 'session') render();
}
function gtick() {
  if (view !== 'session') { clearInterval(timer); return; }
  if (G.mode === 'rep') {
    if (G.rx.secs) { G.left--; setNum(G.left); if (G.left <= 0) endSet(); }
    else { G.t++; if (G.t >= G.rx.reps * 4) endSet(); else if (G.t % 4 === 0) { setNum(G.t / 4 + 1); speak(G.t / 4 + 1); } }
  } else if (G.mode === 'rest') { G.left--; setNum(G.left); if (G.left <= 0) { G.mode = 'idle'; G.set++; clearInterval(timer); speak('Next set'); render(); } }
}

/* ---------- interactions ---------- */
document.addEventListener('click', e => {
  const g = e.target.closest('[data-go]'); if (g) { go(g.dataset.go); return; }
  const b = e.target.closest('button[data-act]'); if (!b) return;
  const a = b.dataset.act, val = b.dataset.val, d = S.draft;

  if (a === 'unlock') { if (tryCode(document.getElementById('code').value.trim().toUpperCase())) { go('today'); } else { msg = 'That code is not right. Check the email from us and try again.'; go('paywall', true); } return; }
  if (a === 'home') { clearInterval(timer); go(S.profile && paid() && view !== 'today' ? 'today' : 'welcome'); return; }
  if (a === 'start') { if (S.profile && S.profile.example) { const u = S.unlocked; S = blank(); S.unlocked = u; } S.draft = {}; step = 0; go('setup'); return; }
  if (a === 'example') { const u = S.unlocked; S = example(); S.unlocked = u; go('today'); return; }
  if (a === 'edit') { const p = S.profile; S.draft = { name: p.name, goal: p.goal, med: p.med, jab: p.jab, equip: p.equip.slice(), care: p.care.slice(), cond: p.cond.slice(), sessions: p.sessions, len: p.len, level: p.level, editing: true }; S.draft.screen = ['none']; step = 0; go('setup'); return; }
  if (a === 'back') { if (step === 0) go(S.profile ? 'plan' : 'welcome'); else { step--; go('setup'); } return; }
  if (a === 'next') { if (step < seq().length - 1) { step++; go('setup'); return; }
    const old = S.profile, keep = d.editing && old;
    S.profile = { name: d.name.trim(), goal: d.goal, med: d.med, jab: +d.jab, equip: d.equip, care: d.care, cond: d.cond, sessions: +d.sessions, len: +d.len, level: d.level, stage: keep && old.level === d.level ? old.stage : C.START[d.level], start: keep ? old.start : TODAY };
    const edited = d.editing; S.draft = {}; save(); go(edited ? 'plan' : 'reveal'); return; }
  if (a === 'reset') { if (d.resetArmed) { const u = S.unlocked; try { localStorage.removeItem(KEY); } catch (e) {} S = blank(); S.unlocked = u; save(); go('welcome'); return; } d.resetArmed = true; render(); return; }
  if (a === 'comeoff') { S.profile.med = 'none'; delete S.profile.easeUntil; save(); msg = ''; go('plan'); return; }

  if (a === 'test') { T = { left: 30, count: 0, state: 'idle' }; go('test'); return; }
  if (a === 'exittest') { clearInterval(timer); go('today'); return; }
  if (a === 'timer') { T.state = 'run'; T.left = 30; render(); clearInterval(timer); timer = setInterval(() => { T.left--; const c = document.getElementById('clock'); if (c) c.textContent = T.left; if (T.left <= 0) { clearInterval(timer); T.state = 'count'; T.count = 10; if (view === 'test') render(); } }, 1000); return; }
  if (a === 'cup') { T.count++; render(); return; } if (a === 'cdown') { T.count = Math.max(0, T.count - 1); render(); return; }
  if (a === 'savetest') { S.tests.push({ d: TODAY, n: T.count }); save(); go('progress'); return; }

  if (a === 'routine') { back = TABBED.includes(view) ? view : 'toolkit'; R = { id: val, i: 0, left: C.ROUTINES[val].steps[0][1], paused: false }; clearInterval(timer); timer = setInterval(tick, 1000); go('routine'); return; }
  if (a === 'rpause') { R.paused = !R.paused; render(); return; }
  if (a === 'rskip') { nextStep(); return; }
  if (a === 'endroutine') { clearInterval(timer); go(back); return; }

  if (a === 'gstart') { const p = S.profile, l = log(), e = sessionList(p, dayPlan(p, NOW.getDay()).session)[l.pos || 0];
    G.rx = prescription(p.stage, l.light === undefined ? inEaseWeek(p, TODAY) : l.light, e[2]); G.mode = 'rep'; G.t = 0; G.left = G.rx.secs || 0;
    clearInterval(timer); timer = setInterval(gtick, 1000); speak(G.rx.secs ? 'Go' : 1); render(); return; }
  if (a === 'gstop') { clearInterval(timer); G.mode = 'idle'; render(); return; }
  if (a === 'gskip') { clearInterval(timer); G.mode = 'idle'; G.set++; render(); return; }
  if (a === 'help') { X.help = X.help === val ? null : val; X.hurt = null; if (val === 'easier' && X.help) { const l = log(); l.eased = (l.eased || 0) + 1; save(); } render(); return; }
  if (a === 'hurt') { X.hurt = val; if (val === 'sharp') { const l = log(); l.pain = (l.pain || 0) + 1; S.msgs.push({ d: TODAY, t: 'Sharp pain reported during a session' }); save(); } render(); return; }
  if (a === 'formcheck') { const p = S.profile, l = log(), e = sessionList(p, dayPlan(p, NOW.getDay()).session)[l.pos || 0]; S.msgs.push({ d: TODAY, t: 'Form check requested: ' + e[0] }); save(); X.help = 'formsent'; render(); if (C.LAUNCH.coachEmail) mail('Form check: ' + e[0], 'Hello, please could you check my form on ' + e[0] + '? I have attached a short clip.\n\n' + S.profile.name); return; }
  if (a === 'ready') { log().ready = true; save(); go('session'); return; }
  if (a === 'skipex') { const l = log(); l.pos = (l.pos || 0) + 1; resetEx(); save(); go('session'); return; }
  if (a === 'loadup' || a === 'loaddown') { S.loads[val] = Math.max(0, (S.loads[val] || 0) + (a === 'loadup' ? 1 : -1)); save(); render(); return; }
  if (a === 'win') { S.wins.push({ d: TODAY, t: val }); save(); render(); return; }
  if (a === 'postwin') { const t = document.getElementById('circlepost').value.trim(); if (t) { S.wins.push({ d: TODAY, t }); save(); msg = 'Saved to your wins.'; } render(); return; }
  if (a === 'sendmsg') { const t = document.getElementById('coachmsg').value.trim(); if (t) { S.msgs.push({ d: TODAY, t }); save(); msg = 'Message saved.'; if (C.LAUNCH.coachEmail) { msg = 'Your email app should have opened. Press send there.'; mail('A question for my coach', t + '\n\n' + S.profile.name); } } render(); return; }
  if (a === 'copy') { const ta = document.getElementById('sharetext'); const done = () => { msg = 'Copied. Paste it into a message to a friend.'; render(); };
    const fallback = () => { ta.focus(); ta.select(); msg = 'Select the text above and copy it.'; };
    try { navigator.clipboard.writeText(ta.value).then(done, fallback); } catch (err) { fallback(); } return; }
  if (a === 'easeweek') { S.profile.easeUntil = iso(addDays(NOW, 7)); S.draft.dosechg = undefined; save(); msg = 'Easy week set. Sessions are lighter for the next 7 days.'; render(); return; }

  if (['goal', 'level', 'pain', 'med', 'dosechg'].includes(a)) { d[a] = val; if (a === 'med' && !d.editing) delete d.jab; }
  else if (a === 'screen') { d.screen = toggle(d.screen, val, 'none'); if (d.screen.includes('none')) d.cleared = false; }
  else if (['jab', 'sessions', 'len'].includes(a)) d[a] = +val;
  else if (a === 'equip') d.equip = toggle(d.equip, val);
  else if (a === 'care') d.care = toggle(d.care, val, 'none');
  else if (a === 'cond') d.cond = toggle(d.cond, val, 'none');
  else { const l = log();
    if (a === 'eaten' || a === 'felt') l[a] = val;
    else if (a === 'feel') l.feel = toggle(l.feel, val, 'good');
    else if (a === 'protein') l.protein = (l.protein === +val) ? +val - 1 : +val;
    else if (a === 'waterup') l.water = (l.water || 0) + 1;
    else if (a === 'waterdown') l.water = Math.max(0, (l.water || 0) - 1);
    else if (a === 'light') l.light = true;
    else if (a === 'unlight') l.light = false;
    else if (a === 'begin') { resetEx(); save(); go('session'); return; }
    else if (a === 'nextex') { l.pos = (l.pos || 0) + 1; resetEx(); save(); go('session'); return; }
    else if (a === 'prev') { resetEx(); if (!l.pos) { go('today'); return; } l.pos--; save(); go('session'); return; }
    else if (a === 'finish') { l.finished = true; save(); go('today'); return; }
    else if (a === 'apply') { S.profile.stage = +val; msg = 'Next week is set. See you at your next session.'; }
  }
  if (view === 'setup' && AUTO.includes(a) && !d.editing) { render(); setTimeout(() => { if (view === 'setup') { step++; go('setup'); } }, 260); return; }
  save(); render();
});
document.addEventListener('input', e => { if (e.target.id === 'name') { S.draft.name = e.target.value; const n = document.getElementById('nextbtn'); if (n) n.disabled = !e.target.value.trim(); } });
document.addEventListener('change', e => { const a = e.target.dataset.act; if (a === 'cleared') { S.draft.cleared = e.target.checked; render(); } if (a === 'voice') { S.voice = e.target.checked; save(); } });
if (hashCode && S.unlocked) save();
if (GATED.includes(view) && !paid()) view = 'paywall';
render();
