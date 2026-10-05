import { cap } from '@/lib/format';

export default function OrderStatusBadge({ status }) {
  return <span className={`badge b-${status}`}>{cap(status)}</span>;
}
