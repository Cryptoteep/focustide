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
import { Plus, Check, Trash2, GripVertical, Target, Crosshair, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useFocusStore } from '@/lib/store';
import type { Task } from '@/lib/types';
import { toast } from 'sonner';

export function TaskList() {
  const tasks = useFocusStore((s) => s.tasks);
  const addTask = useFocusStore((s) => s.addTask);
  const reorderTasks = useFocusStore((s) => s.reorderTasks);
  const clearCompleted = useFocusStore((s) => s.clearCompletedTasks);

  const [title, setTitle] = React.useState('');
  const [estimate, setEstimate] = React.useState('1');

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

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    const est = Math.max(1, parseInt(estimate, 10) || 1);
    addTask(title, est);
    setTitle('');
    setEstimate('1');
    toast.success('Task added');
  }

  const open = tasks.filter((t) => !t.done);
  const done = tasks.filter((t) => t.done);

  return (
    <div className="flex h-full flex-col">
      <form onSubmit={submit} className="flex gap-2">
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
      </form>

      <div className="mt-4 flex-1 overflow-y-auto ft-scroll pr-1">
        {tasks.length === 0 ? (
          <EmptyState />
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
        <div className="mt-0.5 flex items-center gap-2 text-[11px] text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Target className="h-3 w-3" />
            {task.completedPomodoros}/{task.estimatedPomodoros}
          </span>
          {task.note && <span className="truncate">· {task.note}</span>}
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
