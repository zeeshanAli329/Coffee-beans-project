'use client';
import { useMemo, useState } from 'react';
import { useFetch } from '@/lib/useFetch';
import DataState from './DataState';
import ProductCard from './ProductCard';
import ProductModal from './ProductModal';
import { SearchIcon } from './Icons';

export default function MenuSection({ showSearch = true }) {
  const { data, loading, error, reload } = useFetch('/products');
  const [category, setCategory] = useState('All');
  const [q, setQ] = useState('');
  const [selected, setSelected] = useState(null);

  const products = data?.products || [];
  const categories = useMemo(() => ['All', ...new Set(products.map((p) => p.category))], [products]);
  const visible = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return products.filter(
      (p) => (category === 'All' || p.category === category) && (!needle || `${p.name} ${p.description}`.toLowerCase().includes(needle))
    );
  }, [products, category, q]);

  return (
    <div className="menu">
      <div className="menu-tools">
        <div className="tabs" role="tablist">
          {categories.map((c) => (
            <button key={c} role="tab" aria-selected={c === category} className={c === category ? 'active' : ''} onClick={() => setCategory(c)}>{c}</button>
          ))}
        </div>
        {showSearch && (
          <label className="search">
            <SearchIcon width={18} height={18} />
            <input type="search" placeholder="Search the menu…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search menu" />
          </label>
        )}
      </div>
      <DataState loading={loading} error={error} onRetry={reload} empty={!visible.length}
        emptyText={products.length ? 'No drinks match your search.' : 'The menu is being updated. Please check back soon.'}>
        <div className="grid-products">
          {visible.map((p) => <ProductCard key={p._id} product={p} onOpen={setSelected} />)}
        </div>
      </DataState>
      {selected && <ProductModal product={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
