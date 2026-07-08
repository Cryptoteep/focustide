'use client';

import * as React from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Plus, Check, Trash2, GripVertical, Target, Crosshair, Pencil, Tag, X, Hash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useFocusStore } from '@/lib/store';
import type { Task } from '@/lib/types';
import { toast } from 'sonner';

const TAG_COLORS = [
  'bg-brand/15 text-brand border-brand/30',
  'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30',
  'bg-violet-500/15 text-violet-600 dark:text-violet-400 border-violet-500/30',
  'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
  'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30',
];

function tagColor(tag: string): string {
  let h = 0;
  for (let i = 0; i < tag.length; i++) h = (h * 31 + tag.charCodeAt(i)) >>> 0;
  return TAG_COLORS[h % TAG_COLORS.length];
}

export function TaskList() {
  const tasks = useFocusStore((s) => s.tasks);
  const addTask = useFocusStore((s) => s.addTask);
  const reorderTasks = useFocusStore((s) => s.reorderTasks);
  const clearCompleted = useFocusStore((s) => s.clearCompletedTasks);

  const [title, setTitle] = React.useState('');
  const [estimate, setEstimate] = React.useState('1');
  const [tagInput, setTagInput] = React.useState('');
  const [pendingTags, setPendingTags] = React.useState<string[]>([]);
  const [activeTag, setActiveTag] = React.useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  function onDragEnd(e: DragEndEvent) {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const oldIndex = tasks.findIndex((t) => t.id === active.id);
    const newIndex = tasks.findIndex((t) => t.id === over.id);
    if (oldIndex < 0 || newIndex < 0) return;
    reorderTasks(arrayMove(tasks, oldIndex, newIndex).map((t) => t.id));
  }

  function addPendingTag() {
    const clean = tagInput.trim().toLowerCase();
    if (!clean || pendingTags.includes(clean) || pendingTags.length >= 5) {
      setTagInput('');
      return;
    }
    setPendingTags([...pendingTags, clean]);
    setTagInput('');
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    const est = Math.max(1, parseInt(estimate, 10) || 1);
    addTask(title, est, undefined, pendingTags);
    setTitle('');
    setEstimate('1');
    setPendingTags([]);
    toast.success('Task added');
  }

  // all unique tags across tasks
  const allTags = React.useMemo(() => {
    const set = new Set<string>();
    for (const t of tasks) for (const tg of t.tags) set.add(tg);
    return Array.from(set).sort();
  }, [tasks]);

  const open = tasks.filter((t) => !t.done && (!activeTag || t.tags.includes(activeTag)));
  const done = tasks.filter((t) => t.done && (!activeTag || t.tags.includes(activeTag)));

  return (
    <div className="flex h-full flex-col">
      <form onSubmit={submit} className="space-y-2">
        <div className="flex gap-2">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What are you focusing on?"
            className="flex-1"
            aria-label="New task title"
          />
          <Input
            type="number"
            min={1}
            max={20}
            value={estimate}
            onChange={(e) => setEstimate(e.target.value)}
            className="w-16 text-center"
            aria-label="Estimated pomodoros"
          />
          <Button type="submit" className="bg-brand text-brand-foreground hover:bg-brand/90">
            <Plus className="h-4 w-4" />
            <span className="sr-only">Add task</span>
          </Button>
        </div>
        {/* tag input + pending tags */}
        <div className="flex flex-wrap items-center gap-1.5">
          <Hash className="h-3.5 w-3.5 text-muted-foreground" />
          <Input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ',') {
                e.preventDefault();
                addPendingTag();
              }
            }}
            placeholder="add tag (Enter)"
            className="h-7 w-32 border-dashed text-xs"
            aria-label="Task tag"
          />
          {pendingTags.map((tg) => (
            <Badge key={tg} variant="outline" className={cn('gap-1 text-[10px]', tagColor(tg))}>
              {tg}
              <button
                type="button"
                onClick={() => setPendingTags((p) => p.filter((x) => x !== tg))}
                className="ml-0.5 rounded-full hover:bg-foreground/10"
                aria-label={`Remove tag ${tg}`}
              >
                <X className="h-2.5 w-2.5" />
              </button>
            </Badge>
          ))}
        </div>
      </form>

      {/* tag filter bar */}
      {allTags.length > 0 && (
        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] text-muted-foreground">Filter:</span>
          <button
            onClick={() => setActiveTag(null)}
            className={cn(
              'rounded-full px-2 py-0.5 text-[11px] font-medium transition-colors',
              !activeTag ? 'bg-foreground text-background' : 'bg-muted/60 text-muted-foreground hover:bg-accent',
            )}
          >
            All
          </button>
          {allTags.map((tg) => (
            <button
              key={tg}
              onClick={() => setActiveTag(activeTag === tg ? null : tg)}
              className={cn(
                'rounded-full border px-2 py-0.5 text-[11px] font-medium transition-all',
                activeTag === tg
                  ? tagColor(tg) + ' ring-1 ring-offset-1 ring-offset-background'
                  : 'border-border/60 text-muted-foreground hover:text-foreground',
              )}
            >
              #{tg}
            </button>
          ))}
        </div>
      )}

      <div className="mt-4 flex-1 overflow-y-auto ft-scroll pr-1">
        {tasks.length === 0 ? (
          <EmptyState />
        ) : open.length === 0 && activeTag ? (
          <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border/70 py-10 text-center">
            <Tag className="h-6 w-6 text-muted-foreground/50" />
            <div className="text-sm text-muted-foreground">No tasks with <span className="font-medium">#{activeTag}</span></div>
          </div>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
            <SortableContext items={open.map((t) => t.id)} strategy={verticalListSortingStrategy}>
              <ul className="space-y-2">
                {open.map((t) => (
                  <SortableTask key={t.id} task={t} />
                ))}
              </ul>
            </SortableContext>
          </DndContext>
        )}

        {done.length > 0 && (
          <div className="mt-6">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                Completed · {done.length}
              </span>
              <Button variant="ghost" size="sm" className="h-7 text-xs text-muted-foreground" onClick={clearCompleted}>
                Clear
              </Button>
            </div>
            <ul className="space-y-2 opacity-70">
              {done.map((t) => (
                <TaskRow key={t.id} task={t} />
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

function SortableTask({ task }: { task: Task }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  return (
    <li ref={setNodeRef} style={style} className={cn(isDragging && 'z-10')}>
      <TaskRow task={task} dragHandle={
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab touch-none text-muted-foreground/50 hover:text-muted-foreground active:cursor-grabbing"
          aria-label="Drag to reorder"
        >
          <GripVertical className="h-4 w-4" />
        </button>
      } />
    </li>
  );
}

function TaskRow({ task, dragHandle }: { task: Task; dragHandle?: React.ReactNode }) {
  const toggleTask = useFocusStore((s) => s.toggleTask);
  const deleteTask = useFocusStore((s) => s.deleteTask);
  const setCurrentTask = useFocusStore((s) => s.setCurrentTask);
  const currentTaskId = useFocusStore((s) => s.runtime.currentTaskId);
  const isCurrent = currentTaskId === task.id;

  return (
    <div
      className={cn(
        'group flex items-center gap-2 rounded-xl border border-border/60 bg-card/60 p-3 transition-colors',
        isCurrent && 'border-brand bg-brand-soft/50',
        !task.done && 'hover:border-brand/40',
      )}
    >
      {dragHandle}
      <button
        onClick={() => toggleTask(task.id)}
        className={cn(
          'grid h-5 w-5 shrink-0 place-items-center rounded-full border transition-colors',
          task.done
            ? 'border-brand bg-brand text-brand-foreground'
            : 'border-muted-foreground/40 hover:border-brand',
        )}
        aria-label={task.done ? 'Mark as not done' : 'Mark as done'}
      >
        {task.done && <Check className="h-3 w-3" />}
      </button>

      <div className="min-w-0 flex-1">
        <div className={cn('truncate text-sm font-medium', task.done && 'line-through text-muted-foreground')}>
          {task.title}
        </div>
        <div className="mt-0.5 flex flex-wrap items-center gap-1.5 text-[11px] text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Target className="h-3 w-3" />
            {task.completedPomodoros}/{task.estimatedPomodoros}
          </span>
          {task.note && <span className="truncate">· {task.note}</span>}
          {task.tags.length > 0 && (
            <span className="flex flex-wrap gap-1">
              {task.tags.map((tg) => (
                <span key={tg} className={cn('rounded-full border px-1.5 py-px text-[9px] font-medium leading-tight', tagColor(tg))}>
                  #{tg}
                </span>
              ))}
            </span>
          )}
        </div>
      </div>

      {!task.done && (
        <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 gap-1 px-2 text-xs"
            onClick={() => {
              setCurrentTask(isCurrent ? null : task.id);
              toast.success(isCurrent ? 'Unlinked from current tide' : `Focusing on "${task.title}"`);
            }}
          >
            <Crosshair className={cn('h-3.5 w-3.5', isCurrent && 'text-brand')} />
            {isCurrent ? 'Active' : 'Focus'}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
            onClick={() => deleteTask(task.id)}
            aria-label="Delete task"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border/70 py-10 text-center">
      <div className="grid h-10 w-10 place-items-center rounded-full bg-brand/10 text-brand">
        <Pencil className="h-4 w-4" />
      </div>
      <div className="text-sm font-medium">No tasks yet</div>
      <div className="max-w-xs text-xs text-muted-foreground">
        Add your first task above and pick how many focus tides you think it&apos;ll take.
      </div>
    </div>
  );
}
