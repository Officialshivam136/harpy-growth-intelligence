import apiClient from './api.js';

/**
 * Realistic Amazon Advertising Dataset for Agency Client Brands:
 * 1. Village Company (VC)
 * 2. Premium Wellness Co. (PW)
 * 3. Urban Living (UL)
 */
export const DEFAULT_CAMPAIGNS = [
  // Village Company (Amazon India)
  {
    id: 'vc-sp-exact-01',
    name: 'SP - Exact Match - Organic Cold Pressed Oils',
    brandId: 'village-company',
    brandName: 'Village Company',
    brandCode: 'VC',
    type: 'Sponsored Products',
    targeting: 'Manual - Exact',
    impressions: 482000,
    clicks: 16800,
    spend: 184800,
    adSales: 960960,
    orders: 1280,
    dailyBudget: 8000,
    budgetPacing: 88,
    status: 'Active',
    currency: 'INR',
    topKeywords: [
      { keyword: 'organic cold pressed mustard oil', matchType: 'EXACT', spend: 42000, sales: 231000, acos: 18.2, roas: 5.5, bid: 11.5 },
      { keyword: 'wood pressed coconut oil organic', matchType: 'EXACT', spend: 38000, sales: 205200, acos: 18.5, roas: 5.4, bid: 12.0 },
      { keyword: 'pure virgin sesame oil for cooking', matchType: 'EXACT', spend: 28000, sales: 134400, acos: 20.8, roas: 4.8, bid: 9.8 },
    ],
    placementShare: { topOfSearch: 62, restOfSearch: 26, productPages: 12 },
  },
  {
    id: 'vc-sb-video-02',
    name: 'SB - Video - Farm to Kitchen Heritage Story',
    brandId: 'village-company',
    brandName: 'Village Company',
    brandCode: 'VC',
    type: 'Sponsored Brands',
    targeting: 'Video Ad',
    impressions: 620000,
    clicks: 18600,
    spend: 139500,
    adSales: 655650,
    orders: 780,
    dailyBudget: 6000,
    budgetPacing: 78,
    status: 'Active',
    currency: 'INR',
    topKeywords: [
      { keyword: 'stone ground turmeric powder', matchType: 'PHRASE', spend: 32000, sales: 163200, acos: 19.6, roas: 5.1, bid: 8.5 },
      { keyword: 'artisanal spices online', matchType: 'PHRASE', spend: 26000, sales: 119600, acos: 21.7, roas: 4.6, bid: 7.8 },
    ],
    placementShare: { topOfSearch: 74, restOfSearch: 20, productPages: 6 },
  },
  {
    id: 'vc-sp-broad-03',
    name: 'SP - Broad Discovery - Organic Grocery Essentials',
    brandId: 'village-company',
    brandName: 'Village Company',
    brandCode: 'VC',
    type: 'Sponsored Products',
    targeting: 'Manual - Broad',
    impressions: 310000,
    clicks: 7200,
    spend: 97700,
    adSales: 273560,
    orders: 310,
    dailyBudget: 4500,
    budgetPacing: 98,
    status: 'Optimizing',
    currency: 'INR',
    topKeywords: [
      { keyword: 'healthy cooking oil', matchType: 'BROAD', spend: 38000, sales: 95000, acos: 40.0, roas: 2.5, bid: 14.0 },
      { keyword: 'organic food products', matchType: 'BROAD', spend: 29000, sales: 81200, acos: 35.7, roas: 2.8, bid: 13.2 },
    ],
    placementShare: { topOfSearch: 42, restOfSearch: 38, productPages: 20 },
  },

  // Premium Wellness Co. (Amazon US)
  {
    id: 'pw-sp-exact-01',
    name: 'SP - Exact Match - Hydrolyzed Whey Isolate Chocolate',
    brandId: 'premium-wellness-co',
    brandName: 'Premium Wellness Co.',
    brandCode: 'PW',
    type: 'Sponsored Products',
    targeting: 'Manual - Exact',
    impressions: 384000,
    clicks: 14200,
    spend: 18460,
    adSales: 88608,
    orders: 1420,
    dailyBudget: 750,
    budgetPacing: 94,
    status: 'Active',
    currency: 'USD',
    topKeywords: [
      { keyword: 'grass fed whey protein isolate chocolate', matchType: 'EXACT', spend: 6800, sales: 34680, acos: 19.6, roas: 5.1, bid: 1.45 },
      { keyword: 'hydrolyzed whey isolate zero sugar', matchType: 'EXACT', spend: 5200, sales: 25480, acos: 20.4, roas: 4.9, bid: 1.35 },
      { keyword: 'clean protein powder post workout', matchType: 'EXACT', spend: 3400, sales: 15300, acos: 22.2, roas: 4.5, bid: 1.20 },
    ],
    placementShare: { topOfSearch: 68, restOfSearch: 22, productPages: 10 },
  },
  {
    id: 'pw-sb-store-02',
    name: 'SB - Store Spotlight - Clean Adaptogens & Electrolytes',
    brandId: 'premium-wellness-co',
    brandName: 'Premium Wellness Co.',
    brandCode: 'PW',
    type: 'Sponsored Brands',
    targeting: 'Store Spotlight',
    impressions: 290000,
    clicks: 8700,
    spend: 12180,
    adSales: 49938,
    orders: 790,
    dailyBudget: 500,
    budgetPacing: 84,
    status: 'Active',
    currency: 'USD',
    topKeywords: [
      { keyword: 'daily adaptogen ashwagandha gummies', matchType: 'PHRASE', spend: 4200, sales: 18060, acos: 23.3, roas: 4.3, bid: 1.40 },
      { keyword: 'sugar free hydration electrolyte powder', matchType: 'PHRASE', spend: 3800, sales: 15580, acos: 24.4, roas: 4.1, bid: 1.30 },
    ],
    placementShare: { topOfSearch: 58, restOfSearch: 32, productPages: 10 },
  },
  {
    id: 'pw-sd-retarget-03',
    name: 'SD - Product Retargeting - Past 30D Cart Abandoners',
    brandId: 'premium-wellness-co',
    brandName: 'Premium Wellness Co.',
    brandCode: 'PW',
    type: 'Sponsored Display',
    targeting: 'Audience Retargeting',
    impressions: 195000,
    clicks: 4100,
    spend: 7380,
    adSales: 28044,
    orders: 410,
    dailyBudget: 350,
    budgetPacing: 86,
    status: 'Active',
    currency: 'USD',
    topKeywords: [
      { keyword: 'Viewed PW Products (No Purchase 14d)', matchType: 'AUDIENCE', spend: 4100, sales: 16400, acos: 25.0, roas: 4.0, bid: 1.85 },
      { keyword: 'Competitor Protein Powder Product Pages', matchType: 'CONTEXTUAL', spend: 3280, sales: 11644, acos: 28.2, roas: 3.55, bid: 1.75 },
    ],
    placementShare: { topOfSearch: 10, restOfSearch: 20, productPages: 70 },
  },
  {
    id: 'pw-sp-auto-bleed-04',
    name: 'SP - Auto Catch-All - Loose Match Exploration',
    brandId: 'premium-wellness-co',
    brandName: 'Premium Wellness Co.',
    brandCode: 'PW',
    type: 'Sponsored Products',
    targeting: 'Auto - Loose Match',
    impressions: 142000,
    clicks: 2900,
    spend: 6090,
    adSales: 13398,
    orders: 180,
    dailyBudget: 250,
    budgetPacing: 100,
    status: 'Out of Budget',
    currency: 'USD',
    topKeywords: [
      { keyword: 'weight loss meal replacement', matchType: 'AUTO_LOOSE', spend: 2800, sales: 5040, acos: 55.6, roas: 1.8, bid: 2.10 },
      { keyword: 'cheap bodybuilding bulk whey', matchType: 'AUTO_LOOSE', spend: 2100, sales: 4410, acos: 47.6, roas: 2.1, bid: 1.95 },
    ],
    placementShare: { topOfSearch: 25, restOfSearch: 45, productPages: 30 },
  },

  // Urban Living (Amazon UK & UAE)
  {
    id: 'ul-sp-desk-01',
    name: 'SP - Exact Match - Solid Bamboo Ergonomic Stand',
    brandId: 'urban-living',
    brandName: 'Urban Living',
    brandCode: 'UL',
    type: 'Sponsored Products',
    targeting: 'Manual - Exact',
    impressions: 310000,
    clicks: 11200,
    spend: 12320,
    adSales: 59136,
    orders: 860,
    dailyBudget: 450,
    budgetPacing: 90,
    status: 'Active',
    currency: 'GBP',
    topKeywords: [
      { keyword: 'ergonomic solid bamboo monitor riser', matchType: 'EXACT', spend: 4800, sales: 25440, acos: 18.9, roas: 5.3, bid: 1.15 },
      { keyword: 'dual monitor wooden desk shelf with tray', matchType: 'EXACT', spend: 3900, sales: 19890, acos: 19.6, roas: 5.1, bid: 1.10 },
      { keyword: 'minimalist desk organiser for home office', matchType: 'EXACT', spend: 2200, sales: 9900, acos: 22.2, roas: 4.5, bid: 0.95 },
    ],
    placementShare: { topOfSearch: 64, restOfSearch: 24, productPages: 12 },
  },
  {
    id: 'ul-sb-video-02',
    name: 'SB - Video - Workspace Setup Aesthetics & Cable Management',
    brandId: 'urban-living',
    brandName: 'Urban Living',
    brandCode: 'UL',
    type: 'Sponsored Brands',
    targeting: 'Video Ad',
    impressions: 420000,
    clicks: 9800,
    spend: 9800,
    adSales: 43120,
    orders: 540,
    dailyBudget: 400,
    budgetPacing: 82,
    status: 'Active',
    currency: 'GBP',
    topKeywords: [
      { keyword: 'aesthetic desk setup accessories', matchType: 'PHRASE', spend: 3600, sales: 16920, acos: 21.3, roas: 4.7, bid: 1.05 },
      { keyword: 'under desk cable management tray', matchType: 'PHRASE', spend: 3100, sales: 13950, acos: 22.2, roas: 4.5, bid: 0.95 },
    ],
    placementShare: { topOfSearch: 70, restOfSearch: 22, productPages: 8 },
  },
  {
    id: 'ul-sd-conquest-03',
    name: 'SD - Product Targeting - Premium Competitor ASINs',
    brandId: 'urban-living',
    brandName: 'Urban Living',
    brandCode: 'UL',
    type: 'Sponsored Display',
    targeting: 'Contextual ASIN',
    impressions: 165000,
    clicks: 3300,
    spend: 4620,
    adSales: 16632,
    orders: 220,
    dailyBudget: 200,
    budgetPacing: 88,
    status: 'Active',
    currency: 'GBP',
    topKeywords: [
      { keyword: 'ASIN B08X4Y21K9 (Oak Monitor Stand)', matchType: 'PRODUCT', spend: 2400, sales: 9360, acos: 25.6, roas: 3.9, bid: 1.45 },
      { keyword: 'ASIN B07M9KL99P (Metal Desk Drawer)', matchType: 'PRODUCT', spend: 1800, sales: 6120, acos: 29.4, roas: 3.4, bid: 1.35 },
    ],
    placementShare: { topOfSearch: 12, restOfSearch: 18, productPages: 70 },
  },
  {
    id: 'ul-sp-auto-paused-04',
    name: 'SP - Auto Targeting - Legacy Catalog Experiment',
    brandId: 'urban-living',
    brandName: 'Urban Living',
    brandCode: 'UL',
    type: 'Sponsored Products',
    targeting: 'Auto - Multi Target',
    impressions: 88000,
    clicks: 1400,
    spend: 2160,
    adSales: 4536,
    orders: 58,
    dailyBudget: 150,
    budgetPacing: 0,
    status: 'Paused',
    currency: 'GBP',
    topKeywords: [
      { keyword: 'cheap computer desk', matchType: 'AUTO', spend: 1100, sales: 2090, acos: 52.6, roas: 1.9, bid: 1.60 },
    ],
    placementShare: { topOfSearch: 30, restOfSearch: 40, productPages: 30 },
  },
];

