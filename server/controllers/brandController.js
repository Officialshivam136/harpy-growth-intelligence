import Brand from '../models/Brand.js';

// Default initial sample brands as required:
// 1. Village Company
// 2. Premium Wellness Co.
// 3. Urban Living
export const initialSampleBrands = [
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

// In-memory cache when MongoDB is offline
let memoryBrands = [...initialSampleBrands];

// Seed MongoDB if empty
async function ensureDbSeeded() {
  try {
    const count = await Brand.countDocuments();
    if (count === 0) {
      await Brand.insertMany(initialSampleBrands);
      console.log('[Harpy Brand API] Seeded default 3 sample brands into MongoDB');
    }
  } catch (err) {
    // MongoDB might not be connected; fallback to memory
  }
}
ensureDbSeeded();

/**
 * GET /api/brands
 */
export const getBrands = async (req, res) => {
  try {
    const { search, marketplace, sortBy } = req.query;
    const agencyId = req.agencyId || 'agency_harpy_media_01';

    let brands = [];
    try {
      brands = await Brand.find({ agencyId }).lean();
      if (!brands || brands.length === 0) {
        brands = [...memoryBrands];
      }
    } catch {
      brands = [...memoryBrands];
    }

    // Map _id to id if coming from mongo
    brands = brands.map((b) => ({
      ...b,
      id: b.brandId || b.id || b._id.toString(),
    }));

    // Filter by search
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

    // Filter by marketplace
    if (marketplace && marketplace !== 'All') {
      brands = brands.filter(
        (b) =>
          b.marketplace?.toLowerCase() === marketplace.toLowerCase() ||
          b.marketplaces?.some((m) => m.toLowerCase().includes(marketplace.toLowerCase()))
      );
    }

    // Sort by revenue or profitability
    if (sortBy === 'revenue-desc') {
      brands.sort((a, b) => b.revenue - a.revenue);
    } else if (sortBy === 'revenue-asc') {
      brands.sort((a, b) => a.revenue - b.revenue);
    } else if (sortBy === 'profit-desc') {
      brands.sort((a, b) => b.estimatedProfit - a.estimatedProfit);
    } else if (sortBy === 'roas-desc') {
      brands.sort((a, b) => b.roas - a.roas);
    } else {
      brands.sort((a, b) => b.revenue - a.revenue);
    }

    res.json({ success: true, count: brands.length, data: brands });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message, data: memoryBrands });
  }
};

/**
 * GET /api/brands/:id
 */
