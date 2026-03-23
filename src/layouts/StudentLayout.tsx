import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'
import { Drawer, Grid, Layout } from 'antd'
import { Outlet } from 'react-router-dom'

import Sidebar from '../components/layout/Sidebar'
import Topbar from '../components/layout/Topbar'

const { Sider, Header, Content } = Layout // tách các phần chính của layout từ Ant Design
const { useBreakpoint } = Grid // dùng breakpoints để xử lý desktop tablet mobile

// Kiểu props để layout có thể nhận children trực tiếp hoặc dùng Outlet
type StudentLayoutProps = {
  children?: ReactNode
}

// Layout chính cho toàn bộ màn sinh viên
export default function StudentLayout({ children }: StudentLayoutProps) {
  const screens = useBreakpoint() // lấy trạng thái breakpoints hiện tại
  const isMobile = !screens.md // mobile khi nhỏ hơn md
  const isTablet = Boolean(screens.md && !screens.lg) // tablet khi từ md đến trước lg
  const headerHeight = isMobile ? 112 : 72 // header mobile cao hơn để đủ chỗ 2 hàng
  const [collapsed, setCollapsed] = useState(false) // trạng thái thu gọn sidebar
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false) // trạng thái mở drawer trên mobile
  const sidebarWidth = collapsed ? 88 : 220 // tính chiều rộng sidebar để chừa khoảng content

  // Tự điều chỉnh sidebar theo từng breakpoint
  useEffect(() => {
    if (isMobile) {
      setCollapsed(true)
      return
    }

    setCollapsed(isTablet)
    setMobileMenuOpen(false)
  }, [isMobile, isTablet])

  return (
    <Layout style={{ minHeight: '100vh', background: '#EEF3FB' }}>
      {!isMobile && (
        <Sider
          width={220}
          collapsed={collapsed}
          collapsedWidth={88}
          trigger={null}
          style={{
            background: 'linear-gradient(180deg, #004286 0%, #001F4C 100%)',
            boxShadow: '10px 0 28px rgba(0, 45, 109, 0.2)',
            position: 'fixed',
            insetInlineStart: 0,
            top: headerHeight,
            bottom: 0,
            height: `calc(100vh - ${headerHeight}px)`,
            zIndex: 80
          }}
        >
          <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((prev) => !prev)} />
        </Sider>
      )}

      {isMobile && (
        <Drawer
          title="Điều hướng"
          placement="left"
          open={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
          width={260}
          bodyStyle={{ padding: 0 }}
        >
          <Sidebar collapsed={false} onToggle={() => setMobileMenuOpen(false)} showToggle={false} />
        </Drawer>
      )}

      <Layout
        style={{
          background: '#EEF3FB',
          marginLeft: 0,
          marginTop: headerHeight
        }}
      >
        <Header
          style={{
            background: '#fff',
            padding: isMobile ? '0 16px' : '0 24px 0 0',
            borderBottom: '1px solid #D7E1F0',
            height: headerHeight,
            lineHeight: 'normal',
            position: 'fixed',
            left: 0,
            right: 0,
            top: 0,
            zIndex: 90
          }}
        >
          <Topbar
            isMobile={isMobile}
            isTablet={isTablet}
            sidebarWidth={sidebarWidth}
            collapsed={collapsed}
            onMenuClick={() => setMobileMenuOpen(true)}
          />
        </Header>

        <Content
          style={{
            padding: isMobile ? 16 : 24,
            paddingLeft: isMobile ? 16 : sidebarWidth + 24,
            background: '#EEF3FB'
          }}
        >
          {children ?? <Outlet />}
        </Content>
      </Layout>
    </Layout>
  )
}