/**
 * Calculates derived metrics for an individual campaign
 */
export function computeCampaignMetrics(c) {
  const cpc = c.clicks > 0 ? Number((c.spend / c.clicks).toFixed(2)) : 0;
  const ctr = c.impressions > 0 ? Number(((c.clicks / c.impressions) * 100).toFixed(2)) : 0;
  const acos = c.adSales > 0 ? Number(((c.spend / c.adSales) * 100).toFixed(1)) : 0;
  const roas = c.spend > 0 ? Number((c.adSales / c.spend).toFixed(2)) : 0;

  // Performance status classification
  let performanceStatus = 'Optimal';
  if (c.status === 'Paused') {
    performanceStatus = 'Paused';
  } else if (c.status === 'Out of Budget') {
    performanceStatus = 'Budget Capped';
  } else if (acos > 35 || roas < 2.5) {
    performanceStatus = 'High Spend Low Return';
  } else if (acos > 28) {
    performanceStatus = 'High ACOS';
  } else if (roas >= 4.5 && acos <= 22) {
    performanceStatus = 'Star Performer';
  }

  return {
    ...c,
    cpc,
    ctr,
    acos,
    roas,
    performanceStatus,
  };
}

/**
 * Historical time-series trends for visualizations
 */
export const CAMPAIGN_TIME_SERIES = [
  { date: 'Oct 01', spend: 3200, sales: 14400, acos: 22.2, roas: 4.50 },
  { date: 'Oct 04', spend: 3600, sales: 16560, acos: 21.7, roas: 4.60 },
  { date: 'Oct 07', spend: 3450, sales: 15180, acos: 22.7, roas: 4.40 },
  { date: 'Oct 10', spend: 3900, sales: 18330, acos: 21.3, roas: 4.70 },
  { date: 'Oct 13', spend: 4200, sales: 19740, acos: 21.3, roas: 4.70 },
  { date: 'Oct 16', spend: 4050, sales: 18630, acos: 21.7, roas: 4.60 },
  { date: 'Oct 19', spend: 4600, sales: 22080, acos: 20.8, roas: 4.80 },
  { date: 'Oct 22', spend: 4400, sales: 20680, acos: 21.3, roas: 4.70 },
  { date: 'Oct 25', spend: 4850, sales: 23765, acos: 20.4, roas: 4.90 },
  { date: 'Oct 28', spend: 5200, sales: 26520, acos: 19.6, roas: 5.10 },
  { date: 'Oct 31', spend: 5400, sales: 27540, acos: 19.6, roas: 5.10 },
];

