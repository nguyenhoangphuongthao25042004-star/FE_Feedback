import { useMemo } from 'react'
import { ArrowLeftOutlined, CheckCircleOutlined, InfoCircleOutlined, WarningOutlined } from '@ant-design/icons'
import {
  Alert,
  Button,
  Card,
  Col,
  Empty,
  Row,
  Space,
  Spin,
  Tag,
  Typography
} from 'antd'
import {
  Bar,
  BarChart,
  CartesianGrid,
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

import { useStudentCourseDetailQuery } from '../../student/api/courseDetailApi'
import type { CourseDetailDifficulty, CourseDetailStatus } from '../../student/types/courseDetail'
import { getFeedbackWorkflowState } from '../../student/api/feedbackData'

const baseCardStyle = {
  borderRadius: 20,
  border: '1px solid #D7E1F0',
  boxShadow: '0 12px 28px rgba(0, 45, 109, 0.08)'
} as const

const metaChipStyle = {
  background: '#F4F8FF',
  border: '1px solid #D6E4F7',
  borderRadius: 999,
  padding: '6px 12px',
  display: 'inline-flex',
  alignItems: 'center'
} as const

const statusStyleMap: Record<CourseDetailStatus, { label: string, bg: string, color: string, border: string }> = {
  'dang-hoc': { label: 'Đang học', bg: '#E8F1FF', color: '#2F5E9E', border: '#D5E6FF' },
  'da-phan-hoi': { label: 'Đã phản hồi', bg: '#EAF7EE', color: '#389E0D', border: '#D1F0DC' },
  'chua-phan-hoi': { label: 'Chưa phản hồi', bg: '#FFF6E6', color: '#D48806', border: '#FFE4B5' }
}

const difficultyStyleMap: Record<CourseDetailDifficulty, { label: string, bg: string, color: string, border: string }> = {
  de: { label: 'Dễ', bg: '#EAF7EE', color: '#389E0D', border: '#D1F0DC' },
  'trung-binh': { label: 'Trung bình', bg: '#E8F1FF', color: '#2F5E9E', border: '#D5E6FF' },
  kho: { label: 'Khó', bg: '#FDECEF', color: '#CF1322', border: '#F7D7DE' }
}

type KpiCardProps = {
  title: string
  value: string
  extra?: React.ReactNode
}

function KpiCard({ title, value, extra }: KpiCardProps) {
  return (
    <Card
      style={{
        ...baseCardStyle,
        width: '100%',
        height: '100%'
      }}
      styles={{ body: { height: '100%' } }}
    >
      <Space
        direction="vertical"
        size={8}
        style={{
          width: '100%',
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center'
        }}
      >
        <Typography.Text style={{ color: '#42546B', fontSize: 14 }}>{title}</Typography.Text>
        <Typography.Title level={3} style={{ margin: 0, color: '#163253' }}>
          {value}
        </Typography.Title>
        {extra}
      </Space>
    </Card>
  )
}

export default function CourseDetailPage() {
  const navigate = useNavigate()
  const params = useParams()
  const courseId = params.courseId ?? ''

  const { data, isLoading, isError, error } = useStudentCourseDetailQuery(courseId)

  const submissionMap = getFeedbackWorkflowState().submissions ?? {}
  const submissionExists = Boolean(submissionMap[courseId])
  const responseCount = submissionExists ? 1 : 0

  const dataConfidence = useMemo(() => {
    if (responseCount >= 10) return { label: 'Rất tin cậy', percent: 92 }
    if (responseCount >= 5) return { label: 'Khá tin cậy', percent: 72 }
    if (responseCount > 0) return { label: 'Độ tin cậy thấp', percent: 38 }
    return { label: 'Không đủ dữ liệu', percent: 12 }
  }, [responseCount])

  const statusStyle = useMemo(() => {
    if (!data) return statusStyleMap['dang-hoc']
    return statusStyleMap[data.header.status]
  }, [data])

  if (isLoading) {
    return (
      <Card style={baseCardStyle}>
        <div
          style={{
            minHeight: 280,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            gap: 12,
            color: '#42546B'
          }}
        >
          <Spin size="large" />
          <Typography.Text>Đang tải chi tiết môn học...</Typography.Text>
        </div>
      </Card>
    )
  }

  if (isError) {
    return (
      <Alert
        type="error"
        showIcon
        message="Không tải được chi tiết môn học"
        description={(error as Error)?.message}
      />
    )
  }

  if (!data) {
    return (
      <Card style={baseCardStyle}>
        <Empty description="Không tìm thấy thông tin môn học" />
      </Card>
    )
  }

  const difficultyStyle = difficultyStyleMap[data.kpis.difficultyLevel]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <Card style={baseCardStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <Button
            shape="circle"
            size="large"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate('/instructor/courses')}
            aria-label="Quay lại danh sách môn giảng dạy"
          />

          <Space direction="vertical" size={14} style={{ width: '100%' }}>
            <Typography.Title
              level={1}
              style={{
                margin: 0,
                color: '#163253',
                fontSize: 32,
                fontWeight: 800,
                letterSpacing: 0.4
              }}
            >
              {data.header.subjectName}
            </Typography.Title>

            <Space size={20} align="center" wrap style={{ rowGap: 10 }}>
              <span style={metaChipStyle}>
                <Typography.Text style={{ color: '#42546B', fontSize: 15, lineHeight: 1.4 }}>
                  Học kỳ: <strong style={{ color: '#163253' }}>{data.header.semester}</strong>
                </Typography.Text>
              </span>
              <span style={metaChipStyle}>
                <Typography.Text style={{ color: '#42546B', fontSize: 15, lineHeight: 1.4 }}>
                  Giảng viên: <strong style={{ color: '#163253' }}>{data.header.instructor}</strong>
                </Typography.Text>
              </span>

              <span style={metaChipStyle}>
                <Typography.Text style={{ color: '#42546B', fontSize: 15, lineHeight: 1.4 }}>
                  Số phản hồi: <strong style={{ color: '#163253' }}>{responseCount}</strong>
                </Typography.Text>
              </span>

              <span style={metaChipStyle}>
                <Typography.Text style={{ color: '#42546B', fontSize: 15, lineHeight: 1.4 }}>
                  Độ tin cậy dữ liệu: <strong style={{ color: '#163253' }}>{dataConfidence.label}</strong>
                </Typography.Text>
              </span>

              <Tag
                style={{
                  background: statusStyle.bg,
                  color: statusStyle.color,
                  borderColor: statusStyle.border,
                  borderRadius: 999,
                  paddingInline: 14,
                  height: 32,
                  display: 'inline-flex',
                  alignItems: 'center',
                  margin: 0
                }}
              >
                {statusStyle.label}
              </Tag>
            </Space>
          </Space>
        </div>
      </Card>

      <Row gutter={[24, 20]} align="stretch">
        <Col xs={24} sm={12} xl={6} style={{ display: 'flex' }}>
          <KpiCard title="Quality Index" value={data.kpis.overallCourseScore.toFixed(1)} />
        </Col>
        <Col xs={24} sm={12} xl={6} style={{ display: 'flex' }}>
          <KpiCard title="Điểm môn học" value={`${data.kpis.overallCourseScore.toFixed(1)}`} />
        </Col>
        <Col xs={24} sm={12} xl={6} style={{ display: 'flex' }}>
          <KpiCard
            title="Điểm giảng viên"
            value={`${data.kpis.instructorScore.toFixed(1)}/5`}
          />
        </Col>
        <Col xs={24} sm={12} xl={6} style={{ display: 'flex' }}>
          <KpiCard title="Độ khó cảm nhận" value={difficultyStyle.label} />
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} xl={12}>
          <Card style={baseCardStyle}>
            <Typography.Title level={4} style={{ marginTop: 0, marginBottom: 12, color: '#163253' }}>
              Radar chart: các yếu tố giảng dạy
            </Typography.Title>
            <div style={{ width: '100%', height: 320 }}>
              <ResponsiveContainer>
                <RadarChart data={data.qualityRadar}>
                  <PolarGrid stroke="#D7E1F0" />
                  <PolarAngleAxis dataKey="metric" tick={{ fill: '#42546B', fontSize: 12 }} />
                  <Radar
                    name="Chất lượng"
                    dataKey="score"
                    stroke="#004286"
                    fill="#5D8CC7"
                    fillOpacity={0.35}
                    strokeWidth={2}
                  />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>

        <Col xs={24} xl={12}>
          <Card style={baseCardStyle}>
            <Typography.Title level={4} style={{ marginTop: 0, marginBottom: 12, color: '#163253' }}>
              Bar chart: phân bố đánh giá 1–5
            </Typography.Title>
            <div style={{ width: '100%', height: 320 }}>
              <ResponsiveContainer>
                <BarChart data={data.instructorBars} margin={{ left: 8, right: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E3EAF5" />
                  <XAxis dataKey="factor" tick={{ fill: '#42546B', fontSize: 12 }} />
                  <YAxis domain={[0, 5]} tick={{ fill: '#42546B', fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="score" radius={[8, 8, 0, 0]} fill="#2F5E9E" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[20, 20]}>
        <Col xs={24} lg={8} style={{ display: 'flex' }}>
          <Card style={{ ...baseCardStyle, width: '100%', height: '100%' }}>
            <Alert
              type="success"
              showIcon
              icon={<CheckCircleOutlined />}
              message="Top điểm mạnh"
              description={
                <ul style={{ margin: 0, paddingLeft: 18 }}>
                  {data.insight.strengths.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              }
            />
          </Card>
        </Col>
        <Col xs={24} lg={8} style={{ display: 'flex' }}>
          <Card style={{ ...baseCardStyle, width: '100%', height: '100%' }}>
            <Alert
              type="error"
              showIcon
              icon={<WarningOutlined />}
              message="Top vấn đề cần cải thiện"
              description={
                <ul style={{ margin: 0, paddingLeft: 18 }}>
                  {data.insight.limitations.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              }
            />
          </Card>
        </Col>
        <Col xs={24} lg={8} style={{ display: 'flex' }}>
          <Card style={{ ...baseCardStyle, width: '100%', height: '100%' }}>
            <Alert
              type="info"
              showIcon
              icon={<InfoCircleOutlined />}
              message="Gợi ý cải thiện"
              description={
                <ul style={{ margin: 0, paddingLeft: 18 }}>
                  {data.insight.suggestions.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              }
            />
          </Card>
        </Col>
      </Row>
    </div>
  )
}
