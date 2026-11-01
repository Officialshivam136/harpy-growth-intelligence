/**
 * Deterministic Multi-Brand Amazon Analytics Engine
 * Generates unified daily-granular telemetry for 3 realistic Amazon brands:
 * 1. Nordic Living Co. (Home & Kitchen)
 * 2. Apex Supplements (Health & Nutrition)
 * 3. AeroTech Audio (Consumer Electronics)
 *
 * Ensures all KPI cards, line charts, bar charts, area charts, donut charts,
 * and tables are 100% mathematically synchronized and reactive to Brand & Date filters.
 */

export const DEMO_BRANDS = [
  {
    id: 'all',
    name: 'All Brands',
    fullName: 'All Brands (Consolidated)',
    code: 'ALL',
    category: 'Consolidated Portfolio',
    badge: 'Portfolio',
    color: '#22C55E',
    marketplaces: ['IN', 'US', 'UK', 'UAE'],
    status: 'Optimal',
  },
  {
    id: 'village-company',
    name: 'Village Company',
    fullName: 'Village Company',
    code: 'VC',
    category: 'Gourmet & Organic Foods',
    badge: 'Artisanal & Spices',
    color: '#22C55E', // Emerald
    marketplaces: ['Amazon India'],
    status: 'Optimal',
  },
  {
    id: 'premium-wellness-co',
    name: 'Premium Wellness',
    fullName: 'Premium Wellness Co.',
    code: 'PW',
    category: 'Health & Supplements',
    badge: 'Nutrition & Wellness',
    color: '#38BDF8', // Electric Blue
    marketplaces: ['Amazon US'],
    status: 'High Growth',
  },
  {
    id: 'urban-living',
    name: 'Urban Living',
    fullName: 'Urban Living',
    code: 'UL',
    category: 'Home & Furniture',
    badge: 'Ergonomic Workspace',
    color: '#A855F7', // Purple
    marketplaces: ['Amazon UK', 'Amazon UAE'],
    status: 'Optimal',
  },
];

export const DATE_RANGES = [
  { id: '7d', label: 'Last 7 Days', days: 7 },
  { id: '30d', label: 'Last 30 Days', days: 30 },
  { id: '90d', label: 'Last 90 Days', days: 90 },
  { id: 'ytd', label: 'Year to Date (YTD)', days: 60 },
];

/**
 * Generate 90 days of deterministic daily records for each brand.
 */
