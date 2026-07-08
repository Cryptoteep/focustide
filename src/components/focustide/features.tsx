'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import {
  Timer,
  ListChecks,
  BarChart3,
  Flame,
  Palette,
  Bell,
  Keyboard,
  Download,
  ShieldCheck,
  WifiOff,
  Sparkles,
  Moon,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const features = [
  {
    icon: Timer,
    title: 'Adaptive Pomodoro timer',
    body: 'Customizable focus, short-break and long-break durations with quick-start presets (15/25/50/90 min) and an accurate wall-clock engine that survives tab throttling and sleep.',
    accent: 'var(--brand)',
  },
  {
    icon: ListChecks,
    title: 'Task-linked sessions',
    body: 'Plan estimates, attach a task to each focus tide, and watch your completed-pomodoro counts climb as you ship.',
    accent: 'var(--chart-2)',
  },
  {
    icon: BarChart3,
    title: 'Deep-work analytics',
    body: 'Daily, weekly and hourly breakdowns of where your focus actually goes — plus phase distribution and trends.',
    accent: 'var(--chart-3)',
  },
  {
    icon: Flame,
    title: 'Streaks & daily goals',
    body: 'Daily streaks, longest streak, a 35-day activity heatmap and a daily focus goal with a live progress ring.',
    accent: 'var(--chart-5)',
  },
  {
    icon: Palette,
    title: 'Themes & accents',
    body: 'Light, dark or system, plus five accent presets. Your eyes get to choose. Everything is CSS-variable driven.',
    accent: 'var(--chart-4)',
  },
  {
    icon: Bell,
    title: 'Ambient soundscapes',
    body: 'Six procedurally-synthesized ambient sounds (rain, waves, cafe, forest, white & brown noise) — pure Web Audio, zero files.',
    accent: 'var(--brand)',
  },
  {
    icon: Keyboard,
    title: 'Keyboard-first',
    body: 'Space to start/pause, R to reset, S to skip, N for new task. Power users never touch the mouse.',
    accent: 'var(--chart-3)',
  },
  {
    icon: Download,
    title: 'Own your data',
    body: 'Export to JSON, CSV or a Markdown report anytime. Import on any device. Plain files, no lock-in, no cloud.',
    accent: 'var(--chart-2)',
  },
  {
    icon: ShieldCheck,
    title: 'Privacy by design',
    body: 'No accounts, no analytics SDK, no third-party scripts, no cookies. The app is a static bundle talking to nobody.',
    accent: 'var(--brand)',
  },
];

const principles = [
  { icon: WifiOff, label: 'Offline-first', body: 'Runs fully offline after first load.' },
  { icon: ShieldCheck, label: 'No tracking', body: 'Zero telemetry, zero third-party requests.' },
  { icon: Moon, label: 'Calm UI', body: 'Quiet by default. No streak-shaming, no nagging.' },
  { icon: Sparkles, label: 'Free forever', body: 'MIT licensed, community maintained.' },
];

export function Features() {
  return (
    <section id="features" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="secondary" className="rounded-full bg-brand-soft text-brand">
            Features
          </Badge>
          <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Everything you need to focus.{' '}
            <span className="text-muted-foreground">Nothing you don&apos;t.</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            FocusTide ships the full deep-work toolkit in a single, lightweight web app —
            and gives you the source code to prove there&apos;s nothing watching you.
          </p>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.4, delay: (i % 3) * 0.06 }}
            >
              <Card className="group h-full overflow-hidden border-border/60 transition-all hover:-translate-y-1 hover:border-brand/40 hover:shadow-lg">
                <CardContent className="p-6">
                  <div
                    className="mb-4 grid h-11 w-11 place-items-center rounded-xl transition-transform group-hover:scale-110"
                    style={{ background: `color-mix(in oklch, ${f.accent} 14%, transparent)`, color: f.accent }}
                  >
                    <f.icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-semibold">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.body}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {principles.map((p) => (
            <div
              key={p.label}
              className="flex items-start gap-3 rounded-2xl border border-border/60 bg-card/50 p-4"
            >
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-brand/10 text-brand">
                <p.icon className="h-4 w-4" />
              </div>
              <div>
                <div className="text-sm font-semibold">{p.label}</div>
                <div className="text-xs text-muted-foreground">{p.body}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
