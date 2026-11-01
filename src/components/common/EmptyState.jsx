import React from 'react';
import { PackageSearch } from 'lucide-react';
import { Button } from './Button';
import { cn } from '../../utils/cn';

export function EmptyState({
  icon: Icon = PackageSearch,
  title = 'No Amazon Data Available',
  description = 'There are no records matching your current brand, marketplace, or date range filters.',
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
  className,
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-16 px-6 text-center rounded-xl bg-harpy-card/40 border border-dashed border-harpy-cardBorder/80',
        className
      )}
    >
      <div className="w-12 h-12 rounded-xl bg-slate-800/60 border border-slate-700/50 flex items-center justify-center text-slate-400 mb-4 shadow-inner">
        <Icon className="w-6 h-6 text-electric" />
      </div>
      <h4 className="text-base font-semibold text-slate-100">{title}</h4>
      <p className="text-xs text-harpy-subtle mt-1.5 max-w-sm mb-6 leading-relaxed">
        {description}
      </p>
      <div className="flex items-center gap-3">
        {secondaryActionLabel && (
          <Button variant="outline" size="sm" onClick={onSecondaryAction}>
            {secondaryActionLabel}
          </Button>
        )}
        {actionLabel && (
          <Button variant="primary" size="sm" onClick={onAction}>
            {actionLabel}
          </Button>
        )}
      </div>
    </div>
  );
}

export default EmptyState;

