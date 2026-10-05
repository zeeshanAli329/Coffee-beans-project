const mongoose = require('mongoose');
const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');
const Contact = require('../models/Contact');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const { timezone } = require('../config/env');
const { resolveRange, fillDays } = require('../utils/dateRange');
const { round2, escapeRegex, paginate } = require('../utils/helpers');

const LIVE = { orderStatus: { $ne: 'cancelled' } }; // cancelled orders never count as revenue
const FORMAT = { day: '%Y-%m-%d', week: '%G-W%V', month: '%Y-%m', year: '%Y' };
const inRange = (r, extra = {}) => ({ createdAt: { $gte: r.start, $lt: r.end }, ...extra });
const sumGroup = { _id: null, revenue: { $sum: '$total' }, orders: { $sum: 1 } };
const totalsOf = (row) => ({ revenue: round2(row?.revenue || 0), orders: row?.orders || 0 });
const STATUSES = ['pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled'];

async function statusCounts(match) {
  const rows = await Order.aggregate([{ $match: match }, { $group: { _id: '$orderStatus', count: { $sum: 1 } } }]);
  const map = Object.fromEntries(STATUSES.map((s) => [s, 0]));
  rows.forEach((r) => { map[r._id] = r.count; });
  return map;
}

/* ---------- analytics ---------- */
exports.overview = asyncHandler(async (req, res) => {
  const range = resolveRange(req.query);
  const today = resolveRange({ range: 'today' });
  const [all, todayAgg, rangeAgg, statusAll, statusRange, customers, products] = await Promise.all([
    Order.aggregate([{ $match: LIVE }, { $group: sumGroup }]),
    Order.aggregate([{ $match: inRange(today, LIVE) }, { $group: sumGroup }]),
    Order.aggregate([{ $match: inRange(range, LIVE) }, { $group: sumGroup }]),
    statusCounts({}),
    statusCounts(inRange(range)),
    User.countDocuments({ role: 'customer' }),
    Product.countDocuments(),
  ]);
  const a = totalsOf(all[0]), t = totalsOf(todayAgg[0]), r = totalsOf(rangeAgg[0]);
  res.json({
    cards: {
      totalSales: a.revenue, totalOrders: await Order.countDocuments(),
      todaySales: t.revenue, todayOrders: await Order.countDocuments(inRange(today)),
      pendingOrders: statusAll.pending, completedOrders: statusAll.completed, cancelledOrders: statusAll.cancelled,
      totalCustomers: customers, totalProducts: products,
    },
    range: { ...r, averageOrderValue: r.orders ? round2(r.revenue / r.orders) : 0, from: range.start, to: range.end },
    statusDistribution: statusRange,
  });
});

exports.sales = asyncHandler(async (req, res) => {
  const range = resolveRange(req.query);
  const group = FORMAT[req.query.group] ? req.query.group : 'day';
  const [series, totals] = await Promise.all([
    Order.aggregate([
      { $match: inRange(range, LIVE) },
      { $group: { _id: { $dateToString: { format: FORMAT[group], date: '$createdAt', timezone } }, revenue: { $sum: '$total' }, orders: { $sum: 1 } } },
      { $sort: { _id: 1 } },
      { $project: { _id: 0, label: '$_id', revenue: { $round: ['$revenue', 2] }, orders: 1 } },
    ]),
    Order.aggregate([{ $match: inRange(range, LIVE) }, { $group: sumGroup }]),
  ]);
  const t = totalsOf(totals[0]);
  res.json({
    group,
    series: group === 'day' ? fillDays(series, range, { revenue: 0, orders: 0 }) : series,
    totals: { ...t, averageOrderValue: t.orders ? round2(t.revenue / t.orders) : 0 },
  });
});

