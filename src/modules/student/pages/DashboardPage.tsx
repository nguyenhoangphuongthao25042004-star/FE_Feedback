import { useEffect, useMemo, useRef, useState } from 'react' // useEffect xử lý trạng thái mô phỏng, useMemo tối ưu tính toán, useRef để scroll tới phần gợi ý, useState để lưu state
import { useLocation } from 'react-router-dom' 
import { DownloadOutlined, FilePdfOutlined, ReloadOutlined } from '@ant-design/icons' // icon export csv, pdf và thử lại
import { Button, Col, Empty, Result, Row, Select, Space, Spin } from 'antd' 
import { jsPDF } from 'jspdf' // thư viện tạo file pdf ở frontend
import StudentLayout from '../../../layouts/StudentLayout' // layout chung cho khu vực student
import KPICard from '../components/KPICard' 
import BarChartScore from '../components/BarChartScore' 
import RadarChartProfile from '../components/RadarChartProfile' 
import InsightCard from '../components/InsightCard' 
import type { DashboardData, RecommendationData, StudyProfileItem } from '../types/student.types' // các kiểu dữ liệu TypeScript

type ViewState = 'loading' | 'success' | 'empty' | 'error' // 4 trạng thái giao diện của dashboard

const mockDashboard: DashboardData = { // dữ liệu giả cho dashboard
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

const mockProfile: StudyProfileItem[] = [ // dữ liệu giả cho biểu đồ radar
  { name: 'Lý thuyết', value: 70 },
  { name: 'Thực hành', value: 80 },
  { name: 'Tự học', value: 90 }
]

const mockRecommend: RecommendationData = { // dữ liệu giả cho phần gợi ý học tập
  suitableSubjects: 'Xây dựng phần mềm web',
  needImprove: ['Xây dựng phần mềm thiết bị di động'],
  suitableInstructors: ['Giảng viên A']
}

const statusCardStyle = { // style dùng chung cho card trạng thái loading / empty / error
  background: '#FFFFFF',
  border: '1px solid #D7E1F0',
  borderRadius: 24,
  padding: 24,
  boxShadow: '0 14px 30px rgba(28, 61, 102, 0.08)'
} as const

const loadFontAsBase64 = async (fontUrl: string) => { // đọc file font và đổi sang base64 để nhúng vào PDF
  const response = await fetch(fontUrl)
  const buffer = await response.arrayBuffer()
  const bytes = new Uint8Array(buffer)
  let binary = ''

  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte)
  })

  return window.btoa(binary)
}

