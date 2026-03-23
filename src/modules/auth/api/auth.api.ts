import type { LoginRequest, User } from '../types/auth.types'

// Kiểu response chung cho API đăng nhập giả
type ApiResponse<T> = {
  success: boolean
  message: string
  data: T
}

// API giả mô phỏng đăng nhập theo tài khoản mẫu
export const loginApi = async (data: LoginRequest): Promise<ApiResponse<User>> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (data.email === 'student@test.com' && data.password === '123456') {
        resolve({
          success: true,
          message: 'Đăng nhập thành công',
          data: {
            id: 1,
            name: 'Student A',
            role: 'student',
            token: 'fake-token'
          }
        })
      } else {
        reject({
          success: false,
          message: 'Nhập sai tài khoản hoặc mật khẩu'
        })
      }
    }, 1000)
  })
}
