import { Card, Form, Input, Button, Typography, message } from 'antd'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'

import type { LoginRequest } from '../types/auth.types'
import { loginInstructorApi } from '../../instructor/api/instructor.api'
import { loginStudentApi } from '../../student/api/student.auth.api'
import { useAuthStore } from '../store/auth.store'

const { Title, Text } = Typography

const loginByRole = async (values: LoginRequest) => {
  try {
    return await loginStudentApi(values)
  } catch {
    return loginInstructorApi(values)
  }
}

export default function LoginPage() {
  const setUser = useAuthStore((state) => state.setUser)
  const navigate = useNavigate()

  const mutation = useMutation({
    mutationFn: loginByRole,
    onSuccess: (res) => {
      if (res.success) {
        setUser(res.data)

        if (res.data.role === 'student') navigate('/student/dashboard')
        if (res.data.role === 'instructor') navigate('/instructor/dashboard')

        message.success(res.message)
      }
    },
    onError: (err: { message?: string }) => {
      message.error(err.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin')
    }
  })

  const onFinish = (values: LoginRequest) => {
    mutation.mutate(values)
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#F5F7FA'
      }}
    >
      <Card
        style={{
          width: 380,
          padding: 20,
          borderRadius: 12,
          boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
          textAlign: 'center'
        }}
      >
        <Title
          style={{
            fontSize: 26,
            marginBottom: 4,
            fontWeight: 600,
            color: '#004286'
          }}
        >
          Smart Feedback
        </Title>

        <Text
          style={{
            fontSize: 14,
            color: '#6B7280'
          }}
        >
          Teaching Quality Dashboard
        </Text>

        <Form
          layout="vertical"
          style={{ marginTop: 20, textAlign: 'left' }}
          onFinish={onFinish}
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { type: 'email', message: 'Vui lòng nhập đúng định dạng email' },
              { required: true, message: 'Vui lòng nhập email' }
            ]}
          >
            <Input placeholder="Nhập email..." />
          </Form.Item>

          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}
          >
            <Input.Password placeholder="Nhập mật khẩu..." />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            size="large"
            style={{ height: 44 }}
            loading={mutation.isPending}
            block
          >
            Đăng nhập
          </Button>

          <div style={{ marginTop: 14, textAlign: 'center' }}>
            <Text
              style={{
                cursor: 'pointer',
                fontWeight: 500
              }}
              onClick={() => message.info('Chức năng đang phát triển')}
            >
              Quên mật khẩu?
            </Text>
          </div>
        </Form>
      </Card>
    </div>
  )
}
