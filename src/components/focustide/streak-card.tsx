'use client';

import * as React from 'react';
import { Flame } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useFocusStore } from '@/lib/store';
import { computeStreak, toDayKey } from '@/lib/stats';
import { cn } from '@/lib/utils';

export function StreakCard() {
  const sessions = useFocusStore((s) => s.sessions);
  const streak = React.useMemo(() => computeStreak(sessions), [sessions]);

  // last 35 days mini heatmap
  const days = React.useMemo(() => {
    const set = new Set(streak.activeDays);
    const out: { key: string; active: boolean; date: Date; intensity: number }[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    for (let i = 34; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const key = toDayKey(d.getTime());
      const active = set.has(key);
      // intensity = number of sessions that day
      const count = sessions.filter(
        (s) => s.phase === 'focus' && s.completed && toDayKey(s.endedAt) === key,
      ).length;
      out.push({ key, active, date: d, intensity: count });
    }
    return out;
  }, [streak.activeDays, sessions]);

  function intensityClass(count: number) {
    if (count === 0) return 'bg-muted/40';
    if (count <= 1) return 'bg-brand/30';
    if (count <= 3) return 'bg-brand/55';
    if (count <= 5) return 'bg-brand/80';
    return 'bg-brand';
  }

  return (
    <Card className="overflow-hidden border-border/60">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-sm font-semibold">Streak</CardTitle>
        <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2 py-0.5 text-xs font-medium text-amber-600 dark:text-amber-400">
          <Flame className="h-3 w-3" /> {streak.current}d
        </span>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-muted/40 p-3">
            <div className="text-xs text-muted-foreground">Current</div>
            <div className="text-2xl font-bold tabular-nums">{streak.current}<span className="ml-1 text-sm font-normal text-muted-foreground">days</span></div>
          </div>
          <div className="rounded-xl bg-muted/40 p-3">
            <div className="text-xs text-muted-foreground">Longest</div>
            <div className="text-2xl font-bold tabular-nums">{streak.longest}<span className="ml-1 text-sm font-normal text-muted-foreground">days</span></div>
          </div>
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between text-[11px] text-muted-foreground">
            <span>Last 35 days</span>
            <span>{streak.thisWeek} this week</span>
          </div>
          <div className="grid grid-cols-7 gap-1">
            {days.map((d) => (
              <div
                key={d.key}
                title={`${d.date.toDateString()} · ${d.intensity} session${d.intensity === 1 ? '' : 's'}`}
                className={cn(
                  'aspect-square rounded-[3px] transition-colors',
                  intensityClass(d.intensity),
                )}
              />
            ))}
          </div>
          <div className="mt-2 flex items-center justify-end gap-1 text-[10px] text-muted-foreground">
            <span>Less</span>
            <span className="h-2.5 w-2.5 rounded-[3px] bg-muted/40" />
            <span className="h-2.5 w-2.5 rounded-[3px] bg-brand/30" />
            <span className="h-2.5 w-2.5 rounded-[3px] bg-brand/55" />
            <span className="h-2.5 w-2.5 rounded-[3px] bg-brand/80" />
            <span className="h-2.5 w-2.5 rounded-[3px] bg-brand" />
            <span>More</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
