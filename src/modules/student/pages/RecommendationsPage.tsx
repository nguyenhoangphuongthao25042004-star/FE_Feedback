import { useEffect, useMemo, useState } from 'react'
import { Button, Col, Empty, Grid, Result, Row, Select, Space, Spin, Typography } from 'antd'

import StatCard from '../../../components/layout/StatCard'
import RecommendationItemCard from '../components/RecommendationItemCard'
import type { RecommendationData, RecommendationPriority, RecommendationStatus } from '../types/student.types'

// 4 tráº¡ng thÃ¡i chÃ­nh cá»§a trang gá»£i Ã½
type ViewState = 'loading' | 'success' | 'empty' | 'error'

// Dá»¯ liá»‡u giáº£ cho trang gá»£i Ã½ há»c táº­p
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

// Style dÃ¹ng láº¡i cho card tráº¡ng thÃ¡i vÃ  khá»‘i header
const statusCardStyle = {
  background: '#FFFFFF',
  border: '1px solid #D7E1F0',
  borderRadius: 24,
  padding: 24,
  boxShadow: '0 14px 30px rgba(28, 61, 102, 0.08)'
} as const

// Style cho khá»‘i header giá»›i thiá»‡u trang
const headerStyle = {
  ...statusCardStyle,
  marginBottom: 16
} as const

// Trang gá»£i Ã½ há»c táº­p cho sinh viÃªn
export default function RecommendationsPage() {
  const mockFinalState: ViewState = 'success' // Ä‘á»•i giÃ¡ trá»‹ nÃ y náº¿u muá»‘n thá»­ loading empty error
  const screens = Grid.useBreakpoint()
  const isMobile = !screens.md

  const [viewState, setViewState] = useState<ViewState>('loading') // tráº¡ng thÃ¡i hiá»ƒn thá»‹ trang
  const [selectedPriority, setSelectedPriority] = useState<RecommendationPriority | 'all'>('all') // lá»c theo má»©c Æ°u tiÃªn
  // ThÃªm filter tráº¡ng thÃ¡i tÆ°Æ¡ng á»©ng vá»›i cÃ¡c "thanh mÃ u xanh" (ChÆ°a hoÃ n thÃ nh / ÄÃ£ hoÃ n thÃ nh)
  const [selectedStatus, setSelectedStatus] = useState<RecommendationStatus | 'all'>('all') // máº·c Ä‘á»‹nh: táº¥t cáº£ tráº¡ng thÃ¡i

  // MÃ´ phá»ng quÃ¡ trÃ¬nh táº£i dá»¯ liá»‡u khi vÃ o trang
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setViewState(mockFinalState)
    }, 500)

    return () => window.clearTimeout(timer)
  }, [mockFinalState])

  // Danh sÃ¡ch lá»±a chá»n cho bá»™ lá»c má»©c Æ°u tiÃªn
  const priorityOptions = [
    { value: 'all', label: 'Tất cả mức ưu tiên' },
    { value: 'high', label: 'Ưu tiên cao' },
    { value: 'medium', label: 'Ưu tiên vừa' },
    { value: 'low', label: 'Ưu tiên thấp' }
  ]

  // (ÄÃ£ loáº¡i bá» filter tráº¡ng thÃ¡i theo yÃªu cáº§u)

  // Danh sÃ¡ch lá»±a chá»n cho bá»™ lá»c tráº¡ng thÃ¡i (chá»‰ hai lá»±a chá»n theo yÃªu cáº§u)
  const statusOptions = [
    { value: 'all', label: 'Tất cả trạng thái' },
    { value: 'pending', label: 'Chưa hoàn thành' },
    { value: 'done', label: 'Đã hoàn thành' }
  ]

  // Lá»c danh sÃ¡ch gá»£i Ã½ theo má»©c Æ°u tiÃªn vÃ  tráº¡ng thÃ¡i
  const filteredRecommendations = useMemo(() => {
    return mockRecommendationData.items.filter((item) => {
      const matchPriority = selectedPriority === 'all' || item.priority === selectedPriority
  const matchStatus = selectedStatus === 'all' || item.status === selectedStatus
      return matchPriority && matchStatus
    })
  }, [selectedPriority, selectedStatus])

  // TÃ­nh toÃ¡n cÃ¡c chá»‰ sá»‘ KPI tá»« dá»¯ liá»‡u Ä‘Ã£ lá»c
  const kpiSummary = useMemo(() => {
    const totalRecommendations = mockRecommendationData.items.length // tá»•ng sá»‘ gá»£i Ã½
    const highPriorityCount = mockRecommendationData.items.filter((item) => item.priority === 'high').length // sá»‘ gá»£i Ã½ Æ°u tiÃªn cao
    const completedCount = mockRecommendationData.items.filter((item) => item.status === 'done').length // sá»‘ gá»£i Ã½ hoÃ n thÃ nh
    const completedPercentage = totalRecommendations > 0 ? Math.round((completedCount / totalRecommendations) * 100) : 0 // pháº§n trÄƒm hoÃ n thÃ nh
    const improvementCount = mockRecommendationData.needImprove.length // sá»‘ mÃ´n cáº§n cáº£i thiá»‡n

    return {
      totalRecommendations,
      highPriorityCount,
      completedPercentage,
      improvementPercentage: totalRecommendations > 0 ? Math.round((improvementCount / totalRecommendations) * 100) : 0,
      improvementCount
    }
  }, [])

  // Báº¥m thá»­ láº¡i khi á»Ÿ tráº¡ng thÃ¡i lá»—i
  const handleRetry = () => {
    setViewState('loading')

    window.setTimeout(() => {
      setViewState('success')
    }, 500)
  }

  // Hiá»ƒn thá»‹ tráº¡ng thÃ¡i loading
  if (viewState === 'loading') {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 500 }}>
        <Spin size="large" />
      </div>
    )
  }

  // Hiá»ƒn thá»‹ tráº¡ng thÃ¡i lá»—i
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

  // Hiá»ƒn thá»‹ tráº¡ng thÃ¡i khÃ´ng cÃ³ dá»¯ liá»‡u
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

  // Hiá»ƒn thá»‹ trang thÃ nh cÃ´ng
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {/* ===== Khá»‘i header giá»›i thiá»‡u trang + bá»™ lá»c ===== */}
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
          <Space direction={isMobile ? 'vertical' : 'horizontal'} size={isMobile ? 12 : 'large'} style={{ display: 'flex', flexWrap: 'wrap', justifyContent: isMobile ? 'flex-start' : 'flex-end', alignItems: isMobile ? 'stretch' : 'center', width: isMobile ? '100%' : 'auto' }}>
            <Select
              size="large"
              value={selectedPriority}
              onChange={setSelectedPriority}
              options={priorityOptions}
              style={{ width: isMobile ? '100%' : 220, height: 44, borderRadius: 12, fontSize: 16 }}
            />
            <Select
              size="large"
              value={selectedStatus}
              onChange={setSelectedStatus}
              options={statusOptions}
              style={{ width: isMobile ? '100%' : 220, height: 44, borderRadius: 12, fontSize: 16 }}
            />
          </Space>
        </div>
      </div>

      {/* ===== Khá»‘i 4 tháº» KPI ===== */}
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

      {/* ===== Khá»‘i danh sÃ¡ch gá»£i Ã½ chÃ­nh ===== */}
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

