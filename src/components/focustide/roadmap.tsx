'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Check, Circle, Github, GitPullRequest, Star, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const REPO_URL = 'https://github.com/Cryptoteep/focustide';

const roadmap = [
  {
    phase: 'Shipped in v1.0',
    state: 'done' as const,
    items: [
      'Adaptive Pomodoro timer with wall-clock accuracy',
      'Task-linked focus tides with pomodoro estimates',
      'Daily, weekly, hourly & phase analytics',
      '35-day streak heatmap',
      'JSON / CSV / Markdown export + import',
      '5 accent themes + light/dark/system',
      'Keyboard-first controls',
      'Web-Audio chimes (no audio files)',
      'Browser notifications',
      '100% local-first, zero telemetry',
    ],
  },
  {
    phase: 'v1.1 — In progress',
    state: 'active' as const,
    items: [
      'Calendar heatmap (GitHub-style, full year)',
      'Weekly deep-work report email draft generator',
      'Custom tags & per-tag analytics',
      'Ambient soundscape player (rain, waves, cafe)',
      'PWA install + offline shell',
    ],
  },
  {
    phase: 'v1.2 — Planned',
    state: 'planned' as const,
    items: [
      'Goals & weekly targets with progress rings',
      'Insights panel (best time-of-day, trends)',
      'Command palette (⌘K) for everything',
      'Optional end-to-end encrypted sync via your own Gist',
      'i18n (en, ru, es, de, fr, zh)',
    ],
  },
  {
    phase: 'Future',
    state: 'planned' as const,
    items: [
      'Community theme marketplace',
      'Integration with local git activity (opt-in)',
      'Shared focus rooms over WebRTC (no server)',
      'CLI companion for terminal-based tracking',
    ],
  },
];

export function Roadmap() {
  return (
    <section id="roadmap" className="py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="secondary" className="rounded-full bg-brand-soft text-brand">Roadmap</Badge>
          <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Where FocusTide is heading
          </h2>
          <p className="mt-4 text-muted-foreground">
            Public, transparent, and shaped by the community. Every item here is tracked in
            GitHub issues — vote, comment, or pick one up.
          </p>
        </div>

        <div className="mt-12 grid gap-5 lg:grid-cols-2">
          {roadmap.map((col, i) => (
            <motion.div
              key={col.phase}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <Card className="h-full border-border/60">
                <CardContent className="p-6">
                  <div className="mb-4 flex items-center gap-2">
                    <Badge
                      variant="secondary"
                      className={
                        col.state === 'done'
                          ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                          : col.state === 'active'
                            ? 'bg-brand/15 text-brand'
                            : 'bg-muted text-muted-foreground'
                      }
                    >
                      {col.state === 'done' ? '✓ Shipped' : col.state === 'active' ? '● In progress' : '○ Planned'}
                    </Badge>
                    <h3 className="text-sm font-semibold">{col.phase}</h3>
                  </div>
                  <ul className="space-y-2.5">
                    {col.items.map((item) => (
                      <li key={item} className="flex items-start gap-2.5 text-sm">
                        {col.state === 'done' ? (
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                        ) : (
                          <Circle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground/50" />
                        )}
                        <span className={col.state === 'planned' ? 'text-muted-foreground' : ''}>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          <CommunityStat icon={Star} value="0" label="GitHub stars" href={`${REPO_URL}/stargazers`} />
          <CommunityStat icon={GitPullRequest} value="open" label="Pull requests welcome" href={`${REPO_URL}/pulls`} />
          <CommunityStat icon={Users} value="∞" label="Contributors wanted" href={`${REPO_URL}/blob/main/CONTRIBUTING.md`} />
        </div>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 rounded-2xl border border-border/60 bg-gradient-to-r from-brand-soft/60 to-card p-6 text-center sm:flex-row sm:text-left">
          <div className="flex-1">
            <h3 className="text-base font-semibold">Want to shape the roadmap?</h3>
            <p className="text-sm text-muted-foreground">
              Open an issue, start a discussion, or grab a <span className="font-medium text-foreground">good first issue</span>.
            </p>
          </div>
          <div className="flex gap-2">
            <Button asChild variant="outline" size="sm">
              <Link href={`${REPO_URL}/issues/new/choose`} target="_blank" rel="noreferrer">
                <Github className="mr-2 h-4 w-4" /> Open an issue
              </Link>
            </Button>
            <Button asChild size="sm" className="bg-brand text-brand-foreground hover:bg-brand/90">
              <Link href={`${REPO_URL}/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22`} target="_blank" rel="noreferrer">
                Good first issues
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

function CommunityStat({
  icon: Icon,
  value,
  label,
  href,
}: {
  icon: React.ComponentType<{ className?: string }>;
  value: string;
  label: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noreferrer"
      className="group flex items-center gap-3 rounded-2xl border border-border/60 bg-card/50 p-4 transition-colors hover:border-brand/40"
    >
      <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand/10 text-brand">
        <Icon className="h-4 w-4" />
      </span>
      <div>
        <div className="text-xl font-bold tabular-nums">{value}</div>
        <div className="text-xs text-muted-foreground group-hover:text-foreground">{label}</div>
      </div>
    </Link>
  );
}
