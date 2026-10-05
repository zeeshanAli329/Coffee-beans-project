import Link from 'next/link';
import PageHero from '@/components/PageHero';
import { asset } from '@/lib/config';

export const metadata = { title: 'About Us' };

export default function About() {
  return (
    <>
      <PageHero title="About Bean Scene" subtitle="Quality coffee that helps boost your productivity and build your mood." />
      <section className="section">
        <div className="container split">
          <div className="prose">
            <h2 style={{ marginTop: 0 }}>Our story</h2>
            <p>Bean Scene is a coffee shop that provides you with quality coffee that helps boost your productivity and helps build your mood. We source supreme beans, roast them in small batches and serve every cup with a smile.</p>
            <p>Having a cup of coffee is good, but having a cup of real coffee is greater. Order ahead, pick a time that suits you and your coffee will be waiting at the counter.</p>
            <Link href="/menu" className="btn btn-primary">Explore the menu</Link>
          </div>
          <img src={asset('discover.png')} alt="Latte with heart latte art" loading="lazy" />
        </div>
      </section>
    </>
  );
}
