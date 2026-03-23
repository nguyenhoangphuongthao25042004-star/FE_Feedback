import type { ReactNode } from 'react'
import { Button } from 'antd'

// Kiểu props cho nút submit dùng chung
type SubmitButtonProps = {
  children: ReactNode
  loading?: boolean
  onClick?: () => void
}

// Nút submit chuẩn với kích thước lớn và màu primary
export default function SubmitButton({ children, loading = false, onClick }: SubmitButtonProps) {
  return <Button type="primary" size="large" loading={loading} onClick={onClick} style={{ minHeight: 44 }}>{children}</Button>
}
