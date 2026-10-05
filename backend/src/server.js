const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const { port, clientUrls, isProd } = require('./config/env');
const connectDB = require('./config/db');
const routes = require('./routes');
const { notFound, errorHandler } = require('./middleware/error');

const app = express();
app.set('trust proxy', 1);
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({
  origin: (origin, cb) => (!origin || clientUrls.includes(origin) ? cb(null, true) : cb(new Error('Not allowed by CORS'))),
}));
app.use(express.json({ limit: '100kb' }));
if (!isProd) app.use(morgan('dev'));
app.use('/api', rateLimit({ windowMs: 15 * 60 * 1000, limit: 1000, standardHeaders: true, legacyHeaders: false }));
app.use('/api', routes);
app.use(notFound);
app.use(errorHandler);

connectDB()
  .then(() => app.listen(port, () => console.log(`Bean Scene API running on http://localhost:${port}/api`)))
  .catch((err) => { console.error('Failed to start server:', err.message); process.exit(1); });
