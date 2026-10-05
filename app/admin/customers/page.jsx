'use client';
import Link from 'next/link';
import { useState } from 'react';
import Pagination from '@/components/admin/Pagination';
import DataState from '@/components/DataState';
import { useSettings } from '@/components/Providers';
import { qs } from '@/lib/api';
import { useFetch } from '@/lib/useFetch';
import { fmtDate } from '@/lib/format';

export default function AdminCustomers() {
  const { money } = useSettings();
  const [search, setSearch] = useState('');
  const [applied, setApplied] = useState('');
  const [page, setPage] = useState(1);
  const { data, loading, error, reload } = useFetch(`/admin/customers${qs({ search: applied, page, limit: 15 })}`);
  const list = data?.customers || [];
  return (
    <>
      <div className="a-head"><h1>Customers</h1>
        <form className="filters" onSubmit={(e) => { e.preventDefault(); setApplied(search.trim()); setPage(1); }}>
          <input className="input" placeholder="Search name, email, phone" value={search} onChange={(e) => setSearch(e.target.value)} />
          <button className="btn btn-ghost">Search</button>
        </form>
      </div>
      <div className="a-card">
        <DataState loading={loading} error={error} onRetry={reload} empty={!list.length} emptyText="No customers yet. They appear here when people sign up.">
          <div className="tbl-wrap"><table className="tbl responsive">
            <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Orders</th><th>Total spent</th><th>Last order</th><th>Registered</th><th /></tr></thead>
            <tbody>{list.map((c) => (
              <tr key={c._id}>
                <td data-label="Name"><strong>{c.name}</strong></td><td data-label="Email">{c.email}</td><td data-label="Phone">{c.phone || '—'}</td>
                <td data-label="Orders">{c.ordersCount}</td><td data-label="Total spent">{money(c.totalSpent)}</td>
                <td data-label="Last order">{fmtDate(c.lastOrder)}</td><td data-label="Registered">{fmtDate(c.createdAt)}</td>
                <td data-label=""><Link className="btn btn-ghost btn-sm" href={`/admin/customers/${c._id}`}>Open</Link></td>
              </tr>))}
            </tbody>
          </table></div>
          <Pagination page={data?.page || 1} pages={data?.pages || 1} onChange={setPage} />
        </DataState>
      </div>
    </>
  );
}
