import apiClient from './api.js';

export const DEFAULT_PRODUCTS = [
  // 1. Village Company (Amazon India) - Flagship High Margin Hero
  {
    asin: 'B09X7K21L8',
    sku: 'VC-MUSTARD-5L',
    title: 'Village Company Organic Cold-Pressed Mustard Oil (5 Litre Food-Grade Tin)',
    brandId: 'village-company',
    brandName: 'Village Company',
    brandCode: 'VC',
    currency: 'INR',
    sellingPrice: 1499,
    unitCogs: 520,
    unitsSold: 2400,
    adSpend: 360000,
    adSales: 1798800,
    marketplaceFeeRate: 0.12, // 12% Amazon India Grocery referral fee
    unitFulfillmentCost: 145, // FBA Heavy weight handling
    isCostIncomplete: false,
    missingExpenseFields: [],
    bsr: 185,
    category: 'Grocery & Gourmet Foods',
    buyBoxWinRate: 99.4,
    fbaStockDays: 42,
    recommendations: [
      {
        id: 'rec-1',
        type: 'scale',
        title: 'Scale Sponsored Brands Video Budget',
        description: 'ACoS is healthy at 20.0% with strong 5.0x ROAS. Increase daily cap by ₹2,500 to capture festive demand.',
        impact: '+₹3.2L Projected Monthly Sales',
      },
      {
        id: 'rec-2',
        type: 'inventory',
        title: 'Send FBA Inbound Shipment to BLR8 Hub',
        description: 'Current run-rate of 80 units/day gives 42 days supply. Trigger 1,500 unit pallet order before Diwali rush.',
        impact: 'Prevents BSR drop & stockout penalties',
      },
    ],
  },

  // 2. Village Company - Heritage Turmeric (Optimal Healthy Product)
  {
    asin: 'B09Y8M32N9',
    sku: 'VC-TURMERIC-1KG',
    title: 'Heritage Single-Origin Curcumin-Rich Lakadong Turmeric Powder (1 kg Glass Jar)',
    brandId: 'village-company',
    brandName: 'Village Company',
    brandCode: 'VC',
    currency: 'INR',
    sellingPrice: 799,
    unitCogs: 240,
    unitsSold: 3100,
    adSpend: 248000,
    adSales: 1115400,
    marketplaceFeeRate: 0.12,
    unitFulfillmentCost: 85,
    isCostIncomplete: false,
    missingExpenseFields: [],
    bsr: 320,
    category: 'Spices & Masalas',
    buyBoxWinRate: 99.8,
    fbaStockDays: 35,
    recommendations: [
      {
        id: 'rec-3',
        type: 'pricing',
        title: 'A/B Test 5% Price Increase',
        description: 'Strong organic ranking (#3 in Organic Turmeric) allows testing ₹839 without lowering conversion velocity.',
        impact: '+₹1.24L Pure Contribution Margin',
      },
    ],
  },

  // 3. Premium Wellness Co. (Amazon US) - Hero Whey Isolate (High Profitability)
  {
    asin: 'B08F2M9Q21',
    sku: 'PW-WHEY-CHOC-2LB',
    title: 'Premium Wellness Grass-Fed Hydrolyzed Whey Isolate (Dutch Chocolate, 2.2 lbs)',
    brandId: 'premium-wellness-co',
    brandName: 'Premium Wellness Co.',
    brandCode: 'PW',
    currency: 'USD',
    sellingPrice: 54.99,
    unitCogs: 18.20,
    unitsSold: 3200,
    adSpend: 28400,
    adSales: 122880,
    marketplaceFeeRate: 0.15, // 15% Health & Household referral
    unitFulfillmentCost: 6.80, // FBA Large standard tier
    isCostIncomplete: false,
    missingExpenseFields: [],
    bsr: 210,
    category: 'Sports Nutrition',
    buyBoxWinRate: 98.9,
    fbaStockDays: 38,
    recommendations: [
      {
        id: 'rec-4',
        type: 'packaging',
        title: 'Packaging Weight Reduction Audit',
        description: 'Switching from rigid tub to stand-up gusseted pouch reduces dimensional weight by 4.2 oz, dropping FBA fee by $0.75/unit.',
        impact: '+$2,400 Monthly FBA Fee Savings',
      },
      {
        id: 'rec-5',
        type: 'ads',
        title: 'Harvest High-Converting Search Terms',
        description: 'Add "clean grass fed isolate zero bloat" as Exact match keyword; currently generating 5.4x ROAS on broad discovery.',
        impact: 'Lowers Blended ACoS by 1.8%',
      },
    ],
  },

  // 4. Premium Wellness Co. - HIGH REVENUE, LOW PROFIT Product (Bleeding on Broad Ads & FBA Tier)
  {
    asin: 'B08K91PQ44',
    sku: 'PW-BAR-BULK-24',
    title: 'Premium Wellness Clean Protein Meal Replacement Bars (Multi-Variety 24-Pack)',
    brandId: 'premium-wellness-co',
    brandName: 'Premium Wellness Co.',
    brandCode: 'PW',
    currency: 'USD',
    sellingPrice: 34.99,
    unitCogs: 18.50, // High ingredient & manufacturing cost
    unitsSold: 4200, // Very high unit volume & revenue ($146,958)
    adSpend: 24800, // Heavy ad spend
    adSales: 64800, // Low ad return (ACoS 38.3%)
    marketplaceFeeRate: 0.15,
    unitFulfillmentCost: 7.20, // Bulky box dimensional tier
    isCostIncomplete: false,
    missingExpenseFields: [],
    bsr: 440,
    category: 'Nutrition Bars',
    buyBoxWinRate: 97.4,
    fbaStockDays: 24,
    recommendations: [
      {
        id: 'rec-6',
        type: 'alert',
        title: 'Critical: Redesign Packaging to Escape Oversize FBA Tier',
        description: 'Carton height is 0.4 inches into Tier 3 FBA bracket costing $7.20/unit instead of $5.40. Trimming carton saves $1.80/unit immediately.',
        impact: '+$7,560 Net Profit Expansion',
      },
      {
        id: 'rec-7',
        type: 'ads',
        title: 'Negative Keyword Audit on Generic Broad Match',
        description: 'Pause 18 non-converting search terms ("cheap candy bar", "bulk snacks") consuming $6,200 ad spend with zero sales.',
        impact: 'Eliminates $6.2k Bleeding Ad Spend',
      },
    ],
  },

  // 5. Urban Living (Amazon UK) - Solid Bamboo Stand (Flagship Hero)
  {
    asin: 'B08M9KL99P',
    sku: 'UL-BAMBOO-STAND',
    title: 'Urban Living Minimalist Solid Natural Bamboo Dual Monitor Stand with Wireless Pad',
    brandId: 'urban-living',
    brandName: 'Urban Living',
    brandCode: 'UL',
    currency: 'GBP',
    sellingPrice: 69.99,
    unitCogs: 21.50,
    unitsSold: 1850,
    adSpend: 15400,
    adSales: 71200,
    marketplaceFeeRate: 0.15,
    unitFulfillmentCost: 7.80,
    isCostIncomplete: false,
    missingExpenseFields: [],
    bsr: 195,
    category: 'Office Products',
    buyBoxWinRate: 99.6,
    fbaStockDays: 45,
    recommendations: [
      {
        id: 'rec-8',
        type: 'bundle',
        title: 'Launch Virtual Bundle with Bamboo Organizer',
        description: 'Attach SKU UL-DESK-TRAY as an Amazon Virtual Bundle with 10% bundle discount to increase Average Order Value.',
        impact: '+£8.40 AOV Lift per Customer',
      },
    ],
  },

  // 6. Urban Living - INCOMPLETE COST DATA Product (New Launch with Pending Supplier Invoices)
  {
    asin: 'B09L7X88K1',
    sku: 'UL-CABLE-SPINE-NEW',
    title: 'Urban Living Heavy-Duty Under-Desk Cable Management Spine (New 2026 Model)',
    brandId: 'urban-living',
    brandName: 'Urban Living',
    brandCode: 'UL',
    currency: 'GBP',
    sellingPrice: 29.99,
    unitCogs: null, // PENDING SUPPLIER COGS DATA
    unitsSold: 850,
    adSpend: 3400,
    adSales: 14200,
    marketplaceFeeRate: 0.15,
    unitFulfillmentCost: 4.20,
    isCostIncomplete: true,
    missingExpenseFields: ['Product Cost (COGS)'],
    bsr: 780,
    category: 'Home Improvement',
    buyBoxWinRate: 98.1,
    fbaStockDays: 28,
    recommendations: [
      {
        id: 'rec-9',
        type: 'warning',
        title: 'Cost Accounting Action Required: Enter Unit COGS',
        description: 'Supplier landed freight invoice has not been entered. Profit margins and contribution profit cannot be accurately verified.',
        impact: 'Accurate contribution margin reconciliation',
      },
    ],
  },

  // 7. Urban Living - LOW-PERFORMING / BLEEDING PRODUCT (Negative Net Margin)
  {
    asin: 'B07M9KL44P',
    sku: 'UL-CLAMP-LAMP-V1',
    title: 'Urban Living Minimalist Ambient Clamp Desk Lamp (Version 1 Legacy Model)',
    brandId: 'urban-living',
    brandName: 'Urban Living',
    brandCode: 'UL',
    currency: 'GBP',
    sellingPrice: 24.99,
    unitCogs: 13.80,
    unitsSold: 390,
    adSpend: 4200, // Heavy ad spend for small unit sales
    adSales: 7800, // ACoS 53.8%!
    marketplaceFeeRate: 0.15,
    unitFulfillmentCost: 5.60,
    isCostIncomplete: false,
    missingExpenseFields: [],
    bsr: 2150,
    category: 'Lighting',
    buyBoxWinRate: 91.2,
    fbaStockDays: 12,
    recommendations: [
      {
        id: 'rec-10',
        type: 'liquidate',
        title: 'Liquidate or Phase Out Legacy SKU',
        description: 'Unit economics are negative (-£6.85 net contribution per unit) due to excessive broad PPC spend and high returns.',
        impact: 'Plugs £2,670 annual cash bleed',
      },
    ],
  },
];

