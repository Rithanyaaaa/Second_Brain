const mongoose = require('mongoose');

const savedPageSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    url: { type: String, required: true },
    description: { type: String, default: '' },
    thumbnail: { type: String, default: '' },
    tags: [{ type: String, trim: true, lowercase: true }],
    folder: { type: String, default: 'General', trim: true },
    favicon: { type: String, default: '' },
  },
  { timestamps: true }
);

savedPageSchema.index({ title: 'text', description: 'text', tags: 'text', url: 'text' });

module.exports = mongoose.model('SavedPage', savedPageSchema);
