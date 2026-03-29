import { useEffect, useMemo, useState } from 'react'
import { Alert, Card, Col, Empty, Grid, Row, Spin, Table, Tag } from 'antd'
import type { TableColumnsType } from 'antd'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Cell,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'

import PageHeader from '../../../components/layout/PageHeader'
import StatCard from '../../../components/layout/StatCard'
import { getFeatureImportance, getQualityIndex } from '../api/Quality.service'

type QualityIndexData = Awaited<ReturnType<typeof getQualityIndex>>
type FeatureImportanceData = Awaited<ReturnType<typeof getFeatureImportance>>

const surfaceCardStyle = {
  background: '#FFFFFF',
  border: '1px solid #D7E1F0',
  borderRadius: 20,
  boxShadow: '0 14px 30px rgba(28, 61, 102, 0.08)'
}

const chartCardBodyStyle = {
  height: 340,
  padding: '14px 16px 10px'
}

const chartTooltipStyle = {
  borderRadius: 10,
  border: '1px solid #D7E1F0',
  boxShadow: '0 8px 18px rgba(28, 61, 102, 0.12)'
}

const pageContainerStyle = {
  width: '100%',
  maxWidth: 1400,
  margin: '0 auto',
  display: 'flex',
  flexDirection: 'column',
  gap: 20
} as const

const renderChartHeader = (title: string, description: string) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 4, paddingRight: 8 }}>
    <div style={{ color: '#163253', fontWeight: 700, fontSize: 18, lineHeight: 1.4 }}>
      {title}
    </div>
    <div style={{ color: '#42546B', fontSize: 13, lineHeight: 1.5, fontWeight: 400 }}>
      {description}
    </div>
  </div>
)

const featureLabelMap: Record<string, string> = {
  clarity: 'Độ rõ ràng',
  fairness: 'Công bằng',
  interaction: 'Tương tác',
  support: 'Hỗ trợ',
  motivation: 'Động lực',
  'course fit': 'Phù hợp môn học'
}

const compactFeatureLabelMap: Record<string, string> = {
  'Độ rõ ràng': 'Rõ ràng',
  'Phù hợp môn học': 'Phù hợp môn'
}


const toFeatureLabel = (feature: string) => {
  const key = String(feature || '').trim().toLowerCase()
  return featureLabelMap[key] || feature
}

const toCompactFeatureLabel = (label: string) => compactFeatureLabelMap[label] || label

type FeatureAxisTickProps = {
  x?: number
  y?: number
  isMobile?: boolean
  isCompact?: boolean
  payload?: {
    value?: string
  }
}

const splitFeatureLabel = (value: string, maxLineLength = 12, maxLines = 2) => {
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

function FeatureAxisTick({ x = 0, y = 0, isMobile = false, isCompact = false, payload }: FeatureAxisTickProps) {
  const label = String(payload?.value ?? '')
  const lines = splitFeatureLabel(label, isMobile ? 9 : isCompact ? 10 : 12, isMobile ? 3 : 2)

  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0}
        y={0}
        dy={isMobile ? 14 : isCompact ? 14 : 16}
        textAnchor="middle"
        fill="#4A5F7A"
        fontSize={isMobile ? 10 : isCompact ? 11 : 12}
      >
        {lines.map((line, index) => (
          <tspan key={`${label}-${index}`} x={0} dy={index === 0 ? 0 : isMobile ? 12 : 13}>
            {line}
          </tspan>
        ))}
      </text>
    </g>
  )
}

type FeedbackRow = {
  key: string
  comment: string
  topic: string
  sentiment: 'Tích cực' | 'Tiêu cực' | 'Trung lập'
}

const sentimentData = [
  { name: 'Tích cực', value: 70, color: '#86e4a8' },
  { name: 'Trung lập', value: 20, color: '#a3bbdb' },
  { name: 'Tiêu cực', value: 10, color: '#f8c0c9' }
]

