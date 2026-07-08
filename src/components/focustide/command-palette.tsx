'use client';

import * as React from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  Plus,
  Target,
  BarChart3,
  Settings2,
  Download,
  Moon,
  Sun,
  Waves,
  Coffee,
  Bath,
  Command as CommandIcon,
} from 'lucide-react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@/components/ui/command';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useFocusStore } from '@/lib/store';
import { useTheme } from 'next-themes';
import { toast } from 'sonner';
import type { Phase } from '@/lib/types';

interface CommandAction {
  id: string;
  label: string;
  shortcut?: string;
  icon: React.ComponentType<{ className?: string }>;
  group: string;
  keywords?: string;
  run: () => void;
}

export function CommandPalette() {
  const [open, setOpen] = React.useState(false);
  const { theme, setTheme } = useTheme();

  const runtime = useFocusStore.getState().runtime;
  const start = useFocusStore((s) => s.startTimer);
  const pause = useFocusStore((s) => s.pauseTimer);
  const reset = useFocusStore((s) => s.resetTimer);
  const skip = useFocusStore((s) => s.skipPhase);
  const setPhase = useFocusStore((s) => s.setPhase);
  const focusMinutes = useFocusStore((s) => s.settings.focusMinutes);
  const updateSettings = useFocusStore((s) => s.updateSettings);

  // ⌘K / Ctrl+K to toggle
  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((v) => !v);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // open from a custom event (so other UI can trigger it)
  React.useEffect(() => {
    function onOpen() {
      setOpen(true);
    }
    window.addEventListener('focustide:command-palette', onOpen);
    return () => window.removeEventListener('focustide:command-palette', onOpen);
  }, []);

  const actions = React.useMemo<CommandAction[]>(() => {
    const isRunning = useFocusStore.getState().runtime.running;
    return [
      // Timer
      {
        id: 'toggle-timer',
        label: isRunning ? 'Pause timer' : 'Start timer',
        shortcut: 'Space',
        icon: isRunning ? Pause : Play,
        group: 'Timer',
        run: () => {
          const st = useFocusStore.getState();
          if (st.runtime.running) pause();
          else start();
        },
      },
      { id: 'reset', label: 'Reset current phase', shortcut: 'R', icon: RotateCcw, group: 'Timer', run: () => { reset(); toast.info('Phase reset'); } },
      { id: 'skip', label: 'Skip to next phase', shortcut: 'S', icon: SkipForward, group: 'Timer', run: () => { skip(); toast.info('Skipped'); } },
      { id: 'phase-focus', label: 'Switch to Focus phase', shortcut: '1', icon: Waves, group: 'Timer', run: () => setPhase('focus') },
      { id: 'phase-short', label: 'Switch to Short break', shortcut: '2', icon: Coffee, group: 'Timer', run: () => setPhase('short-break') },
      { id: 'phase-long', label: 'Switch to Long break', shortcut: '3', icon: Bath, group: 'Timer', run: () => setPhase('long-break') },
      // Focus duration presets
      ...[15, 25, 50, 90].map((m) => ({
        id: `focus-${m}`,
        label: `Set focus duration to ${m} minutes`,
        icon: Target,
        group: 'Presets',
        keywords: `focus minutes duration ${m}`,
        run: () => { updateSettings({ focusMinutes: m }); toast.success(`Focus tide set to ${m} min`); },
      })),
      // Navigation
      { id: 'nav-app', label: 'Jump to the app', icon: CommandIcon, group: 'Navigate', run: () => { document.querySelector('#app')?.scrollIntoView({ behavior: 'smooth' }); } },
      { id: 'nav-features', label: 'Jump to features', icon: CommandIcon, group: 'Navigate', run: () => { document.querySelector('#features')?.scrollIntoView({ behavior: 'smooth' }); } },
      { id: 'nav-analytics', label: 'Jump to analytics', icon: BarChart3, group: 'Navigate', run: () => { document.querySelector('#app')?.scrollIntoView({ behavior: 'smooth' }); } },
      { id: 'nav-roadmap', label: 'Jump to roadmap', icon: CommandIcon, group: 'Navigate', run: () => { document.querySelector('#roadmap')?.scrollIntoView({ behavior: 'smooth' }); } },
      { id: 'nav-faq', label: 'Jump to FAQ', icon: CommandIcon, group: 'Navigate', run: () => { document.querySelector('#faq')?.scrollIntoView({ behavior: 'smooth' }); } },
      // Theme
      {
        id: 'theme-toggle',
        label: theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme',
        icon: theme === 'dark' ? Sun : Moon,
        group: 'Theme',
        run: () => setTheme(theme === 'dark' ? 'light' : 'dark'),
      },
      // Data
      { id: 'export-json', label: 'Export data (JSON backup)', icon: Download, group: 'Data', run: () => { document.querySelector('#app button[data-ft=datbtn]')?.dispatchEvent(new MouseEvent('click', { bubbles: true })); } },
      { id: 'open-settings', label: 'Open settings', icon: Settings2, group: 'Data', run: () => { document.querySelector('#app button[data-slot=dialog-trigger]')?.dispatchEvent(new MouseEvent('click', { bubbles: true })); } },
    ];
  }, [runtime, theme, start, pause, reset, skip, setPhase, updateSettings, setTheme, focusMinutes]);

  const groups = React.useMemo(() => {
    const map = new Map<string, CommandAction[]>();
    for (const a of actions) {
      if (!map.has(a.group)) map.set(a.group, []);
      map.get(a.group)!.push(a);
    }
    return Array.from(map.entries());
  }, [actions]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="overflow-hidden p-0 shadow-2xl max-w-2xl" showCloseButton={false}>
        <Command className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12">
          <CommandInput placeholder="Type a command or search…" />
          <CommandList className="max-h-[400px]">
            <CommandEmpty>No results found.</CommandEmpty>
            {groups.map(([group, items]) => (
              <React.Fragment key={group}>
                <CommandGroup heading={group}>
                  {items.map((a) => (
                    <CommandItem
                      key={a.id}
                      value={`${a.label} ${a.keywords ?? ''}`}
                      onSelect={() => {
                        a.run();
                        setOpen(false);
                      }}
                      className="gap-2"
                    >
                      <a.icon className="h-4 w-4 text-muted-foreground" />
                      <span className="flex-1">{a.label}</span>
                      {a.shortcut && <CommandShortcut>{a.shortcut}</CommandShortcut>}
                    </CommandItem>
                  ))}
                </CommandGroup>
                <CommandSeparator />
              </React.Fragment>
            ))}
          </CommandList>
          <div className="flex items-center justify-between border-t border-border/60 px-3 py-2 text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1">
              <CommandIcon className="h-3 w-3" />
              FocusTide command palette
            </span>
            <span className="flex items-center gap-1">
              <kbd className="rounded border border-border/70 bg-muted/60 px-1.5 py-0.5 font-mono">esc</kbd>
              to close
            </span>
          </div>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
