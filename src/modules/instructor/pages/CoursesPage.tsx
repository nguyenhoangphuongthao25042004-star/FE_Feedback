import { useMemo, useState } from 'react'
import { ArrowDownOutlined, ArrowUpOutlined, EyeOutlined, FilterFilled, FilterOutlined, MinusOutlined } from '@ant-design/icons'
import { Alert, Button, Card, Grid, Select, Table, Tag, Typography, Row, Col } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useNavigate } from 'react-router-dom'

import { useStudentCoursesQuery } from '../../student/api/courseApi'
import { getFeedbackWorkflowState } from '../../student/api/feedbackData'
import type { Course } from '../../student/types/course'
import { useUiStore } from '../../../stores/ui.store'
import PageHeader from '../../../components/layout/PageHeader'

const cardStyle = {
  borderRadius: 20,
  border: '1px solid #D7E1F0',
  boxShadow: '0 12px 28px rgba(0, 45, 109, 0.08)'
} as const

const getStatusLabel = (status: Course['feedbackStatus']) => {
  if (status === 'dang-hoc') return 'Đang học'
  if (status === 'da-phan-hoi') return 'Đã phản hồi'
  return 'Chưa phản hồi'
}

const getTrendConfig = (courseScore: number) => {
  const normalized = courseScore > 5 ? courseScore / 2 : courseScore

  if (normalized >= 4) {
    return { label: 'Tăng', color: '#389E0D', icon: <ArrowUpOutlined /> }
  }

  if (normalized <= 2.5) {
    return { label: 'Giảm', color: '#CF1322', icon: <ArrowDownOutlined /> }
  }

  return { label: 'Ổn định', color: '#8C9AAE', icon: <MinusOutlined /> }
}

