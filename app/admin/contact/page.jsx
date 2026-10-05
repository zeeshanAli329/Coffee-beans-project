'use client';
import { useState } from 'react';
import Pagination from '@/components/admin/Pagination';
import DataState from '@/components/DataState';
import { api, qs } from '@/lib/api';
import { useFetch } from '@/lib/useFetch';
import { fmtDateTime } from '@/lib/format';

export default function AdminContact() {
  const [type, setType] = useState('');
  const [page, setPage] = useState(1);
  const [err, setErr] = useState('');
  const { data, loading, error, reload } = useFetch(`/admin/contacts${qs({ type, page, limit: 15 })}`);
  const list = data?.contacts || [];

  const act = async (fn) => { setErr(''); try { await fn(); reload(); } catch (e) { setErr(e.message); } };
  return (
    <>
      <div className="a-head"><h1>Contact submissions</h1>
        <div className="pills">
          {[['', 'All'], ['contact', 'Messages'], ['newsletter', 'Subscribers']].map(([v, l]) => (
            <button key={v} className={type === v ? 'active' : ''} onClick={() => { setType(v); setPage(1); }}>{l}</button>
          ))}
        </div>
      </div>
      {err && <p className="alert alert-err" role="alert">{err}</p>}
      <div className="a-card">
        <DataState loading={loading} error={error} onRetry={reload} empty={!list.length} emptyText="No submissions yet.">
          <div className="tbl-wrap"><table className="tbl responsive">
            <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Type</th><th>Message</th><th>Received</th><th /></tr></thead>
            <tbody>{list.map((c) => (
              <tr key={c._id} style={c.isRead ? undefined : { fontWeight: 600 }}>
                <td data-label="Name">{c.name}</td>
                <td data-label="Email"><a href={`mailto:${c.email}`}>{c.email}</a></td><td data-label="Phone">{c.phone || '—'}</td>
                <td data-label="Type"><span className="badge b-confirmed">{c.type}</span></td>
                <td data-label="Message" style={{ maxWidth: 320, whiteSpace: 'pre-wrap' }}>{c.message}</td>
                <td data-label="Received">{fmtDateTime(c.createdAt)}</td>
                <td data-label=""><div className="actions">
                  <button className="btn btn-ghost btn-sm" onClick={() => act(() => api.patch(`/admin/contacts/${c._id}/read`))}>{c.isRead ? 'Mark unread' : 'Mark read'}</button>
                  <button className="btn btn-danger btn-sm" onClick={() => window.confirm('Delete this submission?') && act(() => api.del(`/admin/contacts/${c._id}`))}>Delete</button>
                </div></td>
              </tr>))}
            </tbody>
          </table></div>
          <Pagination page={data?.page || 1} pages={data?.pages || 1} onChange={setPage} />
        </DataState>
      </div>
    </>
  );
}
