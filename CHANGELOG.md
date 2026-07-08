# Changelog

All notable changes to FocusTide will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added (v1.3 in progress)
- 📅 **Full-year calendar heatmap** — GitHub-style 53-week × 7-day grid showing every focus session over the past year. 5-level intensity coloring, month labels, day labels, hover tooltips with per-day detail, prev/next navigation, active-days + total-minutes summary, legend.
- 🏷️ **Task tags** — add up to 5 tags per task (Enter or comma to add). Tags render as colored hash-badges on each task row (deterministic color per tag). Tag filter bar above the task list lets you filter by any tag with an "All" reset. Empty state for filtered views. Store auto-heals old tasks without `tags` array.
- 🛡️ **Store resilience for tags** — `onRehydrateStorage` now ensures every task has a `tags: string[]` (old v1.2 payloads get backfilled to `[]`).

### Added (v1.2)
- ⌘K **Command palette** — fuzzy-searchable access to every action (timer controls, phase switches, focus-duration presets, theme toggle, navigation, export, settings). Opens with ⌘K / Ctrl+K or the toolbar button.
- 📊 **Insights panel** — surface your peak focus hour, most productive day of week, 7-day trend vs previous week, average session length, time-of-day distribution (morning/afternoon/evening/night), and estimate accuracy. Includes a friendly empty state.
- 🤝 **Community CTA section** — stat strip (100% local / 0 trackers / MIT / ∞ your data), three ways to contribute (star, PR, discussion), and a gradient final-CTA card.
- 🧭 **"Community" nav link** added to header (desktop + mobile).
- 🛡️ **Crash-resilient store** — defensive `onRehydrateStorage` guards against corrupted/partial localStorage (validates arrays, deep-merges settings, reconstructs runtime, force-resets running state on load).
- 🛡️ **Error boundary** — top-level React error boundary with calm recovery screen + "Reset local data" button (no telemetry).

### Added (v1.1)
- 🎵 **Ambient soundscape player** — six procedurally-synthesized ambient sounds (rain, ocean waves, white noise, brown noise, cafe murmur, forest birds) via the Web Audio API. Zero audio files, zero network. Popover with volume slider and live indicator.
- 🎯 **Daily focus goal** with a live animated progress ring, quick presets (1h/1.5h/2h/3h/4h), and a celebratory toast when the goal is reached.
- ⚡ **Quick-start presets** on the timer (15/25/50/90 min) for one-tap focus sessions.
- 📖 **"How it works" section** — three-step onboarding (Start a tide → Link a task → Watch it compound) with connecting timeline.
- ✨ **Timer visual polish** — animated outer glow that intensifies while running, 60 rotating tick marks, SVG glow filter on the progress ring.

### Planned (v1.1 remaining)
- Calendar heatmap (GitHub-style, full year)
- PWA install + offline shell
- Tags & per-tag analytics

## [1.0.0] — 2026-07-08

### Added
- 🌊 Adaptive Pomodoro timer with focus / short-break / long-break phases and wall-clock accuracy.
- ⌨️ Full keyboard control (`Space`, `R`, `S`, `1`/`2`/`3`, `N`, `?`) with a shortcuts overlay.
- 📋 Task list with pomodoro estimates, drag-to-reorder, link a task to the active tide, notes.
- 📊 Deep-work analytics: 14-day daily focus bars, cumulative focus area chart, hour-of-day histogram, phase donut, recent session log.
- 🔥 Streak tracking: current & longest streak, 35-day activity heatmap, weekly count.
- 🎨 Themeable: light / dark / system + 5 accent presets (Tide, Emerald, Violet, Amber, Rose) via runtime CSS variables.
- 🔔 Optional browser notifications and Web-Audio synthesized chimes (no audio files).
- 📤 Data portability: JSON backup, CSV sessions export, Markdown report, JSON import, one-click clear.
- ⏱️ Live countdown in the browser tab title.
- 🔒 Local-first architecture: zero outbound network requests after first load, no accounts, no telemetry, no cookies.
- 📖 Comprehensive OSS scaffolding: README, CONTRIBUTING, CODE_OF_CONDUCT, SECURITY, issue/PR templates, CI.

### Technical
- Built with Next.js 16 (App Router), TypeScript 5, Tailwind CSS 4, shadcn/ui, Recharts, Framer Motion, Zustand.
- Timer engine stores an `endsAt` deadline and computes remaining time from `Date.now()` to survive tab throttling and sleep.
- State persisted to `localStorage` under the `focustide:v1` key.

[Unreleased]: https://github.com/Cryptoteep/focustide/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/Cryptoteep/focustide/releases/tag/v1.0.0
