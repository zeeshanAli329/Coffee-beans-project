const mongoose = require('mongoose');

module.exports = mongoose.model(
  'Blog',
  new mongoose.Schema(
    {
      title: { type: String, required: true, trim: true },
      slug: { type: String, required: true, unique: true, lowercase: true },
      excerpt: { type: String, default: '' },
      content: { type: String, required: true },
      image: { type: String, default: '' },
      author: { type: String, default: 'Bean Scene Team' },
      published: { type: Boolean, default: false, index: true },
    },
    { timestamps: true }
  )
);
