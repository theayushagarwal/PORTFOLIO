---
slug: chronosync
title: "Filtering Clocks, CSRF Nonces, and 500 Errors Out of Website Diffs (Chronosync)"
canonicalUrl: "https://theayush.pages.dev/projects/chronosync"
repoUrl: "https://github.com/theayushagarwal/Chronosync"
coverImage: "https://theayush.pages.dev/portfolio-preview.webp"
tags: [python, fastapi, playwright, sqlite]
fuelerTitle: "Chronosync: FastAPI + Playwright Web Monitor & Visual Diff Studio"
fuelerSkills: [Python, FastAPI, Playwright, SQLite, Docker, Visual Regression, Groq API]
---

<!-- SECTION: ARTICLE -->
If you wire Playwright to take snapshots on a cron loop and diff HTML strings, it stops being useful within an hour. Relative clocks (`2 mins ago`), CSRF nonces, and A/B banners change every reload, and an HTTP 500 outage looks like the entire store page vanished.

I built Chronosync with FastAPI, Playwright, and SQLite to handle the boring edge cases that break naive monitors:

### Separating watches from pages
If 200 users subscribe to the same product page with slightly different UTM tracking params or trailing slashes, you shouldn't spin up 200 headless browser runs. `app/normalizer.py` canonicalizes URLs and maps many user `watches` onto a single scheduled `pages` row in SQLite, gated by `robots.txt` rules and per-domain jitter.

### Catching 5xx outages and CAPTCHAs before diffing
Before touching snapshot history, `app/classifier.py` classifies responses into `ok`, `error` (`5xx`/timeouts), or `blocked` (`401/403/429`/CAPTCHA). Outage pages never overwrite the baseline snapshot, and blocked domains back off exponentially up to 24h instead of hammering the target.

### Two-check persistence without double-fetching
`differ.clean_text` strips volatile timestamps, relative dates, counters, and random tokens, and users can attach watch-only or ignore CSS selectors. Even after scrubbing, single-run glitches still slip through, so unconfirmed changes sit in `pending_hash` until a second consecutive scheduled check matches. You get most of the noise protection of double-fetching at zero extra load.

### Visual Diff Studio + sandboxed Element Picker
In `app/static/app.js`, confirmed diffs open into a 4-mode Diff Studio (draggable swipe slider, pixel heatmap, unified line diff, and an SVG price history chart) plus a sandboxed `/api/picker` iframe that captures CSS selectors over `postMessage` so untrusted third-party scripts never touch the dashboard DOM. Tested end-to-end against `/flaky`, `/captcha`, and `/down` fixtures with **29/29** tests running in **~1.5s**.

Architecture walkthrough: https://theayush.pages.dev/projects/chronosync

Repo: https://github.com/theayushagarwal/Chronosync

<!-- SECTION: PEERLIST -->
Built Chronosync (FastAPI + Playwright + SQLite) after getting tired of website monitors pinging me over "2 mins ago" clocks and HTTP 500 outages.

Splits canonical pages from watches (1 fetch for N users), classifies outages/CAPTCHAs before diffing, holds flaky diffs in `pending_hash` for 2-check confirmation, and includes a pixel heatmap + swipe slider Diff Studio.

https://theayush.pages.dev/projects/chronosync

<!-- SECTION: FUELER -->
Built Chronosync, a FastAPI + Playwright + SQLite web monitor and visual regression Diff Studio. Normalizes URLs (`pages` vs `watches`) so N subscribers share 1 fetch, classifies `ok`/`error`/`blocked` responses before diffing, scrubs volatile timestamps/CSRF tokens with a 2-check `pending_hash` persistence gate, sandboxes an Element Picker iframe via `postMessage`, ships with Docker Compose + Chrome extension + Groq optional summaries, and passes 29 unit/flow tests in ~1.5s.

<!-- SECTION: X -->
Diffing web pages with Playwright breaks fast once "2 mins ago" clocks and random HTTP 500s fire fake alerts.

Built Chronosync to strip volatile tokens, isolate outages, and require 2-check `pending_hash` confirmation first:
https://theayush.pages.dev/projects/chronosync

<!-- SECTION: LINKEDIN -->
Naively scheduling Playwright to diff web pages breaks fast on real sites: 200 users watching one URL launch 200 redundant scrapes, rotating CSRF tokens and timestamps fire alerts every 15 minutes, and HTTP 500 outages pollute valid baseline snapshots.

Chronosync (FastAPI, Playwright, SQLite) fixes those failure modes at the pipeline level: `normalizer.py` maps normalized watches to single shared pages, `classifier.py` filters `error` and `blocked` responses out of diff history, and `differ.py` pairs dynamic token scrubbing with a 2-check `pending_hash` gate before sending deduped alerts (`UNIQUE(watch_id, snapshot_id, kind)`) into a 4-mode Visual Diff Studio with 29/29 automated tests passing in ~1.5s.

Case study: https://theayush.pages.dev/projects/chronosync
GitHub: https://github.com/theayushagarwal/Chronosync
