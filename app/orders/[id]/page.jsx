'use client';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import PageHero from '@/components/PageHero';
import DataState from '@/components/DataState';
import OrderDetails from '@/components/OrderDetails';
import { useRequireAuth } from '@/components/Providers';
import { useFetch } from '@/lib/useFetch';

export default function OrderDetailPage() {
  const { id } = useParams();
  const { ready } = useRequireAuth();
  const { data, loading, error, reload } = useFetch(ready ? `/orders/mine/${id}` : null);
  return (
    <>
      <PageHero title="Order Details" />
      <section className="section"><div className="container" style={{ maxWidth: 760 }}>
        <p><Link href="/orders" className="link-btn">← All orders</Link></p>
        <DataState loading={!ready || loading} error={error} onRetry={reload} empty={!data?.order}>
          {data?.order && <div className="panel"><OrderDetails order={data.order} /></div>}
        </DataState>
      </div></section>
    </>
  );
}
