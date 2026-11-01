import React, { useState } from 'react';
import { X, CheckCircle2, ShieldAlert, ArrowRight } from 'lucide-react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';

const PRESET_REASONS = [
  'Bids reduced on non-converting keywords',
  'Negative exact search terms added to campaign',
  'Daily ad budget capped to control burn rate',
  'FBA packaging re-measurement submitted to Amazon',
  'Selling price adjusted to restore target margin',
  'Intentional promotional burst (authorized variance)',
];

export function AlertResolutionModal({ alert, isOpen, onClose, onResolve }) {
  const [selectedPreset, setSelectedPreset] = useState(PRESET_REASONS[0]);
  const [customNote, setCustomNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !alert) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const finalNote = customNote.trim() ? `${selectedPreset} — ${customNote.trim()}` : selectedPreset;
    await onResolve(alert.id, finalNote);
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="relative w-full max-w-lg rounded-2xl bg-harpy-charcoal border border-harpy-cardBorder shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-harpy-cardBorder/70 bg-harpy-navy/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center text-emerald">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Resolve Performance Alert</h3>
              <p className="text-[11px] text-harpy-subtle">Log management action taken</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="p-3 rounded-xl bg-harpy-navy/60 border border-harpy-cardBorder/60 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white truncate max-w-[280px]">
                {alert.title}
              </span>
              <Badge
                variant={
                  alert.severity === 'critical'
                    ? 'rose'
                    : alert.severity === 'warning'
                    ? 'amber'
                    : 'electric'
                }
                size="xs"
              >
                {alert.severity}
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-harpy-subtle">
              <span className="font-semibold text-slate-300">{alert.brandName}</span>
              <span>•</span>
              <span className="truncate">{alert.entityName}</span>
            </div>
          </div>

          {/* Action Taken Presets */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-300">
              Select Corrective Action Taken:
            </label>
            <div className="space-y-1.5">
              {PRESET_REASONS.map((preset) => (
                <label
                  key={preset}
                  className={`flex items-center gap-2.5 p-2.5 rounded-lg border text-xs cursor-pointer transition-all ${
                    selectedPreset === preset
                      ? 'bg-emerald-950/30 border-emerald-500/50 text-white font-medium shadow-sm'
                      : 'bg-harpy-navy/30 border-harpy-cardBorder/50 text-slate-400 hover:bg-slate-800/40 hover:text-slate-200'
                  }`}
                >
                  <input
                    type="radio"
                    name="preset_reason"
                    value={preset}
                    checked={selectedPreset === preset}
                    onChange={() => setSelectedPreset(preset)}
                    className="w-3.5 h-3.5 text-emerald bg-slate-900 border-slate-700 focus:ring-emerald focus:ring-offset-0"
                  />
                  <span>{preset}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Optional notes */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300">
              Additional Notes or Ticket Reference (Optional):
            </label>
            <textarea
              rows={2}
              value={customNote}
              onChange={(e) => setCustomNote(e.target.value)}
              placeholder="e.g. Adjusted top-of-search bids down 15% via Bulk Operations sheet."
              className="w-full px-3 py-2 text-xs rounded-lg bg-harpy-navy border border-harpy-cardBorder text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald transition-colors resize-none"
            />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-harpy-cardBorder/60">
            <Button variant="ghost" size="sm" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              type="submit"
              disabled={isSubmitting}
              className="gap-2"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Resolving...' : 'Confirm Resolution'}</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AlertResolutionModal;

