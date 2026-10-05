'use client';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { api, tokenStore } from '@/lib/api';

const AuthCtx = createContext(null);
const CartCtx = createContext(null);
const SettingsCtx = createContext(null);
export const useAuth = () => useContext(AuthCtx);
export const useCart = () => useContext(CartCtx);
export const useSettings = () => useContext(SettingsCtx);

/** Redirects to the right login page when the visitor is not signed in (or not an admin). */
export function useRequireAuth(role = 'customer') {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const allowed = Boolean(user) && (role !== 'admin' || user.role === 'admin');
  useEffect(() => {
    if (loading || allowed) return;
    router.replace(role === 'admin' ? '/admin/login' : `/login?next=${encodeURIComponent(pathname)}`);
  }, [loading, allowed, role, router, pathname]);
  return { user, ready: !loading && allowed };
}

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!tokenStore.get()) { setLoading(false); return; }
    api.get('/auth/me').then((d) => setUser(d.user)).catch(() => {}).finally(() => setLoading(false));
  }, []);
  useEffect(() => {
    const onUnauth = () => setUser(null);
    window.addEventListener('bs:unauthorized', onUnauth);
    return () => window.removeEventListener('bs:unauthorized', onUnauth);
  }, []);

  const value = useMemo(
    () => ({
      user, loading, setUser,
      signIn: (token, u) => { tokenStore.set(token); setUser(u); },
      signOut: () => { tokenStore.clear(); setUser(null); },
    }),
    [user, loading]
  );
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try { setItems(JSON.parse(localStorage.getItem('bs_cart') || '[]')); } catch { /* ignore corrupt cart */ }
    setReady(true);
  }, []);
  useEffect(() => { if (ready) localStorage.setItem('bs_cart', JSON.stringify(items)); }, [items, ready]);

  const remove = useCallback((id) => setItems((p) => p.filter((i) => i.id !== id)), []);
  const add = useCallback((p, q = 1) => {
    if (!p.isAvailable) return;
    setItems((prev) => {
      const ex = prev.find((i) => i.id === p._id);
      if (ex) return prev.map((i) => (i.id === p._id ? { ...i, quantity: Math.min(50, i.quantity + q) } : i));
      return [...prev, { id: p._id, name: p.name, price: p.price, image: p.image, quantity: q }];
    });
    setOpen(true);
  }, []);
  const setQty = useCallback((id, q) => {
    if (q <= 0) return remove(id);
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, quantity: Math.min(50, q) } : i)));
  }, [remove]);

  // Re-validate against the live menu (price changes / items disabled). Returns user-facing notes.
  const sync = useCallback((products) => {
    const byId = new Map(products.map((p) => [p._id, p]));
    const notes = [];
    const next = [];
    items.forEach((i) => {
      const p = byId.get(i.id);
      if (!p || !p.isAvailable) { notes.push(`${i.name} is no longer available and was removed from your cart.`); return; }
      if (p.price !== i.price) notes.push(`The price of ${i.name} has been updated.`);
      next.push({ ...i, price: p.price, name: p.name, image: p.image });
    });
    if (notes.length) setItems(next);
    return notes;
  }, [items]);

  const value = useMemo(() => ({
    items, ready, open, openCart: () => setOpen(true), closeCart: () => setOpen(false),
    count: items.reduce((s, i) => s + i.quantity, 0),
    subtotal: Math.round(items.reduce((s, i) => s + i.price * i.quantity, 0) * 100) / 100,
    add, remove, setQty, sync, clear: () => setItems([]),
  }), [items, ready, open, add, remove, setQty, sync]);
  return <CartCtx.Provider value={value}>{children}</CartCtx.Provider>;
}

const DEFAULTS = {
  shopName: 'Bean Scene', email: 'beanscene@mail.com', phone: '+1 202-918-2132',
  address: 'Akshya Nagar 1st Block 1st Cross, Rammurthy Nagar, Bangalore-560016',
  website: 'www.beanscene.com', openingHours: 'Mon-Fri 7:00 AM - 8:00 PM, Sat-Sun 8:00 AM - 9:00 PM',
  currency: 'USD', currencySymbol: '$',
  pickup: { minLeadMinutes: 10, maxDaysAhead: 2 }, orders: { acceptingOrders: true, maxItemsPerOrder: 50, minOrderTotal: 0 },
};

function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(DEFAULTS);
  useEffect(() => { api.get('/settings').then((d) => setSettings({ ...DEFAULTS, ...d.settings })).catch(() => {}); }, []);
  const value = useMemo(
    () => ({ settings, setSettings, money: (n) => `${settings.currencySymbol}${Number(n || 0).toFixed(2)}` }),
    [settings]
  );
  return <SettingsCtx.Provider value={value}>{children}</SettingsCtx.Provider>;
}

export default function Providers({ children }) {
  return (
    <SettingsProvider>
      <AuthProvider>
        <CartProvider>{children}</CartProvider>
      </AuthProvider>
    </SettingsProvider>
  );
}
