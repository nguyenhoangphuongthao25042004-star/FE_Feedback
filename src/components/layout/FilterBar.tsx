import type { ReactNode } from 'react'
import { Card, Space } from 'antd'

// Kiểu props cho khối filter bar dùng chung
type FilterBarProps = {
  children: ReactNode
}

// Thanh filter dùng để gom các bộ lọc thành một cụm nhất quán
export default function FilterBar({ children }: FilterBarProps) {
  return (
    <Card style={{ borderRadius: 20, border: '1px solid #D7E1F0' }}>
      <Space wrap size={16}>
        {children}
      </Space>
    </Card>
  )
}
