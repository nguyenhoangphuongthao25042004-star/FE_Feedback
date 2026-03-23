import type { NamePath } from 'antd/es/form/interface'
import { Col, Form, Radio, Row, Space, Typography } from 'antd'

const { Text } = Typography // dùng Text để hiển thị nội dung câu hỏi

// Kiểu props cho từng câu hỏi Likert
type LikertQuestionProps = {
  name: NamePath
  label: string
  options: Array<{ label: string; value: string }>
}

// Component hiển thị 1 câu hỏi với thang đo Likert
export default function LikertQuestion({ name, label, options }: LikertQuestionProps) {
  return (
    <Row gutter={[12, 12]} align="middle" style={{ border: '1px solid #D7E1F0', borderRadius: 18, padding: '16px', background: '#FFFFFF' }}>
      <Col xs={24} lg={10}>
        <Text strong style={{ color: '#183A70' }}>{label}</Text>
      </Col>
      <Col xs={24} lg={14}>
        <Form.Item name={name} rules={[{ required: true, message: `Vui lòng chọn mức đánh giá cho câu: ${label}` }]} style={{ marginBottom: 0 }}>
          <Radio.Group style={{ width: '100%' }}>
            <Space size="large" wrap>
              {options.map((option) => <Radio key={option.value} value={Number(option.value)}>{option.label}</Radio>)}
            </Space>
          </Radio.Group>
        </Form.Item>
      </Col>
    </Row>
  )
}
