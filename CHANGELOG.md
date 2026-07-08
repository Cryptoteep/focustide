# Changelog

All notable changes to FocusTide will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Planned (v1.1)
- Calendar heatmap (GitHub-style, full year)
- Ambient soundscape player (rain, waves, cafe)
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
