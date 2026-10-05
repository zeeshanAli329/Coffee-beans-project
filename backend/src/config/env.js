require('dotenv').config();

const missing = ['MONGODB_URI', 'JWT_SECRET'].filter((k) => !process.env[k]);
if (missing.length) {
  console.error(`Missing required environment variables: ${missing.join(', ')}. Copy .env.example to .env and fill it in.`);
  process.exit(1);
}
if (process.env.JWT_SECRET.length < 16) {
  console.error('JWT_SECRET must be at least 16 characters long.');
  process.exit(1);
}

module.exports = {
  port: Number(process.env.PORT) || 5000,
  mongoUri: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpires: process.env.JWT_EXPIRES_IN || '7d',
  clientUrls: (process.env.CLIENT_URL || 'http://localhost:3000').split(',').map((s) => s.trim()).filter(Boolean),
  adminEmail: (process.env.ADMIN_EMAIL || 'admin@gmail.com').toLowerCase().trim(),
  adminPassword: process.env.ADMIN_PASSWORD || '',
  timezone: process.env.TIMEZONE || 'UTC',
  isProd: process.env.NODE_ENV === 'production',
};
