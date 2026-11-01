import React, { useState, useEffect, useMemo } from 'react';
import {
  Package,
  Search,
  Filter,
  ArrowUpDown,
  DollarSign,
  TrendingUp,
  Percent,
  AlertTriangle,
  CheckCircle2,
  Sliders,
  ExternalLink,
  Building2,
  Download,
  AlertOctagon,
  Sparkles,
  HelpCircle,
  Eye,
  X,
  ChevronRight,
  RotateCcw,
} from 'lucide-react';
import { useBrand } from '../context/BrandContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { EmptyState } from '../components/common/EmptyState';
import { Skeleton } from '../components/common/Skeleton';
import { ProductDetailView } from '../components/products/ProductDetailView';
import productService from '../services/productService';
import { formatCurrency, formatNumber, formatPercentage } from '../utils/formatters';
import { cn } from '../utils/cn';

const SORT_OPTIONS = [
  { id: 'profit-desc', label: 'Highest Estimated Profit' },
  { id: 'profit-asc', label: 'Lowest Estimated Profit' },
  { id: 'revenue-desc', label: 'Highest Total Revenue' },
  { id: 'revenue-asc', label: 'Lowest Total Revenue' },
  { id: 'margin-desc', label: 'Highest Profit Margin %' },
  { id: 'units-desc', label: 'Highest Units Sold' },
  { id: 'acos-desc', label: 'Highest ACoS (Ad Heavy)' },
  { id: 'acos-asc', label: 'Lowest ACoS (Efficient)' },
];

const PERFORMANCE_FILTERS = [
  { id: 'All', label: 'All Catalog Products' },
  { id: 'High Revenue Low Profit', label: 'High-Revenue, Low-Profit', badge: 'Margin Squeeze' },
  { id: 'Low Performing', label: 'Low Performing / Unprofitable', badge: 'Bleed' },
  { id: 'Star Performer', label: 'Star Performers (Margin ≥ 25%)', badge: 'Scale' },
  { id: 'Incomplete Cost Data', label: 'Incomplete Cost Data', badge: 'Action Req' },
];

