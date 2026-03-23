import type { NamePath } from 'antd/es/form/interface'
import { Form, Select } from 'antd'

// Kiểu props cho field dropdown dùng lại trong form
type DropdownFieldProps = {
  name: NamePath
  label: string
  options: Array<{ label: string; value: string }>
  placeholder?: string
  required?: boolean
}

// Component select dùng chung cho các trường chọn 1 giá trị
export default function DropdownField({ name, label, options, placeholder, required = false }: DropdownFieldProps) {
  return (
    <Form.Item name={name} label={label} rules={required ? [{ required: true, message: `Vui lòng chọn ${label.toLowerCase()}` }] : undefined}>
      <Select size="large" placeholder={placeholder ?? `Chọn ${label.toLowerCase()}`} options={options} />
    </Form.Item>
  )
}
