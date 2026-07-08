'use client';

import { SiteHeader } from '@/components/focustide/site-header';
import { Hero } from '@/components/focustide/hero';
import { HowItWorks } from '@/components/focustide/how-it-works';
import { Features } from '@/components/focustide/features';
import { AppShell } from '@/components/focustide/app-shell';
import { Roadmap } from '@/components/focustide/roadmap';
import { FAQ } from '@/components/focustide/faq';
import { CommunityCTA } from '@/components/focustide/community-cta';
import { SiteFooter, NewsletterStrip } from '@/components/focustide/site-footer';
import { KeyboardShortcuts } from '@/components/focustide/keyboard-shortcuts';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <HowItWorks />
        <AppShell />
        <Features />
        <Roadmap />
        <FAQ />
        <CommunityCTA />
        <NewsletterStrip />
      </main>
      <SiteFooter />
      <KeyboardShortcuts />
    </div>
  );
}
