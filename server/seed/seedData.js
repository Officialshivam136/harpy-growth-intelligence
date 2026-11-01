import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Brand from '../models/Brand.js';
import Product from '../models/Product.js';
import Campaign from '../models/Campaign.js';
import MetricSnapshot from '../models/MetricSnapshot.js';
import Alert from '../models/Alert.js';
import ImportLog from '../models/ImportLog.js';

dotenv.config();

const AGENCY_ID = 'agency_harpy_media_01';
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/harpy_analytics';

const sampleBrands = [
  {
    agencyId: AGENCY_ID,
    brandId: 'village-company',
    name: 'Village Company',
    code: 'VC',
    description: 'Ethical farm-to-table organic food essentials, heritage cold-pressed oils, and spices.',
    marketplace: 'Amazon India',
    marketplaces: ['Amazon India'],
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
    agencyId: AGENCY_ID,
    brandId: 'premium-wellness-co',
    name: 'Premium Wellness Co.',
    code: 'PW',
    description: 'Clinically-studied daily adaptogens, clean electrolyte hydration, and whey isolate proteins.',
    marketplace: 'Amazon US',
    marketplaces: ['Amazon US'],
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
    agencyId: AGENCY_ID,
    brandId: 'urban-living',
    name: 'Urban Living',
    code: 'UL',
    description: 'Modern ergonomic home workspace desks, smart ambient lighting, and modular bamboo organizers.',
    marketplace: 'Amazon UK',
    marketplaces: ['Amazon UK', 'Amazon UAE'],
    currency: 'GBP',
    category: 'Home & Furniture',
    targetAcos: 24.0,
    targetTacos: 12.5,
    productCount: 24,
    revenue: 245000,
    adSpend: 38500,
    roas: 3.65,
    acos: 27.4,
    tacos: 13.8,
    estimatedProfit: 51450,
    profitMargin: 21.0,
    healthScore: 86,
    status: 'Needs Optimization',
  },
];

const sampleProducts = [
  {
    agencyId: AGENCY_ID,
    brandId: 'village-company',
    asin: 'B09X7K21L8',
    sku: 'VC-MUSTARD-5L',
    title: 'Village Company Organic Cold-Pressed Mustard Oil (5L Tin)',
    category: 'Grocery & Gourmet Foods',
    currency: 'INR',
    sellingPrice: 1499,
    unitCogs: 520,
    unitFulfillmentCost: 145,
    marketplaceFeeRate: 0.12,
    unitsSold: 2400,
    adSpend: 360000,
    adSales: 1798800,
    bsr: 185,
    buyBoxWinRate: 99.4,
    fbaStockDays: 42,
    isCostIncomplete: false,
  },
  {
    agencyId: AGENCY_ID,
    brandId: 'village-company',
    asin: 'B09Y8M32N9',
    sku: 'VC-TURMERIC-1KG',
    title: 'Heritage Single-Origin Curcumin-Rich Lakadong Turmeric Powder (1kg)',
    category: 'Spices & Masalas',
    currency: 'INR',
    sellingPrice: 799,
    unitCogs: 240,
    unitFulfillmentCost: 85,
    marketplaceFeeRate: 0.12,
    unitsSold: 3100,
    adSpend: 248000,
    adSales: 1115400,
    bsr: 320,
    buyBoxWinRate: 99.8,
    fbaStockDays: 35,
    isCostIncomplete: false,
  },
  {
    agencyId: AGENCY_ID,
    brandId: 'premium-wellness-co',
    asin: 'B08F2M9Q21',
    sku: 'PW-WHEY-CHOC-2LB',
    title: 'Premium Wellness Grass-Fed Whey Isolate Protein Powder (2lb Dutch Chocolate)',
    category: 'Health & Nutrition',
    currency: 'USD',
    sellingPrice: 59.99,
    unitCogs: 21.50,
    unitFulfillmentCost: 7.20,
    marketplaceFeeRate: 0.15,
    unitsSold: 3800,
    adSpend: 38500,
    adSales: 182369,
    bsr: 42,
    buyBoxWinRate: 99.1,
    fbaStockDays: 28,
    isCostIncomplete: false,
  },
  {
    agencyId: AGENCY_ID,
    brandId: 'premium-wellness-co',
    asin: 'B08G4M9N12',
    sku: 'PW-BAR-BULK-24',
    title: 'Plant Protein Energy Bars Bulk Box (24 Bars Multi-Flavor Variety Pack)',
    category: 'Energy & Snack Bars',
    currency: 'USD',
    sellingPrice: 44.99,
    unitCogs: 21.50,
    unitFulfillmentCost: 11.20, // Bulky fee tier
    marketplaceFeeRate: 0.15,
    unitsSold: 2400,
    adSpend: 7200,
    adSales: 21595,
    bsr: 124,
    buyBoxWinRate: 98.4,
    fbaStockDays: 19,
    isCostIncomplete: false,
  },
  {
    agencyId: AGENCY_ID,
    brandId: 'urban-living',
    asin: 'B07V2K319L',
    sku: 'UL-DESK-BAMB-60',
    title: 'Urban Living Dual-Motor Electric Height Adjustable Standing Desk (60x30 Solid Bamboo)',
    category: 'Office Furniture',
    currency: 'GBP',
    sellingPrice: 420.00,
    unitCogs: 185.00,
    unitFulfillmentCost: 52.00,
    marketplaceFeeRate: 0.15,
    unitsSold: 450,
    adSpend: 24500,
    adSales: 89460,
    bsr: 88,
    buyBoxWinRate: 97.2,
    fbaStockDays: 32,
    isCostIncomplete: false,
  },
];

