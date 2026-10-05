'use client';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import ChartBox from './ChartBox';
import { useSettings } from '../Providers';

export default function SalesChart({ series = [], loading }) {
  const { money } = useSettings();
  return (
    <ChartBox title="Sales revenue" wide loading={loading} empty={!series.some((s) => s.revenue > 0)}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={series} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
          <defs><linearGradient id="rev" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#d9893b" stopOpacity={0.5} /><stop offset="100%" stopColor="#d9893b" stopOpacity={0.02} /></linearGradient></defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e6e8ee" />
          <XAxis dataKey="label" tick={{ fontSize: 11 }} minTickGap={24} />
          <YAxis tick={{ fontSize: 11 }} width={56} tickFormatter={(v) => money(v).replace('.00', '')} />
          <Tooltip formatter={(v) => [money(v), 'Revenue']} />
          <Area type="monotone" dataKey="revenue" stroke="#b86f28" strokeWidth={2} fill="url(#rev)" />
        </AreaChart>
      </ResponsiveContainer>
    </ChartBox>
  );
}
