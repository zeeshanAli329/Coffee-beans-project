const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema(
  {
    key: { type: String, default: 'main', unique: true },
    shopName: { type: String, default: 'Bean Scene' },
    email: { type: String, default: 'beanscene@mail.com' },
    phone: { type: String, default: '+1 202-918-2132' },
    address: { type: String, default: 'Akshya Nagar 1st Block 1st Cross, Rammurthy Nagar, Bangalore-560016' },
    website: { type: String, default: 'www.beanscene.com' },
    openingHours: { type: String, default: 'Mon-Fri 7:00 AM - 8:00 PM, Sat-Sun 8:00 AM - 9:00 PM' },
    currency: { type: String, default: 'USD' },
    currencySymbol: { type: String, default: '$' },
    pickup: {
      minLeadMinutes: { type: Number, default: 10 },
      maxDaysAhead: { type: Number, default: 2 },
    },
    orders: {
      acceptingOrders: { type: Boolean, default: true },
      maxItemsPerOrder: { type: Number, default: 50 },
      minOrderTotal: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);
settingSchema.statics.get = function () {
  return this.findOneAndUpdate({ key: 'main' }, { $setOnInsert: { key: 'main' } }, { upsert: true, new: true, setDefaultsOnInsert: true });
};
module.exports = mongoose.model('Setting', settingSchema);
