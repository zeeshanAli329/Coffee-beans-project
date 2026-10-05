import Link from 'next/link';
import PageHero from '@/components/PageHero';

export const metadata = { title: 'Features' };

const F = [
  ['🫘', 'Supreme Beans', 'Carefully sourced beans roasted in small batches for great taste.'],
  ['⭐', 'High Quality', 'Every cup is made to order by trained baristas.'],
  ['✨', 'Extraordinary', 'Signature drinks and seasonal specials you will not find elsewhere.'],
  ['💰', 'Affordable Price', 'Premium coffee at prices that are easy to afford.'],
  ['⏱️', 'Order Ahead', 'Choose a pickup time online and skip the queue.'],
  ['🧾', 'Order History', 'Create an account to view every order you have placed.'],
];

export default function Features() {
  return (
    <>
      <PageHero title="Features" subtitle="Everything that makes your Bean Scene morning better." />
      <section className="section"><div className="container">
        <div className="features">{F.map(([i, t, d]) => <div className="feature" key={t}><div className="ico">{i}</div><h3>{t}</h3><p className="muted">{d}</p></div>)}</div>
        <p className="center" style={{ marginTop: '2.5rem' }}><Link href="/menu" className="btn btn-primary">Order Now</Link></p>
      </div></section>
    </>
  );
}
