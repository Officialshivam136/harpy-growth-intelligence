import React, { useState, useEffect, useMemo } from 'react';
import {
  Building2,
  Plus,
  Search,
  Filter,
  ArrowUpDown,
  MoreVertical,
  Edit,
  Trash2,
  ExternalLink,
  DollarSign,
  TrendingUp,
  Percent,
  Target,
  Globe,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Layers,
  Sparkles,
} from 'lucide-react';
import { useBrand } from '../context/BrandContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Input } from '../components/common/Input';
import { EmptyState } from '../components/common/EmptyState';
import { Skeleton } from '../components/common/Skeleton';
import { BrandModal } from '../components/brands/BrandModal';
import { DeleteConfirmModal } from '../components/brands/DeleteConfirmModal';
import { BrandWorkspaceView } from '../components/brands/BrandWorkspaceView';
import brandService from '../services/brandService';
import { formatCurrency, formatNumber } from '../utils/formatters';
import { cn } from '../utils/cn';

const MARKETPLACE_OPTIONS = [
  { id: 'All', label: 'All Marketplaces', flag: '🌐' },
  { id: 'Amazon India', label: 'Amazon India (amazon.in)', flag: '🇮🇳' },
  { id: 'Amazon US', label: 'Amazon US (amazon.com)', flag: '🇺🇸' },
  { id: 'Amazon UK', label: 'Amazon UK (amazon.co.uk)', flag: '🇬🇧' },
  { id: 'Amazon UAE', label: 'Amazon UAE (amazon.ae)', flag: '🇦🇪' },
];

const SORT_OPTIONS = [
  { id: 'revenue-desc', label: 'Highest Revenue' },
  { id: 'revenue-asc', label: 'Lowest Revenue' },
  { id: 'profit-desc', label: 'Highest Profitability' },
  { id: 'roas-desc', label: 'Highest ROAS' },
];

