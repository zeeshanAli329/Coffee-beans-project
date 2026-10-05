'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/Providers';
import { api } from '@/lib/api';

export default function Signup() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [f, setF] = useState({ name: '', email: '', phone: '', password: '' });
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    if (f.password.length < 8) return setErr('Password must be at least 8 characters.');
    setBusy(true);
    try {
      const { token, user } = await api.post('/auth/register', f);
      signIn(token, user);
      router.push('/');
    } catch (er) { setErr(er.message); setBusy(false); }
  };

  return (
    <div className="auth-wrap"><form className="panel form auth-card" onSubmit={submit} noValidate>
      <h1>Create your account</h1>
      <label>Full name<input required autoComplete="name" value={f.name} onChange={set('name')} /></label>
      <label>Email<input type="email" required autoComplete="email" value={f.email} onChange={set('email')} /></label>
      <label>Phone (optional)<input autoComplete="tel" value={f.phone} onChange={set('phone')} /></label>
      <label>Password<input type="password" required autoComplete="new-password" value={f.password} onChange={set('password')} /><span className="hint">At least 8 characters</span></label>
      {err && <p className="alert alert-err" role="alert">{err}</p>}
      <button className="btn btn-primary" disabled={busy}>{busy ? 'Creating…' : 'Sign Up'}</button>
      <p className="center muted" style={{ margin: 0 }}>Already have an account? <Link href="/login" className="link-btn">Login</Link></p>
    </form></div>
  );
}
