import { Card, Form, Input, Button, Typography, message } from 'antd'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'

import { loginApi } from '../api/auth.api'
import { useAuthStore } from '../store/auth.store'
import logo from '../../../assets/stu-logo.png'

const { Title, Text } = Typography // tách các component chữ để dùng trong giao diện đăng nhập

// Trang đăng nhập chung cho cả 3 vai trò student instructor admin
export default function LoginPage() {
  const setUser = useAuthStore((state) => state.setUser) // lấy hàm lưu người dùng vào store
  const navigate = useNavigate() // dùng để chuyển trang sau khi đăng nhập thành công

  // Mutation này gọi API giả để kiểm tra đăng nhập
  const mutation = useMutation({
    mutationFn: loginApi,
    onSuccess: (res) => {
      if (res.success) {
        setUser(res.data) // lưu thông tin người dùng vào zustand store

        if (res.data.role === 'student') navigate('/student/dashboard') // chuyển sang dashboard sinh viên
        if (res.data.role === 'instructor') navigate('/instructor/dashboard') // chuyển sang dashboard giảng viên
        if (res.data.role === 'admin') navigate('/admin/dashboard') // chuyển sang dashboard admin

        message.success(res.message) // hiện thông báo đăng nhập thành công
      }
    },
    onError: (err: any) => {
      message.error(err.message) // hiện lỗi nếu tài khoản hoặc mật khẩu không đúng
    }
  })

  // Hàm này chạy khi form submit thành công ở phía Ant Design
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
        {/* Khối logo trường */}
        <img
          src={logo}
          alt="STU"
          style={{
            display: 'block',
            margin: '0 auto 16px',
            width: 140
          }}
        />

        {/* Tiêu đề chính của trang đăng nhập */}
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

        {/* Dòng mô tả ngắn của hệ thống */}
        <Text
          style={{
            fontSize: 14,
            color: '#6B7280'
          }}
        >
          Teaching Quality Dashboard
        </Text>

        {/* Form nhập email và mật khẩu */}
        <Form
          layout="vertical"
          style={{ marginTop: 20, textAlign: 'left' }}
          onFinish={onFinish}
        >
          {/* Trường nhập email */}
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

          {/* Trường nhập mật khẩu */}
          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}
          >
            <Input.Password placeholder="Nhập mật khẩu..." />
          </Form.Item>

          {/* Nút gửi form đăng nhập */}
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

          {/* Liên kết quên mật khẩu tạm thời chỉ hiển thị thông báo */}
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