/**
 * Computes exact financial metrics for a product following the accounting guidelines:
 * - Gross Profit = Revenue - Product Cost (COGS)
 * - Estimated Contribution Profit = Revenue - (Product Cost + Marketplace Fees + Fulfilment Cost + Ad Spend)
 * - If expense data is missing, clearly flags incomplete cost data.
 */
export function computeProductMetrics(p) {
  const totalRevenue = Number((p.sellingPrice * p.unitsSold).toFixed(2));
  const hasCogs = p.unitCogs !== null && p.unitCogs !== undefined;
  const productCost = hasCogs ? Number((p.unitCogs * p.unitsSold).toFixed(2)) : 0;

  // Marketplace Fees (Amazon referral fee)
  const marketplaceFees = Number((totalRevenue * (p.marketplaceFeeRate || 0.15)).toFixed(2));

  // Fulfilment Cost (FBA fee per unit * units)
  const fulfilmentCost = Number(((p.unitFulfillmentCost || 0) * p.unitsSold).toFixed(2));

  // Direct PPC Ad Spend
  const adSpend = p.adSpend || 0;

  // Gross Profit (Revenue - COGS)
  const grossProfit = hasCogs ? Number((totalRevenue - productCost).toFixed(2)) : 0;
  const grossMargin = hasCogs && totalRevenue > 0 ? Number(((grossProfit / totalRevenue) * 100).toFixed(1)) : 0;

  // Estimated Contribution Profit (Revenue - (COGS + Referral + FBA + PPC Ad Spend))
  const totalAllCosts = Number((productCost + marketplaceFees + fulfilmentCost + adSpend).toFixed(2));
  const estimatedProfit = hasCogs ? Number((totalRevenue - totalAllCosts).toFixed(2)) : 0;
  const profitMargin = hasCogs && totalRevenue > 0 ? Number(((estimatedProfit / totalRevenue) * 100).toFixed(1)) : 0;

  // ACOS (%) = (adSpend / adSales) * 100
  const acos = p.adSales > 0 ? Number(((adSpend / p.adSales) * 100).toFixed(1)) : 0;

  // Unit Economics Breakdown
  const unitSellingPrice = p.sellingPrice;
  const unitMarketplaceFee = Number((unitSellingPrice * (p.marketplaceFeeRate || 0.15)).toFixed(2));
  const unitFulfilmentCost = p.unitFulfillmentCost || 0;
  const unitAdSpend = p.unitsSold > 0 ? Number((adSpend / p.unitsSold).toFixed(2)) : 0;
  const unitAllCosts = Number(((p.unitCogs || 0) + unitMarketplaceFee + unitFulfilmentCost + unitAdSpend).toFixed(2));
  const unitNetContribution = hasCogs ? Number((unitSellingPrice - unitAllCosts).toFixed(2)) : 0;

  // Classification for quick analytics filtering
  let performanceClass = 'Healthy';
  if (p.isCostIncomplete || !hasCogs) {
    performanceClass = 'Incomplete Cost Data';
  } else if (estimatedProfit < 0) {
    performanceClass = 'Low Performing';
  } else if (totalRevenue >= 100000 && profitMargin < 10) {
    performanceClass = 'High Revenue Low Profit';
  } else if (profitMargin >= 25 && acos <= 22) {
    performanceClass = 'Star Performer';
  }

  // Generate historical trends for product detail page
  const revenueTrend = [
    { period: 'Week 1', revenue: Math.round(totalRevenue * 0.20), adSpend: Math.round(adSpend * 0.21), profit: Math.round(estimatedProfit * 0.19) },
    { period: 'Week 2', revenue: Math.round(totalRevenue * 0.23), adSpend: Math.round(adSpend * 0.24), profit: Math.round(estimatedProfit * 0.22) },
    { period: 'Week 3', revenue: Math.round(totalRevenue * 0.27), adSpend: Math.round(adSpend * 0.26), profit: Math.round(estimatedProfit * 0.28) },
    { period: 'Week 4', revenue: Math.round(totalRevenue * 0.30), adSpend: Math.round(adSpend * 0.29), profit: Math.round(estimatedProfit * 0.31) },
  ];

  const salesHistory = [
    { period: 'Current Month', units: Math.round(p.unitsSold * 0.45), revenue: Math.round(totalRevenue * 0.45), profit: Math.round(estimatedProfit * 0.45), margin: profitMargin },
    { period: 'Prior Month', units: Math.round(p.unitsSold * 0.35), revenue: Math.round(totalRevenue * 0.35), profit: Math.round(estimatedProfit * 0.34), margin: profitMargin - 0.8 },
    { period: '2 Months Ago', units: Math.round(p.unitsSold * 0.20), revenue: Math.round(totalRevenue * 0.20), profit: Math.round(estimatedProfit * 0.21), margin: profitMargin + 0.5 },
  ];

  return {
    ...p,
    totalRevenue,
    productCost,
    marketplaceFees,
    fulfilmentCost,
    adSpend,
    totalAllCosts,
    grossProfit,
    grossMargin,
    estimatedProfit,
    profitMargin,
    acos,
    performanceClass,
    unitEconomics: {
      sellingPrice: unitSellingPrice,
      cogs: p.unitCogs,
      marketplaceFee: unitMarketplaceFee,
      fulfillmentFee: unitFulfilmentCost,
      adSpendPerUnit: unitAdSpend,
      netContributionPerUnit: unitNetContribution,
    },
    revenueTrend,
    salesHistory,
  };
}

