// Single source of truth for URLs. Never hardcode localhost elsewhere.
export const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api').replace(/\/$/, '');
export const ASSET_BASE = (process.env.NEXT_PUBLIC_ASSET_BASE || 'https://sparkling-taiyaki-783cbf.netlify.app/img').replace(/\/$/, '');
export const asset = (name) => `${ASSET_BASE}/${name}`;
