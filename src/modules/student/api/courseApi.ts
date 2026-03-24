import { useQuery } from '@tanstack/react-query'

import type { Course } from '../types/course'

type CourseApiResponse = {
  success: boolean
  message: string
  data: Course[]
}

type CourseQueryParams = {
  semester: string
  keyword: string
}

const COURSE_ENDPOINT = '/api/student/courses'

export const mockCourses: Course[] = [
  {
    id: 'SE104',
    semester: '2025-2026-HK2',
    subject: 'Xây dựng phần mềm web',
    instructor: 'Nguyễn Văn A',
    courseResult: 'pass',
    difficultyLevel: 'trung-binh',
    courseScore: 8.6,
    instructorScore: 4.5,
    feedbackStatus: 'dang-hoc'
  },
  {
    id: 'AI201',
    semester: '2025-2026-HK2',
    subject: 'AI cơ bản và ứng dụng',
    instructor: 'Trần Thị B',
    courseResult: 'pass',
    difficultyLevel: 'kho',
    courseScore: 7.8,
    instructorScore: 4.0,
    feedbackStatus: 'dang-hoc'
  },
  {
    id: 'MOB302',
    semester: '2025-2026-HK2',
    subject: 'Xây dựng phần mềm thiết bị di động',
    instructor: 'Lê Văn C',
    courseResult: 'fail',
    difficultyLevel: 'kho',
    courseScore: 4.8,
    instructorScore: 3.5,
    feedbackStatus: 'chua-phan-hoi'
  },
  {
    id: 'INT401',
    semester: '2025-2026-HK1',
    subject: 'Thực tập tốt nghiệp',
    instructor: 'Phạm Thị D',
    courseResult: 'pass',
    difficultyLevel: 'de',
    courseScore: 9.0,
    instructorScore: 4.8,
    feedbackStatus: 'da-phan-hoi'
  },
  {
    id: 'SE105',
    semester: '2025-2026-HK2',
    subject: 'Kiểm thử phần mềm',
    instructor: 'Ngô Minh Tâm',
    courseResult: 'pass',
    difficultyLevel: 'trung-binh',
    courseScore: 8.1,
    instructorScore: 4.2,
    feedbackStatus: 'da-phan-hoi'
  },
  {
    id: 'SE203',
    semester: '2025-2026-HK2',
    subject: 'Thiết kế hệ thống thông tin',
    instructor: 'Đặng Hải Long',
    courseResult: 'pass',
    difficultyLevel: 'kho',
    courseScore: 7.4,
    instructorScore: 3.9,
    feedbackStatus: 'dang-hoc'
  },
  {
    id: 'DB301',
    semester: '2025-2026-HK2',
    subject: 'Cơ sở dữ liệu nâng cao',
    instructor: 'Vũ Thu Hà',
    courseResult: 'pass',
    difficultyLevel: 'kho',
    courseScore: 7.0,
    instructorScore: 4.1,
    feedbackStatus: 'da-phan-hoi'
  },
  {
    id: 'NW220',
    semester: '2025-2026-HK2',
    subject: 'Mạng máy tính',
    instructor: 'Bùi Anh Khoa',
    courseResult: 'fail',
    difficultyLevel: 'kho',
    courseScore: 4.5,
    instructorScore: 3.2,
    feedbackStatus: 'chua-phan-hoi'
  },
  {
    id: 'UI330',
    semester: '2025-2026-HK2',
    subject: 'Thiết kế UI/UX',
    instructor: 'Nguyễn Hoài An',
    courseResult: 'pass',
    difficultyLevel: 'de',
    courseScore: 8.9,
    instructorScore: 4.7,
    feedbackStatus: 'da-phan-hoi'
  },
  {
    id: 'BA210',
    semester: '2025-2026-HK2',
    subject: 'Phân tích nghiệp vụ',
    instructor: 'Trịnh Quốc Nam',
    courseResult: 'pass',
    difficultyLevel: 'trung-binh',
    courseScore: 7.6,
    instructorScore: 4.0,
    feedbackStatus: 'chua-phan-hoi'
  },
  {
    id: 'ML402',
    semester: '2025-2026-HK2',
    subject: 'Học máy ứng dụng',
    instructor: 'Phan Minh Đức',
    courseResult: 'pass',
    difficultyLevel: 'kho',
    courseScore: 6.9,
    instructorScore: 4.3,
    feedbackStatus: 'da-phan-hoi'
  },
  {
    id: 'PR201',
    semester: '2025-2026-HK2',
    subject: 'Lập trình hướng đối tượng',
    instructor: 'Nguyễn Thanh Bình',
    courseResult: 'pass',
    difficultyLevel: 'trung-binh',
    courseScore: 8.0,
    instructorScore: 4.4,
    feedbackStatus: 'dang-hoc'
  },
  {
    id: 'SE201',
    semester: '2025-2026-HK1',
    subject: 'Kỹ nghệ phần mềm',
    instructor: 'Đỗ Quỳnh Như',
    courseResult: 'pass',
    difficultyLevel: 'kho',
    courseScore: 7.3,
    instructorScore: 4.1,
    feedbackStatus: 'da-phan-hoi'
  },
  {
    id: 'OS205',
    semester: '2025-2026-HK1',
    subject: 'Hệ điều hành',
    instructor: 'Lương Gia Huy',
    courseResult: 'fail',
    difficultyLevel: 'kho',
    courseScore: 4.2,
    instructorScore: 3.4,
    feedbackStatus: 'chua-phan-hoi'
  },
  {
    id: 'WEB101',
    semester: '2025-2026-HK1',
    subject: 'Nhập môn phát triển web',
    instructor: 'Mai Khánh Linh',
    courseResult: 'pass',
    difficultyLevel: 'de',
    courseScore: 9.2,
    instructorScore: 4.9,
    feedbackStatus: 'da-phan-hoi'
  },
  {
    id: 'PM300',
    semester: '2025-2026-HK1',
    subject: 'Quản lý dự án phần mềm',
    instructor: 'Đinh Công Vinh',
    courseResult: 'pass',
    difficultyLevel: 'trung-binh',
    courseScore: 8.3,
    instructorScore: 4.5,
    feedbackStatus: 'da-phan-hoi'
  },
  {
    id: 'DS150',
    semester: '2025-2026-HK1',
    subject: 'Cấu trúc dữ liệu và giải thuật',
    instructor: 'Võ Thị Ngọc',
    courseResult: 'pass',
    difficultyLevel: 'kho',
    courseScore: 6.8,
    instructorScore: 3.8,
    feedbackStatus: 'chua-phan-hoi'
  },
  {
    id: 'SEC310',
    semester: '2025-2026-HK1',
    subject: 'An toàn bảo mật thông tin',
    instructor: 'Trần Quang Phúc',
    courseResult: 'pass',
    difficultyLevel: 'kho',
    courseScore: 7.1,
    instructorScore: 4.0,
    feedbackStatus: 'da-phan-hoi'
  },
  {
    id: 'CLOUD410',
    semester: '2025-2026-HK1',
    subject: 'Điện toán đám mây',
    instructor: 'Nguyễn Hồng Nhung',
    courseResult: 'pass',
    difficultyLevel: 'trung-binh',
    courseScore: 8.4,
    instructorScore: 4.6,
    feedbackStatus: 'chua-phan-hoi'
  },
  {
    id: 'IOT320',
    semester: '2025-2026-HK1',
    subject: 'Internet vạn vật',
    instructor: 'Phạm Đức An',
    courseResult: 'fail',
    difficultyLevel: 'kho',
    courseScore: 4.9,
    instructorScore: 3.6,
    feedbackStatus: 'chua-phan-hoi'
  }
]

