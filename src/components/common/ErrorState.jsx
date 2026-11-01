import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from './Button';
import { cn } from '../../utils/cn';

export function ErrorState({
  title = 'Failed to Load Intelligence Data',
  message = 'An error occurred while communicating with the Amazon SP-API or analytics service.',
  onRetry,
  isRetrying = false,
  className,
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-16 px-6 text-center rounded-xl bg-rose-950/20 border border-rose-900/40',
        className
      )}
    >
      <div className="w-12 h-12 rounded-xl bg-rose-900/30 border border-rose-700/50 flex items-center justify-center text-rose-400 mb-4 shadow-lg shadow-rose-950/50">
        <AlertTriangle className="w-6 h-6" />
      </div>
      <h4 className="text-base font-semibold text-rose-200">{title}</h4>
      <p className="text-xs text-rose-300/80 mt-1.5 max-w-md mb-6 leading-relaxed">
        {message}
      </p>
      {onRetry && (
        <Button
          variant="outline"
          size="sm"
          onClick={onRetry}
          isLoading={isRetrying}
          leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
          className="border-rose-800/60 hover:bg-rose-900/40 text-rose-200"
        >
          Retry Request
        </Button>
      )}
    </div>
  );
}

export default ErrorState;

