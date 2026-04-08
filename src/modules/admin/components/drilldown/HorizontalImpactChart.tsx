import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

import type { MucDoAnhHuong } from '../../types/drilldown.types'

type HorizontalImpactChartProps = {
  data: MucDoAnhHuong[]
}

export default function HorizontalImpactChart({ data }: HorizontalImpactChartProps) {
  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <BarChart data={data} layout="vertical" margin={{ left: 16 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#EEF3FB" />
          <XAxis type="number" domain={[0, 100]} tick={{ fill: '#42546B', fontSize: 12 }} />
          <YAxis type="category" dataKey="yeuTo" width={90} tick={{ fill: '#42546B', fontSize: 12 }} />
          <Tooltip formatter={(value) => [`${Number(value ?? 0)}%`, 'Mức độ ảnh hưởng']} />
          <Bar dataKey="mucDo" fill="#5FAE6F" radius={[0, 8, 8, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
