const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    description: { type: String, default: '' },
    price: { type: Number, required: true, min: 0 },
    category: { type: String, required: true, trim: true, index: true },
    image: { type: String, default: '' },
    rating: { type: Number, min: 0, max: 5, default: 4.5 },
    isAvailable: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);
module.exports = mongoose.model('Product', productSchema);
