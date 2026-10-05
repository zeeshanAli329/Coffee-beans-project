'use client';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import ChartBox from './ChartBox';

export default function BestSellersChart({ products = [], loading }) {
  return (
    <ChartBox title="Best-selling products (units)" loading={loading} empty={!products.length}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={products} layout="vertical" margin={{ top: 4, right: 16, left: 8, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e6e8ee" />
          <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11 }} />
          <YAxis type="category" dataKey="name" width={104} tick={{ fontSize: 11 }} />
          <Tooltip />
          <Bar dataKey="quantity" name="Units sold" fill="#d9893b" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartBox>
  );
}
