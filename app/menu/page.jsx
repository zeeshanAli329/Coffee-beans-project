import MenuSection from '@/components/MenuSection';
import PageHero from '@/components/PageHero';

export const metadata = { title: 'Menu' };

export default function MenuPage() {
  return (
    <>
      <PageHero title="Our Menu" subtitle="Hand-crafted coffee, teas, cold drinks and fresh bakes. Add to your bag and order ahead." />
      <section className="section"><div className="container"><MenuSection /></div></section>
    </>
  );
}
