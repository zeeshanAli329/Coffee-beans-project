'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BeanIcon } from '../Icons';

const NAV = [
  ['/admin', '📊', 'Dashboard'], ['/admin/orders', '🧾', 'Orders'], ['/admin/products', '☕', 'Products'],
  ['/admin/customers', '👥', 'Customers'], ['/admin/analytics', '📈', 'Analytics'], ['/admin/contact', '✉️', 'Contact'],
  ['/admin/blog', '📰', 'Blog'], ['/admin/settings', '⚙️', 'Settings'],
];

export default function AdminSidebar({ open, onClose, pending = 0, unread = 0, onLogout }) {
  const pathname = usePathname();
  const active = (h) => (h === '/admin' ? pathname === '/admin' : pathname.startsWith(h));
  const badge = { '/admin/orders': pending, '/admin/contact': unread };
  return (
    <>
      <div className={`a-overlay ${open ? 'show' : ''}`} onClick={onClose} />
      <aside className={`a-side ${open ? 'open' : ''}`}>
        <div className="a-brand"><BeanIcon /> Bean Scene</div>
        <nav className="a-nav" aria-label="Admin">
          {NAV.map(([href, ico, label]) => (
            <Link key={href} href={href} className={active(href) ? 'active' : ''} onClick={onClose}>
              <span>{ico}</span>{label}{badge[href] > 0 && <span className="count">{badge[href]}</span>}
            </Link>
          ))}
        </nav>
        <div className="a-side-foot">
          <Link href="/">← View website</Link><br />
          <button className="link-btn" style={{ color: '#e9dccd', marginTop: '.5rem' }} onClick={onLogout}>Logout</button>
        </div>
      </aside>
    </>
  );
}
