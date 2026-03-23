import type {
  ApiSuccessResponse,
  DashboardData,
  FeedbackMetadata,
  FeedbackSubmitPayload,
  RecommendationData,
  StudyProfileItem
} from '../types/student.types'

// File này chỉ trả dữ liệu mẫu để frontend hiển thị giao diện và kiểm tra luồng thao tác
const wait = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms)) // giả lập thời gian chờ như đang gọi API thật

// Lấy dữ liệu tổng quan cho dashboard sinh viên
export const getDashboard = async (): Promise<ApiSuccessResponse<DashboardData>> => {
  await wait(300) // chờ một chút để mô phỏng trạng thái loading

  // Danh sách môn học mẫu theo từng học kỳ
  const scores: DashboardData['scores'] = [
    { subject: 'AI cơ bản và ứng dụng', score: 4, semester: 'Học kỳ 1' },
    { subject: 'Xây dựng phần mềm thiết bị di động', score: 3, semester: 'Học kỳ 1' },
    { subject: 'Xây dựng phần mềm web', score: 4.5, semester: 'Học kỳ 2' },
    { subject: 'Thực tập tốt nghiệp', score: 4.2, semester: 'Học kỳ 2' }
  ]

  const totalSubjects = scores.length // đếm tổng số môn trong dữ liệu mẫu
  const totalScore = scores.reduce((sum, item) => sum + item.score, 0) // cộng toàn bộ điểm để tính trung bình
  const avgScore = totalSubjects > 0 ? Number((totalScore / totalSubjects).toFixed(1)) : 0 // tính điểm trung bình và làm tròn 1 chữ số
  const bestSubject = scores.reduce((best, item) => (item.score > best.score ? item : best), scores[0]).subject // tìm môn có điểm cao nhất
  const difficultSubjects = scores.filter((item) => item.score < 4).length // đếm số môn đang ở mức cần chú ý

  return {
    success: true,
    message: 'OK',
    data: {
      totalSubjects,
      avgScore,
      bestSubject,
      difficultSubjects,
      scores
    }
  }
}

// Lấy dữ liệu hồ sơ học tập để vẽ radar chart
export const getStudyProfile = async (): Promise<ApiSuccessResponse<StudyProfileItem[]>> => {
  await wait(300) // mô phỏng thời gian phản hồi của API

  return {
    success: true,
    message: 'OK',
    data: [
      { name: 'Lý thuyết', value: 70 },
      { name: 'Thực hành', value: 80 },
      { name: 'Tự học', value: 90 }
    ]
  }
}

// Lấy dữ liệu gợi ý học tập mẫu để hiển thị insight card
export const getRecommendations = async (): Promise<ApiSuccessResponse<RecommendationData>> => {
  await wait(300) // mô phỏng gọi API thật

  return {
    success: true,
    message: 'OK',
    data: {
      suitableSubjects: 'Xây dựng phần mềm web',
      needImprove: ['Xây dựng phần mềm thiết bị di động'],
      suitableInstructors: ['Giảng viên A']
    }
  }
}

