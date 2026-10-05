'use client';
import { useState } from 'react';
import { api } from '@/lib/api';

const EMPTY = { name: '', description: '', price: '', category: '', image: '', rating: 4.5, isAvailable: true };

export default function ProductForm({ product, categories = [], onSaved, onCancel }) {
  const [f, setF] = useState(product ? { ...EMPTY, ...product } : EMPTY);
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setErr(''); setBusy(true);
    const body = { name: f.name, description: f.description, price: f.price, category: f.category, image: f.image, rating: f.rating, isAvailable: f.isAvailable };
    try {
      if (product?._id) await api.put(`/admin/products/${product._id}`, body);
      else await api.post('/admin/products', body);
      onSaved();
    } catch (er) { setErr(er.message); setBusy(false); }
  };

  return (
    <form className="form" onSubmit={submit} noValidate>
      <label>Name<input required value={f.name} onChange={set('name')} /></label>
      <label>Description<textarea rows={3} value={f.description} onChange={set('description')} /></label>
      <div className="form-row">
        <label>Price<input type="number" min="0" step="0.01" required value={f.price} onChange={set('price')} /></label>
        <label>Category
          <input list="cat-list" required value={f.category} onChange={set('category')} placeholder="e.g. Hot Coffee" />
          <datalist id="cat-list">{categories.map((c) => <option key={c} value={c} />)}</datalist>
        </label>
      </div>
      <label>Image URL or path<input value={f.image} onChange={set('image')} placeholder="https://… or /img/latte.jpg" /></label>
      {f.image && <img className="thumb" style={{ width: 80, height: 80 }} src={f.image} alt="Preview" onError={(e) => { e.currentTarget.style.display = 'none'; }} />}
      <div className="form-row">
        <label>Rating (0–5)<input type="number" min="0" max="5" step="0.1" value={f.rating} onChange={set('rating')} /></label>
        <label className="check" style={{ alignSelf: 'end', paddingBottom: '.5rem' }}><input type="checkbox" checked={f.isAvailable} onChange={set('isAvailable')} /> Available to order</label>
      </div>
      {err && <p className="alert alert-err" role="alert">{err}</p>}
      <div className="row gap" style={{ justifyContent: 'flex-end' }}>
        <button type="button" className="btn btn-ghost" onClick={onCancel}>Cancel</button>
        <button className="btn btn-primary" disabled={busy}>{busy ? 'Saving…' : product ? 'Save changes' : 'Add product'}</button>
      </div>
    </form>
  );
}
