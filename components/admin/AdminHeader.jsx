'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { BellIcon, MenuIcon, SearchIcon } from '../Icons';
import { fmtDateTime } from '@/lib/format';

export default function AdminHeader({ user, notif, onMenu, onLogout }) {
  const router = useRouter();
  const [q, setQ] = useState('');
  const [pop, setPop] = useState(null); // 'bell' | 'user' | null
  const total = (notif?.pendingOrders || 0) + (notif?.unreadMessages || 0);

  const search = (e) => {
    e.preventDefault();
    router.push(`/admin/orders?search=${encodeURIComponent(q.trim())}`);
  };

  return (
    <header className="a-top">
      <button className="burger icon-btn" onClick={onMenu} aria-label="Open menu"><MenuIcon /></button>
      <form className="a-search" onSubmit={search} role="search">
        <SearchIcon width={18} height={18} />
        <input placeholder="Search orders by number, name, phone…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search orders" />
      </form>
      <div className="a-tools">
        <div className="a-pop">
          <button className="icon-btn" aria-label="Notifications" onClick={() => setPop(pop === 'bell' ? null : 'bell')}>
            <BellIcon />{total > 0 && <span className="a-dot">{total}</span>}
          </button>
          {pop === 'bell' && (
            <div className="a-pop-menu" onClick={() => setPop(null)}>
              <Link href="/admin/orders"><strong>{notif?.pendingOrders || 0}</strong> pending order(s)</Link>
              <Link href="/admin/contact"><strong>{notif?.unreadMessages || 0}</strong> unread message(s)</Link>
              {(notif?.recent || []).map((o) => (
                <Link key={o._id} href={`/admin/orders/${o._id}`}><small>{o.orderNumber} · {o.customerName}<br />{fmtDateTime(o.createdAt)}</small></Link>
              ))}
            </div>
          )}
        </div>
        <div className="a-pop">
          <button className="a-avatar" onClick={() => setPop(pop === 'user' ? null : 'user')} aria-label="Admin profile">
            <span className="c">{(user?.name || 'A')[0]}</span><span className="name">{user?.name}</span>
          </button>
          {pop === 'user' && (
            <div className="a-pop-menu">
              <div style={{ padding: '.5rem .7rem' }}><strong>{user?.name}</strong><br /><small>{user?.email}</small></div>
              <Link href="/admin/settings" onClick={() => setPop(null)}>Settings</Link>
              <button onClick={onLogout}>Logout</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
