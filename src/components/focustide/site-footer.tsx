'use client';

import * as React from 'react';
import Link from 'next/link';
import { Github, Heart, Waves, BookOpen, Bug, Lightbulb, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

const REPO_URL = 'https://github.com/Cryptoteep/focustide';

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border/60 bg-card/40">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <Link href="#top" className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand text-brand-foreground">
                <Waves className="h-5 w-5" />
              </span>
              <span className="text-base font-semibold">FocusTide</span>
            </Link>
            <p className="mt-4 max-w-sm text-sm text-muted-foreground">
              A privacy-first, open-source focus timer &amp; deep-work analytics app.
              Your data stays on your device. Forever.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Button asChild variant="outline" size="sm">
                <Link href={REPO_URL} target="_blank" rel="noreferrer">
                  <Github className="mr-2 h-4 w-4" /> Repository
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href={`${REPO_URL}/issues/new/choose`} target="_blank" rel="noreferrer">
                  <Bug className="mr-2 h-4 w-4" /> Report a bug
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href={`${REPO_URL}/discussions`} target="_blank" rel="noreferrer">
                  <MessageCircle className="mr-2 h-4 w-4" /> Discussions
                </Link>
              </Button>
            </div>
          </div>

          <div>
            <div className="text-sm font-semibold">Project</div>
            <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
              <li><Link className="hover:text-foreground" href="#features">Features</Link></li>
              <li><Link className="hover:text-foreground" href="#analytics">Analytics</Link></li>
              <li><Link className="hover:text-foreground" href="#roadmap">Roadmap</Link></li>
              <li><Link className="hover:text-foreground" href="#faq">FAQ</Link></li>
              <li><Link className="hover:text-foreground" href={`${REPO_URL}/blob/main/CHANGELOG.md`} target="_blank" rel="noreferrer">Changelog</Link></li>
            </ul>
          </div>

          <div>
            <div className="text-sm font-semibold">Community</div>
            <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
              <li><Link className="hover:text-foreground" href={`${REPO_URL}/blob/main/CONTRIBUTING.md`} target="_blank" rel="noreferrer">Contributing guide</Link></li>
              <li><Link className="hover:text-foreground" href={`${REPO_URL}/blob/main/CODE_OF_CONDUCT.md`} target="_blank" rel="noreferrer">Code of conduct</Link></li>
              <li><Link className="hover:text-foreground" href={`${REPO_URL}/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22`} target="_blank" rel="noreferrer">Good first issues</Link></li>
              <li><Link className="hover:text-foreground" href={`${REPO_URL}/blob/main/LICENSE`} target="_blank" rel="noreferrer">MIT License</Link></li>
              <li><Link className="hover:text-foreground" href={`${REPO_URL}/blob/main/SECURITY.md`} target="_blank" rel="noreferrer">Security policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border/60 pt-6 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} FocusTide contributors. MIT Licensed.
          </p>
          <p className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            Built with <Heart className="h-3 w-3 fill-rose-500 text-rose-500" /> by open-source maintainers ·
            <BookOpen className="ml-1 h-3 w-3" /> No data collected
          </p>
        </div>
      </div>
    </footer>
  );
}

export function NewsletterStrip() {
  const [email, setEmail] = React.useState('');
  return (
    <div className="mx-auto max-w-7xl px-4 pb-4 sm:px-6 lg:px-8">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!email) return;
          toast.success('Thanks! Release notes will arrive in your inbox.', {
            description: 'We only store your email locally — no server, no list.',
          });
          setEmail('');
        }}
        className="flex flex-col items-center justify-between gap-3 rounded-2xl border border-border/60 bg-gradient-to-r from-brand-soft to-card p-4 sm:flex-row"
      >
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand text-brand-foreground">
            <Lightbulb className="h-5 w-5" />
          </span>
          <div>
            <div className="text-sm font-semibold">Get release notes (no spam, ever)</div>
            <div className="text-xs text-muted-foreground">Privacy-respecting: your email is stored only in your browser.</div>
          </div>
        </div>
        <div className="flex w-full max-w-sm gap-2">
          <Input
            type="email"
            required
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button type="submit" className="bg-brand text-brand-foreground hover:bg-brand/90">
            Subscribe
          </Button>
        </div>
      </form>
    </div>
  );
}
