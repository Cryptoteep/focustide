'use client';

import * as React from 'react';
import { Settings2, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { useFocusStore } from '@/lib/store';
import { DEFAULT_SETTINGS } from '@/lib/store';
import { ACCENT_PRESETS, applyAccent } from '@/lib/sound';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export function SettingsDialog() {
  const settings = useFocusStore((s) => s.settings);
  const updateSettings = useFocusStore((s) => s.updateSettings);
  const resetSettings = useFocusStore((s) => s.resetSettings);
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    applyAccent(settings.accent);
  }, [settings.accent]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Settings2 className="h-4 w-4" /> Settings
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto ft-scroll sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Timer settings</DialogTitle>
          <DialogDescription>
            Tune your focus tides. Changes are saved locally to your browser.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
          <section className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Durations</h4>
            <div className="grid grid-cols-3 gap-3">
              <NumberField
                label="Focus"
                value={settings.focusMinutes}
                min={1}
                max={120}
                onChange={(v) => updateSettings({ focusMinutes: v })}
              />
              <NumberField
                label="Short break"
                value={settings.shortBreakMinutes}
                min={1}
                max={60}
                onChange={(v) => updateSettings({ shortBreakMinutes: v })}
              />
              <NumberField
                label="Long break"
                value={settings.longBreakMinutes}
                min={1}
                max={60}
                onChange={(v) => updateSettings({ longBreakMinutes: v })}
              />
            </div>
            <NumberField
              label="Long break interval (focus sessions)"
              value={settings.longBreakInterval}
              min={2}
              max={12}
              onChange={(v) => updateSettings({ longBreakInterval: v })}
            />
          </section>

          <Separator />

          <section className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Goals</h4>
            <NumberField
              label="Daily focus goal (minutes)"
              value={settings.dailyGoalMinutes}
              min={15}
              max={720}
              onChange={(v) => updateSettings({ dailyGoalMinutes: v })}
            />
          </section>

          <Separator />

          <section className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Automation</h4>
            <ToggleRow
              label="Auto-start breaks"
              description="Begin the next break automatically when focus ends."
              checked={settings.autoStartBreaks}
              onChange={(v) => updateSettings({ autoStartBreaks: v })}
            />
            <ToggleRow
              label="Auto-start focus"
              description="Jump straight into the next focus tide after a break."
              checked={settings.autoStartFocus}
              onChange={(v) => updateSettings({ autoStartFocus: v })}
            />
          </section>

          <Separator />

          <section className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Audio &amp; alerts</h4>
            <ToggleRow
              label="Sound effects"
              description="Synthesized chimes on start, complete and break."
              checked={settings.soundEnabled}
              onChange={(v) => updateSettings({ soundEnabled: v })}
            />
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm">Volume</Label>
                <span className="text-xs tabular-nums text-muted-foreground">{Math.round(settings.volume * 100)}%</span>
              </div>
              <Slider
                value={[settings.volume * 100]}
                min={0}
                max={100}
                step={5}
                onValueChange={([v]) => updateSettings({ volume: v / 100 })}
              />
            </div>
            <ToggleRow
              label="Browser notifications"
              description="Get a desktop alert when a tide completes."
              checked={settings.notificationsEnabled}
              onChange={(v) => updateSettings({ notificationsEnabled: v })}
            />
            <ToggleRow
              label="Show timer in tab title"
              description="Live countdown in your browser tab."
              checked={settings.showSecondsInTitle}
              onChange={(v) => updateSettings({ showSecondsInTitle: v })}
            />
          </section>

          <Separator />

          <section className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Accent</h4>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(ACCENT_PRESETS) as Array<keyof typeof ACCENT_PRESETS>).map((key) => (
                <button
                  key={key}
                  onClick={() => {
                    updateSettings({ accent: key });
                    applyAccent(key);
                  }}
                  className={cn(
                    'flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs transition-all',
                    settings.accent === key
                      ? 'border-foreground/30 bg-card shadow-sm'
                      : 'border-border/60 hover:border-foreground/30',
                  )}
                >
                  <span className="h-3.5 w-3.5 rounded-full" style={{ background: ACCENT_PRESETS[key].swatch }} />
                  {ACCENT_PRESETS[key].label}
                </button>
              ))}
            </div>
          </section>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              resetSettings();
              applyAccent(DEFAULT_SETTINGS.accent);
              toast.success('Settings reset to defaults');
            }}
          >
            <RotateCcw className="mr-2 h-3.5 w-3.5" /> Reset
          </Button>
          <DialogClose asChild>
            <Button className="bg-brand text-brand-foreground hover:bg-brand/90">Done</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function NumberField({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <div className="flex items-center rounded-lg border border-border/60">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-r-none"
          onClick={() => onChange(Math.max(min, value - 1))}
          aria-label={`Decrease ${label}`}
        >
          −
        </Button>
        <Input
          type="number"
          value={value}
          min={min}
          max={max}
          onChange={(e) => {
            const v = parseInt(e.target.value, 10);
            if (!Number.isNaN(v)) onChange(Math.min(max, Math.max(min, v)));
          }}
          className="h-8 border-0 text-center tabular-nums [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
        />
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-l-none"
          onClick={() => onChange(Math.min(max, value + 1))}
          aria-label={`Increase ${label}`}
        >
          +
        </Button>
      </div>
    </div>
  );
}

function ToggleRow({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <div className="text-sm font-medium">{label}</div>
        <div className="text-xs text-muted-foreground">{description}</div>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}
