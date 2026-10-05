/* OPTIONAL development helper: node src/seed-demo.js [--clear]
   Creates demo customers + ~120 historical orders (notes = "[DEMO]") so you can see the charts working.
   These are normal MongoDB documents; --clear removes only the demo data. Do NOT run in production. */
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const User = require('./models/User');
const Product = require('./models/Product');
const Order = require('./models/Order');
const { generateOrderNumber, round2 } = require('./utils/helpers');

(async () => {
  await connectDB();
  if (process.argv.includes('--clear')) {
    const o = await Order.deleteMany({ notes: '[DEMO]' });
    const u = await User.deleteMany({ email: /@demo\.beanscene$/ });
    console.log(`Removed ${o.deletedCount} demo orders and ${u.deletedCount} demo customers`);
    return mongoose.disconnect();
  }
  const products = await Product.find({ isAvailable: true });
  if (!products.length) { console.error('Run "npm run seed" first.'); process.exit(1); }
  const customers = [];
  for (const n of ['Aisha Khan', 'Rohan Mehta', 'Sara Lee', 'Daniel Cruz', 'Meera Nair']) {
    const email = `${n.split(' ')[0].toLowerCase()}@demo.beanscene`;
    customers.push((await User.findOne({ email })) || (await User.create({ name: n, email, password: 'demo-password-123', phone: '555010' + Math.floor(Math.random() * 9000 + 1000) })));
  }
  const statuses = ['completed', 'completed', 'completed', 'completed', 'ready', 'preparing', 'cancelled', 'pending'];
  let made = 0;
  for (let i = 0; i < 120; i++) {
    const c = customers[Math.floor(Math.random() * customers.length)];
    const when = new Date(Date.now() - Math.floor(Math.random() * 45 * 86400000));
    const items = Array.from({ length: 1 + Math.floor(Math.random() * 3) }, () => {
      const p = products[Math.floor(Math.random() * products.length)];
      const quantity = 1 + Math.floor(Math.random() * 3);
      return { product: p._id, name: p.name, price: p.price, quantity, subtotal: round2(p.price * quantity), category: p.category, image: p.image };
    });
    const total = round2(items.reduce((s, x) => s + x.subtotal, 0));
    const st = statuses[Math.floor(Math.random() * statuses.length)];
    await Order.collection.insertOne({
      orderNumber: generateOrderNumber(), customer: c._id, customerName: c.name, phone: c.phone, email: c.email,
      items, subtotal: total, total, paymentMethod: 'cash', paymentStatus: st === 'completed' ? 'paid' : 'pending',
      orderStatus: st, pickupOption: 'asap', pickupTime: new Date(+when + 900000), notes: '[DEMO]',
      statusHistory: [{ status: st, at: when }], createdAt: when, updatedAt: when,
    });
    made++;
  }
  console.log(`Created ${made} demo orders for ${customers.length} demo customers`);
  await mongoose.disconnect();
})().catch((e) => { console.error(e); process.exit(1); });
