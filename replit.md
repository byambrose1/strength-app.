# Holdfast prototype

## Running on Replit

Use Run to start the **Start application** workflow, or run:

```sh
python3 server.py
```

The server binds to `0.0.0.0:5000` for the Replit web preview. It serves only
the page and the files it loads: `index.html`, `css/styles.css` and the
scripts in `js/`. Docs, tests and config are never served. If a new file is
added that the page needs, add it to `FILES` in `server.py`.

Python's standard library is the only server dependency; no packages, secrets
or external services are required. Google Fonts are loaded by the page when
available.

## Structure

- `index.html`: page shell
- `css/styles.css`: styling
- `js/content.js`, `js/guides.js`: programme content under professional review
- `js/logic.js`: programme rules, tested by `node tests/logic.test.js`
- `js/app.js`: screens and interactions
- `docs/PRODUCT.md`: what the product is and why
- `docs/BUILD_BRIEF.md`: future backend work, not approved scope

## Scope

The owner develops this app through GitHub. Do not change the app, its content
or its rules unless the owner asks. Running it is the only approved task.

Member data remains in the browser's localStorage. It is not synced between
devices, and clearing browser data removes it. There are no accounts, payments
or real videos. The exercise programme, guides and health screening are drafts
requiring qualified professional review before real members use them.
