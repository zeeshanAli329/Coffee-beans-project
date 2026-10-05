const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
    subtotal: { type: Number, required: true },
    category: { type: String, default: 'Uncategorized' }, // snapshot, used for category analytics
    image: { type: String, default: '' },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, required: true, unique: true },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null, index: true }, // null = guest
    customerName: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    items: { type: [itemSchema], validate: (v) => v.length > 0 },
    subtotal: { type: Number, required: true },
    total: { type: Number, required: true },
    // Gateway-ready: add 'card' / 'stripe' later and set paymentStatus from a webhook.
    paymentMethod: { type: String, enum: ['cash'], default: 'cash' },
    paymentStatus: { type: String, enum: ['pending', 'paid', 'failed', 'refunded'], default: 'pending' },
    orderStatus: {
      type: String,
      enum: ['pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled'],
      default: 'pending',
      index: true,
    },
    pickupOption: { type: String, default: 'asap' },
    pickupTime: { type: Date, required: true },
    notes: { type: String, default: '' },
    statusHistory: [{ status: String, at: { type: Date, default: Date.now }, _id: false }],
  },
  { timestamps: true }
);
orderSchema.index({ createdAt: -1 });
module.exports = mongoose.model('Order', orderSchema);
