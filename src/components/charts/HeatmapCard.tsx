import React, { useMemo, useState } from 'react'

type HeatmapRow = {
  course: string
  clarity: number
  fairness: number
  interaction: number
  support: number
  motivation: number
  course_fit: number
}

type HeatmapCardProps = {
  data?: HeatmapRow[]
  loading?: boolean
  maxRows?: number
}

const FACTORS = ['clarity', 'fairness', 'interaction', 'support', 'motivation', 'course_fit'] as const
const FACTOR_LABELS: Record<typeof FACTORS[number], string> = {
  clarity: 'Rõ ràng',
  fairness: 'Công bằng',
  interaction: 'Tương tác',
  support: 'Hỗ trợ',
  motivation: 'Động lực',
  course_fit: 'Phù hợp môn'
}
const GRID_TEMPLATE_COLUMNS = '220px repeat(6, minmax(56px, 1fr))'

const cardStyle = {
  width: '100%',
  background: '#FFFFFF',
  border: '1px solid #D7E1F0',
  borderRadius: 20,
  padding: 16,
  boxShadow: '0 14px 30px rgba(28, 61, 102, 0.08)'
} as const

function getColor(value: number) {
  if (value >= 4.5) return { background: '#003F7F', color: '#ffffff' }
  if (value >= 4.0) return { background: '#0058B3', color: '#ffffff' }
  if (value >= 3.0) return { background: '#F3C623', color: '#163253' }
  if (value >= 2.0) return { background: '#F29A2E', color: '#163253' }
  return { background: '#D9534F', color: '#ffffff' }
}

