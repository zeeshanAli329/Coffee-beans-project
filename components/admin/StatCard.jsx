export default function StatCard({ label, value, icon, color = '#d9893b' }) {
  return (
    <div className="a-card stat">
      <div className="ico" style={{ background: `${color}22`, color }}>{icon}</div>
      <div><small>{label}</small><strong>{value}</strong></div>
    </div>
  );
}
