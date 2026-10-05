'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useParams } from 'next/navigation';
import DataState from '@/components/DataState';
import OrderDetails from '@/components/OrderDetails';
import { api } from '@/lib/api';
import { useFetch } from '@/lib/useFetch';
import { cap, fmtDateTime } from '@/lib/format';

const NEXT = { pending: ['confirmed', 'Confirm Order'], confirmed: ['preparing', 'Start Preparing'], preparing: ['ready', 'Mark Ready'], ready: ['completed', 'Mark Completed'] };

export default function AdminOrderDetail() {
  const { id } = useParams();
  const { data, loading, error, reload } = useFetch(`/admin/orders/${id}`);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState({ ok: '', err: '' });
  const o = data?.order;

  const move = async (status) => {
    if (status === 'cancelled' && !window.confirm('Cancel this order? This cannot be undone.')) return;
    setBusy(true); setMsg({ ok: '', err: '' });
    try {
      await api.patch(`/admin/orders/${id}/status`, { status });
      setMsg({ ok: `Order marked as ${status}.`, err: '' });
      await reload();
    } catch (e) { setMsg({ ok: '', err: e.message }); } finally { setBusy(false); }
  };

  const next = o && NEXT[o.orderStatus];
  const closed = o && ['completed', 'cancelled'].includes(o.orderStatus);
  return (
    <>
      <div className="a-head"><h1>Order details</h1><Link href="/admin/orders" className="btn btn-ghost">← All orders</Link></div>
      <DataState loading={loading} error={error} onRetry={reload} empty={!o}>
        {o && (
          <div className="charts">
            <div className="a-card"><OrderDetails order={o} /></div>
            <div style={{ display: 'grid', gap: '1rem', alignContent: 'start' }}>
              <div className="a-card">
                <h3>Actions</h3>
                {closed ? <p className="muted">This order is {o.orderStatus}; no further changes.</p> : (
                  <div className="actions">
                    {next && <button className="btn btn-primary" disabled={busy} onClick={() => move(next[0])}>{next[1]}</button>}
                    <button className="btn btn-danger" disabled={busy} onClick={() => move('cancelled')}>Cancel Order</button>
                  </div>
                )}
                {msg.ok && <p className="alert alert-ok" role="status" style={{ marginTop: '1rem' }}>{msg.ok}</p>}
                {msg.err && <p className="alert alert-err" role="alert" style={{ marginTop: '1rem' }}>{msg.err}</p>}
              </div>
              <div className="a-card">
                <h3>Status history</h3>
                <ul className="timeline">
                  {(o.statusHistory || []).map((h, i) => <li key={i}><span className={`badge b-${h.status}`}>{cap(h.status)}</span><small>{fmtDateTime(h.at)}</small></li>)}
                </ul>
              </div>
            </div>
          </div>
        )}
      </DataState>
    </>
  );
}
