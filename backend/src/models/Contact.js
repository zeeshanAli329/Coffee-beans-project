const mongoose = require('mongoose');

module.exports = mongoose.model(
  'Contact',
  new mongoose.Schema(
    {
      name: { type: String, required: true, trim: true },
      email: { type: String, required: true, lowercase: true, trim: true },
      phone: { type: String, default: '' },
      message: { type: String, required: true },
      type: { type: String, enum: ['contact', 'newsletter'], default: 'contact', index: true },
      isRead: { type: Boolean, default: false, index: true },
    },
    { timestamps: true }
  )
);
