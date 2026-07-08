'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Target, Check, Trophy } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useFocusStore } from '@/lib/store';
import { formatMinutes, toDayKey } from '@/lib/stats';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const GOAL_PRESETS = [60, 90, 120, 180, 240];

export function DailyGoalCard() {
  const sessions = useFocusStore((s) => s.sessions);
  const settings = useFocusStore((s) => s.settings);
  const updateSettings = useFocusStore((s) => s.updateSettings);

  const todayMinutes = React.useMemo(() => {
    const today = toDayKey(Date.now());
    return sessions
      .filter((s) => s.phase === 'focus' && s.completed && toDayKey(s.endedAt) === today)
      .reduce((sum, s) => sum + s.durationMinutes, 0);
  }, [sessions]);

  const goal = settings.dailyGoalMinutes;
  const progress = Math.min(1, todayMinutes / goal);
  const pct = Math.round(progress * 100);
  const achieved = todayMinutes >= goal;

  // SVG ring
  const size = 120;
  const stroke = 10;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;

  const prevAchieved = React.useRef(false);
  React.useEffect(() => {
    if (achieved && !prevAchieved.current) {
      toast.success('Daily goal reached! 🎯', {
        description: `${formatMinutes(todayMinutes)} of deep work today. Tide well ridden.`,
      });
    }
    prevAchieved.current = achieved;
  }, [achieved, todayMinutes]);

  return (
    <Card className={cn('overflow-hidden border-border/60 transition-colors', achieved && 'border-brand/40')}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-semibold">Daily goal</CardTitle>
        <span className={cn('grid h-7 w-7 place-items-center rounded-lg', achieved ? 'bg-brand/15 text-brand' : 'bg-muted/50 text-muted-foreground')}>
          {achieved ? <Trophy className="h-3.5 w-3.5" /> : <Target className="h-3.5 w-3.5" />}
        </span>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          {/* progress ring */}
          <div className="relative grid place-items-center" style={{ width: size, height: size }}>
            <svg width={size} height={size} className="-rotate-90">
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
                stroke={achieved ? 'var(--chart-4)' : 'var(--brand)'}
                strokeWidth={stroke}
                strokeLinecap="round"
                strokeDasharray={c}
                initial={{ strokeDashoffset: c }}
                animate={{ strokeDashoffset: c * (1 - progress) }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-2xl font-bold tabular-nums">{pct}%</span>
              <span className="text-[10px] text-muted-foreground">{formatMinutes(todayMinutes)}</span>
            </div>
          </div>

          <div className="flex-1">
            <div className="text-sm font-medium">
              {achieved ? (
                <span className="flex items-center gap-1.5 text-brand">
                  <Check className="h-4 w-4" /> Goal reached!
                </span>
              ) : (
                <>
                  {formatMinutes(Math.max(0, goal - todayMinutes))} to go
                </>
              )}
            </div>
            <div className="mt-0.5 text-xs text-muted-foreground">
              of {formatMinutes(goal)} goal
            </div>

            <div className="mt-3 flex flex-wrap gap-1">
              {GOAL_PRESETS.map((g) => (
                <button
                  key={g}
                  onClick={() => updateSettings({ dailyGoalMinutes: g })}
                  className={cn(
                    'rounded-full px-2 py-0.5 text-[11px] font-medium transition-colors',
                    goal === g
                      ? 'bg-brand text-brand-foreground'
                      : 'bg-muted/60 text-muted-foreground hover:bg-accent',
                  )}
                >
                  {formatMinutes(g)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
