const asyncHandler = require('express-async-handler');
const Note = require('../models/Note');

const getNotes = asyncHandler(async (req, res) => {
  const { search, tag, page = 1, limit = 20 } = req.query;
  const query = { user: req.user._id };

  if (search) query.$text = { $search: search };
  if (tag) query.tags = tag;

  const total = await Note.countDocuments(query);
  const notes = await Note.find(query)
    .sort({ isPinned: -1, updatedAt: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));

  res.json({ notes, total, page: Number(page), totalPages: Math.ceil(total / limit) });
});

const createNote = asyncHandler(async (req, res) => {
  const { title, content, tags, color } = req.body;
  if (!title) return res.status(400).json({ message: 'Title is required' });
  const note = await Note.create({ user: req.user._id, title, content, tags, color });
  res.status(201).json(note);
});

const updateNote = asyncHandler(async (req, res) => {
  const note = await Note.findOne({ _id: req.params.id, user: req.user._id });
  if (!note) return res.status(404).json({ message: 'Note not found' });

  Object.assign(note, req.body);
  const updated = await note.save();
  res.json(updated);
});

const deleteNote = asyncHandler(async (req, res) => {
  const note = await Note.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!note) return res.status(404).json({ message: 'Note not found' });
  res.json({ message: 'Note deleted' });
});

const togglePin = asyncHandler(async (req, res) => {
  const note = await Note.findOne({ _id: req.params.id, user: req.user._id });
  if (!note) return res.status(404).json({ message: 'Note not found' });
  note.isPinned = !note.isPinned;
  await note.save();
  res.json(note);
});

module.exports = { getNotes, createNote, updateNote, deleteNote, togglePin };
