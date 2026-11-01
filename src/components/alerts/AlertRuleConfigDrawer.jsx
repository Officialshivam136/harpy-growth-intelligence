import React, { useState } from 'react';
import { X, Sliders, Check, RotateCcw, AlertTriangle, ShieldCheck } from 'lucide-react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';

export function AlertRuleConfigDrawer({ isOpen, onClose, rules, onUpdateRule }) {
  const [localRules, setLocalRules] = useState(rules);

  if (!isOpen) return null;

  const handleThresholdChange = (ruleId, val) => {
    const num = parseFloat(val) || 0;
    setLocalRules((prev) =>
      prev.map((r) => (r.id === ruleId ? { ...r, threshold: num } : r))
    );
    onUpdateRule(ruleId, { threshold: num });
  };

  const handleToggle = (ruleId, enabled) => {
    setLocalRules((prev) =>
      prev.map((r) => (r.id === ruleId ? { ...r, enabled } : r))
    );
    onUpdateRule(ruleId, { enabled });
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-md h-full bg-harpy-charcoal border-l border-harpy-cardBorder shadow-2xl flex flex-col animate-in slide-in-from-right duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-harpy-cardBorder/70 bg-harpy-navy/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-electric/15 border border-electric/30 flex items-center justify-center text-electric">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Detection Rules & Thresholds</h3>
              <p className="text-[11px] text-harpy-subtle">Configure automated trigger tolerances</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Rule List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="p-3 rounded-xl bg-harpy-navy/50 border border-harpy-cardBorder/50 text-[11px] text-harpy-subtle leading-relaxed">
            These rules continuously analyze brand comparison telemetry, advertising metrics, and unit economics. Modifying thresholds dynamically recalibrates active alerts.
          </div>

          {localRules.map((rule) => (
            <div
              key={rule.id}
              className={`p-4 rounded-xl border transition-all ${
                rule.enabled
                  ? 'bg-harpy-navy/40 border-harpy-cardBorder hover:border-slate-700'
                  : 'bg-harpy-charcoal/40 border-harpy-cardBorder/40 opacity-60'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{rule.name}</span>
                    <Badge
                      variant={
                        rule.severity === 'critical'
                          ? 'rose'
                          : rule.severity === 'warning'
                          ? 'amber'
                          : 'electric'
                      }
                      size="xs"
                    >
                      {rule.severity}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-harpy-subtle">{rule.description}</p>
                </div>

                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={rule.enabled}
                    onChange={(e) => handleToggle(rule.id, e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-8 h-4 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-emerald"></div>
                </label>
              </div>

              {/* Threshold input */}
              <div className="flex items-center justify-between pt-2 border-t border-harpy-cardBorder/40">
                <span className="text-[11px] font-medium text-slate-400">
                  Trigger Condition ({rule.operator} {rule.threshold}{rule.unit}):
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-300">{rule.operator}</span>
                  <input
                    type="number"
                    value={rule.threshold}
                    disabled={!rule.enabled}
                    onChange={(e) => handleThresholdChange(rule.id, e.target.value)}
                    className="w-16 px-2 py-1 text-xs text-right font-bold rounded bg-harpy-navy border border-harpy-cardBorder text-white focus:outline-none focus:border-emerald disabled:opacity-40"
                  />
                  <span className="text-xs font-semibold text-slate-400">{rule.unit}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-harpy-cardBorder/70 bg-harpy-navy/80 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">Tolerances auto-saved</span>
          <Button variant="primary" size="sm" onClick={onClose}>
            Done
          </Button>
        </div>
      </div>
    </div>
  );
}

export default AlertRuleConfigDrawer;

