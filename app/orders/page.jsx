'use client';
import Link from 'next/link';
import PageHero from '@/components/PageHero';
import DataState from '@/components/DataState';
import OrderStatusBadge from '@/components/admin/OrderStatusBadge';
import { useRequireAuth, useSettings } from '@/components/Providers';
import { useFetch } from '@/lib/useFetch';
import { fmtDateTime } from '@/lib/format';

export default function MyOrders() {
  const { ready } = useRequireAuth();
  const { money } = useSettings();
  const { data, loading, error, reload } = useFetch(ready ? '/orders/mine' : null);
  const orders = data?.orders || [];
  return (
    <>
      <PageHero title="My Orders" subtitle="Your previous Bean Scene orders." />
      <section className="section"><div className="container" style={{ maxWidth: 820 }}>
        <DataState loading={!ready || loading} error={error} onRetry={reload} empty={!orders.length}
          emptyText={<>You haven&apos;t placed any orders yet. <Link href="/menu" className="link-btn">Browse the menu</Link></>}>
          {orders.map((o) => (
            <Link href={`/orders/${o._id}`} key={o._id} className="order-card">
              <div><strong>{o.orderNumber}</strong><br /><span className="muted">{fmtDateTime(o.createdAt)} · {o.items.reduce((s, i) => s + i.quantity, 0)} item(s)</span></div>
              <div className="row gap"><OrderStatusBadge status={o.orderStatus} /><strong>{money(o.total)}</strong></div>
            </Link>
          ))}
        </DataState>
      </div></section>
    </>
  );
}
