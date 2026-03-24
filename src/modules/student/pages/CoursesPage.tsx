import { useMemo } from 'react'
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

  const { data: courses = [], isLoading, isError, error, refetch } = useStudentCoursesQuery({
    semester: selectedSemester,
    keyword: searchKeyword
  })

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
        render: (value: number) => value.toFixed(1)
      },
      {
        title: 'Điểm giảng viên',
        dataIndex: 'instructorScore',
        key: 'instructorScore',
        align: 'center',
        width: 180,
        render: (value: number) => `${value.toFixed(1)}/5`
      },
      {
        title: 'Trạng thái',
        dataIndex: 'feedbackStatus',
        key: 'feedbackStatus',
        align: 'center',
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
    [navigate]
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