const ratingDistributionData = [
  { rating: '1', count: 12 },
  { rating: '2', count: 18 },
  { rating: '3', count: 36 },
  { rating: '4', count: 58 },
  { rating: '5', count: 82 }
]

const topIssueData = [
  { issue: 'Giảng nhanh', count: 10 },
  { issue: 'Bài tập khó', count: 18 },
  { issue: 'Slide khó hiểu', count: 25},
  { issue: 'Giảng viên thiếu tương tác', count: 15}
]

const radarCriteria = [
  { key: 'clarity', label: 'Giảng dạy (Teaching)' },
  { key: 'interaction', label: 'Thái độ (Attitude)' },
  { key: 'support', label: 'Tài liệu (Material)' },
  { key: 'motivation', label: 'Bài tập (Assignment)' },
  { key: 'fairness', label: 'Công bằng (Fairness)' }
]

const feedbackColumns: TableColumnsType<FeedbackRow> = [
  {
    title: 'Nội dung phản hồi',
    dataIndex: 'comment',
    key: 'comment'
  },
  {
    title: 'Chủ đề',
    dataIndex: 'topic',
    key: 'topic',
    align: 'center'
  },
  {
    title: 'Cảm xúc',
    dataIndex: 'sentiment',
    key: 'sentiment',
    align: 'center',
    render: (sentiment: FeedbackRow['sentiment']) => {
      if (sentiment === 'Tích cực') {
        return <Tag color="success">Tích cực</Tag>
      }

      if (sentiment === 'Tiêu cực') {
        return <Tag color="error">Tiêu cực</Tag>
      }

      return <Tag color="default">Trung lập</Tag>
    }
  }
]

const feedbackRows: FeedbackRow[] = [
  {
    key: '1',
    comment: 'Giảng viên giảng bài dễ hiểu',
    topic: 'Giảng dạy',
    sentiment: 'Tích cực'
  },
  {
    key: '2',
    comment: 'Tốc độ giảng hơi nhanh',
    topic: 'Tốc độ',
    sentiment: 'Tiêu cực'
  },
  {
    key: '3',
    comment: 'Slide chi tiết, dễ theo dõi',
    topic: 'Tài liệu',
    sentiment: 'Tích cực'
  },
  {
    key: '4',
    comment: 'Nên thêm ví dụ thực tế ở cuối buổi',
    topic: 'Giảng dạy',
    sentiment: 'Trung lập'
  }
]

