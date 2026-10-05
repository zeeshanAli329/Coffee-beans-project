'use client';
import Link from 'next/link';
import PageHero from '@/components/PageHero';
import DataState from '@/components/DataState';
import { useSettings } from '@/components/Providers';
import { useFetch } from '@/lib/useFetch';

export default function Pricing() {
  const { data, loading, error, reload } = useFetch('/products');
  const { money } = useSettings();
  const products = data?.products || [];
  const groups = products.reduce((m, p) => ((m[p.category] ||= []).push(p), m), {});
  return (
    <>
      <PageHero title="Pricing" subtitle="Fair prices for coffee this good." />
      <section className="section"><div className="container prose">
        <DataState loading={loading} error={error} onRetry={reload} empty={!products.length} emptyText="Prices will appear here soon.">
          {Object.entries(groups).map(([cat, list]) => (
            <div className="panel" key={cat} style={{ marginBottom: '1.2rem' }}>
              <h2 style={{ marginTop: 0 }}>{cat}</h2>
              {list.map((p) => (
                <div className="summary-row" key={p._id}>
                  <span>{p.name}{!p.isAvailable && <span className="muted"> — currently unavailable</span>}</span><strong>{money(p.price)}</strong>
                </div>
              ))}
            </div>
          ))}
        </DataState>
        <p className="center"><Link href="/menu" className="btn btn-primary">Order Now</Link></p>
      </div></section>
    </>
  );
}
