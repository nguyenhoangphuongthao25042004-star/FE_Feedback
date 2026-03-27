import { useQuery } from '@tanstack/react-query'

import type { Course } from '../types/course'
import { getStudentFeedbackCourses } from './feedbackData'

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
    return filterCourses(getStudentFeedbackCourses(), params)
  }
}

export const useStudentCoursesQuery = (params: CourseQueryParams) => {
  return useQuery({
    queryKey: ['student-courses', params.semester, params.keyword],
    queryFn: () => fetchStudentCourses(params),
    staleTime: 60 * 1000
  })
}
