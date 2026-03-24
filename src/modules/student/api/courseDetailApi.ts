import { useQuery } from '@tanstack/react-query'

import type { CourseDetailData } from '../types/courseDetail'

type CourseDetailApiResponse = {
  success: boolean
  message: string
  data: CourseDetailData
}

const wait = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms))

const mockCourseDetails: Record<string, CourseDetailData> = {
  SE104: {
    header: {
      courseId: 'SE104',
      subjectName: 'Xây dựng phần mềm web',
      semester: '2025-2026-HK2',
      instructor: 'Nguyễn Văn A',
      status: 'dang-hoc'
    },
    kpis: {
      overallCourseScore: 8.6,
      instructorScore: 4.5,
      difficultyLevel: 'trung-binh',
      learningStyleFitPercent: 84
    },
    qualityRadar: [
      { metric: 'Nội dung', score: 86, fullMark: 100 },
      { metric: 'Tài liệu', score: 80, fullMark: 100 },
      { metric: 'Thực hành', score: 90, fullMark: 100 },
      { metric: 'Kiểm tra', score: 78, fullMark: 100 },
      { metric: 'Tương tác', score: 85, fullMark: 100 },
      { metric: 'Hỗ trợ', score: 88, fullMark: 100 }
    ],
    instructorBars: [
      { factor: 'Truyền đạt', score: 4.6 },
      { factor: 'Giải đáp', score: 4.5 },
      { factor: 'Phản hồi', score: 4.4 },
      { factor: 'Công bằng', score: 4.3 },
      { factor: 'Đồng hành', score: 4.7 }
    ],
    insight: {
      strengths: [
        'Nội dung cập nhật, sát với bài toán thực tế.',
        'Thực hành nhiều, dễ ứng dụng vào đồ án môn học.'
      ],
      limitations: [
        'Khối lượng bài tập cuối kỳ khá lớn.',
        'Phần tài liệu tham khảo cần được bố trí rõ hơn.'
      ],
      suggestions: [
        'Nên học theo sprint từng tuần để giảm áp lực cuối kỳ.',
        'Tập trung thực hành React Query và tối ưu hiệu năng web.'
      ]
    }
  },
  AI201: {
    header: {
      courseId: 'AI201',
      subjectName: 'AI cơ bản và ứng dụng',
      semester: '2025-2026-HK2',
      instructor: 'Trần Thị B',
      status: 'dang-hoc'
    },
    kpis: {
      overallCourseScore: 7.8,
      instructorScore: 4.0,
      difficultyLevel: 'kho',
      learningStyleFitPercent: 72
    },
    qualityRadar: [
      { metric: 'Nội dung', score: 82, fullMark: 100 },
      { metric: 'Tài liệu', score: 70, fullMark: 100 },
      { metric: 'Thực hành', score: 68, fullMark: 100 },
      { metric: 'Kiểm tra', score: 75, fullMark: 100 },
      { metric: 'Tương tác', score: 73, fullMark: 100 },
      { metric: 'Hỗ trợ', score: 74, fullMark: 100 }
    ],
    instructorBars: [
      { factor: 'Truyền đạt', score: 4.1 },
      { factor: 'Giải đáp', score: 3.8 },
      { factor: 'Phản hồi', score: 4.0 },
      { factor: 'Công bằng', score: 4.2 },
      { factor: 'Đồng hành', score: 3.9 }
    ],
    insight: {
      strengths: [
        'Giới thiệu nhiều case study gắn với doanh nghiệp.',
        'Giảng viên có cách truyền đạt logic và rõ ràng.'
      ],
      limitations: [
        'Một số nội dung toán học nên cần thêm tài liệu bổ trợ.',
        'Nhịp độ bài giảng nhanh với sinh viên mới bắt đầu AI.'
      ],
      suggestions: [
        'Ôn lại xác suất thống kê trước mỗi buổi học AI.',
        'Làm thêm mini project để hiểu rõ pipeline mô hình.'
      ]
    }
  }
}

const getFallbackDetail = (courseId: string): CourseDetailData => {
  const normalizedId = courseId.toUpperCase()

  if (mockCourseDetails[normalizedId]) {
    return mockCourseDetails[normalizedId]
  }

  return {
    ...mockCourseDetails.SE104,
    header: {
      ...mockCourseDetails.SE104.header,
      courseId: normalizedId,
      subjectName: `Môn học ${normalizedId}`
    }
  }
}

const fetchCourseDetail = async (courseId: string): Promise<CourseDetailData> => {
  try {
    const response = await fetch(`/api/student/course/${courseId}`, { method: 'GET' })

    if (!response.ok) {
      throw new Error('Failed to fetch course detail')
    }

    const payload = (await response.json()) as CourseDetailApiResponse
    return payload.data
  } catch {
    await wait(300)
    return getFallbackDetail(courseId)
  }
}

export const useStudentCourseDetailQuery = (courseId: string) => {
  return useQuery({
    queryKey: ['student-course-detail', courseId],
    queryFn: () => fetchCourseDetail(courseId),
    enabled: courseId.length > 0,
    staleTime: 60 * 1000
  })
}