export const productService = {
  /**
   * Get products with search, brand filtering, and sorting
   */
  async getProducts({
    search = '',
    brandId = 'All',
    sortBy = 'profit-desc',
    performanceFilter = 'All',
  } = {}) {
    let list = DEFAULT_PRODUCTS.map(computeProductMetrics);

    // Filter by Brand
    if (brandId && brandId !== 'All') {
      list = list.filter((p) => p.brandId === brandId);
    }

    // Filter by Performance Class
    if (performanceFilter && performanceFilter !== 'All') {
      if (performanceFilter === 'High Revenue Low Profit') {
        list = list.filter((p) => p.performanceClass === 'High Revenue Low Profit');
      } else if (performanceFilter === 'Low Performing') {
        list = list.filter((p) => p.performanceClass === 'Low Performing');
      } else if (performanceFilter === 'Star Performer') {
        list = list.filter((p) => p.performanceClass === 'Star Performer');
      } else if (performanceFilter === 'Incomplete Cost Data') {
        list = list.filter((p) => p.isCostIncomplete);
      }
    }

    // Search filter
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.asin.toLowerCase().includes(q) ||
          p.brandName.toLowerCase().includes(q)
      );
    }

    // Sorting
    list.sort((a, b) => {
      switch (sortBy) {
        case 'profit-desc':
          return b.estimatedProfit - a.estimatedProfit;
        case 'profit-asc':
          return a.estimatedProfit - b.estimatedProfit;
        case 'revenue-desc':
          return b.totalRevenue - a.totalRevenue;
        case 'revenue-asc':
          return a.totalRevenue - b.totalRevenue;
        case 'margin-desc':
          return b.profitMargin - a.profitMargin;
        case 'units-desc':
          return b.unitsSold - a.unitsSold;
        case 'acos-desc':
          return b.acos - a.acos;
        case 'acos-asc':
          return a.acos - b.acos;
        default:
          return b.estimatedProfit - a.estimatedProfit;
      }
    });

    return list;
  },

  /**
   * Get product details by ASIN
   */
  async getProductByAsin(asin) {
    const list = DEFAULT_PRODUCTS.map(computeProductMetrics);
    return list.find((p) => p.asin === asin) || list[0];
  },

  /**
   * Summary overview stats for product catalog
   */
  async getCatalogSummary(brandId = 'All') {
    let list = DEFAULT_PRODUCTS.map(computeProductMetrics);
    if (brandId && brandId !== 'All') {
      list = list.filter((p) => p.brandId === brandId);
    }

    const totalRevenue = list.reduce((sum, p) => sum + p.totalRevenue, 0);
    const totalProfit = list.reduce((sum, p) => sum + (p.isCostIncomplete ? 0 : p.estimatedProfit), 0);
    const totalUnits = list.reduce((sum, p) => sum + p.unitsSold, 0);
    const totalAdSpend = list.reduce((sum, p) => sum + p.adSpend, 0);
    const totalCogs = list.reduce((sum, p) => sum + p.productCost, 0);
    const totalFees = list.reduce((sum, p) => sum + p.marketplaceFees + p.fulfilmentCost, 0);

    const highRevLowProfitCount = list.filter((p) => p.performanceClass === 'High Revenue Low Profit').length;
    const lowPerformingCount = list.filter((p) => p.performanceClass === 'Low Performing').length;
    const incompleteCostCount = list.filter((p) => p.isCostIncomplete).length;

    const blendedMargin = totalRevenue > 0 ? Number(((totalProfit / totalRevenue) * 100).toFixed(1)) : 0;

    return {
      totalRevenue,
      totalProfit,
      totalUnits,
      totalAdSpend,
      totalCogs,
      totalFees,
      blendedMargin,
      highRevLowProfitCount,
      lowPerformingCount,
      incompleteCostCount,
      catalogCount: list.length,
    };
  },
};

export default productService;

