import { Spin, Typography } from 'antd'

const { Text } = Typography // dùng Text để hiển thị thông điệp loading

// Kiểu props cho spinner loading dùng chung
type LoadingSpinnerProps = {
  message?: string
}

// Trạng thái loading đơn giản dùng chung cho nhiều màn hình
export default function LoadingSpinner({ message = 'Đang tải dữ liệu...' }: LoadingSpinnerProps) {
  return (
    <div style={{ minHeight: 240, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12 }}>
      <Spin size="large" />
      <Text>{message}</Text>
    </div>
  )
}
