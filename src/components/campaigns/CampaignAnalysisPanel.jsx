import React from 'react';
import { Award, AlertOctagon, TrendingDown, DollarSign, AlertTriangle, ArrowRight, Sparkles } from 'lucide-react';
import { Card, CardContent } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { formatCurrency, formatNumber } from '../../utils/formatters';
import { cn } from '../../utils/cn';

export function CampaignAnalysisPanel({
  analysisData,
  onSelectCampaign,
  onFilterAttention,
  currency = 'USD',
}) {
  if (!analysisData) return null;

  const { bestPerforming, worstPerforming, highestSpending, requiringAttention, requiringAttentionCount } = analysisData;

  const formatBrandCurrency = (val, cur = currency) => {
    if (cur === 'INR') {
      if (Math.abs(val) >= 100000) return `₹${(val / 100000).toFixed(1)} L`;
      return `₹${Math.round(val).toLocaleString('en-IN')}`;
    }
    if (cur === 'GBP') return `£${Math.round(val).toLocaleString()}`;
    return formatCurrency(val, 'USD');
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Best Performing Campaign */}
      <Card
        hover
        onClick={() => bestPerforming && onSelectCampaign(bestPerforming)}
        className="cursor-pointer border-emerald/30 bg-gradient-to-br from-emerald-950/20 via-harpy-card to-harpy-card hover:border-emerald/60 transition-all group"
      >
        <CardContent className="p-4 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-emerald" />
              Best Performing Campaign
            </span>
            <Badge variant="emerald" size="xs">
              ROAS {bestPerforming?.roas}x
            </Badge>
          </div>

          <div>
            <h4 className="text-xs font-bold text-white group-hover:text-emerald transition-colors line-clamp-1">
              {bestPerforming?.name || 'N/A'}
            </h4>
            <span className="text-[10px] text-harpy-subtle font-mono block mt-0.5">
              [{bestPerforming?.brandName}] • {bestPerforming?.type}
            </span>
          </div>

          <div className="pt-2 border-t border-harpy-cardBorder/50 flex items-center justify-between text-xs">
            <div>
              <span className="text-[10px] text-harpy-subtle block">ACoS</span>
              <span className="font-bold text-emerald">{bestPerforming?.acos}%</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-harpy-subtle block">Attributed Sales</span>
              <span className="font-bold text-white">
                {formatBrandCurrency(bestPerforming?.adSales, bestPerforming?.currency)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. Worst Performing Campaign */}
      <Card
        hover
        onClick={() => worstPerforming && onSelectCampaign(worstPerforming)}
        className="cursor-pointer border-rose-900/30 bg-gradient-to-br from-rose-950/20 via-harpy-card to-harpy-card hover:border-rose-700/60 transition-all group"
      >
        <CardContent className="p-4 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
              <TrendingDown className="w-3.5 h-3.5 text-rose-400" />
              Worst Performing Campaign
            </span>
            <Badge variant="rose" size="xs">
              ACoS {worstPerforming?.acos}%
            </Badge>
          </div>

          <div>
            <h4 className="text-xs font-bold text-white group-hover:text-rose-300 transition-colors line-clamp-1">
              {worstPerforming?.name || 'N/A'}
            </h4>
            <span className="text-[10px] text-harpy-subtle font-mono block mt-0.5">
              [{worstPerforming?.brandName}] • {worstPerforming?.type}
            </span>
          </div>

          <div className="pt-2 border-t border-harpy-cardBorder/50 flex items-center justify-between text-xs">
            <div>
              <span className="text-[10px] text-harpy-subtle block">ROAS Return</span>
              <span className="font-bold text-rose-400">{worstPerforming?.roas}x</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-harpy-subtle block">Bleeding Spend</span>
              <span className="font-bold text-white">
                {formatBrandCurrency(worstPerforming?.spend, worstPerforming?.currency)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 3. Highest Spending Campaign */}
      <Card
        hover
        onClick={() => highestSpending && onSelectCampaign(highestSpending)}
        className="cursor-pointer border-electric/30 bg-gradient-to-br from-sky-950/20 via-harpy-card to-harpy-card hover:border-electric/60 transition-all group"
      >
        <CardContent className="p-4 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-electric flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-electric" />
              Highest Spending Campaign
            </span>
            <Badge variant="electric" size="xs">
              Budget Heavy
            </Badge>
          </div>

          <div>
            <h4 className="text-xs font-bold text-white group-hover:text-electric transition-colors line-clamp-1">
              {highestSpending?.name || 'N/A'}
            </h4>
            <span className="text-[10px] text-harpy-subtle font-mono block mt-0.5">
              [{highestSpending?.brandName}] • {highestSpending?.targeting}
            </span>
          </div>

          <div className="pt-2 border-t border-harpy-cardBorder/50 flex items-center justify-between text-xs">
            <div>
              <span className="text-[10px] text-harpy-subtle block">Ad Spend</span>
              <span className="font-bold text-white">
                {formatBrandCurrency(highestSpending?.spend, highestSpending?.currency)}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-harpy-subtle block">Generated Sales</span>
              <span className="font-bold text-emerald">
                {formatBrandCurrency(highestSpending?.adSales, highestSpending?.currency)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 4. Campaigns Requiring Attention */}
      <Card
        hover
        onClick={onFilterAttention}
        className="cursor-pointer border-amber-600/30 bg-gradient-to-br from-amber-950/20 via-harpy-card to-harpy-card hover:border-amber-500/60 transition-all group"
      >
        <CardContent className="p-4 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              Action Required
            </span>
            <Badge variant="amber" dot size="xs">
              {requiringAttentionCount} Flagged
            </Badge>
          </div>

          <div>
            <h4 className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors">
              {requiringAttentionCount} Campaigns Need Optimization
            </h4>
            <span className="text-[10px] text-harpy-subtle block mt-0.5">
              Budget capped before evening peak or high ACOS
            </span>
          </div>

          <div className="pt-2 border-t border-harpy-cardBorder/50 flex items-center justify-between text-xs text-amber-300 font-medium">
            <span>Filter flagged list</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default CampaignAnalysisPanel;

