import type { NotificationSeed } from '../../student/api/notificationData'

export const instructorNotificationSeeds: NotificationSeed[] = [
  {
    id: 'instructor-quality-rise',
    courseId: 'AI201',
    title: 'Chỉ số giảng dạy của môn AI cơ bản và ứng dụng tăng 0.3 điểm trong học kỳ này',
    startDate: '2026-03-24',
    endDate: '2026-04-05'
  },
  {
    id: 'instructor-low-interaction',
    courseId: 'MOB302',
    title: 'Môn Xây dựng phần mềm thiết bị di động đang có xu hướng giảm ở tiêu chí tương tác',
    startDate: '2026-03-26',
    endDate: '2026-04-08'
  },
  {
    id: 'instructor-recommendation',
    courseId: 'BA210',
    title: 'Hệ thống vừa tạo khuyến nghị cải tiến mới cho môn Phân tích nghiệp vụ',
    startDate: '2026-03-27',
    endDate: '2026-04-10'
  }
]
