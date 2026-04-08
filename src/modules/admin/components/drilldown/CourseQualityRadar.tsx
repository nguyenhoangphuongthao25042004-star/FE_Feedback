import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

import type { YeuToChatLuong } from '../../types/drilldown.types'

type CourseQualityRadarProps = {
  data: YeuToChatLuong[]
}

export default function CourseQualityRadar({ data }: CourseQualityRadarProps) {
  return (
    <div style={{ width: '100%', height: 280 }}>
      <ResponsiveContainer>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#EEF3FB" />
          <XAxis dataKey="ten" tick={{ fill: '#42546B', fontSize: 12 }} />
          <YAxis domain={[0, 5]} tick={{ fill: '#42546B', fontSize: 12 }} />
          <Tooltip formatter={(value) => [`${Number(value ?? 0).toFixed(1)} điểm`, 'Điểm']} />
          <Bar dataKey="diem" fill="#004286" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
