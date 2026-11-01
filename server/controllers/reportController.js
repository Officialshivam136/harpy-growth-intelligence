/**
 * Weekly Client Reporting Express Controller
 * Generates structured executive report payloads for each brand
 */

export const getReport = (req, res) => {
  try {
    const { brandId = 'village-company', periodId = '7d' } = req.query;

    const brandData = {
      'village-company': {
        name: 'Village Company',
        code: 'VC',
        currency: 'INR',
        currencySymbol: '₹',
        marketplace: 'Amazon India',
        targetAcos: 22.0,
        targetTacos: 12.0,
      },
      'premium-wellness-co': {
        name: 'Premium Wellness Co.',
        code: 'PW',
        currency: 'USD',
        currencySymbol: '$',
        marketplace: 'Amazon US',
        targetAcos: 25.0,
        targetTacos: 13.0,
      },
      'urban-living': {
        name: 'Urban Living',
        code: 'UL',
        currency: 'GBP',
        currencySymbol: '£',
        marketplace: 'Amazon UK',
        targetAcos: 24.0,
        targetTacos: 12.5,
      },
    };

    const targetBrand = brandData[brandId] || brandData['village-company'];

    res.json({
      success: true,
      data: {
        reportId: `HARPY-REP-${targetBrand.code}-${periodId.toUpperCase()}-20261101`,
        brand: targetBrand,
        periodId,
        generatedAt: new Date().toISOString(),
        status: 'Generated',
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

