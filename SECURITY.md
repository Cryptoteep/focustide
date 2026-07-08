# Security Policy

FocusTide is a **local-first, client-only** application. By design it makes **no
outbound network requests** after the initial page load and stores all data in
your browser's `localStorage`. This document explains what that means for
security and how to report issues.

## Supported versions

FocusTide is pre-1.x and ships continuous fixes on `main`. We maintain only the
latest release line.

| Version | Supported |
| ------- | --------- |
| latest `main` / latest tag | ✅ |
| older tags | ❌ |

## Threat model

- **No backend.** There is no server to compromise. The app is a static bundle.
- **No telemetry.** No analytics SDKs, no error reporting, no third-party scripts at runtime.
- **No accounts.** There is no authentication surface.
- **Local data.** Tasks, sessions and settings live in `localStorage` on your device.
  Anyone with access to your browser profile can read or clear them. Use your OS's
  account security accordingly, and export backups regularly.
- **Cross-origin.** The deployed app is served from a single origin. Do not embed
  FocusTide in an `<iframe>` on an untrusted site — `localStorage` would be scoped
  to that origin and the app would still work, but you'd be trusting the host page.

## Reporting a vulnerability

If you believe you've found a security issue, **please do not open a public issue**.

Email the maintainers at **focustide-maintainers@protonmail.com** with:

1. A description of the issue and its impact
2. Steps to reproduce (or a proof of concept)
3. Your assessment of severity

We aim to acknowledge reports within **72 hours** and to ship a fix or mitigation
within **14 days** for high-severity issues. Reporters of confirmed vulnerabilities
will be credited in the release notes (unless they prefer to remain anonymous).

## What is *not* a vulnerability

- The app reading from / writing to its own `localStorage` — that's the intended storage.
- The lack of authentication — there is nothing to authenticate against.
- Cross-origin embedding producing a working copy of the app on another domain —
  that's how static apps work and harms no one.

## Dependency policy

We keep dependencies as lean as possible and pin to known-good versions in
`bun.lock`. Security-relevant dependency bumps are treated as high priority.
