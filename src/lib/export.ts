import type { Session, Settings, Task } from './types';
import { computeStreak, aggregateByDay } from './stats';

export interface ExportBundle {
  app: 'focustide';
  version: 1;
  exportedAt: string;
  settings: Settings;
  tasks: Task[];
  sessions: Session[];
}

export function buildExportBundle(
  tasks: Task[],
  sessions: Session[],
  settings: Settings,
): ExportBundle {
  return {
    app: 'focustide',
    version: 1,
    exportedAt: new Date().toISOString(),
    settings,
    tasks,
    sessions,
  };
}

export function downloadBlob(filename: string, content: string, type: string) {
  if (typeof window === 'undefined') return;
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function exportJSON(bundle: ExportBundle) {
  downloadBlob(
    `focustide-${new Date().toISOString().slice(0, 10)}.json`,
    JSON.stringify(bundle, null, 2),
    'application/json',
  );
}

export function exportCSV(sessions: Session[]) {
  const header = ['id', 'phase', 'durationMinutes', 'startedAt', 'endedAt', 'completed', 'taskId', 'taskTitle'];
  const rows = sessions.map((s) =>
    [
      s.id,
      s.phase,
      s.durationMinutes,
      new Date(s.startedAt).toISOString(),
      new Date(s.endedAt).toISOString(),
      s.completed ? 'true' : 'false',
      s.taskId ?? '',
      `"${(s.taskTitle ?? '').replace(/"/g, '""')}"`,
    ].join(','),
  );
  downloadBlob(
    `focustide-sessions-${new Date().toISOString().slice(0, 10)}.csv`,
    [header.join(','), ...rows].join('\n'),
    'text/csv',
  );
}

export function exportMarkdownReport(
  tasks: Task[],
  sessions: Session[],
  settings: Settings,
): string {
  const streak = computeStreak(sessions);
  const last30 = aggregateByDay(sessions, 30);
  const focusSessions = sessions.filter((s) => s.phase === 'focus' && s.completed);
  const completedTasks = tasks.filter((t) => t.done).length;

  const lines: string[] = [];
  lines.push(`# FocusTide deep-work report`);
  lines.push('');
  lines.push(`_Generated ${new Date().toISOString()}_`);
  lines.push('');
  lines.push('## Summary');
  lines.push('');
  lines.push(`- **Current streak:** ${streak.current} day${streak.current === 1 ? '' : 's'}`);
  lines.push(`- **Longest streak:** ${streak.longest} day${streak.longest === 1 ? '' : 's'}`);
  lines.push(`- **Total focus sessions:** ${streak.totalSessions}`);
  lines.push(`- **Total focus time:** ${Math.round(streak.totalFocusMinutes)} min`);
  lines.push(`- **Sessions this week:** ${streak.thisWeek}`);
  lines.push(`- **Tasks completed:** ${completedTasks} / ${tasks.length}`);
  lines.push('');
  lines.push('## Last 30 days');
  lines.push('');
  lines.push('| Day | Focus min | Sessions |');
  lines.push('| --- | --- | --- |');
  for (const d of last30) {
    lines.push(`| ${d.day} | ${d.focusMinutes} | ${d.sessions} |`);
  }
  lines.push('');
  lines.push('## Tasks');
  lines.push('');
  if (tasks.length === 0) {
    lines.push('_No tasks recorded._');
  } else {
    for (const t of tasks) {
      const mark = t.done ? 'x' : ' ';
      lines.push(`- [${mark}] ${t.title} — ${t.completedPomodoros}/${t.estimatedPomodoros} pomodoros`);
    }
  }
  lines.push('');
  lines.push('---');
  lines.push('');
  lines.push('_Generated locally by [FocusTide](https://github.com/Cryptoteep/focustide). Your data never left your browser._');
  return lines.join('\n');
}

export function exportMarkdown(
  tasks: Task[],
  sessions: Session[],
  settings: Settings,
) {
  downloadBlob(
    `focustide-report-${new Date().toISOString().slice(0, 10)}.md`,
    exportMarkdownReport(tasks, sessions, settings),
    'text/markdown',
  );
}

export function parseImport(text: string): ExportBundle | null {
  try {
    const parsed = JSON.parse(text);
    if (parsed && parsed.app === 'focustide' && Array.isArray(parsed.tasks) && Array.isArray(parsed.sessions)) {
      return parsed as ExportBundle;
    }
    return null;
  } catch {
    return null;
  }
}
