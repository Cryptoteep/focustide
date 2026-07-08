'use client';

import * as React from 'react';
import { Timer as TimerIcon, ListChecks, BarChart3, Keyboard } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Timer } from './timer';
import { TaskList } from './task-list';
import { Analytics } from './analytics';
import { StreakCard } from './streak-card';
import { StatsCards } from './stats-cards';
import { DailyGoalCard } from './daily-goal-card';
import { SettingsDialog } from './settings-dialog';
import { ExportMenu } from './export-menu';
import { SoundscapePlayer } from './soundscape-player';
import { CommandPalette } from './command-palette';
import { useTimerEngine } from '@/hooks/use-timer-engine';
import { useFocusStore } from '@/lib/store';
import { applyAccent } from '@/lib/sound';

export function AppShell() {
  useTimerEngine();
  const settings = useFocusStore((s) => s.settings);
  const hydrated = useFocusStore((s) => s.hydrated);

  React.useEffect(() => {
    applyAccent(settings.accent);
  }, [settings.accent]);

  return (
    <section id="app" className="relative scroll-mt-16 py-16 sm:py-20">
      <div className="pointer-events-none absolute inset-0 bg-dots opacity-[0.25]" aria-hidden />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-brand">The app</span>
            <h2 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">Your focus cockpit</h2>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground">
              Everything below runs entirely in your browser. Close the tab and come back — your
              timer, tasks and history will be right where you left them.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('focustide:command-palette'))}
              className="hidden items-center gap-2 rounded-lg border border-border/60 bg-card/60 px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-brand/40 hover:text-foreground sm:flex"
              aria-label="Open command palette"
            >
              <span className="text-muted-foreground/70">⌘</span>
              <span>K</span>
              <span className="ml-1 hidden lg:inline">· command palette</span>
            </button>
            <SoundscapePlayer />
            <SettingsDialog />
            <ExportMenu />
          </div>
        </div>

        {/* hydration guard */}
        <div className={hydrated ? '' : 'opacity-60'}>
          <StatsCards />

          <div className="mt-4 grid gap-4 lg:grid-cols-3">
            {/* Timer column */}
            <Card className="overflow-hidden border-border/60 lg:col-span-1">
              <CardContent className="p-6 sm:p-8">
                <Timer />
              </CardContent>
            </Card>

            {/* Tasks + streak */}
            <div className="grid gap-4 lg:col-span-2">
              <Tabs defaultValue="tasks" className="h-full">
                <div className="flex items-center justify-between gap-2">
                  <TabsList>
                    <TabsTrigger value="tasks" className="gap-1.5">
                      <ListChecks className="h-3.5 w-3.5" /> Tasks
                    </TabsTrigger>
                    <TabsTrigger value="analytics" className="gap-1.5">
                      <BarChart3 className="h-3.5 w-3.5" /> Analytics
                    </TabsTrigger>
                  </TabsList>
                  <span className="hidden items-center gap-1 text-[11px] text-muted-foreground sm:inline-flex">
                    <Keyboard className="h-3 w-3" /> press <kbd className="rounded border border-border/70 bg-muted/60 px-1 font-mono">?</kbd> for shortcuts
                  </span>
                </div>

                <TabsContent value="tasks" className="mt-3">
                  <div className="grid gap-4 sm:grid-cols-5">
                    <Card className="border-border/60 sm:col-span-3">
                      <CardContent className="p-4">
                        <div className="mb-3 flex items-center gap-2">
                          <TimerIcon className="h-4 w-4 text-brand" />
                          <h3 className="text-sm font-semibold">Today&apos;s tides</h3>
                        </div>
                        <div className="h-[420px]">
                          <TaskList />
                        </div>
                      </CardContent>
                    </Card>
                    <div className="sm:col-span-2 space-y-4">
                      <DailyGoalCard />
                      <StreakCard />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="analytics" className="mt-3">
                  <Card className="border-border/60">
                    <CardContent className="p-4">
                      <div className="mb-3 flex items-center gap-2">
                        <BarChart3 className="h-4 w-4 text-brand" />
                        <h3 className="text-sm font-semibold">Deep-work analytics</h3>
                      </div>
                      <Analytics />
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
      <CommandPalette />
    </section>
  );
}
