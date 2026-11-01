import React from 'react';
import { X, Check, ArrowRight, Award, AlertCircle } from 'lucide-react';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { formatCurrency, formatNumber } from '../../utils/formatters';
import { cn } from '../../utils/cn';

export function CampaignCompareModal({ isOpen, onClose, campaigns = [] }) {
  if (!isOpen || campaigns.length < 2) return null;

  // Identify winners
  const bestRoas = Math.max(...campaigns.map((c) => c.roas));
  const bestAcos = Math.min(...campaigns.map((c) => c.acos));
  const highestSales = Math.max(...campaigns.map((c) => c.adSales));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-4xl bg-harpy-charcoal border border-harpy-cardBorder rounded-2xl shadow-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-harpy-cardBorder/70 bg-harpy-navy/70">
          <div>
            <h3 className="text-base font-bold text-white">Campaign Side-by-Side Comparison</h3>
            <p className="text-xs text-harpy-subtle">
              Evaluating {campaigns.length} advertising campaigns across return on ad spend and targeting efficiency
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Table */}
        <div className="p-6 overflow-y-auto">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-harpy-cardBorder text-harpy-subtle">
                  <th className="py-3 px-4 w-44 uppercase text-[10px] tracking-wider font-semibold">
                    Metric
                  </th>
                  {campaigns.map((c) => (
                    <th key={c.id} className="py-3 px-4 min-w-[200px]">
                      <div className="space-y-1">
                        <span className="text-[10px] text-electric font-mono block">
                          [{c.brandName}]
                        </span>
                        <span className="font-bold text-white text-xs block leading-tight line-clamp-2">
                          {c.name}
                        </span>
                        <div className="flex items-center gap-1.5 mt-1">
                          <Badge variant="slate" size="xs">
                            {c.type}
                          </Badge>
                          <Badge
                            variant={c.status === 'Active' ? 'emerald' : 'rose'}
                            size="xs"
                            dot
                          >
                            {c.status}
                          </Badge>
                        </div>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-harpy-cardBorder/50">
                {/* Spend */}
                <tr>
                  <td className="py-3 px-4 font-semibold text-harpy-subtle">Ad Spend</td>
                  {campaigns.map((c) => (
                    <td key={c.id} className="py-3 px-4 font-bold text-white">
                      {formatCurrency(c.spend, c.currency || 'USD')}
                    </td>
                  ))}
                </tr>

                {/* Sales */}
                <tr>
                  <td className="py-3 px-4 font-semibold text-harpy-subtle">Attributed Sales</td>
                  {campaigns.map((c) => {
                    const isWinner = c.adSales === highestSales;
                    return (
                      <td key={c.id} className="py-3 px-4 font-bold text-emerald">
                        <div className="flex items-center gap-1.5">
                          <span>{formatCurrency(c.adSales, c.currency || 'USD')}</span>
                          {isWinner && (
                            <Badge variant="emerald" size="xs">
                              Highest
                            </Badge>
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>

                {/* ROAS */}
                <tr>
                  <td className="py-3 px-4 font-semibold text-harpy-subtle">Return on Ad Spend (ROAS)</td>
                  {campaigns.map((c) => {
                    const isWinner = c.roas === bestRoas;
                    return (
                      <td key={c.id} className="py-3 px-4 font-bold text-white">
                        <div className="flex items-center gap-1.5">
                          <span className={isWinner ? 'text-emerald text-sm' : ''}>
                            {c.roas}x
                          </span>
                          {isWinner && (
                            <Badge variant="emerald" size="xs">
                              Best Return
                            </Badge>
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>

                {/* ACOS */}
                <tr>
                  <td className="py-3 px-4 font-semibold text-harpy-subtle">Advertising Cost of Sales (ACoS)</td>
                  {campaigns.map((c) => {
                    const isWinner = c.acos === bestAcos;
                    return (
                      <td key={c.id} className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={cn(
                              'font-bold',
                              c.acos < 22 ? 'text-emerald' : c.acos < 28 ? 'text-sky-400' : 'text-amber-400'
                            )}
                          >
                            {c.acos}%
                          </span>
                          {isWinner && (
                            <Badge variant="emerald" size="xs">
                              Most Efficient
                            </Badge>
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>

                {/* Orders */}
                <tr>
                  <td className="py-3 px-4 font-semibold text-harpy-subtle">Orders Generated</td>
                  {campaigns.map((c) => (
                    <td key={c.id} className="py-3 px-4 font-semibold text-slate-200">
                      {formatNumber(c.orders)}
                    </td>
                  ))}
                </tr>

                {/* Cost Per Click (CPC) */}
                <tr>
                  <td className="py-3 px-4 font-semibold text-harpy-subtle">Cost Per Click (CPC)</td>
                  {campaigns.map((c) => (
                    <td key={c.id} className="py-3 px-4 font-mono text-slate-300">
                      {formatCurrency(c.cpc, c.currency || 'USD')}
                    </td>
                  ))}
                </tr>

                {/* Click-Through Rate (CTR) */}
                <tr>
                  <td className="py-3 px-4 font-semibold text-harpy-subtle">Click-Through Rate (CTR)</td>
                  {campaigns.map((c) => (
                    <td key={c.id} className="py-3 px-4 font-semibold text-slate-200">
                      {c.ctr}%
                    </td>
                  ))}
                </tr>

                {/* Budget Pacing */}
                <tr>
                  <td className="py-3 px-4 font-semibold text-harpy-subtle">Budget Pacing</td>
                  {campaigns.map((c) => (
                    <td key={c.id} className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white">{c.budgetPacing}%</span>
                        <span
                          className={cn(
                            'text-[10px]',
                            c.budgetPacing >= 95 ? 'text-rose-400 font-bold' : 'text-harpy-muted'
                          )}
                        >
                          {c.budgetPacing >= 95 ? 'Capped' : 'Healthy'}
                        </span>
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Targeting Style */}
                <tr>
                  <td className="py-3 px-4 font-semibold text-harpy-subtle">Targeting Style</td>
                  {campaigns.map((c) => (
                    <td key={c.id} className="py-3 px-4 text-slate-300 font-medium">
                      {c.targeting}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-harpy-navy/80 border-t border-harpy-cardBorder flex items-center justify-between">
          <span className="text-xs text-harpy-subtle">
            Select or deselect campaigns via checkboxes in the main table to adjust comparison
          </span>
          <Button variant="primary" size="xs" onClick={onClose}>
            Done
          </Button>
        </div>
      </div>
    </div>
  );
}

export default CampaignCompareModal;

