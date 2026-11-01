import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../utils/cn';

export function LoadingState({
  title = 'Synchronizing Analytics...',
  description = 'Fetching real-time data from Amazon SP-API & Advertising endpoints.',
  className,
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-16 px-6 text-center rounded-xl bg-harpy-card/50 border border-harpy-cardBorder/50 backdrop-blur-sm',
        className
      )}
    >
      <div className="relative mb-4">
        <div className="w-12 h-12 rounded-xl bg-harpy-charcoal border border-harpy-cardBorder flex items-center justify-center shadow-emerald-glow">
          <Loader2 className="w-6 h-6 text-emerald animate-spin" />
        </div>
        <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-electric animate-ping" />
      </div>
      <h4 className="text-base font-semibold text-slate-100">{title}</h4>
      <p className="text-xs text-harpy-subtle mt-1.5 max-w-sm">{description}</p>
    </div>
  );
}

export default LoadingState;

