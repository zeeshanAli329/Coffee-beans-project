'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PageHero from '@/components/PageHero';
import { useAuth, useCart, useSettings } from '@/components/Providers';
import { api } from '@/lib/api';
import { useFetch } from '@/lib/useFetch';

const PICKUPS = [['asap', 'As soon as possible'], ['15', 'In 15 minutes'], ['30', 'In 30 minutes'], ['60', 'In 1 hour'], ['custom', 'Choose a time…']];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Checkout() {
  const router = useRouter();
  const { user } = useAuth();
  const { items, subtotal, ready, sync, clear } = useCart();
  const { money, settings } = useSettings();
  const { data: menu } = useFetch('/products');
  const [f, setF] = useState({ customerName: '', phone: '', email: '', pickupOption: 'asap', pickupTime: '', notes: '' });
  const [notes, setNotes] = useState([]);
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  useEffect(() => {
    if (user) setF((p) => ({ ...p, customerName: p.customerName || user.name, email: p.email || user.email, phone: p.phone || user.phone || '' }));
  }, [user]);
  // Make sure prices/availability in the cart match the live menu.
  useEffect(() => {
    if (menu && ready) { const n = sync(menu.products); if (n.length) setNotes(n); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menu, ready]);

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    if (!items.length) return setErr('Your cart is empty.');
    if (f.customerName.trim().length < 2) return setErr('Please enter your full name.');
    if (f.phone.replace(/\D/g, '').length < 7) return setErr('Please enter a valid phone number.');
    if (!EMAIL_RE.test(f.email)) return setErr('Please enter a valid email address.');
    if (f.pickupOption === 'custom' && !f.pickupTime) return setErr('Please choose a pickup time.');
    setBusy(true);
    try {
      const { order } = await api.post('/orders', {
        ...f,
        pickupTime: f.pickupOption === 'custom' ? new Date(f.pickupTime).toISOString() : undefined,
        items: items.map((i) => ({ productId: i.id, quantity: i.quantity })),
      });
      sessionStorage.setItem('bs_last_phone', f.phone);
      clear();
      router.push(`/order-confirmation/${order.orderNumber}`);
    } catch (er) { setErr(er.message); setBusy(false); }
  };

  return (
    <>
      <PageHero title="Checkout" subtitle="Pickup order · pay in cash at the counter" />
      <section className="section"><div className="container">
        {ready && items.length === 0 ? (
          <div className="panel center"><p>Your bag is empty.</p><Link href="/menu" className="btn btn-primary">Browse the menu</Link></div>
        ) : (
          <form className="checkout" onSubmit={submit} noValidate>
            <div className="panel form">
              <h2 style={{ margin: 0 }}>Your details</h2>
              {!user && <p className="muted" style={{ margin: 0 }}>Checking out as guest. <Link href="/login?next=/checkout" className="link-btn">Login</Link> to save your order history.</p>}
              <label>Full name<input required autoComplete="name" value={f.customerName} onChange={set('customerName')} /></label>
              <div className="form-row">
                <label>Phone<input required autoComplete="tel" value={f.phone} onChange={set('phone')} /></label>
                <label>Email<input type="email" required autoComplete="email" value={f.email} onChange={set('email')} /></label>
              </div>
              <label>Pickup time
                <select value={f.pickupOption} onChange={set('pickupOption')}>{PICKUPS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select>
              </label>
              {f.pickupOption === 'custom' && (
                <label>Choose date &amp; time<input type="datetime-local" value={f.pickupTime} onChange={set('pickupTime')} />
                  <span className="hint">At least {settings.pickup.minLeadMinutes} minutes from now.</span></label>
              )}
              <label>Order notes (optional)<textarea rows={3} maxLength={500} value={f.notes} onChange={set('notes')} placeholder="Extra shot, oat milk, no sugar…" /></label>
              <p className="alert alert-warn" style={{ margin: 0 }}>Payment: <strong>Cash on Pickup</strong></p>
            </div>
            <div className="panel">
              <h2 style={{ marginTop: 0 }}>Order summary</h2>
              {notes.map((n) => <p key={n} className="alert alert-warn" style={{ marginBottom: '.5rem' }}>{n}</p>)}
              {items.map((i) => (
                <div className="summary-row" key={i.id}><span>{i.quantity} × {i.name}</span><span>{money(i.price * i.quantity)}</span></div>
              ))}
              <div className="total-line"><span>Total</span><span>{money(subtotal)}</span></div>
              {err && <p className="alert alert-err" role="alert" style={{ marginTop: '1rem' }}>{err}</p>}
              <button className="btn btn-primary block" style={{ marginTop: '1rem' }} disabled={busy || !items.length}>{busy ? 'Placing order…' : 'PLACE ORDER'}</button>
            </div>
          </form>
        )}
      </div></section>
    </>
  );
}
