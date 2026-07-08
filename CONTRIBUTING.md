# Contributing to FocusTide

First off — thank you for caring enough to contribute. 🌊 FocusTide is a
community-maintained, non-commercial project, and every contribution matters.

This document explains how to get set up, the conventions we follow, and what a
good pull request looks like.

## Code of Conduct

Participation in this project is governed by the [Code of Conduct](./CODE_OF_CONDUCT.md).
Please be excellent to each other.

## Quick start

```bash
git clone https://github.com/Cryptoteep/focustide.git
cd focustide
bun install        # or: npm install / pnpm install / yarn
bun run dev        # http://localhost:3000
```

Requirements:

- Node.js 20+ **or** Bun 1.1+
- A modern browser
- No environment variables, no API keys, no database — there is no backend.

## Project layout

See the "Architecture" section in [README.md](./README.md). The short version:

- `src/lib/` — framework-agnostic logic (store, stats, export, sound, types)
- `src/hooks/` — React hooks (timer engine)
- `src/components/focustide/` — feature components
- `src/components/ui/` — shadcn/ui primitives (managed via `components.json`)

## How to contribute

### 🐛 Reporting bugs

Open a [bug report](https://github.com/Cryptoteep/focustide/issues/new?template=bug_report.yml).
Include:

- Steps to reproduce
- Expected vs. actual behavior
- Browser & OS
- Whether it reproduces in an incognito window (rules out extension interference)

Since FocusTide is local-first, a screenshot of your browser's network tab (showing no
outbound requests) is often helpful context.

### 💡 Suggesting features

Open a [feature request](https://github.com/Cryptoteep/focustide/issues/new?template=feature_request.yml).
Explain the use case, not just the solution. The maintainer team triages issues weekly.

### 🔧 Pull requests

1. **Open an issue first** for non-trivial changes — it avoids wasted work.
2. Fork the repo and create a branch: `git checkout -b feat/my-feature`.
3. Make your change. Keep PRs focused — one logical change per PR.
4. Run `bun run lint` and make sure it passes.
5. Write a clear PR description referencing the issue (e.g. `Closes #42`).
6. Be responsive to review feedback.

### Good first issues

Look for the [`good first issue`](https://github.com/Cryptoteep/focustide/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22)
label. These are scoped to be approachable for newcomers and come with hints from maintainers.

## Conventions

### TypeScript

- Strict mode is on. Avoid `any`; use `unknown` + narrowing when the shape is genuinely unknown.
- Prefer `type` for data shapes, `interface` for extendable contracts.
- No `// @ts-ignore` — fix the type or file an issue.

### Styling

- Tailwind CSS 4 + shadcn/ui (New York style). **Do not** introduce indigo or blue as a primary.
  FocusTide's brand palette is teal-first, runtime-swappable via the accent presets in `src/lib/sound.ts`.
- Use semantic tokens (`bg-background`, `text-foreground`, `bg-brand`) over hard-coded colors.
- Every interactive element must be keyboard accessible and have a visible focus ring.

### State

- Local UI state → React `useState` / `useReducer`.
- App data (tasks, sessions, settings, runtime) → the Zustand store in `src/lib/store.ts`,
  persisted to `localStorage` under the `focustide:v1` key.
- Server state → none (there is no server). Don't introduce one without a discussion issue.

### Timer accuracy

The timer is wall-clock based: it stores an `endsAt` deadline and computes remaining time
from `Date.now()`. Never replace this with a setInterval counter — background tabs throttle
timers and would drift. If you touch `src/hooks/use-timer-engine.ts`, preserve this invariant
and add a comment explaining why.

### Privacy invariant

FocusTide makes a hard promise: **zero outbound network requests after first load.**
Do not add analytics, telemetry, error-reporting SDKs, third-party fonts/CDNs, or any
`fetch` to an external host. PRs that violate this will be rejected. If a feature
genuinely needs the network (e.g. optional sync), it must be opt-in, off by default,
and clearly disclosed.

### Commits

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat(timer): add long-break interval setting
fix(analytics): correct streak calculation across month boundary
docs(readme): clarify local-first promise
chore(deps): bump recharts to 2.16
```

Squash-merging is the default; you don't need to rebase feature branches.

## Accessibility

Accessibility is a first-class concern, not a polish step. Before opening a PR:

- Can you complete your feature with the keyboard alone?
- Does every interactive element have an accessible name (`aria-label` or visible text)?
- Does the focus ring show up clearly in both light and dark themes?
- Do color contrasts meet WCAG AA?

## Testing

FocusTide doesn't ship a unit test suite yet (it's on the roadmap). For now, please
manually verify the golden path: start a focus tide → let it complete (or shorten the
duration in Settings) → confirm the session appears in Analytics and the streak updates.

## Releasing

Releases are cut by maintainers. The process is documented in the maintainers' guide;
contributors don't need to worry about it. The changelog lives in [CHANGELOG.md](./CHANGELOG.md).

## Questions?

Open a [discussion](https://github.com/Cryptoteep/focustide/discussions). We're friendly.
