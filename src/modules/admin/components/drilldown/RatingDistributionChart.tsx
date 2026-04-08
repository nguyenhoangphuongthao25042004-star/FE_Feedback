import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

import type { PhanPhoiDanhGia } from '../../types/drilldown.types'

type RatingDistributionChartProps = {
  data: PhanPhoiDanhGia[]
}

export default function RatingDistributionChart({ data }: RatingDistributionChartProps) {
  return (
    <div style={{ width: '100%', height: 280 }}>
      <ResponsiveContainer>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#EEF3FB" />
          <XAxis dataKey="sao" tick={{ fill: '#42546B', fontSize: 12 }} />
          <YAxis allowDecimals={false} tick={{ fill: '#42546B', fontSize: 12 }} />
          <Tooltip formatter={(value) => [`${Number(value ?? 0)} lượt`, 'Số lượng']} />
          <Bar dataKey="soLuong" fill="#2B7AC4" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
