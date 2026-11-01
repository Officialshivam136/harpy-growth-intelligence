import Product from '../models/Product.js';
import { DEFAULT_PRODUCTS, computeProductMetrics } from '../../src/services/productService.js';

export const getProducts = async (req, res) => {
  try {
    const { search, brandId, sortBy, performanceFilter } = req.query;
    const agencyId = req.agencyId || 'agency_harpy_media_01';

    let rawList = [];
    try {
      rawList = await Product.find({ agencyId }).lean();
    } catch {
      // fallback
    }

    if (!rawList || rawList.length === 0) {
      rawList = DEFAULT_PRODUCTS;
    }

    let list = rawList.map(computeProductMetrics);

    if (brandId && brandId !== 'All' && brandId !== 'all') {
      list = list.filter((p) => p.brandId === brandId);
    }

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

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.title?.toLowerCase().includes(q) ||
          p.sku?.toLowerCase().includes(q) ||
          p.asin?.toLowerCase().includes(q)
      );
    }

    if (sortBy === 'profit-desc') {
      list.sort((a, b) => (b.estimatedProfit || 0) - (a.estimatedProfit || 0));
    } else if (sortBy === 'revenue-desc') {
      list.sort((a, b) => (b.totalRevenue || 0) - (a.totalRevenue || 0));
    }

    res.json({ success: true, count: list.length, data: list });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getProductByAsin = async (req, res) => {
  try {
    const { asin } = req.params;
    const agencyId = req.agencyId || 'agency_harpy_media_01';

    let rawProduct = null;
    try {
      rawProduct = await Product.findOne({ agencyId, asin }).lean();
    } catch {
      // fallback
    }

    if (!rawProduct) {
      rawProduct = DEFAULT_PRODUCTS.find((p) => p.asin === asin);
    }

    if (!rawProduct) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const computed = computeProductMetrics(rawProduct);
    res.json({ success: true, data: computed });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
