import { Button, Result } from 'antd'

// Kiểu props cho trạng thái lỗi dùng chung
type ErrorStateProps = {
  title: string
  description?: string
  onRetry?: () => void
}

// Component hiển thị lỗi và nút thử lại nếu có
export default function ErrorState({ title, description, onRetry }: ErrorStateProps) {
  return (
    <Result
      status="error"
      title={title}
      subTitle={description}
      extra={onRetry ? <Button onClick={onRetry}>Thử lại</Button> : undefined}
    />
  )
}