export const getBrandById = async (req, res) => {
  try {
    const { id } = req.params;
    const agencyId = req.agencyId || 'agency_harpy_media_01';
    let brand = null;
    try {
      brand = await Brand.findOne({ agencyId, brandId: id }).lean();
    } catch {
      // fallback
    }

    if (!brand) {
      brand = memoryBrands.find((b) => b.id === id || b.brandId === id);
    }

    if (!brand) {
      return res.status(404).json({ success: false, message: 'Brand not found' });
    }

    res.json({ success: true, data: brand });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * POST /api/brands
 */
export const createBrand = async (req, res) => {
  try {
    const {
      name,
      description,
      marketplace,
      currency,
      category,
      targetAcos,
      targetTacos,
      productCount,
    } = req.body;

    if (!name || !marketplace) {
      return res.status(400).json({ success: false, message: 'Brand name and marketplace are required' });
    }

    const brandId = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const code = name
      .split(' ')
      .map((w) => w[0])
      .join('')
      .toUpperCase()
      .slice(0, 3) || 'NEW';

    // Set flag based on marketplace
    let flag = '🌐';
    if (marketplace.includes('India')) flag = '🇮🇳';
    else if (marketplace.includes('US')) flag = '🇺🇸';
    else if (marketplace.includes('UK')) flag = '🇬🇧';
    else if (marketplace.includes('UAE')) flag = '🇦🇪';

    // Baseline realistic initial metrics
    const baseRevenue = currency === 'INR' ? 2400000 : 185000;
    const baseAdSpend = currency === 'INR' ? 280000 : 22500;
    const roas = 4.2;
    const acos = Number(targetAcos || 24);
    const tacos = Number(targetTacos || 12);
    const estimatedProfit = Math.round(baseRevenue * 0.24);

    const newBrandData = {
      agencyId: req.agencyId || 'agency_harpy_media_01',
      id: brandId,
      brandId,
      name,
      code,
      description: description || '',
      marketplace: marketplace || 'Amazon US',
      marketplaces: [marketplace || 'Amazon US'],
      flag,
      currency: currency || (marketplace.includes('India') ? 'INR' : 'USD'),
      category: category || 'D2C Consumer',
      targetAcos: Number(targetAcos) || 22,
      targetTacos: Number(targetTacos) || 12,
      productCount: Number(productCount) || 10,
      revenue: baseRevenue,
      adSpend: baseAdSpend,
      roas,
      acos,
      tacos,
      estimatedProfit,
      profitMargin: 24.0,
      healthScore: 92,
      status: 'Optimal',
    };

    try {
      const created = await Brand.create(newBrandData);
      memoryBrands.unshift({ ...newBrandData, _id: created._id });
    } catch {
      memoryBrands.unshift(newBrandData);
    }

    res.status(201).json({ success: true, message: 'Brand created successfully', data: newBrandData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * PUT /api/brands/:id
 */
export const updateBrand = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const agencyId = req.agencyId || 'agency_harpy_media_01';

    let updatedBrand = null;
    try {
      updatedBrand = await Brand.findOneAndUpdate({ agencyId, brandId: id }, updates, { new: true }).lean();
    } catch {
      // fallback
    }

    // Also update in memory
    const index = memoryBrands.findIndex((b) => b.id === id || b.brandId === id);
    if (index !== -1) {
      memoryBrands[index] = { ...memoryBrands[index], ...updates };
      if (!updatedBrand) updatedBrand = memoryBrands[index];
    }

    if (!updatedBrand) {
      return res.status(404).json({ success: false, message: 'Brand not found' });
    }

    res.json({ success: true, message: 'Brand updated successfully', data: updatedBrand });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * DELETE /api/brands/:id
 */
export const deleteBrand = async (req, res) => {
  try {
    const { id } = req.params;
    const agencyId = req.agencyId || 'agency_harpy_media_01';

    try {
      await Brand.findOneAndDelete({ agencyId, brandId: id });
    } catch {
      // fallback
    }

    memoryBrands = memoryBrands.filter((b) => b.id !== id && b.brandId !== id);

    res.json({ success: true, message: `Brand ${id} deleted successfully` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * GET /api/brands/:id/workspace
 * Deep dive analytics for the individual brand workspace:
 * - Brand-specific overview
 * - Revenue trends
 * - Product performance
 * - Campaign performance
 * - Alerts
 * - Reports
 */
export const getBrandWorkspace = async (req, res) => {
  try {
    const { id } = req.params;
    let brand = memoryBrands.find((b) => b.id === id || b.brandId === id);

    if (!brand) {
      try {
        brand = await Brand.findOne({ brandId: id }).lean();
      } catch {}
    }

    if (!brand) {
      brand = initialSampleBrands[0];
    }

    const cur = brand.currency || 'USD';
    const mult = cur === 'INR' ? 10 : 1;

    // 1. Revenue Trends (30-day timeline)
    const revenueTrends = [
      { date: 'Oct 01', grossSales: 9400 * mult, organicSales: 6800 * mult, adSales: 2600 * mult, adSpend: 620 * mult, tacos: 6.6 },
      { date: 'Oct 05', grossSales: 10800 * mult, organicSales: 7800 * mult, adSales: 3000 * mult, adSpend: 710 * mult, tacos: 6.5 },
      { date: 'Oct 09', grossSales: 11400 * mult, organicSales: 8100 * mult, adSales: 3300 * mult, adSpend: 780 * mult, tacos: 6.8 },
      { date: 'Oct 13', grossSales: 13200 * mult, organicSales: 9400 * mult, adSales: 3800 * mult, adSpend: 890 * mult, tacos: 6.7 },
      { date: 'Oct 17', grossSales: 12800 * mult, organicSales: 9100 * mult, adSales: 3700 * mult, adSpend: 860 * mult, tacos: 6.7 },
      { date: 'Oct 21', grossSales: 14500 * mult, organicSales: 10200 * mult, adSales: 4300 * mult, adSpend: 980 * mult, tacos: 6.7 },
      { date: 'Oct 25', grossSales: 15800 * mult, organicSales: 11200 * mult, adSales: 4600 * mult, adSpend: 1050 * mult, tacos: 6.6 },
      { date: 'Oct 29', grossSales: 16900 * mult, organicSales: 12000 * mult, adSales: 4900 * mult, adSpend: 1120 * mult, tacos: 6.6 },
    ];

    // 2. Product Performance
    const products = [
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
    ];

    // 3. Campaign Performance
    const campaigns = [
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
    ];

    // 4. Alerts
    const alerts = [
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
    ];

    // 5. Reports
    const reports = [
      {
        id: 'rep-1',
        title: 'Monthly SP-API Settlement & Net Contribution',
        period: 'Last Month',
        format: 'PDF / CSV',
        disbursement: formatCurrencyLocal(brand.revenue * 0.72, cur),
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
    ];

    res.json({
      success: true,
      data: {
        brand,
        revenueTrends,
        products,
        campaigns,
        alerts,
        reports,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

function formatCurrencyLocal(val, currency = 'USD') {
  if (currency === 'INR') return `₹${Math.round(val).toLocaleString()}`;
  if (currency === 'GBP') return `£${Math.round(val).toLocaleString()}`;
  if (currency === 'AED') return `AED ${Math.round(val).toLocaleString()}`;
  return `$${Math.round(val).toLocaleString()}`;
}

