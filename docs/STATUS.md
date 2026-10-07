# Holdfast: where everything stands

**Launching this week?** Start with `docs/LAUNCH_THIS_WEEK.md`.

Last updated 6 October 2026. Holdfast is a working name.

## 1. Built and working

Tested by clicking through in a browser on phone and desktop sizes.

### Before sign-up
- **Landing page** for phone and desktop: headline, a picture of the app, three sourced facts, six things you get, how it works, the Holdfast standard, seven questions and answers.
- **Example member** anyone can look round without signing up.
- **A Join button** that appears on the landing page once a payment link is added to `LAUNCH.joinUrl` in `js/content.js`.

### Sign-up questionnaire
- Nine questions, one per screen, about two minutes.
- A friendly reply to each answer.
- Single-answer questions move on by themselves.
- **Health check:** tap any that apply. Anything flagged blocks the plan until the member confirms GP or prescriber clearance.
- Asks: name, medication rhythm, day, goal, health check, conditions, kit, areas to look after, session shape.
- **Plan reveal** at the end: their week, what was built in, and their first session.

### The plan
- Weekly injection, daily tablet or injection, or off medication.
- Six kit options, used in combination.
- Swaps for knees, lower back and shoulders.
- Floor-free programme for members who cannot get down to the floor.
- Balance-supported versions.
- Sessions of 15, 25 or 35 minutes, two or three a week.
- Six levels, three starting points.
- Phases: Foundations, Build, Strong, For life.
- One-tap switch to the off-medication plan.

### Home screen ("Today")
- Week strip, weekly ring, weeks in a row, the member's goal repeated back.
- **How are you feeling today?** Six answers that change the day.
- Today's session, walk or rest.
- Lighter session offered when under-fuelled, queasy or wiped out.
- Strength blocked when dizzy or with stomach pain.
- Fuel check: eaten enough, protein portions, drinks.
- Weekly coach note and a daily insight.
- When to stop and get help.

### Inside a session
- First-session safety checklist.
- Video slot for every exercise.
- Step-by-step guide for all 45 exercises: set up, movement, where to feel it, breathing.
- **Guided set:** counts reps at a steady pace, optional spoken count, times the rest.
- **Make it easier**, **This hurts**, **Am I doing it right?** on every exercise.
- Safety notes for diabetes, blood pressure and joints.
- Weight log per exercise.
- "How did it feel?" at the end.

### Toolkit
- Three relief routines: constipation, nausea, low energy.
- Four mind moments: before eating, cravings, self-talk, sleep.
- Food ideas for low-appetite days.
- Eight lesson slots.

### Progress
- Strength score: 30-second sit-to-stand, re-tested every 4 weeks.
- Lifts list, wins the scales cannot see, nine milestones.
- **Weekly check-in** that steps the plan up, holds it or steps it back.
- Easy week after a dose change.

### Other
- Desktop layout with a side menu.
- Learn your exercises screen.
- Share message for telling a friend.
- 46 automated checks on the programme rules.

## 2. Screens exist, but not real yet

These need accounts and a database.

| Feature | What works now | What is missing |
|---|---|---|
| Coach messages | Message is saved on the device | Reaching a coach, and the reply |
| Form check | Request is saved | Filming a clip and sending it |
| Circle | Weekly question, answer saved to wins | Other members |
| Live session | A described slot | Booking link |
| Videos, lessons, coach notes | Placeholders | The films |
| Bring a friend | Copyable message | Invite link and free week |

## 3. Not started

- Accounts and login. Data lives only on the member's own device.
- Payments inside the app.
- Reminders by email or notification.
- Coach inbox with flags.
- Privacy policy, terms and health disclaimer pages.
- App store versions. It runs in a phone browser.

## 4. Needs you, not code

- **Review** `js/content.js` and `js/guides.js`. Every exercise, guide, swap, safety note, routine and food idea is a draft.
- **Decide the health check format.** It is now "tap any that apply", which is quicker than five yes or no questions. Your insurer or governing body may require a set format.
- **Insurance** that covers online programmes.
- **Film:** 45 exercise clips, 7 routines, 8 lessons, 4 coach notes, the test demo and a brand film. Start with the 12 bodyweight and floor-free exercises.
- **Name and domain.**
- **Price.**
- **Data protection:** check whether the ICO fee applies to you.

## 5. What sets it apart

1. **Built for the medication.** The week bends round injection day, a dose change triggers an easier week, side effects change what today offers.
2. **Built for the people GP exercise referral serves.** Screening first, condition safety notes, a floor-free programme.
3. **It teaches.** Step-by-step guides, counted sets, and a way out when it is too hard or it hurts.
4. **The whole journey,** including coming off and staying off.
5. **Proof:** a strength score that holds or rises while weight falls.
6. **Coaching built in.** Real coaches inside the app: messages, form checks, a circle and a live class. Never a chatbot.

## 6. Fastest route to market

Members pay for Holdfast: the app, the programme and everything that comes with it. They are not buying one coach's time, and nothing in the product or its marketing names an individual.

### What is being sold

One product: **Holdfast, an app with coaching built into it.** There are no tiers and no "with coaching" add-on. A member who joins gets all of it:

- the plan, sessions, guides, toolkit, strength score and progress
- coach messages and form checks
- a circle of members and a weekly live class

The coaching belongs to the app. Members see "your coach" and "a qualified coach", never a named individual.

**Staffing at launch:** the founder answers as the Holdfast coach. This is not announced or shown anywhere in the product. More coaches join the same way later, with nothing for members to notice.

### What each part needs to be real

| Part of the product | Works today | Needs before members rely on it |
|---|---|---|
| Plan, sessions, guides, toolkit, score, progress | Yes | Content review and videos |
| Coach messages and form checks | Screens only | Accounts, a coach inbox, and coaches to answer |
| Circle | Screen only | Accounts and members |
| Live class | Described slot | A coach to run it and a booking link |

### Launch (about 2 weeks for the app; coaching follows the backend)

| Piece | How |
|---|---|
| The app | Host it free on GitHub Pages. It is a static site, so no server or credits are needed. |
| Payment | A Stripe payment link, pasted into `LAUNCH.joinUrl` |
| Videos | The first 12 exercise clips, presented as Holdfast's |
| Coaching | Shown in the app from day one. Each coaching feature is switched on as soon as it has the backend and the coaches behind it, and until then says plainly when it opens. |

Two limits to know about at this stage:

- **Access is not locked.** Without accounts, anyone with the link can use the app, so payment is on trust until accounts are built.
- **Data stays on each member's device,** so no health data is held on a server.

### Then build the backend, in this order

1. Accounts and database
2. Payments tied to access
3. Coach inbox and form checks
4. Videos
5. Circles
6. Reminders

`docs/BUILD_BRIEF.md` has the detail. This step needs a developer or paid build credits.

### Order of work for the next two weeks

1. Your content review (blocks everything)
2. Insurance and the health check format
3. Name, domain, price
4. Film 12 clips
5. Turn on GitHub Pages and add the payment link
6. Privacy notice and terms
7. Invite the founding group
