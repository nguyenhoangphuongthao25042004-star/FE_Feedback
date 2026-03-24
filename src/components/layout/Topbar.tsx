import { Avatar, Badge, Button, Input, Select, Space, Typography } from 'antd'
import { BellOutlined, MenuOutlined } from '@ant-design/icons'
import { useLocation } from 'react-router-dom'

import logo from '../../assets/STU-topbar.png'
import collapsedLogo from '../../assets/stu-logo.png'
import { useAuthStore } from '../../modules/auth/store/auth.store'
import { useUiStore } from '../../stores/ui.store'

const { Text } = Typography // lấy component Text để hiển thị chữ trong topbar

// Kiểu props điều khiển từng trạng thái responsive của topbar
type TopbarProps = {
  isMobile: boolean
  isTablet: boolean
  sidebarWidth?: number
  collapsed?: boolean
  onMenuClick: () => void
}

// Danh sách học kỳ cho bộ chọn chung trên topbar
const semesterOptions = [
  { value: '2025-2026-HK2', label: '2025 - 2026 - Học kỳ 2' },
  { value: '2025-2026-HK1', label: '2025 - 2026 - Học kỳ 1' }
]

// Topbar này dùng chung cho layout sinh viên và đọc dữ liệu từ store
export default function Topbar({ isMobile, isTablet, sidebarWidth = 220, collapsed = false, onMenuClick }: TopbarProps) {
  const location = useLocation()
  const user = useAuthStore((state) => state.user) // lấy người dùng đang đăng nhập để hiển thị avatar
  const selectedSemester = useUiStore((state) => state.selectedSemester) // lấy học kỳ đang được chọn ở topbar
  const searchKeyword = useUiStore((state) => state.searchKeyword) // lấy từ khóa tìm kiếm đang dùng chung
  const setSelectedSemester = useUiStore((state) => state.setSelectedSemester) // hàm cập nhật học kỳ trên store
  const setSearchKeyword = useUiStore((state) => state.setSearchKeyword) // hàm cập nhật từ khóa tìm kiếm
  const avatarLabel = user?.name?.trim().charAt(0).toUpperCase() || 'SV' // lấy chữ cái đầu của tên người dùng cho avatar
  const shouldShowSearch = location.pathname === '/student/courses' || location.pathname === '/student/history'

  // Giao diện topbar cho mobile
  if (isMobile) {
    return (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '44px minmax(0, 1fr)',
          alignItems: 'center',
          columnGap: 12,
          rowGap: 10,
          height: '100%',
          background: '#FFFFFF',
          padding: '10px 0'
        }}
      >
        <Button
          type="text"
          aria-label="Mở menu điều hướng"
          onClick={onMenuClick}
          icon={<MenuOutlined />}
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            color: '#163253',
            border: '1px solid #C4D3EA',
            gridColumn: '1 / 2',
            gridRow: '1 / 2'
          }}
        />

        <Space size={10} style={{ gridColumn: '2 / 3', gridRow: '1 / 2', minWidth: 0 }}>
          <img src={logo} alt="STU" style={{ width: 92, height: 28, objectFit: 'contain', flexShrink: 0 }} />
          <Text strong style={{ fontSize: 16, color: '#163253', lineHeight: 1.4, minWidth: 0 }}>
            Smart Feedback - Teaching Quality Dashboard
          </Text>
        </Space>

        <div style={{ gridColumn: '2 / 3', gridRow: '2 / 3', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
          <Select
            aria-label="Chọn học kỳ"
            value={selectedSemester}
            onChange={setSelectedSemester}
            style={{ flex: 1 }}
            size="large"
            options={semesterOptions}
          />

          <Button
            type="text"
            aria-label="Thông báo"
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              border: '1px solid #C4D3EA',
              color: '#42546B',
              flexShrink: 0
            }}
            icon={(
              <Badge count={3} size="small">
                <BellOutlined style={{ fontSize: 18, color: '#42546B' }} />
              </Badge>
            )}
          />

          <Avatar style={{ backgroundColor: '#004286', minWidth: 44, height: 44, lineHeight: '44px', flexShrink: 0 }}>
            {avatarLabel}
          </Avatar>
        </div>
      </div>
    )
  }

  // Giao diện topbar cho tablet
  if (isTablet) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: '100%',
          background: '#FFFFFF',
          padding: '0 16px',
          gap: 16
        }}
      >
        <Space size={12} style={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
          <img src={logo} alt="STU" style={{ width: 108, height: 30, objectFit: 'contain', flexShrink: 0 }} />
          <Text
            strong
            style={{
              fontSize: 16,
              color: '#1C3D66',
              flex: 1,
              minWidth: 0,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            Smart Feedback - Teaching Quality Dashboard
          </Text>
        </Space>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0 }}>
          <Select
            aria-label="Chọn học kỳ"
            value={selectedSemester}
            onChange={setSelectedSemester}
            style={{ width: 220 }}
            size="large"
            options={semesterOptions}
          />

          {shouldShowSearch && (
            <Input
              aria-label="Tìm kiếm"
              placeholder="Tìm môn học hoặc giảng viên"
              value={searchKeyword}
              onChange={(event) => setSearchKeyword(event.target.value)}
              style={{
                width: 200,
                height: 44,
                borderRadius: 999,
                background: '#F4F7FC',
                borderColor: '#C4D3EA'
              }}
            />
          )}

          <Button
            type="text"
            aria-label="Thông báo"
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              border: '1px solid #C4D3EA',
              color: '#42546B'
            }}
            icon={(
              <Badge count={3} size="small">
                <BellOutlined style={{ fontSize: 18, color: '#42546B' }} />
              </Badge>
            )}
          />

          <Avatar style={{ backgroundColor: '#004286', minWidth: 44, height: 44, lineHeight: '44px' }}>
            {avatarLabel}
          </Avatar>
        </div>
      </div>
    )
  }

  // Giao diện topbar cho desktop
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `${sidebarWidth}px minmax(0, 1fr) auto`,
        alignItems: 'center',
        height: '100%',
        background: '#FFFFFF',
        padding: '0 16px 0 0',
        gap: 32
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'flex-start' : 'center',
          paddingLeft: collapsed ? 8 : 0,
          minWidth: 0
        }}
      >
        <img
          src={collapsed ? collapsedLogo : logo}
          alt="STU"
          style={{
            width: collapsed ? 44 : 170,
            height: collapsed ? 44 : 34,
            objectFit: 'contain',
            objectPosition: 'left center',
            flexShrink: 0
          }}
        />
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          minWidth: 0,
          paddingLeft: 20
        }}
      >
        <Text strong style={{ fontSize: 18, color: '#1C3D66', whiteSpace: 'nowrap', flexShrink: 0 }}>
          Smart Feedback - Teaching Quality Dashboard
        </Text>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexShrink: 0 }}>
        <Select
          aria-label="Chọn học kỳ"
          value={selectedSemester}
          onChange={setSelectedSemester}
          style={{ width: 220 }}
          size="large"
          options={semesterOptions}
        />

        {shouldShowSearch && (
          <Input
            aria-label="Tìm kiếm"
            placeholder="Tìm môn học hoặc giảng viên"
            value={searchKeyword}
            onChange={(event) => setSearchKeyword(event.target.value)}
            style={{
              width: 360,
              height: 44,
              borderRadius: 999,
              background: '#F4F7FC',
              borderColor: '#C4D3EA'
            }}
          />
        )}

        <Button
          type="text"
          aria-label="Thông báo"
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            border: '1px solid #C4D3EA',
            color: '#42546B'
          }}
          icon={(
            <Badge count={3} size="small">
              <BellOutlined style={{ fontSize: 18, color: '#42546B' }} />
            </Badge>
          )}
        />

        <Avatar style={{ backgroundColor: '#004286', minWidth: 44, height: 44, lineHeight: '44px' }}>
          {avatarLabel}
        </Avatar>
      </div>
    </div>
  )
}
