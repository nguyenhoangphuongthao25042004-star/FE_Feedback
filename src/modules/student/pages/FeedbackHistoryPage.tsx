import { useMemo } from 'react'
import { Alert, Card, Space, Spin, Table, Tag, Typography } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'

import { useFeedbackHistoryQuery } from '../api/student.api'
import { useUiStore } from '../../../stores/ui.store'
import type { FeedbackHistory } from '../types/student.types'

const cardStyle = {
  borderRadius: 8,
  border: '1px solid #D7E1F0',
  background: '#FFFFFF',
  boxShadow: '0 8px 20px rgba(0, 45, 109, 0.08)'
} as const

export default function FeedbackHistoryPage() {
  const selectedSemester = useUiStore((state) => state.selectedSemester)
  const searchKeyword = useUiStore((state) => state.searchKeyword)
  const { data, isLoading, isError, error } = useFeedbackHistoryQuery()

  const tableData = useMemo(() => {
    const rows = data?.data ?? []
    const normalizedKeyword = searchKeyword.trim().toLowerCase()

    const filteredBySemester = selectedSemester === 'all'
      ? rows
      : rows.filter((item) => item.semester === selectedSemester)

    if (normalizedKeyword.length === 0) {
      return filteredBySemester
    }

    return filteredBySemester.filter((item) => (
      item.subject.toLowerCase().includes(normalizedKeyword)
      || item.instructor.toLowerCase().includes(normalizedKeyword)
    ))
  }, [data?.data, searchKeyword, selectedSemester])

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
      render: (value: number) => `${value.toFixed(1)}/5`
    },
    {
      title: 'Điểm tổng thể giảng viên',
      dataIndex: 'instructorOverallScore',
      key: 'instructorOverallScore',
      align: 'center',
      render: (value: number) => `${value.toFixed(1)}/5`
    },
    {
      title: 'Trạng thái phản hồi',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      render: (value: FeedbackHistory['status']) => (
        <Tag color={value === 'submitted' ? 'green' : 'default'}>
          {value === 'submitted' ? 'Đã phản hồi' : 'Chưa phản hồi'}
        </Tag>
      )
    }
  ]

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
            pagination={{ pageSize: 6, showSizeChanger: false }}
          />
        )}
      </Card>
    </div>
  )
}
