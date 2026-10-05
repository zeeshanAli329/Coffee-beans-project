import Link from 'next/link';
import PageHero from '@/components/PageHero';

export const metadata = { title: 'Help & Support' };

export default function Help() {
  return (
    <>
      <PageHero title="Help & Support" subtitle="We are here to help with your order." />
      <section className="section"><div className="container features">
        <Link href="/faq" className="feature"><div className="ico">❓</div><h3>FAQ</h3><p className="muted">Quick answers to common questions.</p></Link>
        <Link href="/contact" className="feature"><div className="ico">✉️</div><h3>Contact us</h3><p className="muted">Send us a message and we will reply soon.</p></Link>
        <Link href="/orders" className="feature"><div className="ico">🧾</div><h3>My orders</h3><p className="muted">Check the status of your orders.</p></Link>
        <Link href="/how-we-work" className="feature"><div className="ico">⚙️</div><h3>How we work</h3><p className="muted">From order to pickup, step by step.</p></Link>
      </div></section>
    </>
  );
}
