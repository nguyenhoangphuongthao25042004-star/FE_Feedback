import type { LoginRequest, User } from '../../auth/types/auth.types'

type ApiResponse<T> = {
  success: boolean
  message: string
  data: T
}

export const loginInstructorApi = async (
  data: LoginRequest
): Promise<ApiResponse<User>> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (data.email === 'instructor@test.com' && data.password === '654321') {
        resolve({
          success: true,
          message: 'Đăng nhập thành công',
          data: {
            id: 2,
            name: 'Instructor A',
            role: 'instructor',
            token: 'fake-instructor-token'
          }
        })
      } else {
        reject({
          success: false,
          message: 'Tài khoản giảng viên hoặc mật khẩu không đúng'
        })
      }
    }, 1000)
  })
}
