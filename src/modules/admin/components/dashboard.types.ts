export type SeverityLevel = 'low' | 'medium' | 'high'

export type DashboardKpi = {
  key: string
  title: string
  value: string
  trend: number
  trendLabel: string
}

export type AlertItem = {
  id: string
  title: string
  severity: SeverityLevel
  description: string
  type: 'low-qi-course' | 'decreasing-course' | 'low-confidence-instructor' | 'etl-issue'
}

export type RankingItem = {
  id: string
  label: string
  score: number
}

export type QITrendPoint = {
  semester: string
  qiAvg: number
}

export type HeatmapRow = {
  id: string
  course: string
  department: string
  instructor: string
  responseCount: number
  qi: number
  clarity: number
  pace: number
  fairness: number
  support: number
  interaction: number
}

export type RecommendationPreviewItem = {
  id: string
  title: string
  priority: 'P1' | 'P2' | 'P3'
  owner: string
}