// Lấy metadata để dựng các dropdown, radio và câu hỏi cho form phản hồi
export const getFeedbackFormMetadata = async (): Promise<ApiSuccessResponse<FeedbackMetadata>> => {
  await wait(500) // chờ lâu hơn một chút để dễ nhìn thấy loading state

  return {
    success: true,
    message: 'OK',
    data: {
      semesters: [
        { label: '2025 - 2026 - Học kỳ 2', value: '2025-2026-HK2' },
        { label: '2025 - 2026 - Học kỳ 1', value: '2025-2026-HK1' }
      ],
      subjects: [
        { label: 'AI cơ bản và ứng dụng', value: 'ai-co-ban-va-ung-dung' },
        { label: 'Xây dựng phần mềm thiết bị di động', value: 'xay-dung-phan-mem-thiet-bi-di-dong' },
        { label: 'Xây dựng phần mềm web', value: 'xay-dung-phan-mem-web' },
        { label: 'Thực tập tốt nghiệp', value: 'thuc-tap-tot-nghiep' }
      ],
      instructors: [
        { label: 'Giảng viên A', value: 'giang-vien-a' },
        { label: 'Giảng viên B', value: 'giang-vien-b' },
        { label: 'Giảng viên C', value: 'giang-vien-c' }
      ],
      courseResults: [
        { label: 'Dự kiến dưới 5', value: 'duoi-5' },
        { label: 'Dự kiến từ 5 đến dưới 7', value: 'tu-5-den-duoi-7' },
        { label: 'Dự kiến từ 7 đến dưới 8.5', value: 'tu-7-den-duoi-8-5' },
        { label: 'Dự kiến từ 8.5 trở lên', value: 'tu-8-5-tro-len' }
      ],
      difficultyLevels: [
        { label: 'Dễ', value: 'de' },
        { label: 'Trung bình', value: 'trung-binh' },
        { label: 'Khó', value: 'kho' },
        { label: 'Rất khó', value: 'rat-kho' }
      ],
      gpaOptions: [
        { label: 'Dưới 2.0', value: 'duoi-2-0' },
        { label: 'Từ 2.0 đến dưới 2.5', value: 'tu-2-0-den-duoi-2-5' },
        { label: 'Từ 2.5 đến dưới 3.2', value: 'tu-2-5-den-duoi-3-2' },
        { label: 'Từ 3.2 trở lên', value: 'tu-3-2-tro-len' }
      ],
      outstandingSubjectsOptions: [
        { label: '0 môn nợ', value: '0' },
        { label: '1 môn nợ', value: '1' },
        { label: '2 môn nợ', value: '2' },
        { label: 'Từ 3 môn nợ trở lên', value: '3-plus' }
      ],
      selfStudyHourOptions: [
        { label: 'Dưới 5 giờ / tuần', value: 'duoi-5-gio' },
        { label: 'Từ 5 đến 10 giờ / tuần', value: 'tu-5-den-10-gio' },
        { label: 'Từ 11 đến 15 giờ / tuần', value: 'tu-11-den-15-gio' },
        { label: 'Trên 15 giờ / tuần', value: 'tren-15-gio' }
      ],
      studyTimeOptions: [
        { label: 'Buổi sáng', value: 'sang' },
        { label: 'Buổi chiều', value: 'chieu' },
        { label: 'Buổi tối', value: 'toi' }
      ],
      learningPreferenceOptions: [
        { label: 'Thiên về lý thuyết', value: 'ly-thuyet' },
        { label: 'Thiên về thực hành', value: 'thuc-hanh' },
        { label: 'Cân bằng cả hai', value: 'can-bang' }
      ],
      modePreferenceOptions: [
        { label: 'Học trực tiếp', value: 'truc-tiep' },
        { label: 'Học online', value: 'online' },
        { label: 'Kết hợp cả hai', value: 'ca-hai' }
      ],
      studyModeOptions: [
        { label: 'Học một mình', value: 'hoc-mot-minh' },
        { label: 'Học nhóm', value: 'hoc-nhom' }
      ],
      attentionCheckOptions: [
        { label: 'Tôi đã đọc kỹ câu hỏi', value: 'da-doc-ky' },
        { label: 'Tôi chưa đọc kỹ câu hỏi', value: 'chua-doc-ky' }
      ],
      attendanceRateOptions: [
        { label: 'Dưới 50%', value: 'duoi-50' },
        { label: 'Từ 50% đến dưới 70%', value: 'tu-50-den-duoi-70' },
        { label: 'Từ 70% đến dưới 90%', value: 'tu-70-den-duoi-90' },
        { label: 'Từ 90% trở lên', value: 'tu-90-tro-len' }
      ],
      homeworkOptions: [
        { label: 'Thường xuyên', value: 'thuong-xuyen' },
        { label: 'Thỉnh thoảng', value: 'thinh-thoang' },
        { label: 'Hiếm khi', value: 'hiem-khi' }
      ],
      requirementLevelOptions: [
        { label: 'Yêu cầu nhiều', value: 'nhieu' },
        { label: 'Yêu cầu ở mức vừa phải', value: 'vua-phai' },
        { label: 'Yêu cầu ít', value: 'it' }
      ],
      likertScaleOptions: [
        { label: '1', value: '1' },
        { label: '2', value: '2' },
        { label: '3', value: '3' },
        { label: '4', value: '4' },
        { label: '5', value: '5' }
      ],
      likertQuestions: [
        { key: 'teachingClearly', label: 'Giảng viên giảng rõ ràng' },
        { key: 'teachingPace', label: 'Tốc độ giảng phù hợp' },
        { key: 'exerciseRelevance', label: 'Ví dụ / bài tập bám sát nội dung' },
        { key: 'gradingCriteria', label: 'Tiêu chí chấm điểm rõ ràng' },
        { key: 'timelyResponse', label: 'Phản hồi thắc mắc kịp thời' },
        { key: 'learningMotivation', label: 'Tạo động lực học tập' },
        { key: 'classInteraction', label: 'Tương tác lớp tốt' },
        { key: 'learningStyleMatch', label: 'Phù hợp phong cách học tập' },
        { key: 'focusAbility', label: 'Dễ tập trung' },
        { key: 'passingConfidence', label: 'Tự tin qua môn' },
        { key: 'chooseLecturerAgain', label: 'Tiếp tục chọn giảng viên này' }
      ]
    }
  }
}

// Giả lập hành động lưu nháp hoặc gửi phản hồi thành công
export const submitFeedback = async (
  payload: FeedbackSubmitPayload
): Promise<ApiSuccessResponse<Record<string, never>>> => {
  await wait(600) // mô phỏng độ trễ của API submit

  return {
    success: true,
    message: payload.status === 'draft' ? 'Đã lưu nháp phản hồi thành công' : 'Đã gửi phản hồi thành công',
    data: {}
  }
}
