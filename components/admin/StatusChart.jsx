'use client';
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import ChartBox from './ChartBox';
import { cap } from '@/lib/format';

const STATUS_COLORS = { pending: '#eab308', confirmed: '#3b82c4', preparing: '#9b5de5', ready: '#14b8a6', completed: '#2e7d4f', cancelled: '#c0392b' };

export default function StatusChart({ distribution, loading }) {
  const data = Object.entries(distribution || {}).filter(([, v]) => v > 0).map(([k, v]) => ({ name: cap(k), key: k, value: v }));
  return (
    <ChartBox title="Order status distribution" loading={loading} empty={!data.length}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" outerRadius="80%" label={({ value }) => value}>
            {data.map((d) => <Cell key={d.key} fill={STATUS_COLORS[d.key]} />)}
          </Pie>
          <Tooltip /><Legend />
        </PieChart>
      </ResponsiveContainer>
    </ChartBox>
  );
}
