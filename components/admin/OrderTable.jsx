'use client';
import Link from 'next/link';
import OrderStatusBadge from './OrderStatusBadge';
import { useSettings } from '../Providers';
import { cap, fmtDateTime } from '@/lib/format';

export default function OrderTable({ orders }) {
  const { money } = useSettings();
  return (
    <div className="tbl-wrap">
      <table className="tbl responsive">
        <thead><tr>
          <th>Order</th><th>Customer</th><th>Phone</th><th>Email</th><th>Products</th><th>Qty</th><th>Total</th>
          <th>Payment</th><th>Status</th><th>Pickup</th><th>Date</th><th />
        </tr></thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o._id}>
              <td data-label="Order"><Link href={`/admin/orders/${o._id}`}><strong>{o.orderNumber}</strong></Link></td>
              <td data-label="Customer">{o.customerName}</td>
              <td data-label="Phone">{o.phone}</td>
              <td data-label="Email">{o.email}</td>
              <td data-label="Products">{o.items.map((i) => `${i.quantity}× ${i.name}`).join(', ')}</td>
              <td data-label="Qty">{o.items.reduce((s, i) => s + i.quantity, 0)}</td>
              <td data-label="Total"><strong>{money(o.total)}</strong></td>
              <td data-label="Payment"><span className={`badge b-${o.paymentStatus}`}>{cap(o.paymentStatus)}</span></td>
              <td data-label="Status"><OrderStatusBadge status={o.orderStatus} /></td>
              <td data-label="Pickup">{fmtDateTime(o.pickupTime)}</td>
              <td data-label="Date">{fmtDateTime(o.createdAt)}</td>
              <td data-label=""><Link className="btn btn-ghost btn-sm" href={`/admin/orders/${o._id}`}>View</Link></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