export default function QualityPage() {
  const screens = Grid.useBreakpoint()
  const isMobile = !screens.md
  const isTablet = Boolean(screens.md && !screens.xxl)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [qualityIndex, setQualityIndex] = useState<QualityIndexData | null>(null)
  const [featureImportance, setFeatureImportance] = useState<FeatureImportanceData>([])

  useEffect(() => {
    let mounted = true

    const loadData = async () => {
      setLoading(true)
      setError('')

      try {
        const [qualityData, featureData] = await Promise.all([
          getQualityIndex(),
          getFeatureImportance()
        ])

        if (!mounted) return

        setQualityIndex(qualityData)
        setFeatureImportance(featureData)
      } catch {
        if (!mounted) return
        setError('Không thể tải dữ liệu chỉ số chất lượng. Vui lòng thử lại.')
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    loadData()

    return () => {
      mounted = false
    }
  }, [])

  const kpis = useMemo(() => {
    if (!qualityIndex) {
      return {
        teachingQualityIndex: 0,
        ranking: 0,
        trendPercent: 0
      }
    }

    return qualityIndex.kpis
  }, [qualityIndex])

  const lineData = useMemo(() => {
    return qualityIndex?.trend ?? []
  }, [qualityIndex])

  const radarData = useMemo(() => {
    const normalizedScores = featureImportance.reduce<Record<string, number>>((acc, item) => {
      const normalizedValue = item.instructorScore > 5 ? item.instructorScore / 20 : item.instructorScore
      acc[String(item.feature || '').trim().toLowerCase()] = Number(normalizedValue.toFixed(2))
      return acc
    }, {})

    return radarCriteria.map((criterion) => ({
      feature: criterion.label,
      giangVien: normalizedScores[criterion.key] ?? 4
    }))
  }, [featureImportance])

  const featureChartData = useMemo(() => {
    return featureImportance.map((item) => ({
      ...item,
      featureLabel: isTablet ? toCompactFeatureLabel(toFeatureLabel(item.feature)) : toFeatureLabel(item.feature)
    }))
  }, [featureImportance, isTablet])

  const maxTopIssueCount = useMemo(
    () => Math.max(...topIssueData.map((item) => item.count), 1),
    []
  )

  const ratingDistributionTrendData = useMemo(() => {
    return ratingDistributionData.map((item) => ({
      period: String(item.rating).padStart(2, '0'),
      score: item.count
    }))
  }, [])

  return (
    <div style={{ width: '100%' }}>
      <div style={pageContainerStyle}>
      <style>
        {`
          .quality-hover {
            transition: transform 0.2s ease, box-shadow 0.2s ease;
          }

          .quality-hover:hover {
            transform: translateY(-3px);
            box-shadow: 0 18px 36px rgba(28, 61, 102, 0.12) !important;
          }

          .quality-feedback-table .ant-table-thead > tr > th {
            background: #eaf2ff;
            color: #004286;
            font-weight: 700;
          }

          .quality-chart-card .ant-card-head {
            min-height: 72px;
            border-bottom: 1px solid #D7E1F0;
            align-items: flex-start;
          }

          .quality-chart-card .ant-card-head-title {
            padding: 10px 0 8px;
            white-space: normal;
          }

          .quality-chart-card .ant-card-body {
            border-radius: 0 0 20px 20px;
          }

          .quality-sentiment-card .ant-card-body {
            background: linear-gradient(180deg, #f8fbff 0%, #ffffff 100%);
          }
        `}
      </style>

      <Card
        className="quality-hover"
        style={surfaceCardStyle}
        bodyStyle={{ padding: 24 }}
      >
        <PageHeader
          title="Chỉ số chất lượng"
          description="Phân tích chi tiết hiệu suất giảng dạy"
          contentGap={10}
        />
      </Card>

      {error && (
        <Alert
          message={error}
          type="error"
          showIcon
          style={{ borderRadius: 14 }}
        />
      )}

      <Row gutter={[16, 16]}>
        <Col xs={24} md={8} xl={8}>
          <div className="quality-hover" style={{ borderRadius: 20 }}>
            <StatCard title="Chỉ số chất lượng giảng dạy" value={`${kpis.teachingQualityIndex}/5`} />
          </div>
        </Col>
        <Col xs={24} md={8} xl={8}>
          <div className="quality-hover" style={{ borderRadius: 20 }}>
            <StatCard title="Xếp hạng" value={`#${kpis.ranking}`} />
          </div>
        </Col>
        <Col xs={24} md={8} xl={8}>
          <div className="quality-hover" style={{ borderRadius: 20 }}>
            <StatCard title="Tỷ lệ hài lòng" value="85%" />
          </div>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card
            className="quality-hover quality-sentiment-card quality-chart-card"
            hoverable
            title={renderChartHeader('Phân tích cảm xúc', 'Tổng hợp tỷ lệ phản hồi tích cực, trung lập và tiêu cực.')}
            style={surfaceCardStyle}
            bodyStyle={chartCardBodyStyle}
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sentimentData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  stroke="#FFFFFF"
                  strokeWidth={2}
                  paddingAngle={1}
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {sentimentData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${Number(value ?? 0)}%`} contentStyle={chartTooltipStyle} />
                <Legend formatter={(value) => <span style={{ color: '#334155', fontWeight: 600 }}>{value}</span>} />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card
            className="quality-hover quality-chart-card"
            hoverable
            title={renderChartHeader('TQI theo học kỳ', 'Xu hướng chỉ số chất lượng theo các học kỳ.')}
            style={surfaceCardStyle}
            bodyStyle={chartCardBodyStyle}
          >
            {loading ? (
              <div style={{ height: '100%', display: 'grid', placeItems: 'center' }}>
                <Spin size="large" />
              </div>
            ) : lineData.length === 0 ? (
              <Empty description="Chưa có dữ liệu TQI" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lineData} margin={{ top: 8, right: 18, left: 4, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E4ECF6" />
                  <XAxis dataKey="semester" tick={{ fill: '#4A5F7A', fontSize: 12 }} />
                  <YAxis domain={[0, 5]} tick={{ fill: '#4A5F7A', fontSize: 12 }} />
                  <Tooltip contentStyle={chartTooltipStyle} />
                  <Line
                    type="monotone"
                    dataKey="teachingQualityIndex"
                    name="Giảng viên"
                    stroke="#004286"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card
            className="quality-hover quality-chart-card"
            hoverable
            title={renderChartHeader('Phân bố điểm đánh giá', 'Phân bố số lượng đánh giá theo từng mức điểm từ 1 đến 5.')}
            style={surfaceCardStyle}
            bodyStyle={chartCardBodyStyle}
          >
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <div style={{ color: '#4A5F7A', fontSize: 13, fontStyle: 'italic', marginBottom: 8 }}>
                Điểm số
              </div>
              <div style={{ flex: 1 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={ratingDistributionTrendData} margin={{ top: 4, right: 12, left: 0, bottom: 4 }}>
                    <CartesianGrid stroke="#E4ECF6" strokeDasharray="0" />
                    <XAxis dataKey="period" tick={{ fill: '#4A5F7A', fontSize: 12 }} tickLine={false} axisLine={{ stroke: '#D6E2F1' }} />
                    <YAxis tick={{ fill: '#4A5F7A', fontSize: 12 }} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={chartTooltipStyle} formatter={(value) => [value, 'Số lượng']} />
                    <Area type="monotone" dataKey="score" stroke="none" fill="#EAF2FF" fillOpacity={1} />
                    <Line
                      type="monotone"
                      dataKey="score"
                      name="Số lượng"
                      stroke="#1D62B0"
                      strokeWidth={3}
                      dot={{ r: 5, fill: '#1D62B0', stroke: '#1D62B0' }}
                      activeDot={{ r: 7 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card
            className="quality-hover quality-chart-card"
            hoverable
            title={renderChartHeader('Điểm đánh giá theo tiêu chí', 'So sánh điểm giảng viên ở từng tiêu chí phản hồi quan trọng.')}
            style={surfaceCardStyle}
            bodyStyle={chartCardBodyStyle}
          >
            {loading ? (
              <div style={{ height: '100%', display: 'grid', placeItems: 'center' }}>
                <Spin size="large" />
              </div>
            ) : featureImportance.length === 0 ? (
              <Empty description="Chưa có dữ liệu mức độ ảnh hưởng" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={featureChartData} margin={{ top: 8, right: 18, left: 4, bottom: isMobile ? 20 : isTablet ? 28 : 20 }} barCategoryGap={isTablet ? '12%' : '18%'}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E4ECF6" />
                  <XAxis
                    dataKey="featureLabel"
                    interval={0}
                    height={isMobile ? 82 : isTablet ? 72 : 62}
                    tick={<FeatureAxisTick isMobile={isMobile} isCompact={isTablet} />}
                    tickMargin={isMobile ? 6 : isTablet ? 8 : 10}
                  />
                  <YAxis domain={[0, 100]} tick={{ fill: '#4A5F7A', fontSize: 12 }} />
                  <Tooltip contentStyle={chartTooltipStyle} />
                  <Bar dataKey="instructorScore" name="Giảng viên" fill="#004286" radius={[8, 8, 0, 0]} barSize={isTablet ? 42 : 52} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </Card>
        </Col>

        <Col xs={24}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Card
              className="quality-hover"
              hoverable
              title={renderChartHeader('Năng lực giảng dạy theo tiêu chí', 'Góc nhìn tổng quan năng lực giảng dạy trên thang điểm 5.')}
              style={surfaceCardStyle}
              bodyStyle={{ padding: 16 }}
            >
              {loading ? (
                <div style={{ height: 400, display: 'grid', placeItems: 'center' }}>
                  <Spin size="large" />
                </div>
              ) : radarData.length === 0 ? (
                <Empty description="Chưa có dữ liệu" />
              ) : (
                <ResponsiveContainer width="100%" height={400}>
                  <RadarChart cx="50%" cy="50%" outerRadius="72%" data={radarData}>
                    <PolarGrid stroke="#D6E2F1" />
                    <PolarAngleAxis dataKey="feature" tick={{ fill: '#4A5F7A', fontSize: 12 }} />
                    <PolarRadiusAxis angle={90} domain={[0, 5]} tick={{ fill: '#4A5F7A', fontSize: 11 }} />
                    <Tooltip />
                    <Radar
                      name="Giảng viên"
                      dataKey="giangVien"
                      stroke="#1E3A8A"
                      fill="#1E3A8A"
                      fillOpacity={0.22}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              )}
            </Card>

            <Card
              className="quality-hover"
              hoverable
              title="Danh sách phản hồi"
              style={surfaceCardStyle}
              bodyStyle={{ padding: 16 }}
            >
              <Table<FeedbackRow>
                className="quality-feedback-table"
                columns={feedbackColumns}
                dataSource={feedbackRows}
                pagination={{ pageSize: 5, showSizeChanger: false }}
              />
            </Card>

            <Card
              className="quality-hover quality-chart-card"
              hoverable
              title="Vấn Đề Nổi Bật"
              style={surfaceCardStyle}
              bodyStyle={{ padding: 16 }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {topIssueData.map((item) => {
                  const widthPercent = Math.max((item.count / maxTopIssueCount) * 100, isMobile ? 56 : isTablet ? 44 : 32)

                  return (
                    <div
                      key={item.issue}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'minmax(0, 1fr) auto',
                        gap: isMobile ? 10 : 14,
                        alignItems: 'center'
                      }}
                    >
                      <div
                        style={{
                          minHeight: isMobile ? 48 : isTablet ? 44 : 42,
                          borderRadius: 8,
                          overflow: 'hidden',
                          background: '#EAF2FF',
                          position: 'relative',
                          width: `${widthPercent}%`
                        }}
                      >
                        <div
                          style={{
                            position: 'absolute',
                            left: 0,
                            top: 0,
                            bottom: 0,
                            width: 48,
                            background: '#1D62B0'
                          }}
                        />
                        <div
                          style={{
                            position: 'absolute',
                            left: 48,
                            right: 0,
                            top: 0,
                            bottom: 0,
                            background: 'linear-gradient(90deg, #AFC7EB 0%, #9DBBE6 100%)'
                          }}
                        />
                        <div
                          style={{
                            position: 'relative',
                            zIndex: 1,
                            minHeight: isMobile ? 48 : isTablet ? 44 : 42,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-start',
                            paddingLeft: isMobile ? 48 : isTablet ? 56 : 64,
                            paddingRight: isMobile ? 8 : 10,
                            color: '#163253',
                            fontSize: isMobile ? 11 : isTablet ? 14 : 17,
                            fontWeight: 600,
                            lineHeight: 1.25,
                            textAlign: 'left'
                          }}
                        >
                          {item.issue}
                        </div>
                      </div>

                      <div style={{ color: '#1F2937', fontSize: isMobile ? 12 : isTablet ? 15 : 18, fontWeight: 600, minWidth: isMobile ? 56 : 72, textAlign: 'right', whiteSpace: 'nowrap' }}>
                        {item.count} lần
                      </div>
                    </div>
                  )
                })}
              </div>
            </Card>
          </div>
        </Col>
      </Row>
      </div>
    </div>
  )
}



