import { Button, Tag } from 'antd'

import type { RecommendationItem, RecommendationPriority } from '../types/student.types'

// Kiểu props cho card gợi ý học tập
type RecommendationItemCardProps = {
  item: RecommendationItem
}

// Hàm ánh xạ mức ưu tiên sang nhãn tiếng Việt
const getPriorityLabel = (priority: RecommendationPriority): string => {
  const priorityMap: Record<RecommendationPriority, string> = {
    high: 'Ưu tiên cao',
    medium: 'Ưu tiên vừa',
    low: 'Ưu tiên thấp'
  }
  return priorityMap[priority]
}

// Hàm ánh xạ mức ưu tiên sang màu
const getPriorityColor = (priority: RecommendationPriority): string => {
  const colorMap: Record<RecommendationPriority, string> = {
    high: '#FFE5E5',
    medium: '#FFF5E5',
    low: '#E5F5FF'
  }
  return colorMap[priority]
}

// Hàm ánh xạ mức ưu tiên sang màu chữ
const getPriorityTextColor = (priority: RecommendationPriority): string => {
  const colorMap: Record<RecommendationPriority, string> = {
    high: '#D32F2F',
    medium: '#F57C00',
    low: '#0288D1'
  }
  return colorMap[priority]
}


// Card hiển thị một mục gợi ý học tập
export default function RecommendationItemCard({ item }: RecommendationItemCardProps) {
  return (
    <div
      style={{
        background: '#FFFFFF',
        border: '1px solid #D7E1F0',
        borderRadius: 16,
        padding: 20,
        boxShadow: '0 14px 30px rgba(28, 61, 102, 0.08)',
        display: 'flex',
        flexDirection: 'column',
        height: '100%'
      }}
    >
      {/* Header của item: tiêu đề + priority tag */}
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
        <h4 style={{ margin: 0, color: '#163253', fontSize: 16, fontWeight: 700, flex: 1, lineHeight: 1.4 }}>
          {item.title}
        </h4>
        <Tag
          style={{
            background: getPriorityColor(item.priority),
            color: getPriorityTextColor(item.priority),
            border: 'none',
            padding: '4px 10px',
            fontWeight: 600,
            fontSize: 12,
            borderRadius: 4,
            whiteSpace: 'nowrap',
            flexShrink: 0
          }}
        >
          {getPriorityLabel(item.priority)}
        </Tag>
      </div>

      {/* (Đã loại bỏ tag nhỏ) - trạng thái sẽ hiển thị trong nút chính phía dưới) */}

      {/* Mô tả */}
      <p style={{ margin: '0 0 16px 0', color: '#42546B', fontSize: 14, lineHeight: 1.6, flex: 1 }}>
        {item.description}
      </p>

      {/* Nút hành động */}
      <Button
        type="primary"
        size="large"
        style={{
          fontSize: 16,
          height: 44,
          borderRadius: 12,
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          paddingInline: 20,
          alignSelf: 'center',
          // Nếu không có actionLabel thì dùng chiều rộng cố định để các nút trạng thái có kích thước bằng nhau
          width: item.actionLabel ? undefined : 220,
          minWidth: item.actionLabel ? undefined : 220
          ,
          // lighten primary blue slightly
          background: '#1976C8',
          borderColor: '#1976C8',
          color: '#FFFFFF'
        }}
      >
        {item.actionLabel ? item.actionLabel : (item.status === 'done' ? 'Đã hoàn thành' : 'Chưa hoàn thành')}
      </Button>
    </div>
  )
}
