import React from 'react';
import { cn } from '../../utils/cn';

export function Badge({
  children,
  variant = 'slate',
  size = 'sm',
  dot = false,
  pulseDot = false,
  className,
  ...props
}) {
  const variants = {
    emerald: 'bg-emerald-950/60 text-emerald-400 border-emerald-500/30',
    electric: 'bg-sky-950/60 text-sky-400 border-sky-500/30',
    amber: 'bg-amber-950/60 text-amber-400 border-amber-500/30',
    rose: 'bg-rose-950/60 text-rose-400 border-rose-500/30',
    purple: 'bg-purple-950/60 text-purple-300 border-purple-500/30',
    slate: 'bg-slate-900/80 text-slate-300 border-slate-700/50',
  };

  const dotColors = {
    emerald: 'bg-emerald-400',
    electric: 'bg-sky-400',
    amber: 'bg-amber-400',
    rose: 'bg-rose-400',
    purple: 'bg-purple-400',
    slate: 'bg-slate-400',
  };

  const sizes = {
    xs: 'text-[10px] px-1.5 py-0.5 gap-1 font-medium',
    sm: 'text-xs px-2.5 py-1 gap-1.5 font-medium',
    md: 'text-sm px-3 py-1.5 gap-2 font-medium',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border tracking-wide whitespace-nowrap',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {dot && (
        <span
          className={cn(
            'w-1.5 h-1.5 rounded-full shrink-0',
            dotColors[variant] || 'bg-slate-400',
            pulseDot && 'animate-pulse'
          )}
        />
      )}
      {children}
    </span>
  );
}

export default Badge;

