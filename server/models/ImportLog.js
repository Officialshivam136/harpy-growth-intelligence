import mongoose from 'mongoose';

const importLogSchema = new mongoose.Schema(
  {
    agencyId: {
      type: String,
      required: true,
      default: 'agency_harpy_media_01',
      index: true,
    },
    importType: {
      type: String,
      required: true,
      enum: ['sales', 'products', 'campaigns', 'costs'],
    },
    fileName: {
      type: String,
      required: true,
    },
    fileHash: {
      type: String,
      required: true,
      index: true,
    },
    totalRows: {
      type: Number,
      required: true,
    },
    importedCount: {
      type: Number,
      required: true,
    },
    updatedCount: {
      type: Number,
      default: 0,
    },
    validationErrors: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ['Completed', 'Completed with Warnings', 'Failed'],
      default: 'Completed',
    },
    importedBy: {
      type: String,
      default: 'J. Davenport',
    },
  },
  {
    timestamps: true,
  }
);

importLogSchema.index({ agencyId: 1, fileHash: 1 });

export const ImportLog = mongoose.models.ImportLog || mongoose.model('ImportLog', importLogSchema);
export default ImportLog;
