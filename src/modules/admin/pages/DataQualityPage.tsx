import { useEffect, useState } from 'react'
import { Col, Grid, Row, Empty } from 'antd'
import { Pie, PieChart, ResponsiveContainer, Tooltip as ReTooltip, Line, LineChart, CartesianGrid, XAxis, YAxis, Cell, Legend } from 'recharts'

import PageHeader from '../../../components/layout/PageHeader'
import StatCard from '../../../components/layout/StatCard'

type DataQualityApi = {
  kpis: {
    totalRecords: number
    validRecords: number
    errorRecords: number
    duplicateRecords: number
    missingRate: number // percent 0-100
    attentionCheckRate: number // percent 0-100
  }
  etlSeries: { date: string; total: number; valid: number }[]
  statusBreakdown: { name: string; value: number }[]
}

const cardStyle = {
  background: '#fff',
  border: '1px solid #D7E1F0',
  borderRadius: 20,
  padding: 16,
  boxShadow: '0 14px 30px rgba(28,61,102,0.08)',
  width: '100%'
} as const

export default function DataQualityPage() {
  const screens = Grid.useBreakpoint()
  const isMobile = !screens.md
  const isTablet = Boolean(screens.md && !screens.xxl)
  const [data, setData] = useState<DataQualityApi | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    async function load() {
      try {
        const res = await fetch('/api/admin/data-quality')
        if (!res.ok) throw new Error('network')
        const json = (await res.json()) as DataQualityApi
        if (mounted) setData(json)
      } catch {
        if (mounted) {
          // fallback mock data
          setData({
            kpis: {
              totalRecords: 124800,
              validRecords: 118000,
              errorRecords: 3200,
              duplicateRecords: 1600,
              missingRate: 2.1,
              attentionCheckRate: 1.3
            },
            etlSeries: [
              { date: '2026-03-20', total: 4000, valid: 3890 },
              { date: '2026-03-21', total: 4200, valid: 4100 },
              { date: '2026-03-22', total: 3800, valid: 3680 },
              { date: '2026-03-23', total: 4300, valid: 4200 },
              { date: '2026-03-24', total: 4100, valid: 4000 }
            ],
            statusBreakdown: [
              { name: 'Hợp lệ', value: 118000 },
              { name: 'Lỗi', value: 3200 },
              { name: 'Bị loại', value: 1600 }
            ]
          })
        }
      } finally {
        if (mounted) setLoading(false)
      }
    }

    load()
    return () => {
      mounted = false
    }
  }, [])

  if (!data && loading) return <Empty />

  const k = data!.kpis
  // tooltip helpers for charts (formatter functions inlined below)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ background: '#FFFFFF', border: '1px solid #E8EEF8', borderRadius: 16, padding: isMobile ? 20 : 28, boxShadow: '0 8px 20px rgba(28,61,102,0.04)' }}>
        <PageHeader title="Chất lượng dữ liệu" description="Theo dõi tình trạng dữ liệu ETL và chất lượng khảo sát" contentGap={8} />
      </div>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={6}><StatCard title="Tổng số bản ghi" value={k.totalRecords.toLocaleString()} /></Col>
        <Col xs={24} lg={6}><StatCard title="Số bản ghi hợp lệ" value={k.validRecords.toLocaleString()} /></Col>
        <Col xs={24} lg={6}><StatCard title="Số bản ghi lỗi" value={k.errorRecords.toLocaleString()} /></Col>
        <Col xs={24} lg={6}><StatCard title="Số bản ghi trùng" value={k.duplicateRecords.toLocaleString()} /></Col>
      </Row>

      <Row gutter={[24, 24]} style={{ marginTop: 8 }} align="stretch">
        <Col xs={24} xl={12} style={{ display: 'flex' }}>
          <div style={{ ...cardStyle, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ margin: 0, color: '#163253', fontSize: 18 }}>ETL Records Over Time (Total vs Valid)</h3>
            <div style={{ color: '#42546B', fontSize: 13, marginTop: 8 }}>Số lượng bản ghi nạp vào ETL theo ngày — so sánh tổng và bản ghi hợp lệ</div>
            <div style={{ marginTop: 12, height: isMobile ? 260 : isTablet ? 300 : 360, flex: 1 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data!.etlSeries} margin={{ top: 16, right: isMobile ? 8 : 24, left: isMobile ? -20 : -8, bottom: 28 }}>
                  <CartesianGrid stroke="#E8EEF8" vertical={false} />
                  <XAxis dataKey="date" tick={{ fill: '#42546B', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#42546B', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Legend verticalAlign="top" align={isMobile ? 'center' : 'right'} height={isMobile ? 48 : 36} />
                  <ReTooltip />
                  <Line name="Total Records" type="monotone" dataKey="total" stroke="#004286" strokeWidth={2} dot={false} />
                  <Line name="Valid Records" type="monotone" dataKey="valid" stroke="#1DA57A" strokeWidth={2} dot={false} strokeDasharray="6 4" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div style={{ marginTop: 10, textAlign: 'center', color: '#163253', fontWeight: 600 }}>Dữ liệu ổn định trong khoảng thời gian quan sát</div>
          </div>
        </Col>

        <Col xs={24} xl={12} style={{ display: 'flex' }}>
          <div style={{ ...cardStyle, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ margin: 0, color: '#163253', fontSize: 18 }}>Data quality status</h3>
            <div style={{ color: '#42546B', fontSize: 13, marginTop: 8 }}>Tỉ lệ bản ghi theo trạng thái</div>
            <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, flex: 1 }}>
              {/* compute status breakdown and percentages */}
              {(() => {
                const raw = data!.statusBreakdown || []
                // helper to normalize and map names to keys
                const normalize = (s: string) => s.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '').trim()

                function mapKey(name: string) {
                  const n = normalize(name)
                  if (n.includes('hop le') || n.includes('hople') || n.includes('hop')) return 'valid'
                  if (n.includes('loi') || n.includes('loi')) return 'invalid'
                  if (n.includes('thieu') || n.includes('thieu du lieu')) return 'missing'
                  if (n.includes('trung') || n.includes('trung')) return 'duplicate'
                  if (n.includes('bi loai') || n.includes('loai')) return 'removed'
                  return 'other'
                }

                const statusOrder = [
                  { key: 'valid', name: 'Hợp lệ', color: '#1DA57A' },
                  { key: 'invalid', name: 'Lỗi', color: '#D9534F' },
                  { key: 'missing', name: 'Thiếu dữ liệu', color: '#F2B94B' },
                  { key: 'duplicate', name: 'Trùng', color: '#F2994A' },
                  { key: 'removed', name: 'Bị loại', color: '#8C9AAE' }
                ]

                const mapped: Record<string, number> = {}
                raw.forEach((r) => {
                  const k = mapKey(r.name)
                  mapped[k] = (mapped[k] ?? 0) + (r.value ?? 0)
                })

                const total = Object.values(mapped).reduce((s, v) => s + v, 0) || raw.reduce((s, r) => s + (r.value ?? 0), 0)

                const statusData = statusOrder.map((s) => {
                  const value = mapped[s.key] ?? 0
                  const percent = total > 0 ? Math.round((value / total) * 100) : 0
                  return { ...s, value, percent }
                })

                // summary insight
                const validPercent = statusData.find((s) => s.key === 'valid')?.percent ?? 0
                const insight = validPercent >= 90 ? `Dữ liệu hợp lệ cao (${validPercent}%)` : validPercent >= 75 ? `Dữ liệu hợp lệ tốt (${validPercent}%)` : validPercent >= 50 ? `Cần kiểm tra (${validPercent}%)` : `Dữ liệu hợp lệ thấp (${validPercent}%)`

                const CustomPieTooltip = (props: { active?: boolean; payload?: unknown[] }) => {
                  const { active, payload } = props
                  if (!active || !payload || !payload.length) return null
                  const raw = payload[0] as Record<string, unknown>
                  const inner = (raw.payload ?? raw) as Record<string, unknown>
                  const name = String(inner.name ?? '')
                  const value = typeof inner.value === 'number' ? inner.value : Number(inner.value ?? 0)
                  const percent = typeof inner.percent === 'number' ? inner.percent : Math.round(Number(inner.percent ?? 0))

                  return (
                    <div style={{ background: '#fff', padding: 8, borderRadius: 8, boxShadow: '0 8px 20px rgba(0,0,0,0.08)' }}>
                      <div style={{ fontWeight: 700, color: '#163253' }}>{name}</div>
                      <div style={{ color: '#42546B' }}>{value.toLocaleString()} ({percent}%)</div>
                    </div>
                  )
                }

                return (
                  <>
                    <div style={{ width: '100%', height: isMobile ? 260 : 320, position: 'relative' }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={statusData}
                            dataKey="value"
                            nameKey="name"
                            innerRadius={isMobile ? 54 : 70}
                            outerRadius={isMobile ? 88 : 110}
                            labelLine={false}
                            label={(props: unknown) => {
                              // prefer using payload percent (our precomputed percent) to avoid Recharts inconsistencies
                              const payload = ((props as unknown) as { payload?: Record<string, unknown> }).payload as Record<string, unknown> | undefined
                              const pVal = payload && typeof payload.percent === 'number' ? (payload.percent as number) : undefined
                              // don't render an outside label for the main 'valid' slice (we show it centered)
                              if (payload && (payload.key === 'valid' || payload.name === 'Hợp lệ')) return null

                              const percent = typeof pVal === 'number' ? Math.round(pVal) : (() => {
                                const pRaw = ((props as unknown) as { percent?: number }).percent ?? 0
                                return pRaw > 1 ? Math.round(pRaw) : Math.round(pRaw * 100)
                              })()

                              if (percent < 5) return null

                              // compute label position using provided geometry
                              const RADIAN = Math.PI / 180
                              const { cx, cy, midAngle, outerRadius } = ((props as unknown) as { cx: number; cy: number; midAngle: number; outerRadius: number })
                              const radius = outerRadius + 18
                              const x = cx + radius * Math.cos(-midAngle * RADIAN)
                              const y = cy + radius * Math.sin(-midAngle * RADIAN)
                              return (
                                <text x={x} y={y} fill="#163253" fontSize={12} textAnchor={x > cx ? 'start' : 'end'}>
                                  {`${percent}%`}
                                </text>
                              )
                            }}
                          >
                            {statusData.map((entry) => (
                              <Cell key={entry.key} fill={entry.color} />
                            ))}
                          </Pie>
                          <ReTooltip content={<CustomPieTooltip />} />
                        </PieChart>
                      </ResponsiveContainer>

                      {/* centered big percent for valid data */}
                      <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', pointerEvents: 'none', textAlign: 'center' }}>
                        <div style={{ fontSize: isMobile ? 22 : 28, fontWeight: 700, color: '#163253', lineHeight: 1 }}>{statusData.find((s) => s.key === 'valid')?.percent ?? 0}%</div>
                        <div style={{ fontSize: 12, color: '#42546B' }}>Hợp lệ</div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap', marginTop: 8 }}>
                      {statusData.map((s) => (
                        <div key={s.key} style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#42546B' }}>
                          <span style={{ width: 12, height: 12, background: s.color, borderRadius: 3, display: 'inline-block' }} />
                          <span style={{ fontWeight: 600, color: '#163253' }}>{s.name}</span>
                          <span style={{ color: '#163253', fontWeight: 700 }}>{s.percent}%</span>
                        </div>
                      ))}
                    </div>

                    <div style={{ marginTop: 12, textAlign: 'center', color: '#163253', fontWeight: 600 }}>{insight}</div>
                  </>
                )
              })()}
            </div>
          </div>
        </Col>
      </Row>
    </div>
  )
}
