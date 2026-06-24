# Session Companion — Standalone PWA

This is a fully self-contained app. No Claude, no internet dependency for the app
logic itself (only the two Google Fonts are fetched online — everything else,
including React, is bundled into `app.js`). Your data lives entirely on your
phone in this app's local storage; nothing is sent anywhere.

## Files in this folder
- `index.html` — the page itself
- `app.js` — the entire app, compiled and bundled (React included)
- `manifest.json` — tells Android this is an installable app (name, icon, colors)
- `sw.js` — service worker, caches everything so it works with no signal
- `icon-192.png`, `icon-512.png` — app icons

## Step 1 — Get it hosted (free, ~5 minutes)

PWAs need to be served over `https://` to be installable — opening the file
directly (`file://`) will run the app fine in a browser tab, but Android won't
offer to install it as a real app. GitHub Pages is the easiest free host:

1. Go to [github.com](https://github.com) and create a new repository
   (e.g. `session-companion`). Public is fine — there's no sensitive code here,
   and your personal data never touches this repo; it only lives on your phone.
2. Upload all the files in this folder to that repository (drag-and-drop on the
   GitHub web UI works — "Add file" → "Upload files").
3. In the repo, go to **Settings → Pages**.
4. Under "Build and deployment", set **Source** to "Deploy from a branch", pick
   the `main` branch and `/ (root)` folder, then Save.
5. Wait ~1 minute, then GitHub will give you a URL like:
   `https://yourusername.github.io/session-companion/`

## Step 2 — Install it on your Android phone

1. Open that URL in **Chrome** on your phone.
2. Tap the **⋮ menu** (top right) → **"Install app"** (or "Add to Home screen"
   on older Chrome versions).
3. Confirm. You'll get a real app icon on your home screen — opens full-screen,
   no browser bar, works offline after the first load.

## Updating it later
If I give you an updated version of these files, just re-upload them to the
same GitHub repo (overwrite) — Pages updates automatically, and the next time
you open the installed app it'll quietly fetch the new version in the
background and use it on the following launch.

## Your data
Everything (sessions, people, places) lives in this app's local storage on your
phone, tied to that specific installed app. Use the **Export Backup** button in
Settings periodically — it saves a real `.json` file to your phone you can keep
as a backup or move to a new device with **Import Backup**.
