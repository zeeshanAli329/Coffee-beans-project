/* Idempotent seed: node src/seed.js [--reset-admin]
   - creates the admin from ADMIN_EMAIL / ADMIN_PASSWORD (never overwrites an existing password unless --reset-admin)
   - inserts starter products/categories/blogs/settings only if they do not exist (admin edits are never overwritten) */
const mongoose = require('mongoose');
const { adminEmail, adminPassword } = require('./config/env');
const connectDB = require('./config/db');
const User = require('./models/User');
const Product = require('./models/Product');
const Category = require('./models/Category');
const Blog = require('./models/Blog');
const Setting = require('./models/Setting');

// NOTE: The live site's menu cards could not be read automatically, so these are editable placeholders.
// Edit names, prices and images from Admin → Products.
const IMG = process.env.SEED_IMAGE_BASE || '';
const products = [
  ['Cappuccino', 'Rich espresso with silky steamed milk and a velvety foam cap.', 3.5, 'Hot Coffee', 4.9],
  ['Espresso', 'A bold, concentrated shot with golden crema from supreme beans.', 2.5, 'Hot Coffee', 4.8],
  ['Macchiato', 'Espresso stained with a dollop of foamed milk.', 3.0, 'Hot Coffee', 4.7],
  ['Latte', 'Smooth espresso blended with plenty of steamed milk.', 3.8, 'Hot Coffee', 4.8],
  ['Americano', 'Espresso lengthened with hot water for a clean, classic cup.', 3.0, 'Hot Coffee', 4.5],
  ['Flat White', 'Double ristretto with micro-foam milk, strong and silky.', 3.9, 'Hot Coffee', 4.7],
  ['Chai Latte', 'Spiced black tea with steamed milk, perfectly warming.', 3.6, 'Tea & Specials', 4.9],
  ['Matcha Latte', 'Ceremonial-grade matcha whisked with steamed milk.', 4.2, 'Tea & Specials', 4.6],
  ['Iced Latte', 'Chilled espresso and cold milk over ice.', 4.0, 'Cold Drinks', 4.7],
  ['Cold Brew', 'Steeped for 18 hours; smooth, low acidity and naturally sweet.', 4.2, 'Cold Drinks', 4.8],
  ['Butter Croissant', 'Flaky, golden and baked fresh every morning.', 2.8, 'Bakery', 4.7],
  ['Blueberry Muffin', 'Soft muffin packed with juicy blueberries.', 2.9, 'Bakery', 4.5],
];

const blogs = [
  ['Our beans, from farm to cup', 'How we source and roast our supreme beans in small batches.', 'At Bean Scene we work directly with growers who care about flavour as much as we do. Every batch is roasted in small quantities so each cup tastes fresh, balanced and full of character.\n\nWe taste every lot before it reaches the counter, and we adjust our roast profile to bring out chocolate, caramel and nutty notes.'],
  ['How to order ahead and skip the line', 'Order online, pick a time, and your coffee is waiting.', 'Ordering ahead is easy: choose your drinks, pick a pickup time and place the order. Pay at the counter when you collect. We will confirm your order and mark it ready as soon as it is made.'],
  ['Five tips for a better home espresso', 'Small changes that make a big difference.', 'Use fresh beans, grind just before brewing, weigh your dose, keep your equipment clean and taste as you go. Consistency is the secret to a great shot.'],
];

(async () => {
  await connectDB();

  // Admin
  if (!adminPassword || adminPassword.length < 8) {
    console.error('ADMIN_PASSWORD must be set in .env (min 8 characters) to create the admin account.');
    process.exit(1);
  }
  let admin = await User.findOne({ email: adminEmail });
  if (!admin) {
    await User.create({ name: 'Bean Scene Admin', email: adminEmail, password: adminPassword, role: 'admin' });
    console.log(`✔ Admin created: ${adminEmail}`);
  } else {
    if (admin.role !== 'admin') { admin.role = 'admin'; await admin.save(); console.log('✔ Existing user promoted to admin'); }
    if (process.argv.includes('--reset-admin')) {
      admin = await User.findById(admin._id).select('+password');
      admin.password = adminPassword;
      await admin.save();
      console.log('✔ Admin password reset from ADMIN_PASSWORD');
    } else console.log(`• Admin already exists: ${adminEmail}`);
  }

  // Settings, categories, products, blogs (insert-if-missing)
  await Setting.get();
  for (const name of [...new Set(products.map((p) => p[3]))]) {
    await Category.updateOne({ name }, { $setOnInsert: { name, slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-') } }, { upsert: true });
  }
  let added = 0;
  for (const [name, description, price, category, rating] of products) {
    const r = await Product.updateOne({ name }, { $setOnInsert: { name, description, price, category, rating, image: IMG ? `${IMG}/${name.toLowerCase().replace(/\s+/g, '-')}.jpg` : '', isAvailable: true } }, { upsert: true });
    if (r.upsertedCount) added++;
  }
  console.log(`✔ Products: ${added} added, ${products.length - added} already present`);
  for (const [title, excerpt, content] of blogs) {
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    await Blog.updateOne({ slug }, { $setOnInsert: { title, slug, excerpt, content, published: true, author: 'Bean Scene Team' } }, { upsert: true });
  }
  console.log('✔ Blog posts ready');
  await mongoose.disconnect();
})().catch((e) => { console.error(e); process.exit(1); });
