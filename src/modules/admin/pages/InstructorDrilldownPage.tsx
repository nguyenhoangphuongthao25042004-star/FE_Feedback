import { useEffect } from 'react'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { useNavigate, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Button, Card, Col, Grid, List, Row, Space, Spin, Statistic, Typography } from 'antd'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

import EmptyState from '../../../components/utility/EmptyState'
import ErrorState from '../../../components/utility/ErrorState'
import { getInstructorDetail } from '../api/drilldown.api'
import HorizontalImpactChart from '../components/drilldown/HorizontalImpactChart'
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

function getStatusTag(confidence: number) {
  if (confidence >= 80) return { text: 'Ổn định', color: '#389E0D', bg: '#EAF7EE', border: '#D1F0DC' }
  if (confidence >= 50) return { text: 'Cần rà soát', color: '#D48806', bg: '#FFF6E6', border: '#FFE4B5' }
  return { text: 'Nguy cơ', color: '#CF1322', bg: '#FDECEF', border: '#F7D7DE' }
}

export default function InstructorDrilldownPage() {
  const screens = Grid.useBreakpoint()
  const isMobile = !screens.md
  const navigate = useNavigate()
  const { id = '' } = useParams()
  const setSelectedInstructor = useDrilldownStore((state) => state.setSelectedInstructor)

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['instructor-detail', id],
    queryFn: () => getInstructorDetail(id),
    enabled: Boolean(id)
  })

  useEffect(() => {
    setSelectedInstructor(id || null)
    return () => setSelectedInstructor(null)
  }, [id, setSelectedInstructor])

  if (isLoading) {
    return (
      <Card style={surfaceCardStyle}>
        <div style={{ minHeight: 320, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Spin size="large" tip="Đang tải chi tiết giảng viên..." />
        </div>
      </Card>
    )
  }

  if (isError) {
    return (
      <Card style={surfaceCardStyle}>
        <ErrorState
          title="Không thể tải dữ liệu chi tiết giảng viên"
          description="Vui lòng thử lại sau ít phút."
          onRetry={() => refetch()}
        />
      </Card>
    )
  }

  if (!data) {
    return <EmptyState title="Không tìm thấy giảng viên" description="Vui lòng kiểm tra lại mã giảng viên hoặc chọn giảng viên khác." />
  }

  const status = getStatusTag(data.doTinCay)
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
                onClick={() => navigate('/admin/instructor-ranking')}
                style={{ borderRadius: 999, width: 44, height: 44, minWidth: 44 }}
                aria-label="Quay lại xếp hạng giảng viên"
              />

              <Space direction="vertical" size={14} style={{ width: '100%' }}>
                <Title level={2} style={{ margin: 0, color: '#163253' }}>{data.tenGiangVien}</Title>
                <Space size={12} wrap>
                  <span style={badgeStyle}><Text style={{ color: '#42546B' }}>Số môn đang dạy: <strong style={{ color: '#163253' }}>{data.soMon}</strong></Text></span>
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
              <Col xs={24} sm={12} xl={8}><Card style={surfaceCardStyle} styles={centeredCardBodyStyles}><Statistic title="Tổng QI" value={data.diemQiTong} precision={1} suffix="/ 5" /></Card></Col>
              <Col xs={24} sm={12} xl={8}><Card style={surfaceCardStyle} styles={centeredCardBodyStyles}><Statistic title="Số môn" value={data.soMon} /></Card></Col>
              <Col xs={24} sm={12} xl={8}><Card style={surfaceCardStyle} styles={centeredCardBodyStyles}><Statistic title="Độ tin cậy" value={data.doTinCay} suffix="%" /></Card></Col>
            </Row>

            <Row gutter={[16, 16]}>
              <Col xs={24} lg={12} style={{ display: 'flex' }}>
                <Card title="QI theo môn học" style={{ ...surfaceCardStyle, width: '100%' }}>
                  <div style={{ width: '100%', height: 280 }}>
                    <ResponsiveContainer>
                      <BarChart data={data.qiTheoMonHoc}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#EEF3FB" />
                        <XAxis dataKey="tenMonHoc" tick={{ fill: '#42546B', fontSize: 12 }} />
                        <YAxis domain={[0, 5]} tick={{ fill: '#42546B', fontSize: 12 }} />
                        <Tooltip formatter={(value) => [`${Number(value ?? 0).toFixed(1)} điểm`, 'QI']} />
                        <Bar dataKey="qi" fill="#2B7AC4" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
              </Col>

              <Col xs={24} lg={12} style={{ display: 'flex' }}>
                <Card title="Xu hướng nhiều học kỳ" style={{ ...surfaceCardStyle, width: '100%' }}>
                  <TrendLineChart data={data.xuHuongHocKy} />
                </Card>
              </Col>
            </Row>

            <Row gutter={[16, 16]}>
              <Col xs={24} lg={14}>
                <Card title="Mức độ ảnh hưởng yếu tố" style={surfaceCardStyle}>
                  <HorizontalImpactChart data={data.mucDoAnhHuongYeuTo} />
                </Card>
              </Col>
              <Col xs={24} lg={10}>
                <Card title="Gợi ý cải thiện" style={surfaceCardStyle}>
                  <List
                    dataSource={data.goiYCaiThien}
                    locale={{ emptyText: 'Chưa có gợi ý' }}
                    renderItem={(item, index) => (
                      <List.Item>
                        <Text>{`${index + 1}. ${item}`}</Text>
                      </List.Item>
                    )}
                  />
                </Card>
              </Col>
            </Row>
        </div>
      </div>
    </div>
  )
}
