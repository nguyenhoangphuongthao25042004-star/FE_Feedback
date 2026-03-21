export type DashboardScoreItem = { //định nghĩa kiểu cho 1 môn học trong dashboard
    subject: string
    score: number
    semester: 'Học kỳ 1' | 'Học kỳ 2'
}

export type DashboardData = { //định nghĩa kiểu cho dữ liệu tổng quan của sinh viên
    totalSubjects: number
    avgScore: number
    bestSubject: string
    difficultSubjects: number
    scores: DashboardScoreItem[]
}

export type StudyProfileItem = { //định nghĩa kiểu cho biểu đồ radar của hồ sơ học tập
    name: string
    value: number
}

export type RecommendationData = { //định nghĩa kiểu cho dữ liệu gợi ý môn học và giảng viên
    suitableSubjects: string
    needImprove: string[]
    suitableInstructors: string[]
}
