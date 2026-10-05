import { API_URL } from './config';

const TOKEN_KEY = 'bs_token';
const hasWindow = () => typeof window !== 'undefined';

export const tokenStore = {
  get: () => (hasWindow() ? window.localStorage.getItem(TOKEN_KEY) : null),
  set: (t) => window.localStorage.setItem(TOKEN_KEY, t),
  clear: () => hasWindow() && window.localStorage.removeItem(TOKEN_KEY),
};

async function request(method, path, body) {
  const token = tokenStore.get();
  let res;
  try {
    res = await fetch(`${API_URL}${path}`, {
      method,
      headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    const err = new Error('Cannot reach the server. Please check your connection and try again.');
    err.status = 0;
    throw err;
  }
  let data = null;
  try { data = await res.json(); } catch { /* empty body */ }
  if (!res.ok) {
    const err = new Error(data?.message || `Request failed (${res.status})`);
    err.status = res.status;
    err.details = data?.details;
    if (res.status === 401 && hasWindow()) {
      tokenStore.clear();
      window.dispatchEvent(new Event('bs:unauthorized'));
    }
    throw err;
  }
  return data;
}

export const api = {
  get: (p) => request('GET', p),
  post: (p, b) => request('POST', p, b ?? {}),
  put: (p, b) => request('PUT', p, b ?? {}),
  patch: (p, b) => request('PATCH', p, b ?? {}),
  del: (p) => request('DELETE', p),
};

export const qs = (obj) => {
  const p = new URLSearchParams();
  Object.entries(obj).forEach(([k, v]) => v !== undefined && v !== null && v !== '' && p.set(k, v));
  const s = p.toString();
  return s ? `?${s}` : '';
};
