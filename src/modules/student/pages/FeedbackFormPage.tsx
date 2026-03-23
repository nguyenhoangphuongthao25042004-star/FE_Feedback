import { useEffect } from 'react'
import { Alert, Button, Col, Form, Row, Space, message } from 'antd'
import { ReloadOutlined, SaveOutlined, SendOutlined } from '@ant-design/icons'
import { useMutation, useQuery } from '@tanstack/react-query'

import PageHeader from '../../../components/layout/PageHeader'
import SurveySectionCard from '../../../components/forms/SurveySectionCard'
import DropdownField from '../../../components/forms/DropdownField'
import RadioGroupField from '../../../components/forms/RadioGroupField'
import TextAreaField from '../../../components/forms/TextAreaField'
import LikertQuestion from '../../../components/forms/LikertQuestion'
import SubmitButton from '../../../components/forms/SubmitButton'
import LoadingSpinner from '../../../components/utility/LoadingSpinner'
import ErrorState from '../../../components/utility/ErrorState'
import EmptyState from '../../../components/utility/EmptyState'
import { useUiStore } from '../../../stores/ui.store'
import { getFeedbackFormMetadata, submitFeedback } from '../api/student.api'
import type { ApiErrorResponse, FeedbackFormValues, FeedbackMetadata } from '../types/student.types'

// Giá trị mặc định cho toàn bộ form khi mới vào trang
const emptyValues: FeedbackFormValues = {
  semester: '',
  subject: '',
  instructor: '',
  courseResult: '',
  difficultyLevel: '',
  latestGpa: '',
  outstandingSubjects: '',
  selfStudyHours: '',
  likertAnswers: {},
  studyTime: '',
  learningPreference: '',
  modePreference: '',
  studyMode: '',
  lecturerSupport: '',
  mainDifficulty: '',
  attentionCheck: false,
  attendanceRate: '',
  homeworkBeforeClass: '',
  requirementLevel: ''
}

