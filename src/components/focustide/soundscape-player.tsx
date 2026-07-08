'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, X, Music2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { useFocusStore } from '@/lib/store';
import { SOUNDSCAPES, getSoundscapeEngine, type SoundscapeName } from '@/lib/soundscape';
import { toast } from 'sonner';

export function SoundscapePlayer() {
  const [active, setActive] = React.useState<SoundscapeName | null>(null);
  const [volume, setVolume] = React.useState(0.5);
  const [open, setOpen] = React.useState(false);
  const engineRef = React.useRef<ReturnType<typeof getSoundscapeEngine> | null>(null);

  // stop on unmount
  React.useEffect(() => {
    return () => {
      try {
        getSoundscapeEngine().stop();
      } catch {
        /* SSR */
      }
    };
  }, []);

  // stop soundscape when a break starts (focus-only ambient)
  const phase = useFocusStore((s) => s.runtime.phase);
  React.useEffect(() => {
    if (phase !== 'focus' && active) {
      // gentle: keep playing across breaks but we could stop. Let's keep it — user controls.
    }
  }, [phase, active]);

  function toggle(name: SoundscapeName) {
    if (!engineRef.current) engineRef.current = getSoundscapeEngine();
    const engine = engineRef.current;
    if (active === name) {
      engine.stop();
      setActive(null);
      return;
    }
    try {
      engine.play(name, volume);
      setActive(name);
    } catch {
      toast.error('Audio could not start', { description: 'Click anywhere first to enable audio.' });
    }
  }

  function onVolumeChange([v]: number[]) {
    const norm = v / 100;
    setVolume(norm);
    engineRef.current?.setVolume(norm);
  }

  const activeMeta = SOUNDSCAPES.find((s) => s.name === active);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            'gap-2 transition-all',
            active && 'border-brand/50 bg-brand-soft/50 text-brand',
          )}
        >
          <Music2 className={cn('h-4 w-4', active && 'animate-pulse')} />
          <span className="hidden sm:inline">{active ? activeMeta?.label : 'Ambient'}</span>
          {active && (
            <span className="flex h-2 w-2">
              <span className="absolute inline-flex h-2 w-2 animate-ping rounded-full bg-brand opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-brand" />
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-72 p-4">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold">Ambient sounds</div>
            <div className="text-xs text-muted-foreground">Synthesized live · no files</div>
          </div>
          {active && (
            <button
              onClick={() => {
                engineRef.current?.stop();
                setActive(null);
              }}
              className="rounded-md p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
              aria-label="Stop ambient sound"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <div className="grid grid-cols-3 gap-2">
          {SOUNDSCAPES.map((s) => (
            <motion.button
              key={s.name}
              whileTap={{ scale: 0.95 }}
              onClick={() => toggle(s.name)}
              className={cn(
                'flex flex-col items-center gap-1 rounded-xl border p-2.5 text-center transition-all',
                active === s.name
                  ? 'border-brand bg-brand-soft/60 shadow-sm'
                  : 'border-border/60 hover:border-brand/40 hover:bg-accent/40',
              )}
            >
              <span className="text-xl">{s.emoji}</span>
              <span className="text-[11px] font-medium leading-tight">{s.label}</span>
            </motion.button>
          ))}
        </div>

        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              {volume === 0 ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
              Volume
            </span>
            <span className="text-xs tabular-nums text-muted-foreground">{Math.round(volume * 100)}%</span>
          </div>
          <Slider value={[volume * 100]} min={0} max={100} step={5} onValueChange={onVolumeChange} />
        </div>

        <AnimatePresence>
          {active && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3 overflow-hidden rounded-lg bg-brand-soft/40 p-2.5"
            >
              <p className="text-xs text-brand">
                <span className="mr-1">{activeMeta?.emoji}</span>
                Playing <strong>{activeMeta?.label}</strong> — {activeMeta?.description.toLowerCase()}.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </PopoverContent>
    </Popover>
  );
}
