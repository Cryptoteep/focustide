'use client';

import * as React from 'react';
import { Waves, RefreshCw, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

/**
 * Top-level error boundary for FocusTide. If any client component throws during
 * render (e.g. corrupted localStorage producing an unexpected shape downstream),
 * we show a calm recovery screen with a one-click "reset local data" button
 * instead of a white screen.
 */
export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // No telemetry — just a console trace for local debugging.
    console.error('FocusTide error boundary caught:', error, info.componentStack);
  }

  handleReset = () => {
    try {
      localStorage.removeItem('focustide:v1');
    } catch {
      /* ignore */
    }
    this.setState({ hasError: false, error: undefined });
    // hard reload to start fresh
    window.location.reload();
  };

  handleReload = () => {
    this.setState({ hasError: false, error: undefined });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="grid min-h-screen place-items-center bg-background p-4">
          <div className="w-full max-w-md rounded-2xl border border-border/60 bg-card p-8 text-center shadow-xl">
            <div className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-2xl bg-amber-500/15 text-amber-500">
              <AlertTriangle className="h-7 w-7" />
            </div>
            <div className="mb-2 flex items-center justify-center gap-2">
              <span className="grid h-7 w-7 place-items-center rounded-lg bg-brand text-brand-foreground">
                <Waves className="h-4 w-4" />
              </span>
              <span className="text-lg font-semibold">FocusTide hit a snag</span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Something went wrong while rendering the app. Your data is still safe in this
              browser. Try reloading first — and if that doesn&apos;t help, reset the local
              data store (this clears tasks, sessions and settings).
            </p>
            {this.state.error && (
              <pre className="mt-4 max-h-32 overflow-auto rounded-lg bg-muted/60 p-3 text-left text-[11px] text-muted-foreground ft-scroll">
                {this.state.error.message}
              </pre>
            )}
            <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
              <Button onClick={this.handleReload} variant="outline">
                <RefreshCw className="mr-2 h-4 w-4" /> Reload
              </Button>
              <Button
                onClick={this.handleReset}
                className="bg-brand text-brand-foreground hover:bg-brand/90"
              >
                Reset local data
              </Button>
            </div>
            <p className="mt-6 text-xs text-muted-foreground">
              No error reports are sent anywhere — FocusTide is local-first and telemetry-free.
            </p>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
