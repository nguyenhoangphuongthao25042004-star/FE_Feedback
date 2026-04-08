import { useEffect, useMemo } from 'react'
import {
  Alert,
  Card,
  Button,
  Col,
  Form,
  Input,
  Grid,
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
import { useFeedbackSubmissionQuery } from '../api/student.api'

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
  materialsQuality: '',
  trainingEvaluation: '',
  studyTime: '',
  learningPreference: '',
  modePreference: '',
  studyMode: '',
  lecturerSupport: '',
  mainDifficulty: '',
  facilitiesOpenQuestion: '',
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
  const screens = Grid.useBreakpoint()
  const isMobile = !screens.md
  const [form] = Form.useForm<FeedbackFormValues>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [searchParams] = useSearchParams()
  const selectedSemester = useUiStore((state) => state.selectedSemester)
  const searchKeyword = useUiStore((state) => state.searchKeyword)
  const selectedCourseId = searchParams.get('courseId')
  const viewMode = Boolean(searchParams.get('view'))

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
  const submissionQuery = useFeedbackSubmissionQuery(viewMode ? selectedCourseId ?? undefined : undefined)

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

    // If we're viewing a submitted feedback, the submissionQuery will set the form values instead.
    if (viewMode) return

    form.resetFields()
    form.setFieldsValue({
      ...emptyValues,
      ...fixedFieldValues
    })
  }, [form, selectedCourse?.id, selectedCourseId, fixedFieldValues, selectedCourse, viewMode])

  // When in view mode and a saved submission exists, populate the form with the saved answers
  useEffect(() => {
    if (!viewMode || !submissionQuery.data?.data) return

    const payload = submissionQuery.data.data
    form.resetFields()
    form.setFieldsValue({
      ...emptyValues,
      ...fixedFieldValues,
      ...payload
    })
  }, [viewMode, submissionQuery.data, fixedFieldValues, form])

  useEffect(() => {
    if (!selectedCourseId || !isCourseLocked || viewMode) return

    navigate('/student/feedback/new', { replace: true })
  }, [isCourseLocked, navigate, selectedCourseId, viewMode])

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
    } catch (errorInfo: unknown) {
      // validation error from antd form
  const err = errorInfo as { errorFields?: Array<{ name?: unknown }> }
      const firstIssue = err?.errorFields?.[0]

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

  if (viewMode && submissionQuery.isLoading) {
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
          ) : isMobile ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {courses.map((record) => {
                const isSubmitted = record.feedbackStatus === 'da-phan-hoi'

                return (
                  <Card
                    key={record.id}
                    size="small"
                    style={{
                      borderRadius: 18,
                      border: '1px solid #D7E1F0',
                      background: isSubmitted ? '#F6FFED' : '#FFFFFF',
                      opacity: isSubmitted ? 0.78 : 1,
                      boxShadow: '0 8px 18px rgba(0, 45, 109, 0.06)'
                    }}
                    bodyStyle={{ padding: 16 }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        <Typography.Text strong style={{ color: '#163253', fontSize: 18, lineHeight: 1.45 }}>
                          {record.subject}
                        </Typography.Text>
                        <Typography.Text style={{ color: '#42546B', fontSize: 15, lineHeight: 1.5 }}>
                          {record.instructor}
                        </Typography.Text>
                      </div>

                      {isSubmitted ? (
                        <Button
                          type="primary"
                          icon={<CheckCircleFilled />}
                          disabled
                          style={{
                            alignSelf: 'flex-start',
                            background: '#52C41A',
                            borderColor: '#52C41A',
                            color: '#fff',
                            boxShadow: 'none'
                          }}
                        >
                          Đã phản hồi
                        </Button>
                      ) : (
                        <Button
                          icon={<FormOutlined />}
                          onClick={() => navigate(`/student/feedback/new?courseId=${record.id}`)}
                          style={{ alignSelf: 'flex-start', borderRadius: 999 }}
                        >
                          Mở form phản hồi
                        </Button>
                      )}
                    </div>
                  </Card>
                )
              })}
            </div>
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
  const stickyHeaderTop = isMobile ? 120 : 88
  const readonlyInputStyle = {
    background: '#FFFFFF',
    color: '#183A70',
    cursor: 'default'
  } as const

  return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* header cố định khi cuộn */}
      <div style={{ position: 'sticky', top: stickyHeaderTop, zIndex: 30 }}>
        <div style={cardStyle}>
          <PageHeader
            title="Biểu mẫu phản hồi"
            description="Điền phản hồi cho đúng môn học và giảng viên đã được chọn từ danh sách môn học của bạn."
            prefix={(
              <Button
                icon={<ArrowLeftOutlined />}
                onClick={() => navigate('/student/feedback/new')}
                shape="circle"
                size="large"
                style={{ borderRadius: 999, width: 44, height: 44, minWidth: 44 }}
              />
            )}
          />
        </div>
      </div>

      {/* chỉ phần form cuộn được */}
      <div style={{ maxHeight: 'calc(100vh - 240px)', overflow: 'auto', paddingRight: 8 }}>
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
              <Col xs={24} md={12}><DropdownField name="courseResult" label="Kết quả môn học" options={metadata.courseResults} required disabled={viewMode} /></Col>
              <Col xs={24} md={12}><DropdownField name="difficultyLevel" label="Mức độ khó môn" options={metadata.difficultyLevels} required disabled={viewMode} /></Col>
              <Col xs={24} md={12}><DropdownField name="latestGpa" label="GPA gần nhất" options={metadata.gpaOptions} required disabled={viewMode} /></Col>
              <Col xs={24} md={12}><DropdownField name="outstandingSubjects" label="Số môn nợ" options={metadata.outstandingSubjectsOptions} required disabled={viewMode} /></Col>
              <Col xs={24} md={12}><DropdownField name="selfStudyHours" label="Số giờ tự học / tuần" options={metadata.selfStudyHourOptions} required disabled={viewMode} /></Col>
            </Row>
          </SurveySectionCard>

          <SurveySectionCard title="Section 2 - Đánh giá môn học và giảng viên" description="Hiển thị từng câu hỏi Likert 1 đến 5 theo dạng hàng">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {metadata.likertQuestions.map((question: FeedbackMetadata['likertQuestions'][number]) => (
                <LikertQuestion key={question.key} name={['likertAnswers', question.key]} label={question.label} options={metadata.likertScaleOptions} disabled={viewMode} />
              ))}
            </div>
          </SurveySectionCard>

          <SurveySectionCard title="Section 3 - Phong cách học tập" description="Phản ánh cách học phù hợp của sinh viên">
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}><RadioGroupField name="studyTime" label="Học tốt vào sáng chiều tối" options={metadata.studyTimeOptions} required disabled={viewMode} /></Col>
              <Col xs={24} md={12}><RadioGroupField name="learningPreference" label="Thích học lý thuyết thực hành cân bằng" options={metadata.learningPreferenceOptions} required disabled={viewMode} /></Col>
              <Col xs={24} md={12}><RadioGroupField name="modePreference" label="Thích học trực tiếp online cả hai" options={metadata.modePreferenceOptions} required disabled={viewMode} /></Col>
              <Col xs={24} md={12}><RadioGroupField name="studyMode" label="Học một mình / học nhóm" options={metadata.studyModeOptions} required disabled={viewMode} /></Col>
            </Row>
          </SurveySectionCard>

          <SurveySectionCard title="Section 4 - Cơ sở vật chất" description="Đánh giá chất lượng cơ sở vật chất và trang thiết bị">
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}><DropdownField name="materialsQuality" label="Chất lượng cơ sở vật chất" options={metadata.materialsQualityOptions} required disabled={viewMode} /></Col>
              <Col xs={24} md={12}><DropdownField name="trainingEvaluation" label="Đánh giá đào tạo" options={metadata.trainingEvaluationOptions} required disabled={viewMode} /></Col>
            </Row>
          </SurveySectionCard>

          <SurveySectionCard title="Section 5 - Câu hỏi mở" description="Các câu hỏi mở dùng để thu thập thêm ý kiến phản hồi từ sinh viên">
            <Row gutter={[16, 16]}>
              <Col xs={24}><TextAreaField name="facilitiesOpenQuestion" label="Theo bạn nhà trường cần cải thiện gì về cơ sở vật chất?" required disabled={viewMode} /></Col>
              <Col xs={24}><TextAreaField name="lecturerSupport" label="Điều giảng viên có thể làm để bạn học tốt hơn" required disabled={viewMode} /></Col>
              <Col xs={24}><TextAreaField name="mainDifficulty" label="Khó khăn chính khiến bạn dễ rớt môn" required disabled={viewMode} /></Col>
              <Col xs={24}><DropdownField name="attendanceRate" label="Tỷ lệ tham gia lớp" options={metadata.attendanceRateOptions} required disabled={viewMode} /></Col>
              <Col xs={24} md={12}><RadioGroupField name="homeworkBeforeClass" label="Thường làm bài tập trước khi đến lớp?" options={metadata.homeworkOptions} required disabled={viewMode} /></Col>
              <Col xs={24} md={12}><RadioGroupField name="requirementLevel" label="Môn yêu cầu nhiều toán / logic / coding?" options={metadata.requirementLevelOptions} required disabled={viewMode} /></Col>
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
                      disabled={viewMode}
                      onChange={(event) => form.setFieldValue('attentionCheck', event.target.checked)}
                      style={{
                        width: 18,
                        height: 18,
                        accentColor: '#004286',
                        cursor: viewMode ? 'default' : 'pointer'
                      }}
                    />
                    <span>Tôi đã đọc kỹ câu hỏi</span>
                  </label>
                </Form.Item>
              </Col>
            </Row>

            {!viewMode && (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-start',
                  marginTop: 24,
                  paddingTop: 20,
                  borderTop: '1px solid #E5ECF6'
                }}
              >
                <Space wrap>
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
              </div>
            )}
          </SurveySectionCard>
        </Form>
      </div>

      {mutation.isError && <Alert type="error" showIcon message="Không thể gửi phản hồi" description="Vui lòng thử lại sau" />}
    </div>
  )
}
