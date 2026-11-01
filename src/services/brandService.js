import apiClient from './api.js';

// Three sample brands as required by the client agency spec:
// 1. Village Company (Amazon India)
// 2. Premium Wellness Co. (Amazon US)
// 3. Urban Living (Amazon UK & UAE)
export const DEFAULT_SAMPLE_BRANDS = [
  {
    id: 'village-company',
    brandId: 'village-company',
    name: 'Village Company',
    code: 'VC',
    description: 'Ethical farm-to-table organic food essentials, heritage cold-pressed oils, and spices.',
    marketplace: 'Amazon India',
    marketplaces: ['Amazon India'],
    flag: '🇮🇳',
    currency: 'INR',
    category: 'Gourmet & Organic Foods',
    targetAcos: 22.0,
    targetTacos: 12.0,
    productCount: 32,
    revenue: 3840000,
    adSpend: 422000,
    roas: 4.85,
    acos: 20.6,
    tacos: 11.0,
    estimatedProfit: 960000,
    profitMargin: 25.0,
    healthScore: 96,
    status: 'Optimal',
  },
  {
    id: 'premium-wellness-co',
    brandId: 'premium-wellness-co',
    name: 'Premium Wellness Co.',
    code: 'PW',
    description: 'Clinically-studied daily adaptogens, clean electrolyte hydration, and whey isolate proteins.',
    marketplace: 'Amazon US',
    marketplaces: ['Amazon US'],
    flag: '🇺🇸',
    currency: 'USD',
    category: 'Health & Supplements',
    targetAcos: 25.0,
    targetTacos: 13.0,
    productCount: 18,
    revenue: 386500,
    adSpend: 48200,
    roas: 4.12,
    acos: 24.3,
    tacos: 12.5,
    estimatedProfit: 88900,
    profitMargin: 23.0,
    healthScore: 92,
    status: 'High Growth',
  },
  {
    id: 'urban-living',
    brandId: 'urban-living',
    name: 'Urban Living',
    code: 'UL',
    description: 'Modern ergonomic home workspace desks, smart ambient lighting, and modular bamboo organizers.',
    marketplace: 'Amazon UK',
    marketplaces: ['Amazon UK', 'Amazon UAE'],
    flag: '🇬🇧',
    currency: 'GBP',
    category: 'Home & Furniture',
    targetAcos: 24.0,
    targetTacos: 12.5,
    productCount: 24,
    revenue: 245000,
    adSpend: 28900,
    roas: 4.35,
    acos: 23.0,
    tacos: 11.8,
    estimatedProfit: 63700,
    profitMargin: 26.0,
    healthScore: 94,
    status: 'Optimal',
  },
];

const STORAGE_KEY = 'harpy_agency_brands_v2';

function getLocalBrands() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_SAMPLE_BRANDS));
      return [...DEFAULT_SAMPLE_BRANDS];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : [...DEFAULT_SAMPLE_BRANDS];
  } catch {
    return [...DEFAULT_SAMPLE_BRANDS];
  }
}

function saveLocalBrands(brands) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(brands));
  } catch (err) {
    console.error('Failed to save to localStorage:', err);
  }
}

