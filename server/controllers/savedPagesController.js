const asyncHandler = require('express-async-handler');
const SavedPage = require('../models/SavedPage');

const getSavedPages = asyncHandler(async (req, res) => {
  const { search, tag, folder, page = 1, limit = 20 } = req.query;
  const query = { user: req.user._id };
  if (search) query.$text = { $search: search };
  if (tag) query.tags = tag;
  if (folder) query.folder = folder;

  const total = await SavedPage.countDocuments(query);
  const pages = await SavedPage.find(query)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));

  res.json({ pages, total, page: Number(page), totalPages: Math.ceil(total / limit) });
});

const createSavedPage = asyncHandler(async (req, res) => {
  const { title, url, description, thumbnail, tags, folder, favicon } = req.body;
  if (!title || !url) return res.status(400).json({ message: 'Title and URL are required' });

  const saved = await SavedPage.create({
    user: req.user._id, title, url, description, thumbnail, tags, folder, favicon,
  });
  res.status(201).json(saved);
});

const updateSavedPage = asyncHandler(async (req, res) => {
  const page = await SavedPage.findOne({ _id: req.params.id, user: req.user._id });
  if (!page) return res.status(404).json({ message: 'Saved page not found' });
  Object.assign(page, req.body);
  await page.save();
  res.json(page);
});

const deleteSavedPage = asyncHandler(async (req, res) => {
  const page = await SavedPage.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!page) return res.status(404).json({ message: 'Saved page not found' });
  res.json({ message: 'Saved page deleted' });
});

const getFolders = asyncHandler(async (req, res) => {
  const folders = await SavedPage.distinct('folder', { user: req.user._id });
  res.json(folders);
});

module.exports = { getSavedPages, createSavedPage, updateSavedPage, deleteSavedPage, getFolders };
