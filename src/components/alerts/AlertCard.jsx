import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock,
  ExternalLink,
  Info,
  Layers,
  RotateCcw,
  ShieldAlert,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Eye,
  Check,
} from 'lucide-react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { cn } from '../../utils/cn';

export function AlertCard({
  alert,
  onMarkRead,
  onResolveClick,
  onReopen,
}) {
  const navigate = useNavigate();

  const isCritical = alert.severity === 'critical';
  const isWarning = alert.severity === 'warning';
  const isResolved = alert.status === 'resolved';

  // Navigate to appropriate module when user investigates
  const handleInvestigate = () => {
    if (alert.entityType === 'product' && alert.entityId && alert.entityId.startsWith('B0')) {
      navigate(`/analytics/${alert.entityId}`);
    } else if (alert.entityType === 'campaign') {
      navigate('/advertising');
    } else if (alert.entityType === 'brand') {
      navigate(`/brands/${alert.brandId}`);
    } else {
      navigate('/analytics');
    }
  };

  return (
    <Card
      className={cn(
        'relative overflow-hidden transition-all duration-200 border',
        !alert.isRead && !isResolved && 'border-l-4 border-l-emerald shadow-lg',
        isResolved
          ? 'bg-harpy-navy/40 border-harpy-cardBorder/60 opacity-80'
          : isCritical
          ? 'border-rose-500/30 bg-rose-950/10 hover:border-rose-500/50'
          : isWarning
          ? 'border-amber-500/30 bg-amber-950/10 hover:border-amber-500/50'
          : 'border-harpy-cardBorder hover:border-slate-700'
      )}
    >
      <div className="p-5 sm:p-6 space-y-4">
        {/* Top Header: Brand, Entity, Severity, Timestamp */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {/* Brand Badge */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-harpy-charcoal border border-harpy-cardBorder text-xs font-semibold text-slate-200">
              <span className="w-4 h-4 rounded bg-emerald/20 text-emerald flex items-center justify-center text-[10px] font-bold">
                {alert.brandCode}
              </span>
              <span>{alert.brandName}</span>
            </div>

            {/* Entity Target Tag */}
            <button
              onClick={handleInvestigate}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-harpy-navy border border-harpy-cardBorder/80 text-xs text-sky-400 hover:text-sky-300 hover:border-sky-500/40 transition-colors group"
              title={`View ${alert.entityType} details`}
            >
              <span className="text-[10px] uppercase font-bold text-slate-400">
                {alert.entityType}:
              </span>
              <span className="font-medium truncate max-w-[200px] sm:max-w-[280px]">
                {alert.entityName}
              </span>
              <ExternalLink className="w-3 h-3 opacity-60 group-hover:opacity-100 shrink-0" />
            </button>
          </div>

          {/* Right Header Status & Badges */}
          <div className="flex items-center gap-2">
            {/* Unread indicator */}
            {!alert.isRead && !isResolved && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald/20 text-emerald border border-emerald/30 animate-pulse">
                New
              </span>
            )}

            {/* Severity Badge */}
            <Badge
              variant={isCritical ? 'rose' : isWarning ? 'amber' : 'electric'}
              size="xs"
              dot
              pulseDot={isCritical && !isResolved}
            >
              {isCritical ? 'Critical Issue' : isWarning ? 'Warning' : 'Information'}
            </Badge>

            {/* Timestamp */}
            <div className="flex items-center gap-1 text-[11px] text-harpy-subtle font-mono">
              <Clock className="w-3 h-3" />
              <span>{alert.relativeTime || 'Recently'}</span>
            </div>
          </div>
        </div>

        {/* Title and Affected Metric Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              {isCritical ? (
                <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
              ) : isWarning ? (
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              ) : (
                <Info className="w-4 h-4 text-sky-400 shrink-0" />
              )}
              <span>{alert.title}</span>
            </h3>
            <p className="text-xs text-harpy-subtle">
              Automated telemetry monitor flagged variance in{' '}
              <span className="font-semibold text-slate-200">{alert.metricAffected}</span>.
            </p>
          </div>

          {/* Metric Status Pill */}
          <div className="text-right shrink-0">
            <span className="text-[10px] uppercase font-bold text-harpy-subtle tracking-wider block">
              Metric Impact
            </span>
            <span
              className={cn(
                'text-sm font-extrabold',
                isCritical ? 'text-rose-400' : isWarning ? 'text-amber-400' : 'text-sky-400'
              )}
            >
              {alert.changePercentage}
            </span>
          </div>
        </div>

        {/* Metric Comparison Matrix (Current vs Previous vs Threshold) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-harpy-navy/70 border border-harpy-cardBorder/70">
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Current Telemetry
            </span>
            <div className="text-sm font-bold text-white flex items-center gap-1.5">
              <span>{alert.currentValue}</span>
              <span className="text-[10px] font-normal text-rose-400 bg-rose-950/40 px-1 rounded border border-rose-500/20">
                Breached
              </span>
            </div>
          </div>

          <div className="space-y-0.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Previous Benchmark
            </span>
            <div className="text-sm font-semibold text-slate-300">
              {alert.previousValue}
            </div>
          </div>

          <div className="space-y-0.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Target Tolerance
            </span>
            <div className="text-sm font-semibold text-emerald">
              {alert.thresholdValue}
            </div>
          </div>
        </div>

        {/* Reason Behind Alert (Explicit mathematical comparison) */}
        <div className="p-3.5 rounded-xl bg-harpy-charcoal/90 border border-harpy-cardBorder/80 space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300">
            <span className="w-1.5 h-1.5 rounded-full bg-electric" />
            <span>Root Cause Diagnostics:</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed font-sans pl-3">
            {alert.reason}
          </p>
        </div>

        {/* Suggested Action Box */}
        <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Recommended Optimization Playbook:</span>
          </div>
          <p className="text-xs text-emerald-200/90 leading-relaxed pl-5">
            {alert.suggestedAction}
          </p>
        </div>

        {/* Resolved Banner (if resolved) */}
        {isResolved && (
          <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-950/30 border border-emerald-500/40 text-xs text-emerald-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald shrink-0" />
              <div>
                <span className="font-bold">Resolved: </span>
                <span>{alert.resolutionNotes || 'Action verified by brand manager'}</span>
                {alert.resolvedAt && (
                  <span className="text-[10px] text-emerald-400/70 ml-2">
                    ({new Date(alert.resolvedAt).toLocaleDateString()})
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={() => onReopen(alert.id)}
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-400 hover:text-white underline ml-3"
            >
              <RotateCcw className="w-3 h-3" />
              Reopen
            </button>
          </div>
        )}

        {/* Action Controls Footer */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-harpy-cardBorder/60">
          <div className="flex items-center gap-2">
            {!alert.isRead && !isResolved && (
              <Button
                variant="ghost"
                size="xs"
                onClick={() => onMarkRead(alert.id)}
                className="text-slate-400 hover:text-white gap-1"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Mark as Read</span>
              </Button>
            )}

            <Button
              variant="outline"
              size="xs"
              onClick={handleInvestigate}
              className="gap-1.5 text-slate-300 hover:text-white"
            >
              <span>Investigate {alert.entityType}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </div>

          {!isResolved && (
            <Button
              variant="secondary"
              size="xs"
              onClick={() => onResolveClick(alert)}
              className="gap-1.5 bg-emerald-950/40 border-emerald-500/40 text-emerald hover:bg-emerald-900/60"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Resolve Alert</span>
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}

export default AlertCard;

