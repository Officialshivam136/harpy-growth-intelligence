import mongoose from 'mongoose';

const brandSchema = new mongoose.Schema(
  {
    agencyId: {
      type: String,
      required: true,
      default: 'agency_harpy_media_01',
      index: true,
      trim: true,
    },
    brandId: {
      type: String,
      required: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    code: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    marketplace: {
      type: String,
      required: true,
      default: 'Amazon US',
    },
    marketplaces: {
      type: [String],
      default: ['Amazon US'],
    },
    currency: {
      type: String,
      default: 'USD',
      enum: ['USD', 'INR', 'GBP', 'AED', 'EUR'],
    },
    category: {
      type: String,
      default: 'General D2C',
    },
    targetAcos: {
      type: Number,
      default: 22,
    },
    targetTacos: {
      type: Number,
      default: 12,
    },
    productCount: {
      type: Number,
      default: 12,
    },
    revenue: {
      type: Number,
      default: 0,
    },
    adSpend: {
      type: Number,
      default: 0,
    },
    roas: {
      type: Number,
      default: 4.0,
    },
    acos: {
      type: Number,
      default: 24,
    },
    tacos: {
      type: Number,
      default: 12,
    },
    estimatedProfit: {
      type: Number,
      default: 0,
    },
    profitMargin: {
      type: Number,
      default: 20,
    },
    healthScore: {
      type: Number,
      default: 92,
      min: 0,
      max: 100,
    },
    status: {
      type: String,
      enum: ['Optimal', 'High Growth', 'Needs Attention', 'Critical', 'Needs Optimization'],
      default: 'Optimal',
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for multi-tenant querying
brandSchema.index({ agencyId: 1, brandId: 1 }, { unique: true });

export const Brand = mongoose.models.Brand || mongoose.model('Brand', brandSchema);
export default Brand;
