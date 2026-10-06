# Build brief: turning the prototype into the live product

For a developer or a build agent. Read `docs/PRODUCT.md` first.

## What exists

A working front end with no backend. Open `index.html` in a browser to run it.

| File | Holds |
|---|---|
| `index.html` | Page shell and bottom navigation |
| `css/styles.css` | All styling. Flat colours, no gradients. |
| `js/content.js` | Everything a professional reviews: exercises, levels, swaps, screening, safety notes, routines, food guidance, lessons, coach notes |
| `js/guides.js` | A step-by-step guide for every exercise, also for professional review |
| `js/logic.js` | Programme rules as pure functions |
| `js/app.js` | Screens, interactions, and saving to the browser |
| `tests/logic.test.js` | Tests for the rules. Run `node tests/logic.test.js`. |

Member data is saved in `localStorage` under `holdfast-v4`. Anything marked "Prototype note" on screen is a stand-in for a backend feature.

## Keep unchanged

- The rules in `js/logic.js`. If one must change, change its test in the same commit.
- The content in `js/content.js` and `js/guides.js`, unless the owner asks. It is under professional review.
- The nine-question sign-up. A member who taps any health check item must tick the clearance box before a plan is built.
- The look, the wording and the footer disclaimer.

## Build, in this order

1. **Accounts.** Email sign-up and login.
2. **Database.** Move the `holdfast-v4` state to the server, per member: profile, daily logs, strength tests, weights, wins, messages. Health answers and conditions are health data: store them securely, never expose one member's data to another, and keep them out of analytics.
3. **Payments.** A monthly subscription with a 7-day free trial. Price is set by the owner. Welcome, setup and the example member stay free. Add manage and cancel.
4. **Coach inbox.** Owner-only. Shows member messages and lets a coach reply. Flags: sharp pain reported in a session, new pain in the weekly check-in, a "stop" or "skip" feeling logged, no session for 10 days, strength score down, repeated use of "make it easier".
5. **Form checks.** "Ask for a form check" opens the camera, records up to 15 seconds, and sends the clip to the coach inbox. The coach replies in text or with a short video. Clips are health-adjacent personal data: private to the member and coach, deleted after 30 days.
6. **Videos.** Replace each placeholder with a player. An owner-only page attaches a video URL to each exercise by name, each routine, each lesson, each phase's coach note, the test demo and the brand film. Keep the placeholder until one is attached.
7. **Circles.** Place each member in a group of up to 12 by start month. Members post short text answers to the weekly question and can react. No images, no direct messages. The owner can remove a post.
8. **Reminders.** Opt-in email or push: session days, the 4-weekly strength test, the weekly check-in.
9. **Bring a friend.** A personal invite link that gives the friend a free trial week.
10. **Legal pages.** Privacy policy, terms and health disclaimer, with marked placeholder text for the owner to replace.

## Rules

- No chatbot and no AI-written replies to members. Messages are answered by people.
- Never invent testimonials, member numbers, team members, credentials or circle activity.
- Never name a medication brand in the product or its marketing pages.
- Never give advice on medication, dose or diagnosis.
- UK English and pounds sterling.
- Mobile first: it must work at 400px wide with no sideways scrolling.
- Ask the owner before adding anything not listed here.
