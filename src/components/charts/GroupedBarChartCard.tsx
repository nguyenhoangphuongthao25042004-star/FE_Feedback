import { useEffect, useMemo, useState } from 'react'
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

type GroupedBarChartRow = {
  subject: string
  noiDung: number
  phuongPhap: number
  taiLieu: number
  hoTro: number
  tuongTac: number
}

type GroupedBarChartCardProps = {
  data: GroupedBarChartRow[]
}

const PAGE_SIZE = 3

type AxisTickProps = {
  x?: number
  y?: number
  payload?: {
    value?: string
  }
}

const SERIES = [
  { key: 'noiDung', label: 'Nội dung', color: '#004286' },
  { key: 'phuongPhap', label: 'Phương pháp', color: '#2F80ED' },
  { key: 'taiLieu', label: 'Tài liệu', color: '#F2B94B' },
  { key: 'hoTro', label: 'Hỗ trợ', color: '#27AE60' }
  , { key: 'tuongTac', label: 'Tương tác', color: '#9B51E0' }
] as const

const splitLabel = (value: string, maxLineLength = 18, maxLines = 3) => {
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
  const value = String(payload?.value ?? '')
  const lines = splitLabel(value)

  return (
    <g transform={`translate(${x},${y})`}>
      <text x={0} y={0} dy={16} textAnchor="middle" fill="#42546B" fontSize={12}>
        {lines.map((line, index) => (
          <tspan key={`${value}-${index}`} x={0} dy={index === 0 ? 0 : 14}>
            {line}
          </tspan>
        ))}
      </text>
    </g>
  )
}

function CustomLegend() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: 20, paddingBottom: 12 }}>
      {SERIES.map((series) => (
        <div key={series.key} style={{ display: 'flex', alignItems: 'center', gap: 8, color: series.color, fontSize: 14, fontWeight: 500 }}>
          <span style={{ width: 18, height: 12, borderRadius: 2, background: series.color, display: 'inline-block' }} />
          <span>{series.label}</span>
        </div>
      ))}
    </div>
  )
}

export default function GroupedBarChartCard({ data }: GroupedBarChartCardProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const totalPages = Math.max(Math.ceil(data.length / PAGE_SIZE), 1)

  useEffect(() => {
    if (currentPage > totalPages) {
      const t = window.setTimeout(() => setCurrentPage(totalPages), 0)
      return () => clearTimeout(t)
    }
    return undefined
  }, [currentPage, totalPages])

  const pagedData = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE
    return data.slice(startIndex, startIndex + PAGE_SIZE)
  }, [currentPage, data])

  return (
    <div
  role="region"
  aria-label="Biểu đồ cột nhóm chất lượng môn học"
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
        <h3 style={{ margin: 0, color: '#163253', fontSize: 18 }}>So sánh chất lượng theo từng môn học</h3>
        <div style={{ color: '#42546B', fontSize: 13, marginTop: 4 }}>
          Mỗi trang hiển thị 3 môn học để dashboard gọn và dễ theo dõi khi dữ liệu tăng lên
        </div>
      </div>

      <ResponsiveContainer width="100%" height={392}>
        <BarChart data={pagedData} margin={{ top: 8, right: 16, left: -12, bottom: 84 }} barCategoryGap="18%">
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
          <YAxis
            domain={[0, 5]}
            ticks={[0, 1, 2, 3, 4, 5]}
            tick={{ fill: '#42546B', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip />
          <Legend content={<CustomLegend />} />
          {SERIES.map((series) => (
            <Bar
              key={series.key}
              dataKey={series.key}
              name={series.label}
              fill={series.color}
              radius={[8, 8, 0, 0]}
              maxBarSize={28}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>

      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 10, marginTop: 12 }}>
          <div style={{ color: '#42546B', fontSize: 13 }}>
            {currentPage}/{totalPages}
          </div>
          <button
            type="button"
            aria-label="Trang trước"
            onClick={() => setCurrentPage((page) => Math.max(page - 1, 1))}
            disabled={currentPage === 1}
            style={{
              width: 36,
              height: 36,
              border: '1px solid #D7E1F0',
              background: currentPage === 1 ? '#F5F7FB' : '#FFFFFF',
              color: currentPage === 1 ? '#9AA8BC' : '#163253',
              borderRadius: 999,
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
              fontWeight: 700,
              fontSize: 18,
              lineHeight: 1
            }}
          >
            ←
          </button>
          <button
            type="button"
            aria-label="Trang sau"
            onClick={() => setCurrentPage((page) => Math.min(page + 1, totalPages))}
            disabled={currentPage === totalPages}
            style={{
              width: 36,
              height: 36,
              border: '1px solid #D7E1F0',
              background: currentPage === totalPages ? '#F5F7FB' : '#FFFFFF',
              color: currentPage === totalPages ? '#9AA8BC' : '#163253',
              borderRadius: 999,
              cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
              fontWeight: 700,
              fontSize: 18,
              lineHeight: 1
            }}
          >
            →
          </button>
        </div>
      )}
    </div>
  )
}