function generateDailyHistory() {
  const daysCount = 90;
  const history = [];

  const today = new Date('2026-11-01T00:00:00Z');

  for (let i = daysCount - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);

    const monthStr = d.toLocaleDateString('en-US', { month: 'short' });
    const dayNum = d.getDate().toString().padStart(2, '0');
    const label = `${monthStr} ${dayNum}`;

    // Base cyclical seed (0 to 1) for natural weekday/weekend Amazon purchasing curve
    const dayOfWeek = d.getDay(); // 0 is Sunday, 6 is Saturday
    const weekendLift = dayOfWeek === 0 || dayOfWeek === 6 ? 1.18 : 1.0;
    const midWeekLift = dayOfWeek === 2 || dayOfWeek === 3 ? 1.08 : 1.0;
    const wave = Math.sin(i / 6) * 0.08 + 1.0;
    const growthTrend = 1.0 + (daysCount - i) * 0.002; // +18% growth over 90 days

    // Brand 1: Nordic Living Co. (High revenue, strong organic rank, low TACoS ~9.5%)
    const nlcBaseRev = 15800 * weekendLift * wave * growthTrend;
    const nlcAdSpend = 1420 * (1 + Math.cos(i / 5) * 0.1);
    const nlcAdSales = nlcAdSpend * (4.45 + Math.sin(i / 4) * 0.25); // ROAS ~4.45x
    const nlcRev = Math.round(nlcBaseRev);
    const nlcOrganicSales = Math.round(Math.max(0, nlcRev - nlcAdSales));
    const nlcOrders = Math.round(nlcRev / 58); // AOV ~$58
    const nlcNetProfit = Math.round(nlcRev * 0.284 - nlcAdSpend * 0.2); // ~26% net post-FBA

    // Brand 2: Apex Supplements (High unit volume, competitive ads, TACoS ~12.8%)
    const apxBaseRev = 10600 * midWeekLift * wave * growthTrend;
    const apxAdSpend = 1360 * (1 + Math.sin(i / 4) * 0.08);
    const apxAdSales = apxAdSpend * (4.02 + Math.cos(i / 3) * 0.2); // ROAS ~4.0x
    const apxRev = Math.round(apxBaseRev);
    const apxOrganicSales = Math.round(Math.max(0, apxRev - apxAdSales));
    const apxOrders = Math.round(apxRev / 34); // AOV ~$34
    const apxNetProfit = Math.round(apxRev * 0.242 - apxAdSpend * 0.15); // ~22% net

    // Brand 3: AeroTech Audio (High AOV, premium audio, TACoS ~11.2%)
    const ataBaseRev = 6800 * weekendLift * wave * growthTrend;
    const ataAdSpend = 760 * (1 + Math.cos(i / 7) * 0.12);
    const ataAdSales = ataAdSpend * (4.25 + Math.sin(i / 5) * 0.22); // ROAS ~4.25x
    const ataRev = Math.round(ataBaseRev);
    const ataOrganicSales = Math.round(Math.max(0, ataRev - ataAdSales));
    const ataOrders = Math.round(ataRev / 94); // AOV ~$94
    const ataNetProfit = Math.round(ataRev * 0.265 - ataAdSpend * 0.18); // ~24% net

    history.push({
      date: label,
      dayIndex: daysCount - 1 - i,
      timestamp: d.getTime(),
      byBrand: {
        'village-company': {
          revenue: nlcRev,
          adSpend: Math.round(nlcAdSpend),
          adSales: Math.round(nlcAdSales),
          organicSales: nlcOrganicSales,
          orders: nlcOrders,
          netProfit: nlcNetProfit,
        },
        'premium-wellness-co': {
          revenue: apxRev,
          adSpend: Math.round(apxAdSpend),
          adSales: Math.round(apxAdSales),
          organicSales: apxOrganicSales,
          orders: apxOrders,
          netProfit: apxNetProfit,
        },
        'urban-living': {
          revenue: ataRev,
          adSpend: Math.round(ataAdSpend),
          adSales: Math.round(ataAdSales),
          organicSales: ataOrganicSales,
          orders: ataOrders,
          netProfit: ataNetProfit,
        },
      },
    });
  }

  return history;
}

const GLOBAL_HISTORY = generateDailyHistory();

/**
 * Returns comprehensive dashboard analytics dynamically computed for the chosen brand & date range.
 * @param {string} brandId 'all' | 'village-company' | 'premium-wellness-co' | 'urban-living'
 * @param {string} dateRangeId '7d' | '30d' | '90d' | 'ytd'
 */
