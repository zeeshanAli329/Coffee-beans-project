'use client';
import { useState } from 'react';
import ProductTable from '@/components/admin/ProductTable';
import ProductForm from '@/components/admin/ProductForm';
import Modal from '@/components/admin/Modal';
import DataState from '@/components/DataState';
import { api } from '@/lib/api';
import { useFetch } from '@/lib/useFetch';

export default function AdminProducts() {
  const { data, loading, error, reload } = useFetch('/products');
  const cats = useFetch('/categories');
  const [editing, setEditing] = useState(null); // null | 'new' | product
  const [msg, setMsg] = useState({ ok: '', err: '' });
  const products = data?.products || [];

  const run = async (fn, ok) => {
    setMsg({ ok: '', err: '' });
    try { await fn(); setMsg({ ok, err: '' }); reload(); cats.reload(); } catch (e) { setMsg({ ok: '', err: e.message }); }
  };
  const toggle = (p) => run(() => api.put(`/admin/products/${p._id}`, { name: p.name, description: p.description, price: p.price, category: p.category, image: p.image, rating: p.rating, isAvailable: !p.isAvailable }), `${p.name} ${p.isAvailable ? 'disabled' : 'enabled'}.`);
  const del = (p) => window.confirm(`Delete "${p.name}"? Past orders keep their record.`) && run(() => api.del(`/admin/products/${p._id}`), `${p.name} deleted.`);

  return (
    <>
      <div className="a-head"><h1>Products</h1><button className="btn btn-primary" onClick={() => setEditing('new')}>+ Add product</button></div>
      {msg.ok && <p className="alert alert-ok" role="status">{msg.ok}</p>}
      {msg.err && <p className="alert alert-err" role="alert">{msg.err}</p>}
      <div className="a-card">
        <DataState loading={loading} error={error} onRetry={reload} empty={!products.length} emptyText="No products yet. Add your first one — it will appear on the Menu automatically.">
          <ProductTable products={products} onEdit={setEditing} onDelete={del} onToggle={toggle} />
        </DataState>
      </div>
      {editing && (
        <Modal title={editing === 'new' ? 'Add product' : `Edit ${editing.name}`} onClose={() => setEditing(null)}>
          <ProductForm product={editing === 'new' ? null : editing} categories={cats.data?.categories}
            onCancel={() => setEditing(null)}
            onSaved={() => { setEditing(null); setMsg({ ok: 'Product saved. It is live on the menu.', err: '' }); reload(); cats.reload(); }} />
        </Modal>
      )}
    </>
  );
}
