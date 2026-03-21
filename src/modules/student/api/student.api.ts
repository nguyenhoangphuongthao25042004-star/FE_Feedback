//Dữ liệu giả cho API sinh viên
import type { DashboardData, RecommendationData, StudyProfileItem } from '../types/student.types' //import type là để import kiểu TypeScript không phải giá trị thật

export const getDashboard = async (): Promise<DashboardData> => {
    const scores: DashboardData['scores'] = [ //mảng dl điểm của các môn học qua các học kỳ
        { subject: 'AI cơ bản và ứng dụng', score: 4, semester: 'Học kỳ 1' },
        { subject: 'Xây dựng phần mềm thiết bị di động', score: 3, semester: 'Học kỳ 1' },
        { subject: 'Xây dựng phần mềm web', score: 4.5, semester: 'Học kỳ 2' },
        { subject: 'Thực tập tốt nghiệp', score: 4.2, semester: 'Học kỳ 2' }
    ]

    const totalSubjects = scores.length 
    const totalScore = scores.reduce((sum, item) => sum + item.score, 0) //tính tổng điểm của tất cả môn học bằng cách sử dụng reduce để cộng dồn điểm của từng môn vào biến sum, bắt đầu từ 0
    const avgScore = totalSubjects > 0 ? Number((totalScore / totalSubjects).toFixed(1)) : 0 
    const bestSubject = scores.reduce((best, item) => item.score > best.score ? item : best, scores[0]).subject //reduce so sánh điểm của từng môn học với môn học có điểm cao nhất hiện tại
    const difficultSubjects = scores.filter((item) => item.score < 4).length

    return { //trả về object
        totalSubjects,
        avgScore,
        bestSubject,
        difficultSubjects,
        scores
    }
}

export const getStudyProfile = async (): Promise<StudyProfileItem[]> => ([ //dl cho biểu đồ radar
    { name: 'Lý thuyết', value: 70 },
    { name: 'Thực hành', value: 80 },
    { name: 'Tự học', value: 90 }
])

export const getRecommendations = async (): Promise<RecommendationData> => ({ //dl cho gợi ý
    suitableSubjects: 'Xây dựng phần mềm web',
    needImprove: ['Xây dựng phần mềm thiết bị di động'],
    suitableInstructors: ['Giảng viên A']
})
