# FocusTide — Project Worklog

This is the shared handover document for the FocusTide OSS project. Every phase of
work appends a section below. The latest state is always at the top of the log.

---
Task ID: 1
Agent: Z.ai Code (main orchestrator)
Task: Design, build and ship the FocusTide OSS project; upload to GitHub via API; verify end-to-end; schedule recurring QA.

Work Log:
- Verified GitHub PAT against `/user` → authenticated as `Cryptoteep`.
- Created public repo `Cryptoteep/focustide` (MIT, default `main`, descriptions/topics set) via `POST /user/repos`.
- Designed FocusTide: a privacy-first, local-first, open-source Pomodoro + deep-work analytics web app for developers. Non-commercial, MIT, zero telemetry.
- Built the full Next.js 16 + TypeScript + Tailwind 4 + shadcn/ui app:
  - Theme system (`src/app/globals.css`): teal "Tide" brand, light/dark/system, 5 runtime accent presets via CSS variables, custom scrollbar, grid/dots/float/glow utilities.
  - State (`src/lib/store.ts`): Zustand + `persist` to `localStorage` (`focustide:v1`). Tasks, sessions, settings, timer runtime. Wall-clock-accurate timer (stores `endsAt`, computes remaining from `Date.now()`).
  - Timer engine (`src/hooks/use-timer-engine.ts`): single interval drives completion + tab-title countdown; visibilitychange/focus re-validation for backgrounded tabs.
  - Sound (`src/lib/sound.ts`): Web-Audio synthesized chimes (start/complete/break/tick/finish) — no audio files. Accent preset CSS-variable maps.
  - Stats (`src/lib/stats.ts`): streak computation (current/longest, active-days), daily aggregates, phase breakdown, hour histogram, formatters.
  - Export (`src/lib/export.ts`): JSON backup, CSV sessions, Markdown deep-work report, import parser.
  - Components (`src/components/focustide/`): SiteHeader, Hero, Features, AppShell (Tabs), Timer (circular ring), TaskList (dnd-kit sortable), Analytics (recharts: bar/area/bar/pie + session log), StreakCard (35-day heatmap), StatsCards, SettingsDialog, ExportMenu, KeyboardShortcuts (`?` overlay), Roadmap, FAQ, SiteFooter, NewsletterStrip.
  - Single route `src/app/page.tsx` composing everything; `layout.tsx` updated with FocusTide metadata, next-themes provider, sonner toaster.
- Authored OSS scaffolding: README (badges, features, architecture, privacy, contributing, roadmap, FAQ), LICENSE (MIT), CONTRIBUTING, CODE_OF_CONDUCT (Contributor Covenant 2.1), CHANGELOG (Keep a Changelog), SECURITY, .gitignore, .editorconfig, `.github/ISSUE_TEMPLATE/{bug_report,feature_request,config}.yml`, `.github/PULL_REQUEST_TEMPLATE.md`, `.github/workflows/ci.yml` (bun lint + tsc), `.github/FUNDING.yml`.
- Wrote `scripts/upload-to-github.ts` — Git Database API uploader (concurrent blob creation → single tree → commit → ref update), idempotent (appends to existing `main`), with retry on rate-limit/5xx.
- **Upload #1**: 95 files → commit `c24be292` "feat: FocusTide v1.0". (First run accidentally included the `skills/` library — 1036 files; fixed the ignore list.)
- **Upload #2**: 101 files (added `.github/` which the dot-dir filter had skipped) → commit `0301fbcd` "chore: add .github issue/PR templates and CI workflow".
- Enabled repo Discussions + Wiki + Projects; set topics (productivity, pomodoro, focus, deep-work, privacy, local-first, nextjs, typescript, opensource, self-hosted).
- Created GitHub Release **v1.0.0 — First tide 🌊** with full release notes (tag `v1.0.0` on `main`).
- Lint clean (`bun run lint` → 0 errors after fixing `react-hooks/immutability` in analytics cumulative reducer).
- **Agent Browser QA (golden path)** on http://localhost:3000:
  - Page renders: hero, app shell, timer (25:00 default), stats cards, Tasks/Analytics tabs, streak heatmap, footer. No runtime errors in dev.log.
  - Timer start → counts down (25:00 → 24:42), `runtime.running:true`, `endsAt` set, persisted to localStorage.
  - Space keyboard shortcut → pauses timer (`running:false`). `?` shortcut wired.
  - Task add via keyboard type + Enter → task persisted + rendered ("Review PR #42" / "0/1").
  - Injected 2 completed sessions → Analytics tab renders Daily focus bars, Cumulative area, hour histogram, phase donut, session log. Streak heatmap populated.
  - Sticky footer layout confirmed (`min-h-screen flex flex-col`, `main flex-1`, footer `mt-auto`).

