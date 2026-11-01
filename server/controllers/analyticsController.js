// Realistic Amazon multi-brand dataset for backend API
const mockBrands = [
  {
    id: 'all',
    name: 'All Brands (Consolidated)',
    code: 'ALL',
    badge: 'Portfolio',
    marketplaces: ['US', 'CA', 'UK', 'DE'],
    currency: 'USD',
    monthlyRevenue: 1107100,
    healthScore: 94,
    status: 'optimal',
  },
  {
    id: 'nordic-living',
    name: 'Nordic Living Co.',
    code: 'NLC',
    badge: 'Home & Kitchen',
    marketplaces: ['US', 'CA'],
    currency: 'USD',
    monthlyRevenue: 482500,
    healthScore: 96,
    status: 'optimal',
  },
  {
    id: 'apex-supplements',
    name: 'Apex Supplements',
    code: 'APX',
    badge: 'Health & Wellness',
    marketplaces: ['US'],
    currency: 'USD',
    monthlyRevenue: 318400,
    healthScore: 92,
    status: 'optimal',
  },
  {
    id: 'aerotech-audio',
    name: 'AeroTech Audio',
    code: 'ATA',
    badge: 'Consumer Tech',
    marketplaces: ['US', 'DE'],
    currency: 'USD',
    monthlyRevenue: 194200,
    healthScore: 88,
    status: 'optimal',
  },
  {
    id: 'solace-sleep',
    name: 'Solace Sleep',
    code: 'SLS',
    badge: 'Bedding & Decor',
    marketplaces: ['US', 'UK'],
    currency: 'USD',
    monthlyRevenue: 112000,
    healthScore: 74,
    status: 'warning',
  },
];

const mockExecutiveKpis = [
  {
    id: 'gross-revenue',
    title: 'Total Gross Sales',
    value: 1107100,
    type: 'currency',
    change: 14.8,
    changeType: 'positive',
    period: 'vs last 30 days',
    target: '$1,000,000',
    tooltip: 'Total Amazon gross merchandise value (GMV) across all active seller channels.',
    sparkline: [28, 31, 35, 32, 38, 42, 45, 41, 48, 52, 54, 59],
  },
  {
    id: 'tacos',
    title: 'Blended TACoS',
    value: 11.4,
    type: 'percentage',
    suffix: '%',
    change: -1.2,
    changeType: 'positive',
    period: 'vs target 13.0%',
    target: '< 13.0%',
    tooltip: 'Total Advertising Cost of Sales (Ad Spend / Total Gross Revenue). Target is < 13%.',
    sparkline: [13.4, 13.1, 12.8, 12.6, 12.2, 11.9, 11.7, 11.6, 11.5, 11.4],
  },
  {
    id: 'blended-roas',
    title: 'Ad RoAS (Blended)',
    value: 4.18,
    type: 'number',
    suffix: 'x',
    change: 8.5,
    changeType: 'positive',
    period: 'vs last 30 days',
    target: '3.80x',
    tooltip: 'Return on Amazon Advertising Spend across Sponsored Products, Brands, and Display.',
    sparkline: [3.4, 3.6, 3.5, 3.8, 3.9, 4.0, 4.1, 4.05, 4.18],
  },
  {
    id: 'net-profit-margin',
    title: 'Est. Net Margin (Post-FBA)',
    value: 24.6,
    type: 'percentage',
    suffix: '%',
    change: 2.1,
    changeType: 'positive',
    period: 'after fees & ad spend',
    target: '22.0%',
    tooltip: 'Contribution margin after deducting COGS, Amazon FBA fulfillment, referral fees, and ad costs.',
    sparkline: [21.8, 22.0, 22.4, 23.1, 23.5, 23.9, 24.2, 24.6],
  },
  {
    id: 'buy-box-share',
    title: 'Buy Box Win Rate',
    value: 98.4,
    type: 'percentage',
    suffix: '%',
    change: 0.8,
    changeType: 'positive',
    period: '38 core hero ASINs',
    target: '> 95%',
    tooltip: 'Percentage of customer page views won for the featured offer across brand catalog.',
    sparkline: [96.2, 97.0, 96.8, 97.4, 98.1, 98.4],
  },
  {
    id: 'inventory-stock',
    title: 'FBA Inventory Health',
    value: 38420,
    type: 'units',
    suffix: ' units',
    change: -4.3,
    changeType: 'neutral',
    period: '46 days of supply',
    target: '45-60 days',
    tooltip: 'Total active inventory across Amazon FBA fulfillment centers.',
    sparkline: [42, 41, 40, 39.5, 39, 38.4],
  },
];

