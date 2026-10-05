const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const { signToken } = require('../services/tokens');

const BAD = 'Invalid email or password.';

exports.register = asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body;
  if (await User.exists({ email })) throw new ApiError(409, 'An account with this email already exists.');
  const user = await User.create({ name, email, password, phone: phone || '', role: 'customer' }); // role is never taken from input
  res.status(201).json({ token: signToken(user), user });
});

exports.login = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email }).select('+password');
  if (!user || !(await user.comparePassword(req.body.password))) throw new ApiError(401, BAD);
  if (user.role === 'admin') throw new ApiError(403, 'Administrators must sign in at /admin/login.');
  res.json({ token: signToken(user), user });
});

exports.adminLogin = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email }).select('+password');
  if (!user || user.role !== 'admin' || !(await user.comparePassword(req.body.password))) throw new ApiError(401, BAD);
  res.json({ token: signToken(user), user });
});

exports.me = (req, res) => res.json({ user: req.user });

exports.updateProfile = asyncHandler(async (req, res) => {
  const { name, phone, currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id).select('+password');
  if (name) user.name = name;
  if (phone !== undefined) user.phone = phone;
  if (newPassword) {
    if (!currentPassword || !(await user.comparePassword(currentPassword))) throw new ApiError(400, 'Current password is incorrect.');
    user.password = newPassword;
  }
  await user.save();
  res.json({ user });
});
