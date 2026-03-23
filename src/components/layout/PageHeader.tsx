import type { ReactNode } from 'react'
import { Space, Typography } from 'antd'

const { Title, Text } = Typography // tách tiêu đề và mô tả để dùng trong header trang

// Kiểu props cho phần đầu trang dùng chung
type PageHeaderProps = {
  title: string
  description?: string
  extra?: ReactNode
}

// Header đầu trang có tiêu đề mô tả và vùng action bên phải
export default function PageHeader({ title, description, extra }: PageHeaderProps) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
      <Space direction="vertical" size={4}>
        <Title
          level={1}
          style={{
            margin: 0,
            color: '#163253',
            fontSize: 32,
            fontWeight: 800,
            letterSpacing: 0.4
          }}
        >
          {title}
        </Title>
        {description && (
          <Text
            style={{
              color: '#42546B',
              fontSize: 16,
              lineHeight: 1.6
            }}
          >
            {description}
          </Text>
        )}
      </Space>
      {extra}
    </div>
  )
}
