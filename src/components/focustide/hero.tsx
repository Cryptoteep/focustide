'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Github, Shield, WifiOff, Database, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const REPO_URL = 'https://github.com/Cryptoteep/focustide';

const trust = [
  { icon: WifiOff, label: 'Works offline' },
  { icon: Shield, label: 'No telemetry' },
  { icon: Database, label: 'Local-first' },
];

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      {/* background flourishes */}
      <div className="pointer-events-none absolute inset-0 bg-grid mask-fade-b opacity-60" aria-hidden />
      <div
        className="pointer-events-none absolute -top-40 left-1/2 h-[36rem] w-[36rem] -translate-x-1/2 rounded-full opacity-30 blur-3xl animate-pulse-glow"
        style={{ background: 'radial-gradient(circle, var(--brand) 0%, transparent 70%)' }}
        aria-hidden
      />
      <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-16 sm:px-6 sm:pt-24 lg:px-8 lg:pb-24">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Badge variant="secondary" className="gap-1.5 rounded-full border-brand/30 bg-brand-soft px-3 py-1 text-brand">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-brand" />
                </span>
                v1.0 · MIT licensed · 100% open source
              </Badge>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.05 }}
              className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl"
            >
              Ride the tide of{' '}
              <span className="bg-gradient-to-br from-brand to-chart-2 bg-clip-text text-transparent">
                deep work
              </span>
              .
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.12 }}
              className="mt-5 max-w-xl text-lg text-muted-foreground"
            >
              FocusTide is a privacy-first, open-source focus timer and deep-work
              analytics app for developers. Your data <strong className="text-foreground">never</strong> leaves
              your browser — no accounts, no servers, no telemetry. Free, forever.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.18 }}
              className="mt-8 flex flex-wrap items-center gap-3"
            >
              <Button asChild size="lg" className="bg-brand text-brand-foreground hover:bg-brand/90">
                <Link href="#app">
                  Start a focus session <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href={REPO_URL} target="_blank" rel="noreferrer">
                  <Github className="mr-2 h-4 w-4" /> View on GitHub
                </Link>
              </Button>
            </motion.div>

            <motion.ul
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.28 }}
              className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2"
            >
              {trust.map((t) => (
                <li key={t.label} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <t.icon className="h-4 w-4 text-brand" />
                  {t.label}
                </li>
              ))}
            </motion.ul>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.36 }}
              className="mt-6 flex items-center gap-3 text-xs text-muted-foreground"
            >
              <div className="flex -space-x-2">
                {['#0fb5a8', '#f59e0b', '#8b5cf6', '#10b981'].map((c) => (
                  <span
                    key={c}
                    className="h-6 w-6 rounded-full border-2 border-background"
                    style={{ background: c }}
                  />
                ))}
              </div>
              <span className="inline-flex items-center gap-1">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                Loved by indie devs &amp; students building focused routines
              </span>
            </motion.div>
          </div>

          <HeroVisual />
        </div>
      </div>
    </section>
  );
}

function HeroVisual() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.15 }}
      className="relative mx-auto w-full max-w-md"
    >
      <div className="relative aspect-square">
        {/* glowing rings */}
        <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-brand/20 via-transparent to-chart-2/20 blur-2xl" />
        <div className="absolute inset-6 rounded-[2rem] border border-border/60 bg-card/70 backdrop-blur-xl shadow-2xl">
          <div className="flex h-full flex-col items-center justify-center gap-5 p-8">
            <div className="text-xs font-medium uppercase tracking-widest text-brand">Deep work</div>
            <div className="relative grid place-items-center">
              {/* rotating ring */}
              <svg viewBox="0 0 200 200" className="h-56 w-56 -rotate-90">
                <circle cx="100" cy="100" r="88" fill="none" stroke="currentColor" strokeWidth="6" className="text-muted/30" />
                <motion.circle
                  cx="100"
                  cy="100"
                  r="88"
                  fill="none"
                  stroke="var(--brand)"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 88}
                  initial={{ strokeDashoffset: 2 * Math.PI * 88 * 0.62 }}
                  animate={{ strokeDashoffset: [2 * Math.PI * 88 * 0.62, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="font-mono text-5xl font-bold tabular-nums">24:00</span>
                <span className="mt-1 text-xs text-muted-foreground">Focus · 1 of 4</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-brand" />
              <span className="h-2.5 w-2.5 rounded-full bg-muted" />
              <span className="h-2.5 w-2.5 rounded-full bg-muted" />
              <span className="h-2.5 w-2.5 rounded-full bg-muted" />
            </div>
            <div className="rounded-full bg-brand px-5 py-2 text-sm font-medium text-brand-foreground shadow-lg shadow-brand/20">
              ▶ Start focus
            </div>
          </div>
        </div>
        <div className="absolute -bottom-4 -left-4 hidden rounded-2xl border border-border/60 bg-card p-4 shadow-xl sm:block animate-float">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-amber-500/15 text-amber-500">
              🔥
            </div>
            <div>
              <div className="text-lg font-bold leading-none">12 days</div>
              <div className="text-xs text-muted-foreground">current streak</div>
            </div>
          </div>
        </div>
        <div className="absolute -right-4 top-6 hidden rounded-2xl border border-border/60 bg-card p-4 shadow-xl sm:block animate-float" style={{ animationDelay: '1.5s' }}>
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-brand/15 text-brand">
              ⏱
            </div>
            <div>
              <div className="text-lg font-bold leading-none">6.2h</div>
              <div className="text-xs text-muted-foreground">focus this week</div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
