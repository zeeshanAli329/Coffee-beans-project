const crypto = require('crypto');

const escapeRegex = (s) => String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const round2 = (n) => Math.round((Number(n) + Number.EPSILON) * 100) / 100;
const digits = (s) => String(s || '').replace(/\D/g, '');

const slugify = (s) =>
  String(s).toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80) || 'post';

// e.g. BS-20260504-7K3Q
function generateOrderNumber() {
  const d = new Date();
  const ymd = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let tail = '';
  for (let i = 0; i < 4; i++) tail += alphabet[crypto.randomInt(alphabet.length)];
  return `BS-${ymd}-${tail}`;
}

function paginate(query) {
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit, 10) || 20));
  return { page, limit, skip: (page - 1) * limit };
}

module.exports = { escapeRegex, round2, digits, slugify, generateOrderNumber, paginate };
