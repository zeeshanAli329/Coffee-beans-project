import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="section center container">
      <h1 style={{ fontFamily: 'var(--serif)', fontSize: '4rem' }}>404</h1>
      <p className="muted">We couldn&apos;t find that page.</p>
      <Link href="/" className="btn btn-primary">Back to home</Link>
    </section>
  );
}
