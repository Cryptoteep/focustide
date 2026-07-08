'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Phase, Session, Settings, Task, TimerRuntime } from './types';
import { playSound, showNotification } from './sound';

export const DEFAULT_SETTINGS: Settings = {
  focusMinutes: 25,
  shortBreakMinutes: 5,
  longBreakMinutes: 15,
  longBreakInterval: 4,
  autoStartBreaks: false,
  autoStartFocus: false,
  soundEnabled: true,
  notificationsEnabled: false,
  volume: 0.7,
  accent: 'tide',
  showSecondsInTitle: true,
  dailyGoalMinutes: 120,
};

function uid(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function minutesFor(phase: Phase, s: Settings): number {
  switch (phase) {
    case 'focus':
      return s.focusMinutes;
    case 'short-break':
      return s.shortBreakMinutes;
    case 'long-break':
      return s.longBreakMinutes;
  }
}

function nextPhaseAfter(phase: Phase, cycleCount: number, s: Settings): Phase {
  if (phase === 'focus') {
    const completed = cycleCount + 1;
    return completed % s.longBreakInterval === 0 ? 'long-break' : 'short-break';
  }
  return 'focus';
}

interface FocusState {
  tasks: Task[];
  sessions: Session[];
  settings: Settings;
  runtime: TimerRuntime;
  hydrated: boolean;

  // hydration
  setHydrated: () => void;

  // tasks
  addTask: (title: string, estimatedPomodoros?: number, note?: string) => string;
  updateTask: (id: string, patch: Partial<Task>) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  clearCompletedTasks: () => void;
  reorderTasks: (ids: string[]) => void;
  incrementTaskPomodoro: (id: string) => void;
  setCurrentTask: (id: string | null) => void;

  // settings
  updateSettings: (patch: Partial<Settings>) => void;
  resetSettings: () => void;

  // timer
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  skipPhase: () => void;
  setPhase: (phase: Phase) => void;
  /** Called by the ticking hook when the running timer reaches zero */
  completePhase: () => void;
  tickSync: () => void;

  // data
  clearAllData: () => void;
  importData: (data: { tasks?: Task[]; sessions?: Session[]; settings?: Partial<Settings> }) => void;
  addSession: (session: Session) => void;
}

function freshRuntime(settings: Settings): TimerRuntime {
  return {
    phase: 'focus',
    running: false,
    totalSeconds: Math.round(settings.focusMinutes * 60),
    endsAt: null,
    cycleCount: 0,
    currentTaskId: null,
  };
}

export const useFocusStore = create<FocusState>()(
  persist(
    (set, get) => ({
      tasks: [],
      sessions: [],
      settings: DEFAULT_SETTINGS,
      runtime: freshRuntime(DEFAULT_SETTINGS),
      hydrated: false,

      setHydrated: () => set({ hydrated: true }),

      addTask: (title, estimatedPomodoros = 1, note) => {
        const t: Task = {
          id: uid(),
          title: title.trim() || 'Untitled task',
          note: note?.trim() || undefined,
          estimatedPomodoros: Math.max(1, Math.round(estimatedPomodoros)),
          completedPomodoros: 0,
          done: false,
          createdAt: Date.now(),
        };
        set((st) => ({ tasks: [...st.tasks, t] }));
        return t.id;
      },

      updateTask: (id, patch) =>
        set((st) => ({
          tasks: st.tasks.map((t) => (t.id === id ? { ...t, ...patch } : t)),
        })),

      toggleTask: (id) =>
        set((st) => ({
          tasks: st.tasks.map((t) =>
            t.id === id
              ? { ...t, done: !t.done, completedAt: !t.done ? Date.now() : undefined }
              : t,
          ),
        })),

      deleteTask: (id) =>
        set((st) => ({
          tasks: st.tasks.filter((t) => t.id !== id),
          runtime:
            st.runtime.currentTaskId === id
              ? { ...st.runtime, currentTaskId: null }
              : st.runtime,
        })),

      clearCompletedTasks: () =>
        set((st) => ({ tasks: st.tasks.filter((t) => !t.done) })),

      reorderTasks: (ids) =>
        set((st) => {
          const map = new Map(st.tasks.map((t) => [t.id, t]));
          const next = ids.map((id) => map.get(id)).filter(Boolean) as Task[];
          // append any tasks not in the id list (defensive)
          for (const t of st.tasks) if (!ids.includes(t.id)) next.push(t);
          return { tasks: next };
        }),

      incrementTaskPomodoro: (id) =>
        set((st) => ({
          tasks: st.tasks.map((t) =>
            t.id === id ? { ...t, completedPomodoros: t.completedPomodoros + 1 } : t,
          ),
        })),

      setCurrentTask: (id) =>
        set((st) => ({ runtime: { ...st.runtime, currentTaskId: id } })),

      updateSettings: (patch) =>
        set((st) => {
          const settings = { ...st.settings, ...patch };
          // if focus duration changed while idle on focus phase, refresh totalSeconds
          let runtime = st.runtime;
          if (!runtime.running) {
            runtime = {
              ...runtime,
              totalSeconds: Math.round(minutesFor(runtime.phase, settings) * 60),
            };
          }
          return { settings, runtime };
        }),

      resetSettings: () =>
        set((st) => ({
          settings: DEFAULT_SETTINGS,
          runtime: freshRuntime(DEFAULT_SETTINGS),
        })),

      startTimer: () => {
        const { runtime, settings } = get();
        if (runtime.running) return;
        const now = Date.now();
        const endsAt = now + runtime.totalSeconds * 1000;
        set({ runtime: { ...runtime, running: true, endsAt } });
        if (settings.soundEnabled) playSound('start', settings.volume);
      },

      pauseTimer: () => {
        const { runtime, settings } = get();
        if (!runtime.running) return;
        const remaining = runtime.endsAt ? Math.max(0, runtime.endsAt - Date.now()) : runtime.totalSeconds * 1000;
        set({
          runtime: {
            ...runtime,
            running: false,
            endsAt: null,
            totalSeconds: Math.round(remaining / 1000),
          },
        });
        if (settings.soundEnabled) playSound('tick', settings.volume * 0.4);
      },

      resetTimer: () => {
        const { runtime, settings } = get();
        set({
          runtime: {
            ...runtime,
            running: false,
            endsAt: null,
            totalSeconds: Math.round(minutesFor(runtime.phase, settings) * 60),
          },
        });
      },

      skipPhase: () => {
        const { runtime, settings } = get();
        const next = nextPhaseAfter(runtime.phase, runtime.cycleCount, settings);
        const newCycle = runtime.phase === 'focus' ? runtime.cycleCount + 1 : runtime.cycleCount;
        set({
          runtime: {
            ...runtime,
            running: false,
            endsAt: null,
            phase: next,
            cycleCount: newCycle,
            totalSeconds: Math.round(minutesFor(next, settings) * 60),
          },
        });
      },

      setPhase: (phase) => {
        const { settings } = get();
        set((st) => ({
          runtime: {
            ...st.runtime,
            phase,
            running: false,
            endsAt: null,
            totalSeconds: Math.round(minutesFor(phase, settings) * 60),
          },
        }));
      },

      completePhase: () => {
        const { runtime, settings, tasks } = get();
        const now = Date.now();
        const session: Session = {
          id: uid(),
          taskId: runtime.currentTaskId ?? undefined,
          taskTitle: runtime.currentTaskId
            ? tasks.find((t) => t.id === runtime.currentTaskId)?.title
            : undefined,
          phase: runtime.phase,
          durationMinutes: minutesFor(runtime.phase, settings),
          startedAt: now - runtime.totalSeconds * 1000,
          endedAt: now,
          completed: true,
        };

        const completed = runtime.phase === 'focus' ? runtime.cycleCount + 1 : runtime.cycleCount;
        const next = nextPhaseAfter(runtime.phase, runtime.cycleCount, settings);
        const nextSeconds = Math.round(minutesFor(next, settings) * 60);

        // notifications & sound
        if (settings.soundEnabled) {
          playSound(runtime.phase === 'focus' ? 'complete' : 'break', settings.volume);
        }
        if (settings.notificationsEnabled) {
          if (runtime.phase === 'focus') {
            showNotification('Focus session complete 🌊', 'Nice work. Time for a break.');
          } else {
            showNotification('Break is over', 'Ready for another deep-work tide?');
          }
        }

        // increment task pomodoro count
        let nextTasks = tasks;
        if (runtime.phase === 'focus' && runtime.currentTaskId) {
          nextTasks = tasks.map((t) =>
            t.id === runtime.currentTaskId
              ? { ...t, completedPomodoros: t.completedPomodoros + 1 }
              : t,
          );
        }

        const autoStart =
          runtime.phase === 'focus' ? settings.autoStartBreaks : settings.autoStartFocus;

        set({
          sessions: [...get().sessions, session],
          tasks: nextTasks,
          runtime: {
            ...runtime,
            phase: next,
            cycleCount: completed,
            running: autoStart,
            totalSeconds: nextSeconds,
            endsAt: autoStart ? now + nextSeconds * 1000 : null,
          },
        });
      },

      tickSync: () => {
        // safety: not used directly; the timer hook drives completion
        const { runtime } = get();
        if (runtime.running && runtime.endsAt && Date.now() >= runtime.endsAt) {
          get().completePhase();
        }
      },

      clearAllData: () =>
        set((st) => ({
          tasks: [],
          sessions: [],
          runtime: freshRuntime(st.settings),
        })),

      importData: (data) =>
        set((st) => ({
          tasks: data.tasks ?? st.tasks,
          sessions: data.sessions ?? st.sessions,
          settings: { ...st.settings, ...(data.settings ?? {}) },
          runtime: freshRuntime({ ...st.settings, ...(data.settings ?? {}) }),
        })),

      addSession: (session) =>
        set((st) => ({ sessions: [...st.sessions, session] })),
    }),
    {
      name: 'focustide:v1',
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({
        tasks: s.tasks,
        sessions: s.sessions,
        settings: s.settings,
        runtime: s.runtime,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    },
  ),
);
