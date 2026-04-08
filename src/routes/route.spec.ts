// Kiểu vai trò được phép xuất hiện trong bảng mô tả route
export type VaiTroRoute = 'Công khai' | 'Sinh viên' | 'Giảng viên' | 'Quản trị/Khoa'

// Kiểu dữ liệu cho từng dòng mô tả route
export type RouteSpecItem = {
  vaiTro: VaiTroRoute
  path: string
  tenHienThi: string
  manHinh: string
  componentTrang: string
  layout: string
  api: string[]
}

// Danh sách route đối chiếu với tài liệu đặc tả
export const routeSpec: RouteSpecItem[] = [
  { vaiTro: 'Công khai', path: '/login', tenHienThi: 'Đăng nhập', manHinh: 'Màn hình đăng nhập', componentTrang: 'LoginPage', layout: 'Không dùng layout sau đăng nhập', api: ['/api/student/login', '/api/instructor/login'] },
  { vaiTro: 'Sinh viên', path: '/student/dashboard', tenHienThi: 'Tổng quan', manHinh: 'Student Dashboard', componentTrang: 'DashboardPage', layout: 'StudentLayout', api: ['/api/student/dashboard', '/api/student/study-profile', '/api/student/recommendations'] },
  { vaiTro: 'Sinh viên', path: '/student/feedback/new', tenHienThi: 'Gửi phản hồi', manHinh: 'Màn hình Gửi phản hồi', componentTrang: 'FeedbackFormPage', layout: 'StudentLayout', api: ['/api/form/metadata', '/api/feedback/submit'] },
  { vaiTro: 'Sinh viên', path: '/student/courses', tenHienThi: 'Môn học của tôi', manHinh: 'Màn hình Môn học của tôi', componentTrang: 'CoursesPage', layout: 'StudentLayout', api: ['/api/student/courses'] },
  { vaiTro: 'Sinh viên', path: '/student/course/:courseId', tenHienThi: 'Chi tiết môn học', manHinh: 'Màn hình Chi tiết môn học (Student)', componentTrang: 'CourseDetailPage', layout: 'StudentLayout', api: ['/api/student/course/{courseId}'] },
  { vaiTro: 'Sinh viên', path: '/student/history', tenHienThi: 'Lịch sử phản hồi', manHinh: 'Màn hình Lịch sử phản hồi', componentTrang: 'FeedbackHistoryPage', layout: 'StudentLayout', api: ['/api/student/feedback-history'] },
  { vaiTro: 'Sinh viên', path: '/student/profile', tenHienThi: 'Hồ sơ cá nhân', manHinh: 'Hồ sơ cá nhân', componentTrang: 'ProfilePage', layout: 'StudentLayout', api: [] },
  { vaiTro: 'Giảng viên', path: '/instructor/dashboard', tenHienThi: 'Tổng quan', manHinh: 'Instructor Dashboard', componentTrang: 'DashboardPage', layout: 'InstructorLayout', api: ['/api/instructor/dashboard', '/api/instructor/quality-index', '/api/instructor/feature-importance'] },
  { vaiTro: 'Giảng viên', path: '/instructor/courses', tenHienThi: 'Môn học của tôi', manHinh: 'Màn hình Danh sách môn giảng dạy', componentTrang: 'CoursesPage', layout: 'InstructorLayout', api: ['/api/instructor/courses'] },
  { vaiTro: 'Giảng viên', path: '/instructor/course/:courseId', tenHienThi: 'Chi tiết môn giảng dạy', manHinh: 'Màn hình Chi tiết môn giảng dạy', componentTrang: 'CourseDetailPage', layout: 'InstructorLayout', api: ['/api/instructor/course/{courseId}'] },
  { vaiTro: 'Giảng viên', path: '/instructor/feedback', tenHienThi: 'Phản hồi sinh viên', manHinh: 'Màn hình Phản hồi sinh viên', componentTrang: 'FeedbackPage', layout: 'InstructorLayout', api: ['/api/instructor/feedback/topics', '/api/instructor/feedback/list'] },
  { vaiTro: 'Giảng viên', path: '/instructor/recommendations', tenHienThi: 'Khuyến nghị cải tiến', manHinh: 'Màn hình Khuyến nghị cải tiến', componentTrang: 'RecommendationsPage', layout: 'InstructorLayout', api: ['/api/instructor/recommendations'] },
  { vaiTro: 'Giảng viên', path: '/instructor/profile', tenHienThi: 'Hồ sơ cá nhân', manHinh: 'Hồ sơ giảng viên', componentTrang: 'ProfilePage', layout: 'InstructorLayout', api: [] },
  { vaiTro: 'Quản trị/Khoa', path: '/admin/dashboard', tenHienThi: 'Tổng quan', manHinh: 'Admin Dashboard', componentTrang: 'DashboardPage', layout: 'AdminLayout', api: ['/api/admin/dashboard'] },
  { vaiTro: 'Quản trị/Khoa', path: '/admin/course-ranking', tenHienThi: 'Xếp hạng môn học', manHinh: 'Màn hình Xếp hạng môn học', componentTrang: 'CourseRankingPage', layout: 'AdminLayout', api: ['/api/admin/course-ranking'] },
  { vaiTro: 'Quản trị/Khoa', path: '/admin/instructor-ranking', tenHienThi: 'Xếp hạng giảng viên', manHinh: 'Màn hình Xếp hạng giảng viên', componentTrang: 'InstructorRankingPage', layout: 'AdminLayout', api: ['/api/admin/instructor-ranking'] },
  { vaiTro: 'Quản trị/Khoa', path: '/admin/data-quality', tenHienThi: 'Chất lượng dữ liệu', manHinh: 'Màn hình Chất lượng dữ liệu khảo sát', componentTrang: 'DataQualityPage', layout: 'AdminLayout', api: ['/api/admin/data-quality'] },
  { vaiTro: 'Quản trị/Khoa', path: '/admin/recommendations', tenHienThi: 'Đề xuất cải thiện', manHinh: 'Màn hình Đề xuất cải thiện', componentTrang: 'RecommendationsPage', layout: 'AdminLayout', api: [] },
  { vaiTro: 'Quản trị/Khoa', path: '/course/:id', tenHienThi: 'Chi tiết môn học', manHinh: 'Màn hình Course Drill-down', componentTrang: 'CourseDrilldownPage', layout: 'AdminLayout', api: ['/api/admin/course-drilldown/{id}'] },
  { vaiTro: 'Quản trị/Khoa', path: '/instructor/:id', tenHienThi: 'Chi tiết giảng viên', manHinh: 'Màn hình Instructor Drill-down', componentTrang: 'InstructorDrilldownPage', layout: 'AdminLayout', api: ['/api/admin/instructor-drilldown/{id}'] }
]



