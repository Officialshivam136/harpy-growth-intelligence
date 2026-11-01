import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './Card';
import { Skeleton } from './Skeleton';
import { EmptyState } from './EmptyState';
import { cn } from '../../utils/cn';

export function ChartCard({
  title,
  subtitle,
  badge,
  actions,
  children,
  isLoading = false,
  isEmpty = false,
  emptyMessage,
  height = 'h-80',
  className,
}) {
  return (
    <Card className={cn('flex flex-col', className)}>
      <CardHeader className="flex-wrap gap-2">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <CardTitle>{title}</CardTitle>
            {badge}
          </div>
          {subtitle && <CardDescription>{subtitle}</CardDescription>}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </CardHeader>
      <CardContent className="flex-1 p-5">
        {isLoading ? (
          <div className={`w-full ${height} flex items-center justify-center`}>
            <Skeleton className="w-full h-full rounded-lg" />
          </div>
        ) : isEmpty ? (
          <EmptyState
            title={emptyMessage || 'No Chart Data'}
            description="Adjust your date range or filters to inspect telemetry."
            className="my-2 border-0 bg-transparent py-8"
          />
        ) : (
          <div className={`w-full ${height}`}>{children}</div>
        )}
      </CardContent>
    </Card>
  );
}

export default ChartCard;

