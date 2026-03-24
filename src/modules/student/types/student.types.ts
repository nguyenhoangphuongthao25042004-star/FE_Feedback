// Kiểu dữ liệu cho từng cột điểm môn học trên dashboard
export type DashboardScoreItem = {
  subject: string
  score: number
  semester: 'Học kỳ 1' | 'Học kỳ 2'
}

// Dữ liệu tổng quan dashboard sinh viên
export type DashboardData = {
  totalSubjects: number
  avgScore: number
  bestSubject: string
  difficultSubjects: number
  scores: DashboardScoreItem[]
}

// Dữ liệu cho radar chart hồ sơ học tập
export type StudyProfileItem = {
  name: string
  value: number
}

// Mức ưu tiên cho gợi ý học tập
export type RecommendationPriority = 'high' | 'medium' | 'low'

// Trạng thái hoàn thành gợi ý
export type RecommendationStatus = 'pending' | 'in_progress' | 'done'

// Danh mục gợi ý
export type RecommendationCategory = 'subject' | 'skill' | 'instructor' | 'study_method'

// Một mục gợi ý học tập
export type RecommendationItem = {
  id: string
  title: string
  category: RecommendationCategory
  priority: RecommendationPriority
  description: string
  actionLabel: string
  status: RecommendationStatus
}

// Dữ liệu cho card gợi ý học tập
export type RecommendationData = {
  suitableSubjects: string
  needImprove: string[]
  suitableInstructors: string[]
  items: RecommendationItem[]
}

// Option dùng chung cho dropdown và radio
export type FeedbackMetadataOption = {
  label: string
  value: string
}

// Kiểu dữ liệu cho từng câu hỏi Likert
export type LikertQuestion = {
  key: string
  label: string
}

// Toàn bộ metadata cần để dựng form phản hồi
export type FeedbackMetadata = {
  semesters: FeedbackMetadataOption[]
  subjects: FeedbackMetadataOption[]
  instructors: FeedbackMetadataOption[]
  courseResults: FeedbackMetadataOption[]
  difficultyLevels: FeedbackMetadataOption[]
  gpaOptions: FeedbackMetadataOption[]
  outstandingSubjectsOptions: FeedbackMetadataOption[]
  selfStudyHourOptions: FeedbackMetadataOption[]
  studyTimeOptions: FeedbackMetadataOption[]
  learningPreferenceOptions: FeedbackMetadataOption[]
  modePreferenceOptions: FeedbackMetadataOption[]
  studyModeOptions: FeedbackMetadataOption[]
  attentionCheckOptions: FeedbackMetadataOption[]
  attendanceRateOptions: FeedbackMetadataOption[]
  homeworkOptions: FeedbackMetadataOption[]
  requirementLevelOptions: FeedbackMetadataOption[]
  likertScaleOptions: FeedbackMetadataOption[]
  likertQuestions: LikertQuestion[]
}

// Kiểu dữ liệu cho đáp án các câu hỏi Likert
export type FeedbackLikertAnswers = Record<string, number>

// Giá trị đầy đủ của form phản hồi
export type FeedbackFormValues = {
  semester: string
  subject: string
  instructor: string
  courseResult: string
  difficultyLevel: string
  latestGpa: string
  outstandingSubjects: string
  selfStudyHours: string
  likertAnswers: FeedbackLikertAnswers
  studyTime: string
  learningPreference: string
  modePreference: string
  studyMode: string
  lecturerSupport: string
  mainDifficulty: string
  attentionCheck: boolean
  attendanceRate: string
  homeworkBeforeClass: string
  requirementLevel: string
}

// Payload gửi lên khi lưu nháp hoặc submit
export type FeedbackSubmitPayload = FeedbackFormValues & {
  status: 'draft' | 'submitted'
}

// Kiểu dữ liệu cho danh sách môn học của sinh viên
export type StudentCourseItem = {
  id: string
  subject: string
  instructor: string
  semester: string
  courseResult: string
  difficultyLevel: string
  courseScore: number
  instructorScore: number
  status: string
}

// Kiểu dữ liệu cho lịch sử phản hồi
export type FeedbackHistoryItem = {
  id: string
  submittedAt: string
  subject: string
  instructor: string
  courseScore: number
  instructorScore: number
  status: string
}

// Trạng thái phản hồi trên màn lịch sử phản hồi
export type FeedbackHistoryStatus = 'submitted' | 'draft'

// Kiểu dữ liệu cho một bản ghi lịch sử phản hồi
export interface FeedbackHistory {
  id: string
  semester: string
  submittedAt: string
  subject: string
  instructor: string
  courseOverallScore: number
  instructorOverallScore: number
  status: FeedbackHistoryStatus
}

// Kiểu dữ liệu cho object lỗi trả từ API
export type ApiResponseErrorMap = Record<string, string>

// Kiểu response thành công dùng chung
export type ApiSuccessResponse<T> = {
  success: true
  message: string
  data: T
}

// Kiểu response lỗi dùng chung
export type ApiErrorResponse = {
  success: false
  message: string
  errors?: ApiResponseErrorMap
}