export const campaignService = {
  /**
   * Fetch campaigns with filtering, searching, and sorting
   */
  async getCampaigns({
    search = '',
    brandId = 'All',
    campaignType = 'All',
    status = 'All',
    performanceStatus = 'All',
    sortBy = 'spend-desc',
  } = {}) {
    let list = DEFAULT_CAMPAIGNS.map(computeCampaignMetrics);

    // Filter by Brand
    if (brandId && brandId !== 'All') {
      list = list.filter((c) => c.brandId === brandId);
    }

    // Filter by Campaign Type
    if (campaignType && campaignType !== 'All') {
      list = list.filter((c) => c.type === campaignType);
    }

    // Filter by Status
    if (status && status !== 'All') {
      list = list.filter((c) => c.status === status);
    }

    // Filter by Performance Status
    if (performanceStatus && performanceStatus !== 'All') {
      if (performanceStatus === 'High ACOS') {
        list = list.filter((c) => c.acos > 28);
      } else if (performanceStatus === 'High Spend Low Return') {
        list = list.filter((c) => (c.acos > 35 || c.roas < 2.5) && c.spend > 2000);
      } else if (performanceStatus === 'Star Performer') {
        list = list.filter((c) => c.roas >= 4.5);
      } else if (performanceStatus === 'Budget Capped') {
        list = list.filter((c) => c.budgetPacing >= 95 || c.status === 'Out of Budget');
      }
    }

    // Search filter
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.brandName.toLowerCase().includes(q) ||
          c.targeting.toLowerCase().includes(q) ||
          c.type.toLowerCase().includes(q)
      );
    }

    // Sorting
    list.sort((a, b) => {
      switch (sortBy) {
        case 'spend-desc':
          return b.spend - a.spend;
        case 'spend-asc':
          return a.spend - b.spend;
        case 'sales-desc':
          return b.adSales - a.adSales;
        case 'sales-asc':
          return a.adSales - b.adSales;
        case 'acos-desc':
          return b.acos - a.acos;
        case 'acos-asc':
          return a.acos - b.acos;
        case 'roas-desc':
          return b.roas - a.roas;
        case 'roas-asc':
          return a.roas - b.roas;
        case 'orders-desc':
          return b.orders - a.orders;
        case 'clicks-desc':
          return b.clicks - a.clicks;
        case 'ctr-desc':
          return b.ctr - a.ctr;
        case 'cpc-asc':
          return a.cpc - b.cpc;
        case 'name-asc':
          return a.name.localeCompare(b.name);
        default:
          return b.spend - a.spend;
      }
    });

    return list;
  },

  /**
   * Analysis Panel Metrics
   */
  async getAnalysisPanel(brandId = 'All') {
    let list = DEFAULT_CAMPAIGNS.map(computeCampaignMetrics);
    if (brandId && brandId !== 'All') {
      list = list.filter((c) => c.brandId === brandId);
    }

    // Active or running campaigns
    const activeList = list.filter((c) => c.status !== 'Paused');

    // 1. Best performing campaign (Highest ROAS with minimum spend)
    const bestPerforming = [...activeList].sort((a, b) => b.roas - a.roas)[0] || list[0];

    // 2. Worst performing campaign (Highest ACoS / lowest ROAS)
    const worstPerforming =
      [...list].filter((c) => c.spend > 1000).sort((a, b) => b.acos - a.acos)[0] ||
      [...list].sort((a, b) => a.roas - b.roas)[0];

    // 3. Highest spending campaign
    const highestSpending = [...list].sort((a, b) => b.spend - a.spend)[0];

    // 4. Campaigns requiring attention (High ACoS, Out of budget, or Low Return)
    const requiringAttention = list.filter(
      (c) =>
        c.status === 'Out of Budget' ||
        c.budgetPacing >= 95 ||
        c.acos > 30 ||
        (c.roas < 2.5 && c.spend > 2000)
    );

    // Summary totals
    const totalSpend = list.reduce((acc, c) => acc + c.spend, 0);
    const totalSales = list.reduce((acc, c) => acc + c.adSales, 0);
    const totalOrders = list.reduce((acc, c) => acc + c.orders, 0);
    const blendedAcos = totalSales > 0 ? Number(((totalSpend / totalSales) * 100).toFixed(1)) : 0;
    const blendedRoas = totalSpend > 0 ? Number((totalSales / totalSpend).toFixed(2)) : 0;

    return {
      bestPerforming,
      worstPerforming,
      highestSpending,
      requiringAttention,
      requiringAttentionCount: requiringAttention.length,
      totals: {
        totalSpend,
        totalSales,
        totalOrders,
        blendedAcos,
        blendedRoas,
        campaignsCount: list.length,
      },
    };
  },

  /**
   * Get single campaign details
   */
  async getCampaignDetails(id) {
    const list = DEFAULT_CAMPAIGNS.map(computeCampaignMetrics);
    return list.find((c) => c.id === id) || list[0];
  },
};

export default campaignService;
