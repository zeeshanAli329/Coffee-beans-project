const mongoose = require('mongoose');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Setting = require('../models/Setting');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const { round2, digits, escapeRegex, generateOrderNumber, paginate } = require('../utils/helpers');
const { resolvePickup } = require('../services/pickup');

exports.create = asyncHandler(async (req, res) => {
  const d = req.body;
  const settings = await Setting.get();
  if (!settings.orders.acceptingOrders) throw new ApiError(503, 'We are not taking online orders right now. Please try again later.');

  const qty = new Map();
  d.items.forEach((i) => qty.set(i.productId, (qty.get(i.productId) || 0) + i.quantity));
  const ids = [...qty.keys()];
  if (!ids.every((id) => mongoose.isValidObjectId(id))) throw new ApiError(400, 'Your cart contains an invalid item. Please clear it and try again.');
  const products = await Product.find({ _id: { $in: ids } });
  if (products.length !== ids.length) throw new ApiError(400, 'Some items in your cart are no longer on the menu.');
  const unavailable = products.filter((p) => !p.isAvailable);
  if (unavailable.length) throw new ApiError(400, `Currently unavailable: ${unavailable.map((p) => p.name).join(', ')}`);

  // Prices always come from the database, never from the client.
  const items = products.map((p) => {
    const quantity = qty.get(String(p._id));
    return { product: p._id, name: p.name, price: p.price, quantity, subtotal: round2(p.price * quantity), category: p.category, image: p.image };
  });
  const count = items.reduce((s, i) => s + i.quantity, 0);
  if (count > settings.orders.maxItemsPerOrder) throw new ApiError(400, `Orders are limited to ${settings.orders.maxItemsPerOrder} items.`);
  const subtotal = round2(items.reduce((s, i) => s + i.subtotal, 0));
  if (subtotal < settings.orders.minOrderTotal) throw new ApiError(400, `Minimum order is ${settings.currencySymbol}${settings.orders.minOrderTotal}.`);

  const pickupTime = resolvePickup(d, settings);
  let order;
  for (let attempt = 0; attempt < 5 && !order; attempt++) {
    try {
      order = await Order.create({
        orderNumber: generateOrderNumber(),
        customer: req.user ? req.user._id : null,
        customerName: d.customerName, phone: d.phone, email: d.email,
        items, subtotal, total: subtotal,
        paymentMethod: 'cash', paymentStatus: 'pending', orderStatus: 'pending',
        pickupOption: d.pickupOption, pickupTime, notes: d.notes,
        statusHistory: [{ status: 'pending' }],
      });
    } catch (e) {
      if (!(e.code === 11000 && e.keyPattern?.orderNumber)) throw e; // retry only on order-number collision
    }
  }
  if (!order) throw new ApiError(500, 'Could not generate an order number. Please try again.');
  res.status(201).json({ order });
});

exports.mine = asyncHandler(async (req, res) => {
  const orders = await Order.find({ customer: req.user._id }).sort({ createdAt: -1 });
  res.json({ orders });
});

exports.getMine = asyncHandler(async (req, res) => {
  const order = await Order.findOne({ _id: req.params.id, customer: req.user._id });
  if (!order) throw new ApiError(404, 'Order not found.');
  res.json({ order });
});

// Confirmation page: owner, admin, or guest who knows the phone number used at checkout.
exports.track = asyncHandler(async (req, res) => {
  const order = await Order.findOne({ orderNumber: String(req.params.orderNumber).toUpperCase() });
  if (!order) throw new ApiError(404, 'Order not found.');
  const owner = req.user && order.customer && String(order.customer) === String(req.user._id);
  const admin = req.user?.role === 'admin';
  const phoneOk = req.query.phone && digits(req.query.phone) === digits(order.phone);
  if (!(owner || admin || phoneOk)) throw new ApiError(403, 'Sign in or provide the phone number used for this order.');
  res.json({ order });
});

/* ---------------- admin ---------------- */
const NEXT = { pending: 'confirmed', confirmed: 'preparing', preparing: 'ready', ready: 'completed' };

exports.adminList = asyncHandler(async (req, res) => {
  const { page, limit, skip } = paginate(req.query);
  const filter = {};
  if (req.query.status && req.query.status !== 'all') filter.orderStatus = String(req.query.status);
  if (req.query.search) {
    const rx = { $regex: escapeRegex(req.query.search), $options: 'i' };
    filter.$or = [{ orderNumber: rx }, { customerName: rx }, { phone: rx }, { email: rx }];
  }
  const [orders, total] = await Promise.all([
    Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Order.countDocuments(filter),
  ]);
  res.json({ orders, total, page, pages: Math.max(1, Math.ceil(total / limit)) });
});

exports.adminGet = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) throw new ApiError(404, 'Order not found.');
  res.json({ order });
});

exports.updateStatus = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) throw new ApiError(404, 'Order not found.');
  const { status } = req.body;
  const cur = order.orderStatus;
  if (['completed', 'cancelled'].includes(cur)) throw new ApiError(400, `This order is already ${cur}.`);
  if (status === 'cancelled') {
    if (order.paymentStatus === 'paid') order.paymentStatus = 'refunded';
  } else if (NEXT[cur] !== status) {
    throw new ApiError(400, `An order that is ${cur} can only move to "${NEXT[cur]}" or be cancelled.`);
  }
  if (status === 'completed') order.paymentStatus = 'paid'; // cash collected at pickup
  order.orderStatus = status;
  order.statusHistory.push({ status });
  await order.save();
  res.json({ order });
});
