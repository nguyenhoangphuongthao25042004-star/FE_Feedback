import type { ReactNode } from 'react'
import { Card, Typography } from 'antd'

const { Text } = Typography // dùng Text cho tiêu đề card thông tin

// Kiểu props cho card nội dung thông tin
type InfoCardProps = {
  title: string
  children: ReactNode
}

// Card thông tin dùng chung cho các khối nội dung ngắn
export default function InfoCard({ title, children }: InfoCardProps) {
  return (
    <Card style={{ borderRadius: 20, border: '1px solid #D7E1F0' }}>
      <Text strong style={{ color: '#163253', display: 'block', marginBottom: 12 }}>{title}</Text>
      {children}
    </Card>
  )
}
