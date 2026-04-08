import { Card } from 'antd'
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

import type { QITrendPoint } from './dashboard.types'

type QITrendChartProps = {
  data: QITrendPoint[]
  onNavigateDetail?: (semester: string) => void
}

export default function QITrendChart({ data, onNavigateDetail }: QITrendChartProps) {
  return (
    <Card
      style={{
        width: '100%',
        minHeight: 470,
        border: '1px solid #D7E1F0',
        borderRadius: 20,
        boxShadow: '0 14px 30px rgba(28,61,102,0.08)'
      }}
      bodyStyle={{ padding: 16 }}
    >
      <div style={{ marginBottom: 12 }}>
        <h3 style={{ margin: 0, color: '#163253', fontSize: 18, fontWeight: 800 }}>Xu hướng QI theo học kỳ</h3>
        <div style={{ color: '#42546B', fontSize: 13, marginTop: 4 }}>
          Nhấp vào điểm dữ liệu để đi đến trang chi tiết theo học kỳ.
        </div>
      </div>

      <ResponsiveContainer width="100%" height={360}>
        <LineChart
          data={data}
          margin={{ top: 8, right: 12, left: 8, bottom: 24 }}
          onClick={(event) => {
            if (event?.activeLabel && onNavigateDetail) {
              onNavigateDetail(String(event.activeLabel))
            }
          }}
        >
          <CartesianGrid stroke="#E8EEF8" vertical={false} />
          <XAxis
            dataKey="semester"
            tick={{ fill: '#42546B', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            interval={0}
            minTickGap={0}
            height={44}
            tickMargin={10}
            padding={{ left: 10, right: 36 }}
          />
          <YAxis
            dataKey="qiAvg"
            tick={{ fill: '#42546B', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            domain={[2.5, 5]}
            ticks={[2.5, 3, 3.5, 4, 4.5, 5]}
          />
          <Tooltip
            formatter={(value) => [Number(value ?? 0).toFixed(2), 'QI trung bình']}
            labelFormatter={(label) => `Học kỳ: ${label}`}
          />
          <Line
            type="monotone"
            dataKey="qiAvg"
            stroke="#004286"
            strokeWidth={3}
            dot={{ r: 6, stroke: '#004286', strokeWidth: 2, fill: '#ffffff' }}
            activeDot={{ r: 8, stroke: '#01263b', strokeWidth: 2, fill: '#ffffff' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  )
}
