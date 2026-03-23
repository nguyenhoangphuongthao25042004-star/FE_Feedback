import type { NamePath } from 'antd/es/form/interface'
import { Form, Input } from 'antd'

const { TextArea } = Input // tách TextArea để dùng ngắn gọn hơn

// Kiểu props cho trường nhập liệu nhiều dòng
type TextAreaFieldProps = {
  name: NamePath
  label: string
  placeholder?: string
  rows?: number
  required?: boolean
}

// Component textarea dùng chung cho các câu hỏi mở
export default function TextAreaField({ name, label, placeholder, rows = 4, required = false }: TextAreaFieldProps) {
  return (
    <Form.Item name={name} label={label} rules={required ? [{ required: true, message: `Vui lòng nhập ${label.toLowerCase()}` }] : undefined}>
      <TextArea rows={rows} placeholder={placeholder ?? `Nhập ${label.toLowerCase()}...`} />
    </Form.Item>
  )
}
