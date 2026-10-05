const mongoose = require('mongoose');
const { slugify } = require('../utils/helpers');

const categorySchema = new mongoose.Schema(
  { name: { type: String, required: true, unique: true, trim: true }, slug: { type: String, unique: true } },
  { timestamps: true }
);
categorySchema.pre('validate', function () {
  if (this.name) this.slug = slugify(this.name);
});
module.exports = mongoose.model('Category', categorySchema);
