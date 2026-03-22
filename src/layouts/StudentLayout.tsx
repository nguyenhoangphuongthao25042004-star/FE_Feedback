import { useEffect, useState } from 'react' //usestate lưu trạng thái thu gọn của sidebar, useeffect chạy lại logic khi màn hình thay đổi
import type { ReactNode } from 'react' //định nghĩa kiểu cho children, là nội dung sẽ được hiển thị trong layout
import { Drawer, Grid, Layout } from 'antd' //drawer là menu trượt ra trên mobile, grid để biết kích thước đang là mobile/tablet/desktop
import Sidebar from '../modules/student/components/Sidebar'
import Topbar from '../modules/student/components/Topbar'

const { Sider, Header, Content } = Layout //phân tách các phần của layout để dễ sử dụng hơn
const { useBreakpoint } = Grid //hook để biết kích thước màn hình

type StudentLayoutProps = { //định nghĩa kiểu cho props của layout
  children: ReactNode
}

export default function StudentLayout({ children }: StudentLayoutProps) {
  const screens = useBreakpoint() //lấy thông tin kích thước hiện tại
  const isMobile = !screens.md //nếu không có kích thước md thì xem là mobile
  const isTablet = Boolean(screens.md && !screens.lg)
  const headerHeight = isMobile ? 112 : 72
  const [collapsed, setCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false) //trạng thái mở hay đóng menu trên mobile
  const sidebarWidth = collapsed ? 88 : 220

  useEffect(() => { //chạy mỗi khi kích thước thay đổi
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
        <Sider //sidebar cố định bên trái
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
          {children}
        </Content>
      </Layout>
    </Layout>
  )
}
