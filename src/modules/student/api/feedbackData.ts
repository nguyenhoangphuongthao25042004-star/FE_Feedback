import dayjs from 'dayjs'

import type { Course } from '../types/course'
import type { FeedbackHistory, FeedbackLikertAnswers, FeedbackSubmitPayload } from '../types/student.types'

export const baseStudentCourses: Course[] = [
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
    feedbackStatus: 'chua-phan-hoi'
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
    feedbackStatus: 'chua-phan-hoi'
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

const historyDateByCourseId: Record<string, string> = {
  INT401: '2025-12-22',
  SE105: '2026-03-14',
  DB301: '2026-03-10',
  UI330: '2026-03-06',
  ML402: '2026-02-28',
  SE201: '2025-12-16',
  WEB101: '2025-12-09',
  PM300: '2025-12-05',
  SEC310: '2025-11-28'
}

type FeedbackWorkflowState = {
  courses: Course[]
  history: FeedbackHistory[]
  submissions?: Record<string, FeedbackSubmitPayload>
}

const STORAGE_KEY = 'smart-feedback-student-workflow-v4'
const instructorQuestionKeys = [
  'teachingClearly',
  'teachingPace',
  'gradingCriteria',
  'timelyResponse',
  'learningMotivation',
  'classInteraction',
  'chooseLecturerAgain'
]
const courseQuestionKeys = [
  'exerciseRelevance',
  'learningStyleMatch',
  'focusAbility',
  'passingConfidence'
]

const cloneCourses = () => baseStudentCourses.map((course) => ({ ...course }))

const calculateAverage = (answers: FeedbackLikertAnswers, keys: string[]) => {
  const values = keys
    .map((key) => answers[key])
    .filter((value): value is number => typeof value === 'number')

  if (values.length === 0) return 0

  const total = values.reduce((sum, value) => sum + value, 0)
  return Number((total / values.length).toFixed(1))
}

const createHistoryFromCourses = (courses: Course[]): FeedbackHistory[] => {
  return courses
    .filter((course) => course.feedbackStatus === 'da-phan-hoi')
    .map((course) => ({
      id: `FH-${course.id}`,
      courseId: course.id,
      semester: course.semester,
      submittedAt: historyDateByCourseId[course.id] ?? '2026-03-01',
      subject: course.subject,
      instructor: course.instructor,
      courseOverallScore: Number(Math.min(5, Math.max(1, course.instructorScore)).toFixed(1)),
      instructorOverallScore: Number(Math.min(5, Math.max(1, course.instructorScore)).toFixed(1)),
      status: 'submitted' as const
    }))
    .sort((left, right) => dayjs(right.submittedAt).valueOf() - dayjs(left.submittedAt).valueOf())
}

const createDefaultState = (): FeedbackWorkflowState => {
  const courses = cloneCourses()

  const history = createHistoryFromCourses(courses)

  // create default submission payloads for courses that are marked as 'da-phan-hoi'
  const submissions: Record<string, FeedbackSubmitPayload> = {}

  const createDefaultSubmission = (course: Course): FeedbackSubmitPayload => {
    const likertKeys = [...instructorQuestionKeys, ...courseQuestionKeys]
    const likertAnswers: FeedbackLikertAnswers = {}

    likertKeys.forEach((key) => {
      if (instructorQuestionKeys.includes(key)) {
        likertAnswers[key] = Math.max(1, Math.min(5, Math.round(course.instructorScore)))
      } else {
        // course score is on 0-10 in sample data; map to 1-5
        likertAnswers[key] = Math.max(1, Math.min(5, Math.round(course.courseScore / 2)))
      }
    })

    return {
      semester: course.semester,
      subject: course.subject,
      instructor: course.instructor,
      courseResult: course.courseResult ?? '',
      difficultyLevel: course.difficultyLevel ?? '',
      latestGpa: '',
      outstandingSubjects: '',
      selfStudyHours: '',
      likertAnswers,
      studyTime: '',
      learningPreference: '',
      modePreference: '',
      studyMode: '',
      lecturerSupport: '',
      mainDifficulty: '',
      attentionCheck: true,
      status: 'submitted',
      attendanceRate: '',
      homeworkBeforeClass: '',
      requirementLevel: ''
    }
  }

  courses.forEach((course) => {
    if (course.feedbackStatus === 'da-phan-hoi') {
      submissions[course.id] = createDefaultSubmission(course)
    }
  })

  return {
    courses,
    history,
    submissions
  }
}

const canUseStorage = () => typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'

const isValidState = (value: unknown): value is FeedbackWorkflowState => {
  if (!value || typeof value !== 'object') return false

  const candidate = value as FeedbackWorkflowState
  const submissionsOk = candidate.submissions === undefined || typeof candidate.submissions === 'object'
  return Array.isArray(candidate.courses) && Array.isArray(candidate.history) && submissionsOk
}

export const getFeedbackWorkflowState = (): FeedbackWorkflowState => {
  const fallback = createDefaultState()

  if (!canUseStorage()) return fallback

  try {
    const rawValue = window.localStorage.getItem(STORAGE_KEY)

    if (!rawValue) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(fallback))
      return fallback
    }

    const parsedValue = JSON.parse(rawValue) as unknown

    if (!isValidState(parsedValue)) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(fallback))
      return fallback
    }

    const candidate = parsedValue as FeedbackWorkflowState

    return {
      courses: candidate.courses.map((course) => ({ ...course })),
      history: candidate.history.map((item) => ({ ...item })),
      submissions: candidate.submissions ?? {}
    }
  } catch {
    return fallback
  }
}

