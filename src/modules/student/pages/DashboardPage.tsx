import { useEffect, useMemo, useState } from 'react'
import { DownloadOutlined, FilePdfOutlined, ReloadOutlined } from '@ant-design/icons'
import { Button, Col, Empty, Result, Row, Select, Space, Spin } from 'antd'
import { jsPDF } from 'jspdf'

import BarChartCard from '../../../components/charts/BarChartCard'
import RadarChartCard from '../../../components/charts/RadarChartCard'
import StatCard from '../../../components/layout/StatCard'
import InsightCard from '../components/InsightCard'
import { useUiStore } from '../../../stores/ui.store'
import type { DashboardData, RecommendationData, StudyProfileItem } from '../types/student.types'

type ViewState = 'loading' | 'success' | 'empty' | 'error' // 4 trạng thái chính của dashboard

// Dữ liệu giả cho phần tổng quan dashboard
const mockDashboard: DashboardData = {
  totalSubjects: 4,
  avgScore: 3.9,
  bestSubject: 'Xây dựng phần mềm web',
  difficultSubjects: 1,
  scores: [
    { subject: 'AI cơ bản và ứng dụng', score: 4, semester: 'Học kỳ 1' },
    { subject: 'Xây dựng phần mềm thiết bị di động', score: 3, semester: 'Học kỳ 1' },
    { subject: 'Xây dựng phần mềm web', score: 4.5, semester: 'Học kỳ 2' },
    { subject: 'Thực tập tốt nghiệp', score: 4.2, semester: 'Học kỳ 2' }
  ]
}

// Dữ liệu giả cho radar chart hồ sơ học tập
const mockProfile: StudyProfileItem[] = [
  { name: 'Lý thuyết', value: 70 },
  { name: 'Thực hành', value: 80 },
  { name: 'Tự học', value: 90 }
]

// Dữ liệu giả cho thẻ gợi ý học tập
const mockRecommend: RecommendationData = {
  suitableSubjects: 'Xây dựng phần mềm web',
  needImprove: ['Xây dựng phần mềm thiết bị di động'],
  suitableInstructors: ['Giảng viên A'],
  items: []
}

// Style dùng lại cho card trạng thái và khối header
const statusCardStyle = {
  background: '#FFFFFF',
  border: '1px solid #D7E1F0',
  borderRadius: 24,
  padding: 24,
  boxShadow: '0 14px 30px rgba(28, 61, 102, 0.08)'
} as const

// Map giá trị trong store sang nhãn học kỳ hiển thị ở dữ liệu mock
const semesterLabelMap: Record<string, string> = {
  '2025-2026-HK2': 'Học kỳ 2',
  '2025-2026-HK1': 'Học kỳ 1'
}

// Hàm đổi file font sang base64 để nhúng vào PDF export
const loadFontAsBase64 = async (fontUrl: string) => {
  const response = await fetch(fontUrl)
  const buffer = await response.arrayBuffer()
  const bytes = new Uint8Array(buffer)
  let binary = ''

  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte)
  })

  return window.btoa(binary)
}

