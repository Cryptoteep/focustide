import type { Session, StreakInfo } from './types';

export function toDayKey(ts: number): string {
  const d = new Date(ts);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function todayKey(): string {
  return toDayKey(Date.now());
}

/** Local date key shifted to start of day */
export function startOfDay(ts: number): number {
  const d = new Date(ts);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

export function dayDiff(a: number, b: number): number {
  return Math.round((startOfDay(b) - startOfDay(a)) / 86_400_000);
}

export function computeStreak(sessions: Session[]): StreakInfo {
  const focusSessions = sessions.filter((s) => s.phase === 'focus' && s.completed);
  const activeDays = Array.from(new Set(focusSessions.map((s) => toDayKey(s.endedAt)))).sort();
  const activeSet = new Set(activeDays);

  let current = 0;
  let longest = 0;
  if (activeDays.length > 0) {
    // current streak: count back from today
    let cursor = startOfDay(Date.now());
    // allow today to be empty but still count yesterday's streak as "current" only if today active OR today is the latest? We'll count today-back.
    // Standard: streak counts consecutive days ending today or yesterday.
    const today = toDayKey(Date.now());
    const yesterday = toDayKey(Date.now() - 86_400_000);
    if (activeSet.has(today) || activeSet.has(yesterday)) {
      // walk back
      let walk = activeSet.has(today) ? Date.now() : Date.now() - 86_400_000;
      while (activeSet.has(toDayKey(walk))) {
        current += 1;
        walk -= 86_400_000;
      }
    }
    // longest
    let run = 0;
    let prev: number | null = null;
    for (const key of activeDays) {
      const t = new Date(key + 'T00:00:00').getTime();
      if (prev !== null && dayDiff(prev, t) === 1) {
        run += 1;
      } else {
        run = 1;
      }
      longest = Math.max(longest, run);
      prev = t;
    }
    void cursor;
  }

  const totalFocusMinutes = focusSessions.reduce((sum, s) => sum + s.durationMinutes, 0);
  const thisWeekStart = startOfDay(Date.now() - 6 * 86_400_000);
  const thisWeek = focusSessions.filter((s) => s.endedAt >= thisWeekStart).length;

  return {
    current,
    longest,
    activeDays,
    thisWeek,
    totalFocusMinutes,
    totalSessions: focusSessions.length,
  };
}

export interface DailyAggregate {
  day: string; // YYYY-MM-DD
  focusMinutes: number;
  sessions: number;
}

export function aggregateByDay(sessions: Session[], days: number): DailyAggregate[] {
  const out: DailyAggregate[] = [];
  const today = startOfDay(Date.now());
  for (let i = days - 1; i >= 0; i--) {
    const dayStart = today - i * 86_400_000;
    const dayEnd = dayStart + 86_400_000;
    const dayKey = toDayKey(dayStart);
    const focusSessions = sessions.filter(
      (s) => s.phase === 'focus' && s.completed && s.endedAt >= dayStart && s.endedAt < dayEnd,
    );
    out.push({
      day: dayKey,
      focusMinutes: focusSessions.reduce((sum, s) => sum + s.durationMinutes, 0),
      sessions: focusSessions.length,
    });
  }
  return out;
}

export interface PhaseBreakdown {
  phase: 'focus' | 'short-break' | 'long-break';
  label: string;
  minutes: number;
  sessions: number;
}

export function aggregateByPhase(sessions: Session[]): PhaseBreakdown[] {
  const phases: Array<PhaseBreakdown['phase']> = ['focus', 'short-break', 'long-break'];
  return phases.map((phase) => {
    const list = sessions.filter((s) => s.phase === phase && s.completed);
    return {
      phase,
      label: phase === 'focus' ? 'Focus' : phase === 'short-break' ? 'Short break' : 'Long break',
      minutes: list.reduce((sum, s) => sum + s.durationMinutes, 0),
      sessions: list.length,
    };
  });
}

export function hourHistogram(sessions: Session[]): { hour: number; sessions: number }[] {
  const hours = Array.from({ length: 24 }, (_, h) => ({ hour: h, sessions: 0 }));
  for (const s of sessions) {
    if (s.phase !== 'focus' || !s.completed) continue;
    const h = new Date(s.endedAt).getHours();
    hours[h].sessions += 1;
  }
  return hours;
}

export function formatMinutes(min: number): string {
  if (min < 60) return `${Math.round(min)}m`;
  const h = Math.floor(min / 60);
  const m = Math.round(min % 60);
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
}

export function formatClock(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}
