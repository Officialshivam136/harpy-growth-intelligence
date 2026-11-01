import React from 'react';
import { ArrowUpRight, ArrowDownRight, HelpCircle } from 'lucide-react';
import { Card } from './Card';
import { Badge } from './Badge';
import { formatCurrency, formatNumber } from '../../utils/formatters';
import { cn } from '../../utils/cn';

export function KpiCard({
  title,
  value,
  type = 'currency', // 'currency' | 'percentage' | 'number' | 'units'
  suffix = '',
  change,
  changeType = 'positive', // 'positive' | 'negative' | 'neutral'
  period = 'vs last 30d',
  target,
  tooltip,
  sparkline = [],
  currency = 'USD',
  status, // 'optimal' | 'warning' | 'alert'
  className,
}) {
  const isPositive = change > 0;
  const isNegative = change < 0;

  // Render formatted main value
  const renderValue = () => {
    if (type === 'currency') {
      return formatCurrency(value, currency);
    }
    if (type === 'percentage') {
      return `${value}${suffix || '%'}`;
    }
    if (type === 'units' || type === 'number') {
      return `${formatNumber(value)}${suffix}`;
    }
    return `${value}${suffix}`;
  };

  // Sparkline path generator for lightweight inline visualization
  const renderSparkline = () => {
    if (!sparkline || sparkline.length < 2) return null;
    const min = Math.min(...sparkline);
    const max = Math.max(...sparkline);
    const range = max - min || 1;
    const width = 80;
    const height = 26;

    const points = sparkline
      .map((val, idx) => {
        const x = (idx / (sparkline.length - 1)) * width;
        const y = height - ((val - min) / range) * (height - 6) - 3;
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(' ');

    const strokeColor =
      changeType === 'positive'
        ? '#22C55E'
        : changeType === 'negative'
        ? '#F43F5E'
        : '#38BDF8';

    return (
      <svg
        className="w-20 h-7 overflow-visible opacity-80 group-hover:opacity-100 transition-opacity"
        viewBox={`0 0 ${width} ${height}`}
      >
        <polyline
          fill="none"
          stroke={strokeColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
        />
      </svg>
    );
  };

  return (
    <Card
      hover
      className={cn(
        'group p-5 relative overflow-hidden transition-all duration-300',
        status === 'warning' && 'border-amber-500/40 bg-gradient-to-b from-amber-500/5 to-transparent',
        className
      )}
    >
      {/* Top Header: Title & Info */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-harpy-subtle group-hover:text-slate-300 transition-colors">
          {title}
        </span>
        {tooltip && (
          <div className="group/tip relative flex items-center">
            <HelpCircle className="w-3.5 h-3.5 text-slate-500 hover:text-slate-300 cursor-pointer transition-colors" />
            <div className="absolute right-0 bottom-full mb-2 hidden group-hover/tip:flex flex-col z-30 w-52 p-2.5 bg-harpy-charcoal text-slate-200 text-[11px] rounded-lg shadow-xl border border-harpy-cardBorder pointer-events-none">
              {tooltip}
            </div>
          </div>
        )}
      </div>

      {/* Main Metric & Sparkline */}
      <div className="flex items-baseline justify-between gap-3 mb-3">
        <div className="text-2xl lg:text-3xl font-bold tracking-tight text-white font-sans">
          {renderValue()}
        </div>
        {renderSparkline()}
      </div>

      {/* Footer: Trend Delta & Benchmark Target */}
      <div className="flex items-center justify-between text-xs pt-1 border-t border-harpy-cardBorder/40">
        <div className="flex items-center gap-1.5">
          {change !== undefined && (
            <Badge
              size="xs"
              variant={
                changeType === 'positive'
                  ? 'emerald'
                  : changeType === 'negative'
                  ? 'rose'
                  : 'electric'
              }
              className="px-1.5 py-0.5"
            >
              {isPositive ? (
                <ArrowUpRight className="w-3 h-3" />
              ) : isNegative ? (
                <ArrowDownRight className="w-3 h-3" />
              ) : null}
              {Math.abs(change)}%
            </Badge>
          )}
          <span className="text-harpy-muted text-[11px]">{period}</span>
        </div>

        {target && (
          <span className="text-[11px] text-harpy-muted font-medium">
            Goal: <span className="text-slate-300">{target}</span>
          </span>
        )}
      </div>
    </Card>
  );
}

export default KpiCard;