// Trang dashboard sinh viên
export default function DashboardPage() {
  const mockFinalState: ViewState = 'success' // đổi giá trị này nếu muốn thử loading empty error
  const selectedSemester = useUiStore((state) => state.selectedSemester) // lấy học kỳ đang chọn từ topbar
  const searchKeyword = useUiStore((state) => state.searchKeyword) // lấy từ khóa tìm kiếm từ topbar

  const [viewState, setViewState] = useState<ViewState>('loading') // lưu trạng thái hiển thị hiện tại
  const [selectedRating, setSelectedRating] = useState('Tất cả mức độ') // lưu mức độ đánh giá đang lọc
  const [selectedSubject, setSelectedSubject] = useState('Tất cả môn học') // lưu môn học đang lọc

  // Mô phỏng quá trình tải dữ liệu khi vào trang
  useEffect(() => {
    setViewState('loading')

    const timer = window.setTimeout(() => {
      setViewState(mockFinalState)
    }, 500)

    return () => window.clearTimeout(timer)
  }, [mockFinalState])

  // Danh sách lựa chọn cho bộ lọc mức độ đánh giá
  const ratingOptions = [
    { value: 'Tất cả mức độ', label: 'Tất cả mức độ' },
    { value: 'Hài lòng cao', label: 'Hài lòng cao' },
    { value: 'Cần cải thiện', label: 'Cần cải thiện' }
  ]

  // Lọc trước theo học kỳ đang chọn ở topbar
  const semesterFilteredScores = useMemo(() => {
    const semesterLabel = semesterLabelMap[selectedSemester]

    if (!semesterLabel) return mockDashboard.scores

    return mockDashboard.scores.filter((item) => item.semester === semesterLabel)
  }, [selectedSemester])

  // Tạo danh sách môn học từ dữ liệu sau khi đã lọc theo học kỳ
  const subjectOptions = useMemo(() => {
    const subjects = Array.from(new Set(semesterFilteredScores.map((item) => item.subject)))

    return [
      { value: 'Tất cả môn học', label: 'Tất cả môn học' },
      ...subjects.map((subject) => ({ value: subject, label: subject }))
    ]
  }, [semesterFilteredScores])

  // Lọc dữ liệu theo học kỳ tìm kiếm mức độ và môn học
  const filteredScores = useMemo(() => {
    const normalizedKeyword = searchKeyword.trim().toLowerCase()

    return semesterFilteredScores.filter((item) => {
      const matchRating =
        selectedRating === 'Tất cả mức độ'
        || (selectedRating === 'Hài lòng cao' && item.score >= 4)
        || (selectedRating === 'Cần cải thiện' && item.score < 4)

      const matchSubject =
        selectedSubject === 'Tất cả môn học'
        || item.subject === selectedSubject

      const matchKeyword =
        normalizedKeyword.length === 0
        || item.subject.toLowerCase().includes(normalizedKeyword)

      return matchRating && matchSubject && matchKeyword
    })
  }, [searchKeyword, selectedRating, selectedSubject, semesterFilteredScores])

  // Tính lại dữ liệu KPI theo kết quả đã lọc
  const visibleSummary = useMemo(() => {
    const totalSubjects = filteredScores.length
    const totalScore = filteredScores.reduce((sum, item) => sum + item.score, 0)
    const avgScore = totalSubjects > 0 ? Number((totalScore / totalSubjects).toFixed(1)) : 0
    const bestSubject = totalSubjects > 0
      ? filteredScores.reduce((best, item) => (item.score > best.score ? item : best), filteredScores[0]).subject
      : '-'
    const difficultSubjects = filteredScores.filter((item) => item.score < 4).length

    return {
      totalSubjects,
      avgScore,
      bestSubject,
      difficultSubjects
    }
  }, [filteredScores])

  const totalSubjectsInSemester = semesterFilteredScores.length

  // Bấm thử lại khi ở trạng thái lỗi
  const handleRetry = () => {
    setViewState('loading')

    window.setTimeout(() => {
      setViewState('success')
    }, 500)
  }

  // Xuất dữ liệu đang lọc ra file CSV
  const handleExportCsv = () => {
    const rows = [
      ['Môn học', 'Học kỳ', 'Điểm'],
      ...filteredScores.map((item) => [item.subject, item.semester, item.score.toString()])
    ]

    const csvContent = rows.map((row) => row.map((value) => `"${value}"`).join(',')).join('\n')
    const blob = new Blob([`\uFEFF${csvContent}`], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')

    link.href = url
    link.download = 'dashboard-sinh-vien.csv'
    link.click()
    URL.revokeObjectURL(url)
  }

  // Xuất dữ liệu đang lọc ra file PDF
  const handleExportPdf = async () => {
    const pdf = new jsPDF({ unit: 'mm', format: 'a4' })
    const normalFont = await loadFontAsBase64('/fonts/arial.ttf')
    const boldFont = await loadFontAsBase64('/fonts/arialbd.ttf')
    let currentY = 18

    pdf.addFileToVFS('arial.ttf', normalFont)
    pdf.addFont('arial.ttf', 'ArialCustom', 'normal')
    pdf.addFileToVFS('arialbd.ttf', boldFont)
    pdf.addFont('arialbd.ttf', 'ArialCustom', 'bold')

    pdf.setFont('ArialCustom', 'bold')
    pdf.setFontSize(18)
    pdf.text('Smart Feedback - Student Dashboard', 14, currentY)

    currentY += 10
    pdf.setFont('ArialCustom', 'normal')
    pdf.setFontSize(11)
    pdf.text(`Học kỳ: ${semesterLabelMap[selectedSemester] ?? 'Tất cả'}`, 14, currentY)
    currentY += 6
    pdf.text(`Từ khóa tìm kiếm: ${searchKeyword || 'Không có'}`, 14, currentY)
    currentY += 6
    pdf.text(`Mức độ đánh giá: ${selectedRating}`, 14, currentY)
    currentY += 6
    pdf.text(`Môn học: ${selectedSubject}`, 14, currentY)

    currentY += 10
    pdf.setFont('ArialCustom', 'bold')
    pdf.text('Tổng quan KPI', 14, currentY)

    currentY += 8
    pdf.setFont('ArialCustom', 'normal')
    pdf.text(`Số môn đã phản hồi: ${visibleSummary.totalSubjects}/${totalSubjectsInSemester} môn`, 14, currentY)
    currentY += 6
    pdf.text(`Điểm hài lòng trung bình: ${visibleSummary.avgScore}/5`, 14, currentY)
    currentY += 6
    pdf.text(`Môn được đánh giá cao nhất: ${visibleSummary.bestSubject}`, 14, currentY)
    currentY += 6
    pdf.text(`Số môn có cảnh báo độ khó cao: ${visibleSummary.difficultSubjects}`, 14, currentY)

    currentY += 10
    pdf.setFont('ArialCustom', 'bold')
    pdf.text('Danh sách môn học', 14, currentY)

    currentY += 8
    pdf.setFont('ArialCustom', 'normal')

    filteredScores.forEach((item, index) => {
      if (currentY > 280) {
        pdf.addPage()
        currentY = 18
      }

      pdf.text(`${index + 1}. ${item.subject} - ${item.semester} - Điểm: ${item.score}/5`, 14, currentY)
      currentY += 6
    })

    currentY += 6
    if (currentY <= 280) {
      pdf.setFont('ArialCustom', 'bold')
      pdf.text('Gợi ý học tập', 14, currentY)
      currentY += 8
      pdf.setFont('ArialCustom', 'normal')
      pdf.text(`Môn phù hợp: ${mockRecommend.suitableSubjects}`, 14, currentY)
      currentY += 6
      pdf.text(`Môn cần chú ý: ${mockRecommend.needImprove.join(', ')}`, 14, currentY)
      currentY += 6
      pdf.text(`Giảng viên phù hợp: ${mockRecommend.suitableInstructors.join(', ')}`, 14, currentY)
    }

    pdf.save('dashboard-sinh-vien.pdf')
  }

  // Trả về card riêng cho loading error empty
  const renderStatusCard = () => {
    if (viewState === 'loading') {
      return (
        <div style={statusCardStyle}>
          <div
            style={{
              minHeight: 220,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              gap: 16,
              color: '#42546B'
            }}
          >
            <Spin size="large" />
            <div>Đang tải dashboard sinh viên...</div>
          </div>
        </div>
      )
    }

    if (viewState === 'error') {
      return (
        <div style={statusCardStyle}>
          <Result
            status="error"
            title="Không thể tải dữ liệu dashboard"
            subTitle="Vui lòng thử lại Đây vẫn là trạng thái mô phỏng ở frontend"
            extra={[
              <Button key="retry" type="primary" icon={<ReloadOutlined />} onClick={handleRetry}>
                Thử lại
              </Button>
            ]}
          />
        </div>
      )
    }

    if (viewState === 'empty') {
      return (
        <div style={statusCardStyle}>
          <Empty
            description="Chưa có dữ liệu dashboard trong học kỳ này"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        </div>
      )
    }

    return null
  }

  return (
    <>
      {viewState !== 'success' ? renderStatusCard() : (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 20
          }}
        >
          <div style={statusCardStyle}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                gap: 16,
                flexWrap: 'wrap',
                marginBottom: 20
              }}
            >
              <div>
                <h1
                  style={{
                    margin: 0,
                    color: '#163253',
                    fontSize: 32,
                    fontWeight: 800,
                    letterSpacing: 0.4
                  }}
                >
                  Tổng quan
                </h1>

                <p
                  style={{
                    margin: '10px 0 0',
                    color: '#42546B',
                    fontSize: 16,
                    lineHeight: 1.6
                  }}
                >
                  Theo dõi nhanh dữ liệu phản hồi của bạn về các môn học và giảng viên
                </p>
              </div>

              <Space wrap>
                <Button
                  icon={<DownloadOutlined />}
                  size="large"
                  style={{ minHeight: 44 }}
                  aria-label="Xuất CSV"
                  onClick={handleExportCsv}
                >
                  Export CSV
                </Button>
                <Button
                  icon={<FilePdfOutlined />}
                  size="large"
                  style={{ minHeight: 44 }}
                  aria-label="Xuất PDF"
                  onClick={handleExportPdf}
                >
                  Export PDF
                </Button>
              </Space>
            </div>

            <Row gutter={[16, 16]} align="bottom">
              <Col xs={24} sm={12} lg={8}>
                <label
                  htmlFor="filter-rating"
                  style={{ display: 'block', marginBottom: 8, color: '#163253', fontWeight: 600 }}
                >
                  Mức độ đánh giá
                </label>
                <Select
                  id="filter-rating"
                  aria-label="Mức độ đánh giá"
                  value={selectedRating}
                  onChange={setSelectedRating}
                  style={{ width: '100%' }}
                  size="large"
                  options={ratingOptions}
                />
              </Col>

              <Col xs={24} sm={12} lg={8}>
                <label
                  htmlFor="filter-subject"
                  style={{ display: 'block', marginBottom: 8, color: '#163253', fontWeight: 600 }}
                >
                  Môn học
                </label>
                <Select
                  id="filter-subject"
                  aria-label="Môn học"
                  value={selectedSubject}
                  onChange={setSelectedSubject}
                  style={{ width: '100%' }}
                  size="large"
                  options={subjectOptions}
                />
              </Col>
            </Row>
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 20
            }}
          >
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} xl={6}><StatCard title="Số môn đã phản hồi" value={`${visibleSummary.totalSubjects}/${totalSubjectsInSemester} môn`} /></Col>
              <Col xs={24} sm={12} xl={6}><StatCard title="Điểm hài lòng trung bình" value={`${visibleSummary.avgScore}/5`} /></Col>
              <Col xs={24} sm={12} xl={6}><StatCard title="Môn được đánh giá cao nhất" value={visibleSummary.bestSubject} /></Col>
              <Col xs={24} sm={12} xl={6}><StatCard title="Số môn có cảnh báo độ khó cao" value={`${visibleSummary.difficultSubjects} môn`} /></Col>
            </Row>

            <Row gutter={[16, 16]} align="stretch">
              <Col xs={24} lg={12} style={{ display: 'flex' }}><BarChartCard data={filteredScores} /></Col>
              <Col xs={24} lg={12} style={{ display: 'flex' }}><RadarChartCard data={mockProfile} /></Col>
            </Row>

            <div>
              <InsightCard data={mockRecommend} />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
