import React from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  AreaChart,
  Area,
  Line,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import {
  ArrowLeft,
  DollarSign,
  Package,
  TrendingUp,
  Percent,
  AlertTriangle,
  CheckCircle2,
  Sliders,
  ShieldCheck,
  FileText,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Layers,
  HelpCircle,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../common/Card';
import { ChartCard } from '../common/ChartCard';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { CustomTooltip } from '../common/CustomTooltip';
import { formatCurrency, formatNumber, formatPercentage } from '../../utils/formatters';
import { cn } from '../../utils/cn';

export function ProductDetailView({ product, onBack }) {
  if (!product) return null;

  const cur = product.currency || 'USD';

  const formatBrandCurrency = (val) => {
    if (val === null || val === undefined) return 'N/A';
    if (cur === 'INR') {
      if (Math.abs(val) >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
      if (Math.abs(val) >= 100000) return `₹${(val / 100000).toFixed(1)} L`;
      return `₹${Math.round(val).toLocaleString('en-IN')}`;
    }
    if (cur === 'GBP') {
      return `£${Math.round(val).toLocaleString()}`;
    }
    return formatCurrency(val, 'USD');
  };

  // Profit Breakdown Donut Data
  const profitBreakdownData = [
    { name: 'Product Cost (COGS)', value: product.productCost || 0, color: '#F43F5E' },
    { name: 'Amazon Referral Fees', value: product.marketplaceFees || 0, color: '#F59E0B' },
    { name: 'FBA Fulfilment Costs', value: product.fulfilmentCost || 0, color: '#38BDF8' },
    { name: 'PPC Ad Spend', value: product.adSpend || 0, color: '#A855F7' },
    { name: 'Net Contribution Profit', value: Math.max(0, product.estimatedProfit || 0), color: '#22C55E' },
  ].filter((item) => item.value > 0);

  return (
    <div className="space-y-6">
      {/* 1. Top Header & Back Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-semibold text-harpy-subtle hover:text-white transition-colors cursor-pointer group"
        >
          <div className="p-1 rounded-md bg-slate-800 border border-slate-700 group-hover:bg-slate-700">
            <ArrowLeft className="w-3.5 h-3.5" />
          </div>
          <span>Back to Product Analytics Table</span>
        </button>

        <div className="flex items-center gap-2">
          <Badge variant="slate" size="xs">
            ASIN: {product.asin}
          </Badge>
          <Badge variant="slate" size="xs">
            SKU: {product.sku}
          </Badge>
          <Badge variant="emerald" size="xs">
            Buy Box {product.buyBoxWinRate}%
          </Badge>
        </div>
      </div>

      {/* Incomplete Cost Data Alert Banner */}
      {product.isCostIncomplete && (
        <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-500/50 flex items-start gap-3 shadow-lg">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-amber-200">
              Incomplete Cost Data Detected
            </h4>
            <p className="text-xs text-amber-300/80 leading-relaxed">
              Supplier Product Cost (COGS) is currently missing for this ASIN ({product.missingExpenseFields.join(', ')}). Gross profit and estimated contribution profit calculations are flagged as provisional until supplier landed invoice is configured.
            </p>
          </div>
        </div>
      )}

      {/* 2. Product Hero Banner */}
      <div className="rounded-2xl p-6 bg-gradient-to-r from-harpy-charcoal via-harpy-card to-harpy-charcoal border border-harpy-cardBorder relative overflow-hidden shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 relative z-10">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 flex items-center justify-center font-extrabold text-white text-lg shadow-inner shrink-0">
              <Package className="w-7 h-7 text-emerald" />
            </div>
            <div className="space-y-1.5 max-w-2xl">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-200 border border-slate-700">
                  {product.brandName}
                </span>
                <span className="text-xs text-harpy-subtle font-mono">
                  {product.category}
                </span>
                <Badge
                  variant={
                    product.performanceClass === 'Star Performer'
                      ? 'emerald'
                      : product.performanceClass === 'High Revenue Low Profit'
                      ? 'amber'
                      : product.performanceClass === 'Low Performing'
                      ? 'rose'
                      : 'electric'
                  }
                  size="xs"
                >
                  {product.performanceClass}
                </Badge>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug">
                {product.title}
              </h1>
              <div className="flex items-center gap-4 text-xs text-slate-300 pt-1">
                <span>Best Sellers Rank: <strong className="text-white">#{product.bsr}</strong></span>
                <span>•</span>
                <span>FBA Stock Runway: <strong className="text-emerald">{product.fbaStockDays} days</strong></span>
                <span>•</span>
                <span>Selling Price: <strong className="text-white">{formatBrandCurrency(product.sellingPrice)}</strong></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Financial Metric Cards (Distinguishing Gross Profit from Estimated Contribution Profit) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Revenue */}
        <Card hover className="p-4">
          <span className="text-[10px] text-harpy-subtle uppercase tracking-wider font-semibold block mb-1">
            Total Revenue
          </span>
          <p className="text-2xl font-bold text-white">
            {formatBrandCurrency(product.totalRevenue)}
          </p>
          <span className="text-[10px] text-slate-400 mt-1 block">
            {formatNumber(product.unitsSold)} units sold
          </span>
        </Card>

        {/* Gross Profit */}
        <Card hover className="p-4 border-slate-700">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-harpy-subtle uppercase tracking-wider font-semibold block">
              Gross Profit
            </span>
            <span className="text-[10px] text-harpy-muted font-mono">Rev - COGS</span>
          </div>
          <p className="text-2xl font-bold text-white mt-1">
            {product.isCostIncomplete ? 'Pending' : formatBrandCurrency(product.grossProfit)}
          </p>
          <span className="text-[10px] text-slate-300 font-semibold mt-1 block">
            {product.isCostIncomplete ? 'Missing COGS' : `${product.grossMargin}% Gross Margin`}
          </span>
        </Card>

        {/* Estimated Contribution Profit (All configured costs deducted) */}
        <Card hover className="p-4 border-emerald/30 bg-emerald-950/10">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-emerald uppercase tracking-wider font-bold block">
              Contribution Profit
            </span>
            <span className="text-[10px] text-emerald font-mono">Post-All Costs</span>
          </div>
          <p className="text-2xl font-bold text-emerald mt-1">
            {product.isCostIncomplete ? 'Pending' : formatBrandCurrency(product.estimatedProfit)}
          </p>
          <span className="text-[10px] text-emerald font-semibold mt-1 block">
            {product.isCostIncomplete ? 'Incomplete' : `${product.profitMargin}% Net Margin`}
          </span>
        </Card>

        {/* Total Ad Spend & ACoS */}
        <Card hover className="p-4 border-electric/20">
          <span className="text-[10px] text-harpy-subtle uppercase tracking-wider font-semibold block mb-1">
            Advertising PPC
          </span>
          <p className="text-2xl font-bold text-white">
            {formatBrandCurrency(product.adSpend)}
          </p>
          <span className="text-[10px] text-electric font-semibold mt-1 block">
            ACoS: {product.acos}%
          </span>
        </Card>

        {/* FBA & Referral Fees */}
        <Card hover className="p-4">
          <span className="text-[10px] text-harpy-subtle uppercase tracking-wider font-semibold block mb-1">
            Amazon Channel Fees
          </span>
          <p className="text-2xl font-bold text-white">
            {formatBrandCurrency(product.marketplaceFees + product.fulfilmentCost)}
          </p>
          <span className="text-[10px] text-harpy-subtle mt-1 block">
            Referral + FBA Pick/Pack
          </span>
        </Card>
      </div>

      {/* 4. Unit Economics & Profit Waterfall Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Unit Economics Card */}
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Unit Economics Breakdown</CardTitle>
              <CardDescription>
                Full per-unit cost attribution distinguishing product cost, marketplace commissions, and fulfillment
              </CardDescription>
            </div>
            <Badge variant="emerald" size="xs">
              Per Unit Basis
            </Badge>
          </CardHeader>
          <CardContent className="space-y-3 p-5">
            <div className="flex items-center justify-between text-xs py-2 border-b border-harpy-cardBorder/60">
              <span className="text-slate-300 font-semibold">Selling Price (AOV):</span>
              <span className="font-bold text-white text-sm">
                {formatBrandCurrency(product.unitEconomics.sellingPrice)}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs py-2 border-b border-harpy-cardBorder/40">
              <span className="text-rose-400 font-medium">(-) Product Cost (COGS):</span>
              <span className="font-mono text-slate-200">
                {product.unitEconomics.cogs !== null
                  ? `-${formatBrandCurrency(product.unitEconomics.cogs)}`
                  : 'Pending Supplier Data'}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs py-2 border-b border-harpy-cardBorder/60 bg-harpy-navy/40 px-2 rounded">
              <span className="text-slate-200 font-bold">(=) Gross Profit per Unit:</span>
              <span className="font-bold text-white">
                {product.isCostIncomplete
                  ? 'Pending'
                  : formatBrandCurrency(product.unitEconomics.sellingPrice - (product.unitEconomics.cogs || 0))}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs py-2 border-b border-harpy-cardBorder/40">
              <span className="text-amber-400 font-medium">
                (-) Amazon Referral Fee ({(product.marketplaceFeeRate * 100).toFixed(0)}%):
              </span>
              <span className="font-mono text-slate-200">
                -{formatBrandCurrency(product.unitEconomics.marketplaceFee)}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs py-2 border-b border-harpy-cardBorder/40">
              <span className="text-sky-400 font-medium">(-) Amazon FBA Pick & Pack Fee:</span>
              <span className="font-mono text-slate-200">
                -{formatBrandCurrency(product.unitEconomics.fulfillmentFee)}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs py-2 border-b border-harpy-cardBorder/40">
              <span className="text-purple-400 font-medium">(-) PPC Ad Spend per Unit:</span>
              <span className="font-mono text-slate-200">
                -{formatBrandCurrency(product.unitEconomics.adSpendPerUnit)}
              </span>
            </div>

            <div className="flex items-center justify-between text-sm py-2.5 bg-emerald-950/20 border border-emerald-500/30 px-3 rounded-xl mt-2">
              <span className="text-emerald font-bold">(=) Net Contribution Profit per Unit:</span>
              <span className="font-extrabold text-emerald text-base">
                {product.isCostIncomplete
                  ? 'Incomplete Data'
                  : formatBrandCurrency(product.unitEconomics.netContributionPerUnit)}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Profit Breakdown (Donut Chart) */}
        <ChartCard
          title="Revenue Cost Structure & Profit Breakdown"
          subtitle="Proportional attribution of total revenue across all operating cost centers"
          height="h-72"
        >
          <div className="relative w-full h-full flex flex-col items-center justify-center">
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload || !payload.length) return null;
                    const item = payload[0].payload;
                    return (
                      <div className="rounded-lg bg-harpy-charcoal/95 border border-harpy-cardBorder px-3 py-2 text-xs shadow-xl">
                        <span className="font-semibold text-white block">{item.name}</span>
                        <span className="font-bold text-emerald">{formatBrandCurrency(item.value)}</span>
                      </div>
                    );
                  }}
                />
                <Pie
                  data={profitBreakdownData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={55}
                  outerRadius={78}
                  paddingAngle={3}
                  stroke="#0D111A"
                  strokeWidth={2}
                >
                  {profitBreakdownData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            {/* Custom Legend */}
            <div className="w-full grid grid-cols-2 gap-2 pt-2 border-t border-harpy-cardBorder/50 text-[11px]">
              {profitBreakdownData.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between min-w-0">
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="w-2 h-2 rounded-sm shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="text-slate-300 truncate">{item.name}:</span>
                  </div>
                  <span className="text-white font-semibold ml-1 shrink-0">
                    {formatBrandCurrency(item.value)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </ChartCard>
      </div>

      {/* 5. Revenue & Ad Spend Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Revenue & Net Contribution Trajectory"
          subtitle="Weekly sales velocity compared against estimated net profit post-all-costs"
          height="h-72"
        >
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={product.revenueTrend} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
              <XAxis dataKey="period" stroke="#64748B" fontSize={11} tickLine={false} />
              <YAxis
                stroke="#64748B"
                fontSize={11}
                tickLine={false}
                tickFormatter={(v) => (cur === 'INR' ? `₹${(v / 1000).toFixed(0)}k` : `$${(v / 1000).toFixed(0)}k`)}
              />
              <Tooltip content={<CustomTooltip currency={cur} />} />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Area
                type="monotone"
                dataKey="revenue"
                name="Gross Sales"
                stroke="#38BDF8"
                strokeWidth={2}
                fill="#38BDF8"
                fillOpacity={0.15}
              />
              <Bar
                dataKey="profit"
                name="Net Contribution Profit"
                fill="#22C55E"
                radius={[4, 4, 0, 0]}
                maxBarSize={28}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Weekly PPC Ad Spend Pacing"
          subtitle="Advertising expenditure directly attributed to driving conversions for this ASIN"
          height="h-72"
        >
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={product.revenueTrend} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
              <XAxis dataKey="period" stroke="#64748B" fontSize={11} tickLine={false} />
              <YAxis
                stroke="#64748B"
                fontSize={11}
                tickLine={false}
                tickFormatter={(v) => (cur === 'INR' ? `₹${(v / 1000).toFixed(0)}k` : `$${(v / 1000).toFixed(0)}k`)}
              />
              <Tooltip content={<CustomTooltip currency={cur} />} />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Bar
                dataKey="adSpend"
                name="PPC Ad Spend"
                fill="#A855F7"
                radius={[4, 4, 0, 0]}
                maxBarSize={28}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* 6. Sales History Table */}
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Historical Sales & Profit Settlements</CardTitle>
            <CardDescription>Multi-month trend of units ordered, total revenue, and contribution margin</CardDescription>
          </div>
          <Badge variant="slate" size="xs">3 Settlement Windows</Badge>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-harpy-cardBorder bg-harpy-charcoal/50 text-harpy-subtle uppercase text-[10px] tracking-wider font-semibold">
                  <th className="py-3 px-4">Period</th>
                  <th className="py-3 px-4">Units Sold</th>
                  <th className="py-3 px-4">Total Revenue</th>
                  <th className="py-3 px-4">Net Contribution Profit</th>
                  <th className="py-3 px-4">Net Margin %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-harpy-cardBorder/40">
                {product.salesHistory.map((sh, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/30">
                    <td className="py-3 px-4 font-semibold text-white">{sh.period}</td>
                    <td className="py-3 px-4 font-semibold text-slate-200">{formatNumber(sh.units)}</td>
                    <td className="py-3 px-4 font-bold text-white">{formatBrandCurrency(sh.revenue)}</td>
                    <td className="py-3 px-4 font-bold text-emerald">
                      {product.isCostIncomplete ? 'Pending' : formatBrandCurrency(sh.profit)}
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={sh.margin >= 20 ? 'emerald' : sh.margin >= 10 ? 'electric' : 'amber'} size="xs">
                        {product.isCostIncomplete ? 'N/A' : `${sh.margin.toFixed(1)}%`}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* 7. Performance Recommendations */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald" />
            <CardTitle>AI Profit & Growth Recommendations</CardTitle>
          </div>
          <Badge variant="emerald" size="xs">Actionable Insights</Badge>
        </CardHeader>
        <CardContent className="space-y-3 p-5">
          {product.recommendations.map((rec) => (
            <div
              key={rec.id}
              className="p-4 rounded-xl bg-harpy-charcoal/80 border border-harpy-cardBorder hover:border-emerald/40 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald shrink-0" />
                  <h4 className="text-xs font-bold text-white">{rec.title}</h4>
                </div>
                <p className="text-xs text-harpy-subtle leading-relaxed pl-4">
                  {rec.description}
                </p>
              </div>
              <div className="shrink-0 self-end sm:self-center">
                <Badge variant="emerald" size="sm">
                  {rec.impact}
                </Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

export default ProductDetailView;

