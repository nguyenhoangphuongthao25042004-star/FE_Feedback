import { useEffect, useMemo, useState } from 'react'
import { Alert, Card, Col, Empty, Grid, Row, Table, Tag, Typography } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { CheckCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons'

import PageHeader from '../../../components/layout/PageHeader'
import { getInstructorRecommendations, type InstructorActionPriority, type InstructorRecommendationItem } from '../api/instructorInsights.service'

const surfaceCardStyle = {
  background: '#FFFFFF',
  border: '1px solid #D7E1F0',
  borderRadius: 20,
  boxShadow: '0 14px 30px rgba(28, 61, 102, 0.08)'
} as const

const priorityColorMap: Record<InstructorRecommendationItem['priority'], string> = {
  'Rất cao': 'error',
  'Cao': 'success',
  'Trung bình': 'processing'
}

export default function RecommendationsPage() {
  const screens = Grid.useBreakpoint()
  const isMobile = !screens.md
  const isTablet = Boolean(screens.md && !screens.xxl)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [recommendations, setRecommendations] = useState<InstructorRecommendationItem[]>([])
  const [actionPriorities, setActionPriorities] = useState<InstructorActionPriority[]>([])

  useEffect(() => {
    let mounted = true

    const load = async () => {
      setLoading(true)
      setError('')
      try {
        const data = await getInstructorRecommendations()
        if (mounted) {
          setRecommendations(data.recommendations)
          setActionPriorities(data.actionPriorities)
        }
      } catch {
        if (mounted) {
          setError('Không thể tải dữ liệu khuyến nghị cải tiến. Vui lòng thử lại.')
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    load()
    return () => {
      mounted = false
    }
  }, [])

  const columns: ColumnsType<InstructorActionPriority> = useMemo(() => [
    { title: 'Hạng mục', dataIndex: 'area', key: 'area', width: 180 },
    { title: 'Vấn đề', dataIndex: 'issue', key: 'issue' },
    {
      title: 'Ưu tiên',
      dataIndex: 'priority',
      key: 'priority',
      width: 140,
      align: 'center',
      render: (value: InstructorActionPriority['priority']) => <Tag color={priorityColorMap[value]}>{value}</Tag>
    },
    { title: 'Hành động gợi ý', dataIndex: 'suggestedAction', key: 'suggestedAction' },
    { title: 'Thời gian', dataIndex: 'timeline', key: 'timeline', width: 180 }
  ], [])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <Card style={surfaceCardStyle} bodyStyle={{ padding: 24 }}>
        <PageHeader
          title="Khuyến nghị cải tiến"
          description="Hệ thống ưu tiên những yếu tố cần cải thiện trước để nâng cao chất lượng giảng dạy theo dữ liệu phản hồi."
        />
      </Card>

      {error && <Alert type="error" showIcon message={error} style={{ borderRadius: 14 }} />}

      {!loading && recommendations.length === 0 ? (
        <Card style={surfaceCardStyle}><Empty description="Chưa có khuyến nghị cải tiến" /></Card>
      ) : (
        <>
          <Row gutter={[16, 16]}>
            {recommendations.map((item) => (
              <Col key={item.id} xs={24} md={12} xl={8}>
                <Card style={{ ...surfaceCardStyle, height: '100%' }} bodyStyle={{ padding: 20, height: '100%' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14, height: '100%' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
                      <Typography.Title level={4} style={{ margin: 0, color: '#163253', lineHeight: 1.45 }}>{item.title}</Typography.Title>
                      <Tag color={priorityColorMap[item.priority]}>{item.priority}</Tag>
                    </div>

                    <Typography.Text style={{ color: '#0F5FA8', fontWeight: 600 }}>{item.metric}</Typography.Text>
                    <Typography.Text style={{ color: '#42546B', lineHeight: 1.7 }}>{item.description}</Typography.Text>

                    <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                      <CheckCircleOutlined style={{ color: '#138A72', marginTop: 2 }} />
                      <Typography.Text style={{ color: '#42546B', lineHeight: 1.6 }}>
                        {item.expectedImpact}
                      </Typography.Text>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {item.suggestedActions.map((action) => (
                        <div key={action} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                          <ExclamationCircleOutlined style={{ color: '#D97706', marginTop: 2 }} />
                          <Typography.Text style={{ color: '#163253', lineHeight: 1.6 }}>{action}</Typography.Text>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>

          <Card style={surfaceCardStyle} bodyStyle={{ padding: 16 }}>
            <Typography.Title level={4} style={{ marginTop: 0, color: '#163253' }}>Bảng ưu tiên hành động</Typography.Title>
            {isMobile || isTablet ? (
              <div style={{ display: 'grid', gridTemplateColumns: isTablet ? 'repeat(2, minmax(0, 1fr))' : '1fr', gap: 14 }}>
                {actionPriorities.map((item) => (
                  <Card key={item.key} size="small" style={{ borderRadius: 16, border: '1px solid #D7E1F0' }} bodyStyle={{ padding: 14 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <Typography.Text strong style={{ color: '#163253' }}>{item.area}</Typography.Text>
                      <Tag color={priorityColorMap[item.priority]}>{item.priority}</Tag>
                      <Typography.Text style={{ color: '#42546B', lineHeight: 1.6 }}>{item.issue}</Typography.Text>
                      <Typography.Text style={{ color: '#163253', lineHeight: 1.6 }}>{item.suggestedAction}</Typography.Text>
                      <Typography.Text style={{ color: '#42546B' }}>{item.timeline}</Typography.Text>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Table rowKey="key" columns={columns} dataSource={actionPriorities} pagination={false} />
            )}
          </Card>
        </>
      )}
    </div>
  )
}
