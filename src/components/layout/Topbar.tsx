import { useEffect, useMemo, useState } from 'react'
import { Avatar, Badge, Button, Input, Popover, Select, Space, Typography } from 'antd'
import { BellOutlined, ExclamationCircleFilled, LogoutOutlined, MenuOutlined, UserOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import { useLocation, useNavigate } from 'react-router-dom'

import logo from '../../assets/STU-topbar.png'
import collapsedLogo from '../../assets/stu-logo.png'
import { useAuthStore } from '../../modules/auth/store/auth.store'
import { getStudentFeedbackCourses } from '../../modules/student/api/feedbackData'
import { notificationSeeds as seededNotifications, type NotificationSeed } from '../../modules/student/api/notificationData'
import { useUiStore } from '../../stores/ui.store'

const { Text } = Typography

type TopbarProps = {
  isMobile: boolean
  isTablet: boolean
  sidebarWidth?: number
  collapsed?: boolean
  onMenuClick: () => void
}

type NotificationItem = NotificationSeed & {
  unread: boolean
  remindAt?: string
}

const semesterOptions = [
  { value: '2025-2026-HK2', label: '2025 - 2026 - Học kỳ 2' },
  { value: '2025-2026-HK1', label: '2025 - 2026 - Học kỳ 1' }
]

const NOTIFICATION_STORAGE_KEY = 'smart-feedback-notifications-v9'

const legacyNotificationSeeds: NotificationSeed[] = [
  {
    id: 'feedback-ai201',
    courseId: 'AI201',
    title: 'Có 1 form cần bạn phản hồi cho môn AI cơ bản và ứng dụng',
    startDate: '2026-03-22',
    endDate: '2026-03-30'
  },
  {
    id: 'feedback-mob302',
    courseId: 'MOB302',
    title: 'Có 1 form cần bạn phản hồi cho môn Xây dựng phần mềm thiết bị di động',
    startDate: '2026-03-26',
    endDate: '2026-03-31'
  },
  {
    id: 'feedback-ba210',
    courseId: 'BA210',
    title: 'Có 1 form cần bạn phản hồi cho môn Phân tích nghiệp vụ',
    startDate: '2026-03-25',
    endDate: '2026-04-03'
  }
]

void legacyNotificationSeeds

const createDefaultNotifications = (): NotificationItem[] => (
  seededNotifications.map((item) => ({
    ...item,
    unread: true
  }))
)

const canUseStorage = () => typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'

const readStoredNotifications = () => {
  const fallback = createDefaultNotifications()

  if (!canUseStorage()) return fallback

  try {
    const rawValue = window.localStorage.getItem(NOTIFICATION_STORAGE_KEY)

    if (!rawValue) {
      window.localStorage.setItem(NOTIFICATION_STORAGE_KEY, JSON.stringify(fallback))
      return fallback
    }

    const parsed = JSON.parse(rawValue) as NotificationItem[]

    if (!Array.isArray(parsed)) {
      window.localStorage.setItem(NOTIFICATION_STORAGE_KEY, JSON.stringify(fallback))
      return fallback
    }

    const parsedById = new Map(
      parsed
        .filter((item): item is NotificationItem => Boolean(item?.id))
        .map((item) => [item.id, item])
    )

    const mergedNotifications = fallback.map((item) => {
      const storedItem = parsedById.get(item.id)

      return {
        ...item,
        unread: storedItem?.unread ?? item.unread,
        remindAt: storedItem?.remindAt
      }
    })

    window.localStorage.setItem(NOTIFICATION_STORAGE_KEY, JSON.stringify(mergedNotifications))
    return mergedNotifications
  } catch {
    return fallback
  }
}

const persistNotifications = (notifications: NotificationItem[]) => {
  if (!canUseStorage()) return
  window.localStorage.setItem(NOTIFICATION_STORAGE_KEY, JSON.stringify(notifications))
}

const normalizeNotifications = (notifications: NotificationItem[]) => {
  const now = dayjs()
  const courses = getStudentFeedbackCourses()

  return notifications
    .filter((item) => {
      const matchedCourse = courses.find((course) => course.id === item.courseId)
      const isCompleted = matchedCourse?.feedbackStatus === 'da-phan-hoi'
      const isExpired = now.isAfter(dayjs(item.endDate), 'day')

      return !isCompleted && !isExpired
    })
    .map((item) => {
      if (item.remindAt && (now.isAfter(dayjs(item.remindAt)) || now.isSame(dayjs(item.remindAt)))) {
        return {
          ...item,
          unread: true,
          remindAt: undefined
        }
      }

      return item
    })
}

export default function Topbar({ isMobile, isTablet, sidebarWidth = 220, collapsed = false, onMenuClick }: TopbarProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)
  const selectedSemester = useUiStore((state) => state.selectedSemester)
  const searchKeyword = useUiStore((state) => state.searchKeyword)
  const setSelectedSemester = useUiStore((state) => state.setSelectedSemester)
  const setSearchKeyword = useUiStore((state) => state.setSearchKeyword)
  const resetFilters = useUiStore((state) => state.resetFilters)
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => normalizeNotifications(readStoredNotifications()))
  const avatarLabel = user?.name?.trim().charAt(0).toUpperCase() || 'U'
  // Show the topbar search for student course listings/history and the instructor courses list
  const shouldShowSearch = location.pathname === '/student/courses' || location.pathname === '/student/history' || location.pathname === '/instructor/courses'

  useEffect(() => {
    const syncNotifications = () => {
      const nextNotifications = normalizeNotifications(readStoredNotifications())
      persistNotifications(nextNotifications)
      setNotifications(nextNotifications)
    }

    syncNotifications()
    window.addEventListener('student-feedback-workflow-updated', syncNotifications)
    window.addEventListener('focus', syncNotifications)

    return () => {
      window.removeEventListener('student-feedback-workflow-updated', syncNotifications)
      window.removeEventListener('focus', syncNotifications)
    }
  }, [])

  useEffect(() => {
    const normalized = normalizeNotifications(notifications)
    persistNotifications(normalized)

    const hasChanged = JSON.stringify(normalized) !== JSON.stringify(notifications)

    if (hasChanged) {
      setNotifications(normalized)
    }
  }, [location.key, location.pathname, location.search, notifications])

  const visibleNotifications = useMemo(
    () => notifications.filter((item) => !item.remindAt),
    [notifications]
  )
  const unreadCount = useMemo(
    () => visibleNotifications.filter((item) => item.unread && item.title.trim().length > 0).length,
    [visibleNotifications]
  )

  const handleLogout = () => {
    logout()
    resetFilters()
    navigate('/login')
  }

  const handleNotificationAction = (notificationId: string) => {
    const matchedNotification = notifications.find((item) => item.id === notificationId)
    const matchedCourse = matchedNotification ? getStudentFeedbackCourses().find((course) => course.id === matchedNotification.courseId) : undefined
    const isCompleted = matchedCourse?.feedbackStatus === 'da-phan-hoi'
    const isExpired = matchedNotification ? dayjs().isAfter(dayjs(matchedNotification.endDate), 'day') : false

    setNotifications((current) => {
      if (isCompleted || isExpired) {
        const nextNotifications = current.filter((item) => item.id !== notificationId)
        persistNotifications(nextNotifications)
        return nextNotifications
      }

      const nextNotifications = current.map((item) => (
        item.id === notificationId
          ? {
            ...item,
            unread: false,
            remindAt: dayjs().add(10, 'second').toISOString() //test
          }
          : item
      ))

      persistNotifications(nextNotifications)
      return nextNotifications
    })
  }

  const accountMenu = (
    <div
      style={{
        minWidth: 290,
        padding: 0,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        borderRadius: 18
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '14px 16px',
          background: 'linear-gradient(135deg, #1E6DA1 0%, #3D91C3 100%)'
        }}
      >
        <Avatar
          size={52}
          style={{
            background: 'linear-gradient(135deg, #F5FBFF 0%, #CFE5FF 100%)',
            color: '#0E3A74',
            fontWeight: 800,
            fontSize: 22,
            flexShrink: 0
          }}
          icon={!user?.name ? <UserOutlined /> : undefined}
        >
          {user?.name ? avatarLabel : undefined}
        </Avatar>

        <div style={{ minWidth: 0 }}>
          <Text strong style={{ display: 'block', color: '#FFFFFF', fontSize: 16, lineHeight: 1.4 }}>
            {user?.name ?? 'Người dùng'}
          </Text>
        </div>
      </div>

      <div
        style={{
          padding: 12,
          background: '#FFFFFF'
        }}
      >
        <Button
          icon={<LogoutOutlined />}
          danger
          block
          size="large"
          onClick={handleLogout}
          style={{ borderRadius: 12, justifyContent: 'flex-start' }}
        >
          Đăng xuất
        </Button>
      </div>
    </div>
  )

  const notificationsMenu = (
    <div
      style={{
        width: 360,
        display: 'flex',
        flexDirection: 'column',
        gap: 12
      }}
    >
      <div style={{ paddingInline: 4 }}>
        <Text strong style={{ color: '#163253', fontSize: 16 }}>
          Thông báo phản hồi
        </Text>
        <Text style={{ display: 'block', color: '#6C7C92', marginTop: 2 }}>
          {unreadCount > 0 ? `Bạn có ${unreadCount} thông báo chưa đọc` : 'Không có thông báo mới'}
        </Text>
      </div>

      {visibleNotifications.length === 0 ? (
        <div
          style={{
            border: '1px solid #D7E1F0',
            borderRadius: 16,
            padding: 16,
            background: '#FFFFFF'
          }}
        >
          <Text style={{ color: '#5B6B82' }}>Hiện chưa có thông báo phản hồi nào.</Text>
        </div>
      ) : visibleNotifications.map((item) => (
        <div
          key={item.id}
          onClick={() => handleNotificationAction(item.id)}
          style={{
            position: 'relative',
            border: '1px solid #D7E1F0',
            borderRadius: 16,
            padding: '14px 16px',
            background: item.unread ? '#F7FBFF' : '#FFFFFF',
            cursor: 'pointer'
          }}
        >
          <Button
            type="text"
            size="small"
            aria-label="Đánh dấu đã đọc"
            icon={<ExclamationCircleFilled />}
            onClick={(event) => {
              event.stopPropagation()
              handleNotificationAction(item.id)
            }}
            style={{
              position: 'absolute',
              top: 8,
              right: 8,
              color: '#FF4D4F'
            }}
          />

          <Text strong style={{ display: 'block', color: '#163253', paddingRight: 28, lineHeight: 1.5 }}>
            {item.title}
          </Text>
          <Text style={{ display: 'block', color: '#5B6B82', marginTop: 6, lineHeight: 1.5 }}>
            Từ ngày {dayjs(item.startDate).format('DD/MM/YYYY')} đến ngày {dayjs(item.endDate).format('DD/MM/YYYY')}
          </Text>
        </div>
      ))}
    </div>
  )

  const avatarNode = (
    <Popover trigger="click" placement="bottomRight" content={accountMenu}>
      <Avatar
        style={{
          backgroundColor: '#004286',
          minWidth: 44,
          height: 44,
          lineHeight: '44px',
          cursor: 'pointer',
          boxShadow: '0 10px 22px rgba(0, 66, 134, 0.18)'
        }}
        icon={!user?.name ? <UserOutlined /> : undefined}
      >
        {user?.name ? avatarLabel : undefined}
      </Avatar>
    </Popover>
  )

  const notificationNode = (
    <Popover trigger="click" placement="bottomRight" content={notificationsMenu}>
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
          <Badge count={unreadCount} size="small">
            <BellOutlined style={{ fontSize: 18, color: '#42546B' }} />
          </Badge>
        )}
      />
    </Popover>
  )

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

          {notificationNode}
          {avatarNode}
        </div>
      </div>
    )
  }

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
              placeholder={location.pathname === '/instructor/courses' ? 'Tìm môn học' : 'Tìm môn học hoặc giảng viên'}
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

          {notificationNode}
          {avatarNode}
        </div>
      </div>
    )
  }

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
            placeholder={location.pathname === '/instructor/courses' ? 'Tìm môn học' : 'Tìm môn học hoặc giảng viên'}
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

        {notificationNode}
        {avatarNode}
      </div>
    </div>
  )
}
