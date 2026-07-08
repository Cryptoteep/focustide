'use client';

import { useEffect } from 'react';

/**
 * Registers the FocusTide service worker for offline/PWA support.
 * Only runs in production builds to avoid stale-cache issues during dev.
 * Privacy invariant: the SW makes no outbound requests beyond caching the
 * app's own static assets (see /public/sw.js).
 */
export function ServiceWorkerRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') return;
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;
    const onLoad = () => {
      navigator.serviceWorker.register('/sw.js').catch(() => {
        /* SW registration failed — app still works online */
      });
    };
    window.addEventListener('load', onLoad);
    return () => window.removeEventListener('load', onLoad);
  }, []);
  return null;
}
