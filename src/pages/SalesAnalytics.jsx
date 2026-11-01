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
          <Card hover className="p-4 border-slate-700/60">
            <span className="text-[10px] text-harpy-subtle uppercase tracking-wider font-semibold block mb-1">
              Catalog Gross Revenue
            </span>
            <p className="text-2xl font-bold text-white">
              {formatBrandCurrency(summary.totalRevenue)}
            </p>
            <span className="text-[10px] text-slate-400 mt-1 block">
              {formatNumber(summary.totalUnits)} total units ordered
            </span>
          </Card>

          <Card hover className="p-4 border-emerald/30 bg-emerald-950/10">
            <span className="text-[10px] text-emerald uppercase tracking-wider font-bold block mb-1">
              Total Contribution Profit
            </span>
            <p className="text-2xl font-bold text-emerald">
              {formatBrandCurrency(summary.totalProfit)}
            </p>
            <span className="text-[10px] text-emerald font-semibold mt-1 block">
              {summary.blendedMargin}% Blended Net Margin
            </span>
          </Card>

          <Card
            hover
            onClick={() => setPerformanceFilter('High Revenue Low Profit')}
            className={cn(
              'p-4 cursor-pointer transition-all',
              summary.highRevLowProfitCount > 0
                ? 'border-amber-500/40 bg-amber-950/10 hover:border-amber-500'
                : 'border-slate-800'
            )}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-amber-400 uppercase tracking-wider font-bold block">
                High-Rev, Low-Profit
              </span>
              <AlertTriangle className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-2xl font-bold text-white mt-1">
              {summary.highRevLowProfitCount} SKUs
            </p>
            <span className="text-[10px] text-amber-300 font-medium mt-1 block">
              FBA or PPC margin squeeze flagged
            </span>
          </Card>

          <Card
            hover
            onClick={() => setPerformanceFilter('Incomplete Cost Data')}
            className={cn(
              'p-4 cursor-pointer transition-all',
              summary.incompleteCostCount > 0
                ? 'border-electric/40 bg-sky-950/10 hover:border-electric'
                : 'border-slate-800'
            )}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-electric uppercase tracking-wider font-bold block">
                Incomplete Cost Data
              </span>
              <AlertOctagon className="w-4 h-4 text-electric" />
            </div>
            <p className="text-2xl font-bold text-white mt-1">
              {summary.incompleteCostCount} SKUs
            </p>
            <span className="text-[10px] text-electric font-medium mt-1 block">
              Supplier COGS verification pending
            </span>
          </Card>
        </div>
      )}

      {/* 3. Filter, Search, and Sort Controls */}
      <Card className="p-4 bg-harpy-charcoal/90 space-y-3">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by product name, SKU, or ASIN..."
              className="w-full bg-harpy-navy border border-harpy-cardBorder rounded-lg text-xs text-slate-100 placeholder-slate-500 pl-9 pr-4 py-2 focus:outline-none focus:border-electric focus:ring-1 focus:ring-electric transition-colors"
            />
          </div>

          {/* Brand & Sort Dropdowns */}
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

            {/* Sort Selector */}
            <div className="flex items-center gap-1.5">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-harpy-navy border border-harpy-cardBorder rounded-lg text-xs text-slate-200 px-3 py-2 focus:outline-none focus:border-electric cursor-pointer"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Quick Performance Identification Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-harpy-cardBorder/50 scrollbar-none">
          <span className="text-[10px] font-bold uppercase tracking-wider text-harpy-subtle shrink-0">
            Profit Filters:
          </span>
          {PERFORMANCE_FILTERS.map((f) => {
            const isActive = performanceFilter === f.id;
            return (
              <button
                key={f.id}
                onClick={() => setPerformanceFilter(f.id)}
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

      {/* 4. The Product Table (All 13 Columns) */}
      <Card>
        <CardHeader className="flex-wrap gap-2">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle>Catalog Products & True Profit Attribution</CardTitle>
              <Badge variant="emerald" size="xs">
                {products.length} Products Monitored
              </Badge>
            </div>
            <CardDescription>
              Profit calculation incorporates COGS, Amazon referral commissions, FBA pick/pack fees, and PPC advertising.
            </CardDescription>
          </div>

          <span className="text-xs text-harpy-subtle">
            Click any row to open full unit economics & profit waterfall
          </span>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-harpy-cardBorder bg-harpy-charcoal/70 text-harpy-subtle uppercase text-[10px] tracking-wider font-semibold">
                  <th className="py-3 px-3 min-w-[220px]">Product Name</th>
                  <th className="py-3 px-3">SKU</th>
                  <th className="py-3 px-3">Brand</th>
                  <th className="py-3 px-3">Selling Price</th>
                  <th className="py-3 px-3">Units Sold</th>
                  <th className="py-3 px-3">Total Revenue</th>
                  <th className="py-3 px-3">Ad Spend</th>
                  <th className="py-3 px-3">Product Cost (COGS)</th>
                  <th className="py-3 px-3">Marketplace Fees</th>
                  <th className="py-3 px-3">Fulfilment Cost</th>
                  <th className="py-3 px-3">Estimated Profit</th>
                  <th className="py-3 px-3">Profit Margin</th>
                  <th className="py-3 px-3">ACOS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-harpy-cardBorder/40">
                {isLoading ? (
                  <tr>
                    <td colSpan={13} className="py-12 text-center text-harpy-subtle">
                      Loading unit economics and contribution profit telemetry...
                    </td>
                  </tr>
                ) : products.length === 0 ? (
                  <tr>
                    <td colSpan={13} className="py-12 text-center">
                      <EmptyState
                        title="No Products Match Filter"
                        description="Try resetting your performance criteria, search term, or brand selection."
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
                          'hover:bg-slate-800/40 transition-colors cursor-pointer group',
                          p.performanceClass === 'High Revenue Low Profit' && 'bg-amber-950/10',
                          p.performanceClass === 'Low Performing' && 'bg-rose-950/15'
                        )}
                      >
                        {/* 1. Product Name */}
                        <td className="py-3.5 px-3">
                          <div className="space-y-0.5 max-w-xs">
                            <span className="font-bold text-white group-hover:text-emerald transition-colors line-clamp-1 block">
                              {p.title}
                            </span>
                            <div className="flex items-center gap-1.5 text-[10px] text-harpy-subtle">
                              <span className="font-mono text-electric">{p.asin}</span>
                              {p.isCostIncomplete && (
                                <Badge variant="amber" size="xs">
                                  Incomplete Cost Data
                                </Badge>
                              )}
                              {p.performanceClass === 'High Revenue Low Profit' && (
                                <Badge variant="amber" size="xs">
                                  Margin Squeeze
                                </Badge>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* 2. SKU */}
                        <td className="py-3.5 px-3 font-mono text-slate-300 font-medium">
                          {p.sku}
                        </td>

                        {/* 3. Brand */}
                        <td className="py-3.5 px-3">
                          <Badge variant="slate" size="xs">
                            {p.brandCode}
                          </Badge>
                        </td>

                        {/* 4. Selling Price */}
                        <td className="py-3.5 px-3 font-semibold text-white">
                          {formatBrandCurrency(p.sellingPrice, cur)}
                        </td>

                        {/* 5. Units Sold */}
                        <td className="py-3.5 px-3 font-semibold text-slate-200">
                          {formatNumber(p.unitsSold)}
                        </td>

                        {/* 6. Total Revenue */}
                        <td className="py-3.5 px-3 font-bold text-white">
                          {formatBrandCurrency(p.totalRevenue, cur)}
                        </td>

                        {/* 7. Advertising Spend */}
                        <td className="py-3.5 px-3 font-semibold text-slate-300">
                          {formatBrandCurrency(p.adSpend, cur)}
                        </td>

                        {/* 8. Product Cost (COGS) */}
                        <td className="py-3.5 px-3">
                          {p.isCostIncomplete ? (
                            <span className="text-[11px] text-amber-400 font-medium italic">
                              Missing COGS
                            </span>
                          ) : (
                            <span className="font-mono text-slate-300">
                              {formatBrandCurrency(p.productCost, cur)}
                            </span>
                          )}
                        </td>

                        {/* 9. Marketplace Fees */}
                        <td className="py-3.5 px-3 font-mono text-slate-300">
                          {formatBrandCurrency(p.marketplaceFees, cur)}
                        </td>

                        {/* 10. Fulfilment Cost */}
                        <td className="py-3.5 px-3 font-mono text-slate-300">
                          {formatBrandCurrency(p.fulfilmentCost, cur)}
                        </td>

                        {/* 11. Estimated Profit (Contribution Profit) */}
                        <td className="py-3.5 px-3 font-bold">
                          {p.isCostIncomplete ? (
                            <span className="text-amber-400 font-medium text-xs">
                              Provisional
                            </span>
                          ) : (
                            <span className={p.estimatedProfit >= 0 ? 'text-emerald' : 'text-rose-400'}>
                              {formatBrandCurrency(p.estimatedProfit, cur)}
                            </span>
                          )}
                        </td>

                        {/* 12. Profit Margin */}
                        <td className="py-3.5 px-3">
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
                        <td className="py-3.5 px-3 font-semibold text-slate-200">
                          {p.acos}%
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
    </div>
  );
}

export default SalesAnalytics;
