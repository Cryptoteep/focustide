import type { AccentPreset } from './types';

/**
 * Web-Audio based notification sounds — no audio files needed, keeps the app
 * fully self-contained and bundle-light. All synthesis happens locally.
 */
let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!ctx) {
    const AC = window.AudioContext || (window as any).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === 'suspended') void ctx.resume();
  return ctx;
}

function tone(
  audio: AudioContext,
  freq: number,
  start: number,
  duration: number,
  type: OscillatorType = 'sine',
  gain = 0.18,
) {
  const osc = audio.createOscillator();
  const env = audio.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, start);
  env.gain.setValueAtTime(0, start);
  env.gain.linearRampToValueAtTime(gain, start + 0.012);
  env.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  osc.connect(env);
  env.connect(audio.destination);
  osc.start(start);
  osc.stop(start + duration + 0.02);
}

export type SoundName = 'start' | 'complete' | 'break' | 'tick' | 'finish';

export function playSound(name: SoundName, volume = 0.7) {
  const audio = getCtx();
  if (!audio) return;
  const now = audio.currentTime;
  const v = Math.max(0, Math.min(1, volume));

  switch (name) {
    case 'start': {
      tone(audio, 523.25, now, 0.18, 'sine', 0.16 * v);
      tone(audio, 659.25, now + 0.08, 0.22, 'sine', 0.14 * v);
      break;
    }
    case 'complete': {
      // pleasant rising arpeggio
      tone(audio, 523.25, now, 0.2, 'triangle', 0.18 * v);
      tone(audio, 659.25, now + 0.12, 0.2, 'triangle', 0.18 * v);
      tone(audio, 783.99, now + 0.24, 0.32, 'triangle', 0.2 * v);
      break;
    }
    case 'break': {
      tone(audio, 440, now, 0.24, 'sine', 0.15 * v);
      tone(audio, 392, now + 0.14, 0.3, 'sine', 0.14 * v);
      break;
    }
    case 'tick': {
      tone(audio, 880, now, 0.05, 'square', 0.05 * v);
      break;
    }
    case 'finish': {
      tone(audio, 659.25, now, 0.18, 'triangle', 0.18 * v);
      tone(audio, 783.99, now + 0.1, 0.18, 'triangle', 0.18 * v);
      tone(audio, 1046.5, now + 0.2, 0.4, 'triangle', 0.2 * v);
      break;
    }
  }
}

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (typeof window === 'undefined' || !('Notification' in window)) return 'denied';
  if (Notification.permission === 'granted') return 'granted';
  try {
    return await Notification.requestPermission();
  } catch {
    return 'denied';
  }
}

export function showNotification(title: string, body: string) {
  if (typeof window === 'undefined' || !('Notification' in window)) return;
  if (Notification.permission !== 'granted') return;
  try {
    new Notification(title, {
      body,
      icon: '/logo.svg',
      badge: '/logo.svg',
      silent: true,
    });
  } catch {
    /* ignore */
  }
}

/** Accent CSS variable map applied to :root for runtime theme switching */
export const ACCENT_PRESETS: Record<
  AccentPreset,
  {
    label: string;
    swatch: string;
    vars: Record<string, string>;
  }
> = {
  tide: {
    label: 'Tide',
    swatch: '#0fb5a8',
    vars: {
      '--brand': 'oklch(0.62 0.13 194)',
      '--brand-foreground': 'oklch(0.985 0 0)',
      '--brand-soft': 'oklch(0.95 0.04 194)',
      '--focus': 'oklch(0.62 0.13 194)',
      '--primary': 'oklch(0.62 0.13 194)',
      '--primary-foreground': 'oklch(0.985 0 0)',
      '--ring': 'oklch(0.62 0.13 194)',
      '--accent': 'oklch(0.95 0.04 194)',
      '--accent-foreground': 'oklch(0.3 0.06 194)',
    },
  },
  emerald: {
    label: 'Emerald',
    swatch: '#10b981',
    vars: {
      '--brand': 'oklch(0.65 0.15 160)',
      '--brand-foreground': 'oklch(0.985 0 0)',
      '--brand-soft': 'oklch(0.95 0.04 160)',
      '--focus': 'oklch(0.65 0.15 160)',
      '--primary': 'oklch(0.65 0.15 160)',
      '--primary-foreground': 'oklch(0.985 0 0)',
      '--ring': 'oklch(0.65 0.15 160)',
      '--accent': 'oklch(0.95 0.04 160)',
      '--accent-foreground': 'oklch(0.3 0.08 160)',
    },
  },
  violet: {
    label: 'Violet',
    swatch: '#8b5cf6',
    vars: {
      '--brand': 'oklch(0.6 0.18 300)',
      '--brand-foreground': 'oklch(0.985 0 0)',
      '--brand-soft': 'oklch(0.95 0.03 300)',
      '--focus': 'oklch(0.6 0.18 300)',
      '--primary': 'oklch(0.6 0.18 300)',
      '--primary-foreground': 'oklch(0.985 0 0)',
      '--ring': 'oklch(0.6 0.18 300)',
      '--accent': 'oklch(0.95 0.03 300)',
      '--accent-foreground': 'oklch(0.3 0.1 300)',
    },
  },
  amber: {
    label: 'Amber',
    swatch: '#f59e0b',
    vars: {
      '--brand': 'oklch(0.72 0.16 70)',
      '--brand-foreground': 'oklch(0.18 0.02 70)',
      '--brand-soft': 'oklch(0.95 0.05 70)',
      '--focus': 'oklch(0.72 0.16 70)',
      '--primary': 'oklch(0.72 0.16 70)',
      '--primary-foreground': 'oklch(0.18 0.02 70)',
      '--ring': 'oklch(0.72 0.16 70)',
      '--accent': 'oklch(0.95 0.05 70)',
      '--accent-foreground': 'oklch(0.3 0.08 70)',
    },
  },
  rose: {
    label: 'Rose',
    swatch: '#f43f5e',
    vars: {
      '--brand': 'oklch(0.62 0.21 16)',
      '--brand-foreground': 'oklch(0.985 0 0)',
      '--brand-soft': 'oklch(0.95 0.04 16)',
      '--focus': 'oklch(0.62 0.21 16)',
      '--primary': 'oklch(0.62 0.21 16)',
      '--primary-foreground': 'oklch(0.985 0 0)',
      '--ring': 'oklch(0.62 0.21 16)',
      '--accent': 'oklch(0.95 0.04 16)',
      '--accent-foreground': 'oklch(0.3 0.1 16)',
    },
  },
};

export function applyAccent(accent: AccentPreset) {
  if (typeof document === 'undefined') return;
  const preset = ACCENT_PRESETS[accent];
  if (!preset) return;
  const root = document.documentElement;
  Object.entries(preset.vars).forEach(([k, v]) => root.style.setProperty(k, v));
}
