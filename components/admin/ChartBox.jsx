'use client';
export const COLORS = ['#d9893b', '#6b4430', '#2e7d4f', '#3b82c4', '#9b5de5', '#c0392b', '#14b8a6', '#eab308'];

// Card with a fixed-height box so Recharts' ResponsiveContainer can size itself.
export default function ChartBox({ title, empty, loading, children, wide }) {
  return (
    <div className={`a-card ${wide ? 'wide' : ''}`}>
      <h3>{title}</h3>
      <div className="chart-box">
        {loading ? <div className="state"><span className="spinner" /> Loading…</div>
          : empty ? <div className="state">No data for this period yet.</div> : children}
      </div>
    </div>
  );
}
