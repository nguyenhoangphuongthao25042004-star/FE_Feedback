export type NotificationSeed = {
  id: string
  courseId: string
  title: string
  startDate: string
  endDate: string
}

export const notificationSeeds: NotificationSeed[] = [
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
