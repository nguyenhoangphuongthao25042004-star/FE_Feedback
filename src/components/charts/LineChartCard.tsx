import { Line, LineChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

type LinePoint = {
  name: string
  value: number
}

export default function LineChartCard({ data }: { data: LinePoint[] }) {
  return (
    <div
      role="region"
      aria-label="Biểu đồ xu hướng"
      style={{
        height: '100%',
        width: '100%',
        minHeight: 520,
        background: '#FFFFFF',
        border: '1px solid #D7E1F0',
        borderRadius: 20,
        padding: 16,
        boxShadow: '0 14px 30px rgba(28, 61, 102, 0.08)'
      }}
    >
      <div style={{ marginBottom: 12 }}>
        <h3 style={{ margin: 0, color: '#163253', fontSize: 18 }}>Chỉ số chất lượng giảng dạy theo học kỳ</h3>
        <div style={{ color: '#42546B', fontSize: 13, marginTop: 4 }}>Xu hướng chỉ số chất lượng theo các học kỳ</div>
      </div>

      <ResponsiveContainer width="100%" height={360}>
        <LineChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 20 }}>
          <CartesianGrid stroke="#E8EEF8" vertical={false} />
          <XAxis dataKey="name" tick={{ fill: '#42546B', fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: '#42546B', fontSize: 12 }} axisLine={false} tickLine={false} domain={[0, 8]} ticks={[0, 2, 4, 6, 8]} />
          <Tooltip />
          {/* custom hollow marker: outer ring with white fill */}
          {/**
           * Recharts will call this function for each dot. We return an SVG group
           * containing an outer stroked circle with white fill to create the hollow
           * appearance shown in the screenshot.
           */}
          <Line
            type="monotone"
            dataKey="value"
            stroke="#004286"
            strokeWidth={3}
            dot={(props: { cx?: number; cy?: number }) => {
              const { cx, cy } = props
              if (cx == null || cy == null) return null
              return (
                <g>
                  <circle cx={cx} cy={cy} r={8} stroke="#004286" strokeWidth={3} fill="#ffffff" />
                </g>
              )
            }}
            activeDot={(props: { cx?: number; cy?: number }) => {
              const { cx, cy } = props
              if (cx == null || cy == null) return null
              return (
                <g>
                  <circle cx={cx} cy={cy} r={9} stroke="#01263b" strokeWidth={2} fill="#ffffff" />
                </g>
              )
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
