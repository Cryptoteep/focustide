'use client';

import * as React from 'react';
import { Flame, Timer, CheckCircle2, CalendarDays } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useFocusStore } from '@/lib/store';
import { computeStreak, formatMinutes } from '@/lib/stats';

export function StatsCards() {
  const sessions = useFocusStore((s) => s.sessions);
  const tasks = useFocusStore((s) => s.tasks);
  const streak = React.useMemo(() => computeStreak(sessions), [sessions]);
  const completedTasks = tasks.filter((t) => t.done).length;
  const today = new Date();
  const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  const todayMinutes = sessions
    .filter((s) => s.phase === 'focus' && s.completed)
    .filter((s) => {
      const d = new Date(s.endedAt);
      const k = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      return k === todayKey;
    })
    .reduce((sum, s) => sum + s.durationMinutes, 0);

  const cards = [
    {
      label: 'Today',
      value: formatMinutes(todayMinutes),
      icon: Timer,
      hint: `${sessions.filter((s) => s.phase === 'focus' && s.completed && new Date(s.endedAt).toDateString() === today.toDateString()).length} sessions`,
      color: 'var(--brand)',
    },
    {
      label: 'Current streak',
      value: `${streak.current}d`,
      icon: Flame,
      hint: `Longest: ${streak.longest}d`,
      color: 'var(--chart-5)',
    },
    {
      label: 'Total focus',
      value: formatMinutes(streak.totalFocusMinutes),
      icon: CalendarDays,
      hint: `${streak.totalSessions} sessions all-time`,
      color: 'var(--chart-3)',
    },
    {
      label: 'Tasks done',
      value: `${completedTasks}/${tasks.length}`,
      icon: CheckCircle2,
      hint: tasks.length === 0 ? 'Add your first task' : 'Keep shipping',
      color: 'var(--chart-4)',
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {cards.map((c) => (
        <Card key={c.label} className="overflow-hidden border-border/60">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {c.label}
              </span>
              <span
                className="grid h-7 w-7 place-items-center rounded-lg"
                style={{ background: `color-mix(in oklch, ${c.color} 14%, transparent)`, color: c.color }}
              >
                <c.icon className="h-3.5 w-3.5" />
              </span>
            </div>
            <div className="mt-2 text-2xl font-bold tabular-nums">{c.value}</div>
            <div className="mt-0.5 text-[11px] text-muted-foreground">{c.hint}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
