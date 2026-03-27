import { Avatar, Card, Col, Progress, Row, Space, Typography, message } from 'antd'
import {
  BookOutlined,
  CalendarOutlined,
  IdcardOutlined,
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
  UserOutlined
} from '@ant-design/icons'

import PageHeader from '../../../components/layout/PageHeader'
import { useAuthStore } from '../../auth/store/auth.store'

const { Text, Title } = Typography

const cardStyle = {
  borderRadius: 24,
  border: '1px solid #D7E1F0',
  boxShadow: '0 14px 34px rgba(0, 45, 109, 0.08)'
} as const

const panelStyle = {
  background: '#FFFFFF',
  border: '1px solid #D7E1F0',
  borderRadius: 20
} as const

const studentProfile = {
  studentId: 'DH52104567',
  className: 'D21_TH09',
  major: 'Công nghệ thông tin',
  course: 'Khóa 2021 - 2025',
  email: 'student@stu.edu.vn',
  phone: '0901 234 567',
  semester: '2025 - 2026 - Học kỳ 2',
  dateOfBirth: '08/04/2003',
  gender: 'Nam',
  status: 'Đang học',
  address: 'Thành phố Hồ Chí Minh'
}

const infoItems = [
  { icon: <IdcardOutlined />, label: 'Mã số sinh viên', value: studentProfile.studentId, span: 12 },
  { icon: <BookOutlined />, label: 'Lớp', value: studentProfile.className, span: 12 },
  { icon: <CalendarOutlined />, label: 'Ngày sinh', value: studentProfile.dateOfBirth, span: 12 },
  { icon: <UserOutlined />, label: 'Giới tính', value: studentProfile.gender, span: 12 },
  { icon: <MailOutlined />, label: 'Email', value: studentProfile.email, span: 12 },
  { icon: <PhoneOutlined />, label: 'Số điện thoại', value: studentProfile.phone, span: 12 },
  { icon: <UserOutlined />, label: 'Ngành học', value: studentProfile.major, span: 12 },
  { icon: <CalendarOutlined />, label: 'Học kỳ', value: studentProfile.semester, span: 12, nowrap: true },
  { icon: <BookOutlined />, label: 'Tình trạng học', value: studentProfile.status, span: 12 },
  { icon: <CalendarOutlined />, label: 'Khóa học', value: studentProfile.course, span: 12 },
  { icon: <IdcardOutlined />, label: 'Địa chỉ', value: studentProfile.address, span: 24 }
]

