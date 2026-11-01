import React from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  DollarSign,
  ArrowRight,
  Sparkles,
  Info,
  Check,
} from 'lucide-react';
import { Badge } from '../common/Badge';
import { cn } from '../../utils/cn';

export function InsightCard({ insight }) {
  if (!insight) return null;

  const isCritical = insight.severity === 'critical';
  const isWarning = insight.severity === 'warning';
  const isOptimal = insight.severity === 'optimal';

  return (
    <div
      className={cn(
        'rounded-xl border p-4 sm:p-5 space-y-3.5 transition-all text-slate-100',
        isCritical
          ? 'bg-rose-950/20 border-rose-500/30'
          : isWarning
          ? 'bg-amber-950/20 border-amber-500/30'
          : 'bg-harpy-navy/70 border-harpy-cardBorder/80'
      )}
    >
      {/* Top Header: Title, Category, Severity */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {isCritical ? (
            <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
          ) : isWarning ? (
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          ) : (
            <Sparkles className="w-4 h-4 text-emerald shrink-0" />
          )}
          <h4 className="text-sm font-bold text-white tracking-tight">{insight.title}</h4>
        </div>

        <div className="flex items-center gap-2">
          {insight.category && (
            <span className="text-[10px] font-semibold text-slate-400 bg-harpy-charcoal px-2 py-0.5 rounded border border-harpy-cardBorder">
              {insight.category}
            </span>
          )}
          <Badge
            variant={isCritical ? 'rose' : isWarning ? 'amber' : 'emerald'}
            size="xs"
            dot
          >
            {isCritical ? 'High Risk' : isWarning ? 'Attention' : 'Opportunity'}
          </Badge>
        </div>
      </div>

      {/* 1. Finding */}
      <div className="space-y-1">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Diagnostic Finding:
        </span>
        <p className="text-xs text-slate-200 leading-relaxed font-medium">
          {insight.finding}
        </p>
      </div>

      {/* 2. Supporting Metrics */}
      <div className="p-3 rounded-lg bg-harpy-charcoal/90 border border-harpy-cardBorder/70 space-y-1 font-mono text-[11px]">
        <div className="text-[10px] font-bold uppercase tracking-wider text-electric font-sans flex items-center gap-1">
          <Info className="w-3 h-3" />
          <span>Supporting Telemetry & Figures:</span>
        </div>
        <div className="text-slate-300 leading-relaxed break-words whitespace-pre-wrap">
          {insight.supportingMetrics}
        </div>
      </div>

      {/* 3. Business Impact */}
      <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/25 space-y-1">
        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">
          Business & Margin Impact:
        </span>
        <p className="text-xs text-emerald-200 leading-relaxed font-sans">
          {insight.businessImpact}
        </p>
      </div>

      {/* 4. Recommended Action */}
      <div className="p-3 rounded-lg bg-sky-950/20 border border-sky-500/25 space-y-1">
        <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-sky-400">
          <ArrowRight className="w-3 h-3" />
          <span>Recommended Agency Playbook:</span>
        </div>
        <p className="text-xs text-sky-200 leading-relaxed font-sans pl-2">
          {insight.recommendedAction}
        </p>
      </div>

      {/* 5. Confidence / Data Limitation Footnote */}
      {insight.confidence && (
        <div className="flex items-center gap-1.5 text-[10px] text-harpy-subtle font-mono pt-1 border-t border-harpy-cardBorder/50">
          <CheckCircle2 className="w-3 h-3 text-emerald shrink-0" />
          <span className="truncate">{insight.confidence}</span>
        </div>
      )}
    </div>
  );
}

export default InsightCard;

