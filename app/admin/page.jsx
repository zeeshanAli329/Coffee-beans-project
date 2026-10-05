'use client';
import Link from 'next/link';
import StatCard from '@/components/admin/StatCard';
import OrderTable from '@/components/admin/OrderTable';
import AnalyticsPanel from '@/components/admin/AnalyticsPanel';
import DataState from '@/components/DataState';
import { useSettings } from '@/components/Providers';
import { useFetch } from '@/lib/useFetch';

export default function Dashboard() {
  const { money } = useSettings();
  const overview = useFetch('/admin/analytics/overview?range=today');
  const recent = useFetch('/admin/orders?limit=5');
  const c = overview.data?.cards;
  return (
    <>
      <div className="a-head"><h1>Dashboard</h1></div>
      <DataState loading={overview.loading} error={overview.error} onRetry={overview.reload}>
        {c && (
          <div className="stats">
            <StatCard label="Total Sales" value={money(c.totalSales)} icon="💰" color="#2e7d4f" />
            <StatCard label="Total Orders" value={c.totalOrders} icon="🧾" color="#3b82c4" />
            <StatCard label="Today's Sales" value={money(c.todaySales)} icon="📅" color="#d9893b" />
            <StatCard label="Today's Orders" value={c.todayOrders} icon="🛎️" color="#9b5de5" />
            <StatCard label="Pending Orders" value={c.pendingOrders} icon="⏳" color="#eab308" />
            <StatCard label="Completed Orders" value={c.completedOrders} icon="✅" color="#2e7d4f" />
            <StatCard label="Cancelled Orders" value={c.cancelledOrders} icon="❌" color="#c0392b" />
            <StatCard label="Total Customers" value={c.totalCustomers} icon="👥" color="#14b8a6" />
            <StatCard label="Total Products" value={c.totalProducts} icon="☕" color="#6b4430" />
          </div>
        )}
      </DataState>
      <AnalyticsPanel />
      <div className="a-card">
        <div className="row between"><h3 style={{ margin: 0 }}>Recent orders</h3><Link href="/admin/orders" className="btn btn-ghost btn-sm">View all</Link></div>
        <div style={{ marginTop: '1rem' }}>
          <DataState loading={recent.loading} error={recent.error} onRetry={recent.reload} empty={!recent.data?.orders?.length} emptyText="No orders yet. They will appear here as customers order.">
            <OrderTable orders={recent.data?.orders || []} />
          </DataState>
        </div>
      </div>
    </>
  );
}
