import { AppstoreOutlined, BookOutlined, BulbOutlined, CommentOutlined, HistoryOutlined, MenuFoldOutlined, MenuUnfoldOutlined, UserOutlined } from '@ant-design/icons' // các icon dùng cho menu
import { Button, Menu } from 'antd' // component nút và menu của Ant Design
import { useNavigate, useLocation } from 'react-router-dom' // hook điều hướng và lấy đường dẫn hiện tại

type SidebarProps = {
  collapsed: boolean
  onToggle: () => void // hàm đổi trạng thái thu gọn / mở rộng sidebar
  showToggle?: boolean // cho phép ẩn nút toggle trong mobile
}

export default function Sidebar({ collapsed, onToggle, showToggle = true }: SidebarProps) {
  const nav = useNavigate() // dùng để chuyển trang khi bấm menu
  const location = useLocation() // dùng để xác định menu đang được chọn

  const selectedKey = location.pathname === '/student/recommendations'
    ? '/student/recommendations'
    : location.pathname

  return ( // cấu trúc sidebar với phần header và menu items
    <div
      style={{
        height: '100%',
        background: 'linear-gradient(180deg, #2D56B0 0%, #1F428F 100%)',
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
        {!collapsed && <span>Smart Feedback</span>} {/* chỉ hiện tên hệ thống khi sidebar chưa thu gọn */}

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
        selectedKeys={[selectedKey]} // đánh dấu menu đang active theo đường dẫn hiện tại
        onClick={(e) => nav(e.key)} // bấm menu nào thì điều hướng tới key của menu đó
        style={{
          background: 'transparent',
          borderRight: 'none',
          flex: 1,
          paddingTop: 8
        }}
        items={[
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
