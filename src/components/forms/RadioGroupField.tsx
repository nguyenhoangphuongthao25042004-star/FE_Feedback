import type { NamePath } from 'antd/es/form/interface'
import { Form, Radio, Space } from 'antd'

// Kiểu props cho nhóm radio dùng chung
type RadioGroupFieldProps = {
  name: NamePath
  label: string
  options: Array<{ label: string; value: string }>
  required?: boolean
}

// Component radio group dùng cho các lựa chọn theo danh sách
export default function RadioGroupField({ name, label, options, required = false }: RadioGroupFieldProps) {
  return (
    <Form.Item name={name} label={label} rules={required ? [{ required: true, message: `Vui lòng chọn ${label.toLowerCase()}` }] : undefined}>
      <Radio.Group style={{ width: '100%' }}>
        <Space direction="vertical">
          {options.map((option) => <Radio key={option.value} value={option.value}>{option.label}</Radio>)}
        </Space>
      </Radio.Group>
    </Form.Item>
  )
}
