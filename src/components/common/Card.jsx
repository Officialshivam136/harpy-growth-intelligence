import React from 'react';
import { cn } from '../../utils/cn';

export function Card({ children, className, hover = false, glow = false, ...props }) {
  return (
    <div
      className={cn(
        'rounded-xl bg-harpy-card border border-harpy-cardBorder text-slate-100 shadow-card transition-all duration-200',
        hover && 'hover:border-harpy-cardBorderHover hover:bg-harpy-cardHover',
        glow && 'relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-r before:from-electric/5 before:to-emerald/5 before:pointer-events-none',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className, ...props }) {
  return (
    <div
      className={cn(
        'flex items-center justify-between px-6 py-4 border-b border-harpy-cardBorder/60 gap-4',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardTitle({ children, className, ...props }) {
  return (
    <h3
      className={cn(
        'text-base font-semibold text-slate-100 tracking-tight flex items-center gap-2',
        className
      )}
      {...props}
    >
      {children}
    </h3>
  );
}

export function CardDescription({ children, className, ...props }) {
  return (
    <p className={cn('text-xs text-harpy-subtle mt-0.5', className)} {...props}>
      {children}
    </p>
  );
}

export function CardContent({ children, className, ...props }) {
  return (
    <div className={cn('p-6', className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className, ...props }) {
  return (
    <div
      className={cn(
        'flex items-center justify-between px-6 py-3.5 border-t border-harpy-cardBorder/60 bg-harpy-charcoal/30 text-xs text-harpy-subtle rounded-b-xl',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export default Card;

