'use client';
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import ChartBox, { COLORS } from './ChartBox';
import { useSettings } from '../Providers';

export default function CategoryChart({ categories = [], loading }) {
  const { money } = useSettings();
  return (
    <ChartBox title="Sales by category" loading={loading} empty={!categories.length}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={categories} dataKey="revenue" nameKey="name" innerRadius="50%" outerRadius="80%" paddingAngle={2}>
            {categories.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
          </Pie>
          <Tooltip formatter={(v) => money(v)} /><Legend />
        </PieChart>
      </ResponsiveContainer>
    </ChartBox>
  );
}
