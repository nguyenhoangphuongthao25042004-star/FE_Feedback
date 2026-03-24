import { useEffect, useMemo, useState } from 'react'
import { Button, Col, Empty, Result, Row, Select, Space, Spin, Typography } from 'antd'

import StatCard from '../../../components/layout/StatCard'
import RecommendationItemCard from '../components/RecommendationItemCard'
import type { RecommendationData, RecommendationPriority, RecommendationStatus } from '../types/student.types'

// 4 trạng thái chính của trang gợi ý
type ViewState = 'loading' | 'success' | 'empty' | 'error'

// Dữ liệu giả cho trang gợi ý học tập
const mockRecommendationData: RecommendationData = {
  suitableSubjects: 'Xây dựng phần mềm web',
  needImprove: ['Xây dựng phần mềm thiết bị di động'],
  suitableInstructors: ['Giảng viên A'],
  items: [
    {
      id: 'REC-01',
      title: 'Ôn tập thêm môn Xây dựng phần mềm thiết bị di động',
      category: 'subject',
      priority: 'high',
      description: 'Điểm phản hồi của môn này đang thấp hơn các môn còn lại và cần được củng cố thêm.',
      actionLabel: '',
      status: 'pending'
    },
    {
      id: 'REC-02',
      title: 'Ưu tiên chọn học với Giảng viên A',
      category: 'instructor',
      priority: 'medium',
      description: 'Kết quả phản hồi cho thấy phong cách giảng dạy phù hợp với xu hướng học tập của bạn.',
      actionLabel: '',
      status: 'pending'
    },
    {
      id: 'REC-03',
      title: 'Tăng thời gian tự học mỗi tuần',
      category: 'study_method',
      priority: 'medium',
      description: 'Nên duy trì ít nhất 8 đến 10 giờ tự học mỗi tuần để cải thiện độ ổn định.',
      actionLabel: '',
      status: 'done'
    },
    {
      id: 'REC-04',
      title: 'Phát triển kỹ năng làm việc nhóm',
      category: 'skill',
      priority: 'low',
      description: 'Tham gia thêm các dự án nhóm để rèn luyện kỹ năng giao tiếp và hợp tác.',
      actionLabel: '',
      status: 'pending'
    }
  ]
}

// Style dùng lại cho card trạng thái và khối header
const statusCardStyle = {
  background: '#FFFFFF',
  border: '1px solid #D7E1F0',
  borderRadius: 24,
  padding: 24,
  boxShadow: '0 14px 30px rgba(28, 61, 102, 0.08)'
} as const

// Style cho khối header giới thiệu trang
const headerStyle = {
  ...statusCardStyle,
  marginBottom: 16
} as const

