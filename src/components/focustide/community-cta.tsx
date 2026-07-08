'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Github, Star, GitPullRequest, MessageCircle, Heart, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const REPO_URL = 'https://github.com/Cryptoteep/focustide';

const stats = [
  { value: '100%', label: 'local', sub: 'no servers' },
  { value: '0', label: 'trackers', sub: 'verified' },
  { value: 'MIT', label: 'license', sub: 'forever free' },
  { value: '∞', label: 'your data', sub: 'exportable' },
];

const ways = [
  {
    icon: Star,
    title: 'Star the repo',
    body: 'One click helps other developers discover FocusTide.',
    href: REPO_URL,
    cta: 'Star on GitHub',
  },
  {
    icon: GitPullRequest,
    title: 'Open a pull request',
    body: 'Fix a bug, add a theme, translate the UI — every PR is welcome.',
    href: `${REPO_URL}/blob/main/CONTRIBUTING.md`,
    cta: 'Read contributing guide',
  },
  {
    icon: MessageCircle,
    title: 'Start a discussion',
    body: 'Suggest a feature, ask a question, or just say hi.',
    href: `${REPO_URL}/discussions`,
    cta: 'Open discussions',
  },
];

export function CommunityCTA() {
  return (
    <section id="community" className="relative overflow-hidden py-20 sm:py-28">
      {/* gradient backdrop */}
      <div
        className="pointer-events-none absolute inset-0 opacity-90"
        style={{
          background:
            'radial-gradient(ellipse at top, color-mix(in oklch, var(--brand) 18%, var(--background)) 0%, var(--background) 60%)',
        }}
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-30 mask-fade-b" aria-hidden />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <Badge variant="secondary" className="rounded-full bg-brand-soft text-brand">
            Community
          </Badge>
          <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Built in the open,{' '}
            <span className="bg-gradient-to-br from-brand to-chart-2 bg-clip-text text-transparent">
              by people like you
            </span>
          </h2>
          <p className="mt-5 text-lg text-muted-foreground">
            FocusTide is a non-commercial, volunteer-maintained project. No investors, no
            paywalls, no exit strategy. Just a calm, private focus tool — kept alive by the
            people who use it.
          </p>
        </div>

        {/* stat strip */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto mt-12 grid max-w-3xl grid-cols-2 gap-4 sm:grid-cols-4"
        >
          {stats.map((s) => (
            <div key={s.label} className="rounded-2xl border border-border/60 bg-card/60 p-4 text-center backdrop-blur-sm">
              <div className="text-3xl font-bold tabular-nums text-brand">{s.value}</div>
              <div className="mt-1 text-xs font-medium uppercase tracking-wider">{s.label}</div>
              <div className="text-[11px] text-muted-foreground">{s.sub}</div>
            </div>
          ))}
        </motion.div>

        {/* ways to contribute */}
        <div className="mt-14 grid gap-5 sm:grid-cols-3">
          {ways.map((w, i) => (
            <motion.div
              key={w.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="group flex flex-col rounded-2xl border border-border/60 bg-card/70 p-6 backdrop-blur-sm transition-all hover:-translate-y-1 hover:border-brand/40 hover:shadow-lg"
            >
              <div className="mb-4 grid h-11 w-11 place-items-center rounded-xl bg-brand/10 text-brand transition-transform group-hover:scale-110">
                <w.icon className="h-5 w-5" />
              </div>
              <h3 className="text-base font-semibold">{w.title}</h3>
              <p className="mt-2 flex-1 text-sm text-muted-foreground">{w.body}</p>
              <Button asChild variant="ghost" size="sm" className="mt-4 w-fit gap-1 px-0 text-brand hover:bg-transparent hover:underline">
                <Link href={w.href} target="_blank" rel="noreferrer">
                  {w.cta} <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </motion.div>
          ))}
        </div>

        {/* final CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto mt-16 max-w-2xl"
        >
          <div className="relative overflow-hidden rounded-3xl border border-brand/30 bg-gradient-to-br from-brand-soft/80 via-card to-card p-8 text-center shadow-xl sm:p-10">
            <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-brand/20 blur-3xl" aria-hidden />
            <div className="pointer-events-none absolute -bottom-12 -left-12 h-40 w-40 rounded-full bg-chart-2/20 blur-3xl" aria-hidden />
            <div className="relative">
              <Github className="mx-auto h-10 w-10 text-brand" />
              <h3 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl">
                Ready to ride the tide?
              </h3>
              <p className="mt-3 text-muted-foreground">
                Star the repo, launch the app, and claim your first deep-work tide today.
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <Button asChild size="lg" className="bg-brand text-brand-foreground hover:bg-brand/90">
                  <Link href="#app">
                    Launch FocusTide <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href={REPO_URL} target="_blank" rel="noreferrer">
                    <Github className="mr-2 h-4 w-4" /> View source
                  </Link>
                </Button>
              </div>
              <p className="mt-6 inline-flex items-center gap-1 text-xs text-muted-foreground">
                Built with <Heart className="h-3 w-3 fill-rose-500 text-rose-500" /> by open-source
                volunteers · MIT licensed · no data collected
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
