'use client';
import { useState } from 'react';
import PageHero from '@/components/PageHero';
import { useSettings } from '@/components/Providers';
import { api } from '@/lib/api';

export default function Contact() {
  const { settings: s } = useSettings();
  const [f, setF] = useState({ name: '', email: '', phone: '', message: '', website: '' });
  const [st, setSt] = useState({ busy: false, ok: '', err: '' });
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setSt({ busy: true, ok: '', err: '' });
    try {
      const r = await api.post('/contact', { ...f, type: 'contact' });
      setF({ name: '', email: '', phone: '', message: '', website: '' });
      setSt({ busy: false, ok: r.message, err: '' });
    } catch (er) { setSt({ busy: false, ok: '', err: er.message }); }
  };

  return (
    <>
      <PageHero title="Contact Us" subtitle="Questions, feedback or a big coffee order? We'd love to hear from you." />
      <section className="section" id="contact"><div className="container contact-grid">
        <div>
          <h2>Get in touch</h2>
          <p><strong>Address</strong><br />{s.address}</p>
          <p><strong>Phone</strong><br /><a href={`tel:${s.phone.replace(/[^+\d]/g, '')}`}>{s.phone}</a></p>
          <p><strong>Email</strong><br /><a href={`mailto:${s.email}`}>{s.email}</a></p>
          <p><strong>Opening hours</strong><br />{s.openingHours}</p>
        </div>
        <form className="panel form" onSubmit={submit} noValidate>
          <input className="hp" tabIndex={-1} autoComplete="off" aria-hidden="true" value={f.website} onChange={set('website')} />
          <div className="form-row">
            <label>Name<input required value={f.name} onChange={set('name')} /></label>
            <label>Email<input type="email" required value={f.email} onChange={set('email')} /></label>
          </div>
          <label>Phone (optional)<input value={f.phone} onChange={set('phone')} /></label>
          <label>Message<textarea rows={5} required value={f.message} onChange={set('message')} /></label>
          {st.ok && <p className="alert alert-ok" role="status">{st.ok}</p>}
          {st.err && <p className="alert alert-err" role="alert">{st.err}</p>}
          <button className="btn btn-primary" disabled={st.busy}>{st.busy ? 'Sending…' : 'Send message'}</button>
        </form>
      </div></section>
    </>
  );
}
