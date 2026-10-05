import PageHero from '@/components/PageHero';

export const metadata = { title: 'FAQ' };

const QA = [
  ['How do I place an order?', 'Add drinks to your bag from the Menu, open the bag and press Checkout. Enter your details, choose a pickup time and place your order. You will get an order number straight away.'],
  ['Do I need an account?', 'No. You can check out as a guest. An account lets you see your previous orders and save your details.'],
  ['How do I pay?', 'Payment is currently Cash on Pickup. You pay at the counter when you collect your order.'],
  ['Can I change or cancel an order?', 'Please contact us as soon as possible with your order number. Orders that are already being prepared cannot be cancelled.'],
  ['How long will my order take?', 'Most orders are ready in 10–15 minutes. Choose a later pickup time if you want to plan ahead.'],
  ['What if an item is unavailable?', 'Unavailable items are marked "Currently Unavailable" and cannot be added to your bag.'],
];

export default function FAQ() {
  return (
    <>
      <PageHero title="Frequently Asked Questions" />
      <section className="section"><div className="container prose faq">
        {QA.map(([q, a]) => <details key={q}><summary>{q}</summary><p>{a}</p></details>)}
      </div></section>
    </>
  );
}