export const brandService = {
  /**
   * Fetch all brands with search, marketplace filter, and sorting
   */
  async getBrands({ search = '', marketplace = 'All', sortBy = 'revenue-desc' } = {}) {
    try {
      const res = await apiClient.get('/brands', {
        params: { search, marketplace, sortBy },
      });
      if (res && res.data) {
        saveLocalBrands(res.data);
        return res.data;
      }
    } catch (e) {
      // Backend offline: use resilient local storage with demo data
    }

    let brands = getLocalBrands();

    if (search) {
      const q = search.toLowerCase();
      brands = brands.filter(
        (b) =>
          b.name.toLowerCase().includes(q) ||
          b.category?.toLowerCase().includes(q) ||
          b.code?.toLowerCase().includes(q) ||
          b.description?.toLowerCase().includes(q)
      );
    }

    if (marketplace && marketplace !== 'All') {
      brands = brands.filter(
        (b) =>
          b.marketplace?.toLowerCase() === marketplace.toLowerCase() ||
          b.marketplaces?.some((m) => m.toLowerCase().includes(marketplace.toLowerCase()))
      );
    }

    if (sortBy === 'revenue-desc') {
      brands.sort((a, b) => b.revenue - a.revenue);
    } else if (sortBy === 'revenue-asc') {
      brands.sort((a, b) => a.revenue - b.revenue);
    } else if (sortBy === 'profit-desc') {
      brands.sort((a, b) => b.estimatedProfit - a.estimatedProfit);
    } else if (sortBy === 'roas-desc') {
      brands.sort((a, b) => b.roas - a.roas);
    }

    return brands;
  },

  /**
   * Get brand by ID
   */
  async getBrandById(id) {
    try {
      const res = await apiClient.get(`/brands/${id}`);
      if (res && res.data) return res.data;
    } catch {}

    const brands = getLocalBrands();
    return brands.find((b) => b.id === id || b.brandId === id) || brands[0];
  },

  /**
   * Create brand
   */
  async createBrand(brandData) {
    let flag = '🌐';
    if (brandData.marketplace.includes('India')) flag = '🇮🇳';
    else if (brandData.marketplace.includes('US')) flag = '🇺🇸';
    else if (brandData.marketplace.includes('UK')) flag = '🇬🇧';
    else if (brandData.marketplace.includes('UAE')) flag = '🇦🇪';

    const brandId =
      brandData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') ||
      `brand-${Date.now()}`;
    const code =
      brandData.name
        .split(' ')
        .map((w) => w[0])
        .join('')
        .toUpperCase()
        .slice(0, 3) || 'NEW';

    const cur = brandData.currency || (brandData.marketplace.includes('India') ? 'INR' : 'USD');
    const baseRev = cur === 'INR' ? 2800000 : 210000;
    const baseSpend = cur === 'INR' ? 320000 : 26000;

    const payload = {
      id: brandId,
      brandId,
      name: brandData.name,
      code,
      description: brandData.description || '',
      marketplace: brandData.marketplace || 'Amazon US',
      marketplaces: [brandData.marketplace || 'Amazon US'],
      flag,
      currency: cur,
      category: brandData.category || 'Consumer D2C',
      targetAcos: Number(brandData.targetAcos) || 22,
      targetTacos: Number(brandData.targetTacos) || 12,
      productCount: Number(brandData.productCount) || 12,
      revenue: baseRev,
      adSpend: baseSpend,
      roas: 4.25,
      acos: Number(brandData.targetAcos) || 22,
      tacos: Number(brandData.targetTacos) || 12,
      estimatedProfit: Math.round(baseRev * 0.25),
      profitMargin: 25.0,
      healthScore: 94,
      status: 'Optimal',
    };

    try {
      const res = await apiClient.post('/brands', payload);
      if (res && res.data) {
        const brands = getLocalBrands();
        brands.unshift(res.data);
        saveLocalBrands(brands);
        return res.data;
      }
    } catch {}

    const brands = getLocalBrands();
    brands.unshift(payload);
    saveLocalBrands(brands);
    return payload;
  },

  /**
   * Update brand
   */
  async updateBrand(id, updates) {
    try {
      const res = await apiClient.put(`/brands/${id}`, updates);
      if (res && res.data) {
        const brands = getLocalBrands();
        const idx = brands.findIndex((b) => b.id === id || b.brandId === id);
        if (idx !== -1) {
          brands[idx] = { ...brands[idx], ...res.data };
          saveLocalBrands(brands);
        }
        return res.data;
      }
    } catch {}

    const brands = getLocalBrands();
    const idx = brands.findIndex((b) => b.id === id || b.brandId === id);
    if (idx !== -1) {
      brands[idx] = { ...brands[idx], ...updates };
      saveLocalBrands(brands);
      return brands[idx];
    }
    return updates;
  },

  /**
   * Delete brand
   */
  async deleteBrand(id) {
    try {
      await apiClient.delete(`/brands/${id}`);
    } catch {}

    const brands = getLocalBrands();
    const filtered = brands.filter((b) => b.id !== id && b.brandId !== id);
    saveLocalBrands(filtered);
    return true;
  },

  /**
   * Get brand workspace telemetry
   */
  async getBrandWorkspace(id) {
    try {
      const res = await apiClient.get(`/brands/${id}/workspace`);
      if (res && res.data) return res.data;
    } catch {}

    const brand = await this.getBrandById(id);
    const cur = brand.currency || 'USD';
    const mult = cur === 'INR' ? 10 : 1;

    return {
      brand,
      revenueTrends: [
        { date: 'Oct 01', grossSales: 9400 * mult, organicSales: 6800 * mult, adSales: 2600 * mult, adSpend: 620 * mult, tacos: 6.6 },
        { date: 'Oct 05', grossSales: 10800 * mult, organicSales: 7800 * mult, adSales: 3000 * mult, adSpend: 710 * mult, tacos: 6.5 },
        { date: 'Oct 09', grossSales: 11400 * mult, organicSales: 8100 * mult, adSales: 3300 * mult, adSpend: 780 * mult, tacos: 6.8 },
        { date: 'Oct 13', grossSales: 13200 * mult, organicSales: 9400 * mult, adSales: 3800 * mult, adSpend: 890 * mult, tacos: 6.7 },
        { date: 'Oct 17', grossSales: 12800 * mult, organicSales: 9100 * mult, adSales: 3700 * mult, adSpend: 860 * mult, tacos: 6.7 },
        { date: 'Oct 21', grossSales: 14500 * mult, organicSales: 10200 * mult, adSales: 4300 * mult, adSpend: 980 * mult, tacos: 6.7 },
        { date: 'Oct 25', grossSales: 15800 * mult, organicSales: 11200 * mult, adSales: 4600 * mult, adSpend: 1050 * mult, tacos: 6.6 },
        { date: 'Oct 29', grossSales: 16900 * mult, organicSales: 12000 * mult, adSales: 4900 * mult, adSpend: 1120 * mult, tacos: 6.6 },
      ],
      products: [
        {
          asin: 'B09X7K21L8',
          sku: `${brand.code}-HERO-01`,
          title: `${brand.name} Signature Flagship Best-Seller`,
          price: cur === 'INR' ? 1499 : 49.99,
          unitsSold: 1840,
          revenue: 92000 * mult,
          buyBox: 99.4,
          bsr: 340,
          stockDays: 45,
          status: 'In Stock',
        },
        {
          asin: 'B08F2M9Q21',
          sku: `${brand.code}-PACK-02`,
          title: `${brand.name} Value Pack / Multi-Tier Bundle`,
          price: cur === 'INR' ? 2499 : 79.99,
          unitsSold: 1220,
          revenue: 61000 * mult,
          buyBox: 98.8,
          bsr: 580,
          stockDays: 32,
          status: 'In Stock',
        },
        {
          asin: 'B08K91PQ44',
          sku: `${brand.code}-COMP-03`,
          title: `${brand.name} Premium Line Edition (Black)`,
          price: cur === 'INR' ? 3999 : 129.99,
          unitsSold: 640,
          revenue: 51200 * mult,
          buyBox: 97.2,
          bsr: 890,
          stockDays: 16,
          status: 'Low Stock',
        },
      ],
      campaigns: [
        {
          id: 'c1',
          name: `SP - Exact Match - Hero Keywords (${brand.name})`,
          type: 'Sponsored Products',
          spend: 18400 * mult,
          sales: 82800 * mult,
          acos: 22.2,
          roas: 4.5,
          impressions: 480200,
          clicks: 18200,
          ctr: 3.79,
          status: 'Active',
        },
        {
          id: 'c2',
          name: `SB - Brand Defense & Category Conquesting`,
          type: 'Sponsored Brands',
          spend: 7800 * mult,
          sales: 32760 * mult,
          acos: 23.8,
          roas: 4.2,
          impressions: 310500,
          clicks: 8400,
          ctr: 2.71,
          status: 'Active',
        },
        {
          id: 'c3',
          name: `SD - Product Retargeting & Competitor ASINs`,
          type: 'Sponsored Display',
          spend: 4200 * mult,
          sales: 15540 * mult,
          acos: 27.0,
          roas: 3.7,
          impressions: 195000,
          clicks: 4100,
          ctr: 2.1,
          status: 'Optimizing',
        },
      ],
      alerts: [
        {
          id: 'al-1',
          type: 'success',
          title: 'Target TACoS Maintained',
          description: `${brand.name} has maintained ${brand.tacos}% TACoS (Target: ${brand.targetTacos}%) for 14 straight days.`,
          date: 'Today, 09:30 AM',
        },
        {
          id: 'al-2',
          type: 'warning',
          title: 'FBA Inventory Reorder Trigger',
          description: `ASIN B08K91PQ44 has 16 days of supply remaining. Initiate FBA inbound transfer to prevent BSR loss.`,
          date: 'Yesterday, 04:15 PM',
        },
        {
          id: 'al-3',
          type: 'info',
          title: 'Amazon Advertising Bid Adjuster Active',
          description: 'Auto-lowered CPC on 12 non-converting broad search terms saving ~8.4% daily budget.',
          date: 'Oct 28, 11:20 AM',
        },
      ],
      reports: [
        {
          id: 'rep-1',
          title: 'Monthly SP-API Settlement & Net Contribution',
          period: 'Last Month',
          format: 'PDF / CSV',
          disbursement: cur === 'INR' ? `₹${(brand.revenue * 0.72).toLocaleString()}` : `$${(brand.revenue * 0.72).toLocaleString()}`,
        },
        {
          id: 'rep-2',
          title: 'Advertising Performance & Search Term Audit',
          period: 'Last 30 Days',
          format: 'XLSX',
          disbursement: `${brand.roas}x Blended RoAS`,
        },
        {
          id: 'rep-3',
          title: 'FBA Fee Structure & Dimensional Weight Audit',
          period: 'Q3 Financials',
          format: 'CSV',
          disbursement: 'Verified Discrepancy: $0',
        },
      ],
    };
  },
};

export default brandService;

