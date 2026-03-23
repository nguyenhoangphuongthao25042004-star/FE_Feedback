import type { ReactNode } from 'react'
import { Card, Typography } from 'antd'

const { Text } = Typography // dùng Text để hiển thị mô tả section

// Kiểu props cho card section của form khảo sát
type SurveySectionCardProps = {
  title: string
  description?: string
  children: ReactNode
}

// Card bọc từng section để form được chia rõ thành từng nhóm
export default function SurveySectionCard({ title, description, children }: SurveySectionCardProps) {
  return (
    <Card title={title} style={{ borderRadius: 20, border: '1px solid #D7E1F0' }}>
      {description && <Text style={{ color: '#5B6B82', display: 'block', marginBottom: 16 }}>{description}</Text>}
      {children}
    </Card>
  )
}