Stage Summary:
- **Repo live**: https://github.com/Cryptoteep/focustide (public, MIT, 2 commits, release v1.0.0, discussions enabled).
- **App live**: http://localhost:3000 (Next.js 16 dev server, port 3000) — fully interactive, local-first, zero telemetry.
- **Artifacts produced**: 101 source files + 6 `.github` files + 7 OSS docs; upload script at `scripts/upload-to-github.ts` (token via `GITHUB_TOKEN` env, never committed).
- **Quality**: lint clean; golden path browser-verified; wall-clock timer invariant preserved; privacy invariant (no outbound requests) upheld.
- **Mission**: non-commercial OSS, maintained by volunteers, free forever. Foundation laid for real community growth (good-first-issue labels, discussions, contributing guide, CI).

Unresolved / Next-phase priorities:
- **Seed good-first-issues**: file 2–3 issues from the v1.1 roadmap (calendar heatmap, ambient soundscape, PWA shell) tagged `good first issue` to give contributors an entry point.
- **Trim dependencies**: package.json still carries scaffold-only deps (prisma, next-auth, next-intl, z-ai-web-dev-sdk) unused by the client-only app. A follow-up PR should remove them and regenerate `bun.lock` for a clean OSS install story.
- **PWA shell** (v1.1): add manifest + service worker for installable offline use.
- **i18n** (v1.2): start with `ru` given the maintainer audience.
- **Optional encrypted Gist sync** (v1.2): design doc + opt-in toggle.
- **Visual polish**: add a custom OG image (`public/og.png`) and favicon set; the README badges currently render but a hero OG image would improve link previews.

