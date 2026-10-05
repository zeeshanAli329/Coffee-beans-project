const crypto = require('crypto');
const Blog = require('../models/Blog');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const { slugify } = require('../utils/helpers');

async function uniqueSlug(base, exceptId) {
  let slug = slugify(base);
  while (await Blog.exists({ slug, ...(exceptId ? { _id: { $ne: exceptId } } : {}) })) {
    slug = `${slugify(base)}-${crypto.randomBytes(2).toString('hex')}`;
  }
  return slug;
}

exports.listPublic = asyncHandler(async (_req, res) => {
  res.json({ blogs: await Blog.find({ published: true }).select('-content').sort({ createdAt: -1 }) });
});
exports.getPublic = asyncHandler(async (req, res) => {
  const blog = await Blog.findOne({ slug: req.params.slug, published: true });
  if (!blog) throw new ApiError(404, 'Article not found.');
  res.json({ blog });
});
exports.listAdmin = asyncHandler(async (_req, res) => {
  res.json({ blogs: await Blog.find().select('-content').sort({ createdAt: -1 }) });
});
exports.getAdmin = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) throw new ApiError(404, 'Article not found.');
  res.json({ blog });
});
exports.create = asyncHandler(async (req, res) => {
  const slug = await uniqueSlug(req.body.slug || req.body.title);
  res.status(201).json({ blog: await Blog.create({ ...req.body, slug }) });
});
exports.update = asyncHandler(async (req, res) => {
  const slug = await uniqueSlug(req.body.slug || req.body.title, req.params.id);
  const blog = await Blog.findByIdAndUpdate(req.params.id, { ...req.body, slug }, { new: true, runValidators: true });
  if (!blog) throw new ApiError(404, 'Article not found.');
  res.json({ blog });
});
exports.togglePublish = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) throw new ApiError(404, 'Article not found.');
  blog.published = !blog.published;
  await blog.save();
  res.json({ blog });
});
exports.remove = asyncHandler(async (req, res) => {
  const blog = await Blog.findByIdAndDelete(req.params.id);
  if (!blog) throw new ApiError(404, 'Article not found.');
  res.json({ message: 'Article deleted.' });
});
