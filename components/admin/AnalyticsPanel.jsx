'use client';
import { useState } from 'react';
import DateRangeFilter from './DateRangeFilter';
import StatCard from './StatCard';
import SalesChart from './SalesChart';
import OrdersChart from './OrdersChart';
import BestSellersChart from './BestSellersChart';
import CategoryChart from './CategoryChart';
import StatusChart from './StatusChart';
import DataState from '../DataState';
import { useSettings } from '../Providers';
import { qs } from '@/lib/api';
import { useFetch } from '@/lib/useFetch';

const GROUPS = [['day', 'Daily'], ['week', 'Weekly'], ['month', 'Monthly'], ['year', 'Yearly']];

// Every figure and chart below comes from the /admin/analytics/* MongoDB aggregations.
export default function AnalyticsPanel() {
  const { money } = useSettings();
  const [r, setR] = useState({ range: 'last30', from: '', to: '' });
  const [group, setGroup] = useState('day');
  const customIncomplete = r.range === 'custom' && !(r.from && r.to);
  const q = qs({ range: r.range, from: r.range === 'custom' ? r.from : '', to: r.range === 'custom' ? r.to : '' });
  const p = (name, extra = '') => (customIncomplete ? null : `/admin/analytics/${name}${q}${extra}`);

  const sales = useFetch(p('sales', `${q ? '&' : '?'}group=${group}`));
  const orders = useFetch(p('orders', `${q ? '&' : '?'}group=${group}`));
  const products = useFetch(p('products'));
  const cats = useFetch(p('categories'));
  const overview = useFetch(p('overview'));

  const onRange = (next) => {
    setR(next);
    if (next.range !== r.range) setGroup(next.range === 'thisYear' ? 'month' : 'day');
  };
  const t = sales.data?.totals;
  const reloadAll = () => [sales, orders, products, cats, overview].forEach((x) => x.reload());
  const failed = sales.error || orders.error || products.error || cats.error || overview.error;

  return (
    <>
      <div className="a-head">
        <h2 style={{ margin: 0 }}>Sales analytics</h2>
        <div className="filters">
          <DateRangeFilter value={r} onChange={onRange} />
          <select value={group} onChange={(e) => setGroup(e.target.value)} aria-label="Group by">
            {GROUPS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        </div>
      </div>
      {customIncomplete && <p className="alert alert-warn">Choose a start and end date to load the custom range.</p>}
      <DataState error={failed} onRetry={reloadAll}>
        <div className="stats">
          <StatCard label="Total revenue" value={money(t?.revenue)} icon="💵" color="#2e7d4f" />
          <StatCard label="Total orders" value={t?.orders ?? 0} icon="🧾" color="#3b82c4" />
          <StatCard label="Average order value" value={money(t?.averageOrderValue)} icon="📊" color="#9b5de5" />
        </div>
        <div className="charts">
          <SalesChart series={sales.data?.series} loading={sales.loading} />
          <OrdersChart series={orders.data?.series} loading={orders.loading} />
          <StatusChart distribution={overview.data?.statusDistribution} loading={overview.loading} />
          <BestSellersChart products={products.data?.products} loading={products.loading} />
          <CategoryChart categories={cats.data?.categories} loading={cats.loading} />
        </div>
      </DataState>
    </>
  );
}
