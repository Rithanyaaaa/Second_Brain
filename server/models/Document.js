const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    originalName: { type: String, required: true },
    fileUrl: { type: String, required: true },
    publicId: { type: String, required: true },
    fileType: { type: String, required: true },
    fileSize: { type: Number, required: true },
    tags: [{ type: String, trim: true, lowercase: true }],
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

documentSchema.index({ title: 'text', tags: 'text', originalName: 'text' });

module.exports = mongoose.model('Document', documentSchema);
