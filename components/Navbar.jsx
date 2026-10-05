'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth, useCart, useSettings } from './Providers';
import { BeanIcon, CartIcon, CloseIcon, MenuIcon } from './Icons';

const LINKS = [
  { href: '/', label: 'Home' },
  { href: '/menu', label: 'Menu' },
  { href: '/about', label: 'About Us' },
  { href: '/contact', label: 'Contact Us' },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut } = useAuth();
  const { count, openCart } = useCart();
  const { settings } = useSettings();
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [pathname]);

  const logout = () => { signOut(); router.push('/'); };
  const isActive = (h) => (h === '/' ? pathname === '/' : pathname.startsWith(h));

  return (
    <header className="nav">
      <div className="container nav-inner">
        <Link href="/" className="brand"><BeanIcon /> {settings.shopName}</Link>
        <nav className={`nav-links ${open ? 'open' : ''}`} aria-label="Main">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className={isActive(l.href) ? 'active' : ''}>{l.label}</Link>
          ))}
          <div className="nav-auth">
            {user ? (
              <>
                {user.role === 'admin' && <Link href="/admin">Admin</Link>}
                <Link href="/orders" className={isActive('/orders') ? 'active' : ''}>My Orders</Link>
                <Link href="/profile" className={isActive('/profile') ? 'active' : ''}>{user.name.split(' ')[0]}</Link>
                <button className="btn btn-ghost-light btn-sm" onClick={logout}>Logout</button>
              </>
            ) : (
              <>
                <Link href="/login">Login</Link>
                <Link href="/signup" className="btn btn-primary btn-sm">Sign Up</Link>
              </>
            )}
          </div>
        </nav>
        <div className="nav-actions">
          <button className="cart-btn" onClick={openCart} aria-label={`Open cart, ${count} items`}>
            <CartIcon /><span className="cart-badge">{count}</span>
          </button>
          <button className="burger" onClick={() => setOpen((v) => !v)} aria-label="Toggle menu" aria-expanded={open}>
            {open ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>
    </header>
  );
}
