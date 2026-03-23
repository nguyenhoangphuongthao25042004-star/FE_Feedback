import type { ReactNode } from 'react'

import StudentLayout from './StudentLayout'

// Kiểu props cho layout giảng viên
type InstructorLayoutProps = {
  children?: ReactNode
}

// Tạm thời dùng lại StudentLayout để giữ giao diện ổn định cho giảng viên
export default function InstructorLayout({ children }: InstructorLayoutProps) {
  return <StudentLayout>{children}</StudentLayout>
}