export default function ProfilePage() {
  const user = useAuthStore((state) => state.user)
  const studentName = user?.name ?? 'Sinh viên STU'
  const avatarLabel = studentName.trim().charAt(0).toUpperCase() || 'S'
  const handlePasswordChange = () => message.info('Chức năng đổi mật khẩu đang được phát triển')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <Card style={cardStyle}>
        <PageHeader
          title="Hồ sơ cá nhân"
          description="Thông tin cá nhân, thiết lập tài khoản và tổng quan học tập của bạn trên hệ thống."
        />

        <div
          style={{
            marginTop: 20,
            border: '1px solid #D7E1F0',
            borderRadius: 24,
            padding: 24,
            background: 'linear-gradient(135deg, #F9FBFF 0%, #EEF5FF 100%)'
          }}
        >
          <Row gutter={[24, 24]} align="top">
            <Col xs={24} xl={6}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div
                  style={{
                    ...panelStyle,
                    minHeight: 230,
                    padding: '24px 20px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 16
                  }}
                >
                  <Avatar
                    size={104}
                    style={{
                      background: 'linear-gradient(135deg, #0E3A74 0%, #2D6BC1 100%)',
                      color: '#FFFFFF',
                      fontSize: 40,
                      fontWeight: 800,
                      boxShadow: '0 18px 34px rgba(14, 58, 116, 0.2)'
                    }}
                  >
                    {avatarLabel}
                  </Avatar>
                  <Text
                    style={{
                      color: '#5E7491',
                      fontSize: 13,
                      textTransform: 'uppercase',
                      letterSpacing: 1.2,
                      textAlign: 'center'
                    }}
                  >
                    Student Profile
                  </Text>
                </div>

                <button
                  type="button"
                  onClick={handlePasswordChange}
                  style={{
                    ...panelStyle,
                    padding: '18px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16,
                    width: '100%',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  <div
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: 999,
                      background: '#DFF0FF',
                      color: '#1D4ED8',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 20,
                      flexShrink: 0
                    }}
                  >
                    <LockOutlined />
                  </div>
                  <Text
                    strong
                    style={{
                      color: '#163253',
                      fontSize: 15,
                      lineHeight: 1.35,
                      whiteSpace: 'nowrap'
                    }}
                  >
                    Thay đổi mật khẩu
                  </Text>
                </button>
              </div>
            </Col>

            <Col xs={24} xl={18}>
              <div
                style={{
                  ...panelStyle,
                  padding: '18px 22px',
                  marginBottom: 16
                }}
              >
                <Title level={2} style={{ margin: 0, color: '#163253' }}>
                  {studentName}
                </Title>
              </div>

              <div
                style={{
                  ...panelStyle,
                  padding: '18px 20px'
                }}
              >
                <Row gutter={[18, 18]}>
                  {infoItems.map((item, index) => (
                    <Col xs={24} md={item.span} key={item.label}>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: 14,
                          paddingBottom: item.span === 24 ? 0 : 2,
                          borderBottom: index === infoItems.length - 1 ? 'none' : '1px solid transparent'
                        }}
                      >
                        <div
                          style={{
                            width: 34,
                            height: 34,
                            borderRadius: 12,
                            background: '#E8F1FF',
                            color: '#1C4C91',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 16,
                            flexShrink: 0
                          }}
                        >
                          {item.icon}
                        </div>
                        <div style={{ paddingTop: 1 }}>
                          <Text style={{ display: 'block', color: '#7A8CA5', fontSize: 12 }}>
                            {item.label}
                          </Text>
                          <Text
                            strong
                            style={{
                              color: '#163253',
                              fontSize: 15,
                              whiteSpace: item.nowrap ? 'nowrap' : 'normal'
                            }}
                          >
                            {item.value}
                          </Text>
                        </div>
                      </div>
                    </Col>
                  ))}
                </Row>
              </div>
            </Col>
          </Row>
        </div>
      </Card>

      <Card style={cardStyle}>
        <Title level={3} style={{ marginTop: 0, marginBottom: 22, color: '#163253' }}>
          Tổng quan học tập
        </Title>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 26 }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: 14
            }}
          >
            <div
              style={{
                ...panelStyle,
                padding: '16px 18px',
                background: '#F9FBFF'
              }}
            >
              <Text style={{ display: 'block', color: '#7A8CA5', fontSize: 13 }}>
                Phản hồi đã hoàn tất
              </Text>
              <Text strong style={{ color: '#389E0D', fontSize: 32 }}>
                8
              </Text>
              <Text style={{ color: '#5B6B82', marginLeft: 8 }}>môn học</Text>
            </div>

            <div
              style={{
                ...panelStyle,
                padding: '16px 18px',
                background: '#F9FBFF'
              }}
            >
              <Text style={{ display: 'block', color: '#7A8CA5', fontSize: 13 }}>
                Phản hồi còn lại
              </Text>
              <Text strong style={{ color: '#D97706', fontSize: 32 }}>
                3
              </Text>
              <Text style={{ color: '#5B6B82', marginLeft: 8 }}>môn học</Text>
            </div>
          </div>

          <div>
            <Space style={{ width: '100%', justifyContent: 'space-between' }}>
              <Text style={{ color: '#42546B', fontSize: 16 }}>Tiến độ phản hồi học kỳ</Text>
              <Text strong style={{ color: '#163253', fontSize: 16 }}>73%</Text>
            </Space>
            <Progress
              percent={73}
              showInfo={false}
              strokeColor="#52C41A"
              trailColor="#EDF7EE"
              strokeWidth={14}
            />
          </div>
        </div>
      </Card>
    </div>
  )
}
