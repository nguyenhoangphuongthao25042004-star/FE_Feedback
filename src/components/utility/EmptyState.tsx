import type { ReactNode } from 'react'
import { Empty, Typography } from 'antd'

const { Text } = Typography // dùng Text cho tiêu đề empty state nếu có

// Kiểu props cho component empty state dùng chung
type EmptyStateProps = {
  title?: string
  description: string
  action?: ReactNode
}

// Trạng thái rỗng dùng chung cho các trang chưa có dữ liệu
export default function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div style={{ background: '#fff', borderRadius: 20, padding: 24 }}>
      {title && <Text strong style={{ display: 'block', textAlign: 'center', marginBottom: 8 }}>{title}</Text>}
      <Empty description={description} image={Empty.PRESENTED_IMAGE_SIMPLE}>
        {action}
      </Empty>
    </div>
  )
}
