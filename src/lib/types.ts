export type Phase = "focus" | "short-break" | "long-break";

export interface Task {
  id: string;
  title: string;
  note?: string;
  estimatedPomodoros: number;
  completedPomodoros: number;
  done: boolean;
  createdAt: number;
  completedAt?: number;
}

export interface Session {
  id: string;
  taskId?: string;
  taskTitle?: string;
  phase: Phase;
  /** Planned duration in minutes */
  durationMinutes: number;
  startedAt: number;
  endedAt: number;
  /** True if the session ran to completion, false if skipped/interrupted */
  completed: boolean;
}

export interface Settings {
  focusMinutes: number;
  shortBreakMinutes: number;
  longBreakMinutes: number;
  /** Start a long break after this many focus sessions */
  longBreakInterval: number;
  autoStartBreaks: boolean;
  autoStartFocus: boolean;
  soundEnabled: boolean;
  notificationsEnabled: boolean;
  volume: number;
  /** Brand accent preset */
  accent: AccentPreset;
  /** Show seconds in tab title */
  showSecondsInTitle: boolean;
}

export type AccentPreset = "tide" | "emerald" | "violet" | "amber" | "rose";

export interface TimerRuntime {
  phase: Phase;
  running: boolean;
  /** Total seconds for the current phase */
  totalSeconds: number;
  /** Epoch ms when the current phase should end (when running) */
  endsAt: number | null;
  /** Number of focus sessions completed in the current cycle */
  cycleCount: number;
  currentTaskId: string | null;
}

export interface StreakInfo {
  current: number;
  longest: number;
  /** ISO date strings (YYYY-MM-DD) of days with at least one completed focus session */
  activeDays: string[];
  thisWeek: number;
  totalFocusMinutes: number;
  totalSessions: number;
}
