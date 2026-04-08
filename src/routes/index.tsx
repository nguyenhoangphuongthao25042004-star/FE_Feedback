import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import StudentLayout from '../layouts/StudentLayout'
import InstructorLayout from '../layouts/InstructorLayout'
import AdminLayout from '../layouts/AdminLayout'
import LoginPage from '../modules/auth/pages/LoginPage'
import StudentDashboardPage from '../modules/student/pages/DashboardPage'
import FeedbackFormPage from '../modules/student/pages/FeedbackFormPage'
import StudentCoursesPage from '../modules/student/pages/CoursesPage'
import StudentCourseDetailPage from '../modules/student/pages/CourseDetailPage'
import FeedbackHistoryPage from '../modules/student/pages/FeedbackHistoryPage'
import FeedbackHistoryDetailPage from '../modules/student/pages/FeedbackHistoryDetailPage'
import StudentRecommendationsPage from '../modules/student/pages/RecommendationsPage'
import StudentProfilePage from '../modules/student/pages/ProfilePage'
import InstructorDashboardPage from '../modules/instructor/pages/DashboardPage'
import InstructorCoursesPage from '../modules/instructor/pages/CoursesPage'
import InstructorCourseDetailPage from '../modules/instructor/pages/CourseDetailPage'
import InstructorQualityPage from '../modules/instructor/pages/QualityPage'
import InstructorFeedbackPage from '../modules/instructor/pages/FeedbackPage'
import InstructorRecommendationsPage from '../modules/instructor/pages/RecommendationsPage'
import InstructorProfilePage from '../modules/instructor/pages/ProfilePage'
import AdminDashboardPage from '../modules/admin/pages/DashboardPage'
import CourseRankingPage from '../modules/admin/pages/CourseRankingPage'
import InstructorRankingPage from '../modules/admin/pages/InstructorRankingPage'
import DataQualityPage from '../modules/admin/pages/DataQualityPage'
import RecommendationsPage from '../modules/admin/pages/RecommendationsPage'
import CourseDrilldownPage from '../modules/admin/pages/CourseDrilldownPage'
import InstructorDrilldownPage from '../modules/admin/pages/InstructorDrilldownPage'

// Cấu hình toàn bộ route chính của ứng dụng
export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Điều hướng mặc định về trang đăng nhập */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Nhóm route cho sinh viên */}
        <Route path="/student/dashboard" element={<StudentLayout><StudentDashboardPage /></StudentLayout>} />
        <Route path="/student/feedback/new" element={<StudentLayout><FeedbackFormPage /></StudentLayout>} />
        <Route path="/student/courses" element={<StudentLayout><StudentCoursesPage /></StudentLayout>} />
        <Route path="/student/course/:courseId" element={<StudentLayout><StudentCourseDetailPage /></StudentLayout>} />
        <Route path="/student/history" element={<StudentLayout><FeedbackHistoryPage /></StudentLayout>} />
  <Route path="/student/history/view/:courseId" element={<StudentLayout><FeedbackHistoryDetailPage /></StudentLayout>} />
        <Route path="/student/recommendations" element={<StudentLayout><StudentRecommendationsPage /></StudentLayout>} />
        <Route path="/student/profile" element={<StudentLayout><StudentProfilePage /></StudentLayout>} />

        {/* Nhóm route cho giảng viên */}
        <Route path="/instructor/dashboard" element={<InstructorLayout><InstructorDashboardPage /></InstructorLayout>} />
        <Route path="/instructor/courses" element={<InstructorLayout><InstructorCoursesPage /></InstructorLayout>} />
        <Route path="/instructor/course/:courseId" element={<InstructorLayout><InstructorCourseDetailPage /></InstructorLayout>} />
        <Route path="/instructor/quality" element={<InstructorLayout><InstructorQualityPage /></InstructorLayout>} />
        <Route path="/instructor/trends" element={<Navigate to="/instructor/recommendations" replace />} />
        <Route path="/instructor/feedback" element={<InstructorLayout><InstructorFeedbackPage /></InstructorLayout>} />
        <Route path="/instructor/recommendations" element={<InstructorLayout><InstructorRecommendationsPage /></InstructorLayout>} />
        <Route path="/instructor/profile" element={<InstructorLayout><InstructorProfilePage /></InstructorLayout>} />

        {/* Nhóm route cho quản trị */}
        <Route path="/admin/dashboard" element={<AdminLayout><AdminDashboardPage /></AdminLayout>} />
        <Route path="/admin/course-ranking" element={<AdminLayout><CourseRankingPage /></AdminLayout>} />
        <Route path="/admin/instructor-ranking" element={<AdminLayout><InstructorRankingPage /></AdminLayout>} />
        <Route path="/admin/recommendations" element={<AdminLayout><RecommendationsPage /></AdminLayout>} />
        <Route path="/admin/data-quality" element={<AdminLayout><DataQualityPage /></AdminLayout>} />
        <Route path="/admin/course/:id" element={<AdminLayout><CourseDrilldownPage /></AdminLayout>} />
        <Route path="/admin/instructor/:id" element={<AdminLayout><InstructorDrilldownPage /></AdminLayout>} />
        <Route path="/course/:id" element={<AdminLayout><CourseDrilldownPage /></AdminLayout>} />
        <Route path="/instructor/:id" element={<AdminLayout><InstructorDrilldownPage /></AdminLayout>} />

        {/* Route không hợp lệ sẽ quay về login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
