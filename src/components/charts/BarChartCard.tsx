import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

import type { DashboardScoreItem } from '../../modules/student/types/student.types'

type BarChartCardProps = {
  data: DashboardScoreItem[]
  title?: string
  subtitle?: string
}

type AxisTickProps = {
  x?: number
  y?: number
  payload?: {
    value?: string
  }
}

const shortSubjectNames: Record<string, string> = {
  'AI cơ bản và ứng dụng': 'AICBVUD',
  'Xây dựng phần mềm thiết bị di động': 'XDPMTBDD',
  'Xây dựng phần mềm web': 'XDPMW',
  'Thực tập tốt nghiệp': 'TTTN'
}

const getShortSubjectName = (subject: string) => shortSubjectNames[subject] ?? subject

const splitLabel = (value: string, maxLineLength = 14, maxLines = 3) => {
  const words = value.split(' ').filter(Boolean)

  if (words.length <= 1 || value.length <= maxLineLength) {
    return [value]
  }

  const lines: string[] = []
  let currentLine = ''

  words.forEach((word) => {
    const nextLine = currentLine ? `${currentLine} ${word}` : word

    if (nextLine.length <= maxLineLength) {
      currentLine = nextLine
      return
    }

    if (currentLine) {
      lines.push(currentLine)
    }

    currentLine = word
  })

  if (currentLine) {
    lines.push(currentLine)
  }

  if (lines.length <= maxLines) {
    return lines
  }

  const trimmedLines = lines.slice(0, maxLines)
  const lastLine = trimmedLines[maxLines - 1]
  trimmedLines[maxLines - 1] = lastLine.length > maxLineLength - 1
    ? `${lastLine.slice(0, maxLineLength - 1)}...`
    : `${lastLine}...`

  return trimmedLines
}

function AxisTick({ x = 0, y = 0, payload }: AxisTickProps) {
  const rawValue = String(payload?.value ?? '')
  const displayValue = getShortSubjectName(rawValue)
  const lines = splitLabel(displayValue)

  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0}
        y={0}
        dy={16}
        textAnchor="middle"
        fill="#42546B"
        fontSize={12}
      >
        {lines.map((line, index) => (
          <tspan key={`${displayValue}-${index}`} x={0} dy={index === 0 ? 0 : 14}>
            {line}
          </tspan>
        ))}
      </text>
    </g>
  )
}

export default function BarChartCard({ data, title, subtitle }: BarChartCardProps) {
  return (
    <div
      role="region"
      aria-label="Biểu đồ điểm theo môn học"
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
        <h3 style={{ margin: 0, color: '#163253', fontSize: 18 }}>{title ?? 'Điểm đánh giá các môn học'}</h3>
        <div style={{ color: '#42546B', fontSize: 13, marginTop: 4 }}>
          {subtitle ?? 'Cột xanh thể hiện điểm trung bình của từng môn học'}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={392}>
        <BarChart data={data} margin={{ top: 8, right: 12, left: -12, bottom: 84 }} barCategoryGap="24%">
          <CartesianGrid stroke="#E8EEF8" vertical={false} />
          <XAxis
            dataKey="subject"
            interval={0}
            height={84}
            tick={<AxisTick />}
            tickMargin={18}
            axisLine={false}
            tickLine={false}
          />
          <YAxis tick={{ fill: '#42546B', fontSize: 12 }} axisLine={false} tickLine={false} />
          <Tooltip />
          <Legend formatter={() => 'Điểm trung bình'} />
          <Bar dataKey="score" name="Điểm trung bình" fill="#004286" radius={[10, 10, 0, 0]} maxBarSize={60} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