export function SalesAnalytics() {
  const { brands, selectedBrand, selectedCurrency } = useBrand();

  const [products, setProducts] = useState([]);
  const [summary, setSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Filters & Sorting
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBrandId, setFilterBrandId] = useState('All');
  const [performanceFilter, setPerformanceFilter] = useState('All');
  const [sortBy, setSortBy] = useState('profit-desc');

  // Active individual product deep-dive view
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Sync brand from global brand context if changed
  useEffect(() => {
    if (selectedBrand && selectedBrand.id !== 'all') {
      setFilterBrandId(selectedBrand.id);
    } else {
      setFilterBrandId('All');
    }
  }, [selectedBrand.id]);

  // Load products and summary
  const loadData = async () => {
    setIsLoading(true);
    try {
      const [list, sum] = await Promise.all([
        productService.getProducts({
          search: searchQuery,
          brandId: filterBrandId,
          performanceFilter,
          sortBy,
        }),
        productService.getCatalogSummary(filterBrandId),
      ]);
      setProducts(list);
      setSummary(sum);
    } catch (err) {
      console.error('Failed to load products:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [searchQuery, filterBrandId, performanceFilter, sortBy]);

  // Format currency localized per product/currency
  const formatBrandCurrency = (val, cur = selectedCurrency) => {
    if (val === null || val === undefined) return 'N/A';
    if (cur === 'INR') {
      if (Math.abs(val) >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
      if (Math.abs(val) >= 100000) return `₹${(val / 100000).toFixed(1)} L`;
      return `₹${Math.round(val).toLocaleString('en-IN')}`;
    }
    if (cur === 'GBP') return `£${Math.round(val).toLocaleString()}`;
    return formatCurrency(val, 'USD');
  };

  // If a product is selected, render the Product Detail Page
  if (selectedProduct) {
    return (
      <ProductDetailView
        product={selectedProduct}
        onBack={() => setSelectedProduct(null)}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* 1. Header Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Product & Profit Analytics
            </h1>
            <Badge variant="emerald" dot pulseDot size="sm">
              Unit Economics
            </Badge>
          </div>
          <p className="text-xs text-harpy-subtle mt-1 max-w-3xl leading-relaxed">
            Distinguishing top-line Amazon gross merchandise volume from true bottom-line contribution profit by deducting product cost (COGS), marketplace referral fees, FBA fulfillment, and advertising.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Download className="w-3.5 h-3.5" />}
            onClick={() => alert('Exporting product-level profitability CSV...')}
          >
            Export Unit Economics
          </Button>
        </div>
      </div>

      {/* 2. Catalog Profitability Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Gross Revenue */}
          <Card hover className="p-4 border-slate-700/60 border-t-2 border-t-slate-500 bg-gradient-to-b from-slate-900/40 to-harpy-charcoal relative overflow-hidden group">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] text-harpy-subtle uppercase tracking-wider font-semibold">
                Catalog Gross Revenue
              </span>
              <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700/80 flex items-center justify-center text-slate-300 group-hover:text-emerald transition-colors">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-bold text-white tracking-tight">
              {formatBrandCurrency(summary.totalRevenue)}
            </p>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-2">
              <span className="text-emerald font-semibold flex items-center">
                <TrendingUp className="w-3 h-3 mr-0.5" /> GMV
              </span>
              <span>•</span>
              <span>{formatNumber(summary.totalUnits)} units ordered</span>
            </div>
          </Card>

          {/* Card 2: Contribution Profit */}
          <Card hover className="p-4 border-emerald/30 border-t-2 border-t-emerald bg-gradient-to-b from-emerald-950/20 to-harpy-charcoal relative overflow-hidden group">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] text-emerald uppercase tracking-wider font-bold">
                Total Contribution Profit
              </span>
              <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald shadow-emerald-glow group-hover:scale-105 transition-transform">
                <Percent className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-bold text-emerald tracking-tight">
              {formatBrandCurrency(summary.totalProfit)}
            </p>
            <div className="flex items-center gap-1.5 text-[11px] text-emerald mt-2 font-medium">
              <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-[10px] font-bold border border-emerald-500/30">
                {summary.blendedMargin}% Net Margin
              </span>
              <span className="text-harpy-subtle text-[10px]">after COGS + Fees + Ads</span>
            </div>
          </Card>

          {/* Card 3: High-Rev, Low-Profit */}
          <Card
            hover
            onClick={() => setPerformanceFilter(performanceFilter === 'High Revenue Low Profit' ? 'All' : 'High Revenue Low Profit')}
            className={cn(
              'p-4 cursor-pointer transition-all border-t-2 group',
              summary.highRevLowProfitCount > 0
                ? 'border-amber-500/50 border-t-amber-500 bg-gradient-to-b from-amber-950/20 to-harpy-charcoal hover:border-amber-500 shadow-sm shadow-amber-500/5'
                : 'border-slate-800 border-t-slate-700'
            )}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] text-amber-400 uppercase tracking-wider font-bold">
                High-Rev, Low-Profit
              </span>
              <div className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
                <AlertTriangle className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-bold text-white tracking-tight">
              {summary.highRevLowProfitCount} {summary.highRevLowProfitCount === 1 ? 'SKU' : 'SKUs'}
            </p>
            <span className="text-[11px] text-amber-300 font-medium mt-2 block">
              {summary.highRevLowProfitCount > 0 ? 'Margin squeeze flagged (Click to filter)' : 'No margin squeezes detected'}
            </span>
          </Card>

          {/* Card 4: Incomplete Cost Data */}
          <Card
            hover
            onClick={() => setPerformanceFilter(performanceFilter === 'Incomplete Cost Data' ? 'All' : 'Incomplete Cost Data')}
            className={cn(
              'p-4 cursor-pointer transition-all border-t-2 group',
              summary.incompleteCostCount > 0
                ? 'border-sky-500/50 border-t-sky-400 bg-gradient-to-b from-sky-950/20 to-harpy-charcoal hover:border-sky-400 shadow-sm shadow-sky-500/5'
                : 'border-slate-800 border-t-slate-700'
            )}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] text-electric uppercase tracking-wider font-bold">
                Incomplete Cost Data
              </span>
              <div className="w-8 h-8 rounded-lg bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-electric group-hover:scale-105 transition-transform">
                <AlertOctagon className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-bold text-white tracking-tight">
              {summary.incompleteCostCount} {summary.incompleteCostCount === 1 ? 'SKU' : 'SKUs'}
            </p>
            <span className="text-[11px] text-electric font-medium mt-2 block">
              {summary.incompleteCostCount > 0 ? 'COGS verification pending (Click to filter)' : 'All product COGS verified'}
            </span>
          </Card>
        </div>
      )}

      {/* 3. Filter, Search, and Sort Controls */}
      <Card className="p-4 bg-harpy-charcoal/90 border-harpy-cardBorder space-y-3.5 shadow-xl">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by product title, SKU, or ASIN..."
              className="w-full bg-harpy-navy border border-harpy-cardBorder rounded-lg text-xs text-slate-100 placeholder-slate-500 pl-9 pr-8 py-2.5 focus:outline-none focus:border-emerald/60 focus:ring-1 focus:ring-emerald/40 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-0.5"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Brand & Sort Dropdowns */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Brand Filter */}
            <div className="flex items-center gap-1.5 bg-harpy-navy border border-harpy-cardBorder px-2.5 py-1 rounded-lg">
              <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <select
                value={filterBrandId}
                onChange={(e) => setFilterBrandId(e.target.value)}
                className="bg-transparent border-none text-xs text-slate-200 focus:outline-none cursor-pointer pr-2"
              >
                <option value="All" className="bg-harpy-charcoal text-white">All Client Brands</option>
                {brands
                  .filter((b) => b.id !== 'all')
                  .map((b) => (
                    <option key={b.id} value={b.id} className="bg-harpy-charcoal text-white">
                      {b.name}
                    </option>
                  ))}
              </select>
            </div>

            {/* Sort Selector */}
            <div className="flex items-center gap-1.5 bg-harpy-navy border border-harpy-cardBorder px-2.5 py-1 rounded-lg">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent border-none text-xs text-slate-200 focus:outline-none cursor-pointer pr-2"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.id} value={opt.id} className="bg-harpy-charcoal text-white">
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Reset Filters button if active */}
            {(searchQuery || filterBrandId !== 'All' || performanceFilter !== 'All') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setFilterBrandId('All');
                  setPerformanceFilter('All');
                }}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/30 transition-all"
                title="Reset all filters"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Quick Performance Identification Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pt-2.5 border-t border-harpy-cardBorder/50 scrollbar-none">
          <span className="text-[10px] font-bold uppercase tracking-wider text-harpy-subtle shrink-0 mr-1">
            Profit Filters:
          </span>
          {PERFORMANCE_FILTERS.map((f) => {
            const isActive = performanceFilter === f.id;
            return (
              <button
                key={f.id}
                onClick={() => setPerformanceFilter(f.id)}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 cursor-pointer border',
                  isActive
                    ? 'bg-emerald-500/15 text-emerald border-emerald-500/50 shadow-sm shadow-emerald-500/10 font-bold ring-1 ring-emerald-500/30'
                    : 'bg-harpy-navy/70 text-slate-400 border-harpy-cardBorder/70 hover:text-slate-200 hover:bg-slate-800/60'
                )}
              >
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald shadow-emerald-glow shrink-0 animate-pulse" />
                )}
                <span>{f.label}</span>
                {f.badge && (
                  <span
                    className={cn(
                      'text-[9px] px-1.5 py-0.2 rounded font-semibold',
                      isActive
                        ? 'bg-emerald-500/25 text-emerald border border-emerald-500/40'
                        : f.badge === 'Margin Squeeze'
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/25'
                        : f.badge === 'Bleed'
                        ? 'bg-rose-500/10 text-rose-400 border border-rose-500/25'
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    )}
                  >
                    {f.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </Card>

      {/* 4. The Product Table (All 13 Columns with Sticky Product Column & Right Alignment) */}
      <Card className="border-harpy-cardBorder shadow-2xl overflow-hidden">
        <CardHeader className="flex-wrap gap-2 pb-3 border-b border-harpy-cardBorder/60 bg-harpy-charcoal/40">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-base sm:text-lg">Catalog Products & True Profit Attribution</CardTitle>
              <Badge variant="emerald" size="xs">
                {products.length} Products Monitored
              </Badge>
            </div>
            <CardDescription className="text-xs text-harpy-subtle mt-0.5">
              Comprehensive SKU financials incorporating COGS, Amazon referral fees, FBA pick/pack fees, and PPC advertising.
            </CardDescription>
          </div>

          <div className="flex items-center gap-2 text-xs text-harpy-subtle">
            <span className="hidden sm:inline">Click any row to open full unit economics waterfall</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-slate-700/60 scrollbar-track-harpy-navy">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-harpy-cardBorder bg-slate-900/90 text-harpy-subtle uppercase text-[10px] tracking-wider font-semibold">
                  {/* Sticky Column Header */}
                  <th className="py-3 px-4 min-w-[280px] sticky left-0 z-30 bg-slate-900 shadow-[4px_0_12px_rgba(0,0,0,0.5)] border-r border-harpy-cardBorder/80">
                    Product Name & ASIN
                  </th>
                  <th className="py-3 px-3 min-w-[110px]">SKU</th>
                  <th className="py-3 px-3 min-w-[90px] text-center">Brand</th>
                  <th className="py-3 px-3 min-w-[105px] text-right">Selling Price</th>
                  <th className="py-3 px-3 min-w-[95px] text-right">Units Sold</th>
                  <th className="py-3 px-3 min-w-[115px] text-right">Total Revenue</th>
                  <th className="py-3 px-3 min-w-[105px] text-right">Ad Spend</th>
                  <th className="py-3 px-3 min-w-[115px] text-right">Product Cost (COGS)</th>
                  <th className="py-3 px-3 min-w-[115px] text-right">Amazon Fees</th>
                  <th className="py-3 px-3 min-w-[110px] text-right">FBA Fulfilment</th>
                  <th className="py-3 px-3 min-w-[130px] text-right font-bold text-white">Estimated Profit</th>
                  <th className="py-3 px-3 min-w-[110px] text-center">Net Margin</th>
                  <th className="py-3 px-3 min-w-[90px] text-right">ACOS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-harpy-cardBorder/40">
                {isLoading ? (
                  <tr>
                    <td colSpan={13} className="py-16 text-center text-harpy-subtle">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <div className="w-6 h-6 border-2 border-emerald border-t-transparent rounded-full animate-spin" />
                        <span>Loading unit economics and contribution profit telemetry...</span>
                      </div>
                    </td>
                  </tr>
                ) : products.length === 0 ? (
                  <tr>
                    <td colSpan={13} className="py-12 text-center">
                      <EmptyState
                        title="No Products Match Filter"
                        description="Try resetting your performance criteria, search query, or brand filter."
                        actionLabel="Reset Filters"
                        onAction={() => {
                          setSearchQuery('');
                          setFilterBrandId('All');
                          setPerformanceFilter('All');
                        }}
                      />
                    </td>
                  </tr>
                ) : (
                  products.map((p) => {
                    const cur = p.currency || 'USD';
                    return (
                      <tr
                        key={p.asin}
                        onClick={() => setSelectedProduct(p)}
                        className={cn(
                          'hover:bg-slate-800/60 transition-colors cursor-pointer group',
                          p.performanceClass === 'High Revenue Low Profit' && 'bg-amber-950/10',
                          p.performanceClass === 'Low Performing' && 'bg-rose-950/15'
                        )}
                      >
                        {/* 1. Product Name (Sticky Left Column) */}
                        <td className="py-3 px-4 sticky left-0 z-10 bg-harpy-charcoal group-hover:bg-slate-850 shadow-[4px_0_12px_rgba(0,0,0,0.5)] border-r border-harpy-cardBorder/80 transition-colors">
                          <div className="space-y-1 max-w-xs">
                            <span className="font-bold text-white group-hover:text-emerald transition-colors line-clamp-1 block leading-snug">
                              {p.title}
                            </span>
                            <div className="flex items-center gap-1.5 text-[10px] text-harpy-subtle">
                              <span className="font-mono text-electric font-medium">{p.asin}</span>
                              {p.isCostIncomplete && (
                                <span className="px-1.5 py-0.2 rounded text-[9px] font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                                  Missing COGS
                                </span>
                              )}
                              {p.performanceClass === 'High Revenue Low Profit' && (
                                <span className="px-1.5 py-0.2 rounded text-[9px] font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                                  Margin Squeeze
                                </span>
                              )}
                              {p.performanceClass === 'Low Performing' && (
                                <span className="px-1.5 py-0.2 rounded text-[9px] font-semibold bg-rose-500/15 text-rose-400 border border-rose-500/30">
                                  Bleed
                                </span>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* 2. SKU */}
                        <td className="py-3 px-3 font-mono text-slate-300 font-medium text-xs">
                          {p.sku}
                        </td>

                        {/* 3. Brand */}
                        <td className="py-3 px-3 text-center">
                          <Badge variant="slate" size="xs">
                            {p.brandCode}
                          </Badge>
                        </td>

                        {/* 4. Selling Price */}
                        <td className="py-3 px-3 font-semibold text-white text-right tabular-nums">
                          {formatBrandCurrency(p.sellingPrice, cur)}
                        </td>

                        {/* 5. Units Sold */}
                        <td className="py-3 px-3 font-medium text-slate-200 text-right tabular-nums">
                          {formatNumber(p.unitsSold)}
                        </td>

                        {/* 6. Total Revenue */}
                        <td className="py-3 px-3 font-bold text-white text-right tabular-nums">
                          {formatBrandCurrency(p.totalRevenue, cur)}
                        </td>

                        {/* 7. Advertising Spend */}
                        <td className="py-3 px-3 font-medium text-slate-300 text-right tabular-nums">
                          {formatBrandCurrency(p.adSpend, cur)}
                        </td>

                        {/* 8. Product Cost (COGS) */}
                        <td className="py-3 px-3 text-right tabular-nums">
                          {p.isCostIncomplete ? (
                            <span className="text-[11px] text-amber-400 font-medium italic">
                              Pending COGS
                            </span>
                          ) : (
                            <span className="font-mono text-slate-300">
                              {formatBrandCurrency(p.productCost, cur)}
                            </span>
                          )}
                        </td>

                        {/* 9. Marketplace Fees */}
                        <td className="py-3 px-3 font-mono text-slate-400 text-right tabular-nums">
                          {formatBrandCurrency(p.marketplaceFees, cur)}
                        </td>

                        {/* 10. Fulfilment Cost */}
                        <td className="py-3 px-3 font-mono text-slate-400 text-right tabular-nums">
                          {formatBrandCurrency(p.fulfilmentCost, cur)}
                        </td>

                        {/* 11. Estimated Profit (Contribution Profit) */}
                        <td className="py-3 px-3 font-bold text-right tabular-nums">
                          {p.isCostIncomplete ? (
                            <span className="text-amber-400 font-medium text-xs">
                              Provisional
                            </span>
                          ) : (
                            <span className={p.estimatedProfit >= 0 ? 'text-emerald font-extrabold' : 'text-rose-400 font-extrabold'}>
                              {formatBrandCurrency(p.estimatedProfit, cur)}
                            </span>
                          )}
                        </td>

                        {/* 12. Profit Margin */}
                        <td className="py-3 px-3 text-center">
                          {p.isCostIncomplete ? (
                            <Badge variant="amber" size="xs">
                              Pending
                            </Badge>
                          ) : (
                            <Badge
                              variant={
                                p.profitMargin >= 25
                                  ? 'emerald'
                                  : p.profitMargin >= 10
                                  ? 'electric'
                                  : p.profitMargin >= 0
                                  ? 'amber'
                                  : 'rose'
                              }
                              size="xs"
                            >
                              {p.profitMargin}%
                            </Badge>
                          )}
                        </td>

                        {/* 13. ACOS */}
                        <td className="py-3 px-3 font-semibold text-slate-200 text-right tabular-nums">
                          {p.acos}%
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer Status Bar */}
          {products.length > 0 && (
            <div className="px-4 py-3 bg-harpy-charcoal/80 border-t border-harpy-cardBorder/60 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-harpy-subtle">
              <div className="flex items-center gap-2">
                <span className="text-slate-300 font-medium">
                  Showing {products.length} catalog items
                </span>
                <span>•</span>
                <span>
                  Contribution Profit = Revenue - (COGS + Referral + FBA + PPC)
                </span>
              </div>
              <div className="flex items-center gap-3 font-mono text-[11px]">
                <span>
                  Catalog GMV:{' '}
                  <strong className="text-white">
                    {formatBrandCurrency(products.reduce((acc, x) => acc + (x.totalRevenue || 0), 0))}
                  </strong>
                </span>
                <span>•</span>
                <span>
                  Est. Net Profit:{' '}
                  <strong className="text-emerald">
                    {formatBrandCurrency(products.reduce((acc, x) => acc + (x.estimatedProfit || 0), 0))}
                  </strong>
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default SalesAnalytics;
