/**
 * Smart Alerts Express Controller
 * Backend intelligence engine for evaluating performance alerts,
 * tracking resolution state, and serving deduplicated alerts.
 */

// In-memory alert store on server
let serverRules = [
  {
    id: 'rule-spend-spike',
    type: 'ad_spend_spike',
    name: 'Advertising Spend Spike',
    description: 'Triggers when PPC spend surges by > 30% compared to previous period',
    threshold: 30,
    unit: '%',
    severity: 'critical',
    enabled: true,
  },
  {
    id: 'rule-roas-decline',
    type: 'roas_decline',
    name: 'ROAS Decline',
    description: 'Triggers when Return on Ad Spend drops by > 20% compared to previous period',
    threshold: 20,
    unit: '%',
    severity: 'critical',
    enabled: true,
  },
  {
    id: 'rule-acos-target',
    type: 'acos_above_target',
    name: 'ACOS Above Target',
    description: "Triggers when actual ACOS exceeds the brand's configured target threshold",
    threshold: 0,
    unit: 'pts',
    severity: 'critical',
    enabled: true,
  },
  {
    id: 'rule-tacos-increase',
    type: 'tacos_increase',
    name: 'TACOS Increase',
    description: "Triggers when Total ACOS surges by > 15% or breaches the brand's target TACOS",
    threshold: 15,
    unit: '%',
    severity: 'warning',
    enabled: true,
  },
  {
    id: 'rule-rev-decline',
    type: 'revenue_decline',
    name: 'Revenue Decline',
    description: 'Triggers when top-line GMV revenue drops by > 20% compared to previous period',
    threshold: 20,
    unit: '%',
    severity: 'critical',
    enabled: true,
  },
  {
    id: 'rule-low-profitability',
    type: 'low_product_profitability',
    name: 'Low Product Profitability',
    description: 'Triggers when product contribution margin falls below configured minimum threshold',
    threshold: 15,
    unit: '%',
    severity: 'critical',
    enabled: true,
  },
  {
    id: 'rule-campaign-deterioration',
    type: 'campaign_deterioration',
    name: 'Campaign Performance Deterioration',
    description: 'Triggers when high ad spending yields low ROAS (< 2.6x) and high ACOS (> 35%)',
    threshold: 35,
    unit: '%',
    severity: 'warning',
    enabled: true,
  },
];

