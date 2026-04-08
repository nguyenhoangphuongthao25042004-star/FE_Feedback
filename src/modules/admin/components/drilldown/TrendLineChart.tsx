import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

import type { DuLieuXuHuong } from '../../types/drilldown.types'

type TrendLineChartProps = {
  data: DuLieuXuHuong[]
}

export default function TrendLineChart({ data }: TrendLineChartProps) {
  return (
    <div style={{ width: '100%', height: 280 }}>
      <ResponsiveContainer>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#EEF3FB" />
          <XAxis dataKey="hocKy" tick={{ fill: '#42546B', fontSize: 12 }} />
          <YAxis domain={[0, 5]} tick={{ fill: '#42546B', fontSize: 12 }} />
          <Tooltip formatter={(value) => [`${Number(value ?? 0).toFixed(1)} điểm`, 'QI']} />
          <Legend formatter={() => 'Điểm QI'} />
          <Line type="monotone" dataKey="qi" stroke="#004286" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
