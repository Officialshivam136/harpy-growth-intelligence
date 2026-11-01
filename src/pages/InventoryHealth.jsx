import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Package,
  AlertTriangle,
  Truck,
  Clock,
  ShieldCheck,
  ArrowRight,
  ExternalLink,
  Boxes,
  CheckCircle2,
} from 'lucide-react';
import { useBrand } from '../context/BrandContext';
import { DEFAULT_PRODUCTS } from '../services/productService';
import { Card, CardHeader, CardTitle, CardContent } from '../components/common/Card';
import { KpiCard } from '../components/common/KpiCard';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';

export function InventoryHealth() {
  const navigate = useNavigate();
  const { selectedBrand } = useBrand();

  // Filter products by selected brand
  const products = useMemo(() => {
    if (!selectedBrand || selectedBrand.id === 'all') {
      return DEFAULT_PRODUCTS;
    }
    return DEFAULT_PRODUCTS.filter((p) => p.brandId === selectedBrand.id);
  }, [selectedBrand]);

  // Aggregate metrics
  const totalAvailable = useMemo(() => {
    return products.reduce((acc, p) => acc + (p.unitsSold * 1.4), 0);
  }, [products]);

  const avgDaysSupply = useMemo(() => {
    if (products.length === 0) return 45;
    const sum = products.reduce((acc, p) => acc + (p.fbaStockDays || 40), 0);
    return Math.round(sum / products.length);
  }, [products]);

  // Identify lowest stock SKU for action alert
  const lowestStockProduct = useMemo(() => {
    if (products.length === 0) return null;
    return [...products].sort((a, b) => (a.fbaStockDays || 99) - (b.fbaStockDays || 99))[0];
  }, [products]);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <Boxes className="w-6 h-6 text-emerald" />
              <span>FBA Inventory & Restock Velocity</span>
            </h1>
            <Badge variant="emerald" size="xs" dot>
              Live SP-API Sync
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-harpy-subtle mt-1">
            Automated restock velocity models, Amazon FBA storage limits, and stockout prevention runway.
          </p>
        </div>

        <Badge variant="slate" size="sm">
          Active View: {selectedBrand?.name || 'All Brands'}
        </Badge>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="FBA Available Units"
          value={Math.round(totalAvailable)}
          type="units"
          period="ready to ship"
        />
        <KpiCard
          title="Avg. Days of Supply"
          value={avgDaysSupply}
          type="number"
          suffix=" days"
          period="healthy buffer (35-60)"
        />
        <KpiCard
          title="Inbound In-Transit"
          value={Math.round(totalAvailable * 0.28)}
          type="units"
          period="expected in 4 days"
        />
        <KpiCard
          title="Low Buffer SKUs"
          value={products.filter((p) => (p.fbaStockDays || 40) < 25).length}
          type="number"
          suffix=" SKUs"
          changeType={products.filter((p) => (p.fbaStockDays || 40) < 25).length > 0 ? 'negative' : 'positive'}
          period="reorder priority"
          status={products.filter((p) => (p.fbaStockDays || 40) < 25).length > 0 ? 'warning' : 'optimal'}
        />
      </div>

      {/* Stockout Risk Action Banner */}
      {lowestStockProduct && (
        <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-600/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-lg bg-amber-900/40 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h4 className="text-sm font-semibold text-amber-200 truncate">
                Restock Alert: {lowestStockProduct.sku} ({lowestStockProduct.asin})
              </h4>
              <p className="text-xs text-amber-300/80 mt-0.5">
                Current velocity ({Math.round(lowestStockProduct.unitsSold / 30)} units/day) indicates{' '}
                <strong>{lowestStockProduct.fbaStockDays} days remaining</strong>. Trigger FBA inbound shipment to prevent BSR rank drop.
              </p>
            </div>
          </div>
          <Button
            variant="primary"
            size="sm"
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 shrink-0 gap-1.5"
            onClick={() => navigate(`/analytics/${lowestStockProduct.asin}`)}
          >
            <span>Inspect Unit Velocity</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </div>
      )}

      {/* ASIN Inventory Run-rate Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 text-emerald" />
            <CardTitle>Catalog Inventory Run-Rates & Supply Days</CardTitle>
          </div>
          <Badge variant="slate" size="xs">
            Auto-Updated via SP-API Inventory Summaries
          </Badge>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-harpy-cardBorder bg-harpy-charcoal/50 text-harpy-subtle uppercase text-[10px] tracking-wider font-semibold">
                  <th className="py-3 px-4">ASIN & SKU</th>
                  <th className="py-3 px-4">Brand</th>
                  <th className="py-3 px-4">Daily Velocity</th>
                  <th className="py-3 px-4">Days Remaining</th>
                  <th className="py-3 px-4">FBA Stock Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-harpy-cardBorder/40">
                {products.map((item) => {
                  const dailyRunRate = Math.max(1, Math.round(item.unitsSold / 30));
                  const daysRemaining = item.fbaStockDays || 35;
                  const isLow = daysRemaining < 25;

                  return (
                    <tr key={item.asin} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3.5 px-4">
                        <div>
                          <span className="font-semibold text-slate-100 block max-w-sm truncate">
                            {item.title}
                          </span>
                          <div className="text-[11px] text-harpy-muted font-mono flex items-center gap-2 mt-0.5">
                            <span className="text-electric">{item.asin}</span>
                            <span>•</span>
                            <span className="text-slate-300 font-semibold">{item.sku}</span>
                            <span>•</span>
                            <span>BSR #{item.bsr}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-300 font-medium">
                        <Badge variant="slate" size="xs">
                          {item.brandName || item.brandId}
                        </Badge>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-200">
                        {dailyRunRate} units/day
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`font-bold font-mono ${
                            daysRemaining > 30
                              ? 'text-emerald'
                              : daysRemaining > 20
                              ? 'text-sky-400'
                              : 'text-rose-400'
                          }`}
                        >
                          {daysRemaining} days
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <Badge
                          variant={daysRemaining > 30 ? 'emerald' : isLow ? 'rose' : 'amber'}
                          dot
                          size="xs"
                        >
                          {daysRemaining > 30 ? 'Healthy Buffer' : isLow ? 'Reorder Urgent' : 'Low Buffer'}
                        </Badge>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Button
                          variant="outline"
                          size="xs"
                          onClick={() => navigate(`/analytics/${item.asin}`)}
                          className="gap-1 text-slate-300 hover:text-white"
                        >
                          <span>Unit Analytics</span>
                          <ExternalLink className="w-3 h-3" />
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
    </div>
  );
}

export default InventoryHealth;
