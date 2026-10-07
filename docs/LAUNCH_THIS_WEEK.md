# Launch this week

What has to happen for real people to use Holdfast by Friday, in order. Each step says who does it.

## What members get at this launch

- The full app: plan, sessions, guides, toolkit, strength score, progress.
- Your videos, as fast as you upload them.
- Coach messages and form checks by email.
- Nutrition guidance in the app and in the lessons.

Not at this launch: accounts, the members' circle, in-app payment checks, reminders. Member data stays on each person's own phone.

## Steps

| # | Step | Who | Time |
|---|---|---|---|
| 1 | Film the day-one list in `docs/FILMING.md` (22 clips) | You | Half a day |
| 2 | As you film, check each exercise's written steps are right | You | Same session |
| 3 | Upload to YouTube as Unlisted and paste the links into `js/videos.js` | You, or send the links to the developer | 1 hour |
| 4 | Decide the name and buy the domain | You | 30 min |
| 5 | Decide the price and create a Stripe payment link. See "Paywall" below. | You | 30 min |
| 6 | Set up a coach email address | You | 10 min |
| 7 | Fill in `LAUNCH` in `js/content.js`: payment link, coach email, business name, contact, payment terms | You or the developer | 10 min |
| 8 | Read the Privacy and Terms pages in the app and have them checked | You | See below |
| 9 | Confirm your insurance covers online exercise and nutrition guidance | You | A phone call |
| 10 | Turn on hosting | You | 10 min |
| 11 | Send the link to your first members | You | |

## Paywall

The questionnaire and the plan reveal are free. Everything after that needs an access code.

1. Pick an access code, for example `STRONG26`.
2. Run `node scripts/code.js STRONG26`. It prints a scrambled version and an after-payment link.
3. In `js/content.js`, fill in `LAUNCH`: `joinUrl` (your Stripe payment link), `codeHash` (the scrambled version), `price` and `priceNote`.
4. In Stripe, set the payment link's "after payment" page to redirect to the after-payment link. Paying members land back in the app already unlocked.
5. Put the code in the Stripe receipt email too, for anyone who pays on one device and uses another.

**What this paywall does and does not do.** It stops ordinary visitors using the app without paying. It is one shared code checked on the member's own device, so a member can pass it on, and it does not switch off if someone cancels. Change the code each month to limit both. A paywall that checks each member's subscription needs accounts and a server, which is the first job after launch.

## Native app

Not needed for launch. Holdfast runs in the phone's browser, and members can add it to their home screen, where it opens full-screen with its own icon like an app. App Store and Play Store versions can come later; they add review delays and take a share of subscriptions sold inside the app.

## Hosting

The app is a plain website with no server, so it can be hosted free.

- **GitHub Pages:** in the repository on GitHub, open Settings, then Pages, choose "Deploy from a branch", pick `main` and `/ (root)`, and save. The address appears on that page a minute later.
- Or publish from Replit, which may cost money.

Connect your own domain afterwards in the same Pages settings.

## Things to know before you send the link

- **The paywall is a shared access code,** not a check on each person's subscription. See "Paywall".
- **The Privacy and Terms pages are drafts.** They are written to be true of how the app works today, but they are not legal advice. The parts in [square brackets] need your details.
- **Nutrition guidance** in the app is general healthy-eating guidance. Individual meal plans, and dietary advice for a medical condition such as diabetes, are a dietitian's job. The app says so.
- **Health check format.** It is "tap any that apply". Check your insurer accepts that.
- **Data protection.** Check whether you need to pay the ICO data protection fee.
- **Unlisted YouTube videos** can be watched by anyone who has the link.

## After launch, in this order

1. Accounts and a database, so data is saved to the member and access can be locked to payers
2. A coach inbox inside the app, replacing email
3. The members' circle
4. Reminders