const saveFeedbackWorkflowState = (state: FeedbackWorkflowState) => {
  if (!canUseStorage()) return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  window.dispatchEvent(new Event('student-feedback-workflow-updated'))
}

export const getStudentFeedbackCourses = () => getFeedbackWorkflowState().courses

export const getStudentFeedbackHistory = () => getFeedbackWorkflowState().history

export const getStudentFeedbackCourseById = (courseId: string) => {
  return getFeedbackWorkflowState().courses.find((course) => course.id === courseId)
}

export const getStudentFeedbackSubmissionByCourseId = (courseId: string) => {
  const state = getFeedbackWorkflowState()
  return state.submissions ? state.submissions[courseId] ?? null : null
}

export const upsertFeedbackSubmission = (payload: FeedbackSubmitPayload & { courseId: string }) => {
  const state = getFeedbackWorkflowState()
  const courseIndex = state.courses.findIndex((course) => course.id === payload.courseId)

  if (courseIndex === -1) {
    throw new Error('Không tìm thấy môn học để gửi phản hồi')
  }

  const currentCourse = state.courses[courseIndex]
  const nextStatus = payload.status === 'submitted' ? 'da-phan-hoi' : currentCourse.feedbackStatus
  const updatedCourse: Course = { ...currentCourse, feedbackStatus: nextStatus }
  const nextCourses = state.courses.map((course, index) => (index === courseIndex ? updatedCourse : course))
  const courseOverallScore = calculateAverage(payload.likertAnswers, courseQuestionKeys)
  const instructorOverallScore = calculateAverage(payload.likertAnswers, instructorQuestionKeys)
  const historyId = `FH-${payload.courseId}`
  const nextHistoryRecord: FeedbackHistory = {
    id: historyId,
    courseId: payload.courseId,
    semester: currentCourse.semester,
    submittedAt: dayjs().format('YYYY-MM-DD'),
    subject: currentCourse.subject,
    instructor: currentCourse.instructor,
    courseOverallScore,
    instructorOverallScore,
    status: payload.status
  }

  const remainingHistory = state.history.filter((item) => item.id !== historyId)
  const nextHistory = [nextHistoryRecord, ...remainingHistory].sort(
    (left, right) => dayjs(right.submittedAt).valueOf() - dayjs(left.submittedAt).valueOf()
  )
  const nextState = {
    courses: nextCourses,
    history: nextHistory
    ,
    submissions: {
      ...(state.submissions ?? {}),
      [payload.courseId]: payload
    }
  }

  saveFeedbackWorkflowState(nextState)

  return {
    course: updatedCourse,
    history: nextHistoryRecord
  }
}
