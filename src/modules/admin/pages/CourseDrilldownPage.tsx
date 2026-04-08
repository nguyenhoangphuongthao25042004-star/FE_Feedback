import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Card, Col, List, Progress, Row, Spin, Statistic, Typography } from 'antd'

import EmptyState from '../../../components/utility/EmptyState'
import ErrorState from '../../../components/utility/ErrorState'
import { getCourseDetail } from '../api/drilldown.api'
import CourseQualityRadar from '../components/drilldown/CourseQualityRadar'
import RatingDistributionChart from '../components/drilldown/RatingDistributionChart'
import TrendLineChart from '../components/drilldown/TrendLineChart'
import { useDrilldownStore } from '../store/drilldown.store'

const { Title, Text } = Typography

export default function CourseDrilldownPage() {
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
      <Card style={{ borderRadius: 16 }}>
        <div style={{ minHeight: 320, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Spin size="large" tip="Đang tải chi tiết môn học..." />
        </div>
      </Card>
    )
  }

  if (isError) {
    return (
      <Card style={{ borderRadius: 16 }}>
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Card style={{ borderRadius: 16 }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} md={12}>
            <Title level={3} style={{ marginBottom: 6 }}>
              Tên môn học
            </Title>
            <Text style={{ fontSize: 16, color: '#42546B' }}>{data.tenMonHoc}</Text>
          </Col>
          <Col xs={24} md={4}>
            <Statistic title="QI của môn" value={data.diemQiTong} precision={1} suffix="/ 5" />
          </Col>
          <Col xs={24} md={4}>
            <Statistic title="Số phản hồi" value={data.soPhanHoi} />
          </Col>
          <Col xs={24} md={4}>
            <Statistic title="Confidence score" value={data.doTinCay} suffix="%" />
          </Col>
        </Row>
      </Card>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="Phân rã chất lượng" style={{ borderRadius: 16 }}>
            <CourseQualityRadar data={data.phanRaChatLuong} />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Phân phối đánh giá" style={{ borderRadius: 16 }}>
            <RatingDistributionChart data={data.phanPhoiDanhGia} />
          </Card>
        </Col>
      </Row>

      <Card title="Xu hướng theo học kỳ" style={{ borderRadius: 16 }}>
        <TrendLineChart data={data.xuHuongHocKy} />
      </Card>

      <Row gutter={[16, 16]}>
        <Col xs={24}>
          <Card title="Phản hồi theo chủ đề" style={{ borderRadius: 16 }} bodyStyle={{ paddingBlock: 8 }}>
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
      </Row>

      <Card title="Độ tin cậy" style={{ borderRadius: 16 }}>
        <Progress
          percent={data.doTinCay}
          status="active"
          strokeColor={{ '0%': '#2B7AC4', '100%': '#5FAE6F' }}
          format={(percent) => `${percent}%`}
        />
        <Text style={{ color: '#6B7F97' }}>Độ tin cậy được tính từ số lượng phản hồi hợp lệ và mức ổn định dữ liệu.</Text>
      </Card>
    </div>
  )
}
