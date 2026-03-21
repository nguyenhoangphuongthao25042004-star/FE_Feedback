// TRANG LOGIN CHO CẢ 3 ROLE: STUDENT, INSTRUCTOR, ADMIN
import { Card, Form, Input, Button, Typography, message } from 'antd'
import { useMutation } from '@tanstack/react-query'
import { loginApi } from '../api/auth.api'
import { useAuthStore } from '../store/auth.store'
import { useNavigate } from 'react-router-dom'
import logo from '../../../assets/stu-logo.png'

const { Title, Text } = Typography

export default function LoginPage() {
  const setUser = useAuthStore((s) => s.setUser)
  const navigate = useNavigate()

  const mutation = useMutation({
    mutationFn: loginApi,
    onSuccess: (res) => {
      if (res.success) {
        setUser(res.data)

        if (res.data.role === 'student') navigate('/student/dashboard')
        if (res.data.role === 'instructor') navigate('/instructor/dashboard')
        if (res.data.role === 'admin') navigate('/admin/dashboard')

        message.success(res.message)
      }
    },
    onError: (err: any) => {
      message.error(err.message)
    }
  })

  const onFinish = (values: any) => {
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
        {/* LOGO */}
        <img
          src={logo}
          alt="STU"
          style={{
            display: 'block',
            margin: '0 auto 16px',
            width: 140
          }}
        />

        {/* TITLE */}
        <Title
          style={{
            fontSize: 26,
            marginBottom: 4,
            fontWeight: 600,
            color: '#1D4ED8'
          }}
        >
          Smart Feedback
        </Title>

        {/* SUBTITLE */}
        <Text
          style={{
            fontSize: 14,
            color: '#6B7280'
          }}
        >
          Teaching Quality Dashboard
        </Text>

        {/* FORM */}
        <Form
          layout="vertical"
          style={{ marginTop: 20, textAlign: 'left' }} 
          onFinish={onFinish}
        >
          {/* EMAIL */}
          <Form.Item
            label="Email"
            name="email"
            rules={
              [
                { type: 'email', message: 'Vui lòng nhập đúng định dạng email' },
                { required: true, message: 'Vui lòng nhập email' }
              ]
            }
          >
            <Input placeholder="Nhập email..." />
          </Form.Item>

          {/* PASSWORD */}
          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}
          >
            <Input.Password placeholder="Nhập mật khẩu..." />
          </Form.Item>

          {/* BUTTON */}
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

          {/* QUÊN MẬT KHẨU */}
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