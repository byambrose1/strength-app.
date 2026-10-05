# Holdfast: what it is and why it is different

Working name. The brand name is not settled.

## The member

An adult on weight-loss medication, usually new to strength training and often wary of gyms. Many live with obesity, type 2 diabetes, high blood pressure or sore joints. They mostly want to lose weight. What they fear is ending up lighter but weaker, feeling rough on the medication, and putting it all back on when they stop.

## Why they use it

- **To keep their muscle.** Researchers warn that muscle lost on these drugs without strength training can be comparable to ten years of ageing. England's Chief Medical Officer and NICE both say people on them should strength train.
- **To feel better on the rough days.** Nausea, constipation and tiredness are common, and nobody tells them what to do about it.
- **To keep the weight off afterwards.** An Oxford analysis in the BMJ of 37 studies and more than 9,000 people found weight returned at about 0.8 kg a month after stopping, with most back at their starting weight within 18 months.

## What it does

| Part | What the member gets |
|---|---|
| Strength sessions | 15, 25 or 35 minutes, followed one exercise at a time, each with a short demo video. Built from the kit they own. |
| A week that fits their medication | Weekly injection, daily tablet or injection, or no medication. |
| Feelings check | "How are you feeling today?" changes the day: lighter session, a relief routine, or no training. |
| Relief routines | Guided 4 to 5 minute routines for constipation, nausea and low energy. |
| Mind moments | Guided 2 to 4 minute pauses for cravings, mealtimes, self-talk and sleep. |
| Fuel check | Eaten enough, protein portions, drinks. Simple food ideas, never a diet plan. |
| Proof | A 30-second sit-to-stand strength score re-tested every 4 weeks, a weight log per exercise, and wins the scales cannot see. |
| People | A real coach who answers messages, a small circle of members who started the same month, a weekly live class. |

## What sets it apart

1. **It is built for the medication, not adapted to it.** The week bends around injection day, a dose change triggers an easier week, and side effects change what today offers. General fitness apps do none of this.
2. **It is built for the people GP exercise referral serves.** Health screening before a plan exists, safety notes for diabetes, blood pressure and joints, and gentler swaps for knees, backs and shoulders.
3. **It covers the whole journey.** Starting, dose changes, the long middle, coming off and staying off. It does not end at 12 weeks.
4. **It proves the promise.** The strength score shows strength holding or rising while weight falls. That number is what members show their friends.
5. **It has people in it.** See below.

## Human touch: rules for everything we build

Members should never feel they are talking to software.

- **No chatbot, no "AI coach", anywhere in the product.** Every message is answered by a qualified person within one working day.
- **A real coach on video every week.** A short note for each phase, filmed, not written by a machine.
- **Small circles, not a feed.** Up to 12 people who started the same month. Small enough that someone notices when you go quiet.
- **Plain, warm words.** Written the way a good coach talks. No hype, no streak-shaming.
- **Never invent people.** No fake testimonials, member counts, team members or reviews.

The automation is real but invisible: the plan adjusts itself by rules so the humans can spend their time on the conversations that need a human.

## How the programme works

- **Format.** Follow-along sessions with a short demo per exercise, not hour-long workout videos. Short clips can be recombined for any kit, any injury and any session length, so one filming day serves every member.
- **Two sessions, A and B,** alternating, covering squat, push, pull, core, hinge, lunge, press and carry.
- **Six levels,** from 2 sets of 8 to 3 sets of 12. After that, progress comes from adding weight.
- **Weekly review decides next week:** step up when every session was done, felt manageable and food kept pace; hold when sessions were missed or food fell short; step back when most sessions felt too hard.
- **Phases:** Foundations (weeks 1 to 4), Build (5 to 8), Strong (9 to 12), then For life.

## Medication coverage

The app asks only for the rhythm, never the drug name or dose, and never names a brand. Advertising prescription-only medicines to the public is restricted in the UK, so brand names stay out of the product and its marketing.

| Member takes | What the plan does |
|---|---|
| A weekly injection | No strength on injection day, rest the day after, strength on the days furthest from it. This spacing is an assumption to test with members. |
| A daily tablet or injection | Sessions spread evenly from a start day the member chooses. Daily tablets were approved in the UK in June and August 2026. |
| Nothing now | The same spread, framed as keeping the weight off. A member can switch to this in one tap when they stop. |

## Side effects: what exercise can and cannot do

Sourced from the American College of Lifestyle Medicine patient handout:

| Side effect | What the app offers | Basis |
|---|---|---|
| Constipation | Walking plus a gentle mobility routine, water, fibre built up slowly | The handout says to stay active and that daily walking helps |
| Nausea | Slow breathing, staying upright, small plain food little and often, sipping fluids | Handout advice on eating and fluids. The breathing routine is a comfort measure, not a proven treatment. |
| Tiredness, dizziness | Lighter session or a five-minute lift, fluids, regular small meals. Dizziness means no strength that day. | Handout advice on hydration and regular meals |
| Severe or spreading stomach pain, repeated vomiting, eyesight changes with diabetes | No training. Call 111, or 999 if severe. | Handout red flags |

Exercise will not remove side effects, and the app never says it will.

## Automation

Already automatic in the app: building the plan, choosing exercises, adjusting for how the member feels, the weekly review, the easy week after a dose change, strength test reminders every 4 weeks, milestones.

Needs the backend: reminders by notification or email, weekly lesson unlock, a coach inbox with flags for pain or missed weeks, placing members into circles, subscription billing.

## How members tell their friends

- A share message with their weeks, sessions and strength score change, ready to copy.
- Bring a friend: a free trial week for someone they invite (needs the backend).
- Circles and the live class give them something to talk about.

## What must be made by people

| Item | Count |
|---|---|
| Exercise demo clips | 39 |
| Guided routine recordings (voice or video) | 7 |
| Lessons | 8 |
| Weekly coach notes, one per phase to start | 4 |
| Strength test demo and brand film | 2 |

## Still to settle

- **Professional review.** Every exercise, set and rep scheme, injury swap, safety note, routine and screening question in `js/content.js` is a draft.
- **Clinical advisor.** A dietitian and a pharmacist or GP reviewing the food and side-effect guidance would make the standard real.
- **Insurance** for online programmes.
- **Brand name and domain.**
- **Mindfulness content** is general wellbeing guidance. It is not therapy and should say so where members with eating disorders might be using it.

## Sources

- [ukactive and Les Mills report on muscle loss](https://ukactive.com/news/report-warns-of-weight-loss-jabs-impact-on-muscle-mass-as-authors-call-for-strength-training-support-for-all-users/)
- [Chief Medical Officer guidance on strength training](https://www.paf-media.co.uk/whitty-backs-weights-for-glp-1-users)
- [Oxford and BMJ analysis of weight regain](https://www.nationalhealthexecutive.com/articles/study-finds-rapid-weight-regain-after-stopping-weight-loss-injections)
- [ACLM patient handout on side effects](https://lifestylemedicine.org/wp-content/uploads/2026/07/Patient-Handout-Understanding-Side-Effects-of-GLP-1-Medicines.pdf)
- [UK approval of a daily weight-loss tablet, June 2026](https://www.foodnavigator.com/Article/2026/06/12/wegovy-weight-loss-pill-approved-for-use-in-the-uk/)
- [UK approval of a second daily tablet, August 2026](https://www.emjreviews.com/en-us/amj/emj-gold/news/eli-lillys-weight-loss-pill-wins-double-uk-approval/)
