'use client';

import * as React from 'react';
import Link from 'next/link';
import { Github, Star, Waves, Heart, Moon, Sun, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTheme } from 'next-themes';

const REPO_URL = 'https://github.com/Cryptoteep/focustide';

export function SiteHeader() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  return (
    <header className="sticky top-0 z-50 w-full glass border-b border-border/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <Link href="#top" className="flex items-center gap-2.5 group">
          <span className="relative grid h-9 w-9 place-items-center rounded-xl bg-brand text-brand-foreground shadow-sm transition-transform group-hover:scale-105">
            <Waves className="h-5 w-5" />
          </span>
          <span className="flex flex-col leading-none">
            <span className="text-base font-semibold tracking-tight">FocusTide</span>
            <span className="text-[11px] text-muted-foreground">local-first · OSS</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          <NavLink href="#app">App</NavLink>
          <NavLink href="#features">Features</NavLink>
          <NavLink href="#analytics">Analytics</NavLink>
          <NavLink href="#roadmap">Roadmap</NavLink>
          <NavLink href="#faq">FAQ</NavLink>
        </nav>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle theme"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            {mounted && theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>

          <Button asChild variant="outline" size="sm" className="hidden sm:inline-flex">
            <Link href={REPO_URL} target="_blank" rel="noreferrer">
              <Github className="mr-2 h-4 w-4" />
              Star
              <Badge variant="secondary" className="ml-2 gap-1 rounded-full px-1.5">
                <Star className="h-3 w-3" /> v1.0
              </Badge>
            </Link>
          </Button>

          <Button asChild size="sm" className="bg-brand text-brand-foreground hover:bg-brand/90">
            <Link href="#app">Launch app</Link>
          </Button>

          <div className="md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="#app">App</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="#features">Features</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="#analytics">Analytics</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="#roadmap">Roadmap</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="#faq">FAQ</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={REPO_URL} target="_blank" rel="noreferrer">
                    <Github className="mr-2 h-4 w-4" /> GitHub
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground hover:bg-accent/60"
    >
      {children}
    </Link>
  );
}

export function MadeWithLove() {
  return (
    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
      Built with <Heart className="h-3 w-3 fill-rose-500 text-rose-500" /> by the open-source community
    </span>
  );
}
