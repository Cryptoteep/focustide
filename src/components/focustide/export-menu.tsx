'use client';

import * as React from 'react';
import { Download, Upload, FileJson, FileText, FileSpreadsheet, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useFocusStore } from '@/lib/store';
import {
  buildExportBundle,
  exportCSV,
  exportJSON,
  exportMarkdown,
  parseImport,
} from '@/lib/export';
import { toast } from 'sonner';

export function ExportMenu() {
  const tasks = useFocusStore((s) => s.tasks);
  const sessions = useFocusStore((s) => s.sessions);
  const settings = useFocusStore((s) => s.settings);
  const clearAllData = useFocusStore((s) => s.clearAllData);
  const importData = useFocusStore((s) => s.importData);
  const fileRef = React.useRef<HTMLInputElement>(null);

  function doImport(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      const parsed = parseImport(String(reader.result));
      if (!parsed) {
        toast.error('Invalid file', { description: 'Could not parse a FocusTide backup.' });
        return;
      }
      importData({ tasks: parsed.tasks, sessions: parsed.sessions, settings: parsed.settings });
      toast.success('Data imported', {
        description: `${parsed.tasks.length} tasks · ${parsed.sessions.length} sessions`,
      });
    };
    reader.readAsText(file);
  }

  return (
    <div className="flex items-center gap-2">
      <input
        ref={fileRef}
        type="file"
        accept="application/json,.json"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) doImport(f);
          e.target.value = '';
        }}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" /> Data
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel className="text-xs text-muted-foreground">Export</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => exportJSON(buildExportBundle(tasks, sessions, settings))}>
            <FileJson className="mr-2 h-4 w-4" /> Backup (JSON)
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => exportCSV(sessions)}>
            <FileSpreadsheet className="mr-2 h-4 w-4" /> Sessions (CSV)
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => exportMarkdown(tasks, sessions, settings)}>
            <FileText className="mr-2 h-4 w-4" /> Report (Markdown)
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => fileRef.current?.click()}>
            <Upload className="mr-2 h-4 w-4" /> Import backup…
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <DropdownMenuItem
                onSelect={(e) => e.preventDefault()}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" /> Clear all data…
              </DropdownMenuItem>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Erase everything?</AlertDialogTitle>
                <AlertDialogDescription>
                  This permanently deletes all tasks, sessions and settings from this browser.
                  Consider exporting a backup first. This cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  onClick={() => {
                    clearAllData();
                    toast.success('All local data cleared');
                  }}
                >
                  Erase
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
