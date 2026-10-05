import Link from 'next/link';
import MenuSection from '@/components/MenuSection';
import Testimonials from '@/components/Testimonials';
import SubscribeForm from '@/components/SubscribeForm';
import { asset } from '@/lib/config';

const WHY = [
  ['🫘', 'Supreme Beans', 'Beans that provide great taste'],
  ['⭐', 'High Quality', 'We provide the highest quality'],
  ['✨', 'Extraordinary', 'Coffee like you have never tasted'],
  ['💰', 'Affordable Price', 'Our coffee prices are easy to afford'],
];

export default function Home() {
  return (
    <>
      <section className="hero" id="top">
        <img src={asset('hero.png')} alt="" />
        <div className="container reveal">
          <p className="lead">We&apos;ve got your morning covered with</p>
          <h1>Coffee</h1>
          <p>It is best to start your day with a cup of coffee. Discover the best flavours coffee you will ever have. We provide the best for our customers.</p>
          <Link href="/menu" className="btn btn-primary">Order Now</Link>
        </div>
      </section>

      <section className="section" id="about">
        <div className="container split">
          <div>
            <h2 className="section-title" style={{ textAlign: 'left' }}>Discover the best coffee</h2>
            <p>Bean Scene is a coffee shop that provides you with quality coffee that helps boost your productivity and helps build your mood. Having a cup of coffee is good, but having a cup of real coffee is greater. There is no doubt that you will enjoy this coffee more than others you have ever tasted.</p>
            <Link href="/about" className="btn btn-primary">Learn More</Link>
          </div>
          <img src={asset('discover.png')} alt="Latte with heart latte art" loading="lazy" />
        </div>
      </section>

      <section className="section alt" id="menu">
        <div className="container">
          <h2 className="section-title">Enjoy a new blend of coffee style</h2>
          <p className="section-sub">Explore all flavours of coffee with us. There is always a new cup worth experiencing.</p>
          <MenuSection />
        </div>
      </section>

      <section className="section" id="why">
        <div className="container">
          <h2 className="section-title">Why are we different?</h2>
          <p className="section-sub">We don&apos;t just make your coffee, we make your day!</p>
          <div className="features">
            {WHY.map(([ico, t, d]) => (
              <div className="feature" key={t}><div className="ico">{ico}</div><h3>{t}</h3><p className="muted">{d}</p></div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta">
        <div className="container">
          <h2>Great ideas start with great coffee. Let us help you achieve that.</h2>
          <p>Get started today.</p>
          <Link href="/signup" className="btn btn-primary">Join Us</Link>
        </div>
      </section>

      <section className="section banner">
        <div className="container split">
          <div>
            <h2>Get a chance to have an Amazing morning</h2>
            <p>We are giving you a one-time opportunity to experience a better life with coffee.</p>
            <Link href="/menu" className="btn btn-primary">Order Now</Link>
          </div>
          <img src={asset('banner.png')} alt="Takeaway coffee cup surrounded by flying coffee beans" loading="lazy" />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="section-title">Our coffee perfection feedback</h2>
          <p className="section-sub">Our customers have amazing things to say about us</p>
          <Testimonials />
        </div>
      </section>

      <section className="section subscribe" id="subscribe">
        <div className="container">
          <h2>Subscribe to get the Latest News</h2>
          <p>Don&apos;t miss out on our latest news, updates, tips and special offers</p>
          <SubscribeForm />
        </div>
      </section>
    </>
  );
}
