const asyncHandler = require('express-async-handler');
const Document = require('../models/Document');

const getDocuments = asyncHandler(async (req, res) => {
  const { search, tag, page = 1, limit = 20 } = req.query;
  const query = { user: req.user._id };
  if (search) query.$text = { $search: search };
  if (tag) query.tags = tag;

  const total = await Document.countDocuments(query);
  const documents = await Document.find(query)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));

  res.json({ documents, total, page: Number(page), totalPages: Math.ceil(total / limit) });
});

const getDocument = asyncHandler(async (req, res) => {
  const doc = await Document.findOne({ _id: req.params.id, user: req.user._id });
  if (!doc) return res.status(404).json({ message: 'Document not found' });
  res.json(doc);
});

// Stream file download for locally stored files
const downloadDocument = asyncHandler(async (req, res) => {
  const jwt = require('jsonwebtoken');
  const token = req.query.token || req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Not authorized' });

  let userId;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    userId = decoded.id;
  } catch {
    return res.status(401).json({ message: 'Invalid token' });
  }

  const doc = await Document.findOne({ _id: req.params.id, user: userId });
  if (!doc) return res.status(404).json({ message: 'Document not found' });

  const path = require('path');
  const fs = require('fs');
  const filePath = path.join(__dirname, '../uploads', doc.publicId);
  if (!fs.existsSync(filePath)) return res.status(404).json({ message: 'File not found on disk' });

  res.setHeader('Content-Disposition', `attachment; filename="${doc.originalName}"`);
  res.setHeader('Content-Type', doc.fileType);
  fs.createReadStream(filePath).pipe(res);
});

// Serve file inline (for open in browser)
const viewDocument = asyncHandler(async (req, res) => {
  // Accept token from query string (needed for window.open which can't set headers)
  const jwt = require('jsonwebtoken');
  const User = require('../models/User');
  const token = req.query.token || req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Not authorized' });

  let userId;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    userId = decoded.id;
  } catch {
    return res.status(401).json({ message: 'Invalid token' });
  }

  const doc = await Document.findOne({ _id: req.params.id, user: userId });
  if (!doc) return res.status(404).json({ message: 'Document not found' });

  const path = require('path');
  const fs = require('fs');
  const filePath = path.join(__dirname, '../uploads', doc.publicId);
  if (!fs.existsSync(filePath)) return res.status(404).json({ message: 'File not found on disk' });

  res.setHeader('Content-Disposition', `inline; filename="${doc.originalName}"`);
  res.setHeader('Content-Type', doc.fileType);
  fs.createReadStream(filePath).pipe(res);
});

const uploadDocument = asyncHandler(async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

  const { title, tags, notes } = req.body;

  // Build a proper accessible URL regardless of storage type
  const isCloudinary = !!(req.file.path && req.file.path.startsWith('http'));
  const fileUrl = isCloudinary
    ? req.file.path
    : `http://localhost:${process.env.PORT || 5000}/uploads/${req.file.filename}`;

  const doc = await Document.create({
    user: req.user._id,
    title: title || req.file.originalname,
    originalName: req.file.originalname,
    fileUrl,
    publicId: req.file.filename || req.file.path,
    fileType: req.file.mimetype,
    fileSize: req.file.size || 0,
    tags: tags ? tags.split(',').map((t) => t.trim()) : [],
    notes,
  });
  res.status(201).json(doc);
});

const updateDocument = asyncHandler(async (req, res) => {
  const doc = await Document.findOne({ _id: req.params.id, user: req.user._id });
  if (!doc) return res.status(404).json({ message: 'Document not found' });
  const { title, tags, notes } = req.body;
  if (title) doc.title = title;
  if (tags) doc.tags = tags.split(',').map((t) => t.trim());
  if (notes !== undefined) doc.notes = notes;
  await doc.save();
  res.json(doc);
});

const deleteDocument = asyncHandler(async (req, res) => {
  const doc = await Document.findOne({ _id: req.params.id, user: req.user._id });
  if (!doc) return res.status(404).json({ message: 'Document not found' });

  // Delete from Cloudinary only if it's a Cloudinary file
  const isCloudinary = doc.fileUrl.includes('cloudinary.com');
  if (isCloudinary) {
    try {
      const { cloudinary } = require('../utils/cloudinary');
      await cloudinary.uploader.destroy(doc.publicId, { resource_type: 'raw' });
    } catch { /* ignore cloudinary errors */ }
  } else {
    // Delete local file
    const path = require('path');
    const fs = require('fs');
    const filePath = path.join(__dirname, '../uploads', doc.publicId);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  }

  await doc.deleteOne();
  res.json({ message: 'Document deleted' });
});

module.exports = { getDocuments, getDocument, viewDocument, downloadDocument, uploadDocument, updateDocument, deleteDocument };
