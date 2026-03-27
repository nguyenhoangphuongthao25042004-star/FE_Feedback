import type { NamePath } from 'antd/es/form/interface'
import { Form, Select } from 'antd'

type DropdownFieldProps = {
  name: NamePath
  label: string
  options: Array<{ label: string; value: string }>
  placeholder?: string
  required?: boolean
  disabled?: boolean
}

export default function DropdownField({
  name,
  label,
  options,
  placeholder,
  required = false,
  disabled = false
}: DropdownFieldProps) {
  return (
    <Form.Item
      name={name}
      label={label}
      rules={required ? [{ required: true, message: `Vui lòng chọn ${label.toLowerCase()}` }] : undefined}
    >
      <Select
        size="large"
        placeholder={placeholder ?? `Chọn ${label.toLowerCase()}`}
        options={options}
        disabled={disabled}
      />
    </Form.Item>
  )
}
