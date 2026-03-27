import { useEffect } from 'react'
import { Button, Form, Row, Col, Input } from 'antd'
import { useNavigate, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useFeedbackHistoryQuery } from '../api/student.api'
import { ArrowLeftOutlined } from '@ant-design/icons'

import PageHeader from '../../../components/layout/PageHeader'
import SurveySectionCard from '../../../components/forms/SurveySectionCard'
import DropdownField from '../../../components/forms/DropdownField'
import RadioGroupField from '../../../components/forms/RadioGroupField'
import TextAreaField from '../../../components/forms/TextAreaField'
import LikertQuestion from '../../../components/forms/LikertQuestion'
import LoadingSpinner from '../../../components/utility/LoadingSpinner'
import EmptyState from '../../../components/utility/EmptyState'
import { useStudentCoursesQuery } from '../api/courseApi'
import { getFeedbackFormMetadata, getFeedbackSubmission } from '../api/student.api'
import type { FeedbackFormValues } from '../types/student.types'

const cardStyle = {
  background: '#fff',
  borderRadius: 20,
  padding: 24,
  border: '1px solid #D7E1F0'
} as const

export default function FeedbackHistoryDetailPage() {
  const { courseId } = useParams()
  const navigate = useNavigate()
  const [form] = Form.useForm<FeedbackFormValues>()

  const metadataQuery = useQuery({ queryKey: ['feedback-form-metadata'], queryFn: getFeedbackFormMetadata })
  const coursesQuery = useStudentCoursesQuery({ semester: 'all', keyword: '' })
  const submissionQuery = useQuery({ queryKey: ['feedback-submission', courseId], queryFn: () => getFeedbackSubmission(courseId ?? ''), enabled: Boolean(courseId) })

  const metadata = metadataQuery.data?.data
  const submission = submissionQuery.data?.data
  const historyQuery = useFeedbackHistoryQuery()
  // dữ liệu lịch sử sẽ được đọc trong effect để tránh phải thay đổi dependency array
  const histExists = Boolean(historyQuery.data?.data?.some((h) => h.courseId === courseId))

  useEffect(() => {
  // Nếu có payload phản hồi đầy đủ, ưu tiên dùng nó
    if (submission) {
      const course = coursesQuery.data?.find((c) => c.id === courseId)
      form.resetFields()
      const values = { ...submission }

      if (course) {
        values.semester = course.semester
        values.subject = course.subject
        values.instructor = course.instructor
      }

      form.setFieldsValue(values)
      return
    }

  // Phương án dự phòng: nếu có bản ghi lịch sử, điền các trường cố định và hiển thị form chỉ đọc cho các thông tin còn thiếu
    const histList = historyQuery.data?.data ?? []
    const hist = histList.find((h) => h.courseId === courseId)

    if (hist) {
      const course = coursesQuery.data?.find((c) => c.id === courseId)
      form.resetFields()
      form.setFieldsValue({
        semester: course?.semester ?? hist.semester,
        subject: course?.subject ?? hist.subject,
        instructor: course?.instructor ?? hist.instructor
      })
    }
  }, [submission, historyQuery.data, coursesQuery.data, courseId, form])

  if (metadataQuery.isLoading || coursesQuery.isLoading || submissionQuery.isLoading) {
    return <LoadingSpinner />
  }

  if (!metadata) {
    return <EmptyState description="Chưa có metadata cho biểu mẫu" />
  }

  if (!submission) {
    if (!histExists) {
      return (
        <EmptyState
          title="Không tìm thấy phản hồi"
          description="Không tìm thấy dữ liệu phản hồi cho môn này"
          action={<Button onClick={() => navigate('/student/history')}>Quay lại lịch sử</Button>}
        />
      )
    }
  }

  // Ưu tiên dùng định nghĩa môn học (từ coursesQuery) khi có — tránh hiển thị học kỳ trống
  // khi form chưa được điền đầy đủ (ví dụ các trường hợp dự phòng).
    const course = coursesQuery.data?.find((c) => c.id === courseId)
    const rawSemesterValue = course?.semester ?? form.getFieldValue('semester') ?? ''
    const semesterDisplayValue = metadata.semesters.find((option) => option.value === rawSemesterValue)?.label ?? rawSemesterValue

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
  {/* thẻ header (tĩnh) */}
      <div style={cardStyle}>
        <div className="feedback-detail-header">
          <style>{`.feedback-detail-header .ant-typography + .ant-typography { margin-top: 8px; }`}</style>
          <PageHeader
            title="Chi tiết phản hồi"
            description="Xem lại phản hồi bạn đã gửi (chỉ xem)."
            prefix={(
              <Button
                icon={<ArrowLeftOutlined />}
                onClick={() => navigate('/student/history')}
                shape="circle"
                size="large"
                style={{ borderRadius: 999, width: 44, height: 44, minWidth: 44 }}
              />
            )}
          />
        </div>
      </div>

  {/* làm khu vực form có thể cuộn trong khi giữ header cố định */}
      <div style={{ maxHeight: 'calc(100vh - 240px)', overflow: 'auto', paddingRight: 8 }}>
        <Form form={form} layout="vertical" initialValues={{}} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          <SurveySectionCard title="Thông tin chung" description="Thông tin môn học và giảng viên">
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <Form.Item name="semester" hidden>
                  <input />
                </Form.Item>
                <Form.Item label="Học kỳ">
                  <Input value={semesterDisplayValue ?? ''} readOnly size="large" style={{ borderRadius: 24 }} />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item name="subject" label="Môn học">
                  <Input value={form.getFieldValue('subject') ?? ''} readOnly size="large" style={{ borderRadius: 24 }} />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item name="instructor" label="Giảng viên">
                  <Input value={form.getFieldValue('instructor') ?? ''} readOnly size="large" style={{ borderRadius: 24 }} />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}><DropdownField name="courseResult" label="Kết quả môn học" options={metadata.courseResults} required disabled /></Col>
              <Col xs={24} md={12}><DropdownField name="difficultyLevel" label="Mức độ khó môn" options={metadata.difficultyLevels} required disabled /></Col>
              <Col xs={24} md={12}><DropdownField name="latestGpa" label="GPA gần nhất" options={metadata.gpaOptions} required disabled /></Col>
              <Col xs={24} md={12}><DropdownField name="outstandingSubjects" label="Số môn nợ" options={metadata.outstandingSubjectsOptions} required disabled /></Col>
              <Col xs={24} md={12}><DropdownField name="selfStudyHours" label="Số giờ tự học / tuần" options={metadata.selfStudyHourOptions} required disabled /></Col>
            </Row>
          </SurveySectionCard>

          <SurveySectionCard title="Đánh giá môn học và giảng viên" description="Các câu hỏi Likert">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {metadata.likertQuestions.map((question) => (
                <LikertQuestion key={question.key} name={[ 'likertAnswers', question.key ]} label={question.label} options={metadata.likertScaleOptions} disabled />
              ))}
            </div>
          </SurveySectionCard>

          <SurveySectionCard title="Phong cách học tập" description="Các lựa chọn về cách học">
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}><RadioGroupField name="studyTime" label="Học tốt vào sáng chiều tối" options={metadata.studyTimeOptions} required disabled /></Col>
              <Col xs={24} md={12}><RadioGroupField name="learningPreference" label="Thích học lý thuyết thực hành cân bằng" options={metadata.learningPreferenceOptions} required disabled /></Col>
              <Col xs={24} md={12}><RadioGroupField name="modePreference" label="Thích học trực tiếp online cả hai" options={metadata.modePreferenceOptions} required disabled /></Col>
              <Col xs={24} md={12}><RadioGroupField name="studyMode" label="Học một mình / học nhóm" options={metadata.studyModeOptions} required disabled /></Col>
            </Row>
          </SurveySectionCard>

          <SurveySectionCard title="Câu hỏi mở" description="Các câu trả lời mở">
            <Row gutter={[16, 16]}>
              <Col xs={24}><TextAreaField name="lecturerSupport" label="Điều giảng viên có thể làm để bạn học tốt hơn" required disabled /></Col>
              <Col xs={24}><TextAreaField name="mainDifficulty" label="Khó khăn chính khiến bạn dễ rớt môn" required disabled /></Col>
              <Col xs={24}><DropdownField name="attendanceRate" label="Tỉ lệ tham gia lớp" options={metadata.attendanceRateOptions} required disabled /></Col>
              <Col xs={24} md={12}><RadioGroupField name="homeworkBeforeClass" label="Thường làm bài tập trước khi đến lớp?" options={metadata.homeworkOptions} required disabled /></Col>
              <Col xs={24} md={12}><RadioGroupField name="requirementLevel" label="Môn yêu cầu nhiều toán / logic / coding?" options={metadata.requirementLevelOptions} required disabled /></Col>
            </Row>
          </SurveySectionCard>
        </Form>
      </div>
    </div>
  )
}
