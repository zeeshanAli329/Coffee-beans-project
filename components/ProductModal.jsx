'use client';
import { useEffect, useState } from 'react';
import { useCart, useSettings } from './Providers';
import { CloseIcon } from './Icons';
import CupArt from './CupArt';

export default function ProductModal({ product, onClose }) {
  const { add } = useCart();
  const { money } = useSettings();
  const [qty, setQty] = useState(1);
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);
  const out = !product.isAvailable;
  return (
    <div className="modal-wrap" onClick={onClose}>
      <div className="modal product-modal" role="dialog" aria-modal="true" aria-label={product.name} onClick={(e) => e.stopPropagation()}>
        <button className="icon-btn modal-x" onClick={onClose} aria-label="Close"><CloseIcon /></button>
        <div className="pm-media">{product.image ? <img src={product.image} alt={product.name} /> : <CupArt />}</div>
        <div className="pm-body">
          <span className="tag">{product.category}</span>
          <h2>{product.name}</h2>
          <p className="rating">★ {Number(product.rating).toFixed(1)}</p>
          <p>{product.description || 'Made fresh to order.'}</p>
          <p className="price">{money(product.price)}</p>
          {out ? (
            <p className="alert alert-warn">Currently Unavailable</p>
          ) : (
            <div className="row gap">
              <div className="qty">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease">−</button>
                <span>{qty}</span>
                <button onClick={() => setQty((q) => Math.min(50, q + 1))} aria-label="Increase">+</button>
              </div>
              <button className="btn btn-primary" onClick={() => { add(product, qty); onClose(); }}>Add to Cart · {money(product.price * qty)}</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