exports.ordersAnalytics = asyncHandler(async (req, res) => {
  const range = resolveRange(req.query);
  const group = FORMAT[req.query.group] ? req.query.group : 'day';
  const [series, statusDistribution] = await Promise.all([
    Order.aggregate([
      { $match: inRange(range) },
      { $group: {
        _id: { $dateToString: { format: FORMAT[group], date: '$createdAt', timezone } },
        orders: { $sum: 1 },
        cancelled: { $sum: { $cond: [{ $eq: ['$orderStatus', 'cancelled'] }, 1, 0] } },
      } },
      { $sort: { _id: 1 } },
      { $project: { _id: 0, label: '$_id', orders: 1, cancelled: 1 } },
    ]),
    statusCounts(inRange(range)),
  ]);
  res.json({ group, series: group === 'day' ? fillDays(series, range, { orders: 0, cancelled: 0 }) : series, statusDistribution });
});

exports.productsAnalytics = asyncHandler(async (req, res) => {
  const range = resolveRange(req.query);
  const limit = Math.min(20, parseInt(req.query.limit, 10) || 10);
  const products = await Order.aggregate([
    { $match: inRange(range, LIVE) },
    { $unwind: '$items' },
    { $group: { _id: '$items.name', quantity: { $sum: '$items.quantity' }, revenue: { $sum: '$items.subtotal' } } },
    { $sort: { quantity: -1, revenue: -1 } },
    { $limit: limit },
    { $project: { _id: 0, name: '$_id', quantity: 1, revenue: { $round: ['$revenue', 2] } } },
  ]);
  res.json({ products });
});

exports.categoriesAnalytics = asyncHandler(async (req, res) => {
  const range = resolveRange(req.query);
  const categories = await Order.aggregate([
    { $match: inRange(range, LIVE) },
    { $unwind: '$items' },
    { $group: { _id: '$items.category', quantity: { $sum: '$items.quantity' }, revenue: { $sum: '$items.subtotal' } } },
    { $sort: { revenue: -1 } },
    { $project: { _id: 0, name: '$_id', quantity: 1, revenue: { $round: ['$revenue', 2] } } },
  ]);
  res.json({ categories });
});

exports.notifications = asyncHandler(async (_req, res) => {
  const [pendingOrders, unreadMessages, recent] = await Promise.all([
    Order.countDocuments({ orderStatus: 'pending' }),
    Contact.countDocuments({ isRead: false }),
    Order.find({ orderStatus: 'pending' }).sort({ createdAt: -1 }).limit(5).select('orderNumber customerName total createdAt'),
  ]);
  res.json({ pendingOrders, unreadMessages, recent });
});

/* ---------- customers ---------- */
exports.customers = asyncHandler(async (req, res) => {
  const { page, limit, skip } = paginate(req.query);
  const match = { role: 'customer' };
  if (req.query.search) {
    const rx = { $regex: escapeRegex(req.query.search), $options: 'i' };
    match.$or = [{ name: rx }, { email: rx }, { phone: rx }];
  }
  const [customers, total] = await Promise.all([
    User.aggregate([
      { $match: match },
      { $lookup: { from: 'orders', localField: '_id', foreignField: 'customer', as: 'orders' } },
      { $addFields: {
        ordersCount: { $size: '$orders' },
        totalSpent: { $sum: { $map: { input: { $filter: { input: '$orders', cond: { $ne: ['$$this.orderStatus', 'cancelled'] } } }, in: '$$this.total' } } },
        lastOrder: { $max: '$orders.createdAt' },
      } },
      { $project: { password: 0, orders: 0, __v: 0 } },
      { $sort: { createdAt: -1 } }, { $skip: skip }, { $limit: limit },
    ]),
    User.countDocuments(match),
  ]);
  res.json({ customers, total, page, pages: Math.max(1, Math.ceil(total / limit)) });
});

exports.customer = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) throw new ApiError(400, 'Invalid customer id.');
  const customer = await User.findOne({ _id: req.params.id, role: 'customer' });
  if (!customer) throw new ApiError(404, 'Customer not found.');
  const orders = await Order.find({ customer: customer._id }).sort({ createdAt: -1 });
  const totalSpent = round2(orders.filter((o) => o.orderStatus !== 'cancelled').reduce((s, o) => s + o.total, 0));
  res.json({ customer, orders, totalSpent });
});
