import React, { useState, useEffect, useMemo } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import {
  BarChart3,
  Search,
  Filter,
  ArrowUpDown,
  Download,
  Layers,
  Sparkles,
  Sliders,
  DollarSign,
  Target,
  Percent,
  CheckSquare,
  Square,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  ChevronDown,
  RefreshCw,
  Building2,
  TrendingUp,
} from 'lucide-react';
import { useBrand } from '../context/BrandContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/common/Card';
import { ChartCard } from '../components/common/ChartCard';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { CustomTooltip } from '../components/common/CustomTooltip';
import { Skeleton } from '../components/common/Skeleton';
import { EmptyState } from '../components/common/EmptyState';
import { CampaignAnalysisPanel } from '../components/campaigns/CampaignAnalysisPanel';
import { CampaignDetailsModal } from '../components/campaigns/CampaignDetailsModal';
import { CampaignCompareModal } from '../components/campaigns/CampaignCompareModal';
import campaignService, { CAMPAIGN_TIME_SERIES } from '../services/campaignService';
import { formatCurrency, formatNumber, formatPercentage } from '../utils/formatters';
import { cn } from '../utils/cn';

const CAMPAIGN_TYPES = ['All', 'Sponsored Products', 'Sponsored Brands', 'Sponsored Display'];
const STATUS_OPTIONS = ['All', 'Active', 'Paused', 'Out of Budget'];

const PERFORMANCE_FILTERS = [
  { id: 'All', label: 'All Campaigns' },
  { id: 'High ACOS', label: 'High ACoS (> 28%)', badge: 'Alert' },
  { id: 'High Spend Low Return', label: 'High Spend, Low Return', badge: 'Bleed' },
  { id: 'Star Performer', label: 'Star Performers (ROAS ≥ 4.5x)', badge: 'Scale' },
  { id: 'Budget Capped', label: 'Budget Capped', badge: 'Cap' },
];

