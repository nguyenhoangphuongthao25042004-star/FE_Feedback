import { useQuery } from '@tanstack/react-query'

import type {
  ApiSuccessResponse,
  DashboardData,
  FeedbackHistory,
  FeedbackMetadata,
  FeedbackSubmitPayload,
  RecommendationData,
  StudyProfileItem
} from '../types/student.types'
import {
  baseStudentCourses,
  getStudentFeedbackHistory,
  getStudentFeedbackSubmissionByCourseId,
  upsertFeedbackSubmission
} from './feedbackData'

const wait = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms))

const slugify = (value: string) => value
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/đ/g, 'd')
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '')

export const getDashboard = async (): Promise<ApiSuccessResponse<DashboardData>> => {
  await wait(300)

  const scores: DashboardData['scores'] = [
    { subject: 'AI cơ bản và ứng dụng', score: 4, semester: 'Học kỳ 1' },
    { subject: 'Xây dựng phần mềm thiết bị di động', score: 3, semester: 'Học kỳ 1' },
    { subject: 'Xây dựng phần mềm web', score: 4.5, semester: 'Học kỳ 2' },
    { subject: 'Thực tập tốt nghiệp', score: 4.2, semester: 'Học kỳ 2' }
  ]

  const totalSubjects = scores.length
  const totalScore = scores.reduce((sum, item) => sum + item.score, 0)
  const avgScore = totalSubjects > 0 ? Number((totalScore / totalSubjects).toFixed(1)) : 0
  const bestSubject = scores.reduce((best, item) => (item.score > best.score ? item : best), scores[0]).subject
  const difficultSubjects = scores.filter((item) => item.score < 4).length

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

export const getStudyProfile = async (): Promise<ApiSuccessResponse<StudyProfileItem[]>> => {
  await wait(300)

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

export const getRecommendations = async (): Promise<ApiSuccessResponse<RecommendationData>> => {
  await wait(300)

  return {
    success: true,
    message: 'OK',
    data: {
      suitableSubjects: 'Xây dựng phần mềm web',
      needImprove: ['Xây dựng phần mềm thiết bị di động'],
      suitableInstructors: ['Giảng viên A'],
      items: [
        {
          id: 'REC-01',
          title: 'Ôn tập thêm môn Xây dựng phần mềm thiết bị di động',
          category: 'subject',
          priority: 'high',
          description: 'Điểm phản hồi của môn này đang thấp hơn các môn còn lại và cần được củng cố thêm.',
          actionLabel: 'Xem kế hoạch ôn tập',
          status: 'pending'
        },
        {
          id: 'REC-02',
          title: 'Ưu tiên chọn học với Giảng viên A',
          category: 'instructor',
          priority: 'medium',
          description: 'Kết quả phản hồi cho thấy phong cách giảng dạy phù hợp với xu hướng học tập của bạn.',
          actionLabel: 'Xem chi tiết',
          status: 'in_progress'
        },
        {
          id: 'REC-03',
          title: 'Tăng thời gian tự học mỗi tuần',
          category: 'study_method',
          priority: 'medium',
          description: 'Nên duy trì ít nhất 8 đến 10 giờ tự học mỗi tuần để cải thiện độ ổn định.',
          actionLabel: 'Đánh dấu đã xem',
          status: 'done'
        },
        {
          id: 'REC-04',
          title: 'Phát triển kỹ năng làm việc nhóm',
          category: 'skill',
          priority: 'low',
          description: 'Tham gia thêm các dự án nhóm để rèn luyện kỹ năng giao tiếp và hợp tác.',
          actionLabel: 'Tìm dự án',
          status: 'pending'
        }
      ]
    }
  }
}

export const getFeedbackFormMetadata = async (): Promise<ApiSuccessResponse<FeedbackMetadata>> => {
  await wait(500)

  const semesters = Array.from(new Set(baseStudentCourses.map((course) => course.semester)))
    .sort((left, right) => right.localeCompare(left))
    .map((semester) => ({
      label: semester === '2025-2026-HK2' ? '2025 - 2026 - Học kỳ 2' : '2025 - 2026 - Học kỳ 1',
      value: semester
    }))

  const subjects = Array.from(new Set(baseStudentCourses.map((course) => course.subject))).map((subject) => ({
    label: subject,
    value: slugify(subject)
  }))

  const instructors = Array.from(new Set(baseStudentCourses.map((course) => course.instructor))).map((instructor) => ({
    label: instructor,
    value: slugify(instructor)
  }))

  return {
    success: true,
    message: 'OK',
    data: {
      semesters,
      subjects,
      instructors,
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
      materialsQualityOptions: [
        { label: 'Rất tốt', value: 'rat-tot' },
        { label: 'Tốt', value: 'tot' },
        { label: 'Bình thường', value: 'binh-thuong' },
        { label: 'Cần cải thiện', value: 'can-cai-thien' },
        { label: 'Rất cần cải thiện', value: 'rat-can-cai-thien' }
      ],
      trainingEvaluationOptions: [
        { label: 'Rất hài lòng', value: 'rat-hai-long' },
        { label: 'Hài lòng', value: 'hai-long' },
        { label: 'Bình thường', value: 'binh-thuong' },
        { label: 'Không hài lòng', value: 'khong-hai-long' },
        { label: 'Rất không hài lòng', value: 'rat-khong-hai-long' }
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

export const submitFeedback = async (
  payload: FeedbackSubmitPayload & { courseId: string }
): Promise<ApiSuccessResponse<Record<string, never>>> => {
  await wait(600)
  upsertFeedbackSubmission(payload)

  return {
    success: true,
    message: payload.status === 'draft' ? 'Đã lưu nháp phản hồi thành công' : 'Đã gửi phản hồi thành công',
    data: {}
  }
}

export const getFeedbackHistory = async (): Promise<ApiSuccessResponse<FeedbackHistory[]>> => {
  try {
    const response = await fetch('/api/student/feedback-history', { method: 'GET' })

    if (!response.ok) {
      throw new Error('Failed to fetch feedback history')
    }

    return (await response.json()) as ApiSuccessResponse<FeedbackHistory[]>
  } catch {
    await wait(350)

    return {
      success: true,
      message: 'OK',
      data: getStudentFeedbackHistory()
    }
  }
}

export const useFeedbackHistoryQuery = () => {
  return useQuery({
    queryKey: ['student-feedback-history'],
    queryFn: getFeedbackHistory,
    staleTime: 60 * 1000
  })
}

export const getFeedbackSubmission = async (courseId: string): Promise<ApiSuccessResponse<FeedbackSubmitPayload | null>> => {
  try {
    // network path omitted in this demo; try to fetch from local storage fallback
    await wait(200)
    const submission = getStudentFeedbackSubmissionByCourseId(courseId)

    return {
      success: true,
      message: 'OK',
      data: submission ?? null
    }
  } catch {
    await wait(200)

    return {
      success: true,
      message: 'OK',
      data: getStudentFeedbackSubmissionByCourseId(courseId) ?? null
    }
  }
}

export const useFeedbackSubmissionQuery = (courseId?: string) => {
  return useQuery({
    queryKey: ['feedback-submission', courseId],
    queryFn: () => getFeedbackSubmission(courseId ?? ''),
    enabled: Boolean(courseId),
    staleTime: 60 * 1000
  })
}
