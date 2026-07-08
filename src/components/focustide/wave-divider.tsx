'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * Decorative wave divider rendered as inline SVG — no images, scales perfectly,
 * inherits the current theme via CSS variables.
 */
export function WaveDivider({
  className,
  flip = false,
  color = 'var(--background)',
  height = 64,
}: {
  className?: string;
  flip?: boolean;
  color?: string;
  height?: number;
}) {
  return (
    <div
      className={cn('pointer-events-none relative w-full overflow-hidden', className)}
      style={{ height, transform: flip ? 'scaleY(-1)' : undefined }}
      aria-hidden
    >
      <svg
        viewBox="0 0 1440 64"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
        fill="none"
      >
        <path
          d="M0 32 C 180 8, 360 56, 540 32 C 720 8, 900 56, 1080 32 C 1260 8, 1380 48, 1440 32 L 1440 64 L 0 64 Z"
          fill={color}
        />
        <path
          d="M0 40 C 180 20, 360 60, 540 40 C 720 20, 900 60, 1080 40 C 1260 20, 1380 52, 1440 40 L 1440 64 L 0 64 Z"
          fill={color}
          opacity={0.5}
        />
      </svg>
    </div>
  );
}
