export type CourseDetailStatus = 'dang-hoc' | 'da-phan-hoi' | 'chua-phan-hoi'
export type CourseDetailDifficulty = 'de' | 'trung-binh' | 'kho'

export interface CourseDetailHeader {
  courseId: string
  subjectName: string
  semester: string
  instructor: string
  status: CourseDetailStatus
}

export interface CourseDetailKpis {
  overallCourseScore: number
  instructorScore: number
  difficultyLevel: CourseDetailDifficulty
  learningStyleFitPercent: number
}

export interface CourseQualityRadarItem {
  metric: string
  score: number
  fullMark: number
}

export interface InstructorFactorBarItem {
  factor: string
  score: number
}

export interface CourseInsight {
  strengths: string[]
  limitations: string[]
  suggestions: string[]
}

export interface CourseDetailData {
  header: CourseDetailHeader
  kpis: CourseDetailKpis
  qualityRadar: CourseQualityRadarItem[]
  instructorBars: InstructorFactorBarItem[]
  insight: CourseInsight
}
