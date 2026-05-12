const asyncHandler = require('express-async-handler');
const Note = require('../models/Note');
const Document = require('../models/Document');
const SavedPage = require('../models/SavedPage');

const globalSearch = asyncHandler(async (req, res) => {
  const { q, type } = req.query;
  if (!q) return res.json({ notes: [], documents: [], savedPages: [] });

  const userId = req.user._id;
  const textQuery = { $text: { $search: q } };
  const regexQuery = { $regex: q, $options: 'i' };

  const searchQuery = (extra = {}) => ({
    user: userId,
    ...extra,
    $or: [{ title: regexQuery }, { tags: regexQuery }],
  });

  const [notes, documents, savedPages] = await Promise.all([
    (!type || type === 'notes') ? Note.find(searchQuery({ $or: [{ title: regexQuery }, { content: regexQuery }, { tags: regexQuery }] })).limit(10) : [],
    (!type || type === 'documents') ? Document.find(searchQuery()).limit(10) : [],
    (!type || type === 'savedPages') ? SavedPage.find({ user: userId, $or: [{ title: regexQuery }, { description: regexQuery }, { tags: regexQuery }] }).limit(10) : [],
  ]);

  res.json({ notes, documents, savedPages });
});

module.exports = { globalSearch };
