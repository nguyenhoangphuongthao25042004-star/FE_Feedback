import { useEffect, useMemo } from 'react'
import {
  Alert,
  Button,
  Col,
  Form,
  Input,
  Row,
  Space,
  Table,
  Typography,
  message
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import {
  ArrowLeftOutlined,
  CheckCircleFilled,
  FormOutlined,
  ReloadOutlined,
  SaveOutlined,
  SendOutlined
} from '@ant-design/icons'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate, useSearchParams } from 'react-router-dom'

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
import { useStudentCoursesQuery } from '../api/courseApi'
import { getFeedbackFormMetadata, submitFeedback } from '../api/student.api'
import type { Course } from '../types/course'
import type { ApiErrorResponse, FeedbackFormValues, FeedbackMetadata } from '../types/student.types'

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

const cardStyle = {
  background: '#fff',
  borderRadius: 20,
  padding: 24,
  border: '1px solid #D7E1F0'
} as const

export default function FeedbackFormPage() {
  const [form] = Form.useForm<FeedbackFormValues>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [searchParams] = useSearchParams()
  const selectedSemester = useUiStore((state) => state.selectedSemester)
  const searchKeyword = useUiStore((state) => state.searchKeyword)
  const selectedCourseId = searchParams.get('courseId')

  const metadataQuery = useQuery({
    queryKey: ['feedback-form-metadata'],
    queryFn: getFeedbackFormMetadata
  })
  const metadata = metadataQuery.data?.data

  const listCoursesQuery = useStudentCoursesQuery({
    semester: selectedSemester,
    keyword: searchKeyword
  })
  const allCoursesQuery = useStudentCoursesQuery({
    semester: 'all',
    keyword: ''
  })

  const selectedCourse = useMemo(
    () => allCoursesQuery.data?.find((course) => course.id === selectedCourseId),
    [allCoursesQuery.data, selectedCourseId]
  )
  const isCourseLocked = selectedCourse?.feedbackStatus === 'da-phan-hoi'

  const fixedFieldValues = useMemo(() => {
    if (!selectedCourse) return null

    return {
      semester: selectedCourse.semester,
      subject: selectedCourse.subject,
      instructor: selectedCourse.instructor
    }
  }, [selectedCourse])

  const mutation = useMutation({
    mutationFn: submitFeedback,
    onSuccess: async (response, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['student-feedback-history'] }),
        queryClient.invalidateQueries({ queryKey: ['student-courses'] })
      ])

      message.success(response.message)

      if (variables.status === 'submitted') {
        navigate('/student/feedback/new', { replace: true })
      }
    },
    onError: (error) => message.error((error as unknown as ApiErrorResponse).message)
  })

  useEffect(() => {
    if (!selectedCourseId || !selectedCourse || !fixedFieldValues) return

    form.resetFields()
    form.setFieldsValue({
      ...emptyValues,
      ...fixedFieldValues
    })
  }, [form, selectedCourse?.id, selectedCourseId])

  useEffect(() => {
    if (!selectedCourseId || !isCourseLocked) return

    navigate('/student/feedback/new', { replace: true })
  }, [isCourseLocked, navigate, selectedCourseId])

  const handleSaveDraft = async () => {
    if (!selectedCourse) return
    const values = { ...emptyValues, ...form.getFieldsValue(true), ...fixedFieldValues }
    await mutation.mutateAsync({ ...values, status: 'draft', courseId: selectedCourse.id })
  }

  const handleSubmit = async () => {
    if (!selectedCourse) return

    try {
      await form.validateFields()
      const values = { ...emptyValues, ...form.getFieldsValue(true), ...fixedFieldValues }
      await mutation.mutateAsync({ ...values, status: 'submitted', courseId: selectedCourse.id })
    } catch (errorInfo: any) {
      const firstIssue = errorInfo?.errorFields?.[0]

      if (firstIssue?.name) {
        form.scrollToField(firstIssue.name, { behavior: 'smooth', block: 'center' })
      }
    }
  }

  const handleReset = () => {
    form.resetFields()

    if (fixedFieldValues) {
      form.setFieldsValue(fixedFieldValues)
    }
  }

  const attentionChecked = Form.useWatch('attentionCheck', form) ?? false

  const columns: ColumnsType<Course> = useMemo(() => [
    {
      title: 'Tên môn học',
      dataIndex: 'subject',
      key: 'subject',
      render: (value: string) => (
        <Typography.Text strong style={{ color: '#163253' }}>
          {value}
        </Typography.Text>
      )
    },
    {
      title: 'Tên giảng viên',
      dataIndex: 'instructor',
      key: 'instructor',
      render: (value: string) => (
        <Typography.Text style={{ color: '#42546B' }}>
          {value}
        </Typography.Text>
      )
    },
    {
      title: 'Phản hồi',
      key: 'action',
      align: 'center',
      width: 200,
      render: (_, record) => record.feedbackStatus === 'da-phan-hoi'
        ? (
          <Button
            type="primary"
            icon={<CheckCircleFilled />}
            disabled
            style={{
              background: '#52C41A',
              borderColor: '#52C41A',
              color: '#fff',
              boxShadow: 'none'
            }}
          >
            Đã phản hồi
          </Button>
          )
        : (
          <Button
            icon={<FormOutlined />}
            onClick={() => navigate(`/student/feedback/new?courseId=${record.id}`)}
          >
            Mở form phản hồi
          </Button>
          )
    }
  ], [navigate])

  if (metadataQuery.isLoading || (selectedCourseId && allCoursesQuery.isLoading)) {
    return <LoadingSpinner />
  }

  if (metadataQuery.isError) {
    return (
      <ErrorState
        title="Không thể tải biểu mẫu phản hồi"
        onRetry={() => metadataQuery.refetch()}
      />
    )
  }

  if (listCoursesQuery.isError) {
    return (
      <ErrorState
        title="Không thể tải danh sách môn học phản hồi"
        onRetry={() => listCoursesQuery.refetch()}
      />
    )
  }

  if (!metadata) {
    return (
      <EmptyState
        description="Chưa có dữ liệu biểu mẫu phản hồi"
        action={<Button onClick={() => metadataQuery.refetch()}>Thử lại</Button>}
      />
    )
  }

  if (!selectedCourseId) {
    const courses = listCoursesQuery.data ?? []

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={cardStyle}>
          <PageHeader
            title="Gửi phản hồi"
            description="Chọn môn học trong học kỳ hiện tại để mở biểu mẫu phản hồi. Môn đã gửi sẽ tự động khóa và không thể phản hồi lại."
          />
        </div>

        <div style={cardStyle}>
          {courses.length === 0 ? (
            <EmptyState description="Không có môn học nào phù hợp với bộ lọc hiện tại" />
          ) : (
            <Table<Course>
              rowKey="id"
              loading={listCoursesQuery.isLoading}
              columns={columns}
              dataSource={courses}
              pagination={{ pageSize: 6, showSizeChanger: false }}
              onRow={(record) => (
                record.feedbackStatus === 'da-phan-hoi'
                  ? {
                    style: {
                      opacity: 0.55,
                      background: '#F6FFED'
                    }
                  }
                  : {}
              )}
            />
          )}
        </div>
      </div>
    )
  }

  if (!selectedCourse || !fixedFieldValues) {
    return (
      <EmptyState
        title="Không tìm thấy môn học"
        description="Môn học bạn chọn để phản hồi không còn tồn tại hoặc không hợp lệ."
        action={<Button onClick={() => navigate('/student/feedback/new')}>Quay lại danh sách môn học</Button>}
      />
    )
  }

  const semesterDisplayValue = metadata.semesters.find((option) => option.value === selectedCourse.semester)?.label
    ?.replace(/\s+-\s+/g, '-')
    ?? selectedCourse.semester
  const readonlyInputStyle = {
    background: '#FFFFFF',
    color: '#183A70',
    cursor: 'default'
  } as const

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={cardStyle}>
        <PageHeader
          title="Biểu mẫu phản hồi"
          description="Điền phản hồi cho đúng môn học và giảng viên đã được chọn từ danh sách môn học của bạn."
          extra={(
            <Space wrap>
              <Button icon={<ArrowLeftOutlined />} size="large" onClick={() => navigate('/student/feedback/new')}>
                Quay lại danh sách
              </Button>
              <Button icon={<SaveOutlined />} size="large" onClick={handleSaveDraft}>
                Lưu nháp
              </Button>
              <SubmitButton loading={mutation.isPending} onClick={handleSubmit}>
                <Space size={8}><SendOutlined /><span>Gửi phản hồi</span></Space>
              </SubmitButton>
              <Button icon={<ReloadOutlined />} size="large" onClick={handleReset}>
                Làm lại
              </Button>
            </Space>
          )}
        />
      </div>

      <Form
        form={form}
        layout="vertical"
        initialValues={emptyValues}
        style={{ display: 'flex', flexDirection: 'column', gap: 20 }}
      >
        <SurveySectionCard title="Section 1 - Thông tin chung" description="Các thông tin học kỳ, môn học và giảng viên đã được cố định theo môn bạn vừa chọn.">
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Form.Item name="semester" hidden rules={[{ required: true, message: 'Vui lòng chọn học kỳ' }]}>
                <Input />
              </Form.Item>
              <Form.Item label="Học kỳ" required>
                <Input value={semesterDisplayValue} readOnly size="large" style={readonlyInputStyle} />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="subject" label="Môn học" rules={[{ required: true, message: 'Vui lòng chọn môn học' }]}>
                <Input readOnly size="large" style={readonlyInputStyle} />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="instructor" label="Giảng viên" rules={[{ required: true, message: 'Vui lòng chọn giảng viên' }]}>
                <Input readOnly size="large" style={readonlyInputStyle} />
              </Form.Item>
            </Col>
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
                rules={[{
                  validator: (_, value) => value
                    ? Promise.resolve()
                    : Promise.reject(new Error('Vui lòng xác nhận bạn đã đọc kỹ câu hỏi'))
                }]}
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
