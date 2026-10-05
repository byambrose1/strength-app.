# Build brief for Replit Agent

Paste everything below into Replit Agent after importing this repository.

---

This repository contains a working single-file prototype, `index.html`, of Holdfast: a 12-week strength programme for people on weekly weight-loss injections. Turn it into a real web app. Keep the existing screens, wording, colours, layout and programme logic exactly as they are unless a step below says otherwise. Do not redesign it.

## Keep unchanged

- All programme logic between the comments `programme logic (pure)` and `end pure logic` in `index.html`: `pick`, `sessionList`, `dayPlan`, `dose`, `shouldDrop`, `review`, and the exercise library.
- The seven-step setup, including the health check. A member who answers yes to any health question must tick the clearance box before a plan is built.
- The flat colour palette. No gradients.
- The footer disclaimer. The app must never give advice about medication, dose or diagnosis.

## Build, in this order

1. **Accounts.** Email sign-up and login. One account per member.
2. **Database.** Move everything now kept in `localStorage` under the key `holdfast-v3` into the database, per member: profile, daily logs, strength test results, and weights used per exercise. Health check answers are health data: store them securely and never expose one member's data to another.
3. **Payments.** Stripe subscription at £18 a month with a 7-day free trial. Setup and the example plan stay free to view. The Today, My plan, Progress and Learn screens need an active subscription or trial. Add a manage or cancel subscription link.
4. **Videos.** Replace each video placeholder with a real player. Add an admin-only page where the owner can attach a video URL to: the brand film, each exercise by name, the strength test demo, and each lesson. Until a video is attached, keep showing the placeholder.
5. **Admin view.** An owner-only page listing members with: join date, current week, sessions done in the last 7 days, latest strength score, and whether they flagged new pain in the weekly check-in.
6. **Legal pages.** Privacy policy, terms, and a health disclaimer, linked from the footer. Leave clearly marked placeholder text for the owner to replace.

## Rules

- UK English, pounds sterling.
- Mobile first. It must work at 400px wide with no sideways scrolling.
- Do not name any medication brand anywhere in the app or its marketing pages.
- Do not invent testimonials, member numbers, team members or credentials.
- Ask before adding any feature not listed here.
