'use client';
import { useSettings } from '../Providers';

export default function ProductTable({ products, onEdit, onDelete, onToggle }) {
  const { money } = useSettings();
  return (
    <div className="tbl-wrap">
      <table className="tbl responsive">
        <thead><tr><th /><th>Name</th><th>Category</th><th>Price</th><th>Rating</th><th>Status</th><th>Actions</th></tr></thead>
        <tbody>
          {products.map((p) => (
            <tr key={p._id}>
              <td data-label="">{p.image ? <img className="thumb" src={p.image} alt="" /> : <div className="thumb" />}</td>
              <td data-label="Name"><strong>{p.name}</strong><br /><small style={{ color: '#6b7280' }}>{p.description?.slice(0, 60)}</small></td>
              <td data-label="Category">{p.category}</td>
              <td data-label="Price">{money(p.price)}</td>
              <td data-label="Rating">★ {Number(p.rating).toFixed(1)}</td>
              <td data-label="Status"><span className={`badge ${p.isAvailable ? 'b-completed' : 'b-cancelled'}`}>{p.isAvailable ? 'Available' : 'Disabled'}</span></td>
              <td data-label="Actions"><div className="actions">
                <button className="btn btn-ghost btn-sm" onClick={() => onEdit(p)}>Edit</button>
                <button className="btn btn-ghost btn-sm" onClick={() => onToggle(p)}>{p.isAvailable ? 'Disable' : 'Enable'}</button>
                <button className="btn btn-danger btn-sm" onClick={() => onDelete(p)}>Delete</button>
              </div></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
