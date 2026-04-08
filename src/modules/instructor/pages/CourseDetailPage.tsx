import { useEffect, useMemo, useState } from 'react'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { Button, Card, Col, Empty, Grid, Row, Space, Spin, Typography } from 'antd'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'
import { useNavigate, useParams } from 'react-router-dom'
import StatCard from '../../../components/layout/StatCard'
import { baseStudentCourses, getFeedbackWorkflowState } from '../../student/api/feedbackData'
import type { Course } from '../../student/types/course'

type HeaderData = {
  courseName: string
  semester: string
  totalResponses: number
  dataReliabilityPercent: number
}

type KpiData = {
  qualityIndex: number
  courseScore: number
  instructorScore: number
  perceivedDifficulty: string
}

type RadarPoint = {
  factor: string
  score: number
}

type RatingDistributionPoint = {
  rating: string
  count: number
}

type TrendPoint = {
  period: string
  score: number
}

type InsightData = {
  strengths: string[]
  improvements: string[]
}

type CourseDetailDashboardData = {
  header: HeaderData
  kpis: KpiData
  radar: RadarPoint[]
  ratingDistribution: RatingDistributionPoint[]
  trend: TrendPoint[]
  insight: InsightData
}

type ApiResponse = {
  data?: unknown
}

const surfaceCardStyle = {
  borderRadius: 20,
  border: '1px solid #D7E1F0',
  boxShadow: '0 14px 30px rgba(28, 61, 102, 0.08)'
} as const

const badgeStyle = {
  background: '#F4F8FF',
  border: '1px solid #D6E4F7',
  borderRadius: 999,
  padding: '6px 12px',
  display: 'inline-flex',
  alignItems: 'center'
} as const

const chartHeight = 310

const FALLBACK_DATA: CourseDetailDashboardData = {
  header: {
    courseName: 'Xây dựng phần mềm web',
    semester: '2025-2026-HK2',
    totalResponses: 128,
    dataReliabilityPercent: 92
  },
  kpis: {
    qualityIndex: 4.4,
    courseScore: 8.7,
    instructorScore: 4.5,
    perceivedDifficulty: 'Trung bình'
  },
  radar: [
    { factor: 'Độ rõ ràng', score: 88 },
    { factor: 'Công bằng', score: 84 },
    { factor: 'Tương tác', score: 76 },
    { factor: 'Hỗ trợ', score: 82 },
    { factor: 'Động lực', score: 79 },
    { factor: 'Phù hợp môn học', score: 86 }
  ],
  ratingDistribution: [
    { rating: '1', count: 4 },
    { rating: '2', count: 9 },
    { rating: '3', count: 21 },
    { rating: '4', count: 46 },
    { rating: '5', count: 48 }
  ],
  trend: [
    { period: 'Tuần 1', score: 4.1 },
    { period: 'Tuần 3', score: 4.2 },
    { period: 'Tuần 5', score: 4.3 },
    { period: 'Tuần 7', score: 4.4 },
    { period: 'Tuần 9', score: 4.4 }
  ],
  insight: {
    strengths: ['Độ rõ ràng', 'Phù hợp môn học', 'Công bằng'],
    improvements: ['Tương tác', 'Động lực', 'Hỗ trợ']
  }
}

const getCourseById = (courseId: string): Course | undefined => {
  const normalized = courseId.trim().toUpperCase()
  return baseStudentCourses.find((course) => course.id.toUpperCase() === normalized)
}

const getFallbackByCourseId = (courseId: string): CourseDetailDashboardData => {
  const matchedCourse = getCourseById(courseId)

  if (!matchedCourse) {
    return {
      ...FALLBACK_DATA,
      header: {
        ...FALLBACK_DATA.header,
        courseName: courseId ? `Môn học ${courseId.toUpperCase()}` : FALLBACK_DATA.header.courseName
      }
    }
  }

  const submissions = getFeedbackWorkflowState().submissions ?? {}
  const responseCount = submissions[matchedCourse.id] ? 1 : 0
  const reliabilityPercent = responseCount > 0 ? 72 : 12

  const courseScoreOn5 = Number((matchedCourse.courseScore > 5 ? matchedCourse.courseScore / 2 : matchedCourse.courseScore).toFixed(1))
  const instructorScore = Number(matchedCourse.instructorScore.toFixed(1))
  const qualityIndex = Number((((courseScoreOn5 + instructorScore) / 2)).toFixed(1))

  const trendBase = qualityIndex
  const trend = [
    { period: 'Tuần 1', score: Number(Math.max(1, trendBase - 0.3).toFixed(1)) },
    { period: 'Tuần 3', score: Number(Math.max(1, trendBase - 0.2).toFixed(1)) },
    { period: 'Tuần 5', score: Number(Math.max(1, trendBase - 0.1).toFixed(1)) },
    { period: 'Tuần 7', score: Number(Math.max(1, trendBase).toFixed(1)) },
    { period: 'Tuần 9', score: Number(Math.max(1, trendBase + 0.1).toFixed(1)) }
  ]

  return {
    ...FALLBACK_DATA,
    header: {
      courseName: matchedCourse.subject,
      semester: matchedCourse.semester,
      totalResponses: responseCount,
      dataReliabilityPercent: reliabilityPercent
    },
    kpis: {
      qualityIndex,
      courseScore: courseScoreOn5,
      instructorScore,
      perceivedDifficulty: getDifficultyLabel(matchedCourse.difficultyLevel)
    },
    trend
  }
}

