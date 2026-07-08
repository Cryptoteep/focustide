'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Tags } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useFocusStore } from '@/lib/store';
import { formatMinutes } from '@/lib/stats';

const TAG_COLORS = [
  'var(--brand)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)',
  '#f97316',
  '#06b6d4',
  '#a855f7',
];

function tagColor(tag: string): string {
  let h = 0;
  for (let i = 0; i < tag.length; i++) h = (h * 31 + tag.charCodeAt(i)) >>> 0;
  return TAG_COLORS[h % TAG_COLORS.length];
}

interface TagStat {
  tag: string;
  minutes: number;
  sessions: number;
  tasks: number;
}

export function TagBreakdown() {
  const sessions = useFocusStore((s) => s.sessions);
  const tasks = useFocusStore((s) => s.tasks);

  const stats = React.useMemo<TagStat[]>(() => {
    const map = new Map<string, TagStat>();
    // Build taskId → tags lookup
    const taskTags = new Map<string, string[]>();
    for (const t of tasks) {
      if (t.tags.length > 0) taskTags.set(t.id, t.tags);
    }
    // Sessions linked to a tagged task contribute to that task's tags
    for (const s of sessions) {
      if (s.phase !== 'focus' || !s.completed) continue;
      const tags = s.taskId ? taskTags.get(s.taskId) : undefined;
      if (!tags || tags.length === 0) continue;
      for (const tag of tags) {
        const cur = map.get(tag) || { tag, minutes: 0, sessions: 0, tasks: 0 };
        cur.minutes += s.durationMinutes;
        cur.sessions += 1;
        map.set(tag, cur);
      }
    }
    // Count tasks per tag
    for (const t of tasks) {
      for (const tag of t.tags) {
        const cur = map.get(tag);
        if (cur) cur.tasks += 1;
      }
    }
    return Array.from(map.values()).sort((a, b) => b.minutes - a.minutes);
  }, [sessions, tasks]);

  const totalMinutes = stats.reduce((sum, s) => sum + s.minutes, 0);

  if (stats.length === 0) {
    return null; // hide entirely when no tagged sessions exist
  }

  const maxMinutes = Math.max(...stats.map((s) => s.minutes), 1);

  return (
    <Card className="border-border/60">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm font-semibold">
          <Tags className="h-4 w-4 text-brand" /> Focus by tag
          <span className="ml-auto text-xs font-normal text-muted-foreground">
            {formatMinutes(totalMinutes)} tagged
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2.5">
        {stats.slice(0, 8).map((s, i) => {
          const color = tagColor(s.tag);
          const pct = Math.round((s.minutes / maxMinutes) * 100);
          const sharePct = totalMinutes > 0 ? Math.round((s.minutes / totalMinutes) * 100) : 0;
          return (
            <div key={s.tag} className="group">
              <div className="mb-1 flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 font-medium">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: color }} />
                  #{s.tag}
                  <span className="text-muted-foreground">· {s.sessions} session{s.sessions === 1 ? '' : 's'} · {s.tasks} task{tasks === 1 ? '' : 's'}</span>
                </span>
                <span className="tabular-nums text-muted-foreground">
                  {formatMinutes(s.minutes)} <span className="text-[10px]">({sharePct}%)</span>
                </span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-muted/50">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.max(4, pct)}%` }}
                  transition={{ duration: 0.5, delay: i * 0.05, ease: 'easeOut' }}
                />
              </div>
            </div>
          );
        })}
        {stats.length > 8 && (
          <p className="pt-1 text-center text-[11px] text-muted-foreground">
            +{stats.length - 8} more tag{stats.length - 8 === 1 ? '' : 's'}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
