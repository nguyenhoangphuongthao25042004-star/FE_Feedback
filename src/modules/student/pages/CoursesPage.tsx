import { useMemo, useState } from 'react'
import { EyeOutlined } from '@ant-design/icons'
import { Alert, Button, Card, Table, Tag, Typography } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useNavigate } from 'react-router-dom'

import { useStudentCoursesQuery } from '../api/courseApi'
import type { Course, CourseDifficulty } from '../types/course'
import { useUiStore } from '../../../stores/ui.store'

const difficultyTagStyleMap: Record<CourseDifficulty, { background: string, color: string, borderColor: string }> = {
  de: { background: '#EAF7EE', color: '#389E0D', borderColor: '#D1F0DC' },
  'trung-binh': { background: '#E8F1FF', color: '#2F5E9E', borderColor: '#D5E6FF' },
  kho: { background: '#FDECEF', color: '#CF1322', borderColor: '#F7D7DE' }
}

const difficultyLabelMap: Record<CourseDifficulty, string> = {
  de: 'Dễ',
  'trung-binh': 'Trung bình',
  kho: 'Khó'
}

const statusTagStyleMap: Record<Course['feedbackStatus'], { label: string, background: string, color: string, borderColor: string }> = {
  'dang-hoc': { label: 'Đang học', background: '#E8F1FF', color: '#2F5E9E', borderColor: '#D5E6FF' },
  'chua-phan-hoi': { label: 'Chưa phản hồi', background: '#FFF6E6', color: '#D48806', borderColor: '#FFE4B5' },
  'da-phan-hoi': { label: 'Đã phản hồi', background: '#EAF7EE', color: '#389E0D', borderColor: '#D1F0DC' }
}

export default function CoursesPage() {
  const navigate = useNavigate()
  const selectedSemester = useUiStore((state) => state.selectedSemester)
  const searchKeyword = useUiStore((state) => state.searchKeyword)
  const [courseResultFilter, setCourseResultFilter] = useState<string | null>(null)
  const [difficultyFilter, setDifficultyFilter] = useState<string | null>(null)
  const [feedbackStatusFilter, setFeedbackStatusFilter] = useState<string | null>(null)
  const [courseScoreSortOrder, setCourseScoreSortOrder] = useState<string | null>(null)
  const [instructorScoreSortOrder, setInstructorScoreSortOrder] = useState<string | null>(null)

  const { data: baseData = [], isLoading, isError, error, refetch } = useStudentCoursesQuery({
    semester: selectedSemester,
    keyword: searchKeyword
  })

  const courses = useMemo(() => {
    let result = [...baseData]

    if (courseResultFilter) {
      result = result.filter((course) => course.courseResult === courseResultFilter)
    }

    if (difficultyFilter) {
      result = result.filter((course) => course.difficultyLevel === difficultyFilter)
    }

    if (feedbackStatusFilter) {
      result = result.filter((course) => course.feedbackStatus === feedbackStatusFilter)
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
    courseResultFilter,
    difficultyFilter,
    feedbackStatusFilter,
    courseScoreSortOrder,
    instructorScoreSortOrder
  ])

  const columns: ColumnsType<Course> = useMemo(
    () => [
      {
        title: 'Môn học',
        dataIndex: 'subject',
        key: 'subject',
        align: 'center',
        width: 250,
        render: (value: string) => (
          <Typography.Text
            strong
            style={{
              whiteSpace: 'normal',
              wordBreak: 'break-word',
              lineHeight: 1.4
            }}
          >
            {value}
          </Typography.Text>
        )
      },
      {
        title: 'Giảng viên',
        dataIndex: 'instructor',
        key: 'instructor',
        align: 'center',
        render: (value: string) => (
          <Typography.Text style={{ color: '#163253', fontSize: 15 }}>
            {value}
          </Typography.Text>
        )
      },
      {
        title: 'Kết quả môn học',
        dataIndex: 'courseResult',
        key: 'courseResult',
        align: 'center',
        filters: [
          { text: 'Đạt', value: 'pass' },
          { text: 'Không đạt', value: 'fail' }
        ],
        filterMultiple: false,
        filteredValue: courseResultFilter ? [courseResultFilter] : [],
        render: (value: Course['courseResult']) => (
          <Typography.Text style={{ color: '#163253', fontSize: 15 }}>
            {value === 'pass' ? 'Đạt' : 'Không đạt'}
          </Typography.Text>
        )
      },
      {
        title: 'Độ khó môn',
        dataIndex: 'difficultyLevel',
        key: 'difficultyLevel',
        align: 'center',
        filters: [
          { text: 'Dễ', value: 'de' },
          { text: 'Trung bình', value: 'trung-binh' },
          { text: 'Khó', value: 'kho' }
        ],
        filterMultiple: false,
        filteredValue: difficultyFilter ? [difficultyFilter] : [],
        render: (value: CourseDifficulty) => (
          <Tag
            style={{
              background: difficultyTagStyleMap[value].background,
              color: difficultyTagStyleMap[value].color,
              borderColor: difficultyTagStyleMap[value].borderColor,
              borderRadius: 999,
              paddingInline: 12
            }}
          >
            {difficultyLabelMap[value]}
          </Tag>
        )
      },
      {
        title: <span style={{ whiteSpace: 'nowrap' }}>Điểm môn học</span>,
        dataIndex: 'courseScore',
        key: 'courseScore',
        align: 'center',
        width: 150,
        filters: [
          { text: 'Tăng dần', value: 'asc' },
          { text: 'Giảm dần', value: 'desc' }
        ],
        filterMultiple: false,
        filteredValue: courseScoreSortOrder ? [courseScoreSortOrder] : [],
        render: (value: number) => value.toFixed(1)
      },
      {
        title: 'Điểm giảng viên',
        dataIndex: 'instructorScore',
        key: 'instructorScore',
        align: 'center',
        width: 180,
        filters: [
          { text: 'Tăng dần', value: 'asc' },
          { text: 'Giảm dần', value: 'desc' }
        ],
        filterMultiple: false,
        filteredValue: instructorScoreSortOrder ? [instructorScoreSortOrder] : [],
        render: (value: number) => `${value.toFixed(1)}/5`
      },
      {
        title: 'Trạng thái',
        dataIndex: 'feedbackStatus',
        key: 'feedbackStatus',
        align: 'center',
        filters: [
          { text: 'Đang học', value: 'dang-hoc' },
          { text: 'Chưa phản hồi', value: 'chua-phan-hoi' },
          { text: 'Đã phản hồi', value: 'da-phan-hoi' }
        ],
        filterMultiple: false,
        filteredValue: feedbackStatusFilter ? [feedbackStatusFilter] : [],
        render: (value: Course['feedbackStatus']) => (
          <Tag
            style={{
              background: statusTagStyleMap[value].background,
              color: statusTagStyleMap[value].color,
              borderColor: statusTagStyleMap[value].borderColor,
              borderRadius: 999,
              paddingInline: 12
            }}
          >
            {statusTagStyleMap[value].label}
          </Tag>
        )
      },
      {
        title: 'Hành động',
        key: 'action',
        align: 'center',
        width: 120,
        render: (_, record) => (
          <Button
            icon={<EyeOutlined />}
            onClick={() => navigate(`/student/course/${record.id}`)}
          >
            Xem chi tiết
          </Button>
        )
      }
    ],
    [navigate, courseScoreSortOrder, instructorScoreSortOrder, courseResultFilter, difficultyFilter, feedbackStatusFilter]
  )

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
          Môn học của tôi
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
          Theo dõi nhanh kết quả học tập và phản hồi của bạn theo từng môn học
        </Typography.Text>
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
