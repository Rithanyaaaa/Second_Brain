const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    content: { type: String, default: '' },
    tags: [{ type: String, trim: true, lowercase: true }],
    isPinned: { type: Boolean, default: false },
    color: { type: String, default: '#ffffff' },
  },
  { timestamps: true }
);

noteSchema.index({ title: 'text', content: 'text', tags: 'text' });

module.exports = mongoose.model('Note', noteSchema);
