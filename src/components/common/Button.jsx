import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../utils/cn';

export const Button = React.forwardRef(
  (
    {
      children,
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      disabled = false,
      leftIcon,
      rightIcon,
      type = 'button',
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-harpy-navy disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer select-none';

    const variants = {
      primary:
        'bg-emerald hover:bg-emerald-400 text-slate-950 font-semibold shadow-emerald-glow hover:shadow-emerald/40 focus:ring-emerald active:scale-[0.98]',
      secondary:
        'bg-electric/15 hover:bg-electric/25 text-electric-light border border-electric/40 hover:border-electric/70 shadow-electric-glow focus:ring-electric active:scale-[0.98]',
      outline:
        'bg-harpy-card/80 hover:bg-harpy-cardHover text-slate-200 border border-harpy-cardBorder hover:border-slate-600 focus:ring-slate-500 active:scale-[0.98]',
      ghost:
        'text-slate-300 hover:text-white hover:bg-slate-800/60 focus:ring-slate-600',
      danger:
        'bg-rose-500/15 text-rose-400 border border-rose-500/30 hover:bg-rose-500/25 focus:ring-rose-500 active:scale-[0.98]',
    };

    const sizes = {
      xs: 'text-xs px-2.5 py-1.5 gap-1.5',
      sm: 'text-xs px-3 py-2 gap-2',
      md: 'text-sm px-4 py-2.5 gap-2.5',
      lg: 'text-base px-5 py-3 gap-3',
    };

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>
        )}
        <span>{children}</span>
        {!isLoading && rightIcon && (
          <span className="inline-flex shrink-0">{rightIcon}</span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
export default Button;

