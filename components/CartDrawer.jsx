'use client';
import Link from 'next/link';
import { useEffect } from 'react';
import { useCart, useSettings } from './Providers';
import { CloseIcon } from './Icons';
import CupArt from './CupArt';

export default function CartDrawer() {
  const { items, open, closeCart, setQty, remove, clear, subtotal } = useCart();
  const { money } = useSettings();
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && closeCart();
    if (open) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, closeCart]);

  return (
    <>
      <div className={`overlay ${open ? 'show' : ''}`} onClick={closeCart} />
      <aside className={`drawer ${open ? 'open' : ''}`} aria-hidden={!open} aria-label="Your order">
        <div className="drawer-head">
          <h3>Your Order</h3>
          <button className="icon-btn" onClick={closeCart} aria-label="Close cart"><CloseIcon /></button>
        </div>
        <div className="drawer-body">
          {items.length === 0 ? (
            <p className="muted center">Your bag is empty. Pick a coffee from the menu to get started.</p>
          ) : (
            items.map((i) => (
              <div className="cart-row" key={i.id}>
                <div className="cart-thumb">{i.image ? <img src={i.image} alt="" /> : <CupArt />}</div>
                <div className="cart-info">
                  <strong>{i.name}</strong>
                  <span className="muted">{money(i.price)} each</span>
                  <div className="qty">
                    <button onClick={() => setQty(i.id, i.quantity - 1)} aria-label={`Decrease ${i.name}`}>−</button>
                    <span>{i.quantity}</span>
                    <button onClick={() => setQty(i.id, i.quantity + 1)} aria-label={`Increase ${i.name}`}>+</button>
                  </div>
                </div>
                <div className="cart-end">
                  <strong>{money(i.price * i.quantity)}</strong>
                  <button className="link-btn" onClick={() => remove(i.id)}>Remove</button>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="drawer-foot">
          <div className="row between"><span>Subtotal</span><span>{money(subtotal)}</span></div>
          <div className="row between total"><span>Total</span><strong>{money(subtotal)}</strong></div>
          {items.length > 0 ? (
            <>
              <Link href="/checkout" className="btn btn-primary block" onClick={closeCart}>Checkout</Link>
              <button className="btn btn-ghost block" onClick={clear}>Clear cart</button>
            </>
          ) : (
            <button className="btn btn-primary block" disabled>Checkout</button>
          )}
        </div>
      </aside>
    </>
  );
}
