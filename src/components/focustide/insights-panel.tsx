'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Clock, Calendar, TrendingUp, Sparkles, Sunrise, Sun, Sunset, Moon, Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useFocusStore } from '@/lib/store';
import { hourHistogram, formatMinutes } from '@/lib/stats';

export function InsightsPanel() {
  const sessions = useFocusStore((s) => s.sessions);
  const tasks = useFocusStore((s) => s.tasks);

  const insights = React.useMemo(() => {
    const focusSessions = sessions.filter((s) => s.phase === 'focus' && s.completed);
    const totalMin = focusSessions.reduce((sum, s) => sum + s.durationMinutes, 0);

    // peak hour
    const hours = hourHistogram(sessions);
    const peakHourEntry = hours.reduce((best, h) => (h.sessions > best.sessions ? h : best), { hour: 0, sessions: 0 });
    const peakHour = peakHourEntry.sessions > 0 ? peakHourEntry.hour : null;

    // best day of week
    const dayCounts = Array.from({ length: 7 }, (_, i) => ({ day: i, minutes: 0, sessions: 0 }));
    for (const s of focusSessions) {
      const d = new Date(s.endedAt).getDay();
      dayCounts[d].minutes += s.durationMinutes;
      dayCounts[d].sessions += 1;
    }
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const bestDay = dayCounts.reduce((best, d) => (d.minutes > best.minutes ? d : best), { day: 0, minutes: 0, sessions: 0 });
    const bestDayName = bestDay.minutes > 0 ? dayNames[bestDay.day] : null;

    // 7-day trend vs previous 7-day
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const last7Start = today.getTime() - 7 * 86400000;
    const prev7Start = today.getTime() - 14 * 86400000;
    const last7 = focusSessions.filter((s) => s.endedAt >= last7Start).reduce((sum, s) => sum + s.durationMinutes, 0);
    const prev7 = focusSessions.filter((s) => s.endedAt >= prev7Start && s.endedAt < last7Start).reduce((sum, s) => sum + s.durationMinutes, 0);
    const trendPct = prev7 > 0 ? Math.round(((last7 - prev7) / prev7) * 100) : last7 > 0 ? 100 : 0;

    // avg session length
    const avgMin = focusSessions.length > 0 ? Math.round(totalMin / focusSessions.length) : 0;

    // completion rate of tasks
    const completedTasks = tasks.filter((t) => t.done).length;
    const totalEstimated = tasks.reduce((sum, t) => sum + t.estimatedPomodoros, 0);
    const totalCompleted = tasks.reduce((sum, t) => sum + t.completedPomodoros, 0);
    const estimateAccuracy = totalEstimated > 0 ? Math.round((totalCompleted / totalEstimated) * 100) : null;

    // time-of-day distribution
    const morning = focusSessions.filter((s) => { const h = new Date(s.endedAt).getHours(); return h >= 5 && h < 12; }).reduce((sum, s) => sum + s.durationMinutes, 0);
    const afternoon = focusSessions.filter((s) => { const h = new Date(s.endedAt).getHours(); return h >= 12 && h < 18; }).reduce((sum, s) => sum + s.durationMinutes, 0);
    const evening = focusSessions.filter((s) => { const h = new Date(s.endedAt).getHours(); return h >= 18 && h < 23; }).reduce((sum, s) => sum + s.durationMinutes, 0);
    const night = focusSessions.filter((s) => { const h = new Date(s.endedAt).getHours(); return h >= 23 || h < 5; }).reduce((sum, s) => sum + s.durationMinutes, 0);
    const maxSlot = Math.max(morning, afternoon, evening, night, 1);

    return {
      peakHour,
      bestDayName,
      trendPct,
      last7,
      prev7,
      avgMin,
      completedTasks,
      totalCompleted,
      totalEstimated,
      estimateAccuracy,
      totalMin,
      totalSessions: focusSessions.length,
      slots: { morning, afternoon, evening, night },
      maxSlot,
    };
  }, [sessions, tasks]);

  const hasData = insights.totalSessions > 0;

  if (!hasData) {
    return (
      <Card className="border-border/60">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold">
            <Sparkles className="h-4 w-4 text-brand" /> Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center gap-2 py-8 text-center">
            <div className="grid h-12 w-12 place-items-center rounded-full bg-brand/10 text-brand text-xl">✨</div>
            <div className="text-sm font-medium">No insights yet</div>
            <div className="max-w-xs text-xs text-muted-foreground">
              Complete a few focus tides and FocusTide will surface your peak hours, best days and trends here.
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const hourLabel = (h: number | null) => {
    if (h === null) return '—';
    if (h < 5) return `${String(h).padStart(2, '0')}:00 (night)`;
    if (h < 12) return `${String(h).padStart(2, '0')}:00 (morning)`;
    if (h < 18) return `${String(h).padStart(2, '0')}:00 (afternoon)`;
    return `${String(h).padStart(2, '0')}:00 (evening)`;
  };

  return (
    <Card className="border-border/60">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm font-semibold">
          <Sparkles className="h-4 w-4 text-brand" /> Insights
          <span className="ml-auto text-xs font-normal text-muted-foreground">from {insights.totalSessions} sessions</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* top stats */}
        <div className="grid grid-cols-2 gap-3">
          <InsightStat
            icon={Clock}
            label="Peak focus hour"
            value={insights.peakHour !== null ? `${String(insights.peakHour).padStart(2, '0')}:00` : '—'}
            sub={hourLabel(insights.peakHour).split('(')[1]?.replace(')', '') || 'record more sessions'}
            color="var(--brand)"
          />
          <InsightStat
            icon={Calendar}
            label="Most productive day"
            value={insights.bestDayName ?? '—'}
            sub={insights.bestDayName ? 'your deep-work sweet spot' : 'need more data'}
            color="var(--chart-3)"
          />
          <InsightStat
            icon={TrendingUp}
            label="7-day trend"
            value={`${insights.trendPct >= 0 ? '+' : ''}${insights.trendPct}%`}
            sub={`vs previous week`}
            color={insights.trendPct >= 0 ? 'var(--chart-4)' : 'var(--destructive)'}
          />
          <InsightStat
            icon={Award}
            label="Avg session"
            value={formatMinutes(insights.avgMin)}
            sub="per focus tide"
            color="var(--chart-2)"
          />
        </div>

        {/* time-of-day distribution */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Focus by time of day</span>
            <span className="text-xs text-muted-foreground">{formatMinutes(insights.totalMin)} total</span>
          </div>
          <div className="space-y-1.5">
            <TimeSlotBar icon={Sunrise} label="Morning" sub="5–12" minutes={insights.slots.morning} max={insights.maxSlot} color="var(--chart-4)" />
            <TimeSlotBar icon={Sun} label="Afternoon" sub="12–18" minutes={insights.slots.afternoon} max={insights.maxSlot} color="var(--brand)" />
            <TimeSlotBar icon={Sunset} label="Evening" sub="18–23" minutes={insights.slots.evening} max={insights.maxSlot} color="var(--chart-2)" />
            <TimeSlotBar icon={Moon} label="Night" sub="23–5" minutes={insights.slots.night} max={insights.maxSlot} color="var(--chart-3)" />
          </div>
        </div>

        {/* estimate accuracy */}
        {insights.estimateAccuracy !== null && (
          <div className="rounded-xl border border-border/60 bg-muted/30 p-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium">Estimate accuracy</span>
              <span className="tabular-nums text-muted-foreground">
                {insights.totalCompleted}/{insights.totalEstimated} pomodoros
              </span>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: 'var(--brand)' }}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, insights.estimateAccuracy)}%` }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                />
              </div>
              <span className="w-10 text-right text-xs font-medium tabular-nums">{insights.estimateAccuracy}%</span>
            </div>
            <p className="mt-1.5 text-[11px] text-muted-foreground">
              {insights.estimateAccuracy >= 100
                ? 'You\'re shipping faster than you estimate. 🎉'
                : insights.estimateAccuracy >= 70
                  ? 'Your estimates are on track.'
                  : 'Tasks tend to take longer than estimated — try smaller tides.'}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function InsightStat({
  icon: Icon,
  label,
  value,
  sub,
  color,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  sub: string;
  color: string;
}) {
  return (
    <div className="rounded-xl border border-border/60 bg-card/40 p-3">
      <div className="flex items-center gap-1.5">
        <Icon className="h-3 w-3" style={{ color }} />
        <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">{label}</span>
      </div>
      <div className="mt-1 text-xl font-bold tabular-nums">{value}</div>
      <div className="text-[10px] text-muted-foreground">{sub}</div>
    </div>
  );
}

function TimeSlotBar({
  icon: Icon,
  label,
  sub,
  minutes,
  max,
  color,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  sub: string;
  minutes: number;
  max: number;
  color: string;
}) {
  const pct = max > 0 ? Math.round((minutes / max) * 100) : 0;
  return (
    <div className="flex items-center gap-2">
      <Icon className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
      <div className="w-20 shrink-0">
        <div className="text-xs font-medium">{label}</div>
        <div className="text-[10px] text-muted-foreground">{sub}</div>
      </div>
      <div className="h-5 flex-1 overflow-hidden rounded-md bg-muted/50">
        <motion.div
          className="flex h-full items-center justify-end rounded-md px-1.5"
          style={{ background: color, width: `${Math.max(8, pct)}%`, minWidth: minutes > 0 ? '2rem' : 0 }}
          initial={{ width: 0 }}
          animate={{ width: `${Math.max(8, pct)}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          {minutes > 0 && (
            <span className="truncate text-[10px] font-medium text-background">{formatMinutes(minutes)}</span>
          )}
        </motion.div>
      </div>
    </div>
  );
}
