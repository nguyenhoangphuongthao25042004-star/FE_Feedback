import { Input, Avatar, Select, Space, Badge, Typography, Button } from 'antd' // Ant Design components
import { BellOutlined, MenuOutlined } from '@ant-design/icons' //icon chuông thông báo và menu
import logo from '../../../assets/STU-topbar.png'
import collapsedLogo from '../../../assets/stu-logo.png'

const { Text } = Typography // Lấy component Text từ Typography của Ant Design

type TopbarProps = { // định nghĩa kiểu cho props của component Topbar
  isMobile: boolean
  isTablet: boolean
  sidebarWidth?: number
  collapsed?: boolean
  onMenuClick: () => void 
}

const semesterOptions = [ 
  { value: '2025-2026-HK2', label: '2025 - 2026 - Học kỳ 2' },
  { value: '2025-2026-HK1', label: '2025 - 2026 - Học kỳ 1' }
]

export default function Topbar({ isMobile, isTablet, sidebarWidth = 220, collapsed = false, onMenuClick }: TopbarProps) { //tạo component topbar
  if (isMobile) { //nếu là mobile dùng layout riêng
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

        <Space
          size={10}
          style={{
            gridColumn: '2 / 3',
            gridRow: '1 / 2',
            minWidth: 0
          }}
        >
          <img
            src={logo}
            alt="STU"
            style={{
              width: 92,
              height: 28,
              objectFit: 'contain',
              flexShrink: 0
            }}
          />

          <Text
            strong
            style={{
              fontSize: 16,
              color: '#163253',
              lineHeight: 1.4,
              minWidth: 0
            }}
          >
            Smart Feedback - Teaching Quality Dashboard
          </Text>
        </Space>

        <div style={{ gridColumn: '2 / 3', gridRow: '2 / 3' }}>
          <Select
            aria-label="Chọn học kỳ"
            defaultValue={'2025-2026 - Học kỳ 2'}
            style={{ width: '100%' }}
            size="large"
            options={semesterOptions}
          />
        </div>
      </div>
    )
  }

  if (isTablet) { //nếu là tablet dùng layout riêng
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: '100%',
          background: '#FFFFFF',
          padding: '0 4px',
          gap: 16
        }}
      >
        <Space
          size={12}
          style={{
            flex: 1,
            minWidth: 0,
            overflow: 'hidden'
          }}
        >
          <img
            src={logo}
            alt="STU"
            style={{
              width: 108,
              height: 30,
              objectFit: 'contain',
              flexShrink: 0
            }}
          />

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

        <Space size="middle" style={{ flexShrink: 0 }}>
          <Select
            aria-label="Chọn học kỳ"
            defaultValue={'2025-2026 - Học kỳ 2'}
            style={{ width: 280 }}
            size="large"
            options={semesterOptions}
          />

          <Input
            aria-label="Tìm kiếm"
            placeholder="Tìm kiếm..."
            style={{
              width: 180,
              height: 44,
              borderRadius: 999,
              background: '#F4F7FC',
              borderColor: '#C4D3EA'
            }}
          />

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
                <BellOutlined
                  style={{
                    fontSize: 18,
                    color: '#42546B'
                  }}
                />
              </Badge>
            )}
          />

          <Avatar
            style={{
              backgroundColor: '#004286',
              minWidth: 44,
              height: 44,
              lineHeight: '44px'
            }}
          >
            SV
          </Avatar>
        </Space>
      </div>
    )
  }

  return ( // layout mặc định cho desktop
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `${sidebarWidth}px minmax(0, 1fr)`,
        alignItems: 'center',
        height: '100%',
        background: '#FFFFFF',
        padding: '0 24px 0 0',
        gap: 0
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
          paddingLeft: 48,
          gap: 32
        }}
      >
        <Text
          strong
          style={{
            fontSize: 18,
            color: '#1C3D66',
            whiteSpace: 'nowrap',
            flexShrink: 0
          }}
        >
          Smart Feedback - Teaching Quality Dashboard
        </Text>

        <Select
          aria-label="Chọn học kỳ"
          defaultValue={'2025-2026 - Học kỳ 2'}
          style={{ width: 220 }}
          size="large"
          options={semesterOptions}
        />

        <Input
          aria-label="Tìm kiếm"
          placeholder="Tìm kiếm..."
          style={{
            width: 360,
            height: 44,
            borderRadius: 999,
            background: '#F4F7FC',
            borderColor: '#C4D3EA'
          }}
        />

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
            <Badge count={3} size="small"> {/* Hiển thị số lượng thông báo chưa đọc */}
              <BellOutlined
                style={{
                  fontSize: 18,
                  color: '#42546B'
                }}
              />
            </Badge>
          )}
        />

        <Avatar
          style={{
            backgroundColor: '#004286',
            minWidth: 44,
            height: 44,
            lineHeight: '44px'
          }}
        >
          SV
        </Avatar>
      </div>
    </div>
  )
}
