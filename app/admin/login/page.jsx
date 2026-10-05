'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/Providers';
import { api } from '@/lib/api';

export default function AdminLogin() {
  const router = useRouter();
  const { user, loading, signIn } = useAuth();
  const [f, setF] = useState({ email: '', password: '' });
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => { if (!loading && user?.role === 'admin') router.replace('/admin'); }, [loading, user, router]);

  const submit = async (e) => {
    e.preventDefault();
    setErr(''); setBusy(true);
    try {
      const { token, user: u } = await api.post('/auth/admin-login', f);
      signIn(token, u);
      router.push('/admin');
    } catch (er) { setErr(er.message); setBusy(false); }
  };

  return (
    <div className="login-page">
      <form className="login-card form" onSubmit={submit} noValidate>
        <h1>Bean Scene Admin</h1>
        <p className="muted" style={{ margin: 0 }}>Sign in to manage orders, products and sales.</p>
        <label>Email<input type="email" autoComplete="username" required value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} /></label>
        <label>Password<input type="password" autoComplete="current-password" required value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} /></label>
        {err && <p className="alert alert-err" role="alert">{err}</p>}
        <button className="btn btn-primary" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button>
        <Link href="/" className="center link-btn">← Back to website</Link>
      </form>
    </div>
  );
}
