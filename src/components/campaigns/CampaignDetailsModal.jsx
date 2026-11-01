import React from 'react';
import {
  X,
  Target,
  DollarSign,
  TrendingUp,
  Percent,
  MousePointerClick,
  Eye,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Layers,
} from 'lucide-react';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { formatCurrency, formatNumber } from '../../utils/formatters';
import { cn } from '../../utils/cn';

export function CampaignDetailsModal({ isOpen, onClose, campaign }) {
  if (!isOpen || !campaign) return null;

  const cur = campaign.currency || 'USD';

  const formatBrandCurrency = (val) => {
    if (cur === 'INR') {
      if (Math.abs(val) >= 100000) return `₹${(val / 100000).toFixed(1)} L`;
      return `₹${Math.round(val).toLocaleString('en-IN')}`;
    }
    if (cur === 'GBP') {
      return `£${Math.round(val).toLocaleString()}`;
    }
    return formatCurrency(val, 'USD');
  };

  const placements = campaign.placementShare || { topOfSearch: 55, restOfSearch: 30, productPages: 15 };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-3xl bg-harpy-charcoal border border-harpy-cardBorder rounded-2xl shadow-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-5 border-b border-harpy-cardBorder/70 bg-harpy-navy/70">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-200 border border-slate-700">
                {campaign.brandName}
              </span>
              <Badge variant="slate" size="xs">
                {campaign.type}
              </Badge>
              <Badge
                variant={
                  campaign.status === 'Active'
                    ? 'emerald'
                    : campaign.status === 'Paused'
                    ? 'slate'
                    : 'rose'
                }
                dot
                size="xs"
              >
                {campaign.status}
              </Badge>
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight">{campaign.name}</h2>
            <p className="text-xs text-harpy-subtle">
              Targeting Strategy: <strong className="text-slate-200">{campaign.targeting}</strong> • Daily Budget:{' '}
              <strong className="text-white">{formatBrandCurrency(campaign.dailyBudget)}/day</strong>
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-harpy-navy/80 border border-harpy-cardBorder">
              <span className="text-[10px] text-harpy-subtle uppercase tracking-wider font-semibold block">
                Total Spend
              </span>
              <p className="text-lg font-bold text-white mt-1">
                {formatBrandCurrency(campaign.spend)}
              </p>
              <span className="text-[10px] text-slate-400">CPC: {formatBrandCurrency(campaign.cpc)}</span>
            </div>

            <div className="p-3.5 rounded-xl bg-harpy-navy/80 border border-harpy-cardBorder">
              <span className="text-[10px] text-harpy-subtle uppercase tracking-wider font-semibold block">
                Attributed Sales
              </span>
              <p className="text-lg font-bold text-emerald mt-1">
                {formatBrandCurrency(campaign.adSales)}
              </p>
              <span className="text-[10px] text-emerald">{campaign.orders} orders generated</span>
            </div>

            <div className="p-3.5 rounded-xl bg-harpy-navy/80 border border-harpy-cardBorder">
              <span className="text-[10px] text-harpy-subtle uppercase tracking-wider font-semibold block">
                Current ACoS
              </span>
              <p className={cn('text-lg font-bold mt-1', campaign.acos <= 22 ? 'text-emerald' : campaign.acos <= 28 ? 'text-sky-400' : 'text-rose-400')}>
                {campaign.acos}%
              </p>
              <span className="text-[10px] text-harpy-subtle">Target &lt; 25%</span>
            </div>

            <div className="p-3.5 rounded-xl bg-harpy-navy/80 border border-harpy-cardBorder">
              <span className="text-[10px] text-harpy-subtle uppercase tracking-wider font-semibold block">
                Blended ROAS
              </span>
              <p className="text-lg font-bold text-white mt-1">{campaign.roas}x</p>
              <span className="text-[10px] text-emerald">CTR: {campaign.ctr}%</span>
            </div>
          </div>

          {/* Budget Pacing Progress */}
          <div className="p-4 rounded-xl bg-harpy-navy/60 border border-harpy-cardBorder space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-electric" />
                Daily Budget Utilization
              </span>
              <span className="font-bold text-white">{campaign.budgetPacing}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <div
                className={cn(
                  'h-full rounded-full transition-all duration-500',
                  campaign.budgetPacing >= 95
                    ? 'bg-rose-500'
                    : campaign.budgetPacing >= 80
                    ? 'bg-amber-400'
                    : 'bg-emerald'
                )}
                style={{ width: `${Math.min(100, campaign.budgetPacing)}%` }}
              />
            </div>
            <span className="text-[10px] text-harpy-subtle block">
              {campaign.budgetPacing >= 95
                ? '⚠️ Campaign is frequently hitting daily budget limit before peak evening hours. Consider increasing cap by 15-20%.'
                : 'Pacing is currently optimal throughout 24-hour impression windows.'}
            </span>
          </div>

          {/* Placement Distribution */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Amazon Placement Share & Multipliers
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-harpy-navy/90 border border-harpy-cardBorder">
                <span className="text-harpy-subtle block">Top of Search (First Page)</span>
                <span className="text-base font-bold text-emerald">{placements.topOfSearch}%</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Bid modifier: +35%</span>
              </div>
              <div className="p-3 rounded-lg bg-harpy-navy/90 border border-harpy-cardBorder">
                <span className="text-harpy-subtle block">Rest of Search</span>
                <span className="text-base font-bold text-electric">{placements.restOfSearch}%</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Bid modifier: +0%</span>
              </div>
              <div className="p-3 rounded-lg bg-harpy-navy/90 border border-harpy-cardBorder">
                <span className="text-harpy-subtle block">Product Pages</span>
                <span className="text-base font-bold text-slate-300">{placements.productPages}%</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Bid modifier: +10%</span>
              </div>
            </div>
          </div>

          {/* Top Keywords / Targets Table */}
          {campaign.topKeywords && campaign.topKeywords.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Keyword Targets & Telemetry
              </h4>
              <div className="overflow-x-auto rounded-xl border border-harpy-cardBorder">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-harpy-navy/90 border-b border-harpy-cardBorder text-harpy-subtle uppercase text-[10px] tracking-wider font-semibold">
                      <th className="py-2.5 px-3">Keyword / Target</th>
                      <th className="py-2.5 px-3">Match</th>
                      <th className="py-2.5 px-3">Spend</th>
                      <th className="py-2.5 px-3">Sales</th>
                      <th className="py-2.5 px-3">ACoS</th>
                      <th className="py-2.5 px-3">ROAS</th>
                      <th className="py-2.5 px-3">Current Bid</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-harpy-cardBorder/40">
                    {campaign.topKeywords.map((kw, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/40">
                        <td className="py-2.5 px-3 font-semibold text-white">{kw.keyword}</td>
                        <td className="py-2.5 px-3">
                          <Badge variant="slate" size="xs">
                            {kw.matchType}
                          </Badge>
                        </td>
                        <td className="py-2.5 px-3 text-slate-300">{formatBrandCurrency(kw.spend)}</td>
                        <td className="py-2.5 px-3 font-bold text-emerald">{formatBrandCurrency(kw.sales)}</td>
                        <td className="py-2.5 px-3">
                          <span className={cn('font-semibold', kw.acos < 22 ? 'text-emerald' : 'text-amber-400')}>
                            {kw.acos}%
                          </span>
                        </td>
                        <td className="py-2.5 px-3 font-bold text-white">{kw.roas}x</td>
                        <td className="py-2.5 px-3 font-mono text-slate-200">
                          {cur === 'INR' ? `₹${kw.bid}` : `$${kw.bid}`}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-harpy-navy/80 border-t border-harpy-cardBorder flex items-center justify-between">
          <span className="text-xs text-harpy-subtle">
            Campaign ID: <strong className="font-mono text-slate-200">{campaign.id}</strong>
          </span>
          <Button variant="primary" size="xs" onClick={onClose}>
            Close Details
          </Button>
        </div>
      </div>
    </div>
  );
}

export default CampaignDetailsModal;

