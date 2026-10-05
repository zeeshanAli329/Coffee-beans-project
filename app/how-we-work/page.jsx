import PageHero from '@/components/PageHero';

export const metadata = { title: 'How We Work' };

export default function How() {
  return (
    <>
      <PageHero title="How We Work" subtitle="From your order to your first sip." />
      <section className="section"><div className="container prose">
        <ol className="steps" style={{ padding: 0 }}>
          <li><strong>Choose your coffee.</strong><br />Browse the menu, search or filter by category and add drinks to your bag.</li>
          <li><strong>Check out.</strong><br />Enter your name, phone and email, choose a pickup time and add any notes.</li>
          <li><strong>We confirm and prepare.</strong><br />Your order moves from pending to confirmed to preparing. You can follow it under My Orders.</li>
          <li><strong>Pick up and pay.</strong><br />When it is ready, collect it at the counter and pay in cash.</li>
        </ol>
      </div></section>
    </>
  );
}
