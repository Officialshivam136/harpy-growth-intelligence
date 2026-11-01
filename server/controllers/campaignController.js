// Self-contained Amazon Advertising campaign dataset for Express API
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
  },
];

export function computeCampaignMetrics(c) {
  const cpc = c.clicks > 0 ? Number((c.spend / c.clicks).toFixed(2)) : 0;
  const ctr = c.impressions > 0 ? Number(((c.clicks / c.impressions) * 100).toFixed(2)) : 0;
  const acos = c.adSales > 0 ? Number(((c.spend / c.adSales) * 100).toFixed(1)) : 0;
  const roas = c.spend > 0 ? Number((c.adSales / c.spend).toFixed(2)) : 0;

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

export const getCampaigns = async (req, res) => {
  try {
    const { search, brandId, campaignType, status, performanceStatus, sortBy } = req.query;

    let list = DEFAULT_CAMPAIGNS.map(computeCampaignMetrics);

    if (brandId && brandId !== 'All') {
      list = list.filter((c) => c.brandId === brandId);
    }
    if (campaignType && campaignType !== 'All') {
      list = list.filter((c) => c.type === campaignType);
    }
    if (status && status !== 'All') {
      list = list.filter((c) => c.status === status);
    }
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
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.brandName.toLowerCase().includes(q) ||
          c.targeting.toLowerCase().includes(q)
      );
    }

    res.json({ success: true, count: list.length, data: list });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCampaignAnalysis = async (req, res) => {
  try {
    const { brandId } = req.query;
    let list = DEFAULT_CAMPAIGNS.map(computeCampaignMetrics);

    if (brandId && brandId !== 'All') {
      list = list.filter((c) => c.brandId === brandId);
    }

    const activeList = list.filter((c) => c.status !== 'Paused');
    const bestPerforming = [...activeList].sort((a, b) => b.roas - a.roas)[0] || list[0];
    const worstPerforming =
      [...list].filter((c) => c.spend > 1000).sort((a, b) => b.acos - a.acos)[0] || list[0];
    const highestSpending = [...list].sort((a, b) => b.spend - a.spend)[0];
    const requiringAttention = list.filter(
      (c) =>
        c.status === 'Out of Budget' ||
        c.budgetPacing >= 95 ||
        c.acos > 30 ||
        (c.roas < 2.5 && c.spend > 2000)
    );

    res.json({
      success: true,
      data: {
        bestPerforming,
        worstPerforming,
        highestSpending,
        requiringAttention,
        requiringAttentionCount: requiringAttention.length,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
