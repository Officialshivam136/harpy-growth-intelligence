import mongoose from 'mongoose';

const alertSchema = new mongoose.Schema(
  {
    agencyId: {
      type: String,
      required: true,
      default: 'agency_harpy_media_01',
      index: true,
    },
    alertKey: {
      type: String,
      required: true,
      index: true,
    },
    brandId: {
      type: String,
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    severity: {
      type: String,
      enum: ['critical', 'warning', 'info'],
      default: 'warning',
    },
    metricAffected: {
      type: String,
      required: true,
    },
    currentValue: {
      type: String,
      required: true,
    },
    previousValue: {
      type: String,
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
    suggestedAction: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'resolved'],
      default: 'active',
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    resolvedAt: {
      type: Date,
      default: null,
    },
    resolvedBy: {
      type: String,
      default: null,
    },
    resolutionNotes: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

alertSchema.index({ agencyId: 1, alertKey: 1 }, { unique: true });

export const Alert = mongoose.models.Alert || mongoose.model('Alert', alertSchema);
export default Alert;
