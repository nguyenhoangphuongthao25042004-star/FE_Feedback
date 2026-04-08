import { Card } from 'antd'
import { Bar, BarChart, CartesianGrid, Cell, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

import type { RankingItem } from './dashboard.types'

type RankingBarChartProps = {
  title: string
  subtitle: string
  data: RankingItem[]
  tone?: 'positive' | 'negative' | 'neutral'
  onSelect?: (item: RankingItem) => void
}

type AxisTickProps = {
  x?: number
  y?: number
  payload?: {
    value?: string
  }
}

const toneColor: Record<NonNullable<RankingBarChartProps['tone']>, string> = {
  positive: '#1DA57A',
  negative: '#D9534F',
  neutral: '#004286'
}

function splitLabelToLines(value: string, maxLength = 18) {
  const words = value.split(' ').filter(Boolean)
  if (words.length === 0) return ['']

  const lines: string[] = []
  let current = ''

  words.forEach((word) => {
    const next = current ? `${current} ${word}` : word
    if (next.length <= maxLength) {
      current = next
      return
    }

    if (current) {
      lines.push(current)
    }
    current = word
  })

  if (current) lines.push(current)
  if (lines.length <= 2) return lines

  // Keep full text while preventing too many rows per tick.
  return [lines[0], lines.slice(1).join(' ')]
}

function LeftAlignedAxisTick({ x = 0, y = 0, payload }: AxisTickProps) {
  const value = String(payload?.value ?? '')
  const lines = splitLabelToLines(value)

  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={-176}
        y={0}
        dy={4}
        textAnchor="start"
        fill="#274566"
        fontSize={12}
      >
        {lines.map((line, index) => (
          <tspan key={`${value}-${index}`} x={-176} dy={index === 0 ? 0 : 14}>
            {line}
          </tspan>
        ))}
      </text>
    </g>
  )
}

export default function RankingBarChart({
  title,
  subtitle,
  data,
  tone = 'neutral',
  onSelect
}: RankingBarChartProps) {
  const color = toneColor[tone]
  const avgScore = data.length > 0
    ? Number((data.reduce((sum, item) => sum + item.score, 0) / data.length).toFixed(2))
    : 0

  return (
    <Card
      style={{
        width: '100%',
        minHeight: 540,
        border: '1px solid #DCE7F6',
        borderRadius: 20,
        boxShadow: '0 14px 30px rgba(28,61,102,0.08)',
        background: 'linear-gradient(180deg, #FFFFFF 0%, #FAFCFF 100%)'
      }}
      bodyStyle={{ padding: 18 }}
    >
      <div style={{ marginBottom: 12, display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center' }}>
        <div>
          <h3 style={{ margin: 0, color: '#163253', fontSize: 22, fontWeight: 800, lineHeight: 1.2 }}>{title}</h3>
          <div style={{ color: '#42546B', fontSize: 13, marginTop: 6 }}>{subtitle}</div>
        </div>

        <div style={{
          minWidth: 0,
          background: '#F2F7FF',
          border: '1px solid #DCE7F6',
          borderRadius: 999,
          padding: '4px 10px',
          textAlign: 'left',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          whiteSpace: 'nowrap'
        }}>
          <span style={{ color: '#5A6F8C', fontSize: 11, fontWeight: 600 }}>Điểm TB:</span>
          <span style={{ color: '#163253', fontSize: 14, fontWeight: 800 }}>{avgScore.toFixed(2)}</span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={420}>
        <BarChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 8 }} layout="vertical" barCategoryGap="20%">
          <CartesianGrid stroke="#E8EEF8" horizontal={false} />
          <XAxis
            type="number"
            domain={[0, 5]}
            ticks={[0, 1, 2, 3, 4, 5]}
            tick={{ fill: '#58708F', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="label"
            tick={<LeftAlignedAxisTick />}
            axisLine={false}
            tickLine={false}
            width={190}
          />
          <Tooltip
            cursor={{ fill: 'rgba(76, 119, 173, 0.08)' }}
            contentStyle={{ borderRadius: 12, border: '1px solid #DCE7F6', boxShadow: '0 10px 24px rgba(28,61,102,0.12)' }}
            formatter={(value) => [Number(value ?? 0).toFixed(2), 'QI trung bình']}
            labelFormatter={(label) => `Đối tượng: ${label}`}
          />
          <Bar
            dataKey="score"
            radius={[999, 999, 999, 999]}
            maxBarSize={24}
            background={{ fill: '#EEF3FB', radius: 999 }}
          >
            {data.map((item) => (
              <Cell
                key={item.id}
                fill={color}
                style={{ cursor: onSelect ? 'pointer' : 'default' }}
                onClick={() => onSelect?.(item)}
              />
            ))}
            <LabelList
              dataKey="score"
              position="right"
              formatter={(value) => Number(value ?? 0).toFixed(2)}
              style={{ fill: '#163253', fontSize: 11, fontWeight: 700 }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Card>
  )
}