async function seedDatabase() {
  console.log('--- Harpy Growth Intelligence Database Seeding ---');
  console.log(`Target MongoDB URI: ${MONGODB_URI}`);

  try {
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB connected successfully.');

    // Drop collections to clean legacy indexes and ensure fresh schemas
    try {
      await mongoose.connection.collection('brands').drop();
    } catch (e) {
      // collection might not exist yet
    }
    await Brand.deleteMany({});
    await Product.deleteMany({});
    await Campaign.deleteMany({});
    await MetricSnapshot.deleteMany({});
    await Alert.deleteMany({});
    await ImportLog.deleteMany({});
    console.log('Cleared existing agency records and reset schema indexes.');

    // Seed Brands
    await Brand.insertMany(sampleBrands);
    console.log(`Seeded ${sampleBrands.length} client brands.`);

    // Seed Products
    await Product.insertMany(sampleProducts);
    console.log(`Seeded ${sampleProducts.length} product catalog SKUs.`);

    // Seed 30 days of Metric Snapshots for each brand
    const snapshots = [];
    const today = new Date('2026-11-01T00:00:00Z');
    sampleBrands.forEach((b) => {
      for (let i = 29; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().slice(0, 10);
        const dailyRev = Math.round(b.revenue / 30 * (1 + (Math.sin(i / 3) * 0.12)));
        const dailySpend = Math.round(b.adSpend / 30 * (1 + (Math.cos(i / 4) * 0.1)));
        const dailyOrders = Math.round(dailyRev / 55);

        snapshots.push({
          agencyId: AGENCY_ID,
          brandId: b.brandId,
          date: dateStr,
          revenue: dailyRev,
          adSpend: dailySpend,
          adSales: Math.round(dailySpend * b.roas),
          orders: dailyOrders,
          netProfit: Math.round(dailyRev * (b.profitMargin / 100)),
          roas: b.roas,
          acos: b.acos,
          tacos: b.tacos,
        });
      }
    });

    await MetricSnapshot.insertMany(snapshots);
    console.log(`Seeded ${snapshots.length} daily metric snapshot records.`);

    console.log('--- Seeding Completed Successfully ---');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

seedDatabase();
