'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/Providers';
import { api } from '@/lib/api';

export default function Login() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [f, setF] = useState({ email: '', password: '' });
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setErr(''); setBusy(true);
    try {
      const { token, user } = await api.post('/auth/login', f);
      signIn(token, user);
      const next = new URLSearchParams(window.location.search).get('next');
      router.push(next && next.startsWith('/') && !next.startsWith('//') ? next : '/');
    } catch (er) { setErr(er.message); setBusy(false); }
  };

  return (
    <div className="auth-wrap"><form className="panel form auth-card" onSubmit={submit} noValidate>
      <h1>Welcome back</h1>
      <p className="muted">Log in to view your orders and check out faster.</p>
      <label>Email<input type="email" autoComplete="email" required value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} /></label>
      <label>Password<input type="password" autoComplete="current-password" required value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} /></label>
      {err && <p className="alert alert-err" role="alert">{err}</p>}
      <button className="btn btn-primary" disabled={busy}>{busy ? 'Signing in…' : 'Login'}</button>
      <p className="center muted" style={{ margin: 0 }}>New here? <Link href="/signup" className="link-btn">Create an account</Link></p>
    </form></div>
  );
}
