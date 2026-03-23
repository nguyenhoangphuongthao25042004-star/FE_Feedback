import type { ReactNode } from 'react'
import { Layout } from 'antd'

const { Content } = Layout // lấy riêng phần Content để dựng bố cục chung

// Kiểu props cho layout tổng quát có thể nhận sidebar và topbar
type AppLayoutProps = {
  sidebar?: ReactNode
  topbar?: ReactNode
  children: ReactNode
  sidebarWidth?: number
}

// Layout khung tổng quát cho các màn cần sidebar topbar và content
export default function AppLayout({ sidebar, topbar, children, sidebarWidth = 220 }: AppLayoutProps) {
  return (
    <Layout style={{ minHeight: '100vh', background: '#EEF3FB' }}>
      {sidebar}
      <Layout style={{ marginLeft: sidebar ? sidebarWidth : 0 }}>
        {topbar}
        <Content style={{ padding: 24, background: '#EEF3FB' }}>{children}</Content>
      </Layout>
    </Layout>
  )
}