const getDifficultyLabel = (value: unknown) => {
  const normalized = String(value ?? '').trim().toLowerCase()

  if (normalized === 'de' || normalized === 'easy') return 'Dễ'
  if (normalized === 'kho' || normalized === 'hard') return 'Khó'
  if (normalized === 'trung-binh' || normalized === 'medium') return 'Trung bình'

  return String(value || 'Trung bình')
}

const pickTopThree = (items: unknown) => {
  if (!Array.isArray(items)) return [] as string[]

  return items
    .map((item) => String(item ?? '').trim())
    .filter((item) => item.length > 0)
    .slice(0, 3)
}

const normalizeDistributionFromScores = (scores: number[]) => {
  const buckets = [1, 2, 3, 4, 5].map((rating) => ({ rating: String(rating), count: 0 }))

  scores.forEach((score) => {
    const clamped = Math.max(1, Math.min(5, Math.round(score)))
    const bucket = buckets.find((item) => Number(item.rating) === clamped)
    if (bucket) bucket.count += 1
  })

  return buckets
}

const normalizeDashboardData = (payload: unknown): CourseDetailDashboardData => {
  const source = ((payload as ApiResponse)?.data ?? payload) as Record<string, unknown>

  const headerSource = (source.header ?? source) as Record<string, unknown>
  const kpiSource = (source.kpis ?? source) as Record<string, unknown>

  const radarSource = ((source.teachingFactors ?? source.qualityRadar ?? []) as unknown[])
    .map((item) => {
      const row = item as Record<string, unknown>
      return {
        factor: String(row.factor ?? row.metric ?? row.name ?? '').trim(),
        score: Number(row.score ?? row.value ?? 0)
      }
    })
    .filter((item) => item.factor.length > 0)

  const distributionSourceRaw = (source.ratingDistribution ?? source.distribution ?? []) as unknown[]
  const distributionSource = distributionSourceRaw
    .map((item) => {
      const row = item as Record<string, unknown>
      return {
        rating: String(row.rating ?? row.star ?? row.label ?? '').trim(),
        count: Number(row.count ?? row.value ?? 0)
      }
    })
    .filter((item) => item.rating.length > 0)

  const trendSource = ((source.trend ?? source.trendOverTime ?? []) as unknown[])
    .map((item) => {
      const row = item as Record<string, unknown>
      return {
        period: String(row.period ?? row.time ?? row.label ?? row.semester ?? '').trim(),
        score: Number(row.score ?? row.value ?? row.qualityIndex ?? 0)
      }
    })
    .filter((item) => item.period.length > 0)

  const insightsSource = (source.insight ?? source.insights ?? {}) as Record<string, unknown>
  const strengths = pickTopThree(insightsSource.strengths)
  const improvements = pickTopThree(insightsSource.improvements ?? insightsSource.limitations)

  const scoresForDistribution = radarSource.map((item) => item.score / 20)
  const ratingDistribution = distributionSource.length > 0
    ? distributionSource
    : normalizeDistributionFromScores(scoresForDistribution)

  return {
    header: {
      courseName: String(
        headerSource.courseName
        ?? headerSource.subjectName
        ?? headerSource.course
        ?? FALLBACK_DATA.header.courseName
      ),
      semester: String(headerSource.semester ?? FALLBACK_DATA.header.semester),
      totalResponses: Number(headerSource.totalResponses ?? headerSource.responses ?? FALLBACK_DATA.header.totalResponses),
      dataReliabilityPercent: Number(
        headerSource.dataReliabilityPercent
        ?? headerSource.reliabilityPercent
        ?? FALLBACK_DATA.header.dataReliabilityPercent
      )
    },
    kpis: {
      qualityIndex: Number(kpiSource.qualityIndex ?? kpiSource.teachingQualityIndex ?? FALLBACK_DATA.kpis.qualityIndex),
      courseScore: Number(kpiSource.courseScore ?? kpiSource.overallCourseScore ?? FALLBACK_DATA.kpis.courseScore),
      instructorScore: Number(kpiSource.instructorScore ?? FALLBACK_DATA.kpis.instructorScore),
      perceivedDifficulty: getDifficultyLabel(kpiSource.perceivedDifficulty ?? kpiSource.difficultyLevel ?? FALLBACK_DATA.kpis.perceivedDifficulty)
    },
    radar: radarSource.length > 0 ? radarSource : FALLBACK_DATA.radar,
    ratingDistribution,
    trend: trendSource.length > 0 ? trendSource : FALLBACK_DATA.trend,
    insight: {
      strengths: strengths.length > 0 ? strengths : FALLBACK_DATA.insight.strengths,
      improvements: improvements.length > 0 ? improvements : FALLBACK_DATA.insight.improvements
    }
  }
}