export function AdvertisingPpc() {
  const { brands, selectedBrand, selectedCurrency } = useBrand();

  const [campaigns, setCampaigns] = useState([]);
  const [analysisData, setAnalysisData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBrandId, setFilterBrandId] = useState('All');
  const [filterType, setFilterType] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterPerformance, setFilterPerformance] = useState('All');
  const [sortBy, setSortBy] = useState('spend-desc');

  // Interactive Selection for Comparison & Detail Modals
  const [selectedCampaignIds, setSelectedCampaignIds] = useState([]);
  const [viewingCampaign, setViewingCampaign] = useState(null);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  // Sync brand filter if global brand context changes
  useEffect(() => {
    if (selectedBrand && selectedBrand.id !== 'all') {
      setFilterBrandId(selectedBrand.id);
    } else {
      setFilterBrandId('All');
    }
  }, [selectedBrand.id]);

  // Load campaigns and analysis
  const loadCampaignData = async () => {
    setIsLoading(true);
    try {
      const [list, analysis] = await Promise.all([
        campaignService.getCampaigns({
          search: searchQuery,
          brandId: filterBrandId,
          campaignType: filterType,
          status: filterStatus,
          performanceStatus: filterPerformance,
          sortBy,
        }),
        campaignService.getAnalysisPanel(filterBrandId),
      ]);
      setCampaigns(list);
      setAnalysisData(analysis);
    } catch (err) {
      console.error('Failed to load campaigns:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCampaignData();
  }, [searchQuery, filterBrandId, filterType, filterStatus, filterPerformance, sortBy]);

  // Toggle campaign selection for comparison
  const toggleCampaignSelection = (id, e) => {
    e.stopPropagation();
    setSelectedCampaignIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      }
      if (prev.length >= 3) {
        alert('You can compare at most 3 campaigns simultaneously.');
        return prev;
      }
      return [...prev, id];
    });
  };

  const selectedCampaignObjects = useMemo(() => {
    return campaigns.filter((c) => selectedCampaignIds.includes(c.id));
  }, [campaigns, selectedCampaignIds]);

  // Format currency localized per brand/currency
  const formatBrandCurrency = (val, cur = selectedCurrency) => {
    if (cur === 'INR') {
      if (Math.abs(val) >= 100000) return `₹${(val / 100000).toFixed(1)} L`;
      return `₹${Math.round(val).toLocaleString('en-IN')}`;
    }
    if (cur === 'GBP') return `£${Math.round(val).toLocaleString()}`;
    return formatCurrency(val, 'USD');
  };

  // Aggregated campaign comparison visualization by Type (SP vs SB vs SD)
  const campaignTypeComparison = useMemo(() => {
    const types = ['Sponsored Products', 'Sponsored Brands', 'Sponsored Display'];
    return types.map((type) => {
      const subset = campaigns.filter((c) => c.type === type);
      const spend = subset.reduce((acc, c) => acc + c.spend, 0);
      const sales = subset.reduce((acc, c) => acc + c.adSales, 0);
      const orders = subset.reduce((acc, c) => acc + c.orders, 0);
      const roas = spend > 0 ? Number((sales / spend).toFixed(2)) : 0;
      const acos = sales > 0 ? Number(((spend / sales) * 100).toFixed(1)) : 0;
      return {
        type: type.replace('Sponsored ', ''),
        fullName: type,
        spend,
        sales,
        orders,
        roas,
        acos,
      };
    });
  }, [campaigns]);

  return (
    <div className="space-y-6">
      {/* 1. Header Bar with Overview Stats */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Campaign Intelligence
            </h1>
            <Badge variant="emerald" dot pulseDot size="sm">
              Amazon Ads API
            </Badge>
          </div>
          <p className="text-xs text-harpy-subtle mt-1 max-w-2xl leading-relaxed">
            Multi-brand Amazon PPC performance, keyword attribution, bid optimization rules, and RoAS diagnostics.
          </p>
        </div>

        {/* Global Action Toolbar */}
        <div className="flex items-center gap-2.5">
          {selectedCampaignIds.length >= 2 && (
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<Sliders className="w-3.5 h-3.5 text-electric" />}
              onClick={() => setIsCompareModalOpen(true)}
            >
              Compare ({selectedCampaignIds.length}) Selected
            </Button>
          )}

          <Button
            variant="outline"
            size="sm"
            leftIcon={<Download className="w-3.5 h-3.5" />}
            onClick={() => alert('Exporting campaign performance CSV report...')}
          >
            Export Telemetry
          </Button>
        </div>
      </div>

      {/* 2. Analysis Panel (Best, Worst, Highest Spending, Requiring Attention) */}
      <CampaignAnalysisPanel
        analysisData={analysisData}
        onSelectCampaign={(c) => setViewingCampaign(c)}
        onFilterAttention={() => setFilterPerformance('High ACOS')}
        currency={selectedCurrency}
      />

      {/* 3. The 4 Interactive Recharts Visualisations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Visualization 1: Spend versus Attributed Sales */}
        <ChartCard
          title="Spend versus Attributed Sales"
          subtitle="Timeline correlating aggregate Amazon PPC ad spend against ad-attributed gross revenue"
          badge={
            <Badge variant="emerald" size="xs">
              Ad Margin
            </Badge>
          }
          height="h-72"
        >
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={CAMPAIGN_TIME_SERIES} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
              <XAxis dataKey="date" stroke="#64748B" fontSize={11} tickLine={false} />
              <YAxis
                stroke="#64748B"
                fontSize={11}
                tickLine={false}
                tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomTooltip currency={selectedCurrency} />} />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} iconType="circle" />
              <Area
                type="monotone"
                dataKey="sales"
                name="Attributed Sales"
                stroke="#22C55E"
                strokeWidth={2}
                fill="#22C55E"
                fillOpacity={0.15}
              />
              <Bar
                dataKey="spend"
                name="Ad Spend"
                fill="#38BDF8"
                radius={[4, 4, 0, 0]}
                maxBarSize={28}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Visualization 2: ACOS Trend */}
        <ChartCard
          title="ACOS Trend vs Target Ceiling"
          subtitle="Daily blended ACoS % tracked against the agency target ceiling of 22.0%"
          badge={
            <Badge variant="electric" size="xs">
              Target &lt; 22%
            </Badge>
          }
          height="h-72"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={CAMPAIGN_TIME_SERIES} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
              <XAxis dataKey="date" stroke="#64748B" fontSize={11} tickLine={false} />
              <YAxis
                stroke="#64748B"
                fontSize={11}
                tickLine={false}
                tickFormatter={(v) => `${v}%`}
                domain={[15, 30]}
              />
              <Tooltip content={<CustomTooltip currency={selectedCurrency} />} />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} iconType="circle" />
              <Line
                type="monotone"
                dataKey="acos"
                name="Actual ACoS %"
                stroke="#38BDF8"
                strokeWidth={2.5}
                dot={{ r: 3, fill: '#38BDF8' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Visualization 3: ROAS Trend */}
        <ChartCard
          title="ROAS Trend (Return on Ad Spend)"
          subtitle="Tracking blended advertising return multiplier over time against the 4.0x benchmark"
          badge={
            <Badge variant="emerald" size="xs">
              Benchmark 4.0x
            </Badge>
          }
          height="h-72"
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={CAMPAIGN_TIME_SERIES} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="roasGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22C55E" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#22C55E" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
              <XAxis dataKey="date" stroke="#64748B" fontSize={11} tickLine={false} />
              <YAxis
                stroke="#64748B"
                fontSize={11}
                tickLine={false}
                tickFormatter={(v) => `${v}x`}
                domain={[3.5, 5.5]}
              />
              <Tooltip content={<CustomTooltip currency={selectedCurrency} />} />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} iconType="circle" />
              <Area
                type="monotone"
                dataKey="roas"
                name="Blended ROAS (x)"
                stroke="#22C55E"
                strokeWidth={2.5}
                fill="url(#roasGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Visualization 4: Campaign Performance Comparison (By Ad Type) */}
        <ChartCard
          title="Campaign Performance Comparison"
          subtitle="Comparing efficiency metrics across Sponsored Products, Brands, and Display"
          badge={
            <Badge variant="slate" size="xs">
              Type Benchmarks
            </Badge>
          }
          height="h-72"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={campaignTypeComparison} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
              <XAxis dataKey="type" stroke="#64748B" fontSize={11} tickLine={false} />
              <YAxis
                yAxisId="left"
                stroke="#64748B"
                fontSize={11}
                tickLine={false}
                tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                stroke="#64748B"
                fontSize={11}
                tickLine={false}
                tickFormatter={(v) => `${v}x`}
              />
              <Tooltip content={<CustomTooltip currency={selectedCurrency} />} />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} iconType="circle" />
              <Bar
                yAxisId="left"
                dataKey="spend"
                name="Total Spend"
                fill="#38BDF8"
                radius={[4, 4, 0, 0]}
                maxBarSize={32}
              />
              <Bar
                yAxisId="left"
                dataKey="sales"
                name="Attributed Sales"
                fill="#22C55E"
                radius={[4, 4, 0, 0]}
                maxBarSize={32}
              />
              <Bar
                yAxisId="right"
                dataKey="roas"
                name="ROAS (x)"
                fill="#A855F7"
                radius={[4, 4, 0, 0]}
                maxBarSize={20}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* 4. Filter, Search, and Performance Quick-Filters Bar */}
      <Card className="p-4 bg-harpy-charcoal/90 space-y-3">
        {/* Top Filters row */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search campaigns, targeting, ASINs or keywords..."
              className="w-full bg-harpy-navy border border-harpy-cardBorder rounded-lg text-xs text-slate-100 placeholder-slate-500 pl-9 pr-4 py-2 focus:outline-none focus:border-electric focus:ring-1 focus:ring-electric transition-colors"
            />
          </div>

          {/* Filter Dropdowns: Brand, Type, Status, Sort */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Brand Filter */}
            <div className="flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <select
                value={filterBrandId}
                onChange={(e) => setFilterBrandId(e.target.value)}
                className="bg-harpy-navy border border-harpy-cardBorder rounded-lg text-xs text-slate-200 px-3 py-2 focus:outline-none focus:border-electric cursor-pointer"
              >
                <option value="All">All Client Brands</option>
                {brands
                  .filter((b) => b.id !== 'all')
                  .map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
              </select>
            </div>

            {/* Campaign Type Filter */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-harpy-navy border border-harpy-cardBorder rounded-lg text-xs text-slate-200 px-3 py-2 focus:outline-none focus:border-electric cursor-pointer"
            >
              {CAMPAIGN_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t === 'All' ? 'All Ad Types' : t}
                </option>
              ))}
            </select>

            {/* Campaign Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-harpy-navy border border-harpy-cardBorder rounded-lg text-xs text-slate-200 px-3 py-2 focus:outline-none focus:border-electric cursor-pointer"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s === 'All' ? 'All Statuses' : s}
                </option>
              ))}
            </select>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-harpy-navy border border-harpy-cardBorder rounded-lg text-xs text-slate-200 px-3 py-2 focus:outline-none focus:border-electric cursor-pointer"
              >
                <option value="spend-desc">Highest Spend</option>
                <option value="spend-asc">Lowest Spend</option>
                <option value="sales-desc">Highest Sales</option>
                <option value="roas-desc">Highest ROAS</option>
                <option value="acos-asc">Lowest ACoS (Most Efficient)</option>
                <option value="acos-desc">Highest ACoS (Bleeding)</option>
                <option value="orders-desc">Most Orders</option>
                <option value="clicks-desc">Most Clicks</option>
                <option value="ctr-desc">Highest CTR</option>
                <option value="cpc-asc">Lowest CPC</option>
                <option value="name-asc">Campaign Name A-Z</option>
              </select>
            </div>
          </div>
        </div>

        {/* Performance Quick Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-harpy-cardBorder/50 scrollbar-none">
          <span className="text-[10px] font-bold uppercase tracking-wider text-harpy-subtle shrink-0">
            Quick Analysis:
          </span>
          {PERFORMANCE_FILTERS.map((f) => {
            const isActive = filterPerformance === f.id;
            return (
              <button
                key={f.id}
                onClick={() => setFilterPerformance(f.id)}
                className={cn(
                  'flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all shrink-0 cursor-pointer border',
                  isActive
                    ? 'bg-emerald text-slate-950 border-emerald font-bold shadow-emerald-glow'
                    : 'bg-harpy-navy/80 text-slate-300 border-harpy-cardBorder hover:bg-slate-800'
                )}
              >
                <span>{f.label}</span>
                {f.badge && !isActive && (
                  <span className="text-[9px] px-1 py-0.2 rounded bg-slate-800 text-harpy-subtle border border-slate-700">
                    {f.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </Card>

      {/* 5. The Campaign Table (13 Required Columns + Multi-Select) */}
      <Card>
        <CardHeader className="flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <CardTitle>Amazon Advertising Campaigns</CardTitle>
            <Badge variant="electric" size="xs">
              {campaigns.length} Active Campaigns
            </Badge>
            {selectedCampaignIds.length > 0 && (
              <Badge variant="emerald" size="xs">
                {selectedCampaignIds.length} Selected for Compare
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs text-harpy-subtle">
            <span>Click any campaign row to inspect targeting & placement telemetry</span>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-harpy-cardBorder bg-harpy-charcoal/70 text-harpy-subtle uppercase text-[10px] tracking-wider font-semibold">
                  <th className="py-3 px-3 w-10 text-center">
                    <span className="sr-only">Select</span>
                  </th>
                  <th className="py-3 px-3 min-w-[220px]">Campaign Name</th>
                  <th className="py-3 px-3">Brand</th>
                  <th className="py-3 px-3">Type</th>
                  <th className="py-3 px-3">Impressions</th>
                  <th className="py-3 px-3">Clicks</th>
                  <th className="py-3 px-3">Spend</th>
                  <th className="py-3 px-3">Ad Sales</th>
                  <th className="py-3 px-3">Orders</th>
                  <th className="py-3 px-3">CPC</th>
                  <th className="py-3 px-3">CTR</th>
                  <th className="py-3 px-3">ACoS</th>
                  <th className="py-3 px-3">ROAS</th>
                  <th className="py-3 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-harpy-cardBorder/40">
                {isLoading ? (
                  <tr>
                    <td colSpan={14} className="py-12 text-center text-harpy-subtle">
                      Loading real-time Amazon PPC telemetry...
                    </td>
                  </tr>
                ) : campaigns.length === 0 ? (
                  <tr>
                    <td colSpan={14} className="py-12 text-center">
                      <EmptyState
                        title="No Campaigns Match Filters"
                        description="Try resetting your performance filters, search terms, or status criteria."
                        actionLabel="Reset Filters"
                        onAction={() => {
                          setSearchQuery('');
                          setFilterBrandId('All');
                          setFilterType('All');
                          setFilterStatus('All');
                          setFilterPerformance('All');
                        }}
                      />
                    </td>
                  </tr>
                ) : (
                  campaigns.map((c) => {
                    const isSelected = selectedCampaignIds.includes(c.id);
                    const cur = c.currency || 'USD';
                    return (
                      <tr
                        key={c.id}
                        onClick={() => setViewingCampaign(c)}
                        className={cn(
                          'hover:bg-slate-800/40 transition-colors cursor-pointer group',
                          isSelected && 'bg-emerald-950/20'
                        )}
                      >
                        {/* Checkbox for Compare */}
                        <td
                          className="py-3.5 px-3 text-center"
                          onClick={(e) => toggleCampaignSelection(c.id, e)}
                        >
                          <button
                            type="button"
                            className="text-slate-400 hover:text-white transition-colors"
                            title="Select for compare"
                          >
                            {isSelected ? (
                              <CheckSquare className="w-4 h-4 text-emerald" />
                            ) : (
                              <Square className="w-4 h-4" />
                            )}
                          </button>
                        </td>

                        {/* 1. Campaign Name */}
                        <td className="py-3.5 px-3">
                          <div className="space-y-0.5 max-w-xs">
                            <span className="font-bold text-white group-hover:text-emerald transition-colors line-clamp-1 block">
                              {c.name}
                            </span>
                            <span className="text-[10px] text-harpy-subtle font-mono block">
                              Targeting: {c.targeting}
                            </span>
                          </div>
                        </td>

                        {/* 2. Brand */}
                        <td className="py-3.5 px-3">
                          <Badge variant="slate" size="xs">
                            {c.brandCode || c.brandName}
                          </Badge>
                        </td>

                        {/* 3. Campaign Type */}
                        <td className="py-3.5 px-3">
                          <span className="text-[11px] text-slate-300 font-medium whitespace-nowrap">
                            {c.type}
                          </span>
                        </td>

                        {/* 4. Impressions */}
                        <td className="py-3.5 px-3 font-mono text-slate-300">
                          {formatNumber(c.impressions)}
                        </td>

                        {/* 5. Clicks */}
                        <td className="py-3.5 px-3 font-mono text-slate-300">
                          {formatNumber(c.clicks)}
                        </td>

                        {/* 6. Spend */}
                        <td className="py-3.5 px-3 font-bold text-white">
                          {formatBrandCurrency(c.spend, cur)}
                        </td>

                        {/* 7. Advertising Sales */}
                        <td className="py-3.5 px-3 font-bold text-emerald">
                          {formatBrandCurrency(c.adSales, cur)}
                        </td>

                        {/* 8. Orders */}
                        <td className="py-3.5 px-3 font-semibold text-slate-200">
                          {formatNumber(c.orders)}
                        </td>

                        {/* 9. CPC */}
                        <td className="py-3.5 px-3 font-mono text-slate-300">
                          {cur === 'INR' ? `₹${c.cpc}` : `$${c.cpc}`}
                        </td>

                        {/* 10. CTR */}
                        <td className="py-3.5 px-3 font-semibold text-slate-200">
                          {c.ctr}%
                        </td>

                        {/* 11. ACOS */}
                        <td className="py-3.5 px-3">
                          <Badge
                            variant={
                              c.acos <= 22
                                ? 'emerald'
                                : c.acos <= 28
                                ? 'electric'
                                : c.acos <= 35
                                ? 'amber'
                                : 'rose'
                            }
                            size="xs"
                          >
                            {c.acos}%
                          </Badge>
                        </td>

                        {/* 12. ROAS */}
                        <td className="py-3.5 px-3 font-bold text-white">
                          <span
                            className={cn(
                              c.roas >= 4.5
                                ? 'text-emerald'
                                : c.roas >= 3.8
                                ? 'text-sky-400'
                                : 'text-amber-400'
                            )}
                          >
                            {c.roas}x
                          </span>
                        </td>

                        {/* 13. Status */}
                        <td className="py-3.5 px-3">
                          <Badge
                            variant={
                              c.status === 'Active'
                                ? 'emerald'
                                : c.status === 'Paused'
                                ? 'slate'
                                : 'rose'
                            }
                            dot
                            size="xs"
                          >
                            {c.status}
                          </Badge>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* 6. Modals: Individual Campaign Details & Compare View */}
      <CampaignDetailsModal
        isOpen={Boolean(viewingCampaign)}
        onClose={() => setViewingCampaign(null)}
        campaign={viewingCampaign}
      />

      <CampaignCompareModal
        isOpen={isCompareModalOpen}
        onClose={() => setIsCompareModalOpen(false)}
        campaigns={selectedCampaignObjects}
      />
    </div>
  );
}

export default AdvertisingPpc;
