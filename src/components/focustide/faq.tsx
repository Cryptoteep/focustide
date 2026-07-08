'use client';

import * as React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { ShieldCheck, Lock, Code2, Heart } from 'lucide-react';

const faqs = [
  {
    q: 'Is FocusTide really free?',
    a: 'Yes. FocusTide is MIT-licensed open source. There is no paid tier, no premium, no upsell. The maintainer team runs it as a non-commercial, community project. If you ever see a paywall, you are not looking at the real FocusTide.',
  },
  {
    q: 'Where is my data stored?',
    a: 'Entirely in your browser via localStorage. There is no backend, no database, no account. If you clear your browser storage, your data is gone — so use the Export menu to back up regularly. You can also export to JSON and import on another device.',
  },
  {
    q: 'Does FocusTide collect analytics or telemetry?',
    a: 'No. There are no analytics SDKs, no tracking pixels, no third-party scripts, and no cookies. The network tab will show zero outbound requests after the initial page load. The entire app is a static bundle.',
  },
  {
    q: 'How accurate is the timer?',
    a: 'FocusTide computes remaining time from a wall-clock deadline rather than counting ticks, so it stays accurate even if your browser throttles background tabs or your machine sleeps. When you return, the timer reflects real elapsed time.',
  },
  {
    q: 'Can I use it offline?',
    a: 'Yes. After the first load, FocusTide works fully offline. A PWA shell is on the roadmap (v1.1) so you can install it to your desktop or home screen.',
  },
  {
    q: 'How do I contribute?',
    a: 'Read CONTRIBUTING.md, pick a "good first issue" from the issue tracker, open a pull request, or just file a bug report / feature request. All contributions — code, docs, translations, design feedback — are welcome and governed by our Code of Conduct.',
  },
  {
    q: 'Is there a desktop or mobile app?',
    a: 'FocusTide is a responsive web app that works in any modern browser. A PWA install mode is coming in v1.1. Native apps are not currently planned — the web is the platform.',
  },
  {
    q: 'What does "local-first" mean?',
    a: 'Local-first means your data lives on your device first, and any sync (planned for v1.2 via your own encrypted GitHub Gist) is optional and opt-in. You never depend on a server to use the app.',
  },
];

const pillars = [
  { icon: ShieldCheck, title: 'Privacy-first', body: 'No accounts, no tracking, no servers required.' },
  { icon: Lock, title: 'Local-first', body: 'Your data lives on your device, where it belongs.' },
  { icon: Code2, title: 'Open source', body: 'MIT licensed, auditable, community-driven.' },
  { icon: Heart, title: 'Non-commercial', body: 'Free forever, maintained by volunteers.' },
];

export function FAQ() {
  return (
    <section id="faq" className="py-20 sm:py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <Badge variant="secondary" className="rounded-full bg-brand-soft text-brand">FAQ</Badge>
          <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">Questions, answered</h2>
          <p className="mt-4 text-muted-foreground">
            Still curious? Open a discussion on GitHub — we reply to everything.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map((p) => (
            <div key={p.title} className="rounded-2xl border border-border/60 bg-card/40 p-4 text-center">
              <div className="mx-auto mb-2 grid h-10 w-10 place-items-center rounded-xl bg-brand/10 text-brand">
                <p.icon className="h-4 w-4" />
              </div>
              <div className="text-sm font-semibold">{p.title}</div>
              <div className="mt-1 text-xs text-muted-foreground">{p.body}</div>
            </div>
          ))}
        </div>

        <div className="mt-10">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((f, i) => (
              <AccordionItem key={f.q} value={`item-${i}`}>
                <AccordionTrigger className="text-left text-base font-medium">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