export default function CoursesPage() {
  const screens = Grid.useBreakpoint()
  const isMobile = !screens.md
  const isTablet = Boolean(screens.md && !screens.xxl)
  const shouldUseCardLayout = isMobile || isTablet
  const navigate = useNavigate()
  const selectedSemester = useUiStore((state) => state.selectedSemester)
  const searchKeyword = useUiStore((state) => state.searchKeyword)
  const semesterFilter = selectedSemester ?? 'all'
  
  const [courseResultFilter, setCourseResultFilter] = useState<string | null>(null)
  const [difficultyFilter, setDifficultyFilter] = useState<string | null>(null)
  const [feedbackStatusFilter, setFeedbackStatusFilter] = useState<string | null>(null)
  const [trendFilter, setTrendFilter] = useState<string | null>(null)
  const [courseScoreSortOrder, setCourseScoreSortOrder] = useState<string | null>(null)
  const [instructorScoreSortOrder, setInstructorScoreSortOrder] = useState<string | null>(null)

  const { data: baseData = [], isLoading, isError, error, refetch } = useStudentCoursesQuery({
    semester: semesterFilter === 'all' ? 'all' : semesterFilter,
    keyword: ''
  })

  const submissions = useMemo(() => getFeedbackWorkflowState().submissions ?? {}, [])

  const courses = useMemo(() => {
    let result = [...baseData]

    const normalizedKeyword = searchKeyword?.trim().toLowerCase() ?? ''
    if (normalizedKeyword.length > 0) {
      result = result.filter((course) => course.subject.toLowerCase().includes(normalizedKeyword))
    }

    if (courseResultFilter) {
      result = result.filter((course) => course.courseResult === courseResultFilter)
    }

    if (difficultyFilter) {
      result = result.filter((course) => course.difficultyLevel === difficultyFilter)
    }

  const effectiveStatus = feedbackStatusFilter
    if (effectiveStatus) {
      result = result.filter((course) => course.feedbackStatus === effectiveStatus)
    }

    if (trendFilter) {
      result = result.filter((course) => getTrendConfig(course.courseScore).label === trendFilter)
    }

    if (courseScoreSortOrder === 'asc') {
      result.sort((a, b) => a.courseScore - b.courseScore)
    } else if (courseScoreSortOrder === 'desc') {
      result.sort((a, b) => b.courseScore - a.courseScore)
    }

    if (instructorScoreSortOrder === 'asc') {
      result.sort((a, b) => a.instructorScore - b.instructorScore)
    } else if (instructorScoreSortOrder === 'desc') {
      result.sort((a, b) => b.instructorScore - a.instructorScore)
    }

    return result
  }, [
    baseData,
    searchKeyword,
    courseResultFilter,
    difficultyFilter,
    feedbackStatusFilter,
    trendFilter,
    courseScoreSortOrder,
    instructorScoreSortOrder
  ])

  const columns: ColumnsType<Course> = useMemo(() => [
    {
      title: 'Môn học',
      dataIndex: 'subject',
      key: 'subject',
      align: 'center',
      width: 280,
      render: (value: string) => (
        <Typography.Text
          strong
          style={{
            whiteSpace: 'normal',
            wordBreak: 'break-word',
            lineHeight: 1.4,
            color: '#163253'
          }}
        >
          {value}
        </Typography.Text>
      )
    },
    {
      title: 'Học kỳ',
      dataIndex: 'semester',
      key: 'semester',
      align: 'center',
      width: 180,
      render: (value: string) => <Typography.Text style={{ color: '#42546B' }}>{value}</Typography.Text>
    },
    {
      title: 'Số phản hồi',
      key: 'responses',
      align: 'center',
      width: 140,
      render: (_, record) => <Typography.Text>{submissions[record.id] ? 1 : 0}</Typography.Text>
    },
    {
      title: 'QI môn',
      dataIndex: 'courseScore',
      key: 'courseScore',
      align: 'center',
      width: 120,
      filters: [
        { text: 'Tăng dần', value: 'asc' },
        { text: 'Giảm dần', value: 'desc' }
      ],
      filterMultiple: false,
      filteredValue: courseScoreSortOrder ? [courseScoreSortOrder] : [],
      filterIcon: () => (
        courseScoreSortOrder
          ? <FilterFilled style={{ color: '#000' }} />
          : <FilterOutlined style={{ color: '#000' }} />
      ),
      render: (value: number) => {
        const normalized = value > 5 ? value / 2 : value
        return <Typography.Text>{normalized.toFixed(1)}/5</Typography.Text>
      }
    },
    {
      title: 'QI giảng viên',
      dataIndex: 'instructorScore',
      key: 'instructorScore',
      align: 'center',
      width: 140,
      filters: [
        { text: 'Tăng dần', value: 'asc' },
        { text: 'Giảm dần', value: 'desc' }
      ],
      filterMultiple: false,
      filteredValue: instructorScoreSortOrder ? [instructorScoreSortOrder] : [],
      filterIcon: () => (
        instructorScoreSortOrder
          ? <FilterFilled style={{ color: '#000' }} />
          : <FilterOutlined style={{ color: '#000' }} />
      ),
      render: (value: number) => <Typography.Text>{value.toFixed(1)}/5</Typography.Text>
    },
    {
      title: 'Xu hướng',
      key: 'trend',
      align: 'center',
      width: 140,
      filters: [
        { text: 'Tăng', value: 'Tăng' },
        { text: 'Ổn định', value: 'Ổn định' },
        { text: 'Giảm', value: 'Giảm' }
      ],
      filterMultiple: false,
      filteredValue: trendFilter ? [trendFilter] : [],
      filterIcon: () => (
        trendFilter
          ? <FilterFilled style={{ color: '#000' }} />
          : <FilterOutlined style={{ color: '#000' }} />
      ),
      render: (_, record) => {
        const trend = getTrendConfig(record.courseScore)

        return (
          <Typography.Text style={{ color: trend.color }}>
            {trend.icon} {trend.label}
          </Typography.Text>
        )
      }
    },
    {
      title: 'Hành động',
      key: 'action',
      align: 'center',
      width: 140,
      render: (_, record) => (
        <Button icon={<EyeOutlined />} onClick={() => navigate(`/instructor/course/${record.id}`)}>
          Xem chi tiết
        </Button>
      )
    }
  ], [navigate, submissions, courseScoreSortOrder, instructorScoreSortOrder, trendFilter])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ background: '#FFFFFF', border: '1px solid #E8EEF8', borderRadius: 16, padding: 28, boxShadow: '0 8px 20px rgba(28,61,102,0.04)' }}>
        <Row align="top" justify="space-between">
          <Col flex="auto">
            <PageHeader title="Danh sách môn giảng dạy" description="Theo dõi nhanh kết quả học tập và phản hồi của sinh viên theo từng môn học bạn phụ trách" contentGap={8} />
          </Col>
          <Col style={{ display: 'flex', justifyContent: 'flex-end', minWidth: 240 }}>
            <div style={{ width: 450 }}>
              <div style={{ fontSize: 16, color: '#42546B', marginBottom: 6 }}></div>
              <Select
                allowClear
                placeholder="Trạng thái"
                size="large"
                style={{ width: '100%', fontSize: 16 }}
                value={feedbackStatusFilter ?? undefined}
                onChange={(v) => setFeedbackStatusFilter(v ?? null)}
              >
                <Select.Option value="dang-hoc">Đang học</Select.Option>
                <Select.Option value="chua-phan-hoi">Chưa phản hồi</Select.Option>
                <Select.Option value="da-phan-hoi">Đã phản hồi</Select.Option>
              </Select>
            </div>
          </Col>
        </Row>
      </div>

      {isError && (
        <Alert
          type="error"
          showIcon
          message="Không tải được dữ liệu môn học"
          description={(error as Error)?.message}
          action={
            <Button size="small" onClick={() => refetch()}>
              Thử lại
            </Button>
          }
        />
      )}

      <Card style={cardStyle}>
        {shouldUseCardLayout ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: isTablet ? 'repeat(2, minmax(0, 1fr))' : '1fr',
              gap: 16
            }}
          >
            {courses.map((course) => {
              const responseCount = submissions[course.id] ? 1 : 0
              const normalizedCourseScore = course.courseScore > 5 ? course.courseScore / 2 : course.courseScore
              const trend = getTrendConfig(course.courseScore)

              return (
                <Card
                  key={course.id}
                  size="small"
                  style={{
                    borderRadius: 18,
                    border: '1px solid #D7E1F0',
                    boxShadow: '0 8px 18px rgba(0, 45, 109, 0.06)'
                  }}
                  bodyStyle={{ padding: 16 }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <Typography.Text strong style={{ color: '#163253', fontSize: 20, lineHeight: 1.45 }}>
                        {course.subject}
                      </Typography.Text>
                      <Typography.Text style={{ color: '#42546B', fontSize: 15 }}>
                        Học kỳ: {course.semester}
                      </Typography.Text>
                    </div>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                      <Tag style={{ borderRadius: 999, paddingInline: 12, margin: 0 }}>
                        {getStatusLabel(course.feedbackStatus)}
                      </Tag>
                      <Tag style={{ borderRadius: 999, paddingInline: 12, margin: 0, color: trend.color, borderColor: '#D7E1F0' }}>
                        {trend.icon} {trend.label}
                      </Tag>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 12 }}>
                      <div>
                        <Typography.Text style={{ display: 'block', color: '#6B7A90', fontSize: 13 }}>
                          Số phản hồi
                        </Typography.Text>
                        <Typography.Text style={{ color: '#163253', fontSize: 15 }}>
                          {responseCount}
                        </Typography.Text>
                      </div>
                      <div>
                        <Typography.Text style={{ display: 'block', color: '#6B7A90', fontSize: 13 }}>
                          QI môn
                        </Typography.Text>
                        <Typography.Text style={{ color: '#163253', fontSize: 15 }}>
                          {normalizedCourseScore.toFixed(1)}/5
                        </Typography.Text>
                      </div>
                      <div>
                        <Typography.Text style={{ display: 'block', color: '#6B7A90', fontSize: 13 }}>
                          QI giảng viên
                        </Typography.Text>
                        <Typography.Text style={{ color: '#163253', fontSize: 15 }}>
                          {course.instructorScore.toFixed(1)}/5
                        </Typography.Text>
                      </div>
                    </div>

                    <div>
                      <Button icon={<EyeOutlined />} onClick={() => navigate(`/instructor/course/${course.id}`)}>
                        Xem chi tiết
                      </Button>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        ) : (
          <Table<Course>
            rowKey="id"
            loading={isLoading}
            columns={columns}
            dataSource={courses}
            onChange={(_, filters) => {
              const courseResultFilters = filters.courseResult as string[] | null
              const difficultyFilters = filters.difficultyLevel as string[] | null
              const feedbackStatusFilters = filters.feedbackStatus as string[] | null
              const trendFilters = filters.trend as string[] | null
              const courseScoreFilters = filters.courseScore as string[] | null
              const instructorScoreFilters = filters.instructorScore as string[] | null

              setCourseResultFilter(courseResultFilters?.[0] ?? null)
              setDifficultyFilter(difficultyFilters?.[0] ?? null)
              setFeedbackStatusFilter(feedbackStatusFilters?.[0] ?? null)
              setTrendFilter(trendFilters?.[0] ?? null)
              setCourseScoreSortOrder(courseScoreFilters?.[0] ?? null)
              setInstructorScoreSortOrder(instructorScoreFilters?.[0] ?? null)
            }}
            pagination={{
              pageSize: 6,
              showSizeChanger: false
            }}
            scroll={{ x: 1100 }}
          />
        )}
      </Card>
    </div>
  )
}