const wait = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms))

const filterCourses = (courses: Course[], { semester, keyword }: CourseQueryParams) => {
  const normalizedKeyword = keyword.trim().toLowerCase()

  return courses.filter((course) => {
    const matchSemester = semester === 'all' || course.semester === semester
    const matchKeyword =
      normalizedKeyword.length === 0
      || course.subject.toLowerCase().includes(normalizedKeyword)
      || course.instructor.toLowerCase().includes(normalizedKeyword)

    return matchSemester && matchKeyword
  })
}

const fetchStudentCourses = async (params: CourseQueryParams): Promise<Course[]> => {
  try {
    const query = new URLSearchParams({
      semester: params.semester,
      keyword: params.keyword
    })

    const response = await fetch(`${COURSE_ENDPOINT}?${query.toString()}`, {
      method: 'GET'
    })

    if (!response.ok) {
      throw new Error('Failed to fetch courses')
    }

    const payload = (await response.json()) as CourseApiResponse
    return filterCourses(payload.data, params)
  } catch {
    await wait(250)
    return filterCourses(mockCourses, params)
  }
}

export const useStudentCoursesQuery = (params: CourseQueryParams) => {
  return useQuery({
    queryKey: ['student-courses', params.semester, params.keyword],
    queryFn: () => fetchStudentCourses(params),
    staleTime: 60 * 1000
  })
}