function CourseDetailDashboard() {
  const screens = Grid.useBreakpoint()
  const isMobile = !screens.md
  const navigate = useNavigate()
  const params = useParams()
  const courseId = params.courseId ?? ''

  const [loading, setLoading] = useState(true)
  const [dashboardData, setDashboardData] = useState<CourseDetailDashboardData | null>(null)

  useEffect(() => {
    let mounted = true

    const loadData = async () => {
      setLoading(true)

      try {
        const response = await fetch(`/api/instructor/course/${courseId}`, { method: 'GET' })

        if (!response.ok) {
          throw new Error('Không thể tải dữ liệu chi tiết môn học')
        }

        const payload = await response.json()
        if (!mounted) return

        setDashboardData(normalizeDashboardData(payload))
      } catch {
        if (!mounted) return
        setDashboardData(getFallbackByCourseId(courseId))
      } finally {
        if (mounted) setLoading(false)
      }
    }

    if (courseId) {
      loadData()
    } else {
      setDashboardData(getFallbackByCourseId(courseId))
      setLoading(false)
    }

    return () => {
      mounted = false
    }
  }, [courseId])

  const safeData = useMemo(() => dashboardData ?? getFallbackByCourseId(courseId), [dashboardData, courseId])
  const stickyHeaderTop = isMobile ? 120 : 88

  if (loading) {
    return (
      <Card style={surfaceCardStyle}>
        <div style={{ minHeight: 280, display: 'grid', placeItems: 'center' }}>
          <Space direction="vertical" size={12} align="center">
            <Spin size="large" />
            <Typography.Text style={{ color: '#42546B' }}>Đang tải bảng điều khiển chi tiết môn học...</Typography.Text>
          </Space>
        </div>
      </Card>
    )
  }

  return (
    <div style={{ width: '100%' }}>
      <div
        style={{
          width: '100%',
          maxWidth: 1480,
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 20
        }}
      >
        <div style={{ position: 'sticky', top: stickyHeaderTop, zIndex: 30 }}>
          <Card
            style={{ ...surfaceCardStyle, width: '100%' }}
            bodyStyle={{ minHeight: 158, padding: '26px 24px', display: 'flex', alignItems: 'center' }}
          >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, width: '100%' }}>
          <Button
            shape="circle"
            size="large"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate('/instructor/courses')}
            style={{ borderRadius: 999, width: 44, height: 44, minWidth: 44 }}
            aria-label="Quay lại danh sách môn"
          />

          <Space direction="vertical" size={18} style={{ width: '100%' }}>
            <Typography.Title level={2} style={{ margin: 0, color: '#163253' }}>
              {safeData.header.courseName}
            </Typography.Title>

            <Space size={12} wrap style={{ marginTop: 2 }}>
              <span style={badgeStyle}>
                <Typography.Text style={{ color: '#42546B' }}>
                  Học kỳ: <strong style={{ color: '#163253' }}>{safeData.header.semester}</strong>
                </Typography.Text>
              </span>
              <span style={badgeStyle}>
                <Typography.Text style={{ color: '#42546B' }}>
                  Tổng phản hồi: <strong style={{ color: '#163253' }}>{safeData.header.totalResponses}</strong>
                </Typography.Text>
              </span>
              <span style={badgeStyle}>
                <Typography.Text style={{ color: '#42546B' }}>
                  Độ tin cậy dữ liệu: <strong style={{ color: '#163253' }}>{safeData.header.dataReliabilityPercent}%</strong>
                </Typography.Text>
              </span>
            </Space>
          </Space>
        </div>
          </Card>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Row gutter={[16, 16]}>
        <Col xs={24} lg={6}>
          <StatCard title="Chỉ số chất lượng" value={safeData.kpis.qualityIndex.toFixed(1)} />
        </Col>
        <Col xs={24} lg={6}>
          <StatCard title="Điểm môn học" value={safeData.kpis.courseScore.toFixed(1)} />
        </Col>
        <Col xs={24} lg={6}>
          <StatCard title="Điểm giảng viên" value={safeData.kpis.instructorScore.toFixed(1)} />
        </Col>
        <Col xs={24} lg={6}>
          <StatCard title="Độ khó cảm nhận" value={safeData.kpis.perceivedDifficulty} />
        </Col>
        </Row>

        <Row gutter={[16, 16]} align="stretch">
        <Col xs={24} lg={12} style={{ display: 'flex' }}>
          <Card style={{ ...surfaceCardStyle, width: '100%' }} title="Biểu đồ radar (yếu tố giảng dạy)">
            {safeData.radar.length === 0 ? (
              <Empty description="Chưa có dữ liệu" />
            ) : (
              <div style={{ width: '100%', height: chartHeight }}>
                <ResponsiveContainer>
                  <RadarChart data={safeData.radar}>
                    <PolarGrid stroke="#D7E1F0" />
                    <PolarAngleAxis dataKey="factor" tick={{ fill: '#42546B', fontSize: 12 }} />
                    <Tooltip />
                    <Radar dataKey="score" name="Yếu tố giảng dạy" stroke="#004286" fill="#004286" fillOpacity={0.25} strokeWidth={2} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            )}
          </Card>
        </Col>

        <Col xs={24} lg={12} style={{ display: 'flex' }}>
          <Card style={{ ...surfaceCardStyle, width: '100%' }} title="Biểu đồ cột (phân bố đánh giá 1-5)">
            {safeData.ratingDistribution.length === 0 ? (
              <Empty description="Chưa có dữ liệu" />
            ) : (
              <div style={{ width: '100%', height: chartHeight }}>
                <ResponsiveContainer>
                  <BarChart data={safeData.ratingDistribution} margin={{ left: 8, right: 8 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E3EAF5" />
                    <XAxis dataKey="rating" tick={{ fill: '#42546B', fontSize: 12 }} />
                    <YAxis allowDecimals={false} tick={{ fill: '#42546B', fontSize: 12 }} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" name="Số phản hồi" radius={[8, 8, 0, 0]} fill="#2F5E9E" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </Card>
        </Col>

        <Col xs={24} lg={12} style={{ display: 'flex' }}>
          <Card
            style={{ ...surfaceCardStyle, width: '100%', height: '100%' }}
            bodyStyle={{ height: chartHeight, padding: 16 }}
            title="Biểu đồ đường (xu hướng theo thời gian)"
          >
            {safeData.trend.length === 0 ? (
              <Empty description="Chưa có dữ liệu" />
            ) : (
              <div style={{ width: '100%', height: '100%' }}>
                <ResponsiveContainer>
                  <LineChart data={safeData.trend} margin={{ left: 8, right: 8 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E3EAF5" />
                    <XAxis dataKey="period" tick={{ fill: '#42546B', fontSize: 12 }} />
                    <YAxis tick={{ fill: '#42546B', fontSize: 12 }} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="score" name="Xu hướng chất lượng" stroke="#004286" strokeWidth={3} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </Card>
        </Col>

        <Col xs={24} lg={12} style={{ display: 'flex' }}>
          <Card
            style={{ ...surfaceCardStyle, width: '100%', height: '100%' }}
            title="Hộp nhận định"
            bodyStyle={{ height: chartHeight, padding: 16 }}
          >
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 10 }}>
              <Card
                size="small"
                title="Top 3 điểm mạnh"
                bodyStyle={{ padding: '12px 16px', height: '100%' }}
                style={{ borderRadius: 12, borderColor: '#D5E6FF', background: '#F4F8FF', flex: 1, margin: 0 }}
              >
                <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.8 }}>
                  {safeData.insight.strengths.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </Card>

              <Card
                size="small"
                title="Top 3 điểm cần cải thiện"
                bodyStyle={{ padding: '12px 16px', height: '100%' }}
                style={{ borderRadius: 12, borderColor: '#FFE3C0', background: '#FFF8ED', flex: 1, margin: 0 }}
              >
                <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.8 }}>
                  {safeData.insight.improvements.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </Card>
            </div>
          </Card>
        </Col>
        </Row>
        </div>
      </div>
    </div>
  )
}

export default CourseDetailDashboard
