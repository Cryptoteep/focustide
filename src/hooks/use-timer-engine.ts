'use client';

import { useEffect, useRef, useState } from 'react';
import { useFocusStore } from '@/lib/store';
import { formatClock } from '@/lib/stats';

/**
 * Drives the running timer: recalculates remaining seconds from `endsAt`,
 * fires `completePhase` when it elapses, and keeps the document title in sync.
 * Mounted once at the app root.
 */
export function useTimerEngine() {
  useEffect(() => {
    const id = window.setInterval(() => {
      const st = useFocusStore.getState();
      if (st.runtime.running && st.runtime.endsAt && Date.now() >= st.runtime.endsAt) {
        st.completePhase();
      }
      if (st.settings.showSecondsInTitle) {
        if (st.runtime.running) {
          const remaining = st.runtime.endsAt
            ? Math.max(0, Math.round((st.runtime.endsAt - Date.now()) / 1000))
            : st.runtime.totalSeconds;
          const label =
            st.runtime.phase === 'focus'
              ? '🌊 Focus'
              : st.runtime.phase === 'long-break'
                ? '☕ Long break'
                : '☕ Break';
          document.title = `${formatClock(remaining)} · ${label} — FocusTide`;
        } else if (/^\d\d:\d\d · /.test(document.title)) {
          document.title = 'FocusTide — Privacy-first focus timer & deep-work analytics';
        }
      }
    }, 250);
    return () => window.clearInterval(id);
  }, []);

  // Re-validate on visibility change (handles long backgrounding)
  useEffect(() => {
    const onVis = () => {
      const st = useFocusStore.getState();
      if (st.runtime.running && st.runtime.endsAt && Date.now() >= st.runtime.endsAt) {
        st.completePhase();
      }
    };
    document.addEventListener('visibilitychange', onVis);
    window.addEventListener('focus', onVis);
    return () => {
      document.removeEventListener('visibilitychange', onVis);
      window.removeEventListener('focus', onVis);
    };
  }, []);

  return null;
}

/** Returns live remaining seconds for the current phase, re-rendering ~4x/sec while running. */
export function useLiveSeconds(): number {
  const running = useFocusStore((s) => s.runtime.running);
  const endsAt = useFocusStore((s) => s.runtime.endsAt);
  const totalSeconds = useFocusStore((s) => s.runtime.totalSeconds);
  const [, setTick] = useState(0);
  const lastRef = useRef(0);

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => {
      const st = useFocusStore.getState();
      const remaining = st.runtime.endsAt
        ? Math.max(0, Math.round((st.runtime.endsAt - Date.now()) / 1000))
        : st.runtime.totalSeconds;
      // Only re-render when the displayed second changes
      if (remaining !== lastRef.current) {
        lastRef.current = remaining;
        setTick((n) => n + 1);
      }
    }, 250);
    return () => window.clearInterval(id);
  }, [running]);

  if (running && endsAt) {
    return Math.max(0, Math.round((endsAt - Date.now()) / 1000));
  }
  return totalSeconds;
}
