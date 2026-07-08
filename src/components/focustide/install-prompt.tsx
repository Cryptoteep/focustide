'use client';

import * as React from 'react';
import { Download, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

/**
 * Shows a dismissable "Install FocusTide" banner when the browser fires the
 * `beforeinstallprompt` event (PWA install eligibility). Dismissal is remembered
 * in localStorage so we don't nag.
 */
export function InstallPrompt() {
  const [deferred, setDeferred] = React.useState<BeforeInstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = React.useState(false);

  React.useEffect(() => {
    try {
      if (localStorage.getItem('focustide:install-dismissed') === '1') {
        setDismissed(true);
        return;
    }
    } catch { /* ignore */ }

    function onBeforeInstall(e: Event) {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
    }
    window.addEventListener('beforeinstallprompt', onBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', onBeforeInstall);
  }, []);

  if (!deferred || dismissed) return null;

  async function install() {
    if (!deferred) return;
    await deferred.prompt();
    const choice = await deferred.userChoice;
    if (choice.outcome === 'accepted') {
      toast.success('FocusTide installed 🌊', { description: 'Find it on your desktop or home screen.' });
    }
    setDeferred(null);
  }

  function dismiss() {
    setDismissed(true);
    try { localStorage.setItem('focustide:install-dismissed', '1'); } catch { /* ignore */ }
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-sm rounded-2xl border border-brand/30 bg-card/95 p-4 shadow-2xl backdrop-blur-md sm:left-auto sm:right-4">
      <div className="flex items-start gap-3">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand text-brand-foreground">
          <Download className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-sm font-semibold">Install FocusTide</div>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Add to your desktop or home screen for a distraction-free, offline-ready focus app.
          </p>
          <div className="mt-3 flex gap-2">
            <Button size="sm" className="h-8 bg-brand text-brand-foreground hover:bg-brand/90" onClick={install}>
              Install
            </Button>
            <Button size="sm" variant="ghost" className="h-8" onClick={dismiss}>
              Not now
            </Button>
          </div>
        </div>
        <button
          onClick={dismiss}
          className="rounded-md p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
          aria-label="Dismiss install prompt"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
