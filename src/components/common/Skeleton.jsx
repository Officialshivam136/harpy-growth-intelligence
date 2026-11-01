import React from 'react';
import { cn } from '../../utils/cn';

export function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-slate-800/60',
        className
      )}
      {...props}
    />
  );
}

export function KpiCardSkeleton() {
  return (
    <div className="p-5 rounded-xl bg-harpy-card border border-harpy-cardBorder space-y-3">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-4 w-4 rounded-full" />
      </div>
      <Skeleton className="h-8 w-36" />
      <div className="flex items-center gap-2 pt-1">
        <Skeleton className="h-5 w-16 rounded-full" />
        <Skeleton className="h-3 w-24" />
      </div>
    </div>
  );
}

export function ChartSkeleton({ height = 'h-72' }) {
  return (
    <div className={`p-6 rounded-xl bg-harpy-card border border-harpy-cardBorder space-y-4`}>
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-3 w-32" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-7 w-16 rounded-lg" />
          <Skeleton className="h-7 w-16 rounded-lg" />
        </div>
      </div>
      <Skeleton className={`w-full ${height} rounded-lg`} />
    </div>
  );
}

export default Skeleton;

