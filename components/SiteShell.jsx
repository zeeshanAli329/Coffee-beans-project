'use client';
import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';
import CartDrawer from './CartDrawer';

export default function SiteShell({ children }) {
  const pathname = usePathname();
  if (pathname.startsWith('/admin')) return children; // admin has its own shell
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
      <CartDrawer />
    </>
  );
}
