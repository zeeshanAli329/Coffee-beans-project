'use client';
import { useCart, useSettings } from './Providers';
import CupArt from './CupArt';

export default function ProductCard({ product, onOpen }) {
  const { add } = useCart();
  const { money } = useSettings();
  const out = !product.isAvailable;
  return (
    <article className={`pcard ${out ? 'is-out' : ''}`}>
      <button className="pcard-media" onClick={() => onOpen(product)} aria-label={`View ${product.name}`}>
        {product.image ? <img src={product.image} alt={product.name} loading="lazy" /> : <CupArt />}
        {out && <span className="pcard-flag">Currently Unavailable</span>}
      </button>
      <div className="pcard-body">
        <div className="between row"><h3>{product.name}</h3><span className="rating">★ {Number(product.rating).toFixed(1)}</span></div>
        <p className="muted clamp">{product.description}</p>
        <div className="pcard-foot">
          <strong>{money(product.price)}</strong>
          <button className="btn btn-primary btn-sm" disabled={out} onClick={() => add(product)}>
            {out ? 'Unavailable' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </article>
  );
}
