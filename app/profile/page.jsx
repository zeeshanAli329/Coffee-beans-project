'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PageHero from '@/components/PageHero';
import { useAuth, useRequireAuth } from '@/components/Providers';
import { api } from '@/lib/api';

export default function Profile() {
  const { ready, user } = useRequireAuth();
  const { setUser, signOut } = useAuth();
  const router = useRouter();
  const [f, setF] = useState({ name: '', phone: '', currentPassword: '', newPassword: '' });
  const [st, setSt] = useState({ busy: false, ok: '', err: '' });
  useEffect(() => { if (user) setF((p) => ({ ...p, name: user.name, phone: user.phone || '' })); }, [user]);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setSt({ busy: true, ok: '', err: '' });
    const body = { name: f.name, phone: f.phone };
    if (f.newPassword) { body.newPassword = f.newPassword; body.currentPassword = f.currentPassword; }
    try {
      const r = await api.put('/auth/profile', body);
      setUser(r.user);
      setF((p) => ({ ...p, currentPassword: '', newPassword: '' }));
      setSt({ busy: false, ok: 'Profile updated.', err: '' });
    } catch (er) { setSt({ busy: false, ok: '', err: er.message }); }
  };

  if (!ready) return <div className="state"><span className="spinner" /> Loading…</div>;
  return (
    <>
      <PageHero title="My Profile" subtitle={user.email} />
      <section className="section"><div className="container" style={{ maxWidth: 560 }}>
        <form className="panel form" onSubmit={submit} noValidate>
          <label>Full name<input required value={f.name} onChange={set('name')} /></label>
          <label>Phone<input value={f.phone} onChange={set('phone')} /></label>
          <h3 style={{ marginTop: '.6rem' }}>Change password</h3>
          <label>Current password<input type="password" autoComplete="current-password" value={f.currentPassword} onChange={set('currentPassword')} /></label>
          <label>New password<input type="password" autoComplete="new-password" value={f.newPassword} onChange={set('newPassword')} /></label>
          {st.ok && <p className="alert alert-ok" role="status">{st.ok}</p>}
          {st.err && <p className="alert alert-err" role="alert">{st.err}</p>}
          <div className="row gap">
            <button className="btn btn-primary" disabled={st.busy}>{st.busy ? 'Saving…' : 'Save changes'}</button>
            <button type="button" className="btn btn-ghost" onClick={() => { signOut(); router.push('/'); }}>Logout</button>
          </div>
        </form>
      </div></section>
    </>
  );
}
