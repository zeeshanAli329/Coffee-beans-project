'use client';
import { useState } from 'react';
import { api } from '@/lib/api';

export default function SubscribeForm() {
  const [email, setEmail] = useState('');
  const [trap, setTrap] = useState('');
  const [state, setState] = useState({ busy: false, ok: '', err: '' });

  const submit = async (e) => {
    e.preventDefault();
    setState({ busy: true, ok: '', err: '' });
    try {
      const r = await api.post('/contact', { email, type: 'newsletter', website: trap });
      setEmail('');
      setState({ busy: false, ok: r.message, err: '' });
    } catch (er) { setState({ busy: false, ok: '', err: er.message }); }
  };

  return (
    <form className="subscribe-form" onSubmit={submit} noValidate>
      <input className="hp" tabIndex={-1} autoComplete="off" aria-hidden="true" name="website" value={trap} onChange={(e) => setTrap(e.target.value)} />
      <input type="email" required placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} aria-label="Email address" />
      <button className="btn btn-primary" disabled={state.busy}>{state.busy ? 'Subscribing…' : 'Subscribe'}</button>
      {state.ok && <p className="alert alert-ok" role="status">{state.ok}</p>}
      {state.err && <p className="alert alert-err" role="alert">{state.err}</p>}
    </form>
  );
}
