export type CourseResult = 'pass' | 'fail'
export type CourseDifficulty = 'de' | 'trung-binh' | 'kho'
export type FeedbackStatus = 'da-phan-hoi' | 'chua-phan-hoi' | 'dang-hoc'

export interface Course {
  id: string
  semester: string
  subject: string
  instructor: string
  courseResult: CourseResult
  difficultyLevel: CourseDifficulty
  courseScore: number
  instructorScore: number
  feedbackStatus: FeedbackStatus
}
