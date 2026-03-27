import { useMemo, useState } from 'react'
import { EyeOutlined } from '@ant-design/icons'
import { Alert, Button, Card, Table, Typography } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useNavigate } from 'react-router-dom'

import { useStudentCoursesQuery } from '../../student/api/courseApi'
import type { Course } from '../../student/types/course'
import { useUiStore } from '../../../stores/ui.store'
import { Select, Space } from 'antd'
import { getFeedbackWorkflowState } from '../../student/api/feedbackData'
import { ArrowUpOutlined, ArrowDownOutlined, MinusOutlined } from '@ant-design/icons'

// Styling and helpers reused from student modules intentionally removed here

export default function CoursesPage() {
  const navigate = useNavigate()
  const selectedSemester = useUiStore((state) => state.selectedSemester)
  // local filters for instructor page (default to global store semester)
  // local semester filter defaults to the global selected semester
  const semesterFilter = selectedSemester ?? 'all'
  const [statusFilterSelect, setStatusFilterSelect] = useState<string | null>(null)
  const [courseResultFilter, setCourseResultFilter] = useState<string | null>(null)
  const [difficultyFilter, setDifficultyFilter] = useState<string | null>(null)
  const [feedbackStatusFilter, setFeedbackStatusFilter] = useState<string | null>(null)
  const [courseScoreSortOrder, setCourseScoreSortOrder] = useState<string | null>(null)
  const [instructorScoreSortOrder, setInstructorScoreSortOrder] = useState<string | null>(null)

  // Request the base course list unfiltered (we'll apply instructor-specific search locally)
  const { data: baseData = [], isLoading, isError, error, refetch } = useStudentCoursesQuery({
    semester: semesterFilter === 'all' ? 'all' : semesterFilter ?? 'all',
    keyword: ''
  })

  // Use the global topbar search keyword; instructor search should only match course subject
  const searchKeyword = useUiStore((state) => state.searchKeyword)

  const courses = useMemo(() => {
    let result = [...baseData]

    // Apply topbar search by course subject only (case-insensitive)
    const normalized = searchKeyword?.trim().toLowerCase() ?? ''
    if (normalized.length > 0) {
      result = result.filter((c) => c.subject.toLowerCase().includes(normalized))
    }

    if (courseResultFilter) {
      result = result.filter((course) => course.courseResult === courseResultFilter)
    }

    if (difficultyFilter) {
      result = result.filter((course) => course.difficultyLevel === difficultyFilter)
    }

    // apply status filter from either table filters or the top dropdown
    const effectiveStatus = statusFilterSelect ?? feedbackStatusFilter
    if (effectiveStatus) {
      result = result.filter((course) => course.feedbackStatus === effectiveStatus)
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
    statusFilterSelect,
    courseScoreSortOrder,
    instructorScoreSortOrder
  ])

  const columns: ColumnsType<Course> = useMemo(() => {
    const submissions = getFeedbackWorkflowState().submissions ?? {}

    return [
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
        render: (value: string) => (
          <Typography.Text style={{ color: '#42546B' }}>{value}</Typography.Text>
        )
      },
      {
        title: 'Số phản hồi',
        key: 'responses',
        align: 'center',
        width: 140,
        render: (_, record) => {
          const count = submissions && submissions[record.id] ? 1 : 0
          return <Typography.Text>{count}</Typography.Text>
        }
      },
      {
        title: 'QI môn',
        dataIndex: 'courseScore',
        key: 'courseScore',
        align: 'center',
        width: 120,
        render: (value: number) => {
          // Normalize to a 0-5 scale for display. If stored values are on a 0-10 scale, divide by 2.
          const numeric = typeof value === 'number' && !Number.isNaN(value) ? value : 0
          const display = numeric > 5 ? numeric / 2 : numeric

          return (
            <Typography.Text>{`${display.toFixed(1)}/5`}</Typography.Text>
          )
        }
      },
      {
        title: 'QI giảng viên',
        dataIndex: 'instructorScore',
        key: 'instructorScore',
        align: 'center',
        width: 140,
        render: (value: number) => <Typography.Text>{value.toFixed(1)}/5</Typography.Text>
      },
      {
        title: 'Xu hướng',
        key: 'trend',
        align: 'center',
        width: 140,
        render: (_, record) => {
          // simple heuristic for demo: high score => up, mid => flat, low => down
          const s = record.courseScore
          if (s >= 8) {
            return (
              <Typography.Text style={{ color: '#389E0D' }}>
                <ArrowUpOutlined /> Tăng
              </Typography.Text>
            )
          }

          if (s <= 5) {
            return (
              <Typography.Text style={{ color: '#CF1322' }}>
                <ArrowDownOutlined /> Giảm
              </Typography.Text>
            )
          }

          return (
            <Typography.Text style={{ color: '#c2cdd4ff' }}>
              <MinusOutlined /> Ổn định
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
          <Button
            icon={<EyeOutlined />}
            onClick={() => navigate(`/instructor/course/${record.id}`)}
          >
            Xem chi tiết
          </Button>
        )
      }
    ]
  }, [navigate])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <Card
        style={{
          borderRadius: 20,
          border: '1px solid #D7E1F0',
          boxShadow: '0 12px 28px rgba(0, 45, 109, 0.08)'
        }}
      >
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
          Danh sách môn giảng dạy
        </Typography.Title>
        <Typography.Text
          style={{
            marginTop: 10,
            display: 'inline-block',
            color: '#42546B',
            fontSize: 16,
            lineHeight: 1.6
          }}
        >
          Theo dõi nhanh kết quả học tập và phản hồi của sinh viên theo từng môn học bạn phụ trách
        </Typography.Text>
        <Space direction="horizontal" size={12} style={{ width: '100%', justifyContent: 'flex-start', gap: 16, marginTop: 16 }}>
          <Select
            placeholder="Trạng thái"
            allowClear
            style={{ width: 180 }}
            value={statusFilterSelect ?? undefined}
            onChange={(val) => setStatusFilterSelect(val ?? null)}
            options={[
              { label: 'Đang học', value: 'dang-hoc' },
              { label: 'Chưa phản hồi', value: 'chua-phan-hoi' },
              { label: 'Đã phản hồi', value: 'da-phan-hoi' }
            ]}
          />

          {/* Topbar provides the instructor-only course-name search; page-level search removed to avoid duplication */}
        </Space>
      
        
      </Card>

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

      <Card
        style={{
          borderRadius: 20,
          border: '1px solid #D7E1F0',
          boxShadow: '0 12px 28px rgba(0, 45, 109, 0.08)'
        }}
      >
        <Table<Course>
          rowKey="id"
          loading={isLoading}
          columns={columns}
          dataSource={courses}
          onChange={(_, filters) => {
            const courseResultFilters = filters.courseResult as string[] | null
            const difficultyFilters = filters.difficultyLevel as string[] | null
            const feedbackStatusFilters = filters.feedbackStatus as string[] | null
            const courseScoreFilters = filters.courseScore as string[] | null
            const instructorScoreFilters = filters.instructorScore as string[] | null

            if (courseResultFilters && courseResultFilters.length > 0) {
              setCourseResultFilter(courseResultFilters[0])
            } else {
              setCourseResultFilter(null)
            }

            if (difficultyFilters && difficultyFilters.length > 0) {
              setDifficultyFilter(difficultyFilters[0])
            } else {
              setDifficultyFilter(null)
            }

            if (feedbackStatusFilters && feedbackStatusFilters.length > 0) {
              setFeedbackStatusFilter(feedbackStatusFilters[0])
            } else {
              setFeedbackStatusFilter(null)
            }
            
            if (courseScoreFilters && courseScoreFilters.length > 0) {
              setCourseScoreSortOrder(courseScoreFilters[0])
            } else {
              setCourseScoreSortOrder(null)
            }
            
            if (instructorScoreFilters && instructorScoreFilters.length > 0) {
              setInstructorScoreSortOrder(instructorScoreFilters[0])
            } else {
              setInstructorScoreSortOrder(null)
            }
          }}
          pagination={{
            pageSize: 6,
            showSizeChanger: false
          }}
          scroll={{ x: 1100 }}
        />
      </Card>
    </div>
  )
}
