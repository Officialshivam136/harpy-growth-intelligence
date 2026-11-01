import mongoose from 'mongoose';

const metricSnapshotSchema = new mongoose.Schema(
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
    date: {
      type: String, // 'YYYY-MM-DD'
      required: true,
      index: true,
    },
    revenue: {
      type: Number,
      required: true,
      default: 0,
    },
    adSpend: {
      type: Number,
      required: true,
      default: 0,
    },
    adSales: {
      type: Number,
      default: 0,
    },
    organicSales: {
      type: Number,
      default: 0,
    },
    orders: {
      type: Number,
      default: 0,
    },
    units: {
      type: Number,
      default: 0,
    },
    netProfit: {
      type: Number,
      default: 0,
    },
    roas: {
      type: Number,
      default: 4.0,
    },
    acos: {
      type: Number,
      default: 20,
    },
    tacos: {
      type: Number,
      default: 10,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate metrics for the same brand and day in the agency
metricSnapshotSchema.index({ agencyId: 1, brandId: 1, date: 1 }, { unique: true });

export const MetricSnapshot = mongoose.models.MetricSnapshot || mongoose.model('MetricSnapshot', metricSnapshotSchema);
export default MetricSnapshot;
