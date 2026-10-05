const express = require('express');
const rateLimit = require('express-rate-limit');
const { protect, optionalAuth, adminOnly } = require('../middleware/auth');
const validate = require('../middleware/validate');
const s = require('../utils/schemas');
const auth = require('../controllers/authController');
const products = require('../controllers/productController');
const orders = require('../controllers/orderController');
const contact = require('../controllers/contactController');
const blogs = require('../controllers/blogController');
const settings = require('../controllers/settingsController');
const admin = require('../controllers/adminController');

const router = express.Router();
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 30, standardHeaders: true, legacyHeaders: false, message: { message: 'Too many attempts. Please try again in a few minutes.' } });
const formLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 20, standardHeaders: true, legacyHeaders: false, message: { message: 'Too many submissions. Please try again later.' } });

router.get('/health', (_req, res) => res.json({ status: 'ok' }));

/* auth */
router.post('/auth/register', authLimiter, validate(s.register), auth.register);
router.post('/auth/login', authLimiter, validate(s.login), auth.login);
router.post('/auth/admin-login', authLimiter, validate(s.login), auth.adminLogin);
router.get('/auth/me', protect, auth.me);
router.put('/auth/profile', protect, validate(s.profile), auth.updateProfile);

/* public */
router.get('/products', products.list);
router.get('/products/:id', products.get);
router.get('/categories', products.listCategories);
router.get('/settings', settings.get);
router.get('/blogs', blogs.listPublic);
router.get('/blogs/:slug', blogs.getPublic);
router.post('/contact', formLimiter, validate(s.contact), contact.create);

/* orders (customers & guests) */
router.post('/orders', formLimiter, optionalAuth, validate(s.order), orders.create);
router.get('/orders/mine', protect, orders.mine);
router.get('/orders/track/:orderNumber', optionalAuth, orders.track);
router.get('/orders/mine/:id', protect, orders.getMine);

/* admin — everything below requires a valid admin JWT */
const a = express.Router();
a.use(protect, adminOnly);
a.get('/analytics/overview', admin.overview);
a.get('/analytics/sales', admin.sales);
a.get('/analytics/orders', admin.ordersAnalytics);
a.get('/analytics/products', admin.productsAnalytics);
a.get('/analytics/categories', admin.categoriesAnalytics);
a.get('/notifications', admin.notifications);

a.get('/orders', orders.adminList);
a.get('/orders/:id', orders.adminGet);
a.patch('/orders/:id/status', validate(s.orderStatus), orders.updateStatus);

a.post('/products', validate(s.product), products.create);
a.put('/products/:id', validate(s.product), products.update);
a.delete('/products/:id', products.remove);
a.post('/categories', validate(s.category), products.createCategory);
a.delete('/categories/:id', products.removeCategory);

a.get('/customers', admin.customers);
a.get('/customers/:id', admin.customer);

a.get('/contacts', contact.list);
a.patch('/contacts/:id/read', contact.toggleRead);
a.delete('/contacts/:id', contact.remove);

a.get('/blogs', blogs.listAdmin);
a.get('/blogs/:id', blogs.getAdmin);
a.post('/blogs', validate(s.blog), blogs.create);
a.put('/blogs/:id', validate(s.blog), blogs.update);
a.patch('/blogs/:id/publish', blogs.togglePublish);
a.delete('/blogs/:id', blogs.remove);

a.put('/settings', validate(s.settings), settings.update);
router.use('/admin', a);

module.exports = router;
