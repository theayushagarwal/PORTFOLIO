---
slug: carrel
title: "How I Stopped Passcode Brute-Force From Freezing Live Keystrokes in Carrel"
canonicalUrl: "https://theayush.pages.dev/projects/carrel"
repoUrl: "https://github.com/theayushagarwal/carrel"
coverImage: "https://theayush.pages.dev/carrel-preview.webp"
tags: [typescript, websockets, yjs, react]
fuelerTitle: "Carrel: Real-Time Collaborative Code & Notes Workspace (TypeScript + Yjs)"
fuelerSkills: [TypeScript, React, Fastify, Yjs CRDT, WebSockets, SQLite, CodeMirror 6, Playwright]
---

<!-- SECTION: ARTICLE -->
When I started building Carrel, a real-time collaborative CodeMirror 6 workspace, I thought auth was the easy part: hash room passcodes with `scrypt`, verify on join, done.

Then I tested what happens under brute-force traffic. `scrypt` is slow on purpose. Run it synchronously and it blocks Node's event loop; run dozens of async `scrypt` calls uncapped and they saturate libuv's threadpool. Either way, anyone hammering wrong passcodes starts stuttering live keystrokes for everyone typing in the room.

Here is how I ended up structuring the server and protocol across the 3-package TypeScript monorepo (`@carrel/shared`, `@carrel/server`, `@carrel/client`):

### 1. Bounded scrypt + single-use WS tickets
In `server/src/throttle.ts`, `POST /api/rooms/:id/ticket` runs async `scrypt` inside a 4-slot concurrency limiter paired with per-IP progressive lockouts (and ignores `X-Forwarded-For` unless `TRUST_PROXY` is explicitly enabled). Once verified, the client gets a short-lived, single-use nonce-bound HMAC ticket to upgrade `/ws`, which gets burned immediately on upgrade so replay attempts fail.

### 2. One WebSocket with a 1-byte frame header
Instead of pushing everything through JSON messages or opening parallel sockets, `shared/src/frames.ts` prefixes every binary WebSocket payload with one routing byte:

```text
[0x00] -> raw y-protocols/sync CRDT updates (Y.Doc persisted via SQLite WAL)
[0x01] -> coalesced awareness updates (remote carets, selections, 80ms lerp)
[0x02] -> typed JSON control events (role changes, kicks, host handover)
```

CodeMirror 6 renders remote carets with an 80ms interpolation curve (`CarrelProvider.ts`) and turns interpolation off automatically when `prefers-reduced-motion` is set.

### 3. Not losing room admin on a 2-second Wi-Fi drop
If a host refreshes a tab or drops Wi-Fi briefly, promoting someone else on the exact `close` event creates constant role churn. In `server/src/host.ts`, a `HOST_GRACE_MS` (5000ms) timer marks the seat `hostPending` first. Only if that timer expires does seniority election promote the next peer by `min(joinedAt)` (tie-broken by `min(clientId)`), while `SENIORITY_WINDOW_MS` (30s) restores standing on quick reconnects. Multi-tab promotion and creator-key reclamation are verified in Playwright E2E specs (`phase5.test.ts`).

Full architecture notes and failure-mode diagrams: https://theayush.pages.dev/projects/carrel

Code on GitHub: https://github.com/theayushagarwal/carrel

<!-- SECTION: PEERLIST -->
Fun edge case while building Carrel (a Yjs + CodeMirror 6 collaborative editor): running scrypt per passcode attempt can starve Node's libuv threadpool and lag active peers' keystrokes.

Fixed it by capping async scrypt to a 4-slot queue, issuing single-use HMAC WS tickets, multiplexing sync/awareness/control on 1 byte, and giving hosts a 5s reconnect grace window.

Notes: https://theayush.pages.dev/projects/carrel
Repo: https://github.com/theayushagarwal/carrel

<!-- SECTION: FUELER -->
Built Carrel across a 3-package TypeScript monorepo (@carrel/shared, @carrel/server, @carrel/client) using Yjs CRDTs, Fastify, better-sqlite3 WAL snapshots, and CodeMirror 6. Implemented 1-byte binary WebSocket multiplexing (sync, awareness, JSON control frames), single-use nonce HMAC upgrade tickets, concurrency-4 async scrypt throttling with progressive IP lockouts, 5000ms host reconnect grace with deterministic seniority promotion, 80ms lerped remote carets, and Playwright multi-peer E2E tests.

<!-- SECTION: X -->
Auth bug I hit building my collaborative editor (Carrel): uncapped async scrypt checks saturate Node's threadpool and lag live keystrokes.

Fixed with a 4-slot scrypt limiter, single-use HMAC WS tickets & a 1-byte Yjs mux:
https://theayush.pages.dev/projects/carrel

<!-- SECTION: LINKEDIN -->
Most WebSocket auth bugs aren't about choosing the wrong hash algorithm. When building Carrel, a real-time collaborative editor using Yjs CRDTs, Fastify, and CodeMirror 6, running async scrypt on every room passcode check turned out to be an easy way to starve libuv and freeze typing for active peers.

Putting async scrypt behind a 4-slot concurrency limiter and issuing single-use nonce HMAC upgrade tickets kept auth responsive under load. On the socket itself, a single 1-byte frame prefix separates raw Yjs binary sync (`0`), coalesced awareness/carets (`1`), and JSON control events (`2`), backed by SQLite WAL snapshots and a 5-second host reconnect grace timer verified with Playwright multi-peer tests.

Full writeup: https://theayush.pages.dev/projects/carrel
GitHub: https://github.com/theayushagarwal/carrel
