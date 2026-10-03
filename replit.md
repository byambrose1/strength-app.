# Holdfast prototype

## Running on Replit

Use Run to start the **Start application** workflow, or run:

```sh
python3 server.py
```

The server binds to `0.0.0.0:5000` for the Replit web preview. It serves only
`/` and `/index.html`, not repository files. Python's standard library is the
only server dependency; no packages, secrets or external services are required.
Google Fonts are loaded by the existing page when available.

## Scope

The user requested running the imported prototype, not implementing the full
build brief. Keep the existing single-file app and programme logic unchanged.
`REPLIT_BRIEF.md` describes possible future work, not approved setup scope.

Member data remains in this browser's localStorage. It is not synced between
devices, and clearing browser data removes it. There are no accounts, payments
or real videos. The exercise programme and health screening are drafts requiring
qualified professional review before real members use them.