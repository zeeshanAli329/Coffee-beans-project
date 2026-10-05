'use client';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import { useAuth, useRequireAuth } from '../Providers';
import { api } from '@/lib/api';

function Guarded({ children }) {
  const { ready, user } = useRequireAuth('admin');
  const { signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [notif, setNotif] = useState(null);
  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!ready) return undefined;
    const load = () => api.get('/admin/notifications').then(setNotif).catch(() => {});
    load();
    const t = setInterval(load, 30000);
    return () => clearInterval(t);
  }, [ready, pathname]);

  const logout = () => { signOut(); router.replace('/admin/login'); };
  if (!ready) return <div className="admin"><div className="state" style={{ margin: 'auto' }}><span className="spinner" /> Checking access…</div></div>;
  return (
    <div className="admin">
      <AdminSidebar open={open} onClose={() => setOpen(false)} pending={notif?.pendingOrders} unread={notif?.unreadMessages} onLogout={logout} />
      <div className="a-main">
        <AdminHeader user={user} notif={notif} onMenu={() => setOpen(true)} onLogout={logout} />
        <div className="a-content">{children}</div>
      </div>
    </div>
  );
}

export default function AdminShell({ children }) {
  const pathname = usePathname();
  if (pathname === '/admin/login') return children; // public login screen
  return <Guarded>{children}</Guarded>;
}
