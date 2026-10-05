'use client';
import OrderStatusBadge from './admin/OrderStatusBadge';
import { useSettings } from './Providers';
import { cap, fmtDateTime } from '@/lib/format';

// Shared by customer order pages and the admin order view.
export default function OrderDetails({ order }) {
  const { money } = useSettings();
  return (
    <>
      <div className="row between" style={{ flexWrap: 'wrap', gap: '.6rem' }}>
        <h2 style={{ margin: 0 }}>{order.orderNumber}</h2><OrderStatusBadge status={order.orderStatus} />
      </div>
      <dl className="kv">
        <dt>Customer</dt><dd>{order.customerName}</dd>
        <dt>Phone</dt><dd>{order.phone}</dd>
        <dt>Email</dt><dd>{order.email}</dd>
        <dt>Pickup time</dt><dd>{fmtDateTime(order.pickupTime)}</dd>
        <dt>Payment</dt><dd>{order.paymentMethod === 'cash' ? 'Cash on Pickup' : cap(order.paymentMethod)} · <span className={`badge b-${order.paymentStatus}`}>{cap(order.paymentStatus)}</span></dd>
        <dt>Notes</dt><dd>{order.notes || '—'}</dd>
        <dt>Placed</dt><dd>{fmtDateTime(order.createdAt)}</dd>
      </dl>
      <h3>Items</h3>
      {order.items.map((i, idx) => (
        <div className="summary-row" key={idx}><span>{i.quantity} × {i.name} <span className="muted">({money(i.price)})</span></span><span>{money(i.subtotal)}</span></div>
      ))}
      <div className="summary-row"><span>Subtotal</span><span>{money(order.subtotal)}</span></div>
      <div className="total-line"><span>Total</span><span>{money(order.total)}</span></div>
    </>
  );
}
