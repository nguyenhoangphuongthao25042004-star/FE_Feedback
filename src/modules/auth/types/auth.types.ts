// Kiểu dữ liệu cho request đăng nhập
export type LoginRequest = {
  email: string
  password: string
}

// Kiểu dữ liệu người dùng sau khi đăng nhập thành công
export type User = {
  id: number
  name: string
  role: 'student' | 'instructor' | 'admin'
  token: string
}
