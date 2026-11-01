import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
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
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Percent,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Filter,
  Layers,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight,
  Building2,
  ExternalLink,
  ChevronRight,
  Info,
  Calendar,
  Zap,
  BarChart3,
  ShieldCheck,
} from 'lucide-react';
import { useBrand } from '../context/BrandContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/common/Card';
import { ChartCard } from '../components/common/ChartCard';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { CustomTooltip } from '../components/common/CustomTooltip';
import { formatCurrency, formatNumber, formatPercentage } from '../utils/formatters';
import { cn } from '../utils/cn';

export function DashboardOverview() {
  const navigate = useNavigate();
  const {
    brands,
    selectedBrand,
    setSelectedBrand,
    dateRanges,
    selectedDateRange,
    setSelectedDateRange,
    selectedCurrency,
    analyticsData,
  } = useBrand();

  const {
    kpis,
    charts,
    topPerformingBrandsTable,
    recentActivities,
    performanceAlerts,
    periodDays,
  } = analyticsData;

  const [activeDonutIndex, setActiveDonutIndex] = useState(null);

  // Export Executive Telemetry to CSV
  const handleExportCsv = () => {
    const headers = ['Metric', 'Current Value', 'Change %', 'Period Window'];
    const rows = [
      ['Total Revenue', kpis.totalRevenue?.value ?? 0, `${kpis.totalRevenue?.change ?? 0}%`, `${periodDays} Days`],
      ['Advertising Spend', kpis.adSpend?.value ?? 0, `${kpis.adSpend?.change ?? 0}%`, `${periodDays} Days`],
      ['Total Orders', kpis.totalOrders?.value ?? 0, `${kpis.totalOrders?.change ?? 0}%`, `${periodDays} Days`],
      ['Estimated Net Profit', kpis.netProfit?.value ?? 0, `${kpis.netProfit?.change ?? 0}%`, `${periodDays} Days`],
      ['ROAS', `${kpis.roas?.value ?? 0}x`, `${kpis.roas?.change ?? 0}%`, `${periodDays} Days`],
      ['TACOS', `${kpis.tacos?.value ?? 0}%`, `${kpis.tacos?.change ?? 0}%`, `${periodDays} Days`],
    ];
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `harpy-growth-overview-${selectedBrand.id}-${selectedDateRange}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Helper for KPI sparkline SVG rendering with smooth gradient area fill
  const renderMiniSparkline = (data = [], isPositive = true, color = '#22C55E', gradId = 'spark') => {
    if (!data || data.length < 2) return null;
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const width = 88;
    const height = 30;

    const points = data.map((val, idx) => {
      const x = (idx / (data.length - 1)) * width;
      const y = height - ((val - min) / range) * (height - 8) - 4;
      return { x, y };
    });

    const polylinePoints = points.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
    const polygonPoints = `0,${height} ${polylinePoints} ${width},${height}`;
    const uniqueGrad = `grad-${gradId}`;

    return (
      <svg
        className="w-20 h-7 overflow-visible opacity-90 group-hover:opacity-100 transition-opacity"
        viewBox={`0 0 ${width} ${height}`}
      >
        <defs>
          <linearGradient id={uniqueGrad} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.35} />
            <stop offset="100%" stopColor={color} stopOpacity={0.0} />
          </linearGradient>
        </defs>
        <polygon fill={`url(#${uniqueGrad})`} points={polygonPoints} />
        <polyline
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={polylinePoints}
        />
      </svg>
    );
  };

  // Helper for custom Donut Tooltip
  const renderDonutTooltip = ({ active, payload }) => {
    if (!active || !payload || !payload.length) return null;
    const item = payload[0].payload;
    return (
      <div className="rounded-xl bg-harpy-charcoal/95 border border-harpy-cardBorder px-3.5 py-2.5 shadow-2xl backdrop-blur-md">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: item.color }} />
          <span className="text-xs font-bold text-white">{item.name}</span>
        </div>
        <div className="space-y-1 text-xs">
          <div className="flex items-center justify-between gap-4">
            <span className="text-harpy-subtle">Revenue:</span>
            <span className="font-bold text-white font-mono">
              {formatCurrency(item.value, selectedCurrency)}
            </span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-harpy-subtle">Portfolio Share:</span>
            <span className="font-bold text-emerald">{item.percentage}%</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* 1. Page Title & Quick Navigation Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-1">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Growth Overview
            </h1>
            <Badge variant="emerald" dot pulseDot size="sm">
              Live SP-API Telemetry
            </Badge>
          </div>
          <p className="text-xs text-harpy-subtle mt-1 max-w-2xl leading-relaxed">
            Consolidated executive scorecard for multi-brand Amazon operations, advertising efficiency (ACoS / TACoS), and bottom-line contribution profit.
          </p>
        </div>

        {/* Quick Date Range Pills & Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Quick Date Range Pills */}
          <div className="flex items-center rounded-lg bg-harpy-charcoal border border-harpy-cardBorder p-1 text-xs shadow-inner">
            {dateRanges.map((range) => {
              const isActive = selectedDateRange === range.id;
              return (
                <button
                  key={range.id}
                  onClick={() => setSelectedDateRange(range.id)}
                  className={cn(
                    'px-3 py-1.5 rounded-md font-semibold text-xs transition-all flex items-center gap-1.5 cursor-pointer',
                    isActive
                      ? 'bg-emerald-500/15 text-emerald border border-emerald-500/40 shadow-sm shadow-emerald-500/10'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  )}
                >
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-emerald animate-pulse" />}
                  <span>{range.id.toUpperCase()}</span>
                </button>
              );
            })}
          </div>

          {/* Export CSV button */}
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Download className="w-3.5 h-3.5" />}
            onClick={handleExportCsv}
            title="Download executive scorecard CSV"
          >
            Export
          </Button>

          {/* AI Growth Audit button */}
          <Button
            variant="secondary"
            size="sm"
            leftIcon={<Sparkles className="w-3.5 h-3.5 text-electric" />}
            onClick={() => navigate('/analyst')}
            title="Open AI Growth Analyst"
          >
            AI Audit
          </Button>
        </div>
      </div>

      {/* 2. Quick Brand Navigation Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-[11px] font-bold text-harpy-subtle uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1.5">
          <Building2 className="w-3.5 h-3.5 text-slate-400" />
          Brand Scope:
        </span>
        {brands.map((b) => {
          const isSelected = selectedBrand.id === b.id;
          return (
            <button
              key={b.id}
              onClick={() => setSelectedBrand(b)}
              className={cn(
                'flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 border cursor-pointer group',
                isSelected
                  ? 'bg-emerald-500/15 text-emerald border-emerald-500/50 shadow-sm shadow-emerald-500/10 font-bold'
                  : 'bg-harpy-charcoal/80 text-slate-300 border-harpy-cardBorder/80 hover:border-slate-700 hover:bg-slate-800/60'
              )}
            >
              <span
                className={cn(
                  'w-2 h-2 rounded-full transition-colors',
                  isSelected ? 'bg-emerald animate-pulse' : 'bg-slate-600 group-hover:bg-slate-400'
                )}
              />
              <span>{b.name}</span>
              {b.id !== 'all' ? (
                <span className="text-[10px] px-1 py-0.2 rounded bg-slate-800 text-slate-400 border border-slate-700 font-mono">
                  {b.code}
                </span>
              ) : (
                <span className="text-[10px] px-1 py-0.2 rounded bg-slate-800 text-slate-400 border border-slate-700">
                  All Brands
                </span>
              )}
            </button>
          );
        })}

        <button
          onClick={() => navigate('/brands')}
          className="ml-auto text-xs text-electric hover:text-sky-300 flex items-center gap-1 shrink-0 font-medium hover:underline pl-3"
        >
          <span>Portfolio Manager</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 3. The 6 Required KPI Cards with Accent Top Borders & Shaded Sparklines */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5 sm:gap-4">
        {/* KPI 1: Total Revenue */}
        <Card hover className="group p-4 relative overflow-hidden transition-all duration-300 border-t-2 border-t-emerald bg-gradient-to-b from-emerald-950/20 via-harpy-charcoal to-harpy-charcoal shadow-lg">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-harpy-subtle font-semibold uppercase tracking-wider text-[10px] group-hover:text-slate-300">
              Total Revenue
            </span>
            <div className="w-7 h-7 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald shadow-emerald-glow">
              <DollarSign className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-white tracking-tight mb-2 font-mono">
            {formatCurrency(kpis.totalRevenue.value, selectedCurrency)}
          </div>
          <div className="flex items-center justify-between pt-1 border-t border-harpy-cardBorder/40">
            <div className="flex items-center gap-1">
              <Badge
                size="xs"
                variant={kpis.totalRevenue.change >= 0 ? 'emerald' : 'rose'}
                className="px-1.5 py-0.5"
              >
                {kpis.totalRevenue.change >= 0 ? (
                  <ArrowUpRight className="w-3 h-3" />
                ) : (
                  <ArrowDownRight className="w-3 h-3" />
                )}
                {formatPercentage(kpis.totalRevenue.change)}
              </Badge>
              <span className="text-[10px] text-harpy-muted">{kpis.totalRevenue.period}</span>
            </div>
            {renderMiniSparkline(
              kpis.totalRevenue.sparkline,
              kpis.totalRevenue.change >= 0,
              '#22C55E',
              'rev'
            )}
          </div>
        </Card>

        {/* KPI 2: Advertising Spend */}
        <Card hover className="group p-4 relative overflow-hidden transition-all duration-300 border-t-2 border-t-electric bg-gradient-to-b from-sky-950/20 via-harpy-charcoal to-harpy-charcoal shadow-lg">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-harpy-subtle font-semibold uppercase tracking-wider text-[10px] group-hover:text-slate-300">
              Advertising Spend
            </span>
            <div className="w-7 h-7 rounded-lg bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-electric">
              <Target className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-white tracking-tight mb-2 font-mono">
            {formatCurrency(kpis.adSpend.value, selectedCurrency)}
          </div>
          <div className="flex items-center justify-between pt-1 border-t border-harpy-cardBorder/40">
            <div className="flex items-center gap-1">
              <Badge size="xs" variant="electric" className="px-1.5 py-0.5">
                {kpis.adSpend.change >= 0 ? '+' : ''}
                {kpis.adSpend.change}%
              </Badge>
              <span className="text-[10px] text-harpy-muted">{kpis.adSpend.period}</span>
            </div>
            {renderMiniSparkline(kpis.adSpend.sparkline, true, '#38BDF8', 'ad')}
          </div>
        </Card>

        {/* KPI 3: Total Orders */}
        <Card hover className="group p-4 relative overflow-hidden transition-all duration-300 border-t-2 border-t-indigo-500 bg-gradient-to-b from-indigo-950/20 via-harpy-charcoal to-harpy-charcoal shadow-lg">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-harpy-subtle font-semibold uppercase tracking-wider text-[10px] group-hover:text-slate-300">
              Total Orders
            </span>
            <div className="w-7 h-7 rounded-lg bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <ShoppingCart className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-white tracking-tight mb-2 font-mono">
            {formatNumber(kpis.totalOrders.value)}
          </div>
          <div className="flex items-center justify-between pt-1 border-t border-harpy-cardBorder/40">
            <div className="flex items-center gap-1">
              <Badge
                size="xs"
                variant={kpis.totalOrders.change >= 0 ? 'emerald' : 'rose'}
                className="px-1.5 py-0.5"
              >
                {kpis.totalOrders.change >= 0 ? (
                  <ArrowUpRight className="w-3 h-3" />
                ) : (
                  <ArrowDownRight className="w-3 h-3" />
                )}
                {formatPercentage(kpis.totalOrders.change)}
              </Badge>
              <span className="text-[10px] text-harpy-muted">{kpis.totalOrders.period}</span>
            </div>
            {renderMiniSparkline(
              kpis.totalOrders.sparkline,
              kpis.totalOrders.change >= 0,
              '#818CF8',
              'ord'
            )}
          </div>
        </Card>

        {/* KPI 4: Estimated Net Profit */}
        <Card hover className="group p-4 relative overflow-hidden transition-all duration-300 border-t-2 border-t-emerald bg-gradient-to-b from-emerald-950/25 via-harpy-charcoal to-harpy-charcoal shadow-lg">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-harpy-subtle font-semibold uppercase tracking-wider text-[10px] group-hover:text-slate-300">
              Est. Net Profit
            </span>
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald shadow-emerald-glow">
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-emerald tracking-tight mb-2 font-mono">
            {formatCurrency(kpis.netProfit.value, selectedCurrency)}
          </div>
          <div className="flex items-center justify-between pt-1 border-t border-harpy-cardBorder/40">
            <div className="flex items-center gap-1">
              <Badge
                size="xs"
                variant={kpis.netProfit.change >= 0 ? 'emerald' : 'rose'}
                className="px-1.5 py-0.5"
              >
                {kpis.netProfit.change >= 0 ? (
                  <ArrowUpRight className="w-3 h-3" />
                ) : (
                  <ArrowDownRight className="w-3 h-3" />
                )}
                {formatPercentage(kpis.netProfit.change)}
              </Badge>
              <span className="text-[10px] text-harpy-muted">{kpis.netProfit.period}</span>
            </div>
            {renderMiniSparkline(
              kpis.netProfit.sparkline,
              kpis.netProfit.change >= 0,
              '#22C55E',
              'prof'
            )}
          </div>
        </Card>

        {/* KPI 5: ROAS */}
        <Card hover className="group p-4 relative overflow-hidden transition-all duration-300 border-t-2 border-t-purple-500 bg-gradient-to-b from-purple-950/20 via-harpy-charcoal to-harpy-charcoal shadow-lg">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-harpy-subtle font-semibold uppercase tracking-wider text-[10px] group-hover:text-slate-300">
              ROAS
            </span>
            <div className="w-7 h-7 rounded-lg bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <BarChart3 className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-white tracking-tight mb-2 font-mono">
            {kpis.roas.value}x
          </div>
          <div className="flex items-center justify-between pt-1 border-t border-harpy-cardBorder/40">
            <div className="flex items-center gap-1">
              <Badge
                size="xs"
                variant={kpis.roas.change >= 0 ? 'emerald' : 'rose'}
                className="px-1.5 py-0.5"
              >
                {kpis.roas.change >= 0 ? (
                  <ArrowUpRight className="w-3 h-3" />
                ) : (
                  <ArrowDownRight className="w-3 h-3" />
                )}
                {formatPercentage(kpis.roas.change)}
              </Badge>
              <span className="text-[10px] text-harpy-muted">Target 4.0x</span>
            </div>
            {renderMiniSparkline(kpis.roas.sparkline, kpis.roas.change >= 0, '#C084FC', 'roas')}
          </div>
        </Card>

        {/* KPI 6: TACOS */}
        <Card hover className="group p-4 relative overflow-hidden transition-all duration-300 border-t-2 border-t-cyan-500 bg-gradient-to-b from-cyan-950/20 via-harpy-charcoal to-harpy-charcoal shadow-lg">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-harpy-subtle font-semibold uppercase tracking-wider text-[10px] group-hover:text-slate-300">
              TACOS
            </span>
            <div className="w-7 h-7 rounded-lg bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Percent className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-white tracking-tight mb-2 font-mono">
            {kpis.tacos.value}%
          </div>
          <div className="flex items-center justify-between pt-1 border-t border-harpy-cardBorder/40">
            <div className="flex items-center gap-1">
              <Badge
                size="xs"
                variant={kpis.tacos.changeType === 'positive' ? 'emerald' : 'rose'}
                className="px-1.5 py-0.5"
              >
                {kpis.tacos.change <= 0 ? (
                  <ArrowDownRight className="w-3 h-3" />
                ) : (
                  <ArrowUpRight className="w-3 h-3" />
                )}
                {Math.abs(kpis.tacos.change)}%
              </Badge>
              <span className="text-[10px] text-harpy-muted">Goal &lt;12%</span>
            </div>
            {renderMiniSparkline(kpis.tacos.sparkline, true, '#22D3EE', 'tacos')}
          </div>
        </Card>
      </div>

      {/* 4. Charts Grid (Row 1: Line Chart & Bar Chart) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Revenue versus Ad Spend (Line Chart) */}
        <ChartCard
          title="Revenue versus Ad Spend"
          subtitle={`Correlating total gross revenue against Amazon advertising spend across the last ${periodDays} days`}
          badge={
            <Badge variant="emerald" size="xs">
              Live Trend
            </Badge>
          }
          height="h-72"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={charts.revenueVsAdSpend}
              margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
            >
              <defs>
                <linearGradient id="lineRevenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22C55E" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#22C55E" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
              <XAxis dataKey="date" stroke="#64748B" fontSize={11} tickLine={false} />
              <YAxis
                stroke="#64748B"
                fontSize={11}
                tickLine={false}
                tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomTooltip currency={selectedCurrency} />} />
              <Legend
                wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                iconType="circle"
              />
              <Line
                type="monotone"
                dataKey="revenue"
                name="Total Revenue"
                stroke="#22C55E"
                strokeWidth={2.5}
                dot={{ r: 2.5, fill: '#22C55E' }}
                activeDot={{ r: 6, fill: '#22C55E', stroke: '#090D14', strokeWidth: 2 }}
              />
              <Line
                type="monotone"
                dataKey="adSpend"
                name="Ad Spend"
                stroke="#38BDF8"
                strokeWidth={2}
                dot={{ r: 2, fill: '#38BDF8' }}
                activeDot={{ r: 5, fill: '#38BDF8', stroke: '#090D14', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Chart 2: Sales by Brand (Bar Chart) */}
        <ChartCard
          title="Sales by Brand"
          subtitle={`Comparative sales volume & ad investment for all 3 brands in the selected ${periodDays}d period`}
          badge={
            <Badge variant="electric" size="xs">
              Portfolio
            </Badge>
          }
          height="h-72"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={charts.salesByBrand}
              margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
              <XAxis dataKey="name" stroke="#64748B" fontSize={11} tickLine={false} />
              <YAxis
                stroke="#64748B"
                fontSize={11}
                tickLine={false}
                tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomTooltip currency={selectedCurrency} />} />
              <Legend
                wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                iconType="circle"
              />
              <Bar
                dataKey="revenue"
                name="Gross Sales"
                fill="#22C55E"
                radius={[4, 4, 0, 0]}
                maxBarSize={38}
              />
              <Bar
                dataKey="adSpend"
                name="Ad Spend"
                fill="#38BDF8"
                radius={[4, 4, 0, 0]}
                maxBarSize={38}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* 5. Charts Grid (Row 2: Advertising Performance Area Chart & Revenue Distribution Donut) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart 3: Advertising Performance (Area Chart - takes 2 cols) */}
        <div className="lg:col-span-2">
          <ChartCard
            title="Advertising Performance"
            subtitle="Comparing Amazon PPC attributed sales against ad spend to track margin expansion"
            badge={
              <Badge variant="emerald" size="xs">
                ROAS {kpis.roas.value}x
              </Badge>
            }
            height="h-72"
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={charts.advertisingPerformance}
                margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorAdSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22C55E" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#22C55E" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorAdSpend" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38BDF8" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#38BDF8" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                <XAxis dataKey="date" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis
                  stroke="#64748B"
                  fontSize={11}
                  tickLine={false}
                  tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip content={<CustomTooltip currency={selectedCurrency} />} />
                <Legend
                  wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                  iconType="circle"
                />
                <Area
                  type="monotone"
                  dataKey="adSales"
                  name="Attributed Ad Sales"
                  stroke="#22C55E"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorAdSales)"
                />
                <Area
                  type="monotone"
                  dataKey="adSpend"
                  name="Amazon PPC Spend"
                  stroke="#38BDF8"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorAdSpend)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Chart 4: Revenue Distribution (Donut Chart - takes 1 col) */}
        <div className="lg:col-span-1">
          <ChartCard
            title="Revenue Distribution"
            subtitle={
              selectedBrand.id === 'all'
                ? 'Portfolio revenue split across brands'
                : `${selectedBrand.name} marketplace distribution`
            }
            height="h-72"
          >
            <div className="relative w-full h-full flex flex-col items-center justify-center">
              <ResponsiveContainer width="100%" height={190}>
                <PieChart>
                  <Tooltip content={renderDonutTooltip} />
                  <Pie
                    data={charts.revenueDistribution}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={3}
                    stroke="#0D111A"
                    strokeWidth={2}
                  >
                    {charts.revenueDistribution.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
                        className="transition-opacity hover:opacity-80 cursor-pointer"
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>

              {/* Centered Donut Label */}
              <div className="absolute top-[82px] left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                <span className="text-[10px] text-harpy-subtle font-medium uppercase tracking-wider block">
                  {selectedBrand.id === 'all' ? 'Portfolio' : selectedBrand.code}
                </span>
                <span className="text-sm font-bold text-white block font-mono">
                  {formatCurrency(kpis.totalRevenue.value, selectedCurrency)}
                </span>
              </div>

              {/* Compact Custom Legend */}
              <div className="w-full grid grid-cols-2 gap-x-2 gap-y-1.5 pt-2 border-t border-harpy-cardBorder/50 text-[11px]">
                {charts.revenueDistribution.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between min-w-0">
                    <div className="flex items-center gap-1.5 truncate">
                      <span
                        className="w-2 h-2 rounded-sm shrink-0"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-slate-300 truncate">{item.name}</span>
                    </div>
                    <span className="text-white font-semibold ml-1 shrink-0 font-mono">
                      {item.percentage}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </ChartCard>
        </div>
      </div>

      {/* 6. Table: Top Performing Brands */}
      <Card className="border-harpy-cardBorder shadow-2xl overflow-hidden">
        <CardHeader className="flex-wrap gap-2 pb-3 border-b border-harpy-cardBorder/60 bg-harpy-charcoal/40">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-base sm:text-lg">Top Performing Brands</CardTitle>
              <Badge variant="emerald" size="xs">
                {topPerformingBrandsTable.length} Brands Monitored
              </Badge>
            </div>
            <CardDescription className="text-xs text-harpy-subtle mt-0.5">
              Comprehensive metrics calculated from Amazon SP-API settlement and ads reports for the selected {periodDays}-day window.
            </CardDescription>
          </div>

          <Button
            variant="outline"
            size="xs"
            rightIcon={<ExternalLink className="w-3 h-3" />}
            onClick={() => navigate('/brands')}
          >
            Brand Portfolio Manager
          </Button>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-slate-700/60 scrollbar-track-harpy-navy">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-harpy-cardBorder bg-slate-900/90 text-harpy-subtle uppercase text-[10px] tracking-wider font-semibold">
                  <th className="py-3 px-4 min-w-[200px]">Brand Name</th>
                  <th className="py-3 px-4 min-w-[120px] text-right">Revenue</th>
                  <th className="py-3 px-4 min-w-[110px] text-right">Ad Spend</th>
                  <th className="py-3 px-4 min-w-[85px] text-center">ACOS</th>
                  <th className="py-3 px-4 min-w-[85px] text-center">TACOS</th>
                  <th className="py-3 px-4 min-w-[85px] text-right">ROAS</th>
                  <th className="py-3 px-4 min-w-[130px] text-right">Estimated Profit</th>
                  <th className="py-3 px-4 min-w-[110px] text-center">Performance Status</th>
                  <th className="py-3 px-4 min-w-[100px] text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-harpy-cardBorder/40">
                {topPerformingBrandsTable.map((brand) => {
                  const isCurrent = selectedBrand.id === brand.id;
                  return (
                    <tr
                      key={brand.id}
                      onClick={() => {
                        const match = brands.find((b) => b.id === brand.id);
                        if (match) setSelectedBrand(match);
                      }}
                      className={cn(
                        'hover:bg-slate-800/60 transition-colors cursor-pointer group',
                        isCurrent && 'bg-emerald-950/20 border-l-2 border-emerald'
                      )}
                    >
                      {/* Brand Name */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-harpy-navy border border-harpy-cardBorder flex items-center justify-center font-bold text-white text-xs shrink-0 group-hover:border-slate-600 transition-colors">
                            {brand.code}
                          </div>
                          <div>
                            <span className="font-bold text-white group-hover:text-emerald transition-colors block">
                              {brand.name}
                            </span>
                            <div className="flex items-center gap-1.5 text-[10px] text-harpy-subtle mt-0.5">
                              <span>{brand.category}</span>
                              <span>•</span>
                              <span className="text-slate-400 font-medium">{brand.marketplaces.join(', ')}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Revenue */}
                      <td className="py-3.5 px-4 font-bold text-white text-right tabular-nums">
                        {formatCurrency(brand.revenue, selectedCurrency)}
                      </td>

                      {/* Ad Spend */}
                      <td className="py-3.5 px-4 font-medium text-slate-300 text-right tabular-nums">
                        {formatCurrency(brand.adSpend, selectedCurrency)}
                      </td>

                      {/* ACOS */}
                      <td className="py-3.5 px-4 text-center">
                        <Badge
                          variant={brand.acos < 20 ? 'emerald' : brand.acos < 25 ? 'electric' : 'amber'}
                          size="xs"
                        >
                          {brand.acos}%
                        </Badge>
                      </td>

                      {/* TACOS */}
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={cn(
                            'font-bold text-xs',
                            brand.tacos < 10 ? 'text-emerald' : brand.tacos < 13 ? 'text-sky-400' : 'text-amber-400'
                          )}
                        >
                          {brand.tacos}%
                        </span>
                      </td>

                      {/* ROAS */}
                      <td className="py-3.5 px-4 font-bold text-white text-right tabular-nums">
                        {brand.roas}x
                      </td>

                      {/* Estimated Profit */}
                      <td className="py-3.5 px-4 text-right tabular-nums">
                        <div>
                          <span className="font-bold text-emerald block">
                            {formatCurrency(brand.estimatedProfit, selectedCurrency)}
                          </span>
                          <span className="block text-[10px] text-harpy-muted font-medium">
                            {brand.profitMargin}% Margin
                          </span>
                        </div>
                      </td>

                      {/* Performance Status */}
                      <td className="py-3.5 px-4 text-center">
                        <Badge
                          variant={
                            brand.status === 'High Growth' || brand.status === 'Optimal'
                              ? 'emerald'
                              : 'electric'
                          }
                          dot
                          size="xs"
                        >
                          {brand.status}
                        </Badge>
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4 text-right">
                        <Button
                          variant={isCurrent ? 'secondary' : 'outline'}
                          size="xs"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/brands/${brand.id}`);
                          }}
                        >
                          Workspace →
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* 7. Additional Sections: Performance Alerts & Recent Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Alerts */}
        <Card className="border-harpy-cardBorder shadow-xl">
          <CardHeader className="border-b border-harpy-cardBorder/60 bg-harpy-charcoal/40">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <CardTitle className="text-sm font-bold">Performance Alerts & Recommendations</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="amber" size="xs">
                {performanceAlerts.length} Active
              </Badge>
              <Button
                variant="ghost"
                size="xs"
                onClick={() => navigate('/alerts')}
                className="text-electric hover:text-sky-300 gap-1 text-xs"
              >
                <span>View Center</span>
                <ArrowRight className="w-3 h-3" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 p-4 sm:p-5">
            {performanceAlerts.map((alert) => (
              <div
                key={alert.id}
                className={cn(
                  'p-3.5 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transition-colors',
                  alert.type === 'warning'
                    ? 'bg-amber-950/20 border-amber-500/30 text-amber-200'
                    : alert.type === 'success'
                    ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200'
                    : 'bg-harpy-charcoal/80 border-harpy-cardBorder text-slate-200'
                )}
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        'w-2 h-2 rounded-full shrink-0',
                        alert.type === 'warning'
                          ? 'bg-amber-400'
                          : alert.type === 'success'
                          ? 'bg-emerald-400'
                          : 'bg-sky-400'
                      )}
                    />
                    <h4 className="text-xs font-bold truncate">{alert.title}</h4>
                  </div>
                  <p className="text-[11px] text-harpy-subtle leading-relaxed pl-4">
                    {alert.description}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="xs"
                  className="shrink-0 self-end sm:self-center"
                  onClick={() => navigate(alert.link)}
                >
                  {alert.actionText}
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="border-harpy-cardBorder shadow-xl">
          <CardHeader className="border-b border-harpy-cardBorder/60 bg-harpy-charcoal/40">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-electric" />
              <CardTitle className="text-sm font-bold">Recent Multi-Brand Activity</CardTitle>
            </div>
            <span className="text-[11px] text-harpy-subtle font-mono">Real-time Stream</span>
          </CardHeader>
          <CardContent className="space-y-3 p-4 sm:p-5">
            {recentActivities.map((act) => (
              <div
                key={act.id}
                className="flex items-start justify-between gap-3 p-3 rounded-lg bg-harpy-charcoal/50 border border-harpy-cardBorder/60 hover:bg-slate-800/40 transition-colors"
              >
                <div className="flex items-start gap-2.5 min-w-0">
                  <div className="w-6 h-6 rounded bg-slate-800 border border-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-200 shrink-0 mt-0.5">
                    {act.brandCode}
                  </div>
                  <div className="space-y-0.5 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-semibold text-white truncate">
                        {act.title}
                      </span>
                      <Badge variant={act.badgeVariant} size="xs">
                        {act.badge}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-harpy-subtle line-clamp-2 leading-relaxed">
                      {act.description}
                    </p>
                  </div>
                </div>
                <span className="text-[10px] text-slate-500 whitespace-nowrap shrink-0 mt-0.5">
                  {act.time}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default DashboardOverview;
