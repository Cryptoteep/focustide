'use client';

/**
 * FocusTide ambient soundscape engine — fully synthesized via Web Audio API.
 * No audio files, no network. All sounds are generated procedurally:
 *
 *  - rain:    filtered white noise with slow amplitude modulation
 *  - waves:   brown noise with a slow LFO on a lowpass filter (ocean swell)
 *  - white:   steady white noise (classic focus aid)
 *  - brown:   brown noise (deeper, softer — great for masking)
 *  - cafe:    brown noise + sparse random "clink" tones (cafe murmur)
 *  - forest:  filtered noise + occasional bird-like chirps
 */

export type SoundscapeName = 'rain' | 'waves' | 'white' | 'brown' | 'cafe' | 'forest';

export interface SoundscapeMeta {
  name: SoundscapeName;
  label: string;
  emoji: string;
  description: string;
}

export const SOUNDSCAPES: SoundscapeMeta[] = [
  { name: 'rain', label: 'Rain', emoji: '🌧️', description: 'Steady rainfall' },
  { name: 'waves', label: 'Ocean waves', emoji: '🌊', description: 'Rolling surf' },
  { name: 'white', label: 'White noise', emoji: '📡', description: 'Pure hiss' },
  { name: 'brown', label: 'Brown noise', emoji: '🟤', description: 'Deep rumble' },
  { name: 'cafe', label: 'Cafe', emoji: '☕', description: 'Ambient murmur' },
  { name: 'forest', label: 'Forest', emoji: '🌲', description: 'Birds & breeze' },
];

class SoundscapeEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private activeNodes: AudioNode[] = [];
  private intervals: number[] = [];
  private current: SoundscapeName | null = null;
  private volume = 0.5;

  private ensureCtx(): AudioContext {
    if (!this.ctx) {
      const AC = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AC();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = this.volume;
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') void this.ctx.resume();
    return this.ctx;
  }

  private makeNoiseBuffer(ctx: AudioContext, type: 'white' | 'brown', seconds = 3): AudioBuffer {
    const len = ctx.sampleRate * seconds;
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buf.getChannelData(0);
    if (type === 'white') {
      for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
    } else {
      // brown noise: integrated white noise
      let last = 0;
      for (let i = 0; i < len; i++) {
        const w = Math.random() * 2 - 1;
        last = (last + 0.02 * w) / 1.02;
        data[i] = last * 3.5;
      }
    }
    return buf;
  }

  private loopBuffer(ctx: AudioContext, buf: AudioBuffer, gain: number): { source: AudioBufferSourceNode; gainNode: GainNode } {
    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.loop = true;
    const g = ctx.createGain();
    g.gain.value = gain;
    src.connect(g);
    src.start();
    return { source: src, gainNode: g };
  }

  private tone(ctx: AudioContext, freq: number, start: number, dur: number, type: OscillatorType, gain: number) {
    const osc = ctx.createOscillator();
    const env = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, start);
    env.gain.setValueAtTime(0, start);
    env.gain.linearRampToValueAtTime(gain, start + 0.02);
    env.gain.exponentialRampToValueAtTime(0.0001, start + dur);
    osc.connect(env);
    env.connect(this.masterGain!);
    osc.start(start);
    osc.stop(start + dur + 0.05);
  }

  play(name: SoundscapeName, volume = this.volume) {
    this.stop();
    const ctx = this.ensureCtx();
    this.current = name;
    this.masterGain!.gain.value = volume;

    switch (name) {
      case 'white': {
        const buf = this.makeNoiseBuffer(ctx, 'white', 3);
        const { source, gainNode } = this.loopBuffer(ctx, buf, 0.4);
        this.activeNodes.push(source, gainNode);
        break;
      }
      case 'brown': {
        const buf = this.makeNoiseBuffer(ctx, 'brown', 3);
        const { source, gainNode } = this.loopBuffer(ctx, buf, 0.5);
        this.activeNodes.push(source, gainNode);
        break;
      }
      case 'rain': {
        // white noise → bandpass → slight highpass, with slow amplitude wobble
        const buf = this.makeNoiseBuffer(ctx, 'white', 3);
        const { source, gainNode } = this.loopBuffer(ctx, buf, 0.5);
        const bp = ctx.createBiquadFilter();
        bp.type = 'bandpass';
        bp.frequency.value = 1800;
        bp.Q.value = 0.6;
        const hp = ctx.createBiquadFilter();
        hp.type = 'highpass';
        hp.frequency.value = 600;
        source.disconnect();
        source.connect(bp);
        bp.connect(hp);
        hp.connect(gainNode);
        gainNode.connect(this.masterGain!);
        // slow amplitude LFO
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        lfo.frequency.value = 0.15;
        lfoGain.gain.value = 0.08;
        lfo.connect(lfoGain);
        lfoGain.connect(gainNode.gain);
        lfo.start();
        this.activeNodes.push(source, gainNode, bp, hp, lfo, lfoGain);
        break;
      }
      case 'waves': {
        // brown noise → lowpass with slow LFO on cutoff (ocean swell)
        const buf = this.makeNoiseBuffer(ctx, 'brown', 3);
        const { source, gainNode } = this.loopBuffer(ctx, buf, 0.7);
        const lp = ctx.createBiquadFilter();
        lp.type = 'lowpass';
        lp.frequency.value = 500;
        lp.Q.value = 0.7;
        source.disconnect();
        source.connect(lp);
        lp.connect(gainNode);
        gainNode.connect(this.masterGain!);
        // swell LFO on filter cutoff
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        lfo.frequency.value = 0.08;
        lfoGain.gain.value = 280;
        lfo.connect(lfoGain);
        lfoGain.connect(lp.frequency);
        lfo.start();
        // swell LFO on volume too
        const lfo2 = ctx.createOscillator();
        const lfo2Gain = ctx.createGain();
        lfo2.frequency.value = 0.08;
        lfo2Gain.gain.value = 0.25;
        lfo2.connect(lfo2Gain);
        lfo2Gain.connect(gainNode.gain);
        lfo2.start();
        this.activeNodes.push(source, gainNode, lp, lfo, lfoGain, lfo2, lfo2Gain);
        break;
      }
      case 'cafe': {
        // brown noise base (low gain) + random clinks
        const buf = this.makeNoiseBuffer(ctx, 'brown', 3);
        const { source, gainNode } = this.loopBuffer(ctx, buf, 0.18);
        const lp = ctx.createBiquadFilter();
        lp.type = 'lowpass';
        lp.frequency.value = 800;
        source.disconnect();
        source.connect(lp);
        lp.connect(gainNode);
        gainNode.connect(this.masterGain!);
        this.activeNodes.push(source, gainNode, lp);
        // schedule random cafe clinks
        const id = window.setInterval(() => {
          if (!this.ctx || this.current !== 'cafe') return;
          const now = this.ctx.currentTime;
          // cup clink: two short high tones
          const base = 1400 + Math.random() * 800;
          this.tone(this.ctx, base, now, 0.08, 'sine', 0.04);
          this.tone(this.ctx, base * 1.5, now + 0.03, 0.06, 'sine', 0.03);
        }, 2500 + Math.random() * 3000);
        this.intervals.push(id);
        break;
      }
      case 'forest': {
        // filtered noise (breeze) + occasional bird chirps
        const buf = this.makeNoiseBuffer(ctx, 'white', 3);
        const { source, gainNode } = this.loopBuffer(ctx, buf, 0.12);
        const bp = ctx.createBiquadFilter();
        bp.type = 'bandpass';
        bp.frequency.value = 900;
        bp.Q.value = 0.4;
        source.disconnect();
        source.connect(bp);
        bp.connect(gainNode);
        gainNode.connect(this.masterGain!);
        this.activeNodes.push(source, gainNode, bp);
        // bird chirps
        const id = window.setInterval(() => {
          if (!this.ctx || this.current !== 'forest') return;
          const now = this.ctx.currentTime;
          const base = 2000 + Math.random() * 1500;
          // 2-3 quick chirps
          const n = 2 + Math.floor(Math.random() * 2);
          for (let i = 0; i < n; i++) {
            this.tone(this.ctx, base + Math.random() * 300, now + i * 0.12, 0.06, 'sine', 0.05);
          }
        }, 4000 + Math.random() * 4000);
        this.intervals.push(id);
        break;
      }
    }
  }

  stop() {
    for (const id of this.intervals) window.clearInterval(id);
    this.intervals = [];
    for (const node of this.activeNodes) {
      try {
        if ('stop' in node) (node as AudioBufferSourceNode).stop();
        node.disconnect();
      } catch {
        /* already stopped */
      }
    }
    this.activeNodes = [];
    this.current = null;
  }

  setVolume(v: number) {
    this.volume = Math.max(0, Math.min(1, v));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.05);
    }
  }

  get currentName() {
    return this.current;
  }
}

// Singleton — one engine per page
let engine: SoundscapeEngine | null = null;
export function getSoundscapeEngine(): SoundscapeEngine {
  if (typeof window === 'undefined') {
    return {} as SoundscapeEngine; // SSR guard, never used server-side
  }
  if (!engine) engine = new SoundscapeEngine();
  return engine;
}
