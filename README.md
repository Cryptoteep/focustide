# 🌊 FocusTide

**Privacy-first focus timer & deep-work analytics for developers.**
Your data never leaves your browser. 100% local, free, open source.

[![License: MIT](https://img.shields.io/badge/License-MIT-teal.svg)](https://opensource.org/licenses/MIT)
[![Made with Next.js](https://img.shields.io/badge/Next.js-16-black.svg)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue.svg)](https://www.typescriptlang.org/)
[![PRs welcome](https://img.shields.io/badge/PRs-welcome-teal.svg)](https://github.com/Cryptoteep/focustide/blob/main/CONTRIBUTING.md)
[![Good first issues](https://img.shields.io/github/issues/Cryptoteep/focustide/good%20first%20issue?label=good%20first%20issue&color=teal)](https://github.com/Cryptoteep/focustide/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22)
[![No telemetry](https://img.shields.io/badge/telemetry-none-teal.svg)](#privacy)

> Ride the tide of deep work. FocusTide is a calm, keyboard-first Pomodoro & analytics
> app that runs **entirely in your browser** — no accounts, no servers, no tracking. Your
> focus history lives in `localStorage`, exportable to JSON/CSV/Markdown anytime.

---

## ✨ Why FocusTide?

The productivity tooling market is full of cloud timers that gate features behind
paywalls and quietly ship analytics SDKs. FocusTide is the opposite:

- 🌊 **Local-first by design.** No backend, no database, no account. Your data is yours.
- 🔒 **Zero telemetry.** The network tab is silent after first load. The whole app is a static bundle.
- ⌨️ **Keyboard-first.** Space to start/pause, `R` to reset, `S` to skip, `?` for shortcuts.
- 📊 **Real analytics.** Daily, weekly, hourly and phase breakdowns — plus a 35-day streak heatmap.
- 🎨 **Calm & themeable.** Light/dark/system + 5 accent presets. No streak-shaming, no nagging.
- 📤 **Own your data.** Export to JSON/CSV/Markdown. Import on any device. No lock-in.
- 💚 **Non-commercial & OSS.** MIT licensed, maintained by volunteers, free forever.

---

## 🚀 Features

| Area | What you get |
| --- | --- |
| **Timer** | Adaptive Pomodoro with focus / short-break / long-break, wall-clock accurate (survives tab throttling & sleep), auto-start options, cycle dots |
| **Tasks** | Estimates, link a task to each focus tide, drag-to-reorder, completed pomodoro counts, notes |
| **Analytics** | 14-day daily focus bars, cumulative focus area chart, hour-of-day histogram (find your peak), phase donut, recent session log |
| **Streaks** | Current & longest streak, 35-day activity heatmap, weekly count |
| **Themes** | Light / dark / system + 5 accent presets (Tide, Emerald, Violet, Amber, Rose) via CSS variables |
| **Audio** | Web-Audio synthesized chimes (no audio files) with volume control |
| **Alerts** | Optional browser notifications on phase completion |
| **Data** | JSON backup, CSV sessions, Markdown report, import, one-click clear |
| **Shortcuts** | Full keyboard control, `?` help overlay, live timer in the tab title |

---

## 🧑‍💻 Quick start

### Use it (no install)

Just open the deployed app and start a focus tide. Everything stays in your browser.

### Run locally

```bash
# 1. Clone
git clone https://github.com/Cryptoteep/focustide.git
cd focustide

# 2. Install (Bun recommended, npm/pnpm/yarn also work)
bun install

# 3. Dev server
bun run dev
# → http://localhost:3000

# 4. Lint
bun run lint
```

> Requirements: Node.js 20+ (or Bun 1.1+). No environment variables, no API keys, no
> database to provision — there is no backend.

---

## 🏗️ Architecture

FocusTide is a **Next.js 16** app (App Router) written in **TypeScript**, styled with
**Tailwind CSS 4** and **shadcn/ui**, with **Recharts** for visualizations and
**Framer Motion** for subtle motion.

```
src/
├── app/                     # Next.js App Router
│   ├── layout.tsx           # Root layout, metadata, theme provider
│   ├── page.tsx             # Single-page composition (hero + app + sections)
│   └── globals.css          # FocusTide theme tokens (CSS variables)
├── components/
│   ├── focustide/           # Feature components (timer, tasks, analytics, …)
│   ├── theme-provider.tsx   # next-themes wrapper
│   └── ui/                  # shadcn/ui primitives
├── hooks/
│   └── use-timer-engine.ts  # Wall-clock accurate timer driver + live-seconds hook
└── lib/
    ├── store.ts             # Zustand store + localStorage persistence
    ├── stats.ts             # Streak & aggregation helpers
    ├── export.ts            # JSON / CSV / Markdown export + import
    ├── sound.ts             # Web-Audio chimes + accent presets
    └── types.ts             # Shared TypeScript types
```

### Design principles

1. **No backend, ever.** Anything that needs persistence uses `localStorage`. Future
   optional sync (v1.2) will be end-to-end encrypted via your own GitHub Gist.
2. **Wall-clock accuracy.** The timer stores an `endsAt` deadline and computes remaining
   time from `Date.now()`, so background throttling and sleep can't drift it.
3. **CSS-variable theming.** Brand colors are plain CSS custom properties swapped at runtime,
   so theme switching is instant and zero-JS after the first paint.
4. **Accessible by default.** Semantic HTML, ARIA labels, keyboard navigability, 44px+
   touch targets, `prefers-color-scheme` support.

---

## ⌨️ Keyboard shortcuts

| Key | Action |
| --- | --- |
| `Space` | Start / pause the timer |
| `R` | Reset the current phase |
| `S` | Skip to the next phase |
| `1` / `2` / `3` | Switch to Focus / Short break / Long break |
| `N` | Focus the new-task input |
| `?` | Toggle the shortcuts overlay |

---

## 🔒 Privacy

FocusTide collects **nothing**. Concretely:

- ❌ No analytics, telemetry, or error reporting SDKs
- ❌ No third-party scripts, fonts, or CDNs at runtime (Google Fonts are self-hosted at build)
- ❌ No cookies
- ❌ No accounts or authentication
- ✅ All data lives in your browser's `localStorage`
- ✅ Export anytime; clear anytime; leave the platform anytime with your data intact

The entire app is a static bundle. After first load it works fully offline. You can
verify all of this by reading the source — that's the point of open source.

See [SECURITY.md](./SECURITY.md) for responsible disclosure.

---

## 🤝 Contributing

Contributions of every kind are welcome — code, docs, translations, design feedback,
bug reports, feature ideas. Read [CONTRIBUTING.md](./CONTRIBUTING.md) to get started,
and check the [`good first issue`](https://github.com/Cryptoteep/focustide/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22) label for beginner-friendly tasks.

All interactions are governed by our [Code of Conduct](./CODE_OF_CONDUCT.md).

### Areas we'd love help with

- 🌍 **Translations** (i18n is on the v1.2 roadmap — help us bootstrap ru/es/de/fr/zh)
- 🎨 **Themes & accessibility audits**
- 🧪 **Cross-browser testing** (Safari, Firefox, mobile browsers)
- 📱 **PWA shell** (v1.1)
- 🔌 **Optional encrypted Gist sync** (v1.2)

---

## 🗺️ Roadmap

See the live roadmap at [focustide.dev/#roadmap](https://focustide.dev/#roadmap) or the
[GitHub Projects board](https://github.com/Cryptoteep/focustide/projects). Highlights:

- **v1.1** — Calendar heatmap, ambient soundscape player, PWA install, tags & per-tag analytics
- **v1.2** — Goals & weekly targets, insights panel, `⌘K` command palette, optional encrypted sync, i18n
- **Future** — Community theme marketplace, local git-activity integration, WebRTC focus rooms, CLI companion

---

## ❓ FAQ

Head to [focustide.dev/#faq](https://focustide.dev/#faq) or open a
[discussion](https://github.com/Cryptoteep/focustide/discussions).

---

## 📄 License

[MIT](./LICENSE) © FocusTide contributors.

FocusTide is a **non-commercial, community-maintained** project. It will never be sold,
paywalled, or acquire tracking. If you find it useful, the best way to say thanks is to
⭐ star the repo, share it with a friend, or open a pull request.
