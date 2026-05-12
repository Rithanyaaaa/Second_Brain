const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const { generateToken } = require('../utils/generateToken');

// @desc Register user
const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ message: 'Please fill all fields' });

  if (await User.findOne({ email }))
    return res.status(400).json({ message: 'User already exists' });

  const user = await User.create({ name, email, password });
  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    token: generateToken(user._id),
  });
});

// @desc Login user
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !(await user.matchPassword(password)))
    return res.status(401).json({ message: 'Invalid email or password' });

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    bio: user.bio,
    token: generateToken(user._id),
  });
});

// @desc Get current user profile
const getProfile = asyncHandler(async (req, res) => {
  res.json(req.user);
});

// @desc Update user profile
const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  user.name = req.body.name || user.name;
  user.bio = req.body.bio || user.bio;
  if (req.body.avatar) user.avatar = req.body.avatar;
  if (req.body.password) user.password = req.body.password;
  const updated = await user.save();
  res.json({ _id: updated._id, name: updated.name, email: updated.email, bio: updated.bio, avatar: updated.avatar });
});

module.exports = { register, login, getProfile, updateProfile };
