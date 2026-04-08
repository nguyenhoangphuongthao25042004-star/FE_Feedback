// Kiá»ƒu dá»¯ liá»‡u cho tá»«ng cá»™t Ä‘iá»ƒm mÃ´n há»c trÃªn dashboard
export type DashboardScoreItem = {
  subject: string
  score: number
  semester: 'Học kỳ 1' | 'Học kỳ 2'
}
// Dá»¯ liá»‡u tá»•ng quan dashboard sinh viÃªn
export type DashboardData = {
  totalSubjects: number
  avgScore: number
  bestSubject: string
  difficultSubjects: number
  scores: DashboardScoreItem[]
}

// Dá»¯ liá»‡u cho radar chart há»“ sÆ¡ há»c táº­p
export type StudyProfileItem = {
  name: string
  value: number
}

// Má»©c Æ°u tiÃªn cho gá»£i Ã½ há»c táº­p
export type RecommendationPriority = 'high' | 'medium' | 'low'

// Tráº¡ng thÃ¡i hoÃ n thÃ nh gá»£i Ã½
export type RecommendationStatus = 'pending' | 'in_progress' | 'done'

// Danh má»¥c gá»£i Ã½
export type RecommendationCategory = 'subject' | 'skill' | 'instructor' | 'study_method'

// Má»™t má»¥c gá»£i Ã½ há»c táº­p
export type RecommendationItem = {
  id: string
  title: string
  category: RecommendationCategory
  priority: RecommendationPriority
  description: string
  actionLabel: string
  status: RecommendationStatus
}

// Dá»¯ liá»‡u cho card gá»£i Ã½ há»c táº­p
export type RecommendationData = {
  suitableSubjects: string
  needImprove: string[]
  suitableInstructors: string[]
  items: RecommendationItem[]
}

// Option dÃ¹ng chung cho dropdown vÃ  radio
export type FeedbackMetadataOption = {
  label: string
  value: string
}

// Kiá»ƒu dá»¯ liá»‡u cho tá»«ng cÃ¢u há»i Likert
export type LikertQuestion = {
  key: string
  label: string
}

// ToÃ n bá»™ metadata cáº§n Ä‘á»ƒ dá»±ng form pháº£n há»“i
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
  materialsQualityOptions: FeedbackMetadataOption[]
  trainingEvaluationOptions: FeedbackMetadataOption[]
  likertScaleOptions: FeedbackMetadataOption[]
  likertQuestions: LikertQuestion[]
}

// Kiá»ƒu dá»¯ liá»‡u cho Ä‘Ã¡p Ã¡n cÃ¡c cÃ¢u há»i Likert
export type FeedbackLikertAnswers = Record<string, number>

// GiÃ¡ trá»‹ Ä‘áº§y Ä‘á»§ cá»§a form pháº£n há»“i
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
  materialsQuality: string
  trainingEvaluation: string
  studyTime: string
  learningPreference: string
  modePreference: string
  studyMode: string
  lecturerSupport: string
  mainDifficulty: string
  facilitiesOpenQuestion: string
  attentionCheck: boolean
  attendanceRate: string
  homeworkBeforeClass: string
  requirementLevel: string
}

// Payload gá»­i lÃªn khi lÆ°u nhÃ¡p hoáº·c submit
export type FeedbackSubmitPayload = FeedbackFormValues & {
  status: 'draft' | 'submitted'
}

// Kiá»ƒu dá»¯ liá»‡u cho danh sÃ¡ch mÃ´n há»c cá»§a sinh viÃªn
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

// Kiá»ƒu dá»¯ liá»‡u cho lá»‹ch sá»­ pháº£n há»“i
export type FeedbackHistoryItem = {
  id: string
  submittedAt: string
  subject: string
  instructor: string
  courseScore: number
  instructorScore: number
  status: string
}

// Tráº¡ng thÃ¡i pháº£n há»“i trÃªn mÃ n lá»‹ch sá»­ pháº£n há»“i
export type FeedbackHistoryStatus = 'submitted' | 'draft'

// Kiá»ƒu dá»¯ liá»‡u cho má»™t báº£n ghi lá»‹ch sá»­ pháº£n há»“i
export interface FeedbackHistory {
  id: string
  courseId?: string
  semester: string
  submittedAt: string
  subject: string
  instructor: string
  courseOverallScore: number
  instructorOverallScore: number
  status: FeedbackHistoryStatus
}

// Kiá»ƒu dá»¯ liá»‡u cho object lá»—i tráº£ tá»« API
export type ApiResponseErrorMap = Record<string, string>

// Kiá»ƒu response thÃ nh cÃ´ng dÃ¹ng chung
export type ApiSuccessResponse<T> = {
  success: true
  message: string
  data: T
}

// Kiá»ƒu response lá»—i dÃ¹ng chung
export type ApiErrorResponse = {
  success: false
  message: string
  errors?: ApiResponseErrorMap
}
