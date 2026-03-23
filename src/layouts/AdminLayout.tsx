import type { ReactNode } from 'react'

import StudentLayout from './StudentLayout'

// Kiểu props cho layout quản trị
type AdminLayoutProps = {
  children?: ReactNode
}

// Tạm thời dùng lại StudentLayout để giữ giao diện ổn định cho admin
export default function AdminLayout({ children }: AdminLayoutProps) {
  return <StudentLayout>{children}</StudentLayout>
}
