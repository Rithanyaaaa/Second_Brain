const router = require('express').Router();
const asyncHandler = require('express-async-handler');
const Note = require('../models/Note');
const Document = require('../models/Document');
const SavedPage = require('../models/SavedPage');
const { protect } = require('../middleware/auth');

// Get all unique tags for the user
router.get('/', protect, asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const [noteTags, docTags, pageTags] = await Promise.all([
    Note.distinct('tags', { user: userId }),
    Document.distinct('tags', { user: userId }),
    SavedPage.distinct('tags', { user: userId }),
  ]);
  const allTags = [...new Set([...noteTags, ...docTags, ...pageTags])].filter(Boolean);
  res.json(allTags);
}));

module.exports = router;
