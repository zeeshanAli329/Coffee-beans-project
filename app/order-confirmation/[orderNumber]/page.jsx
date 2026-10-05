'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import PageHero from '@/components/PageHero';
import DataState from '@/components/DataState';
import OrderDetails from '@/components/OrderDetails';
import OrderStatusBadge from '@/components/admin/OrderStatusBadge';
import { useAuth, useSettings } from '@/components/Providers';
import { qs } from '@/lib/api';
import { useFetch } from '@/lib/useFetch';
import { fmtDateTime } from '@/lib/format';

export default function Confirmation() {
  const { orderNumber } = useParams();
  const { user } = useAuth();
  const { money } = useSettings();
  const [phone, setPhone] = useState(null);
  useEffect(() => setPhone(sessionStorage.getItem('bs_last_phone') || ''), []);
  const { data, loading, error, reload } = useFetch(phone === null ? null : `/orders/track/${orderNumber}${qs({ phone })}`);
  const o = data?.order;
  return (
    <>
      <PageHero title="Thank you!" />
      <section className="section"><div className="container" style={{ maxWidth: 640 }}>
        <DataState loading={loading || phone === null} error={error} onRetry={reload} empty={!o}>
          {o && (
            <div className="panel success">
              <div className="big">✓</div>
              <h2>ORDER PLACED SUCCESSFULLY</h2>
              <p className="muted">Your order number</p>
              <p className="order-no">{o.orderNumber}</p>
              <dl className="kv" style={{ textAlign: 'left' }}>
                <dt>Customer</dt><dd>{o.customerName}</dd>
                <dt>Total</dt><dd>{money(o.total)} · Cash on Pickup</dd>
                <dt>Pickup time</dt><dd>{fmtDateTime(o.pickupTime)}</dd>
                <dt>Status</dt><dd><OrderStatusBadge status={o.orderStatus} /></dd>
              </dl>
              <details style={{ textAlign: 'left', marginBottom: '1rem' }}><summary style={{ cursor: 'pointer' }}>View full order</summary><OrderDetails order={o} /></details>
              <div className="row gap" style={{ justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link href="/menu" className="btn btn-primary">Order more</Link>
                {user ? <Link href="/orders" className="btn btn-ghost">My orders</Link> : <Link href="/signup" className="btn btn-ghost">Create an account</Link>}
              </div>
            </div>
          )}
        </DataState>
      </div></section>
    </>
  );
}
