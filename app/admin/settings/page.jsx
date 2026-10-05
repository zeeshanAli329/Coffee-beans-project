'use client';
import { useEffect, useState } from 'react';
import DataState from '@/components/DataState';
import { useSettings } from '@/components/Providers';
import { api } from '@/lib/api';
import { useFetch } from '@/lib/useFetch';

export default function AdminSettings() {
  const { data, loading, error, reload } = useFetch('/settings');
  const { setSettings } = useSettings();
  const [f, setF] = useState(null);
  const [st, setSt] = useState({ busy: false, ok: '', err: '' });
  useEffect(() => { if (data?.settings) setF(data.settings); }, [data]);

  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const nested = (grp, k, isBool) => (e) => setF({ ...f, [grp]: { ...f[grp], [k]: isBool ? e.target.checked : e.target.value } });

  const submit = async (e) => {
    e.preventDefault();
    setSt({ busy: true, ok: '', err: '' });
    const { shopName, email, phone, address, website, openingHours, currency, currencySymbol, pickup, orders } = f;
    try {
      const r = await api.put('/admin/settings', { shopName, email, phone, address, website, openingHours, currency, currencySymbol, pickup, orders });
      setSettings(r.settings);
      setSt({ busy: false, ok: 'Settings saved.', err: '' });
    } catch (er) { setSt({ busy: false, ok: '', err: er.message }); }
  };

  return (
    <>
      <div className="a-head"><h1>Settings</h1></div>
      <DataState loading={loading || (!f && !error)} error={error} onRetry={reload}>
        {f && (
          <form className="a-card form" onSubmit={submit} noValidate style={{ maxWidth: 760 }}>
            <h3>Shop</h3>
            <label>Shop name<input required value={f.shopName} onChange={set('shopName')} /></label>
            <div className="form-row">
              <label>Email<input type="email" required value={f.email} onChange={set('email')} /></label>
              <label>Phone<input value={f.phone} onChange={set('phone')} /></label>
            </div>
            <label>Address<input value={f.address} onChange={set('address')} /></label>
            <label>Website<input value={f.website || ''} onChange={set('website')} /></label>
            <label>Opening hours<textarea rows={2} value={f.openingHours} onChange={set('openingHours')} /></label>
            <h3>Currency</h3>
            <div className="form-row">
              <label>Currency code<input maxLength={3} value={f.currency} onChange={set('currency')} /></label>
              <label>Symbol<input maxLength={4} value={f.currencySymbol} onChange={set('currencySymbol')} /></label>
            </div>
            <h3>Pickup</h3>
            <div className="form-row">
              <label>Minimum lead time (minutes)<input type="number" min="0" value={f.pickup.minLeadMinutes} onChange={nested('pickup', 'minLeadMinutes')} /></label>
              <label>Schedule up to (days ahead)<input type="number" min="0" value={f.pickup.maxDaysAhead} onChange={nested('pickup', 'maxDaysAhead')} /></label>
            </div>
            <h3>Orders</h3>
            <label className="check"><input type="checkbox" checked={f.orders.acceptingOrders} onChange={nested('orders', 'acceptingOrders', true)} /> Accepting online orders</label>
            <div className="form-row">
              <label>Max items per order<input type="number" min="1" value={f.orders.maxItemsPerOrder} onChange={nested('orders', 'maxItemsPerOrder')} /></label>
              <label>Minimum order total<input type="number" min="0" step="0.01" value={f.orders.minOrderTotal} onChange={nested('orders', 'minOrderTotal')} /></label>
            </div>
            {st.ok && <p className="alert alert-ok" role="status">{st.ok}</p>}
            {st.err && <p className="alert alert-err" role="alert">{st.err}</p>}
            <div><button className="btn btn-primary" disabled={st.busy}>{st.busy ? 'Saving…' : 'Save settings'}</button></div>
          </form>
        )}
      </DataState>
    </>
  );
}
