import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Card, Col, List, Row, Spin, Statistic, Typography } from 'antd'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

import EmptyState from '../../../components/utility/EmptyState'
import ErrorState from '../../../components/utility/ErrorState'
import { getInstructorDetail } from '../api/drilldown.api'
import HorizontalImpactChart from '../components/drilldown/HorizontalImpactChart'
import TrendLineChart from '../components/drilldown/TrendLineChart'
import { useDrilldownStore } from '../store/drilldown.store'

const { Title, Text } = Typography

export default function InstructorDrilldownPage() {
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
      <Card style={{ borderRadius: 16 }}>
        <div style={{ minHeight: 320, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Spin size="large" tip="Đang tải chi tiết giảng viên..." />
        </div>
      </Card>
    )
  }

  if (isError) {
    return (
      <Card style={{ borderRadius: 16 }}>
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Card style={{ borderRadius: 16 }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} md={14}>
            <Title level={3} style={{ marginBottom: 6 }}>
              Tên giảng viên
            </Title>
            <Text style={{ fontSize: 16, color: '#42546B' }}>{data.tenGiangVien}</Text>
          </Col>
          <Col xs={24} md={5}>
            <Statistic title="Tổng QI" value={data.diemQiTong} precision={1} suffix="/ 5" />
          </Col>
          <Col xs={24} md={5}>
            <Statistic title="Số môn" value={data.soMon} />
          </Col>
        </Row>
      </Card>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="QI theo môn học" style={{ borderRadius: 16 }}>
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

        <Col xs={24} lg={12}>
          <Card title="Xu hướng nhiều học kỳ" style={{ borderRadius: 16 }}>
            <TrendLineChart data={data.xuHuongHocKy} />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={14}>
          <Card title="Mức độ ảnh hưởng yếu tố" style={{ borderRadius: 16 }}>
            <HorizontalImpactChart data={data.mucDoAnhHuongYeuTo} />
          </Card>
        </Col>
        <Col xs={24} lg={10}>
          <Card title="Gợi ý cải thiện" style={{ borderRadius: 16 }}>
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
  )
}