export default function DashboardPage() { // component chính của trang dashboard sinh viên
  const location = useLocation() // lấy route hiện tại
  const insightRef = useRef<HTMLDivElement | null>(null) // tham chiếu tới phần gợi ý để có thể scroll tới
  const mockFinalState: ViewState = 'success' // đổi giá trị này để mô phỏng loading / success / empty / error

  const [viewState, setViewState] = useState<ViewState>('loading') // state lưu trạng thái hiển thị của dashboard
  const [selectedRating, setSelectedRating] = useState('Tất cả mức độ') // state lưu bộ lọc mức độ đánh giá
  const [selectedSubject, setSelectedSubject] = useState('Tất cả môn học') // state lưu bộ lọc môn học

  useEffect(() => {
    setViewState('loading') // mỗi lần vào trang sẽ giả lập đang tải dữ liệu

    const timer = window.setTimeout(() => {
      setViewState(mockFinalState) // sau 500ms sẽ chuyển sang trạng thái cuối cùng được chọn
    }, 500)

    return () => window.clearTimeout(timer) // dọn timer khi component unmount hoặc effect chạy lại
  }, [mockFinalState])

  useEffect(() => {
    if (location.pathname !== '/student/recommendations' || viewState !== 'success') return // chỉ scroll khi vào route gợi ý học tập và dữ liệu đã sẵn sàng

    const timer = window.setTimeout(() => {
      insightRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }) // cuộn mượt tới phần gợi ý
    }, 150)

    return () => window.clearTimeout(timer)
  }, [location.pathname, viewState])

  const ratingOptions = [ // danh sách lựa chọn cho bộ lọc mức độ đánh giá
    { value: 'Tất cả mức độ', label: 'Tất cả mức độ' },
    { value: 'Hài lòng cao', label: 'Hài lòng cao' },
    { value: 'Cần cải thiện', label: 'Cần cải thiện' }
  ]

  const subjectOptions = useMemo(() => { // tạo danh sách môn học từ dữ liệu mock, chỉ tính lại khi cần
    const subjects = Array.from(new Set(mockDashboard.scores.map((item) => item.subject)))

    return [
      { value: 'Tất cả môn học', label: 'Tất cả môn học' },
      ...subjects.map((subject) => ({ value: subject, label: subject }))
    ]
  }, [])

  const filteredScores = useMemo(() => { // lọc dữ liệu biểu đồ theo mức độ và môn học đang chọn
    return mockDashboard.scores.filter((item) => {
      const matchRating =
        selectedRating === 'Tất cả mức độ'
        || (selectedRating === 'Hài lòng cao' && item.score >= 4)
        || (selectedRating === 'Cần cải thiện' && item.score < 4)
      const matchSubject = selectedSubject === 'Tất cả môn học' || item.subject === selectedSubject

      return matchRating && matchSubject
    })
  }, [selectedRating, selectedSubject])

  const visibleSummary = useMemo(() => { // tính lại 4 ô KPI dựa trên dữ liệu sau khi lọc
    const totalSubjects = filteredScores.length
    const totalScore = filteredScores.reduce((sum, item) => sum + item.score, 0)
    const avgScore = totalSubjects > 0 ? Number((totalScore / totalSubjects).toFixed(1)) : 0
    const bestSubject = totalSubjects > 0
      ? filteredScores.reduce((best, item) => item.score > best.score ? item : best, filteredScores[0]).subject
      : '-'
    const difficultSubjects = filteredScores.filter((item) => item.score < 4).length

    return {
      totalSubjects,
      avgScore,
      bestSubject,
      difficultSubjects
    }
  }, [filteredScores])

  const handleRetry = () => { // mô phỏng bấm thử lại khi gặp lỗi
    setViewState('loading')

    window.setTimeout(() => {
      setViewState('success')
    }, 500)
  }

  const handleExportCsv = () => { // export csv cơ bản hoàn toàn ở frontend
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

  const handleExportPdf = async () => { // export pdf cơ bản ở frontend và tải xuống file .pdf
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
    pdf.text(`Mức độ đánh giá: ${selectedRating}`, 14, currentY)

    currentY += 6
    pdf.text(`Môn học: ${selectedSubject}`, 14, currentY)

    currentY += 10
    pdf.setFont('ArialCustom', 'bold')
    pdf.text('Tổng quan KPI', 14, currentY)

    currentY += 8
    pdf.setFont('ArialCustom', 'normal')
    pdf.text(`Số môn: ${visibleSummary.totalSubjects}`, 14, currentY)
    currentY += 6
    pdf.text(`Điểm hài lòng trung bình: ${visibleSummary.avgScore}`, 14, currentY)
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

      pdf.text(`${index + 1}. ${item.subject} - ${item.semester} - Diem: ${item.score}`, 14, currentY)
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

  const renderStatusCard = () => { // render riêng cho các trạng thái loading / error / empty
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
            subTitle="Vui lòng thử lại. Đây vẫn là trạng thái mô phỏng ở frontend."
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
    <StudentLayout>
      {viewState !== 'success' ? renderStatusCard() : ( // nếu chưa thành công thì ưu tiên hiển thị trạng thái tương ứng
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 20
          }}
        >
          <div style={statusCardStyle}> {/* khối header của dashboard */}
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
                  Theo dõi nhanh kết quả phản hồi của bạn về các môn học và giảng viên để có kế hoạch học tập hiệu quả hơn.
                </p>
              </div>

              <Space wrap> {/* wrap giúp xuống dòng nếu thiếu chỗ */}
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

            <Row gutter={[16, 16]} align="bottom"> {/* hàng bộ lọc phụ của trang */}
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
            <Row gutter={[16, 16]}> {/* xs: mobile toàn chiều ngang, sm: tablet 2 cột, xl: desktop 4 cột */}
              <Col xs={24} sm={12} xl={6}><KPICard title="Số môn" value={visibleSummary.totalSubjects} /></Col>
              <Col xs={24} sm={12} xl={6}><KPICard title="Điểm hài lòng trung bình" value={visibleSummary.avgScore} /></Col>
              <Col xs={24} sm={12} xl={6}><KPICard title="Môn được đánh giá cao nhất" value={visibleSummary.bestSubject} /></Col>
              <Col xs={24} sm={12} xl={6}><KPICard title="Số môn có cảnh báo độ khó cao" value={visibleSummary.difficultSubjects} /></Col>
            </Row>

            <Row gutter={[16, 16]} align="stretch"> {/* 2 biểu đồ được đặt cùng một hàng và kéo đều chiều cao */}
              <Col xs={24} lg={12} style={{ display: 'flex' }}><BarChartScore data={filteredScores} /></Col>
              <Col xs={24} lg={12} style={{ display: 'flex' }}><RadarChartProfile data={mockProfile} /></Col>
            </Row>

            <div ref={insightRef}> {/* phần gợi ý học tập, có thể scroll tới khi vào route recommendations */}
              <InsightCard data={mockRecommend} />
            </div>
          </div>
        </div>
      )}
    </StudentLayout>
  )
}