let serverAlerts = [
  {
    id: 'alt-spend-ul-01',
    alertKey: 'spend_spike-urban-living-portfolio-7d',
    title: 'Ad Spend Spike in Amazon UK & UAE',
    type: 'ad_spend_spike',
    ruleId: 'rule-spend-spike',
    brandId: 'urban-living',
    brandName: 'Urban Living',
    brandCode: 'UL',
    marketplace: 'Amazon UK & UAE',
    entityType: 'brand',
    entityName: 'Urban Living Brand Portfolio',
    entityId: 'urban-living',
    severity: 'critical',
    metricAffected: 'Ad Spend',
    currentValue: '£15,350',
    previousValue: '£11,200',
    changePercentage: '+37.1%',
    thresholdValue: '> +30%',
    reason: '7-day advertising spend accelerated from £11,200 to £15,350 (+37.1%), surpassing the configured 30% tolerance limit without a matching lift in attributed conversions.',
    suggestedAction: 'Audit high-cost broad keywords in Sponsored Products, inspect top-of-search placement multipliers, and trim daily budgets on experimental ad groups.',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    relativeTime: '1 hour ago',
    isRead: false,
    status: 'active',
  },
  {
    id: 'alt-roas-ul-02',
    alertKey: 'roas_decline-urban-living-ul-sb-desk-02-30d',
    title: 'Severe ROAS Degradation on Sponsored Brands',
    type: 'roas_decline',
    ruleId: 'rule-roas-decline',
    brandId: 'urban-living',
    brandName: 'Urban Living',
    brandCode: 'UL',
    marketplace: 'Amazon UK',
    entityType: 'campaign',
    entityName: 'SB - Storefront Spotlight - Modern Desk Collections',
    entityId: 'ul-sb-desk-02',
    severity: 'critical',
    metricAffected: 'ROAS',
    currentValue: '2.88x',
    previousValue: '3.90x',
    changePercentage: '-26.2%',
    thresholdValue: '> -20%',
    reason: 'Campaign Return on Ad Spend plummeted from 3.90x to 2.88x (-26.2%), breaching the 20% threshold as click costs increased on generic home-office keywords.',
    suggestedAction: 'Pause low-converting broad search terms, add negative phrase matches for irrelevant clicks, and reallocate budget toward high-converting exact match desk keywords.',
    timestamp: new Date(Date.now() - 10800000).toISOString(),
    relativeTime: '3 hours ago',
    isRead: false,
    status: 'active',
  },
  {
    id: 'alt-acos-vc-03',
    alertKey: 'acos_target-village-company-vc-sp-broad-03-30d',
    title: 'ACOS Above Target on Broad Discovery',
    type: 'acos_above_target',
    ruleId: 'rule-acos-target',
    brandId: 'village-company',
    brandName: 'Village Company',
    brandCode: 'VC',
    marketplace: 'Amazon India',
    entityType: 'campaign',
    entityName: 'SP - Broad Discovery - Organic Grocery Essentials',
    entityId: 'vc-sp-broad-03',
    severity: 'critical',
    metricAffected: 'ACOS',
    currentValue: '35.7%',
    previousValue: '22.0% (Target)',
    changePercentage: '+13.7 pts',
    thresholdValue: 'Max 22.0%',
    reason: "Current campaign ACOS is 35.7%, which is +13.7 percentage points higher than Village Company's target ceiling of 22.0%, eroding overall gross profitability.",
    suggestedAction: 'Reduce default bids by 20% on broad targeting, harvest converting customer queries into Exact Match campaigns, and add negative exact matches for bleeders.',
    timestamp: new Date(Date.now() - 14400000).toISOString(),
    relativeTime: '4 hours ago',
    isRead: false,
    status: 'active',
  },
  {
    id: 'alt-tacos-pw-04',
    alertKey: 'tacos_increase-premium-wellness-co-portfolio-30d',
    title: 'TACOS Exceeding Target Sensitivity',
    type: 'tacos_increase',
    ruleId: 'rule-tacos-increase',
    brandId: 'premium-wellness-co',
    brandName: 'Premium Wellness Co.',
    brandCode: 'PW',
    marketplace: 'Amazon US',
    entityType: 'brand',
    entityName: 'Premium Wellness Portfolio',
    entityId: 'premium-wellness-co',
    severity: 'warning',
    metricAffected: 'TACOS',
    currentValue: '14.8%',
    previousValue: '11.2% (Target: 13.0%)',
    changePercentage: '+32.1%',
    thresholdValue: 'Target ≤ 13.0%',
    reason: "Total ACOS climbed from 11.2% to 14.8% (+32.1%), crossing the brand's 13.0% ceiling. Paid ads now drive an excessive share of revenue versus organic sales.",
    suggestedAction: 'Boost organic ranking through listing title and backend search term optimization; pull back on low-efficiency Sponsored Display category campaigns.',
    timestamp: new Date(Date.now() - 43200000).toISOString(),
    relativeTime: '12 hours ago',
    isRead: false,
    status: 'active',
  },
  {
    id: 'alt-rev-ul-05',
    alertKey: 'rev_decline-urban-living-ergonomic-desks-7d',
    title: 'Sub-Category Revenue Contraction',
    type: 'revenue_decline',
    ruleId: 'rule-rev-decline',
    brandId: 'urban-living',
    brandName: 'Urban Living',
    brandCode: 'UL',
    marketplace: 'Amazon UK',
    entityType: 'product',
    entityName: 'Ergonomic Desk Category Segment',
    entityId: 'cat-desks',
    severity: 'critical',
    metricAffected: 'Revenue',
    currentValue: '£23,800',
    previousValue: '£31,200',
    changePercentage: '-23.7%',
    thresholdValue: '> -20%',
    reason: '7-day revenue in the Ergonomic Desks sub-category dropped from £31,200 to £23,800 (-23.7%), caused by Buy Box suppression and temporary FBA delivery delays.',
    suggestedAction: 'Verify seller pricing against external platforms to recover suppressed Buy Box, and review FBA inbound logistics to replenish UK warehouse inventory.',
    timestamp: new Date(Date.now() - 57600000).toISOString(),
    relativeTime: '16 hours ago',
    isRead: true,
    status: 'active',
  },
  {
    id: 'alt-margin-pw-bar-bulk-24',
    alertKey: 'low_margin-premium-wellness-co-PW-BAR-BULK-24-30d',
    title: 'Low Contribution Margin: PW-BAR-BULK-24',
    type: 'low_product_profitability',
    ruleId: 'rule-low-profitability',
    brandId: 'premium-wellness-co',
    brandName: 'Premium Wellness Co.',
    brandCode: 'PW',
    marketplace: 'Amazon US',
    entityType: 'product',
    entityName: 'PW-BAR-BULK-24 - Plant Protein Energy Bars Bulk Box (24...',
    entityId: 'B08G4M9N12',
    severity: 'critical',
    metricAffected: 'Contribution Margin',
    currentValue: '5.6%',
    previousValue: '15.0% (Target Min)',
    changePercentage: '-9.4 pts',
    thresholdValue: 'Min 15.0%',
    reason: 'Net contribution margin for SKU PW-BAR-BULK-24 is only 5.6%, which is 9.4% below the configured minimum threshold of 15.0%. High FBA fulfillment ($11.20/unit) and ad spend are eroding unit economics.',
    suggestedAction: 'Redesign multi-pack dimensions to escape heavy tier FBA surcharges, or increase selling price to $48.99 to restore profitable contribution margins.',
    timestamp: new Date(Date.now() - 72000000).toISOString(),
    relativeTime: '20 hours ago',
    isRead: false,
    status: 'active',
  },
  {
    id: 'alt-deteriorate-ul-07',
    alertKey: 'deterioration-urban-living-ul-sd-desk-05-30d',
    title: 'Campaign Performance Deterioration',
    type: 'campaign_deterioration',
    ruleId: 'rule-campaign-deterioration',
    brandId: 'urban-living',
    brandName: 'Urban Living',
    brandCode: 'UL',
    marketplace: 'Amazon UK',
    entityType: 'campaign',
    entityName: 'SD - Retargeting & Category - Ergonomic Desks',
    entityId: 'ul-sd-desk-05',
    severity: 'warning',
    metricAffected: 'Campaign Efficiency',
    currentValue: 'ACOS 40.0% / ROAS 2.50x',
    previousValue: 'ACOS 24.0% / ROAS 4.15x',
    changePercentage: '+16.0 pts ACOS',
    thresholdValue: 'Target ACOS ≤ 24%',
    reason: 'Campaign has spent £14,600 with deteriorating returns. Low CTR (0.22%) and aggressive 98% daily budget pacing indicate budget burn on unhedged audience segments.',
    suggestedAction: 'Pivot Sponsored Display targeting from broad audience interests to high-intent product view retargeting, and lower daily budget cap from £500 to £250.',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    relativeTime: '1 day ago',
    isRead: true,
    status: 'active',
  },
];

