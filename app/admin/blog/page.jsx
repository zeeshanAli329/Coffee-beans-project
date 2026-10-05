'use client';
import { useState } from 'react';
import Modal from '@/components/admin/Modal';
import DataState from '@/components/DataState';
import { api } from '@/lib/api';
import { useFetch } from '@/lib/useFetch';
import { fmtDate } from '@/lib/format';

const EMPTY = { title: '', slug: '', excerpt: '', content: '', image: '', author: 'Bean Scene Team', published: false };

function BlogForm({ id, onSaved, onCancel }) {
  const existing = useFetch(id ? `/admin/blogs/${id}` : null);
  const [f, setF] = useState(null);
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const form = f || (id ? existing.data?.blog : EMPTY);
  const set = (k) => (e) => setF({ ...form, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setErr(''); setBusy(true);
    const { title, slug, excerpt, content, image, author, published } = form;
    try {
      const body = { title, slug, excerpt, content, image, author, published };
      if (id) await api.put(`/admin/blogs/${id}`, body); else await api.post('/admin/blogs', body);
      onSaved();
    } catch (er) { setErr(er.message); setBusy(false); }
  };

  return (
    <DataState loading={id && existing.loading} error={existing.error} onRetry={existing.reload}>
      {form && (
        <form className="form" onSubmit={submit} noValidate>
          <label>Title<input required value={form.title} onChange={set('title')} /></label>
          <label>Slug (optional)<input value={form.slug} onChange={set('slug')} placeholder="auto-generated from title" /></label>
          <label>Excerpt<textarea rows={2} value={form.excerpt} onChange={set('excerpt')} /></label>
          <label>Content<textarea rows={8} required value={form.content} onChange={set('content')} /></label>
          <div className="form-row">
            <label>Image URL<input value={form.image} onChange={set('image')} /></label>
            <label>Author<input value={form.author} onChange={set('author')} /></label>
          </div>
          <label className="check"><input type="checkbox" checked={form.published} onChange={set('published')} /> Published</label>
          {err && <p className="alert alert-err" role="alert">{err}</p>}
          <div className="row gap" style={{ justifyContent: 'flex-end' }}>
            <button type="button" className="btn btn-ghost" onClick={onCancel}>Cancel</button>
            <button className="btn btn-primary" disabled={busy}>{busy ? 'Saving…' : 'Save article'}</button>
          </div>
        </form>
      )}
    </DataState>
  );
}

export default function AdminBlog() {
  const { data, loading, error, reload } = useFetch('/admin/blogs');
  const [editing, setEditing] = useState(null); // null | 'new' | id
  const [err, setErr] = useState('');
  const list = data?.blogs || [];
  const act = async (fn) => { setErr(''); try { await fn(); reload(); } catch (e) { setErr(e.message); } };

  return (
    <>
      <div className="a-head"><h1>Blog / News</h1><button className="btn btn-primary" onClick={() => setEditing('new')}>+ New article</button></div>
      {err && <p className="alert alert-err" role="alert">{err}</p>}
      <div className="a-card">
        <DataState loading={loading} error={error} onRetry={reload} empty={!list.length} emptyText="No articles yet.">
          <div className="tbl-wrap"><table className="tbl responsive">
            <thead><tr><th>Title</th><th>Author</th><th>Status</th><th>Created</th><th>Actions</th></tr></thead>
            <tbody>{list.map((b) => (
              <tr key={b._id}>
                <td data-label="Title"><strong>{b.title}</strong><br /><small>/blog/{b.slug}</small></td><td data-label="Author">{b.author}</td>
                <td data-label="Status"><span className={`badge ${b.published ? 'b-completed' : 'b-pending'}`}>{b.published ? 'Published' : 'Draft'}</span></td>
                <td data-label="Created">{fmtDate(b.createdAt)}</td>
                <td data-label="Actions"><div className="actions">
                  <button className="btn btn-ghost btn-sm" onClick={() => setEditing(b._id)}>Edit</button>
                  <button className="btn btn-ghost btn-sm" onClick={() => act(() => api.patch(`/admin/blogs/${b._id}/publish`))}>{b.published ? 'Unpublish' : 'Publish'}</button>
                  <button className="btn btn-danger btn-sm" onClick={() => window.confirm(`Delete "${b.title}"?`) && act(() => api.del(`/admin/blogs/${b._id}`))}>Delete</button>
                </div></td>
              </tr>))}
            </tbody>
          </table></div>
        </DataState>
      </div>
      {editing && (
        <Modal title={editing === 'new' ? 'New article' : 'Edit article'} onClose={() => setEditing(null)} width={720}>
          <BlogForm id={editing === 'new' ? null : editing} onCancel={() => setEditing(null)} onSaved={() => { setEditing(null); reload(); }} />
        </Modal>
      )}
    </>
  );
}
