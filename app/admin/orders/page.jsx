'use client';
import { useEffect, useState } from 'react';
import OrderTable from '@/components/admin/OrderTable';
import Pagination from '@/components/admin/Pagination';
import DataState from '@/components/DataState';
import { qs } from '@/lib/api';
import { useFetch } from '@/lib/useFetch';
import { ORDER_STATUSES } from '@/lib/format';

export default function AdminOrders() {
  const [status, setStatus] = useState('all');
  const [search, setSearch] = useState('');
  const [applied, setApplied] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => { // header search box navigates here with ?search=
    const s = new URLSearchParams(window.location.search).get('search') || '';
    setSearch(s); setApplied(s);
  }, []);

  const { data, loading, error, reload } = useFetch(`/admin/orders${qs({ status, search: applied, page, limit: 15 })}`);
  const orders = data?.orders || [];

  return (
    <>
      <div className="a-head"><h1>Orders</h1>
        <form className="filters" onSubmit={(e) => { e.preventDefault(); setApplied(search.trim()); setPage(1); }}>
          <input className="input" placeholder="Search order, name, phone, email" value={search} onChange={(e) => setSearch(e.target.value)} />
          <button className="btn btn-ghost">Search</button>
        </form>
      </div>
      <div className="pills">
        {['all', ...ORDER_STATUSES].map((s) => (
          <button key={s} className={status === s ? 'active' : ''} onClick={() => { setStatus(s); setPage(1); }}>{s}</button>
        ))}
      </div>
      <div className="a-card">
        <DataState loading={loading} error={error} onRetry={reload} empty={!orders.length} emptyText="No orders match this filter.">
          <OrderTable orders={orders} />
          <Pagination page={data?.page || 1} pages={data?.pages || 1} onChange={setPage} />
        </DataState>
      </div>
    </>
  );
}
