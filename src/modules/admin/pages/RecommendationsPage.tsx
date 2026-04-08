import { Card, List, Space, Tag, Typography } from 'antd'
import { BulbOutlined } from '@ant-design/icons'

const { Title, Paragraph } = Typography

type RecommendationItem = {
  title: string
  impact: 'low' | 'medium' | 'high'
}

const mockRecommendations = [
  {
    title: 'Tăng tần suất phản hồi giữa kỳ cho các môn có QI thấp',
    impact: 'high'
  },
  {
    title: 'Theo dõi nhóm giảng viên có tỷ lệ phản hồi thấp theo tuần',
    impact: 'medium'
  },
  {
    title: 'Chuẩn hóa mẫu câu hỏi cho các học phần đại cương',
    impact: 'low'
  }
] satisfies RecommendationItem[]

function impactColor(impact: 'low' | 'medium' | 'high') {
  if (impact === 'high') return 'red'
  if (impact === 'medium') return 'gold'
  return 'green'
}

// Trang tạm cho dashboard đề xuất cải thiện của quản trị
export default function RecommendationsPage() {
  return (
    <Card
      style={{
        borderRadius: 16,
        border: '1px solid #D7E1F0',
        boxShadow: '0 8px 20px rgba(28,61,102,0.06)'
      }}
      bodyStyle={{ padding: 24 }}
    >
      <Space direction="vertical" size={12} style={{ width: '100%' }}>
        <Space align="center" size={10}>
          <BulbOutlined style={{ color: '#004286', fontSize: 20 }} />
          <Title level={3} style={{ margin: 0, color: '#163253' }}>
            Đề xuất cải thiện
          </Title>
        </Space>

        <Paragraph style={{ margin: 0, color: '#42546B' }}>
          Danh sách đề xuất này dùng dữ liệu mẫu, có thể thay bằng dữ liệu thật ở bước tích hợp tiếp theo.
        </Paragraph>

        <List<RecommendationItem>
          bordered
          style={{ borderRadius: 12, borderColor: '#D7E1F0' }}
          dataSource={mockRecommendations}
          renderItem={(item) => (
            <List.Item style={{ borderColor: '#EEF3FB' }}>
              <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                <span style={{ color: '#163253', fontWeight: 600 }}>{item.title}</span>
                <Tag color={impactColor(item.impact)}>{item.impact.toUpperCase()}</Tag>
              </Space>
            </List.Item>
          )}
        />
      </Space>
    </Card>
  )
}
