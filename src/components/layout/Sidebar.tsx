import { AppstoreOutlined, BookOutlined, BulbOutlined, CommentOutlined, HistoryOutlined, MenuFoldOutlined, MenuUnfoldOutlined, UserOutlined, BarChartOutlined, FundOutlined } from '@ant-design/icons'
import { Button, Menu } from 'antd'
import { useLocation, useNavigate } from 'react-router-dom'

// Kiểu props cho sidebar sinh viên
type SidebarProps = {
  collapsed: boolean
  onToggle: () => void
  showToggle?: boolean
}

// Sidebar điều hướng của module sinh viên
export default function Sidebar({ collapsed, onToggle, showToggle = true }: SidebarProps) {
  const nav = useNavigate() // dùng để điều hướng khi bấm menu
  const location = useLocation() // lấy route hiện tại để đánh dấu mục đang chọn

  const isInstructor = location.pathname.startsWith('/instructor')
  const isAdmin = location.pathname.startsWith('/admin')
  const selectedKey = location.pathname

  return (
    <div
      style={{
        height: '100%',
        background: 'linear-gradient(180deg, #004286 0%, #001F4C 100%)',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <div
        style={{
          color: '#FFFFFF',
          padding: collapsed ? '18px 12px' : '18px 16px',
          fontWeight: 700,
          fontSize: 18,
          borderBottom: '1px solid rgba(255,255,255,0.14)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'space-between',
          gap: 12
        }}
      >
        {!collapsed && <span>Smart Feedback</span>}

        {showToggle && (
          <Button
            type="text"
            aria-label={collapsed ? 'Mở rộng thanh điều hướng' : 'Thu gọn thanh điều hướng'}
            onClick={onToggle}
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            style={{
              color: '#FFFFFF',
              border: '1px solid rgba(255,255,255,0.2)',
              background: 'rgba(255,255,255,0.08)',
              width: 44,
              height: 44
            }}
          />
        )}
      </div>

      <Menu
        mode="inline"
        inlineCollapsed={collapsed}
        selectedKeys={[selectedKey]}
        onClick={(event) => nav(event.key)}
        style={{
          background: 'transparent',
          borderRight: 'none',
          flex: 1,
          paddingTop: 8
        }}
        items={isAdmin ? [
          { key: '/admin/dashboard', icon: <AppstoreOutlined />, label: 'Tổng quan' },
          { key: '/admin/course-ranking', icon: <BarChartOutlined />, label: 'Xếp hạng môn học' },
          { key: '/admin/instructor-ranking', icon: <UserOutlined />, label: 'Xếp hạng giảng viên' },
          { key: '/admin/recommendations', icon: <FundOutlined />, label: 'Đề xuất cải thiện' },
          { key: '/admin/data-quality', icon: <HistoryOutlined />, label: 'Chất lượng dữ liệu' }
        ] : isInstructor ? [
          { key: '/instructor/dashboard', icon: <AppstoreOutlined />, label: 'Tổng quan' },
          { key: '/instructor/courses', icon: <BookOutlined />, label: 'Danh sách môn giảng dạy' },
          { key: '/instructor/quality', icon: <BarChartOutlined />, label: 'Chỉ số chất lượng' },
          { key: '/instructor/feedback', icon: <CommentOutlined />, label: 'Phản hồi sinh viên' },
          { key: '/instructor/recommendations', icon: <BulbOutlined />, label: 'Khuyến nghị cải tiến' }
        ] : [
          { key: '/student/dashboard', icon: <AppstoreOutlined />, label: 'Tổng quan' },
          { key: '/student/feedback/new', icon: <CommentOutlined />, label: 'Gửi phản hồi' },
          { key: '/student/courses', icon: <BookOutlined />, label: 'Môn học của tôi' },
          { key: '/student/history', icon: <HistoryOutlined />, label: 'Lịch sử phản hồi' },
          { key: '/student/recommendations', icon: <BulbOutlined />, label: 'Gợi ý học tập' },
          { key: '/student/profile', icon: <UserOutlined />, label: 'Hồ sơ cá nhân' }
        ]}
      />
    </div>
  )
}
