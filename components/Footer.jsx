'use client';
import Link from 'next/link';
import { useSettings } from './Providers';
import { BeanIcon } from './Icons';

const SOCIAL = [
  ['Facebook', 'https://facebook.com'], ['Instagram', 'https://instagram.com'],
  ['Twitter', 'https://twitter.com'], ['YouTube', 'https://youtube.com'],
];

export default function Footer() {
  const { settings: s } = useSettings();
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <Link href="/" className="brand"><BeanIcon /> {s.shopName}</Link>
          <p>Hand-crafted coffee from carefully sourced beans, roasted in small batches and served with a smile. Your morning, covered.</p>
          <div className="social">
            {SOCIAL.map(([n, h]) => <a key={n} href={h} target="_blank" rel="noopener noreferrer" aria-label={n}>{n[0]}</a>)}
          </div>
        </div>
        <div>
          <h4>About</h4>
          <Link href="/menu">Menu</Link><Link href="/features">Features</Link>
          <Link href="/blog">News &amp; Blogs</Link><Link href="/help">Help &amp; Supports</Link>
        </div>
        <div>
          <h4>Company</h4>
          <Link href="/how-we-work">How we work</Link><Link href="/terms">Terms of service</Link>
          <Link href="/pricing">Pricing</Link><Link href="/faq">FAQ</Link>
        </div>
        <div>
          <h4>Contact Us</h4>
          <p>{s.address}</p>
          <a href={`tel:${s.phone.replace(/[^+\d]/g, '')}`}>{s.phone}</a>
          <a href={`mailto:${s.email}`}>{s.email}</a>
          <Link href="/">{s.website}</Link>
        </div>
      </div>
      <div className="container footer-bottom">© {new Date().getFullYear()} {s.shopName}. All rights reserved.</div>
    </footer>
  );
}