/**
 * GET /api/alerts
 */
export const getAlerts = (req, res) => {
  try {
    const { brandId, severity, status, type, search } = req.query;

    let filtered = [...serverAlerts];

    if (brandId && brandId !== 'all') {
      filtered = filtered.filter((a) => a.brandId === brandId);
    }
    if (severity && severity !== 'all') {
      filtered = filtered.filter((a) => a.severity === severity);
    }
    if (status && status !== 'all') {
      filtered = filtered.filter((a) => a.status === status);
    }
    if (type && type !== 'all') {
      filtered = filtered.filter((a) => a.type === type);
    }
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.entityName.toLowerCase().includes(q) ||
          a.reason.toLowerCase().includes(q) ||
          a.brandName.toLowerCase().includes(q) ||
          a.metricAffected.toLowerCase().includes(q)
      );
    }

    // Sort: Active first, critical first, unread first
    filtered.sort((a, b) => {
      if (a.status !== b.status) return a.status === 'active' ? -1 : 1;
      const scores = { critical: 3, warning: 2, info: 1 };
      const diff = (scores[b.severity] || 0) - (scores[a.severity] || 0);
      if (diff !== 0) return diff;
      if (a.isRead !== b.isRead) return a.isRead ? 1 : -1;
      return new Date(b.timestamp) - new Date(a.timestamp);
    });

    res.json({
      success: true,
      data: filtered,
      total: filtered.length,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * GET /api/alerts/summary
 */
export const getAlertSummary = (req, res) => {
  try {
    const { brandId } = req.query;
    let relevant = serverAlerts;
    if (brandId && brandId !== 'all') {
      relevant = relevant.filter((a) => a.brandId === brandId);
    }

    const active = relevant.filter((a) => a.status === 'active');
    const critical = active.filter((a) => a.severity === 'critical').length;
    const warning = active.filter((a) => a.severity === 'warning').length;
    const info = active.filter((a) => a.severity === 'info').length;
    const unread = relevant.filter((a) => !a.isRead).length;
    const resolved = relevant.filter((a) => a.status === 'resolved').length;

    res.json({
      success: true,
      data: {
        total: relevant.length,
        active: active.length,
        critical,
        warning,
        info,
        unread,
        resolved,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * GET /api/alerts/rules
 */
export const getAlertRules = (req, res) => {
  try {
    res.json({
      success: true,
      data: serverRules,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * PATCH /api/alerts/:id/read
 */
export const markAlertRead = (req, res) => {
  try {
    const { id } = req.params;
    const alert = serverAlerts.find((a) => a.id === id);
    if (!alert) {
      return res.status(404).json({ success: false, message: 'Alert not found' });
    }

    alert.isRead = true;
    res.json({ success: true, data: alert });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * POST /api/alerts/mark-all-read
 */
export const markAllAlertsRead = (req, res) => {
  try {
    const { brandId } = req.body;
    serverAlerts = serverAlerts.map((a) => {
      if (!brandId || brandId === 'all' || a.brandId === brandId) {
        return { ...a, isRead: true };
      }
      return a;
    });

    res.json({ success: true, message: 'All alerts marked as read' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * PATCH /api/alerts/:id/resolve
 */
export const resolveAlert = (req, res) => {
  try {
    const { id } = req.params;
    const { resolutionNotes } = req.body;
    const alert = serverAlerts.find((a) => a.id === id);
    if (!alert) {
      return res.status(404).json({ success: false, message: 'Alert not found' });
    }

    alert.status = 'resolved';
    alert.isRead = true;
    alert.resolvedAt = new Date().toISOString();
    alert.resolvedBy = 'J. Davenport';
    alert.resolutionNotes = resolutionNotes || 'Action resolved by manager';

    res.json({ success: true, data: alert });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * PATCH /api/alerts/:id/reopen
 */
export const reopenAlert = (req, res) => {
  try {
    const { id } = req.params;
    const alert = serverAlerts.find((a) => a.id === id);
    if (!alert) {
      return res.status(404).json({ success: false, message: 'Alert not found' });
    }

    alert.status = 'active';
    alert.resolvedAt = null;
    alert.resolvedBy = null;
    alert.resolutionNotes = null;

    res.json({ success: true, data: alert });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

