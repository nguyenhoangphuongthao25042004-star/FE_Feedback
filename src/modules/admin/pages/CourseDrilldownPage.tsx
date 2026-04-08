import { useEffect } from 'react'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { useNavigate, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Button, Card, Col, Grid, List, Progress, Row, Space, Spin, Statistic, Typography } from 'antd'

import EmptyState from '../../../components/utility/EmptyState'
import ErrorState from '../../../components/utility/ErrorState'
import { getCourseDetail } from '../api/drilldown.api'
import CourseQualityRadar from '../components/drilldown/CourseQualityRadar'
import RatingDistributionChart from '../components/drilldown/RatingDistributionChart'
import TrendLineChart from '../components/drilldown/TrendLineChart'
import { useDrilldownStore } from '../store/drilldown.store'

const { Title, Text } = Typography

const surfaceCardStyle = {
  borderRadius: 20,
  border: '1px solid #D7E1F0',
  boxShadow: '0 12px 28px rgba(0, 45, 109, 0.08)'
} as const

const badgeStyle = {
  background: '#F4F8FF',
  border: '1px solid #D6E4F7',
  borderRadius: 999,
  padding: '6px 12px',
  display: 'inline-flex',
  alignItems: 'center'
} as const

const centeredCardBodyStyles = {
  body: {
    textAlign: 'center' as const
  }
}

function getStatusTag(qi: number) {
  if (qi >= 4.0) return { text: 'Ổn định', color: '#389E0D', bg: '#EAF7EE', border: '#D1F0DC' }
  if (qi >= 3.0) return { text: 'Cần rà soát', color: '#D48806', bg: '#FFF6E6', border: '#FFE4B5' }
  return { text: 'Nguy cơ', color: '#CF1322', bg: '#FDECEF', border: '#F7D7DE' }
}

export default function CourseDrilldownPage() {
  const screens = Grid.useBreakpoint()
  const isMobile = !screens.md
  const navigate = useNavigate()
  const { id = '' } = useParams()
  const setSelectedCourse = useDrilldownStore((state) => state.setSelectedCourse)

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['course-detail', id],
    queryFn: () => getCourseDetail(id),
    enabled: Boolean(id)
  })

  useEffect(() => {
    setSelectedCourse(id || null)
    return () => setSelectedCourse(null)
  }, [id, setSelectedCourse])

  if (isLoading) {
    return (
      <Card style={surfaceCardStyle}>
        <div style={{ minHeight: 320, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Spin size="large" tip="Đang tải chi tiết môn học..." />
        </div>
      </Card>
    )
  }

  if (isError) {
    return (
      <Card style={surfaceCardStyle}>
        <ErrorState
          title="Không thể tải dữ liệu chi tiết môn học"
          description="Vui lòng thử lại sau ít phút."
          onRetry={() => refetch()}
        />
      </Card>
    )
  }

  if (!data) {
    return <EmptyState title="Không tìm thấy môn học" description="Vui lòng kiểm tra lại mã môn học hoặc chọn môn khác." />
  }

  const status = getStatusTag(data.diemQiTong)
  const stickyHeaderTop = isMobile ? 120 : 88

  return (
    <div style={{ width: '100%' }}>
      <div style={{ width: '100%', maxWidth: 1480, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ position: 'sticky', top: stickyHeaderTop, zIndex: 30 }}>
          <Card style={surfaceCardStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, width: '100%' }}>
              <Button
                shape="circle"
                size="large"
                icon={<ArrowLeftOutlined />}
                onClick={() => navigate('/admin/course-ranking')}
                style={{ borderRadius: 999, width: 44, height: 44, minWidth: 44 }}
                aria-label="Quay lại xếp hạng môn học"
              />

              <Space direction="vertical" size={14} style={{ width: '100%' }}>
                <Title level={2} style={{ margin: 0, color: '#163253' }}>{data.tenMonHoc}</Title>
                <Space size={12} wrap>
                  <span style={badgeStyle}><Text style={{ color: '#42546B' }}>Mã: <strong style={{ color: '#163253' }}>{data.maMonHoc}</strong></Text></span>
                  <span style={badgeStyle}><Text style={{ color: '#42546B' }}>Tổng phản hồi: <strong style={{ color: '#163253' }}>{data.soPhanHoi}</strong></Text></span>
                  <span style={badgeStyle}><Text style={{ color: '#42546B' }}>Độ tin cậy: <strong style={{ color: '#163253' }}>{data.doTinCay}%</strong></Text></span>
                  <span style={{ ...badgeStyle, color: status.color, background: status.bg, borderColor: status.border }}>
                    <Text style={{ color: status.color, fontWeight: 500 }}>{status.text}</Text>
                  </span>
                </Space>
              </Space>
            </div>
          </Card>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} xl={6}><Card style={surfaceCardStyle} styles={centeredCardBodyStyles}><Statistic title="QI của môn" value={data.diemQiTong} precision={1} suffix="/ 5" /></Card></Col>
              <Col xs={24} sm={12} xl={6}><Card style={surfaceCardStyle} styles={centeredCardBodyStyles}><Statistic title="Số phản hồi" value={data.soPhanHoi} /></Card></Col>
              <Col xs={24} sm={12} xl={6}><Card style={surfaceCardStyle} styles={centeredCardBodyStyles}><Statistic title="Độ tin cậy" value={data.doTinCay} suffix="%" /></Card></Col>
              <Col xs={24} sm={12} xl={6}><Card style={surfaceCardStyle} styles={centeredCardBodyStyles}><Statistic title="Độ khó cảm nhận" value={data.doKhoDiem} suffix="/ 10" /></Card></Col>
            </Row>

            <Row gutter={[16, 16]}>
              <Col xs={24} lg={12} style={{ display: 'flex' }}>
                <Card title="Phân rã chất lượng" style={{ ...surfaceCardStyle, width: '100%' }}>
                  <CourseQualityRadar data={data.phanRaChatLuong} />
                </Card>
              </Col>
              <Col xs={24} lg={12} style={{ display: 'flex' }}>
                <Card title="Phân phối đánh giá" style={{ ...surfaceCardStyle, width: '100%' }}>
                  <RatingDistributionChart data={data.phanPhoiDanhGia} />
                </Card>
              </Col>
            </Row>

            <Card title="Xu hướng theo học kỳ" style={surfaceCardStyle}>
              <TrendLineChart data={data.xuHuongHocKy} />
            </Card>

            <Row gutter={[16, 16]}>
              <Col xs={24} lg={14}>
                <Card title="Phản hồi theo chủ đề" style={surfaceCardStyle} bodyStyle={{ paddingBlock: 8 }}>
                  <List
                    dataSource={data.phanHoiSinhVien}
                    locale={{ emptyText: 'Chưa có phản hồi' }}
                    style={{ maxHeight: 280, overflowY: 'auto', paddingInline: 16 }}
                    renderItem={(item) => (
                      <List.Item key={item.id}>
                        <Text>{item.noiDung}</Text>
                      </List.Item>
                    )}
                  />
                </Card>
              </Col>

              <Col xs={24} lg={10}>
                <Card title="Độ tin cậy" style={surfaceCardStyle}>
                  <Progress
                    percent={data.doTinCay}
                    status="active"
                    strokeColor={{ '0%': '#2B7AC4', '100%': '#5FAE6F' }}
                    format={(percent) => `${percent}%`}
                  />
                  <Text style={{ color: '#6B7F97' }}>Độ tin cậy được tính từ số lượng phản hồi hợp lệ và mức ổn định dữ liệu.</Text>
                </Card>
              </Col>
            </Row>
        </div>
      </div>
    </div>
  )
}
