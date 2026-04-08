import { Card, Empty, Progress, Space, Tag, Tooltip } from 'antd'

import type { HeatmapRow } from './dashboard.types'

type CourseHeatmapProps = {
  rows: HeatmapRow[]
}

function valueTone(value: number) {
  if (value >= 4.2) return 'success'
  if (value >= 3.6) return 'processing'
  if (value >= 3.0) return 'warning'
  return 'error'
}

function average(values: number[]) {
  if (values.length === 0) return 0
  return values.reduce((sum, value) => sum + value, 0) / values.length
}

const dimensionColumns = [
  { key: 'clarity', label: 'Rõ ràng' },
  { key: 'pace', label: 'Tốc độ' },
  { key: 'fairness', label: 'Công bằng' },
  { key: 'support', label: 'Hỗ trợ' },
  { key: 'interaction', label: 'Tương tác' }
] as const

export default function CourseHeatmap({ rows }: CourseHeatmapProps) {
  const averageQi = average(rows.map((row) => row.qi))

  const sortedRows = [...rows].sort((a, b) => b.qi - a.qi)

  const bestRow = sortedRows.reduce<HeatmapRow | null>((best, row) => {
    if (!best || row.qi > best.qi) return row
    return best
  }, null)

  const lowestRow = sortedRows.reduce<HeatmapRow | null>((lowest, row) => {
    if (!lowest || row.qi < lowest.qi) return row
    return lowest
  }, null)

  function accentColor(value: number) {
    if (value >= 4.2) return '#1DA57A'
    if (value >= 3.6) return '#004286'
    if (value >= 3.0) return '#C58B00'
    return '#D9534F'
  }

  return (
    <Card
      style={{
        width: '100%',
        border: '1px solid #D7E1F0',
        borderRadius: 20,
        boxShadow: '0 14px 30px rgba(28,61,102,0.08)',
        background: 'linear-gradient(180deg, #FFFFFF 0%, #FBFDFF 100%)'
      }}
      bodyStyle={{ padding: 18 }}
    >
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 16, marginBottom: 14 }}>
        <div>
          <h3 style={{ margin: 0, color: '#163253', fontSize: 18, fontWeight: 800 }}>Bản đồ nhiệt yếu tố chất lượng theo môn</h3>
          <div style={{ color: '#42546B', fontSize: 13, marginTop: 4 }}>
            Dữ liệu được chia theo khoa/đơn vị để 1 kỳ có rất nhiều môn vẫn nhìn gọn và dễ mở rộng.
          </div>
        </div>

        <Space wrap size={8}>
          <Tag color="blue">{rows.length} môn</Tag>
          <Tag color="green">Điểm TB {averageQi.toFixed(2)}/5</Tag>
          {bestRow && <Tag color="geekblue">Cao nhất: {bestRow.course}</Tag>}
          {lowestRow && <Tag color="red">Thấp nhất: {lowestRow.course}</Tag>}
        </Space>
      </div>

      {rows.length === 0 ? (
        <Empty description="Không có dữ liệu để hiển thị" />
      ) : (
        <div style={{ display: 'grid', gap: 10 }}>
          {sortedRows.map((row) => {
            const averageScore = average([row.clarity, row.pace, row.fairness, row.support, row.interaction])
            const scoreAccent = accentColor(row.qi)

            return (
              <div
                key={row.id}
                style={{
                  display: 'grid',
                    gridTemplateColumns: '10px minmax(0, 1.35fr) minmax(0, 1.15fr)',
                  gap: 0,
                  border: '1px solid #E3EBF7',
                  borderRadius: 14,
                  background: '#FFFFFF',
                  overflow: 'hidden',
                  boxShadow: '0 6px 14px rgba(28,61,102,0.04)'
                }}
              >
                <div style={{ background: `linear-gradient(180deg, ${scoreAccent} 0%, ${scoreAccent}88 100%)` }} />

                <div style={{ padding: '12px 14px', minWidth: 0 }}>
                  <div style={{ color: '#163253', fontSize: 14, fontWeight: 800, lineHeight: 1.25 }} title={row.course}>
                    {row.course}
                  </div>
                  <div style={{ color: '#5A6F8C', fontSize: 12, marginTop: 4, lineHeight: 1.4 }} title={row.instructor}>
                    {row.instructor}
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 10 }}>
                    <Tag color={valueTone(row.qi)} style={{ borderRadius: 999, marginInlineEnd: 0, fontWeight: 700, paddingInline: 10 }}>
                      QI {row.qi.toFixed(2)}
                    </Tag>
                    <Tag color="blue" style={{ borderRadius: 999, marginInlineEnd: 0, paddingInline: 10 }}>
                      {row.responseCount.toLocaleString()} phản hồi
                    </Tag>
                    <Tag color={averageScore >= 4 ? 'green' : averageScore >= 3.2 ? 'gold' : 'red'} style={{ borderRadius: 999, marginInlineEnd: 0, paddingInline: 10 }}>
                      TB {averageScore.toFixed(2)}
                    </Tag>
                    <Tag color="default" style={{ borderRadius: 999, marginInlineEnd: 0, paddingInline: 10 }}>
                      {row.department}
                    </Tag>
                  </div>
                </div>

                <div style={{ padding: '12px 14px', borderLeft: '1px solid #EEF3FB', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
                  <Tooltip
                    title={(
                      <div style={{ display: 'grid', gap: 6 }}>
                        {dimensionColumns.map((column) => {
                          const value = row[column.key]
                          return (
                            <div key={`${row.id}-${column.key}`} style={{ display: 'flex', justifyContent: 'space-between', gap: 16 }}>
                              <span>{column.label}</span>
                              <strong>{value.toFixed(2)}</strong>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <Progress
                        percent={averageScore * 20}
                        showInfo={false}
                        strokeColor={scoreAccent}
                        trailColor="#EEF3FB"
                        strokeWidth={8}
                      />
                      <div style={{ color: '#5A6F8C', fontSize: 11, marginTop: 6, textAlign: 'center' }}>
                        Hover để xem 5 tiêu chí
                      </div>
                    </div>
                  </Tooltip>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </Card>
  )
}
