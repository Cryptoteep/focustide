'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useFocusStore } from '@/lib/store';
import { toDayKey, formatMinutes } from '@/lib/stats';
import { cn } from '@/lib/utils';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAYS = ['Mon', 'Wed', 'Fri'];

interface DayCell {
  date: Date;
  key: string;
  minutes: number;
  sessions: number;
  inRange: boolean;
}

/** Build a 53-week × 7-day grid ending today (GitHub-style). */
function buildYearGrid(sessions: { endedAt: number; durationMinutes: number; phase: string; completed: boolean }[], endDate: Date): DayCell[][] {
  // aggregate minutes by day
  const byDay = new Map<string, { minutes: number; sessions: number }>();
  for (const s of sessions) {
    if (s.phase !== 'focus' || !s.completed) continue;
    const key = toDayKey(s.endedAt);
    const cur = byDay.get(key) || { minutes: 0, sessions: 0 };
    cur.minutes += s.durationMinutes;
    cur.sessions += 1;
    byDay.set(key, cur);
  }

  // grid starts on the Monday on/before (endDate - 52 weeks)
  const end = new Date(endDate);
  end.setHours(0, 0, 0, 0);
  // find Monday of current week (getDay: 0=Sun..6=Sat; Mon=1)
  const dow = end.getDay();
  const mondayOffset = dow === 0 ? -6 : 1 - dow;
  const monday = new Date(end);
  monday.setDate(end.getDate() + mondayOffset);

  // go back 52 weeks
  const start = new Date(monday);
  start.setDate(monday.getDate() - 52 * 7);

  const weeks: DayCell[][] = [];
  let cursor = new Date(start);
  for (let w = 0; w < 53; w++) {
    const week: DayCell[] = [];
    for (let d = 0; d < 7; d++) {
      const key = toDayKey(cursor.getTime());
      const data = byDay.get(key);
      const inRange = cursor.getTime() <= end.getTime();
      week.push({
        date: new Date(cursor),
        key,
        minutes: data?.minutes || 0,
        sessions: data?.sessions || 0,
        inRange,
      });
      cursor.setDate(cursor.getDate() + 1);
    }
    weeks.push(week);
  }
  return weeks;
}

function intensityClass(minutes: number): { bg: string; level: number } {
  if (minutes === 0) return { bg: 'bg-muted/40', level: 0 };
  if (minutes < 25) return { bg: 'bg-brand/25', level: 1 };
  if (minutes < 50) return { bg: 'bg-brand/45', level: 2 };
  if (minutes < 100) return { bg: 'bg-brand/70', level: 3 };
  return { bg: 'bg-brand', level: 4 };
}

export function CalendarHeatmap() {
  const sessions = useFocusStore((s) => s.sessions);
  const [viewDate, setViewDate] = React.useState(() => new Date());
  const [hovered, setHovered] = React.useState<DayCell | null>(null);

  const weeks = React.useMemo(() => buildYearGrid(sessions, viewDate), [sessions, viewDate]);

  // month labels: show month name at the first week where that month starts
  const monthLabels = React.useMemo(() => {
    const labels: (string | null)[] = [];
    let lastMonth = -1;
    for (const week of weeks) {
      const firstDay = week[0].date;
      const m = firstDay.getMonth();
      if (m !== lastMonth && firstDay.getDate() <= 7) {
        labels.push(MONTHS[m]);
        lastMonth = m;
      } else {
        labels.push(null);
      }
    }
    return labels;
  }, [weeks]);

  const totalMinutes = React.useMemo(
    () => weeks.flat().reduce((sum, d) => sum + d.minutes, 0),
    [weeks],
  );
  const activeDays = React.useMemo(
    () => weeks.flat().filter((d) => d.minutes > 0).length,
    [weeks],
  );

  const canGoForward = React.useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return viewDate < today;
  }, [viewDate]);

  function shift(weeks: number) {
    setViewDate((d) => {
      const next = new Date(d);
      next.setDate(next.getDate() + weeks * 7);
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      if (next > today) next.setTime(today.getTime());
      return next;
    });
  }

  return (
    <Card className="border-border/60">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <div>
          <CardTitle className="flex items-center gap-2 text-sm font-semibold">
            <Calendar className="h-4 w-4 text-brand" /> Focus calendar
          </CardTitle>
          <p className="mt-1 text-xs text-muted-foreground">
            {activeDays} active day{activeDays === 1 ? '' : 's'} · {formatMinutes(totalMinutes)} focused
          </p>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => shift(-4)} aria-label="Previous months">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => shift(4)} disabled={!canGoForward} aria-label="Next months">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto ft-scroll pb-2">
          <div className="inline-block min-w-full">
            {/* month labels */}
            <div className="ml-7 flex gap-[3px] text-[10px] text-muted-foreground">
              {monthLabels.map((m, i) => (
                <div key={i} className="w-[13px] text-left">
                  {m && <span className="whitespace-nowrap">{m}</span>}
                </div>
              ))}
            </div>
            {/* grid + day labels */}
            <div className="flex gap-[3px]">
              {/* day labels */}
              <div className="flex w-7 flex-col gap-[3px] pt-[1px] text-[10px] text-muted-foreground">
                {weeks[0].map((_, di) => (
                  <div key={di} className="h-[13px] leading-[13px]">
                    {di === 0 ? DAYS[0] : di === 2 ? DAYS[1] : di === 4 ? DAYS[2] : ''}
                  </div>
                ))}
              </div>
              {/* weeks */}
              <div className="flex gap-[3px]">
                {weeks.map((week, wi) => (
                  <div key={wi} className="flex flex-col gap-[3px]">
                    {week.map((day) => {
                      const { bg, level } = intensityClass(day.minutes);
                      return (
                        <motion.div
                          key={day.key}
                          whileHover={{ scale: 1.4 }}
                          onHoverStart={() => setHovered(day)}
                          onHoverEnd={() => setHovered(null)}
                          className={cn(
                            'h-[13px] w-[13px] rounded-[2px] transition-colors',
                            !day.inRange && 'opacity-30',
                            day.inRange && bg,
                          )}
                          style={level === 4 ? { background: 'var(--brand)' } : undefined}
                          title={`${day.date.toDateString()} · ${day.minutes} min · ${day.sessions} session${day.sessions === 1 ? '' : 's'}`}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* legend + hover detail */}
        <div className="mt-4 flex items-center justify-between">
          <div className="text-xs text-muted-foreground">
            {hovered && hovered.inRange ? (
              <span>
                <span className="font-medium text-foreground">{hovered.date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                {' · '}
                {hovered.minutes > 0 ? `${formatMinutes(hovered.minutes)} · ${hovered.sessions} session${hovered.sessions === 1 ? '' : 's'}` : 'No focus'}
              </span>
            ) : (
              <span>Hover a day for details</span>
            )}
          </div>
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <span>Less</span>
            <span className="h-[11px] w-[11px] rounded-[2px] bg-muted/40" />
            <span className="h-[11px] w-[11px] rounded-[2px] bg-brand/25" />
            <span className="h-[11px] w-[11px] rounded-[2px] bg-brand/45" />
            <span className="h-[11px] w-[11px] rounded-[2px] bg-brand/70" />
            <span className="h-[11px] w-[11px] rounded-[2px] bg-brand" />
            <span>More</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
