const { z } = require('zod');

const email = z.string().trim().toLowerCase().email('Enter a valid email address');
const phone = z.string().trim().max(30).optional().or(z.literal(''));
const bool = z.preprocess((v) => (v === 'true' ? true : v === 'false' ? false : v), z.boolean());

exports.register = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(80),
  email,
  password: z.string().min(8, 'Password must be at least 8 characters').max(100),
  phone,
});
exports.login = z.object({ email, password: z.string().min(1, 'Password is required') });
exports.profile = z.object({
  name: z.string().trim().min(2).max(80).optional(),
  phone,
  currentPassword: z.string().optional(),
  newPassword: z.string().min(8, 'New password must be at least 8 characters').max(100).optional(),
});
exports.product = z.object({
  name: z.string().trim().min(2, 'Name is required').max(100),
  description: z.string().trim().max(600).default(''),
  price: z.coerce.number().min(0, 'Price must be 0 or more').max(100000),
  category: z.string().trim().min(2, 'Category is required').max(60),
  image: z.string().trim().max(500).default(''),
  rating: z.coerce.number().min(0).max(5).default(4.5),
  isAvailable: bool.default(true),
});
exports.order = z.object({
  customerName: z.string().trim().min(2, 'Full name is required').max(80),
  phone: z.string().trim().min(7, 'Enter a valid phone number').max(30),
  email,
  pickupOption: z.enum(['asap', '15', '30', '60', 'custom']).default('asap'),
  pickupTime: z.string().optional(),
  notes: z.string().trim().max(500).default(''),
  paymentMethod: z.enum(['cash']).default('cash'),
  items: z.array(z.object({ productId: z.string(), quantity: z.coerce.number().int().min(1).max(50) })).min(1, 'Your cart is empty').max(50),
});
exports.orderStatus = z.object({ status: z.enum(['confirmed', 'preparing', 'ready', 'completed', 'cancelled']) });
exports.contact = z.object({
  name: z.string().trim().min(2, 'Name is required').max(80).default('Newsletter subscriber'),
  email,
  phone,
  message: z.string().trim().min(5, 'Message must be at least 5 characters').max(2000).default('Newsletter subscription'),
  type: z.enum(['contact', 'newsletter']).default('contact'),
  website: z.string().optional(), // honeypot
});
exports.blog = z.object({
  title: z.string().trim().min(3, 'Title is required').max(150),
  slug: z.string().trim().max(100).optional(),
  excerpt: z.string().trim().max(400).default(''),
  content: z.string().trim().min(10, 'Content is required'),
  image: z.string().trim().max(500).default(''),
  author: z.string().trim().max(80).default('Bean Scene Team'),
  published: bool.default(false),
});
exports.category = z.object({ name: z.string().trim().min(2).max(60) });
exports.settings = z.object({
  shopName: z.string().trim().min(1).max(80),
  email,
  phone: z.string().trim().max(30),
  address: z.string().trim().max(300),
  website: z.string().trim().max(100).optional(),
  openingHours: z.string().trim().max(300),
  currency: z.string().trim().length(3).toUpperCase(),
  currencySymbol: z.string().trim().min(1).max(4),
  pickup: z.object({ minLeadMinutes: z.coerce.number().int().min(0).max(240), maxDaysAhead: z.coerce.number().int().min(0).max(30) }),
  orders: z.object({
    acceptingOrders: bool,
    maxItemsPerOrder: z.coerce.number().int().min(1).max(200),
    minOrderTotal: z.coerce.number().min(0),
  }),
});
