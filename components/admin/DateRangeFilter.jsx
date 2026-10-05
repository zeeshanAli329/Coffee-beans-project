'use client';
export const RANGES = [
  ['today', 'Today'], ['yesterday', 'Yesterday'], ['last7', 'Last 7 days'], ['last30', 'Last 30 days'],
  ['thisMonth', 'This month'], ['lastMonth', 'Last month'], ['thisYear', 'This year'], ['custom', 'Custom range'],
];

export default function DateRangeFilter({ value, onChange }) {
  const set = (patch) => onChange({ ...value, ...patch });
  return (
    <div className="filters">
      <select value={value.range} onChange={(e) => set({ range: e.target.value })} aria-label="Date range">
        {RANGES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
      </select>
      {value.range === 'custom' && (
        <>
          <input type="date" value={value.from || ''} max={value.to || undefined} onChange={(e) => set({ from: e.target.value })} aria-label="From date" />
          <span>to</span>
          <input type="date" value={value.to || ''} min={value.from || undefined} onChange={(e) => set({ to: e.target.value })} aria-label="To date" />
        </>
      )}
    </div>
  );
}
