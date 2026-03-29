import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'
import { Drawer, Grid, Layout } from 'antd'
import { Outlet, useLocation } from 'react-router-dom'

import Sidebar from '../components/layout/Sidebar'
import Topbar from '../components/layout/Topbar'

const { Sider, Header, Content } = Layout
const { useBreakpoint } = Grid

type InstructorLayoutProps = {
  children?: ReactNode
}

export default function InstructorLayout({ children }: InstructorLayoutProps) {
  const screens = useBreakpoint()
  const location = useLocation()
  const isMobile = !screens.md
  const isTablet = Boolean(screens.md && !screens.xxl)
  const shouldShowTopbarSearch = location.pathname === '/student/courses' || location.pathname === '/student/history' || location.pathname === '/instructor/courses'
  const headerHeight = isMobile ? (shouldShowTopbarSearch ? 188 : 112) : 72
  const [collapsed, setCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const sidebarWidth = collapsed ? 88 : 280

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
          width={280}
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
