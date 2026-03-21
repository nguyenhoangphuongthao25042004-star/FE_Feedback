import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom' // các thành phần định tuyến của React Router
import LoginPage from '../modules/auth/pages/LoginPage' 
import DashboardPage from '../modules/student/pages/DashboardPage' 

export default function AppRoutes() {
  return (
    <BrowserRouter> {/* bọc toàn bộ hệ thống route */}
      <Routes> {/* nơi khai báo danh sách route */}
        <Route path="/" element={<Navigate to="/login" />} /> {/* vào trang gốc "/" thì chuyển hướng sang đăng nhập */}
        <Route path="/login" element={<LoginPage />} /> {/* route trang đăng nhập */}

        <Route path="/student/dashboard" element={<DashboardPage />} /> {/* route dashboard sinh viên */}
      </Routes>
    </BrowserRouter>
  )
}
