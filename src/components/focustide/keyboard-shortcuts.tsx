'use client';

import * as React from 'react';
import { useFocusStore } from '@/lib/store';
import { toast } from 'sonner';

const SHORTCUTS = [
  { key: 'Space', action: 'Start / pause timer' },
  { key: 'R', action: 'Reset current phase' },
  { key: 'S', action: 'Skip to next phase' },
  { key: '1 / 2 / 3', action: 'Switch to Focus / Short / Long break' },
  { key: 'N', action: 'Focus the new-task input' },
  { key: '?', action: 'Show this shortcuts overlay' },
] as const;

export function KeyboardShortcuts() {
  const start = useFocusStore((s) => s.startTimer);
  const pause = useFocusStore((s) => s.pauseTimer);
  const reset = useFocusStore((s) => s.resetTimer);
  const skip = useFocusStore((s) => s.skipPhase);
  const setPhase = useFocusStore((s) => s.setPhase);
  const [showHelp, setShowHelp] = React.useState(false);

  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null;
      const typing =
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable ||
          target.getAttribute('role') === 'slider');

      if (typing) {
        if (e.key === 'Escape' && target instanceof HTMLElement) target.blur();
        return;
      }

      switch (e.key) {
        case ' ':
        case 'Spacebar': {
          e.preventDefault();
          const st = useFocusStore.getState();
          if (st.runtime.running) pause();
          else start();
          break;
        }
        case 'r':
        case 'R':
          e.preventDefault();
          reset();
          toast.info('Phase reset');
          break;
        case 's':
        case 'S':
          e.preventDefault();
          skip();
          toast.info('Skipped to next phase');
          break;
        case '1':
          e.preventDefault();
          setPhase('focus');
          break;
        case '2':
          e.preventDefault();
          setPhase('short-break');
          break;
        case '3':
          e.preventDefault();
          setPhase('long-break');
          break;
        case '?':
          e.preventDefault();
          setShowHelp((v) => !v);
          break;
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [start, pause, reset, skip, setPhase]);

  if (!showHelp) return null;

  return (
    <div
      className="fixed inset-0 z-[100] grid place-items-center bg-background/70 p-4 backdrop-blur-sm"
      onClick={() => setShowHelp(false)}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-border/60 bg-card p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-base font-semibold">Keyboard shortcuts</h3>
          <button
            className="text-xs text-muted-foreground hover:text-foreground"
            onClick={() => setShowHelp(false)}
          >
            Close (esc)
          </button>
        </div>
        <ul className="space-y-2">
          {SHORTCUTS.map((s) => (
            <li key={s.key} className="flex items-center justify-between gap-3">
              <span className="text-sm text-muted-foreground">{s.action}</span>
              <kbd className="rounded-md border border-border/70 bg-muted/60 px-2 py-0.5 font-mono text-xs">
                {s.key}
              </kbd>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-xs text-muted-foreground">
          Tip: press <kbd className="rounded border border-border/70 bg-muted/60 px-1 font-mono">?</kbd> anywhere to open this again.
        </p>
      </div>
    </div>
  );
}
