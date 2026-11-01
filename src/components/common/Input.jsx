import React from 'react';
import { cn } from '../../utils/cn';

export const Input = React.forwardRef(
  ({ className, type = 'text', leftIcon, rightIcon, error, ...props }, ref) => {
    return (
      <div className="relative w-full">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            {leftIcon}
          </div>
        )}
        <input
          type={type}
          ref={ref}
          className={cn(
            'w-full bg-harpy-charcoal/80 border border-harpy-cardBorder rounded-lg text-sm text-slate-100 placeholder-slate-500',
            'px-3.5 py-2 transition-all duration-150',
            'focus:outline-none focus:ring-1 focus:ring-electric focus:border-electric',
            'hover:border-slate-700',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            leftIcon && 'pl-10',
            rightIcon && 'pr-10',
            error && 'border-rose-500/80 focus:ring-rose-500 focus:border-rose-500',
            className
          )}
          {...props}
        />
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400">
            {rightIcon}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;

