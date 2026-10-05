'use client';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import DataState from '@/components/DataState';
import OrderTable from '@/components/admin/OrderTable';
import StatCard from '@/components/admin/StatCard';
import { useSettings } from '@/components/Providers';
import { useFetch } from '@/lib/useFetch';
import { fmtDate } from '@/lib/format';

export default function CustomerDetail() {
  const { id } = useParams();
  const { money } = useSettings();
  const { data, loading, error, reload } = useFetch(`/admin/customers/${id}`);
  const c = data?.customer;
  return (
    <>
      <div className="a-head"><h1>{c?.name || 'Customer'}</h1><Link href="/admin/customers" className="btn btn-ghost">← All customers</Link></div>
      <DataState loading={loading} error={error} onRetry={reload} empty={!c}>
        {c && (<>
          <div className="stats">
            <StatCard label="Email" value={<small style={{ fontSize: '.95rem' }}>{c.email}</small>} icon="✉️" />
            <StatCard label="Phone" value={<small style={{ fontSize: '.95rem' }}>{c.phone || '—'}</small>} icon="📞" color="#3b82c4" />
            <StatCard label="Orders" value={data.orders.length} icon="🧾" color="#9b5de5" />
            <StatCard label="Total spent" value={money(data.totalSpent)} icon="💰" color="#2e7d4f" />
            <StatCard label="Registered" value={<small style={{ fontSize: '.95rem' }}>{fmtDate(c.createdAt)}</small>} icon="📅" color="#6b4430" />
          </div>
          <div className="a-card"><h3>Order history</h3>
            {data.orders.length ? <OrderTable orders={data.orders} /> : <p className="muted">This customer has not placed any orders yet.</p>}
          </div>
        </>)}
      </DataState>
    </>
  );
}
