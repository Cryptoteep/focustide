'use client';

import * as React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useFocusStore } from '@/lib/store';
import { aggregateByDay, aggregateByPhase, hourHistogram, formatMinutes } from '@/lib/stats';
import { InsightsPanel } from './insights-panel';
import { CalendarHeatmap } from './calendar-heatmap';

const PHASE_COLORS: Record<string, string> = {
  focus: 'var(--brand)',
  'short-break': 'var(--chart-2)',
  'long-break': 'var(--chart-3)',
};

export function Analytics() {
  const sessions = useFocusStore((s) => s.sessions);

  const daily14 = React.useMemo(() => aggregateByDay(sessions, 14), [sessions]);
  const phaseBreakdown = React.useMemo(() => aggregateByPhase(sessions), [sessions]);
  const hours = React.useMemo(() => hourHistogram(sessions), [sessions]);

  const cumulative = React.useMemo(() => {
    return daily14.reduce<Array<{ day: string; total: number; today: number }>>((list, d) => {
      const prev = list.length > 0 ? list[list.length - 1].total : 0;
      list.push({ day: d.day.slice(5), total: Math.round(prev + d.focusMinutes), today: d.focusMinutes });
      return list;
    }, []);
  }, [daily14]);

  const hourData = hours.map((h) => ({ hour: `${h.hour}:00`, sessions: h.sessions }));
  const peakHour = hours.reduce((best, h) => (h.sessions > best.sessions ? h : best), { hour: 0, sessions: 0 });

  const hasData = sessions.some((s) => s.completed);

  if (!hasData) {
    return (
      <div className="flex h-full min-h-[300px] flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border/70 text-center">
        <div className="grid h-12 w-12 place-items-center rounded-full bg-brand/10 text-brand text-xl">📊</div>
        <div className="text-sm font-medium">No analytics yet</div>
        <div className="max-w-xs text-xs text-muted-foreground">
          Complete your first focus tide and your deep-work charts will appear here.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="border-border/60">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Daily focus · last 14 days</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={daily14.map((d) => ({ day: d.day.slice(5), minutes: d.focusMinutes }))} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="color-mix(in oklch, var(--foreground) 10%, transparent)" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 10 }} stroke="var(--muted-foreground)" tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 10 }} stroke="var(--muted-foreground)" tickLine={false} axisLine={false} width={32} />
                <Tooltip
                  contentStyle={{
                    background: 'var(--card)',
                    border: '1px solid var(--border)',
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                  formatter={(v: number) => [`${v} min`, 'Focus']}
                  cursor={{ fill: 'color-mix(in oklch, var(--brand) 12%, transparent)' }}
                />
                <Bar dataKey="minutes" fill="var(--brand)" radius={[4, 4, 0, 0]} maxBarSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Cumulative focus</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={cumulative} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
                <defs>
                  <linearGradient id="ft-area" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--brand)" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="var(--brand)" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="color-mix(in oklch, var(--foreground) 10%, transparent)" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 10 }} stroke="var(--muted-foreground)" tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 10 }} stroke="var(--muted-foreground)" tickLine={false} axisLine={false} width={32} />
                <Tooltip
                  contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, fontSize: 12 }}
                  formatter={(v: number) => [`${formatMinutes(v)}`, 'Cumulative']}
                />
                <Area type="monotone" dataKey="total" stroke="var(--brand)" strokeWidth={2} fill="url(#ft-area)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="border-border/60">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">When you focus</CardTitle>
            <p className="text-xs text-muted-foreground">
              Peak hour: <span className="font-medium text-foreground">{peakHour.sessions > 0 ? `${String(peakHour.hour).padStart(2, '0')}:00` : '—'}</span>
            </p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={hourData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="color-mix(in oklch, var(--foreground) 10%, transparent)" vertical={false} />
                <XAxis dataKey="hour" tick={{ fontSize: 9 }} stroke="var(--muted-foreground)" tickLine={false} axisLine={false} interval={2} />
                <YAxis tick={{ fontSize: 10 }} stroke="var(--muted-foreground)" tickLine={false} axisLine={false} width={28} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, fontSize: 12 }}
                  formatter={(v: number) => [`${v} session${v === 1 ? '' : 's'}`, 'Focus']}
                  cursor={{ fill: 'color-mix(in oklch, var(--brand) 12%, transparent)' }}
                />
                <Bar dataKey="sessions" fill="var(--chart-3)" radius={[3, 3, 0, 0]} maxBarSize={16} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Phase breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={phaseBreakdown}
                  dataKey="minutes"
                  nameKey="label"
                  cx="50%"
                  cy="50%"
                  innerRadius={42}
                  outerRadius={70}
                  paddingAngle={2}
                  stroke="var(--card)"
                  strokeWidth={2}
                >
                  {phaseBreakdown.map((entry) => (
                    <Cell key={entry.phase} fill={PHASE_COLORS[entry.phase]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, fontSize: 12 }}
                  formatter={(v: number, _n, p) => [`${formatMinutes(v)} · ${(p?.payload as { sessions?: number })?.sessions ?? 0} sessions`, p?.payload?.label ?? '']}
                />
                <Legend
                  iconType="circle"
                  wrapperStyle={{ fontSize: 11 }}
                  formatter={(value) => <span className="text-muted-foreground">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <InsightsPanel />

      <CalendarHeatmap />

      <SessionLog />
    </div>
  );
}

function SessionLog() {
  const sessions = useFocusStore((s) => s.sessions);
  const recent = React.useMemo(
    () => [...sessions].reverse().slice(0, 12),
    [sessions],
  );

  if (recent.length === 0) return null;

  return (
    <Card className="border-border/60">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold">Recent sessions</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="max-h-72 space-y-1.5 overflow-y-auto ft-scroll pr-1">
          {recent.map((s) => (
            <li
              key={s.id}
              className="flex items-center justify-between gap-2 rounded-lg border border-border/40 bg-card/40 px-3 py-2 text-xs"
            >
              <span className="flex items-center gap-2">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ background: PHASE_COLORS[s.phase] }}
                />
                <span className="font-medium">
                  {s.phase === 'focus' ? 'Focus' : s.phase === 'short-break' ? 'Short break' : 'Long break'}
                </span>
                {s.taskTitle && (
                  <span className="truncate text-muted-foreground">· {s.taskTitle}</span>
                )}
              </span>
              <span className="shrink-0 tabular-nums text-muted-foreground">
                {formatMinutes(s.durationMinutes)} · {new Date(s.endedAt).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