// Trang gợi ý học tập cho sinh viên
export default function RecommendationsPage() {
  const mockFinalState: ViewState = 'success' // đổi giá trị này nếu muốn thử loading empty error

  const [viewState, setViewState] = useState<ViewState>('loading') // trạng thái hiển thị trang
  const [selectedPriority, setSelectedPriority] = useState<RecommendationPriority | 'all'>('all') // lọc theo mức ưu tiên
  // Thêm filter trạng thái tương ứng với các "thanh màu xanh" (Chưa hoàn thành / Đã hoàn thành)
  const [selectedStatus, setSelectedStatus] = useState<RecommendationStatus | 'all'>('all') // mặc định: tất cả trạng thái

  // Mô phỏng quá trình tải dữ liệu khi vào trang
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setViewState(mockFinalState)
    }, 500)

    return () => window.clearTimeout(timer)
  }, [mockFinalState])

  // Danh sách lựa chọn cho bộ lọc mức ưu tiên
  const priorityOptions = [
    { value: 'all', label: 'Tất cả mức ưu tiên' },
    { value: 'high', label: 'Ưu tiên cao' },
    { value: 'medium', label: 'Ưu tiên vừa' },
    { value: 'low', label: 'Ưu tiên thấp' }
  ]

  // (Đã loại bỏ filter trạng thái theo yêu cầu)

  // Danh sách lựa chọn cho bộ lọc trạng thái (chỉ hai lựa chọn theo yêu cầu)
  const statusOptions = [
    { value: 'all', label: 'Tất cả trạng thái' },
    { value: 'pending', label: 'Chưa hoàn thành' },
    { value: 'done', label: 'Đã hoàn thành' }
  ]

  // Lọc danh sách gợi ý theo mức ưu tiên và trạng thái
  const filteredRecommendations = useMemo(() => {
    return mockRecommendationData.items.filter((item) => {
      const matchPriority = selectedPriority === 'all' || item.priority === selectedPriority
  const matchStatus = selectedStatus === 'all' || item.status === selectedStatus
      return matchPriority && matchStatus
    })
  }, [selectedPriority, selectedStatus])

  // Tính toán các chỉ số KPI từ dữ liệu đã lọc
  const kpiSummary = useMemo(() => {
    const totalRecommendations = mockRecommendationData.items.length // tổng số gợi ý
    const highPriorityCount = mockRecommendationData.items.filter((item) => item.priority === 'high').length // số gợi ý ưu tiên cao
    const completedCount = mockRecommendationData.items.filter((item) => item.status === 'done').length // số gợi ý hoàn thành
    const completedPercentage = totalRecommendations > 0 ? Math.round((completedCount / totalRecommendations) * 100) : 0 // phần trăm hoàn thành
    const improvementCount = mockRecommendationData.needImprove.length // số môn cần cải thiện

    return {
      totalRecommendations,
      highPriorityCount,
      completedPercentage,
      improvementPercentage: totalRecommendations > 0 ? Math.round((improvementCount / totalRecommendations) * 100) : 0,
      improvementCount
    }
  }, [])

  // Bấm thử lại khi ở trạng thái lỗi
  const handleRetry = () => {
    setViewState('loading')

    window.setTimeout(() => {
      setViewState('success')
    }, 500)
  }

  // Hiển thị trạng thái loading
  if (viewState === 'loading') {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 500 }}>
        <Spin size="large" />
      </div>
    )
  }

  // Hiển thị trạng thái lỗi
  if (viewState === 'error') {
    return (
      <Result
        status="error"
        title="Không thể tải dữ liệu"
        subTitle="Vui lòng thử lại"
        extra={
          <Button type="primary" onClick={handleRetry}>
            Thử lại
          </Button>
        }
      />
    )
  }

  // Hiển thị trạng thái không có dữ liệu
  if (viewState === 'empty') {
    return (
      <div style={{ padding: '24px 0', minHeight: 'calc(100vh - 120px)', background: '#EEF3FB' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 24px' }}>
          <Empty description="Chưa có gợi ý nào" style={{ marginTop: 50 }} />
          <div style={{ marginTop: 16, textAlign: 'center' }}>
            <Button type="primary" onClick={handleRetry}>
              Tải lại dữ liệu
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Hiển thị trang thành công
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {/* ===== Khối header giới thiệu trang + bộ lọc ===== */}
      <div style={headerStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, marginBottom: 20, flexWrap: 'wrap' }}>
          <div>
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
                Gợi ý học tập
              </Typography.Title>

              <Typography.Text style={{ color: '#42546B', textAlign: 'left' }}>
                Tổng hợp các đề xuất phù hợp với kết quả học tập và phản hồi của bạn.
              </Typography.Text>
            </Space>
          </div>
          <Space size="large" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
            <Select
              size="large"
              value={selectedPriority}
              onChange={setSelectedPriority}
              options={priorityOptions}
              style={{ width: 220, height: 44, borderRadius: 12, fontSize: 16 }}
            />
            <Select
              size="large"
              value={selectedStatus}
              onChange={setSelectedStatus}
              options={statusOptions}
              style={{ width: 220, height: 44, borderRadius: 12, fontSize: 16 }}
            />
          </Space>
        </div>
      </div>

      {/* ===== Khối 4 thẻ KPI ===== */}
      <Row gutter={[24, 24]} style={{ display: 'flex', flexDirection: 'row' }}>
        <Col xs={24} sm={12} lg={6}>
          <StatCard title="Tổng gợi ý" value={kpiSummary.totalRecommendations} />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard title="Ưu tiên cao" value={kpiSummary.highPriorityCount} />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard title="Hoàn thành" value={`${kpiSummary.completedPercentage}%`} />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard title="Môn cần cải thiện" value={kpiSummary.improvementCount} />
        </Col>
      </Row>

      {/* ===== Khối danh sách gợi ý chính ===== */}
      {filteredRecommendations.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <h3 style={{ margin: 0, color: '#163253', fontSize: 18, fontWeight: 700 }}>
            Danh sách gợi ý ({filteredRecommendations.length})
          </h3>
          <Row gutter={[24, 24]}>
            {filteredRecommendations.map((item) => (
              <Col xs={24} sm={24} lg={12} key={item.id}>
                <RecommendationItemCard item={item} />
              </Col>
            ))}
          </Row>
        </div>
      ) : (
        <Empty
          description="Không có gợi ý phù hợp với bộ lọc"
          style={{ marginTop: 40, marginBottom: 40 }}
        />
      )}

      {/* Insight summary removed as requested */}
    </div>
  )
}