export default function HeatmapCard({ data = [], loading = false, maxRows = 15 }: HeatmapCardProps) {
  const rows = useMemo(() => data.slice(0, maxRows), [data, maxRows])
  const [tooltip, setTooltip] = useState<{ x: number; y: number; content: string } | null>(null)
  const [hoveredRow, setHoveredRow] = useState<string | null>(null)

  const handleCellMouseEnter = (e: React.MouseEvent, course: string, factor: string, value: number) => {
    const x = (e.nativeEvent as MouseEvent).clientX + 12
    const y = (e.nativeEvent as MouseEvent).clientY + 12
  const label = (FACTOR_LABELS as Record<string, string>)[factor] ?? factor.replace('_', ' ')
  const content = `${course} - ${label}: ${value.toFixed(1)}`
    setTooltip({ x, y, content })
  }

  const renderHeader = () => (
    <div style={{ marginBottom: 12 }}>
      <h3 style={{ margin: 0, color: '#163253', fontSize: 18 }}>Bản đồ nhiệt chất lượng môn học</h3>
      <div style={{ color: '#42546B', fontSize: 13, marginTop: 4 }}>
        Mỗi ô hiển thị giá trị (1-5) theo các yếu tố chất lượng
      </div>
    </div>
  )

  if (loading) {
    return (
      <div style={cardStyle}>
        {renderHeader()}
        <div className="animate-pulse">
          <div className="h-6 w-1/3 bg-gray-200 rounded mb-4" />
          <div className="h-6 w-full bg-gray-100 rounded mb-2" />
          <div className="h-6 w-full bg-gray-100 rounded mb-2" />
          <div className="h-6 w-3/4 bg-gray-100 rounded" />
        </div>
      </div>
    )
  }

  if (!rows.length) {
    return (
      <div style={cardStyle}>
        {renderHeader()}
        <div className="py-6 text-center text-gray-500">Không có dữ liệu để hiển thị</div>
      </div>
    )
  }

  return (
    <>
      <div role="region" aria-label="Bản đồ nhiệt chất lượng môn học" style={cardStyle}>
        {renderHeader()}

        <div className="w-full overflow-auto" style={{ maxWidth: '100%' }}>
          <div style={{ width: '100%' }}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: GRID_TEMPLATE_COLUMNS,
                gap: 12,
                alignItems: 'center',
                position: 'sticky',
                top: 0,
                background: '#FFFFFF',
                zIndex: 10,
                paddingBottom: 8
              }}
            >
              <div className="pl-4 text-sm text-[#42546B] font-medium" />
              {FACTORS.map((factor) => (
                <div key={factor} className="text-center text-sm text-[#42546B] font-medium">
                  {FACTOR_LABELS[factor]}
                </div>
              ))}
            </div>

            <div style={{ display: 'grid', gap: 12, marginTop: 8 }}>
              {rows.map((row) => (
                <div
                  key={row.course}
                  onMouseEnter={() => setHoveredRow(row.course)}
                  onMouseLeave={() => setHoveredRow(null)}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: GRID_TEMPLATE_COLUMNS,
                    gap: 12,
                    alignItems: 'center',
                    padding: '6px 4px',
                    borderRadius: 12,
                    boxShadow: hoveredRow === row.course ? 'inset 0 0 0 1px rgba(0,66,134,0.06)' : undefined,
                    background: hoveredRow === row.course ? 'rgba(3,37,76,0.02)' : undefined
                  }}
                >
                  <div className="pl-4 text-sm text-[#163253] font-semibold">{row.course}</div>
                  {FACTORS.map((factor) => {
                    const value = Number((row as unknown as Record<string, number>)[String(factor)]) || 0
                    const style = getColor(value)

                    return (
                      <div key={factor} className="flex items-center justify-center">
                        <div
                          onMouseEnter={(e) => handleCellMouseEnter(e, row.course, factor, value)}
                          onMouseLeave={() => setTooltip(null)}
                          role="button"
                          aria-label={`${row.course} ${factor} ${value.toFixed(1)}`}
                          className="rounded-md flex items-center justify-center"
                          style={{
                            width: '100%',
                            aspectRatio: '1 / 1',
                            maxWidth: 80,
                            borderRadius: 8,
                            background: style.background,
                            color: style.color,
                            boxShadow: '0 6px 10px rgba(3,37,76,0.04)'
                          }}
                        >
                          <span className="text-sm font-medium">{value.toFixed(1)}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4 w-full" style={{ display: 'flex', justifyContent: 'flex-start' }}>
          <div style={{ width: 240 }}>
            <div style={{ marginBottom: 8, color: '#163253', fontWeight: 600 }}>Chú thích:</div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: '8px 6px', color: '#163253', width: 120 }}>Điểm</th>
                <th style={{ textAlign: 'right', padding: '8px 6px', color: '#163253', width: 120 }}>Màu</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: '10px 6px', color: '#42546B' }}>4.5–5</td>
                <td style={{ padding: '10px 6px', color: '#163253', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 8 }}>
                  <span className="mr-2">xanh đậm</span>
                  <span className="w-6 h-6 rounded-sm" style={{ background: '#003F7F', display: 'inline-block' }} />
                </td>
              </tr>

              <tr>
                <td style={{ padding: '10px 6px', color: '#42546B' }}>4.0–4.5</td>
                <td style={{ padding: '10px 6px', color: '#163253', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 8 }}>
                  <span className="mr-2">xanh</span>
                  <span className="w-6 h-6 rounded-sm" style={{ background: '#0058B3', display: 'inline-block' }} />
                </td>
              </tr>

              <tr>
                <td style={{ padding: '10px 6px', color: '#42546B' }}>3.0–4.0</td>
                <td style={{ padding: '10px 6px', color: '#163253', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 8 }}>
                  <span className="mr-2">vàng</span>
                  <span className="w-6 h-6 rounded-sm" style={{ background: '#F3C623', display: 'inline-block' }} />
                </td>
              </tr>

              <tr>
                <td style={{ padding: '10px 6px', color: '#42546B' }}>2.0–3.0</td>
                <td style={{ padding: '10px 6px', color: '#163253', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 8 }}>
                  <span className="mr-2">cam</span>
                  <span className="w-6 h-6 rounded-sm" style={{ background: '#F29A2E', display: 'inline-block' }} />
                </td>
              </tr>

              <tr>
                <td style={{ padding: '10px 6px', color: '#42546B' }}>&lt;2.0</td>
                <td style={{ padding: '10px 6px', color: '#163253', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 8 }}>
                  <span className="mr-2">đỏ</span>
                  <span className="w-6 h-6 rounded-sm" style={{ background: '#D9534F', display: 'inline-block' }} />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
  </div>
  </div>

  {tooltip && (
        <div style={{ position: 'fixed', left: tooltip.x, top: tooltip.y, zIndex: 9999 }}>
          <div className="bg-[#001F4C] text-white text-sm px-3 py-1 rounded-md shadow-lg">{tooltip.content}</div>
        </div>
      )}
    </>
  )
}
