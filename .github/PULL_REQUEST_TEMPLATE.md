<!-- Thanks for contributing to FocusTide! 🌊 Please fill in the sections below. -->

## Summary

<!-- What does this PR do, and why? Reference the issue with `Closes #123` if applicable. -->

## Type of change

- [ ] 🐛 Bug fix (non-breaking change which fixes an issue)
- [ ] ✨ New feature (non-breaking change which adds functionality)
- [ ] 💥 Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] 📚 Documentation update
- [ ] 🎨 Styling / accessibility improvement
- [ ] ♻️ Refactor (no functional change)

## Privacy check

FocusTide's core promise is **zero outbound network requests after first load** and
**no telemetry, ever**. Please confirm:

- [ ] This change introduces **no** analytics, telemetry, or error-reporting SDKs.
- [ ] This change introduces **no** `fetch`/`XHR`/WebSocket to any external host.
- [ ] This change introduces **no** third-party scripts, fonts, or CDNs loaded at runtime.
- [ ] If this change requires network access, it is **opt-in, off by default**, and clearly disclosed.

## Checklist

- [ ] I read [CONTRIBUTING.md](../CONTRIBUTING.md) and followed the conventions.
- [ ] `bun run lint` passes locally.
- [ ] The golden path works: start a focus tide → complete it → confirm it shows in Analytics & the streak.
- [ ] All new interactive elements are keyboard accessible with visible focus rings.
- [ ] I used semantic Tailwind tokens (`bg-background`, `text-foreground`, `bg-brand`) instead of hard-coded colors.
- [ ] I did **not** introduce indigo or blue as a primary color.

## Notes for reviewers

<!-- Anything reviewers should pay attention to, tricky decisions, testing tips, etc. -->