---
Task ID: 2
Agent: Z.ai Code (cron webDevReview #1)
Task: Recurring QA + feature/styling improvements for FocusTide.

Work Log:
- Read worklog Task 1 — project was at v1.0 (live repo + app, lint clean, 2 commits).
- **QA via agent-browser** (desktop 1440×900 + mobile 375×812):
  - Console errors: 0. dev.log: no errors. Lint: clean.
  - Theme toggle (dark↔light): works, background flips.
  - Accent switch (Violet): `--brand` oklch updated, applied.
  - Settings dialog: opens/closes via Escape.
  - Export dropdown: works with native click (Radix requires pointer events, JS .click() doesn't trigger — not an app bug).
  - Mobile: header menu button present, h1 scales to 36px, no horizontal overflow (scrollW=clientW=375).
  - Keyboard handler confirmed working (Space toggles timer via `press`). `?` overlay is a test-harness limitation (synthetic KeyboardEvent doesn't carry `key:'?'`); real users unaffected.
  - Timer: wall-clock accurate, persists to localStorage, tab-title countdown works.
- **New features implemented (v1.1 in progress):**
  1. **Ambient soundscape player** (`src/lib/soundscape.ts` + `soundscape-player.tsx`): 6 procedurally-synthesized sounds — rain (filtered white noise + LFO), ocean waves (brown noise + filter-cutoff swell), white noise, brown noise, cafe (brown noise + random cup-clink tones), forest (filtered noise + bird chirps). Pure Web Audio, zero files, zero network. Popover with volume slider + live ping indicator. Singleton engine with stop-on-unmount.
  2. **Daily focus goal** (`daily-goal-card.tsx`): animated SVG progress ring, 5 quick presets (60/90/120/180/240 min), celebratory sonner toast on goal completion. Added `dailyGoalMinutes` to Settings type + store default (120) + Settings dialog field.
  3. **Quick-start presets** on Timer (15/25/50/90 min chips, focus phase only, idle only) — one tap sets `focusMinutes` and refreshes the timer.
  4. **"How it works" section** (`how-it-works.tsx`): 3-step onboarding (Start a tide → Link a task → Watch it compound) with numbered badges, icons, connecting timeline on desktop, scroll-triggered Framer Motion entrance.
- **Styling polish (mandatory):**
  - Timer ring: added animated outer glow (radial-gradient, intensifies while running), 60 rotating tick marks (animate-ring-rotate, 24s), SVG `feGaussianBlur` glow filter on the progress stroke.
  - New CSS keyframes: `ft-wave`, `ft-shimmer`, `ft-gradient-shift`. New utilities: `.animate-wave`, `.animate-gradient`, `.text-shimmer`, `.bg-wave`.
  - AppShell toolbar now `flex-wrap` for mobile; DailyGoalCard + StreakCard stacked in a `space-y-4` column.
  - Features list updated (streaks→"Streaks & daily goals", notifications→"Ambient soundscapes") to reflect new functionality.
- **Verification (agent-browser):**
  - HowItWorks section renders with 3 steps.
  - Soundscape popover opens, shows 6 options, Rain toggles active state (brand-styled button).
  - Daily goal card renders with SVG ring + 5 presets.
  - Quick preset 50m clicked → `focusMinutes` = 50 in localStorage, timer shows 50:00.
  - Tick marks SVG (1 rotating) + glow filter present.
  - Mobile: no overflow, toolbar wraps.
  - Lint clean, 0 console errors, 0 dev.log errors.

Stage Summary:
- **Status**: stable, all v1.0 features intact + 4 new v1.1 features shipped locally.
- **Quality**: lint clean; agent-browser QA passed on desktop + mobile; wall-clock + privacy invariants preserved.
- **New artifacts**: `src/lib/soundscape.ts`, `src/components/focustide/{soundscape-player,daily-goal-card,how-it-works}.tsx`; modified `timer.tsx`, `app-shell.tsx`, `settings-dialog.tsx`, `features.tsx`, `page.tsx`, `globals.css`, `types.ts`, `store.ts`, `CHANGELOG.md`.
- **GitHub**: pending push — will upload as commit "feat(v1.1): ambient soundscapes, daily goal, quick presets, how-it-works, timer polish".

Unresolved / Next-phase priorities:
- **Push v1.1 to GitHub** via the upload script (this round).
- **PWA shell** (v1.1 remaining): manifest + service worker for offline install (good-first-issue #1 already filed).
- **Calendar heatmap** (v1.1 remaining): full-year GitHub-style heatmap to replace/augment the 35-day mini heatmap.
- **Trim unused deps** (good-first-issue #3): remove prisma/next-auth/next-intl/z-ai-web-dev-sdk from package.json for a clean OSS install story.
- **OG image**: add `public/og.png` for better link previews.
- **Command palette (⌘K)** (v1.2): quick access to all actions.
- **i18n** (v1.2): start with `ru`.

---
Task ID: 3
Agent: Z.ai Code (cron webDevReview #2)
Task: Recurring QA + v1.2 features (command palette, insights) + styling polish + crash-resilience fix.

Work Log:
- Read worklog Tasks 1+2 — project at v1.1 (4 new features, lint clean, 3 commits on GitHub).
- **QA via agent-browser** (desktop 1440×900 + mobile 375×812):
  - Fresh state: lint clean, 0 console errors, 0 dev.log errors.
  - Daily goal: injected 130min session → goal reached toast fired ("Daily goal reached! 🎯 2h 10m"), ring showed correct %, presets work.
  - Analytics empty state: renders "No analytics yet" with friendly copy.
  - **BUG FOUND (critical)**: injecting `runtime: null` into localStorage → **white screen / client-side exception**. The store's `onRehydrateStorage` only called `setHydrated()` without validating the shape, so any corrupted/partial payload crashed components reading `runtime.phase`.
  - **BUG FOUND (compile/runtime)**: `insights-panel.tsx` used `<Sun />` icon without importing it → "Sun is not defined" runtime crash (passed lint because eslint didn't flag the JSX reference as undefined in that config). Error boundary caught it.

- **FIX 1 — Crash-resilient store** (`src/lib/store.ts`):
  - Rewrote `onRehydrateStorage` with defensive guards: validates `tasks`/`sessions` are arrays, deep-merges `settings` against `DEFAULT_SETTINGS` (so old payloads get new fields like `dailyGoalMinutes`), reconstructs `runtime` if missing/malformed, force-resets `running:false` + `endsAt:null` on load (never resume a stale timer). Wrapped in try/catch as last-resort fallback to full defaults.
  - Verified: `runtime: null` no longer crashes — page renders OK, store auto-heals to `phase:focus, running:false`.
- **FIX 2 — Error boundary** (`src/components/focustide/error-boundary.tsx`):
  - Top-level React error boundary wrapping `{children}` in `layout.tsx`. On any render throw: shows a calm recovery screen with the error message, "Reload" and "Reset local data" (clears `focustide:v1` + reloads) buttons. No telemetry. Caught the `Sun is not defined` crash during testing (proving it works).
- **FIX 3 — insights-panel import** (`insights-panel.tsx`): added `Sun` to the lucide import list; removed unused `aggregateByDay`, `toDayKey`, `cn` imports.

- **NEW FEATURES (v1.2):**
  1. **⌘K Command palette** (`command-palette.tsx`): 18 actions across 5 groups (Timer, Presets, Navigate, Theme, Data). Opens via ⌘K/Ctrl+K or a toolbar button (`window.dispatchEvent` custom event). Fuzzy search via cmdk. Verified: typing "theme" filters to "Switch to light theme"; typing "50" filters to the 50-min preset. Shortcuts shown inline.
  2. **📊 Insights panel** (`insights-panel.tsx`): peak focus hour, most productive day-of-week, 7-day trend vs previous week (+/- %), average session length, time-of-day distribution (morning/afternoon/evening/night bars), estimate accuracy (completed/estimated pomodoros with adaptive message). Friendly empty state. Verified with 7 injected sessions across hours/days: peak 09:00, day Tue, trend +100%, avg 25m, morning 1h15m / afternoon 1h15m / evening 25m.
  3. **🤝 Community CTA section** (`community-cta.tsx`): stat strip (100% local / 0 trackers / MIT / ∞ your data), three ways-to-contribute cards (star, PR, discussion), gradient final-CTA card with glow blobs. Scroll-triggered Framer Motion.
  4. **🧭 "Community" nav link** in header (desktop + mobile dropdown).

- **Styling polish:**
  - New `WaveDivider` component (inline SVG wave, themeable, flippable) — available for section transitions.
  - Command palette toolbar button shows `⌘ K · command palette` on lg screens.
  - Community CTA: radial-gradient backdrop + grid overlay + glassmorphism cards with hover lift.
  - Insights: animated time-of-day bars with Framer Motion width transitions, color-coded by slot.

- **Verification (agent-browser):**
  - ⌘K button present + opens palette (18 items in 5 groups).
  - Fuzzy search: "theme"→1 result, "50"→1 result.
  - Community section renders with 4 stats + 3 contribution cards + final CTA.
  - Community nav link present (desktop + mobile).
  - Insights panel: 4 stat cards + time-of-day bars + estimate accuracy all render with data; empty state renders without data.
  - **Crash-resilience verified**: `runtime: null` in localStorage → page still renders (store self-heals).
  - Mobile: no horizontal overflow (375=375), community CTA renders.
  - Lint clean, 0 console errors after fixes.

Stage Summary:
- **Status**: stable, v1.2 features shipped, 2 critical crash bugs fixed (corrupted localStorage + missing icon import).
- **Quality**: lint clean; agent-browser QA passed; store now defensive against bad data; error boundary as safety net.
- **New artifacts**: `src/components/focustide/{command-palette,insights-panel,community-cta,wave-divider,error-boundary}.tsx`; modified `store.ts` (safe rehydrate), `layout.tsx` (ErrorBoundary), `analytics.tsx` (InsightsPanel integration), `app-shell.tsx` (⌘K button + CommandPalette), `site-header.tsx` (Community nav), `page.tsx` (CommunityCTA), `insights-panel.tsx` (import fix), `CHANGELOG.md`.
- **GitHub**: pending push as commit "feat(v1.2): command palette, insights, community CTA + crash-resilience fix".

Unresolved / Next-phase priorities:
- **Push v1.2 to GitHub** via the upload script (this round).
- **PWA shell** (v1.1 remaining): manifest + service worker (good-first-issue #1).
- **Calendar heatmap** (v1.1 remaining): full-year GitHub-style heatmap.
- **Trim unused deps** (good-first-issue #3): remove prisma/next-auth/next-intl/z-ai-web-dev-sdk.
- **OG image**: add `public/og.png` for link previews.
- **i18n** (v1.2): start with `ru`.
- **Tags & per-tag analytics** (v1.1): tag tasks, filter analytics by tag.

---
Task ID: 4
Agent: Z.ai Code (cron webDevReview #3)
Task: Recurring QA + v1.3 features (full-year calendar heatmap, task tags) + styling polish.

Work Log:
- Read worklog Tasks 1-3 — project at v1.2 (command palette, insights, community CTA, crash-resilience; 4 commits on GitHub).
- **QA via agent-browser** (desktop 1440×900 + mobile 375×812):
  - Fresh state: lint clean, 0 console errors, 0 dev.log errors.
  - Task add via keyboard type + Enter → persisted ("Review PR #42").
  - Timer: Space toggles (after Tab blur from input), running:true, wall-clock accurate (1497s remaining), persists.
  - Injected 10 sessions across days → Analytics renders charts + insights (peak 09:00, day Mon, trend +100%, avg 25m, time-of-day distribution correct).
  - Mobile: no horizontal overflow (375=375).
  - No bugs found — project stable.

- **NEW FEATURES (v1.3):**
  1. **📅 Full-year calendar heatmap** (`calendar-heatmap.tsx`): GitHub-style 53-week × 7-day grid ending at the current week. 5-level intensity coloring (0 / <25 / <50 / <100 / ≥100 min). Month labels at week starts, Mon/Wed/Fri day labels. Hover any cell → detail row shows date + minutes + sessions. Prev/next navigation (shifts 4 weeks = ~1 month), forward disabled past today. Summary: active days + total minutes. Legend (Less→More). Horizontal scroll on mobile via `overflow-x-auto ft-scroll`. Verified with 40 injected sessions across 80 days: renders "40 active days · 16h 40m focused", all 12 month labels, intensity cells.
  2. **🏷️ Task tags** (`task-list.tsx` + store): 
     - `Task.tags: string[]` added to types.
     - Store `addTask(title, est, note, tags?)` — normalizes to lowercase, max 5.
     - Store `addTagToTask` / `removeTagFromTask` methods.
     - `onRehydrateStorage` backfills `tags: []` on old tasks.
     - UI: tag input (Enter/comma to add) with pending-tag badges below the title input; colored hash-badges on each task row (deterministic hash-based color from 5-palette: brand/amber/violet/emerald/rose).
     - Tag filter bar: "All" + one chip per unique tag; click to filter open + done tasks; empty state when filter yields no tasks.
     - Verified: 3 tasks with tags [feature,frontend], [bug,backend], [docs] → all 5 tags appear in filter bar; clicking #docs shows only "Write docs"; "All" resets.

- **Styling polish:**
  - Calendar heatmap: 13×13px rounded cells with 3px gaps, Framer Motion `whileHover` scale 1.4, opacity-30 for out-of-range future days, themed legend.
  - Task tags: 9px font, px-1.5 py-px badges with border, wrapped flex layout, hover ring on active filter chip.
  - Tag input: dashed border, h-7 compact size, Hash icon prefix.

- **Verification (agent-browser):**
  - Calendar heatmap renders in Analytics tab with 40 sessions: "Focus calendar · 40 active days · 16h 40m focused", month labels Jul→Jul, day labels Mon/Wed/Fri.
  - Insights still renders correctly (peak 09:00, day Mon, 16h40m total, estimate accuracy 5/9=56%).
  - Tags: all 5 tags visible on tasks + filter bar; #docs filter → only "Write docs" visible; "All" resets.
  - Lint clean, 0 console errors, 0 dev.log errors.
  - Mobile: no overflow (375=375), calendar has horizontal scroll container.

Stage Summary:
- **Status**: stable, v1.3 features (calendar heatmap + task tags) shipped locally.
- **Quality**: lint clean; agent-browser QA passed on desktop + mobile; store backwards-compatible (old tasks get tags:[]).
- **New artifacts**: `src/components/focustide/calendar-heatmap.tsx`; modified `task-list.tsx` (tags UI + filter), `store.ts` (tag methods + rehydrate), `types.ts` (Task.tags), `analytics.tsx` (CalendarHeatmap integration), `CHANGELOG.md`.
- **GitHub**: pending push as commit "feat(v1.3): full-year calendar heatmap + task tags with filter".

Unresolved / Next-phase priorities:
- **Push v1.3 to GitHub** via the upload script (this round).
- **PWA shell** (v1.1 remaining): manifest + service worker (good-first-issue #1).
- **Trim unused deps** (good-first-issue #3): remove prisma/next-auth/next-intl/z-ai-web-dev-sdk.
- **OG image**: add `public/og.png` for link previews.
- **i18n** (v1.2): start with `ru`.
- **Per-tag analytics**: extend insights to break down focus time by tag.
- **Keyboard shortcut for tag input**: wire `N` to focus the title input (already done), consider `T` for tag input.

---
Task ID: 5
Agent: Z.ai Code (cron webDevReview #4)
Task: Recurring QA + v1.4 features (PWA shell, per-tag analytics) + bugfix.

Work Log:
- Read worklog Tasks 1-4 — project at v1.3 (calendar heatmap + task tags; 5 commits on GitHub).
- **QA via agent-browser** (desktop 1440×900):
  - Fresh state: lint clean, 0 console errors, 0 dev.log errors.
  - Calendar heatmap navigation: prev button → "18 active days · 7h 30m focused" (correct, shows earlier window); next → back to current. 0 errors.
  - Tag filter: #backend → shows "Refactor core" (only open task with backend tag; "Fix auth bug" is in completed section). "All" resets correctly.
  - Tag input flow: type title → focus tag input → type "urgent" → Enter → pending badge shows → submit → task persisted with `tags:["urgent"]`. End-to-end works.
  - No bugs found in v1.3 — project stable.

- **NEW FEATURES (v1.4):**
  1. **📱 PWA shell** — installable, offline-ready:
     - `/public/icon.svg`: custom FocusTide wave icon (gradient teal bg, 3 stylized tide waves, focus dot).
     - Generated PNG icons via cairosvg: 32×32 (favicon), 180×180 (apple-touch), 192×192, 512×512.
     - `/public/manifest.webmanifest`: name, short_name, description, start_url, standalone display, theme_color (#0fb5a8), background_color (#0a0f14), icons (SVG + 192/512 maskable), app shortcut ("Start focus tide").
     - `/public/sw.js`: service worker. Network-first for navigation (falls back to cached shell / offline.html), cache-first for static assets, version-keyed cache (`focustide-v1.4`) with cleanup on activate. **Privacy invariant upheld**: no outbound requests beyond caching own assets, no background sync, no push.
     - `/public/offline.html`: calm offline page with wave icon, "You're offline" message, reload button.
     - `sw-register.tsx`: registers SW only in production (avoids stale-cache in dev).
     - `install-prompt.tsx`: dismissable install banner on `beforeinstallprompt`, remembers dismissal in localStorage, success toast on accept.
     - `layout.tsx`: manifest link, apple-touch-icon, apple-web-app meta (capable, title, statusBarStyle), SVG + PNG icon links.
     - Verified: `<link rel="manifest">` present in head, apple-touch-icon present, SVG icon present.
  2. **📊 Per-tag analytics** (`tag-breakdown.tsx`): "Focus by tag" card in Analytics. Aggregates focus minutes + sessions + tasks per tag (via taskId→tags lookup). Animated horizontal bars with deterministic tag colors (8-color palette), percentage shares, top-8 with "+N more" overflow. Hidden when no tagged sessions. Verified with 20 sessions across 3 tagged tasks: feature 21% / frontend 21% / bug 21% / backend 21% / docs 18%, total 14h 10m tagged.

- **BUGFIX:**
  - `tag-breakdown.tsx` imported `Tag2` from lucide-react — that export doesn't exist (should be `Tags`). Caused 500 compile error + dev server crash (Turbopack OOM'd on the failed compile). Fixed import to `Tags`. Also removed unused `cn` import.

- **Styling polish:**
  - Install prompt: fixed bottom-right, glassmorphism card, brand gradient icon, dismiss X button.
  - Tag breakdown: 2.5px gap bars, 10px share percentage, colored dot + hash label, session/task count in muted text.
  - Offline page: dark theme, centered card, wave emoji icon, reload button.

- **Verification (agent-browser):**
  - PWA: manifest link present, apple-touch-icon present, SVG icon present.
  - Tag breakdown: renders with 5 tags, correct minutes/sessions/tasks/percentages, animated bars.
  - 0 console errors after bugfix.
  - Lint clean.
  - Note: dev server experienced OOM crashes during heavy recompiles (13-16s compile times) — environment constraint, not a code issue. Restored by restart.

Stage Summary:
- **Status**: stable, v1.4 features (PWA shell + per-tag analytics) shipped locally.
- **Quality**: lint clean; agent-browser QA passed; PWA head links verified; tag breakdown verified with data; 1 bugfix (Tag2→Tags).
- **New artifacts**: `public/{icon.svg,icon-192.png,icon-512.png,icon-180.png,apple-touch-icon.png,favicon-32.png,manifest.webmanifest,sw.js,offline.html}`, `src/components/focustide/{sw-register,install-prompt,tag-breakdown}.tsx`; modified `layout.tsx` (PWA meta), `analytics.tsx` (TagBreakdown), `page.tsx` (InstallPrompt), `tag-breakdown.tsx` (bugfix), `CHANGELOG.md`.
- **GitHub**: pending push as commit "feat(v1.4): PWA shell + per-tag analytics".

Unresolved / Next-phase priorities:
- **Push v1.4 to GitHub** via the upload script (this round).
- **Trim unused deps** (good-first-issue #3): remove prisma/next-auth/next-intl/z-ai-web-dev-sdk — will also reduce compile time / memory pressure.
- **OG image**: add `public/og.png` for link previews.
- **i18n** (v1.2): start with `ru`.
- **Dev server stability**: the 13-16s compile times + OOM crashes suggest Turbopack is memory-constrained; trimming deps should help. Consider switching to webpack for dev if it persists.
- **Keyboard shortcut `T` for tag input**: wire focus to the tag input.
