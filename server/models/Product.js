import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    agencyId: {
      type: String,
      required: true,
      default: 'agency_harpy_media_01',
      index: true,
    },
    brandId: {
      type: String,
      required: true,
      index: true,
    },
    asin: {
      type: String,
      required: true,
      index: true,
      trim: true,
      uppercase: true,
    },
    sku: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      default: 'General',
    },
    currency: {
      type: String,
      default: 'USD',
      enum: ['USD', 'INR', 'GBP', 'AED', 'EUR'],
    },
    sellingPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    unitCogs: {
      type: Number,
      default: null, // Null indicates incomplete cost data
    },
    unitFulfillmentCost: {
      type: Number,
      default: 0,
    },
    marketplaceFeeRate: {
      type: Number,
      default: 0.15, // 15% standard referral
    },
    unitsSold: {
      type: Number,
      default: 0,
    },
    adSpend: {
      type: Number,
      default: 0,
    },
    adSales: {
      type: Number,
      default: 0,
    },
    bsr: {
      type: Number,
      default: 999,
    },
    buyBoxWinRate: {
      type: Number,
      default: 99.0,
    },
    fbaStockDays: {
      type: Number,
      default: 45,
    },
    isCostIncomplete: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

productSchema.index({ agencyId: 1, asin: 1 }, { unique: true });
productSchema.index({ agencyId: 1, brandId: 1, sku: 1 });

export const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
export default Product;

