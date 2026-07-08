'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Waves, Target, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const steps = [
  {
    n: '01',
    icon: Waves,
    title: 'Start a focus tide',
    body: 'Pick a duration (15/25/50/90 min presets or custom), choose an ambient soundscape, and hit start. The wall-clock timer stays accurate even if your tab sleeps.',
    accent: 'var(--brand)',
  },
  {
    n: '02',
    icon: Target,
    title: 'Link it to a task',
    body: 'Add what you\'re working on, estimate how many tides it\'ll take, and attach it to the session. Your pomodoro counts climb as you ship.',
    accent: 'var(--chart-2)',
  },
  {
    n: '03',
    icon: TrendingUp,
    title: 'Watch your deep work compound',
    body: 'Daily bars, hourly histograms, streaks and a 35-day heatmap reveal when you focus best — all stored locally, exportable anytime.',
    accent: 'var(--chart-3)',
  },
];

export function HowItWorks() {
  return (
    <section id="how" className="relative py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="secondary" className="rounded-full bg-brand-soft text-brand">How it works</Badge>
          <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Three tides to deep work
          </h2>
          <p className="mt-4 text-muted-foreground">
            No setup. No account. No learning curve. Open the app and you&apos;re focusing in under five seconds.
          </p>
        </div>

        <div className="relative mt-16">
          {/* connecting line */}
          <div className="absolute left-0 right-0 top-8 hidden h-px bg-gradient-to-r from-transparent via-border to-transparent lg:block" aria-hidden />

          <div className="grid gap-8 lg:grid-cols-3">
            {steps.map((s, i) => (
              <motion.div
                key={s.n}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className="relative flex flex-col items-center text-center"
              >
                <div className="relative">
                  <div
                    className="grid h-16 w-16 place-items-center rounded-2xl border border-border/60 bg-card shadow-sm transition-transform hover:scale-105"
                    style={{ color: s.accent }}
                  >
                    <s.icon className="h-7 w-7" />
                  </div>
                  <span
                    className="absolute -right-2 -top-2 grid h-7 w-7 place-items-center rounded-full text-xs font-bold text-background"
                    style={{ background: s.accent }}
                  >
                    {s.n}
                  </span>
                </div>
                <h3 className="mt-5 text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">{s.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
