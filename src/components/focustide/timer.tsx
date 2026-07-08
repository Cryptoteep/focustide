'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, SkipForward, Volume2, VolumeX, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useFocusStore } from '@/lib/store';
import { useLiveSeconds } from '@/hooks/use-timer-engine';
import { formatClock } from '@/lib/stats';
import { playSound, requestNotificationPermission } from '@/lib/sound';
import type { Phase } from '@/lib/types';
import { toast } from 'sonner';

const PHASE_META: Record<Phase, { label: string; emoji: string }> = {
  focus: { label: 'Focus', emoji: '🌊' },
  'short-break': { label: 'Short break', emoji: '☕' },
  'long-break': { label: 'Long break', emoji: '🛀' },
};

export function Timer() {
  const runtime = useFocusStore((s) => s.runtime);
  const settings = useFocusStore((s) => s.settings);
  const startTimer = useFocusStore((s) => s.startTimer);
  const pauseTimer = useFocusStore((s) => s.pauseTimer);
  const resetTimer = useFocusStore((s) => s.resetTimer);
  const skipPhase = useFocusStore((s) => s.skipPhase);
  const setPhase = useFocusStore((s) => s.setPhase);
  const tasks = useFocusStore((s) => s.tasks);

  const remaining = useLiveSeconds();
  const total = runtime.totalSeconds;
  const progress = total > 0 ? 1 - remaining / total : 0;

  const currentTask = tasks.find((t) => t.id === runtime.currentTaskId) || null;

  const isFocus = runtime.phase === 'focus';
  const ringColor = isFocus ? 'var(--focus)' : 'var(--break)';

  // SVG geometry
  const size = 280;
  const stroke = 14;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;

  const enableNotifications = React.useCallback(async () => {
    const perm = await requestNotificationPermission();
    if (perm === 'granted') {
      useFocusStore.getState().updateSettings({ notificationsEnabled: true });
      toast.success('Browser notifications enabled');
    } else {
      toast.error('Notification permission denied');
    }
  }, []);

  return (
    <div className="flex flex-col items-center">
      {/* Phase tabs */}
      <div className="mb-6 inline-flex rounded-full border border-border/60 bg-card/60 p-1 shadow-sm">
        {(['focus', 'short-break', 'long-break'] as Phase[]).map((p) => (
          <button
            key={p}
            onClick={() => setPhase(p)}
            className={cn(
              'rounded-full px-3 py-1.5 text-xs font-medium transition-colors sm:px-4 sm:text-sm',
              runtime.phase === p
                ? p === 'focus'
                  ? 'bg-brand text-brand-foreground shadow'
                  : 'bg-break text-background shadow'
                : 'text-muted-foreground hover:text-foreground',
            )}
            style={runtime.phase === p && p !== 'focus' ? { background: 'var(--break)', color: 'var(--background)' } : undefined}
          >
            <span className="mr-1">{PHASE_META[p].emoji}</span>
            {PHASE_META[p].label}
          </button>
        ))}
      </div>

      {/* Ring */}
      <div className="relative grid place-items-center" style={{ width: size, height: size }}>
        <div
          className="absolute inset-6 rounded-full opacity-40 blur-2xl transition-colors"
          style={{ background: ringColor }}
          aria-hidden
        />
        <svg width={size} height={size} className="-rotate-90">
          <defs>
            <linearGradient id="ft-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={ringColor} />
              <stop offset="100%" stopColor="var(--chart-2)" />
            </linearGradient>
          </defs>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="currentColor"
            strokeWidth={stroke}
            className="text-muted/25"
          />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="url(#ft-grad)"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={c}
            animate={{ strokeDashoffset: c * (1 - progress) }}
            transition={{ duration: 0.4, ease: 'linear' }}
          />
        </svg>

        <div className="absolute flex flex-col items-center">
          <span className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
            {PHASE_META[runtime.phase].label}
          </span>
          <span className="mt-1 font-mono text-6xl font-bold tabular-nums tracking-tight sm:text-7xl">
            {formatClock(remaining)}
          </span>
          <div className="mt-3 flex items-center gap-1.5">
            {Array.from({ length: settings.longBreakInterval }).map((_, i) => (
              <span
                key={i}
                className={cn(
                  'h-2 w-2 rounded-full transition-colors',
                  i < runtime.cycleCount % settings.longBreakInterval ||
                    (runtime.cycleCount > 0 && runtime.cycleCount % settings.longBreakInterval === 0)
                    ? 'bg-brand'
                    : 'bg-muted-foreground/30',
                )}
              />
            ))}
          </div>
          <span className="mt-2 text-xs text-muted-foreground">
            {runtime.cycleCount} session{runtime.cycleCount === 1 ? '' : 's'} completed today
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="mt-8 flex items-center gap-3">
        <Button variant="outline" size="icon" aria-label="Reset" onClick={resetTimer} className="h-11 w-11 rounded-full">
          <RotateCcw className="h-4 w-4" />
        </Button>

        <Button
          size="lg"
          onClick={() => {
            if (runtime.running) {
              pauseTimer();
            } else {
              startTimer();
            }
          }}
          className="h-16 w-16 rounded-full bg-brand text-brand-foreground shadow-lg shadow-brand/30 hover:bg-brand/90"
          aria-label={runtime.running ? 'Pause' : 'Start'}
        >
          {runtime.running ? <Pause className="h-6 w-6" /> : <Play className="ml-0.5 h-6 w-6" />}
        </Button>

        <Button variant="outline" size="icon" aria-label="Skip phase" onClick={skipPhase} className="h-11 w-11 rounded-full">
          <SkipForward className="h-4 w-4" />
        </Button>
      </div>

      {/* Current task + toggles */}
      <div className="mt-6 flex min-h-[2.5rem] items-center justify-center">
        <AnimatePresence mode="wait">
          {currentTask ? (
            <motion.div
              key={currentTask.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="text-center"
            >
              <div className="text-xs uppercase tracking-widest text-muted-foreground">Focusing on</div>
              <div className="text-sm font-medium">{currentTask.title}</div>
              <div className="text-xs text-muted-foreground">
                {currentTask.completedPomodoros}/{currentTask.estimatedPomodoros} pomodoros
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center text-sm text-muted-foreground"
            >
              Tip: pick a task below to link this tide →
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* sound / notification toggles */}
      <div className="mt-4 flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          className="gap-2 text-xs"
          onClick={() => {
            const next = !settings.soundEnabled;
            useFocusStore.getState().updateSettings({ soundEnabled: next });
            if (next) playSound('tick', settings.volume);
          }}
        >
          {settings.soundEnabled ? <Volume2 className="h-3.5 w-3.5 text-brand" /> : <VolumeX className="h-3.5 w-3.5" />}
          Sound
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="gap-2 text-xs"
          onClick={() => {
            if (!settings.notificationsEnabled) {
              void enableNotifications();
            } else {
              useFocusStore.getState().updateSettings({ notificationsEnabled: false });
              toast.info('Notifications disabled');
            }
          }}
        >
          <Bell className={cn('h-3.5 w-3.5', settings.notificationsEnabled && 'text-brand')} />
          Alerts
        </Button>
      </div>
    </div>
  );
}
