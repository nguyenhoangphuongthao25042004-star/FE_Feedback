import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from '../modules/auth/pages/LoginPage'

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* redirect về login */}
        <Route path="/" element={<Navigate to="/login" />} />

        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  )
}