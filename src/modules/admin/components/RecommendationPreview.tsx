import { Card, Space, Tag } from 'antd'

import type { RecommendationPreviewItem } from './dashboard.types'

type RecommendationPreviewProps = {
  data: RecommendationPreviewItem[]
}

const priorityColor: Record<RecommendationPreviewItem['priority'], string> = {
  P1: 'red',
  P2: 'gold',
  P3: 'blue'
}

export default function RecommendationPreview({ data }: RecommendationPreviewProps) {
  return (
    <Card
      style={{
        width: '100%',
        border: '1px solid #D7E1F0',
        borderRadius: 20,
        boxShadow: '0 14px 30px rgba(28,61,102,0.08)'
      }}
      bodyStyle={{ padding: 16 }}
    >
      <div style={{ marginBottom: 12 }}>
        <h3 style={{ margin: 0, color: '#163253', fontSize: 18, fontWeight: 800 }}>Gợi ý cải thiện nhanh</h3>
        <div style={{ color: '#42546B', fontSize: 13, marginTop: 4 }}>
          Gợi ý cải thiện ngắn hạn cho nhóm điều hành.
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
        {data.map((item) => (
          <div
            key={item.id}
            style={{
              background: '#F7FAFF',
              border: '1px solid #E8EEF8',
              borderRadius: 14,
              padding: 12
            }}
          >
            <Space direction="vertical" size={8} style={{ width: '100%' }}>
              <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                <Tag color={priorityColor[item.priority]} style={{ marginInlineEnd: 0 }}>
                  {item.priority}
                </Tag>
                <span style={{ color: '#6B7F97', fontSize: 12 }}>{item.owner}</span>
              </Space>
              <div style={{ color: '#163253', fontWeight: 700, lineHeight: 1.4 }}>{item.title}</div>
            </Space>
          </div>
        ))}
      </div>
    </Card>
  )
}
