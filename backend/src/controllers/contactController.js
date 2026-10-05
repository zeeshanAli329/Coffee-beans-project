const Contact = require('../models/Contact');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const { paginate } = require('../utils/helpers');

exports.create = asyncHandler(async (req, res) => {
  const { website, ...data } = req.body;
  if (!website) await Contact.create(data); // honeypot: bots fill "website", pretend success without saving
  res.status(201).json({ message: data.type === 'newsletter' ? 'Thanks for subscribing!' : 'Thanks! We received your message and will get back to you soon.' });
});

exports.list = asyncHandler(async (req, res) => {
  const { page, limit, skip } = paginate(req.query);
  const filter = req.query.type ? { type: String(req.query.type) } : {};
  const [contacts, total] = await Promise.all([
    Contact.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Contact.countDocuments(filter),
  ]);
  res.json({ contacts, total, page, pages: Math.max(1, Math.ceil(total / limit)) });
});

exports.toggleRead = asyncHandler(async (req, res) => {
  const c = await Contact.findById(req.params.id);
  if (!c) throw new ApiError(404, 'Message not found.');
  c.isRead = !c.isRead;
  await c.save();
  res.json({ contact: c });
});

exports.remove = asyncHandler(async (req, res) => {
  const c = await Contact.findByIdAndDelete(req.params.id);
  if (!c) throw new ApiError(404, 'Message not found.');
  res.json({ message: 'Deleted.' });
});
