import mongoose from 'mongoose';

const campaignSchema = new mongoose.Schema(
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
    campaignId: {
      type: String,
      required: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      required: true,
      enum: ['Sponsored Products', 'Sponsored Brands', 'Sponsored Display'],
      default: 'Sponsored Products',
    },
    targeting: {
      type: String,
      default: 'Manual - Exact',
    },
    currency: {
      type: String,
      default: 'USD',
    },
    spend: {
      type: Number,
      default: 0,
      min: 0,
    },
    adSales: {
      type: Number,
      default: 0,
      min: 0,
    },
    orders: {
      type: Number,
      default: 0,
      min: 0,
    },
    clicks: {
      type: Number,
      default: 0,
      min: 0,
    },
    impressions: {
      type: Number,
      default: 0,
      min: 0,
    },
    dailyBudget: {
      type: Number,
      default: 100,
    },
    budgetPacing: {
      type: Number,
      default: 85,
    },
    status: {
      type: String,
      enum: ['Active', 'Paused', 'Optimizing', 'Archived'],
      default: 'Active',
    },
  },
  {
    timestamps: true,
  }
);

campaignSchema.index({ agencyId: 1, campaignId: 1 }, { unique: true });
campaignSchema.index({ agencyId: 1, brandId: 1, status: 1 });

export const Campaign = mongoose.models.Campaign || mongoose.model('Campaign', campaignSchema);
export default Campaign;

