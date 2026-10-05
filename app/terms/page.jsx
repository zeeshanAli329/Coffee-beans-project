import PageHero from '@/components/PageHero';

export const metadata = { title: 'Terms of Service' };

export default function Terms() {
  return (
    <>
      <PageHero title="Terms of Service" />
      <section className="section"><div className="container prose">
        <p className="muted">These are starter terms. Have them reviewed to suit your business before going live.</p>
        <h2>Orders</h2><p>Orders are placed for pickup. Prices and availability may change; the price shown when you place the order is the price you pay.</p>
        <h2>Payment</h2><p>Payment is collected in cash when you pick up your order.</p>
        <h2>Cancellations</h2><p>Contact us as soon as possible to cancel. Orders already in preparation may not be cancellable.</p>
        <h2>Accounts &amp; privacy</h2><p>We store the details you provide (name, email, phone, order history) only to run your orders. Keep your password confidential.</p>
        <h2>Contact</h2><p>Questions about these terms? Use the contact page.</p>
      </div></section>
    </>
  );
}