export function getDashboardAnalytics(brandId = 'all', dateRangeId = '30d') {
  const rangeConfig = DATE_RANGES.find((r) => r.id === dateRangeId) || DATE_RANGES[1];
  const numDays = rangeConfig.days;

  // Split history into current period and previous period of the exact same length
  const currentPeriodHistory = GLOBAL_HISTORY.slice(-numDays);
  const prevStartIndex = Math.max(0, GLOBAL_HISTORY.length - numDays * 2);
  const prevPeriodHistory = GLOBAL_HISTORY.slice(prevStartIndex, GLOBAL_HISTORY.length - numDays);

  const realBrandIds = ['village-company', 'premium-wellness-co', 'urban-living'];
  const targetBrandIds = brandId === 'all' ? realBrandIds : [brandId];

  // Helper to aggregate metrics across a slice of days
  const aggregateMetrics = (slice) => {
    let revenue = 0;
    let adSpend = 0;
    let adSales = 0;
    let organicSales = 0;
    let orders = 0;
    let netProfit = 0;

    slice.forEach((day) => {
      targetBrandIds.forEach((bId) => {
        const item = day.byBrand[bId];
        if (item) {
          revenue += item.revenue;
          adSpend += item.adSpend;
          adSales += item.adSales;
          organicSales += item.organicSales;
          orders += item.orders;
          netProfit += item.netProfit;
        }
      });
    });

    const tacos = revenue > 0 ? (adSpend / revenue) * 100 : 0;
    const acos = adSales > 0 ? (adSpend / adSales) * 100 : 0;
    const roas = adSpend > 0 ? adSales / adSpend : 0;

    return {
      revenue,
      adSpend,
      adSales,
      organicSales,
      orders,
      netProfit,
      tacos,
      acos,
      roas,
    };
  };

  const currentMetrics = aggregateMetrics(currentPeriodHistory);
  const prevMetrics = aggregateMetrics(prevPeriodHistory);

  // Helper to compute percentage change
  const calcChange = (curr, prev) => {
    if (!prev || prev === 0) return 0;
    return Number((((curr - prev) / prev) * 100).toFixed(1));
  };

  // Build the 6 required KPI cards
  const kpis = {
    totalRevenue: {
      id: 'total-revenue',
      title: 'Total Revenue',
      value: currentMetrics.revenue,
      type: 'currency',
      change: calcChange(currentMetrics.revenue, prevMetrics.revenue),
      changeType: currentMetrics.revenue >= prevMetrics.revenue ? 'positive' : 'negative',
      period: `vs prior ${numDays}d`,
      target: brandId === 'all' ? '$1,000,000' : '$400,000',
      tooltip: 'Gross Amazon Sales (GMV) across all active seller channels in the selected timeframe.',
      sparkline: currentPeriodHistory.map((day) => {
        return targetBrandIds.reduce((sum, bId) => sum + (day.byBrand[bId]?.revenue || 0), 0);
      }),
    },
    adSpend: {
      id: 'ad-spend',
      title: 'Advertising Spend',
      value: currentMetrics.adSpend,
      type: 'currency',
      change: calcChange(currentMetrics.adSpend, prevMetrics.adSpend),
      changeType: 'neutral', // Spend change is neutral
      period: `vs prior ${numDays}d`,
      target: '< $120,000',
      tooltip: 'Total Amazon PPC ad spend across Sponsored Products, Sponsored Brands, and Sponsored Display.',
      sparkline: currentPeriodHistory.map((day) => {
        return targetBrandIds.reduce((sum, bId) => sum + (day.byBrand[bId]?.adSpend || 0), 0);
      }),
    },
    totalOrders: {
      id: 'total-orders',
      title: 'Total Orders',
      value: currentMetrics.orders,
      type: 'units',
      suffix: ' orders',
      change: calcChange(currentMetrics.orders, prevMetrics.orders),
      changeType: currentMetrics.orders >= prevMetrics.orders ? 'positive' : 'negative',
      period: `vs prior ${numDays}d`,
      target: brandId === 'all' ? '> 20,000' : '> 8,000',
      tooltip: 'Total verified consumer orders shipped and invoiced through Amazon FBA.',
      sparkline: currentPeriodHistory.map((day) => {
        return targetBrandIds.reduce((sum, bId) => sum + (day.byBrand[bId]?.orders || 0), 0);
      }),
    },
    netProfit: {
      id: 'net-profit',
      title: 'Estimated Net Profit',
      value: currentMetrics.netProfit,
      type: 'currency',
      change: calcChange(currentMetrics.netProfit, prevMetrics.netProfit),
      changeType: currentMetrics.netProfit >= prevMetrics.netProfit ? 'positive' : 'negative',
      period: `vs prior ${numDays}d`,
      target: '25% Net Margin',
      tooltip: 'Estimated contribution profit after deducting Amazon FBA fees, commissions, and PPC ad spend.',
      sparkline: currentPeriodHistory.map((day) => {
        return targetBrandIds.reduce((sum, bId) => sum + (day.byBrand[bId]?.netProfit || 0), 0);
      }),
    },
    roas: {
      id: 'roas',
      title: 'ROAS',
      value: Number(currentMetrics.roas.toFixed(2)),
      type: 'number',
      suffix: 'x',
      change: calcChange(currentMetrics.roas, prevMetrics.roas),
      changeType: currentMetrics.roas >= prevMetrics.roas ? 'positive' : 'negative',
      period: `vs prior ${numDays}d`,
      target: '> 4.00x',
      tooltip: 'Return on Amazon Advertising Spend (Attributed Ad Sales / PPC Spend).',
      sparkline: currentPeriodHistory.map((day) => {
        let spend = 0;
        let sales = 0;
        targetBrandIds.forEach((bId) => {
          spend += day.byBrand[bId]?.adSpend || 0;
          sales += day.byBrand[bId]?.adSales || 0;
        });
        return spend > 0 ? Number((sales / spend).toFixed(2)) : 4.0;
      }),
    },
    tacos: {
      id: 'tacos',
      title: 'TACOS',
      value: Number(currentMetrics.tacos.toFixed(1)),
      type: 'percentage',
      suffix: '%',
      change: Number((currentMetrics.tacos - prevMetrics.tacos).toFixed(1)),
      changeType: currentMetrics.tacos <= prevMetrics.tacos ? 'positive' : 'negative', // Lower TACoS is better
      period: `vs target 12.0%`,
      target: '< 12.0%',
      tooltip: 'Total Advertising Cost of Sales (Total Ad Spend / Total Gross Revenue). A lower percentage indicates higher organic revenue health.',
      sparkline: currentPeriodHistory.map((day) => {
        let spend = 0;
        let rev = 0;
        targetBrandIds.forEach((bId) => {
          spend += day.byBrand[bId]?.adSpend || 0;
          rev += day.byBrand[bId]?.revenue || 0;
        });
        return rev > 0 ? Number(((spend / rev) * 100).toFixed(1)) : 11.5;
      }),
    },
  };

  // 1. Chart Data: Revenue versus Ad Spend (Line Chart)
  // Downsample to at most 18-20 clean points for visual clarity if 90d
  const step = numDays > 30 ? Math.ceil(numDays / 18) : 1;
  const revenueVsAdSpendChart = [];

  for (let i = 0; i < currentPeriodHistory.length; i += step) {
    const chunk = currentPeriodHistory.slice(i, i + step);
    let totalRev = 0;
    let totalSpend = 0;
    let totalAdSales = 0;

    chunk.forEach((day) => {
      targetBrandIds.forEach((bId) => {
        totalRev += day.byBrand[bId]?.revenue || 0;
        totalSpend += day.byBrand[bId]?.adSpend || 0;
        totalAdSales += day.byBrand[bId]?.adSales || 0;
      });
    });

    const label = chunk[0].date;
    const avgRoas = totalSpend > 0 ? Number((totalAdSales / totalSpend).toFixed(2)) : 0;
    const avgTacos = totalRev > 0 ? Number(((totalSpend / totalRev) * 100).toFixed(1)) : 0;

    revenueVsAdSpendChart.push({
      date: label,
      revenue: Math.round(totalRev / chunk.length),
      adSpend: Math.round(totalSpend / chunk.length),
      adSales: Math.round(totalAdSales / chunk.length),
      roas: avgRoas,
      tacos: avgTacos,
    });
  }

  // 2. Chart Data: Sales by Brand (Bar Chart)
  const salesByBrandChart = realBrandIds.map((bId) => {
    const brandInfo = DEMO_BRANDS.find((b) => b.id === bId);
    let rev = 0;
    let spend = 0;
    let profit = 0;

    currentPeriodHistory.forEach((day) => {
      const item = day.byBrand[bId];
      if (item) {
        rev += item.revenue;
        spend += item.adSpend;
        profit += item.netProfit;
      }
    });

    return {
      id: bId,
      name: brandInfo?.name || bId,
      code: brandInfo?.code || bId,
      revenue: rev,
      adSpend: spend,
      netProfit: profit,
      isSelected: brandId === 'all' || brandId === bId,
    };
  });

  // 3. Chart Data: Advertising Performance (Area Chart)
  // Shows Ad Spend, Ad Sales, and ROAS trend over time
  const advertisingPerformanceChart = revenueVsAdSpendChart.map((item) => ({
    date: item.date,
    adSpend: item.adSpend,
    adSales: item.adSales,
    roas: item.roas,
  }));

  // 4. Chart Data: Revenue Distribution (Donut Chart)
  let revenueDistributionChart = [];
  if (brandId === 'all') {
    // Breakdown across the 3 brands
    revenueDistributionChart = salesByBrandChart.map((b) => {
      const brandInfo = DEMO_BRANDS.find((brand) => brand.id === b.id);
      const percentage = currentMetrics.revenue > 0 ? ((b.revenue / currentMetrics.revenue) * 100).toFixed(1) : '0';
      return {
        name: b.name,
        code: b.code,
        value: b.revenue,
        percentage: Number(percentage),
        color: brandInfo?.color || '#38BDF8',
      };
    });
  } else {
    // Breakdown by marketplace channels for the specific brand
    const brandInfo = DEMO_BRANDS.find((b) => b.id === brandId);
    const marketplaceShares = [
      { name: 'Amazon US (.com)', code: 'US', share: 0.62, color: '#22C55E' },
      { name: 'Amazon CA (.ca)', code: 'CA', share: 0.18, color: '#38BDF8' },
      { name: 'Amazon UK (.co.uk)', code: 'UK', share: 0.12, color: '#A855F7' },
      { name: 'Amazon DE (.de)', code: 'DE', share: 0.08, color: '#F59E0B' },
    ];

    revenueDistributionChart = marketplaceShares.map((m) => {
      const val = Math.round(currentMetrics.revenue * m.share);
      return {
        name: m.name,
        code: m.code,
        value: val,
        percentage: Number((m.share * 100).toFixed(1)),
        color: m.color,
      };
    });
  }

  // 5. Table Data: Top Performing Brands
  const topPerformingBrandsTable = realBrandIds.map((bId) => {
    const brandInfo = DEMO_BRANDS.find((b) => b.id === bId);
    let rev = 0;
    let spend = 0;
    let adSales = 0;
    let profit = 0;
    let orders = 0;

    currentPeriodHistory.forEach((day) => {
      const item = day.byBrand[bId];
      if (item) {
        rev += item.revenue;
        spend += item.adSpend;
        adSales += item.adSales;
        profit += item.netProfit;
        orders += item.orders;
      }
    });

    const tacos = rev > 0 ? (spend / rev) * 100 : 0;
    const acos = adSales > 0 ? (spend / adSales) * 100 : 0;
    const roas = spend > 0 ? adSales / spend : 0;
    const margin = rev > 0 ? (profit / rev) * 100 : 0;

    return {
      id: bId,
      name: brandInfo?.fullName || bId,
      shortName: brandInfo?.name || bId,
      code: brandInfo?.code || bId,
      category: brandInfo?.category || 'General',
      marketplaces: brandInfo?.marketplaces || ['US'],
      revenue: rev,
      adSpend: spend,
      acos: Number(acos.toFixed(1)),
      tacos: Number(tacos.toFixed(1)),
      roas: Number(roas.toFixed(2)),
      estimatedProfit: profit,
      profitMargin: Number(margin.toFixed(1)),
      orders,
      status: brandInfo?.status || 'Optimal',
      isSelected: brandId === bId,
    };
  });

  // Sort brands by revenue descending
  topPerformingBrandsTable.sort((a, b) => b.revenue - a.revenue);

  // 6. Recent Activity Feed
  const recentActivities = [
    {
      id: 1,
      type: 'bid-rule',
      brand: 'Village Company',
      brandCode: 'VC',
      title: 'Automated PPC Bid Optimization',
      description: 'Lowered bids by 8% on 14 keywords with ACoS > 28%; raised bids on 5 exact-match hero organic spices.',
      time: '18m ago',
      badge: 'PPC Engine',
      badgeVariant: 'electric',
    },
    {
      id: 2,
      type: 'buy-box',
      brand: 'Urban Living',
      brandCode: 'UL',
      title: 'Buy Box Win Rate at 99.8%',
      description: 'Modular Bamboo Desk Organizer achieved 100% featured offer win rate in UK marketplace over last 48h.',
      time: '1h ago',
      badge: 'Buy Box Won',
      badgeVariant: 'emerald',
    },
    {
      id: 3,
      type: 'fba',
      brand: 'Premium Wellness Co.',
      brandCode: 'PW',
      title: 'FBA Inventory Received',
      description: 'Shipment FBA17K9Z (1,800 units Hydrolyzed Whey) checked-in at ONT8 fulfillment center.',
      time: '3h ago',
      badge: 'FBA Check-In',
      badgeVariant: 'slate',
    },
    {
      id: 4,
      type: 'tacos-target',
      brand: 'Village Company',
      brandCode: 'VC',
      title: 'TACoS Target Achieved (11.0%)',
      description: 'Total advertising cost of sales decreased below the 12.0% target for 14 consecutive days on Amazon India.',
      time: '5h ago',
      badge: 'Goal Met',
      badgeVariant: 'emerald',
    },
  ];

  // 7. Performance Alerts
  const performanceAlerts = [
    {
      id: 'alert-1',
      type: 'success',
      title: 'ROAS Acceleration (+8.5%)',
      description: `${brandId === 'all' ? 'Blended agency portfolio' : brandInfoName(brandId)} ROAS increased to ${currentMetrics.roas.toFixed(2)}x, outperforming the 4.00x quarterly benchmark.`,
      actionText: 'View PPC Campaigns',
      link: '/advertising',
    },
    {
      id: 'alert-2',
      type: 'warning',
      title: 'Low FBA Stock Warning (16 Days Supply)',
      description: 'Urban Living Bamboo Ergonomic Stand run-rate has outpaced restock lead time. Action recommended to avoid BSR loss.',
      actionText: 'Restock Model',
      link: '/inventory',
    },
    {
      id: 'alert-3',
      type: 'info',
      title: 'SP-API Settlement Reconciliation',
      description: 'Automated settlement ingestion synced disbursements across India, US, UK, and UAE with zero reconciliation discrepancy.',
      actionText: 'Review Settlement',
      link: '/analytics',
    },
  ];

  return {
    selectedBrandId: brandId,
    selectedDateRangeId: dateRangeId,
    periodDays: numDays,
    kpis,
    currentMetrics,
    prevMetrics,
    charts: {
      revenueVsAdSpend: revenueVsAdSpendChart,
      salesByBrand: salesByBrandChart,
      advertisingPerformance: advertisingPerformanceChart,
      revenueDistribution: revenueDistributionChart,
    },
    topPerformingBrandsTable,
    recentActivities,
    performanceAlerts,
  };
}

function brandInfoName(id) {
  const found = DEMO_BRANDS.find((b) => b.id === id);
  return found ? found.name : 'Brand';
}

export default getDashboardAnalytics;

