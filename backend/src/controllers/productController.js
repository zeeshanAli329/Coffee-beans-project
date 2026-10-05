const Product = require('../models/Product');
const Category = require('../models/Category');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const { escapeRegex } = require('../utils/helpers');

const ensureCategory = (name) => Category.updateOne({ name }, { $setOnInsert: { name, slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-') } }, { upsert: true });

exports.list = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.category) filter.category = String(req.query.category);
  if (req.query.available === 'true') filter.isAvailable = true;
  if (req.query.q) filter.name = { $regex: escapeRegex(req.query.q), $options: 'i' };
  const products = await Product.find(filter).sort({ category: 1, name: 1 });
  res.json({ products });
});

exports.get = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) throw new ApiError(404, 'Product not found.');
  res.json({ product });
});

exports.create = asyncHandler(async (req, res) => {
  const product = await Product.create(req.body);
  await ensureCategory(product.category);
  res.status(201).json({ product });
});

exports.update = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!product) throw new ApiError(404, 'Product not found.');
  await ensureCategory(product.category);
  res.json({ product });
});

exports.remove = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) throw new ApiError(404, 'Product not found.');
  res.json({ message: 'Product deleted.' });
});

exports.listCategories = asyncHandler(async (_req, res) => {
  const [categories, used] = await Promise.all([Category.find().sort({ name: 1 }), Product.distinct('category')]);
  const names = new Set(categories.map((c) => c.name));
  used.forEach((n) => names.add(n));
  res.json({ categories: [...names].sort() });
});

exports.createCategory = asyncHandler(async (req, res) => {
  const category = await Category.create({ name: req.body.name });
  res.status(201).json({ category });
});

exports.removeCategory = asyncHandler(async (req, res) => {
  const cat = await Category.findById(req.params.id);
  if (!cat) throw new ApiError(404, 'Category not found.');
  if (await Product.exists({ category: cat.name })) throw new ApiError(400, 'Move or delete the products in this category first.');
  await cat.deleteOne();
  res.json({ message: 'Category deleted.' });
});
