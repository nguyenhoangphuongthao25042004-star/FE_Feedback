import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Alert, Button, Card, Space, Spin, Table, Tag, Typography } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'

import { useFeedbackHistoryQuery } from '../api/student.api'
import { useUiStore } from '../../../stores/ui.store'
import type { FeedbackHistory } from '../types/student.types'
import { EyeOutlined } from '@ant-design/icons'

const cardStyle = {
  borderRadius: 20,
  border: '1px solid #D7E1F0',
  background: '#FFFFFF',
  boxShadow: '0 8px 20px rgba(0, 45, 109, 0.08)'
} as const

export default function FeedbackHistoryPage() {
  const selectedSemester = useUiStore((state) => state.selectedSemester)
  const searchKeyword = useUiStore((state) => state.searchKeyword)
  const [courseScoreSortOrder, setCourseScoreSortOrder] = useState<string | null>(null)
  const [instructorScoreSortOrder, setInstructorScoreSortOrder] = useState<string | null>(null)
  const [feedbackStatusFilter, setFeedbackStatusFilter] = useState<string | null>(null)
  const { data, isLoading, isError, error } = useFeedbackHistoryQuery()
  const navigate = useNavigate()

  const tableData = useMemo(() => {
    const rows = data?.data ?? []
    const normalizedKeyword = searchKeyword.trim().toLowerCase()

    const filteredBySemester = selectedSemester === 'all'
      ? rows
      : rows.filter((item) => item.semester === selectedSemester)

    const filteredByKeyword = normalizedKeyword.length === 0
      ? filteredBySemester
      : filteredBySemester.filter((item) => (
        item.subject.toLowerCase().includes(normalizedKeyword)
        || item.instructor.toLowerCase().includes(normalizedKeyword)
      ))

    let result = [...filteredByKeyword]

    if (feedbackStatusFilter) {
      result = result.filter((item) => item.status === feedbackStatusFilter)
    }

    if (courseScoreSortOrder === 'asc') {
      result.sort((a, b) => a.courseOverallScore - b.courseOverallScore)
    } else if (courseScoreSortOrder === 'desc') {
      result.sort((a, b) => b.courseOverallScore - a.courseOverallScore)
    }

    if (instructorScoreSortOrder === 'asc') {
      result.sort((a, b) => a.instructorOverallScore - b.instructorOverallScore)
    } else if (instructorScoreSortOrder === 'desc') {
      result.sort((a, b) => b.instructorOverallScore - a.instructorOverallScore)
    }

    return result
  }, [
    data?.data,
    searchKeyword,
    selectedSemester,
    feedbackStatusFilter,
    courseScoreSortOrder,
    instructorScoreSortOrder
  ])

  const columns: ColumnsType<FeedbackHistory> = [
    {
      title: 'Ngày gửi',
      dataIndex: 'submittedAt',
      key: 'submittedAt',
      align: 'center',
      render: (value: string) => dayjs(value).format('DD/MM/YYYY')
    },
    {
      title: 'Môn học',
      dataIndex: 'subject',
      key: 'subject',
      align: 'center',
      render: (value: string) => <Typography.Text strong>{value}</Typography.Text>
    },
    {
      title: 'Giảng viên',
      dataIndex: 'instructor',
      key: 'instructor',
      align: 'center'
    },
    {
      title: 'Điểm tổng thể môn',
      dataIndex: 'courseOverallScore',
      key: 'courseOverallScore',
      align: 'center',
      filters: [
        { text: 'Tăng dần', value: 'asc' },
        { text: 'Giảm dần', value: 'desc' }
      ],
      filterMultiple: false,
      filteredValue: courseScoreSortOrder ? [courseScoreSortOrder] : [],
      render: (value: number) => `${value.toFixed(1)}/5`
    },
    {
      title: 'Điểm tổng thể giảng viên',
      dataIndex: 'instructorOverallScore',
      key: 'instructorOverallScore',
      align: 'center',
      filters: [
        { text: 'Tăng dần', value: 'asc' },
        { text: 'Giảm dần', value: 'desc' }
      ],
      filterMultiple: false,
      filteredValue: instructorScoreSortOrder ? [instructorScoreSortOrder] : [],
      render: (value: number) => `${value.toFixed(1)}/5`
    },
    {
      title: 'Trạng thái phản hồi',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      filters: [
        { text: 'Đã phản hồi', value: 'submitted' },
        { text: 'Chưa phản hồi', value: 'draft' }
      ],
      filterMultiple: false,
      filteredValue: feedbackStatusFilter ? [feedbackStatusFilter] : [],
      render: (value: FeedbackHistory['status']) => (
        <Tag
          style={
            value === 'submitted'
              ? undefined
              : {
                background: '#FFF7E6',
                color: '#D48806',
                borderColor: '#FFD591',
                borderRadius: 999,
                paddingInline: 12
              }
          }
          color={value === 'submitted' ? 'green' : undefined}
        >
          {value === 'submitted' ? 'Đã phản hồi' : 'Chưa phản hồi'}
        </Tag>
      )
    }
    ,{
      title: 'Hành động',
      key: 'actions',
      align: 'center',
      width: 160,
      render: (_value: unknown, record: FeedbackHistory) => (
        <Button
          icon={<EyeOutlined />}
          onClick={() => handleView(record)}
          style={{ borderRadius: 999 }}
        >
          Xem chi tiết
        </Button>
      )
    }
  ]

  const handleView = (item: FeedbackHistory) => {
    // Navigate to the feedback form in read-only view mode
    if (!item.courseId) return
    navigate(`/student/history/view/${item.courseId}`)
  }

  return (
    <div style={{ background: '#EEF3FB', display: 'flex', flexDirection: 'column', gap: 20 }}>
      <Card style={cardStyle}>
        <Space direction="vertical" size={12} style={{ width: '100%', alignItems: 'flex-start' }}>
          <Typography.Title
            level={1}
            style={{
              margin: 0,
              color: '#163253',
              fontSize: 32,
              fontWeight: 800,
              letterSpacing: 0.4,
              textAlign: 'left'
            }}
          >
            Lịch sử phản hồi
          </Typography.Title>

          <Typography.Text style={{ color: '#42546B', textAlign: 'left' }}>
            Theo dõi toàn bộ phản hồi bạn đã gửi hoặc lưu nháp theo từng môn học.
          </Typography.Text>
        </Space>
      </Card>

      {isError && (
        <Alert
          type="error"
          showIcon
          message="Không tải được lịch sử phản hồi"
          description={(error as Error)?.message}
        />
      )}

      <Card style={cardStyle}>
        {isLoading ? (
          <div style={{ minHeight: 260, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Spin size="large" />
          </div>
        ) : (
          <Table<FeedbackHistory>
            rowKey="id"
            columns={columns}
            dataSource={tableData}
            onChange={(_, filters) => {
              const courseScoreFilters = filters.courseOverallScore as string[] | null
              const instructorScoreFilters = filters.instructorOverallScore as string[] | null
              const feedbackStatusFilters = filters.status as string[] | null

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

              if (feedbackStatusFilters && feedbackStatusFilters.length > 0) {
                setFeedbackStatusFilter(feedbackStatusFilters[0])
              } else {
                setFeedbackStatusFilter(null)
              }
            }}
            pagination={{ pageSize: 6, showSizeChanger: false }}
          />
        )}
      </Card>
    </div>
  )
}
