import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import {
  ArrowLeft,
  Building2,
  Globe,
  TrendingUp,
  DollarSign,
  Target,
  ShoppingCart,
  Percent,
  AlertTriangle,
  FileText,
  Download,
  ExternalLink,
  Edit,
  RefreshCw,
  CheckCircle2,
  Package,
  Layers,
  Sparkles,
  BarChart3,
  Clock,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../common/Card';
import { ChartCard } from '../common/ChartCard';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { CustomTooltip } from '../common/CustomTooltip';
import { Skeleton } from '../common/Skeleton';
import brandService from '../../services/brandService';
import { formatCurrency, formatNumber, formatPercentage } from '../../utils/formatters';
import { cn } from '../../utils/cn';

export function BrandWorkspaceView({ brandId, onBack, onEdit }) {
  const navigate = useNavigate();
  const [workspaceData, setWorkspaceData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'trends' | 'products' | 'campaigns' | 'alerts' | 'reports'

  useEffect(() => {
    let mounted = true;
    setIsLoading(true);

    brandService
      .getBrandWorkspace(brandId)
      .then((data) => {
        if (mounted) {
          setWorkspaceData(data);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (mounted) {
          console.error('Workspace load error:', err);
          setIsLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, [brandId]);

  if (isLoading || !workspaceData) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-24 rounded-lg" />
          <Skeleton className="h-8 w-64 rounded-lg" />
        </div>
        <Skeleton className="h-40 w-full rounded-2xl" />
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <Skeleton className="h-28 rounded-xl" />
          <Skeleton className="h-28 rounded-xl" />
          <Skeleton className="h-28 rounded-xl" />
          <Skeleton className="h-28 rounded-xl" />
        </div>
        <Skeleton className="h-80 w-full rounded-2xl" />
      </div>
    );
  }

  const { brand, revenueTrends, products, campaigns, alerts, reports } = workspaceData;
  const cur = brand.currency || 'USD';

  // Format currency localized to the brand's marketplace currency (INR, USD, GBP, AED)
  const formatBrandCurrency = (val) => {
    if (val === null || val === undefined) return '0';
    if (cur === 'INR') {
      if (Math.abs(val) >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
      if (Math.abs(val) >= 100000) return `₹${(val / 100000).toFixed(1)} L`;
      return `₹${Math.round(val).toLocaleString('en-IN')}`;
    }
    if (cur === 'GBP') {
      if (Math.abs(val) >= 1000000) return `£${(val / 1000000).toFixed(2)}M`;
      if (Math.abs(val) >= 10000) return `£${(val / 1000).toFixed(1)}k`;
      return `£${Math.round(val).toLocaleString()}`;
    }
    if (cur === 'AED') {
      return `AED ${Math.round(val).toLocaleString()}`;
    }
    return formatCurrency(val, 'USD');
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Building2 },
    { id: 'trends', label: 'Revenue Trends', icon: TrendingUp },
    { id: 'products', label: 'Product Performance', icon: Package },
    { id: 'campaigns', label: 'Campaigns & PPC', icon: BarChart3 },
    { id: 'alerts', label: 'Alerts', icon: AlertTriangle, count: alerts.length },
    { id: 'reports', label: 'Reports & Audits', icon: FileText },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header: Back Button & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-semibold text-harpy-subtle hover:text-white transition-colors cursor-pointer group"
        >
          <div className="p-1 rounded-md bg-slate-800 border border-slate-700 group-hover:bg-slate-700">
            <ArrowLeft className="w-3.5 h-3.5" />
          </div>
          <span>Back to Brand Portfolio</span>
        </button>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="xs"
            leftIcon={<Edit className="w-3.5 h-3.5" />}
            onClick={() => onEdit(brand)}
          >
            Edit Brand Targets
          </Button>
          <Button
            variant="secondary"
            size="xs"
            leftIcon={<RefreshCw className="w-3.5 h-3.5 text-electric" />}
            onClick={() => alert(`Synchronizing ${brand.name} via Amazon SP-API...`)}
          >
            Sync SP-API
          </Button>
        </div>
      </div>

      {/* Hero Workspace Banner */}
      <div className="rounded-2xl p-6 bg-gradient-to-r from-harpy-charcoal via-harpy-card to-harpy-charcoal border border-harpy-cardBorder relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald/30 via-slate-800 to-electric/20 border border-emerald/40 flex items-center justify-center font-extrabold text-white text-xl shadow-emerald-glow shrink-0">
              {brand.code}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-2xl font-bold text-white tracking-tight">{brand.name}</h1>
                <Badge variant="emerald" dot pulseDot size="sm">
                  {brand.status}
                </Badge>
                <span className="text-xs text-slate-300 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700 font-mono">
                  {brand.marketplace}
                </span>
              </div>
              <p className="text-xs text-harpy-subtle max-w-xl leading-relaxed">
                {brand.description || 'Enterprise D2C brand operating on Amazon marketplace with integrated SP-API telemetry.'}
              </p>
              <div className="flex items-center gap-3 pt-1 text-xs text-slate-300">
                <span className="text-harpy-subtle">Category: <strong className="text-slate-200">{brand.category}</strong></span>
                <span>•</span>
                <span className="text-harpy-subtle">Catalog: <strong className="text-slate-200">{brand.productCount} Active ASINs</strong></span>
                <span>•</span>
                <span className="text-harpy-subtle">Health: <strong className="text-emerald">{brand.healthScore}/100</strong></span>
              </div>
            </div>
          </div>

          {/* Quick Target Badges */}
          <div className="flex sm:flex-row md:flex-col gap-2 shrink-0">
            <div className="p-2.5 rounded-lg bg-harpy-navy/90 border border-harpy-cardBorder text-right">
              <span className="text-[10px] text-harpy-subtle block uppercase tracking-wider font-semibold">
                Target ACoS
              </span>
              <span className="text-sm font-bold text-white">&lt; {brand.targetAcos}%</span>
            </div>
            <div className="p-2.5 rounded-lg bg-harpy-navy/90 border border-harpy-cardBorder text-right">
              <span className="text-[10px] text-harpy-subtle block uppercase tracking-wider font-semibold">
                Target TACoS
              </span>
              <span className="text-sm font-bold text-emerald">&lt; {brand.targetTacos}%</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 overflow-x-auto mt-6 pt-4 border-t border-harpy-cardBorder/60 scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all shrink-0 cursor-pointer',
                  isActive
                    ? 'bg-emerald text-slate-950 shadow-emerald-glow'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                )}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span
                    className={cn(
                      'text-[10px] px-1.5 py-0.2 rounded-full font-bold',
                      isActive ? 'bg-slate-950 text-emerald' : 'bg-slate-800 text-slate-300'
                    )}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Key Metric Snapshot Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <Card hover className="p-4 border-emerald/20">
              <span className="text-[11px] text-harpy-subtle uppercase tracking-wider font-semibold block mb-1">
                Total Revenue
              </span>
              <p className="text-2xl font-bold text-white">
                {formatBrandCurrency(brand.revenue)}
              </p>
              <span className="text-[10px] text-emerald font-semibold mt-1 block">
                +14.2% MoM growth
              </span>
            </Card>

            <Card hover className="p-4 border-electric/20">
              <span className="text-[11px] text-harpy-subtle uppercase tracking-wider font-semibold block mb-1">
                PPC Ad Spend
              </span>
              <p className="text-2xl font-bold text-white">
                {formatBrandCurrency(brand.adSpend)}
              </p>
              <span className="text-[10px] text-electric font-semibold mt-1 block">
                Controlled budget pacing
              </span>
            </Card>

            <Card hover className="p-4">
              <span className="text-[11px] text-harpy-subtle uppercase tracking-wider font-semibold block mb-1">
                Current ROAS
              </span>
              <p className="text-2xl font-bold text-white">{brand.roas}x</p>
              <span className="text-[10px] text-emerald font-semibold mt-1 block">
                Target: &gt; 4.0x
              </span>
            </Card>

            <Card hover className="p-4">
              <span className="text-[11px] text-harpy-subtle uppercase tracking-wider font-semibold block mb-1">
                Current TACoS
              </span>
              <p className="text-2xl font-bold text-emerald">{brand.tacos}%</p>
              <span className="text-[10px] text-slate-400 font-medium mt-1 block">
                Target: &lt; {brand.targetTacos}%
              </span>
            </Card>

            <Card hover className="p-4 border-emerald/20">
              <span className="text-[11px] text-harpy-subtle uppercase tracking-wider font-semibold block mb-1">
                Estimated Net Profit
              </span>
              <p className="text-2xl font-bold text-emerald">
                {formatBrandCurrency(brand.estimatedProfit)}
              </p>
              <span className="text-[10px] text-emerald font-semibold mt-1 block">
                {brand.profitMargin || 25}% Net Margin
              </span>
            </Card>
          </div>

          {/* Revenue Chart */}
          <ChartCard
            title={`${brand.name} — Revenue & TACoS Velocity`}
            subtitle="Correlating Gross Amazon Sales against PPC Ad Spend and TACoS trajectory"
            height="h-72"
          >
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={revenueTrends} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                <XAxis dataKey="date" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis
                  yAxisId="left"
                  stroke="#64748B"
                  fontSize={11}
                  tickLine={false}
                  tickFormatter={(v) => (cur === 'INR' ? `₹${(v / 1000).toFixed(0)}k` : `$${(v / 1000).toFixed(0)}k`)}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  stroke="#64748B"
                  fontSize={11}
                  tickLine={false}
                  tickFormatter={(v) => `${v}%`}
                />
                <Tooltip content={<CustomTooltip currency={cur} />} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="grossSales"
                  name="Gross Revenue"
                  stroke="#22C55E"
                  strokeWidth={2.5}
                  fill="#22C55E"
                  fillOpacity={0.15}
                />
                <Bar
                  yAxisId="left"
                  dataKey="adSpend"
                  name="PPC Ad Spend"
                  fill="#38BDF8"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={28}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="tacos"
                  name="TACoS %"
                  stroke="#F59E0B"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Top Products Quick View */}
          <Card>
            <CardHeader>
              <div>
                <CardTitle>Catalog Hero Products</CardTitle>
                <CardDescription>Top revenue contributors and FBA stock health</CardDescription>
              </div>
              <Button variant="outline" size="xs" onClick={() => setActiveTab('products')}>
                View All {products.length} Products
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-harpy-cardBorder bg-harpy-charcoal/50 text-harpy-subtle uppercase text-[10px] tracking-wider font-semibold">
                      <th className="py-3 px-4">Product Title / ASIN</th>
                      <th className="py-3 px-4">Units Sold</th>
                      <th className="py-3 px-4">Gross Revenue</th>
                      <th className="py-3 px-4">Buy Box %</th>
                      <th className="py-3 px-4">FBA Stock Runway</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-harpy-cardBorder/40">
                    {products.map((p) => (
                      <tr key={p.asin} className="hover:bg-slate-800/30">
                        <td className="py-3.5 px-4">
                          <span className="font-semibold text-white block">{p.title}</span>
                          <span className="text-[10px] text-electric font-mono">{p.asin} • {p.sku}</span>
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-slate-200">
                          {formatNumber(p.unitsSold)}
                        </td>
                        <td className="py-3.5 px-4 font-bold text-white">
                          {formatBrandCurrency(p.revenue)}
                        </td>
                        <td className="py-3.5 px-4 text-emerald font-semibold">{p.buyBox}%</td>
                        <td className="py-3.5 px-4">
                          <Badge variant={p.stockDays > 25 ? 'emerald' : 'amber'} size="xs" dot>
                            {p.stockDays} days supply
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tab 2: Revenue Trends */}
      {activeTab === 'trends' && (
        <div className="space-y-6">
          <ChartCard
            title="Organic Sales vs PPC Attributed Sales"
            subtitle="Tracking brand equity growth by monitoring the organic ratio over time"
            height="h-80"
          >
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={revenueTrends} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                <XAxis dataKey="date" stroke="#64748B" fontSize={11} tickLine={false} />
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
                  dataKey="organicSales"
                  name="Organic Amazon Sales"
                  stroke="#38BDF8"
                  strokeWidth={2}
                  fill="#38BDF8"
                  fillOpacity={0.2}
                />
                <Area
                  type="monotone"
                  dataKey="adSales"
                  name="Attributed PPC Sales"
                  stroke="#22C55E"
                  strokeWidth={2}
                  fill="#22C55E"
                  fillOpacity={0.2}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      )}

      {/* Tab 3: Product Performance */}
      {activeTab === 'products' && (
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Catalog Product Performance</CardTitle>
              <CardDescription>Granular unit economics, BSR rank, and Buy Box win rate per SKU</CardDescription>
            </div>
            <Badge variant="electric" size="xs">
              {products.length} Products Monitored
            </Badge>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-harpy-cardBorder bg-harpy-charcoal/50 text-harpy-subtle uppercase text-[10px] tracking-wider font-semibold">
                    <th className="py-3 px-4">ASIN & SKU</th>
                    <th className="py-3 px-4">List Price</th>
                    <th className="py-3 px-4">Units Sold</th>
                    <th className="py-3 px-4">Gross Revenue</th>
                    <th className="py-3 px-4">Best Sellers Rank</th>
                    <th className="py-3 px-4">Buy Box %</th>
                    <th className="py-3 px-4">FBA Stock Runway</th>
                    <th className="py-3 px-4">Inventory Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-harpy-cardBorder/40">
                  {products.map((p) => (
                    <tr key={p.asin} className="hover:bg-slate-800/30">
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-white block">{p.title}</span>
                        <span className="text-[10px] text-electric font-mono">{p.asin} • {p.sku}</span>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-slate-200">
                        {cur === 'INR' ? `₹${p.price}` : `$${p.price}`}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-200">
                        {formatNumber(p.unitsSold)}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-white">
                        {formatBrandCurrency(p.revenue)}
                      </td>
                      <td className="py-3.5 px-4 text-slate-300 font-medium">#{p.bsr}</td>
                      <td className="py-3.5 px-4 text-emerald font-semibold">{p.buyBox}%</td>
                      <td className="py-3.5 px-4 font-semibold text-slate-200">{p.stockDays} days</td>
                      <td className="py-3.5 px-4">
                        <Badge variant={p.status === 'In Stock' ? 'emerald' : 'amber'} size="xs" dot>
                          {p.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tab 4: Campaign Performance */}
      {activeTab === 'campaigns' && (
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Amazon PPC Campaigns</CardTitle>
              <CardDescription>Sponsored Products, Sponsored Brands, and Sponsored Display breakdown</CardDescription>
            </div>
            <Badge variant="emerald" size="xs">
              Blended ROAS {brand.roas}x
            </Badge>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-harpy-cardBorder bg-harpy-charcoal/50 text-harpy-subtle uppercase text-[10px] tracking-wider font-semibold">
                    <th className="py-3 px-4">Campaign Name</th>
                    <th className="py-3 px-4">Ad Type</th>
                    <th className="py-3 px-4">Ad Spend</th>
                    <th className="py-3 px-4">Attributed Sales</th>
                    <th className="py-3 px-4">ACoS</th>
                    <th className="py-3 px-4">ROAS</th>
                    <th className="py-3 px-4">Impressions / Clicks</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-harpy-cardBorder/40">
                  {campaigns.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-800/30">
                      <td className="py-3.5 px-4 font-semibold text-white">{c.name}</td>
                      <td className="py-3.5 px-4">
                        <Badge variant="slate" size="xs">{c.type}</Badge>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-200">
                        {formatBrandCurrency(c.spend)}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-emerald">
                        {formatBrandCurrency(c.sales)}
                      </td>
                      <td className="py-3.5 px-4">
                        <Badge variant={c.acos < 24 ? 'emerald' : 'amber'} size="xs">
                          {c.acos}%
                        </Badge>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-white">{c.roas}x</td>
                      <td className="py-3.5 px-4 text-[11px] text-harpy-subtle">
                        {formatNumber(c.impressions)} imp • {formatNumber(c.clicks)} clicks ({c.ctr}%)
                      </td>
                      <td className="py-3.5 px-4">
                        <Badge variant="emerald" dot size="xs">{c.status}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tab 5: Alerts */}
      {activeTab === 'alerts' && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <CardTitle>Active Brand Alerts</CardTitle>
            </div>
            <Badge variant="amber" size="xs">{alerts.length} Notifications</Badge>
          </CardHeader>
          <CardContent className="space-y-3 p-6">
            {alerts.map((al) => (
              <div
                key={al.id}
                className={cn(
                  'p-4 rounded-xl border flex items-start justify-between gap-4',
                  al.type === 'warning'
                    ? 'bg-amber-950/20 border-amber-500/30 text-amber-200'
                    : 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200'
                )}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={cn('w-2 h-2 rounded-full', al.type === 'warning' ? 'bg-amber-400' : 'bg-emerald-400')} />
                    <h4 className="text-xs font-bold">{al.title}</h4>
                  </div>
                  <p className="text-xs text-harpy-subtle pl-4 leading-relaxed">{al.description}</p>
                </div>
                <span className="text-[10px] text-slate-500 whitespace-nowrap shrink-0">{al.date}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Tab 6: Reports */}
      {activeTab === 'reports' && (
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Financial Statements & Audit Reports</CardTitle>
              <CardDescription>Amazon settlement reconciliations and advertising statement downloads</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="primary"
                size="xs"
                leftIcon={<Sparkles className="w-3.5 h-3.5" />}
                onClick={() => navigate('/reports')}
              >
                Executive Client Report (PDF)
              </Button>
              <Button variant="outline" size="xs" leftIcon={<Download className="w-3.5 h-3.5" />}>
                Download All
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 p-6">
            {reports.map((rep) => (
              <div
                key={rep.id}
                className="flex items-center justify-between p-4 rounded-xl bg-harpy-charcoal/70 border border-harpy-cardBorder hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-electric">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">{rep.title}</h4>
                    <p className="text-[11px] text-harpy-subtle">
                      Period: {rep.period} • Reconciled: <strong className="text-emerald">{rep.disbursement}</strong>
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="xs"
                  leftIcon={<Download className="w-3.5 h-3.5" />}
                  onClick={() => alert(`Downloading ${rep.title} (${rep.format})...`)}
                >
                  Download {rep.format}
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default BrandWorkspaceView;