const mockRevenueTrends = [
  { date: 'Oct 01', totalSales: 28400, organicSales: 19800, adSales: 8600, adSpend: 2050, tacos: 7.2 },
  { date: 'Oct 04', totalSales: 31200, organicSales: 21500, adSales: 9700, adSpend: 2300, tacos: 7.3 },
  { date: 'Oct 07', totalSales: 29800, organicSales: 20100, adSales: 9700, adSpend: 2420, tacos: 8.1 },
  { date: 'Oct 10', totalSales: 34500, organicSales: 23600, adSales: 10900, adSpend: 2650, tacos: 7.6 },
  { date: 'Oct 13', totalSales: 38200, organicSales: 26100, adSales: 12100, adSpend: 2950, tacos: 7.7 },
  { date: 'Oct 16', totalSales: 36400, organicSales: 24800, adSales: 11600, adSpend: 2800, tacos: 7.6 },
  { date: 'Oct 19', totalSales: 41200, organicSales: 27900, adSales: 13300, adSpend: 3180, tacos: 7.7 },
  { date: 'Oct 22', totalSales: 39500, organicSales: 26800, adSales: 12700, adSpend: 3050, tacos: 7.7 },
  { date: 'Oct 25', totalSales: 44200, organicSales: 29600, adSales: 14600, adSpend: 3350, tacos: 7.5 },
  { date: 'Oct 28', totalSales: 48600, organicSales: 32400, adSales: 16200, adSpend: 3600, tacos: 7.4 },
  { date: 'Oct 31', totalSales: 52100, organicSales: 34900, adSales: 17200, adSpend: 3820, tacos: 7.3 },
];

const mockTopAsins = [
  {
    asin: 'B09X7K21L8',
    sku: 'NLC-OAK-01',
    brand: 'Nordic Living Co.',
    title: 'Minimalist Solid Oak Bedside Stand with Wireless Charger',
    unitsSold: 2840,
    revenue: 142000,
    organicRank: '#12 in Home',
    bsr: 412,
    acos: 18.4,
    tacos: 8.2,
    buyBoxRate: 99.8,
    inventoryDays: 52,
    status: 'High Growth',
  },
  {
    asin: 'B08F2M9Q21',
    sku: 'APX-WHEY-CHOC',
    brand: 'Apex Supplements',
    title: 'Grass-Fed Hydrolyzed Whey Isolate (2.2 lbs) Dutch Chocolate',
    unitsSold: 3120,
    revenue: 124800,
    organicRank: '#4 in Sports Nutrition',
    bsr: 185,
    acos: 21.2,
    tacos: 11.5,
    buyBoxRate: 99.1,
    inventoryDays: 38,
    status: 'Hero ASIN',
  },
  {
    asin: 'B08K91PQ44',
    sku: 'ATA-NC7-BLK',
    brand: 'AeroTech Audio',
    title: 'AeroPulse Pro Hybrid Active Noise Cancelling Headphones',
    unitsSold: 1150,
    revenue: 92000,
    organicRank: '#19 in Over-Ear Headphones',
    bsr: 630,
    acos: 24.6,
    tacos: 13.8,
    buyBoxRate: 97.4,
    inventoryDays: 44,
    status: 'Scaling',
  },
  {
    asin: 'B07V499KL3',
    sku: 'SLS-MATT-QUEEN',
    brand: 'Solace Sleep',
    title: 'CoolGel Hybrid 12-inch Memory Foam Mattress (Queen)',
    unitsSold: 420,
    revenue: 84000,
    organicRank: '#34 in Mattresses',
    bsr: 1280,
    acos: 28.1,
    tacos: 15.9,
    buyBoxRate: 94.2,
    inventoryDays: 14,
    status: 'Low Stock Risk',
  },
];

export const getBrands = async (req, res) => {
  return res.json({ success: true, data: mockBrands });
};

export const getKpis = async (req, res) => {
  const { brandId } = req.query;
  // If specific brand requested, adjust revenue proportionally for demo
  if (brandId && brandId !== 'all') {
    const brand = mockBrands.find((b) => b.id === brandId);
    if (brand) {
      const adjustedKpis = mockExecutiveKpis.map((kpi) => {
        if (kpi.id === 'gross-revenue') {
          return { ...kpi, value: brand.monthlyRevenue };
        }
        return kpi;
      });
      return res.json({ success: true, data: adjustedKpis });
    }
  }
  return res.json({ success: true, data: mockExecutiveKpis });
};

export const getRevenueTrends = async (req, res) => {
  return res.json({ success: true, data: mockRevenueTrends });
};

export const getTopAsins = async (req, res) => {
  const { brandId } = req.query;
  if (brandId && brandId !== 'all') {
    const filtered = mockTopAsins.filter((item) =>
      item.brand.toLowerCase().includes(brandId.replace('-', ' '))
    );
    return res.json({ success: true, data: filtered.length ? filtered : mockTopAsins });
  }
  return res.json({ success: true, data: mockTopAsins });
};