export function BrandsPortfolio() {
  const { setSelectedBrand } = useBrand();

  const [brands, setBrands] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMarketplace, setSelectedMarketplace] = useState('All');
  const [sortBy, setSortBy] = useState('revenue-desc');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);
  const [deletingBrand, setDeletingBrand] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Active individual workspace state
  const [activeWorkspaceBrandId, setActiveWorkspaceBrandId] = useState(null);

  // Load brands with search, filter, sort
  const loadBrands = async () => {
    setIsLoading(true);
    try {
      const data = await brandService.getBrands({
        search: searchQuery,
        marketplace: selectedMarketplace,
        sortBy: sortBy,
      });
      setBrands(data);
    } catch (err) {
      console.error('Failed to load brands:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBrands();
  }, [searchQuery, selectedMarketplace, sortBy]);

  // Handle Save (Create or Edit)
  const handleSaveBrand = async (formData) => {
    if (editingBrand) {
      const updated = await brandService.updateBrand(editingBrand.id, formData);
      setBrands((prev) => prev.map((b) => (b.id === editingBrand.id ? { ...b, ...updated } : b)));
    } else {
      const created = await brandService.createBrand(formData);
      setBrands((prev) => [created, ...prev]);
    }
    setEditingBrand(null);
    setIsModalOpen(false);
  };

  // Handle Delete
  const handleDeleteBrand = async () => {
    if (!deletingBrand) return;
    setIsDeleting(true);
    try {
      await brandService.deleteBrand(deletingBrand.id);
      setBrands((prev) => prev.filter((b) => b.id !== deletingBrand.id));
      setDeletingBrand(null);
    } catch (err) {
      alert(`Failed to delete brand: ${err.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  // Format currency localized per brand
  const formatBrandCurrency = (val, currency = 'USD') => {
    if (currency === 'INR') {
      if (Math.abs(val) >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
      if (Math.abs(val) >= 100000) return `₹${(val / 100000).toFixed(1)} L`;
      return `₹${Math.round(val).toLocaleString('en-IN')}`;
    }
    if (currency === 'GBP') {
      if (Math.abs(val) >= 1000000) return `£${(val / 1000000).toFixed(2)}M`;
      if (Math.abs(val) >= 10000) return `£${(val / 1000).toFixed(1)}k`;
      return `£${Math.round(val).toLocaleString()}`;
    }
    if (currency === 'AED') {
      return `AED ${Math.round(val).toLocaleString()}`;
    }
    return formatCurrency(val, 'USD');
  };

  // If a brand workspace is open, render BrandWorkspaceView directly
  if (activeWorkspaceBrandId) {
    return (
      <BrandWorkspaceView
        brandId={activeWorkspaceBrandId}
        onBack={() => setActiveWorkspaceBrandId(null)}
        onEdit={(brand) => {
          setEditingBrand(brand);
          setIsModalOpen(true);
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* 1. Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Brand Portfolio
            </h1>
            <Badge variant="electric" size="sm">
              Agency Client Workspace
            </Badge>
          </div>
          <p className="text-xs text-harpy-subtle mt-1 max-w-2xl leading-relaxed">
            Multi-brand client management for D2C Amazon businesses across India, US, UK, and UAE marketplaces.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => {
            setEditingBrand(null);
            setIsModalOpen(true);
          }}
        >
          Add New Client Brand
        </Button>
      </div>

      {/* 2. Filter, Search, and Sort Bar */}
      <Card className="p-4 bg-harpy-charcoal/80">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by client brand name, ASIN category, or code..."
              className="w-full bg-harpy-navy border border-harpy-cardBorder rounded-lg text-xs text-slate-100 placeholder-slate-500 pl-9 pr-4 py-2 focus:outline-none focus:border-electric focus:ring-1 focus:ring-electric transition-colors"
            />
          </div>

          {/* Marketplace Filter & Sort Selector */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Marketplace Filter */}
            <div className="flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-electric shrink-0" />
              <select
                value={selectedMarketplace}
                onChange={(e) => setSelectedMarketplace(e.target.value)}
                className="bg-harpy-navy border border-harpy-cardBorder rounded-lg text-xs text-slate-200 px-3 py-2 focus:outline-none focus:border-electric cursor-pointer"
              >
                {MARKETPLACE_OPTIONS.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.flag} {opt.label}
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
      </Card>

      {/* 3. Brand Cards Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <Skeleton className="h-80 rounded-2xl" />
          <Skeleton className="h-80 rounded-2xl" />
          <Skeleton className="h-80 rounded-2xl" />
        </div>
      ) : brands.length === 0 ? (
        <EmptyState
          title="No Matching Brands Found"
          description="Try adjusting your search criteria or marketplace filter to view active D2C client brands."
          actionLabel="Add New Brand"
          onAction={() => {
            setEditingBrand(null);
            setIsModalOpen(true);
          }}
          secondaryActionLabel="Clear Filters"
          onSecondaryAction={() => {
            setSearchQuery('');
            setSelectedMarketplace('All');
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {brands.map((brand) => {
            const cur = brand.currency || 'USD';
            return (
              <Card
                key={brand.id}
                hover
                className="flex flex-col justify-between group transition-all duration-300 relative overflow-hidden border-harpy-cardBorder hover:border-emerald/40"
              >
                <CardContent className="p-5 sm:p-6 space-y-4">
                  {/* Top Bar: Logo, Name, Marketplace, Status & Menu */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Brand Logo / Initials */}
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-800 via-harpy-charcoal to-slate-900 border border-slate-700/80 flex items-center justify-center font-extrabold text-white text-base shadow-inner shrink-0 group-hover:border-emerald/50 group-hover:shadow-emerald-glow transition-all">
                        {brand.code || brand.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-bold text-base text-white truncate group-hover:text-emerald transition-colors">
                          {brand.name}
                        </h3>
                        <div className="flex items-center gap-1.5 text-xs text-harpy-subtle mt-0.5">
                          <span>{brand.flag || '🌐'}</span>
                          <span className="truncate">{brand.marketplace}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      {/* Health Status */}
                      <Badge
                        variant={
                          brand.status === 'Optimal'
                            ? 'emerald'
                            : brand.status === 'High Growth'
                            ? 'electric'
                            : 'amber'
                        }
                        dot
                        size="xs"
                      >
                        {brand.status}
                      </Badge>
                    </div>
                  </div>

                  {/* Description / Category */}
                  <p className="text-xs text-harpy-subtle line-clamp-2 leading-relaxed">
                    {brand.description || `${brand.category} client portfolio with connected Amazon SP-API telemetry.`}
                  </p>

                  {/* Core Metrics 2x2 Grid */}
                  <div className="grid grid-cols-2 gap-2.5 p-3 rounded-xl bg-harpy-navy/70 border border-harpy-cardBorder/60">
                    <div>
                      <span className="text-[10px] text-harpy-subtle block uppercase tracking-wider font-semibold">
                        Total Revenue
                      </span>
                      <span className="text-sm sm:text-base font-bold text-white">
                        {formatBrandCurrency(brand.revenue, cur)}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-harpy-subtle block uppercase tracking-wider font-semibold">
                        Ad Spend
                      </span>
                      <span className="text-sm sm:text-base font-semibold text-slate-200">
                        {formatBrandCurrency(brand.adSpend, cur)}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-harpy-subtle block uppercase tracking-wider font-semibold">
                        ROAS / ACoS
                      </span>
                      <span className="text-xs sm:text-sm font-semibold text-emerald">
                        {brand.roas}x <span className="text-harpy-subtle font-normal">/ {brand.acos}%</span>
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-harpy-subtle block uppercase tracking-wider font-semibold">
                        Estimated Profit
                      </span>
                      <span className="text-xs sm:text-sm font-bold text-emerald">
                        {formatBrandCurrency(brand.estimatedProfit, cur)}
                      </span>
                    </div>
                  </div>

                  {/* Targets & Catalog Snapshot */}
                  <div className="flex items-center justify-between text-xs text-harpy-subtle pt-1 border-t border-harpy-cardBorder/40">
                    <span>
                      Target ACoS: <strong className="text-slate-200">{brand.targetAcos}%</strong>
                    </span>
                    <span>
                      Target TACoS: <strong className="text-emerald">{brand.targetTacos}%</strong>
                    </span>
                    <span>
                      Catalog: <strong className="text-slate-200">{brand.productCount} ASINs</strong>
                    </span>
                  </div>
                </CardContent>

                {/* Footer Actions: Open Workspace, Edit, Delete */}
                <div className="px-5 py-3.5 bg-harpy-charcoal/40 border-t border-harpy-cardBorder/60 flex items-center justify-between gap-2">
                  <Button
                    variant="primary"
                    size="xs"
                    className="flex-1"
                    rightIcon={<ExternalLink className="w-3.5 h-3.5" />}
                    onClick={() => {
                      setActiveWorkspaceBrandId(brand.id);
                      setSelectedBrand(brand);
                    }}
                  >
                    Open Workspace
                  </Button>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => {
                        setEditingBrand(brand);
                        setIsModalOpen(true);
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                      title="Edit Brand Settings"
                    >
                      <Edit className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => setDeletingBrand(brand)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 transition-colors cursor-pointer"
                      title="Delete Brand"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* 4. Modals */}
      <BrandModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingBrand(null);
        }}
        onSave={handleSaveBrand}
        brand={editingBrand}
      />

      <DeleteConfirmModal
        isOpen={Boolean(deletingBrand)}
        onClose={() => setDeletingBrand(null)}
        onConfirm={handleDeleteBrand}
        brand={deletingBrand}
        isDeleting={isDeleting}
      />
    </div>
  );
}

export default BrandsPortfolio;