// Trang gửi phản hồi cho sinh viên
export default function FeedbackFormPage() {
  const [form] = Form.useForm<FeedbackFormValues>() // tạo instance form để chủ động đọc ghi dữ liệu
  const selectedSemester = useUiStore((state) => state.selectedSemester) // lấy học kỳ đang chọn ở topbar
  const metadataQuery = useQuery({ queryKey: ['feedback-form-metadata'], queryFn: getFeedbackFormMetadata }) // lấy metadata dựng form
  const metadata = metadataQuery.data?.data // lấy phần data thực tế từ response thành công

  // Mutation này dùng để lưu nháp hoặc gửi phản hồi
  const mutation = useMutation({
    mutationFn: submitFeedback,
    onSuccess: (response) => message.success(response.message),
    onError: (error) => message.error((error as unknown as ApiErrorResponse).message)
  })

  // Lưu nháp bằng cách lấy toàn bộ dữ liệu hiện tại rồi gửi với trạng thái draft
  const handleSaveDraft = async () => {
    const values = { ...emptyValues, ...form.getFieldsValue(true) }
    await mutation.mutateAsync({ ...values, status: 'draft' })
  }

  // Gửi phản hồi chính thức sau khi validate thành công
  const handleSubmit = async () => {
    try {
      await form.validateFields()
      const values = { ...emptyValues, ...form.getFieldsValue(true) }
      await mutation.mutateAsync({ ...values, status: 'submitted' })
    } catch (errorInfo: any) {
      const firstIssue = errorInfo?.errorFields?.[0]

      if (firstIssue?.name) {
        form.scrollToField(firstIssue.name, { behavior: 'smooth', block: 'center' })
      }
    }
  }

  const attentionChecked = Form.useWatch('attentionCheck', form) ?? false // theo dõi checkbox xác nhận đọc kỹ câu hỏi

  // Đồng bộ học kỳ trong form theo topbar nếu người dùng chưa chọn gì
  useEffect(() => {
    if (!metadata) return

    const hasMatchedSemester = metadata.semesters.some((option) => option.value === selectedSemester)
    const currentSemester = form.getFieldValue('semester')

    if (!currentSemester && hasMatchedSemester) {
      form.setFieldValue('semester', selectedSemester)
    }
  }, [form, metadata, selectedSemester])

  // Reset form và set lại học kỳ mặc định theo topbar
  const handleReset = () => {
    form.resetFields()

    if (metadata?.semesters.some((option) => option.value === selectedSemester)) {
      form.setFieldValue('semester', selectedSemester)
    }
  }

  if (metadataQuery.isLoading) return <LoadingSpinner /> // hiển thị loading khi đang lấy metadata
  if (metadataQuery.isError) return <ErrorState title="Không thể tải biểu mẫu phản hồi" onRetry={() => metadataQuery.refetch()} /> // hiển thị lỗi nếu query thất bại
  if (!metadata) return <EmptyState description="Chưa có dữ liệu biểu mẫu phản hồi" action={<Button onClick={() => metadataQuery.refetch()}>Thử lại</Button>} /> // hiển thị empty nếu không có metadata

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ background: '#fff', borderRadius: 20, padding: 24, border: '1px solid #D7E1F0' }}>
        <PageHeader
          title="Gửi phản hồi"
          description="Cho sinh viên điền khảo sát Smart Feedback"
          extra={(
            <Space wrap>
              <Button icon={<SaveOutlined />} size="large" onClick={handleSaveDraft}>Lưu nháp</Button>
              <SubmitButton loading={mutation.isPending} onClick={handleSubmit}>
                <Space size={8}><SendOutlined /><span>Gửi phản hồi</span></Space>
              </SubmitButton>
              <Button icon={<ReloadOutlined />} size="large" onClick={handleReset}>Làm lại</Button>
            </Space>
          )}
        />
      </div>

      <Form form={form} layout="vertical" initialValues={emptyValues} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <SurveySectionCard title="Section 1 - Thông tin chung" description="Điền các thông tin học tập cơ bản trước khi gửi phản hồi">
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}><DropdownField name="semester" label="Học kỳ" options={metadata.semesters} required /></Col>
            <Col xs={24} md={12}><DropdownField name="subject" label="Môn học" options={metadata.subjects} required /></Col>
            <Col xs={24} md={12}><DropdownField name="instructor" label="Giảng viên" options={metadata.instructors} required /></Col>
            <Col xs={24} md={12}><DropdownField name="courseResult" label="Kết quả môn học" options={metadata.courseResults} required /></Col>
            <Col xs={24} md={12}><DropdownField name="difficultyLevel" label="Mức độ khó môn" options={metadata.difficultyLevels} required /></Col>
            <Col xs={24} md={12}><DropdownField name="latestGpa" label="GPA gần nhất" options={metadata.gpaOptions} required /></Col>
            <Col xs={24} md={12}><DropdownField name="outstandingSubjects" label="Số môn nợ" options={metadata.outstandingSubjectsOptions} required /></Col>
            <Col xs={24} md={12}><DropdownField name="selfStudyHours" label="Số giờ tự học / tuần" options={metadata.selfStudyHourOptions} required /></Col>
          </Row>
        </SurveySectionCard>

        <SurveySectionCard title="Section 2 - Đánh giá môn học và giảng viên" description="Hiển thị từng câu hỏi Likert 1 đến 5 theo dạng hàng">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {metadata.likertQuestions.map((question: FeedbackMetadata['likertQuestions'][number]) => (
              <LikertQuestion key={question.key} name={['likertAnswers', question.key]} label={question.label} options={metadata.likertScaleOptions} />
            ))}
          </div>
        </SurveySectionCard>

        <SurveySectionCard title="Section 3 - Phong cách học tập" description="Phản ánh cách học phù hợp của sinh viên">
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}><RadioGroupField name="studyTime" label="Học tốt vào sáng chiều tối" options={metadata.studyTimeOptions} required /></Col>
            <Col xs={24} md={12}><RadioGroupField name="learningPreference" label="Thích học lý thuyết thực hành cân bằng" options={metadata.learningPreferenceOptions} required /></Col>
            <Col xs={24} md={12}><RadioGroupField name="modePreference" label="Thích học trực tiếp online cả hai" options={metadata.modePreferenceOptions} required /></Col>
            <Col xs={24} md={12}><RadioGroupField name="studyMode" label="Học một mình / học nhóm" options={metadata.studyModeOptions} required /></Col>
          </Row>
        </SurveySectionCard>

        <SurveySectionCard title="Section 4 - Câu hỏi mở" description="Các câu hỏi mở dùng để thu thập thêm ý kiến phản hồi từ sinh viên">
          <Row gutter={[16, 16]}>
            <Col xs={24}><TextAreaField name="lecturerSupport" label="Điều giảng viên có thể làm để bạn học tốt hơn" required /></Col>
            <Col xs={24}><TextAreaField name="mainDifficulty" label="Khó khăn chính khiến bạn dễ rớt môn" required /></Col>
            <Col xs={24}><DropdownField name="attendanceRate" label="Tỉ lệ tham gia lớp" options={metadata.attendanceRateOptions} required /></Col>
            <Col xs={24} md={12}><RadioGroupField name="homeworkBeforeClass" label="Thường làm bài tập trước khi đến lớp?" options={metadata.homeworkOptions} required /></Col>
            <Col xs={24} md={12}><RadioGroupField name="requirementLevel" label="Môn yêu cầu nhiều toán / logic / coding?" options={metadata.requirementLevelOptions} required /></Col>
            <Col xs={24}>
              <Form.Item
                name="attentionCheck"
                label="Xác nhận đọc kỹ câu hỏi"
                valuePropName="checked"
                rules={[{ validator: (_, value) => value ? Promise.resolve() : Promise.reject(new Error('Vui lòng xác nhận bạn đã đọc kỹ câu hỏi')) }]}
              >
                <label
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 10,
                    cursor: 'pointer',
                    color: '#163253'
                  }}
                >
                  <input
                    type="checkbox"
                    checked={attentionChecked}
                    onChange={(event) => form.setFieldValue('attentionCheck', event.target.checked)}
                    style={{
                      width: 18,
                      height: 18,
                      accentColor: '#004286',
                      cursor: 'pointer'
                    }}
                  />
                  <span>Tôi đã đọc kỹ câu hỏi</span>
                </label>
              </Form.Item>
            </Col>
          </Row>
        </SurveySectionCard>
      </Form>

      {mutation.isError && <Alert type="error" showIcon message="Không thể gửi phản hồi" description="Vui lòng thử lại sau" />}
    </div>
  )
}
