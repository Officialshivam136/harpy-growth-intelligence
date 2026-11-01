import React, { useState, useEffect } from 'react';
import { X, Building2, Globe, DollarSign, Percent, Package, Sparkles } from 'lucide-react';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { cn } from '../../utils/cn';

const MARKETPLACES = [
  { id: 'Amazon India', label: 'Amazon India (amazon.in)', flag: '🇮🇳', currency: 'INR' },
  { id: 'Amazon US', label: 'Amazon US (amazon.com)', flag: '🇺🇸', currency: 'USD' },
  { id: 'Amazon UK', label: 'Amazon UK (amazon.co.uk)', flag: '🇬🇧', currency: 'GBP' },
  { id: 'Amazon UAE', label: 'Amazon UAE (amazon.ae)', flag: '🇦🇪', currency: 'AED' },
];

const CURRENCIES = [
  { code: 'INR', label: 'INR (₹) - Indian Rupee' },
  { code: 'USD', label: 'USD ($) - US Dollar' },
  { code: 'GBP', label: 'GBP (£) - British Pound' },
  { code: 'AED', label: 'AED (د.إ) - UAE Dirham' },
];

const CATEGORIES = [
  'Gourmet & Organic Foods',
  'Health & Supplements',
  'Home & Furniture',
  'Consumer Electronics',
  'Beauty & Personal Care',
  'Apparel & Accessories',
  'Baby & Toddler',
  'Sports & Fitness',
];

export function BrandModal({ isOpen, onClose, onSave, brand = null }) {
  const isEditing = Boolean(brand);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    marketplace: 'Amazon India',
    currency: 'INR',
    category: 'Gourmet & Organic Foods',
    targetAcos: 22,
    targetTacos: 12,
    productCount: 12,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (brand) {
      setFormData({
        name: brand.name || '',
        description: brand.description || '',
        marketplace: brand.marketplace || 'Amazon India',
        currency: brand.currency || 'INR',
        category: brand.category || 'Gourmet & Organic Foods',
        targetAcos: brand.targetAcos || 22,
        targetTacos: brand.targetTacos || 12,
        productCount: brand.productCount || 12,
      });
    } else {
      setFormData({
        name: '',
        description: '',
        marketplace: 'Amazon India',
        currency: 'INR',
        category: 'Gourmet & Organic Foods',
        targetAcos: 22,
        targetTacos: 12,
        productCount: 12,
      });
    }
    setErrors({});
  }, [brand, isOpen]);

  if (!isOpen) return null;

  // Auto-set default currency when marketplace changes if user hasn't modified it
  const handleMarketplaceChange = (mkt) => {
    const selectedMkt = MARKETPLACES.find((m) => m.id === mkt);
    setFormData((prev) => ({
      ...prev,
      marketplace: mkt,
      currency: selectedMkt?.currency || prev.currency,
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Brand name is required';
    if (!formData.marketplace) newErrors.marketplace = 'Marketplace is required';
    if (formData.targetAcos <= 0 || formData.targetAcos > 100) {
      newErrors.targetAcos = 'Target ACoS must be between 1% and 100%';
    }
    if (formData.targetTacos <= 0 || formData.targetTacos > 100) {
      newErrors.targetTacos = 'Target TACoS must be between 1% and 100%';
    }
    if (formData.productCount < 1) {
      newErrors.productCount = 'Must have at least 1 product';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await onSave(formData);
      onClose();
    } catch (err) {
      setErrors({ form: err.message || 'Failed to save brand' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-xl bg-harpy-charcoal border border-harpy-cardBorder rounded-2xl shadow-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-harpy-cardBorder/70 bg-harpy-navy/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald/15 border border-emerald/30 flex items-center justify-center text-emerald">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {isEditing ? `Edit Brand: ${brand.name}` : 'Connect New Client Brand'}
              </h3>
              <p className="text-xs text-harpy-subtle">
                {isEditing
                  ? 'Update Amazon catalog targets, category, and marketplace parameters'
                  : 'Add a new D2C client brand portfolio to Harpy Growth Intelligence'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {errors.form && (
            <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-800/50 text-rose-300 text-xs">
              {errors.form}
            </div>
          )}

          {/* 1. Brand Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-200 mb-1.5">
              Brand Name <span className="text-rose-400">*</span>
            </label>
            <Input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Village Company"
              error={errors.name}
            />
            {errors.name && <p className="text-xs text-rose-400 mt-1">{errors.name}</p>}
          </div>

          {/* 2. Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-200 mb-1.5">
              Brand Description
            </label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief overview of product line, D2C mission, and target Amazon positioning..."
              className="w-full bg-harpy-navy/90 border border-harpy-cardBorder rounded-lg text-xs text-slate-100 placeholder-slate-500 px-3.5 py-2.5 focus:outline-none focus:border-electric focus:ring-1 focus:ring-electric transition-colors"
            />
          </div>

          {/* 3. Marketplace & Currency */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1.5">
                Marketplace <span className="text-rose-400">*</span>
              </label>
              <select
                value={formData.marketplace}
                onChange={(e) => handleMarketplaceChange(e.target.value)}
                className="w-full bg-harpy-navy border border-harpy-cardBorder rounded-lg text-xs text-slate-100 px-3 py-2.5 focus:outline-none focus:border-electric"
              >
                {MARKETPLACES.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.flag} {m.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1.5">
                Currency <span className="text-rose-400">*</span>
              </label>
              <select
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                className="w-full bg-harpy-navy border border-harpy-cardBorder rounded-lg text-xs text-slate-100 px-3 py-2.5 focus:outline-none focus:border-electric"
              >
                {CURRENCIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 4. Brand Category & Product Count */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1.5">
                Brand Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-harpy-navy border border-harpy-cardBorder rounded-lg text-xs text-slate-100 px-3 py-2.5 focus:outline-none focus:border-electric"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1.5">
                Catalog Product Count (ASINs)
              </label>
              <Input
                type="number"
                min="1"
                value={formData.productCount}
                onChange={(e) => setFormData({ ...formData, productCount: e.target.value })}
                placeholder="e.g. 24"
                error={errors.productCount}
              />
            </div>
          </div>

          {/* 5. Target ACOS & Target TACOS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-harpy-navy/60 border border-harpy-cardBorder/60">
            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1">
                Target ACoS (%)
              </label>
              <span className="text-[10px] text-harpy-subtle block mb-1.5">
                PPC Ad Spend / Attributed Ad Sales
              </span>
              <Input
                type="number"
                step="0.5"
                min="1"
                max="100"
                value={formData.targetAcos}
                onChange={(e) => setFormData({ ...formData, targetAcos: e.target.value })}
                placeholder="e.g. 22"
                error={errors.targetAcos}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1">
                Target TACoS (%)
              </label>
              <span className="text-[10px] text-harpy-subtle block mb-1.5">
                PPC Ad Spend / Total Gross Sales
              </span>
              <Input
                type="number"
                step="0.5"
                min="1"
                max="100"
                value={formData.targetTacos}
                onChange={(e) => setFormData({ ...formData, targetTacos: e.target.value })}
                placeholder="e.g. 12"
                error={errors.targetTacos}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-harpy-cardBorder/60">
            <Button variant="outline" size="sm" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={isSubmitting}
            >
              {isEditing ? 'Save Changes' : 'Create Brand Workspace'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default BrandModal;

