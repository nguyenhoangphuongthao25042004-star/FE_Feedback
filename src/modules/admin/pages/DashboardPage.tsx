import { useMemo, useState } from 'react'
import { Button, Col, Modal, Row, Space, Tag } from 'antd'
import { DownloadOutlined, FilePdfOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'

import PageHeader from '../../../components/layout/PageHeader'
import KPICard from '../components/KPICard'
import AlertPanel from '../components/AlertPanel'
import QITrendChart from '../components/QITrendChart'
import RankingBarChart from '../components/RankingBarChart'
import CourseHeatmap from '../components/CourseHeatmap'
import RecommendationPreview from '../components/RecommendationPreview'

import type {
  AlertItem,
  DashboardKpi,
  HeatmapRow,
  QITrendPoint,
  RankingItem,
  RecommendationPreviewItem
} from '../components/dashboard.types'

type SemesterKpiSnapshot = {
  semester: string
  totalResponses: number
  totalCoursesRated: number
  totalInstructorsRated: number
  avgQualityIndex: number
  validResponseRate: number
  activeAlertsCount: number
}

type CourseSnapshot = {
  id: string
  semester: string
  course: string
  department: string
  instructor: string
  qi: number
  responseCount: number
  clarity: number
  pace: number
  fairness: number
  support: number
  interaction: number
}

const semesterKpiSnapshots: SemesterKpiSnapshot[] = [
  {
    semester: '2024-2025 HK1',
    totalResponses: 10240,
    totalCoursesRated: 372,
    totalInstructorsRated: 118,
    avgQualityIndex: 3.96,
    validResponseRate: 86.4,
    activeAlertsCount: 14
  },
  {
    semester: '2024-2025 HK2',
    totalResponses: 11370,
    totalCoursesRated: 385,
    totalInstructorsRated: 121,
    avgQualityIndex: 4.03,
    validResponseRate: 88.1,
    activeAlertsCount: 12
  },
  {
    semester: '2025-2026 HK1',
    totalResponses: 12120,
    totalCoursesRated: 401,
    totalInstructorsRated: 125,
    avgQualityIndex: 4.08,
    validResponseRate: 90.2,
    activeAlertsCount: 11
  },
  {
    semester: '2025-2026 HK2',
    totalResponses: 12480,
    totalCoursesRated: 412,
    totalInstructorsRated: 128,
    avgQualityIndex: 4.12,
    validResponseRate: 91.4,
    activeAlertsCount: 9
  }
]

const courseSnapshots: CourseSnapshot[] = [
  { id: 'c01', semester: '2025-2026 HK2', course: 'Xây dựng phần mềm web', department: 'CNTT', instructor: 'TS. Nguyen Van A', qi: 4.61, responseCount: 312, clarity: 4.5, pace: 4.4, fairness: 4.6, support: 4.5, interaction: 4.3 },
  { id: 'c02', semester: '2025-2026 HK2', course: 'AI cơ bản và ứng dụng', department: 'CNTT', instructor: 'ThS. Tran Thi B', qi: 4.48, responseCount: 296, clarity: 4.5, pace: 4.3, fairness: 4.4, support: 4.4, interaction: 4.5 },
  { id: 'c03', semester: '2025-2026 HK2', course: 'Xây dựng phần mềm di động', department: 'CNTT', instructor: 'TS. Le Van C', qi: 4.35, responseCount: 252, clarity: 4.2, pace: 4.1, fairness: 4.3, support: 4.2, interaction: 4.1 },
  { id: 'c04', semester: '2025-2026 HK2', course: 'Cơ sở dữ liệu', department: 'CNTT', instructor: 'ThS. Pham Thi D', qi: 4.1, responseCount: 238, clarity: 4.0, pace: 3.9, fairness: 4.1, support: 4.0, interaction: 3.9 },
  { id: 'c05', semester: '2025-2026 HK2', course: 'Hệ điều hành', department: 'CNTT', instructor: 'TS. Hoang Van E', qi: 3.96, responseCount: 214, clarity: 3.9, pace: 3.8, fairness: 4.0, support: 3.8, interaction: 3.7 },
  { id: 'c06', semester: '2025-2026 HK2', course: 'Mạng máy tính', department: 'CNTT', instructor: 'TS. Dang Van G', qi: 3.72, responseCount: 175, clarity: 3.6, pace: 3.4, fairness: 3.8, support: 3.5, interaction: 3.4 },
  { id: 'c07', semester: '2025-2026 HK2', course: 'Kiểm thử phần mềm', department: 'CNTT', instructor: 'ThS. Ly Thi H', qi: 3.68, responseCount: 168, clarity: 3.6, pace: 3.4, fairness: 3.7, support: 3.5, interaction: 3.6 },
  { id: 'c08', semester: '2025-2026 HK2', course: 'Phân tích thiết kế HTTT', department: 'Hệ thống thông tin', instructor: 'TS. Bui Van I', qi: 3.45, responseCount: 141, clarity: 3.4, pace: 3.2, fairness: 3.5, support: 3.3, interaction: 3.4 },
  { id: 'c09', semester: '2025-2026 HK2', course: 'Quản trị dự án CNTT', department: 'Hệ thống thông tin', instructor: 'ThS. Do Thi K', qi: 3.22, responseCount: 112, clarity: 3.1, pace: 3.0, fairness: 3.4, support: 3.0, interaction: 3.1 },
  { id: 'c10', semester: '2025-2026 HK2', course: 'Khai phá dữ liệu', department: 'Khoa học dữ liệu', instructor: 'TS. Vu Van L', qi: 3.01, responseCount: 98, clarity: 2.9, pace: 2.8, fairness: 3.2, support: 2.9, interaction: 2.8 },
  { id: 'c11', semester: '2025-2026 HK2', course: 'Toán rời rạc', department: 'Toán ứng dụng', instructor: 'ThS. Tran Minh M', qi: 2.89, responseCount: 93, clarity: 2.8, pace: 2.7, fairness: 3.0, support: 2.7, interaction: 2.8 },
  { id: 'c12', semester: '2025-2026 HK2', course: 'Xác suất thống kê', department: 'Toán ứng dụng', instructor: 'ThS. Phan Thi N', qi: 2.76, responseCount: 81, clarity: 2.6, pace: 2.5, fairness: 2.9, support: 2.6, interaction: 2.5 },

  { id: 'c01', semester: '2025-2026 HK1', course: 'Xây dựng phần mềm web', department: 'CNTT', instructor: 'TS. Nguyen Van A', qi: 4.52, responseCount: 301, clarity: 4.4, pace: 4.3, fairness: 4.5, support: 4.4, interaction: 4.3 },
  { id: 'c02', semester: '2025-2026 HK1', course: 'AI cơ bản và ứng dụng', department: 'CNTT', instructor: 'ThS. Tran Thi B', qi: 4.41, responseCount: 284, clarity: 4.4, pace: 4.2, fairness: 4.4, support: 4.3, interaction: 4.4 },
  { id: 'c10', semester: '2025-2026 HK1', course: 'Khai phá dữ liệu', department: 'Khoa học dữ liệu', instructor: 'TS. Vu Van L', qi: 3.22, responseCount: 107, clarity: 3.1, pace: 3.0, fairness: 3.3, support: 3.0, interaction: 3.1 },
  { id: 'c11', semester: '2025-2026 HK1', course: 'Toán rời rạc', department: 'Toán ứng dụng', instructor: 'ThS. Tran Minh M', qi: 3.05, responseCount: 110, clarity: 3.0, pace: 2.9, fairness: 3.1, support: 2.9, interaction: 3.0 },
  { id: 'c12', semester: '2025-2026 HK1', course: 'Xác suất thống kê', department: 'Toán ứng dụng', instructor: 'ThS. Phan Thi N', qi: 2.97, responseCount: 102, clarity: 2.9, pace: 2.8, fairness: 3.0, support: 2.8, interaction: 2.9 }
]

const qiTrendData: QITrendPoint[] = semesterKpiSnapshots.map((item) => ({
  semester: item.semester,
  qiAvg: item.avgQualityIndex
}))

const recommendationPreview: RecommendationPreviewItem[] = [
  { id: 'r1', title: 'Thiết kế buổi huấn luyện về nhịp độ giảng dạy cho nhóm môn dưới 3.2', priority: 'P1', owner: 'Phòng Đào tạo' },
  { id: 'r2', title: 'Tăng phản hồi giữa kỳ ở khoa Toán ứng dụng', priority: 'P2', owner: 'Nhóm Đảm bảo chất lượng' },
  { id: 'r3', title: 'Chuẩn hóa tiêu chí công bằng cho các lớp học đông', priority: 'P3', owner: 'Phòng Học vụ' }
]

function calcTrend(current: number, previous: number) {
  if (!previous) return 0
  return Number((((current - previous) / previous) * 100).toFixed(1))
}

function formatKpiValue(key: string, value: number) {
  if (key === 'avgQualityIndex') return `${value.toFixed(2)}/5`
  if (key === 'validResponseRate') return `${value.toFixed(1)}%`
  return value.toLocaleString()
}

function severityLabel(severity: AlertItem['severity']) {
  if (severity === 'high') return 'CAO'
  if (severity === 'medium') return 'TRUNG BÌNH'
  return 'THẤP'
}

export default function DashboardPage() {
  const navigate = useNavigate()
  const latestSemester = semesterKpiSnapshots[semesterKpiSnapshots.length - 1]?.semester ?? ''

  const [selectedAlert, setSelectedAlert] = useState<AlertItem | null>(null)

  function handleExportCsv() {
    const lines: string[] = []

    lines.push('KPI Tổng quan điều hành')
    kpis.forEach((item) => {
      lines.push(`${item.title},${item.value},${item.trend}%`)
    })
    lines.push('')

    lines.push('Top môn học')
    lines.push('môn_học,qi')
    topCourses.forEach((item) => lines.push(`${item.label},${item.score}`))
    lines.push('')

    lines.push('Nhóm môn học cần ưu tiên')
    lines.push('môn_học,qi')
    bottomCourses.forEach((item) => lines.push(`${item.label},${item.score}`))
    lines.push('')

    lines.push('Bảng cảnh báo')
    lines.push('tiêu_đề,mức_độ,mô_tả')
    alertItems.forEach((item) => lines.push(`"${item.title}",${item.severity},"${item.description}"`))
    lines.push('')

    lines.push('Bản đồ nhiệt')
    lines.push('môn_học,độ_rõ_ràng,tốc_độ,công_bằng,hỗ_trợ,tương_tác')
    heatmapRows.forEach((row) => {
      lines.push(`${row.course},${row.clarity},${row.pace},${row.fairness},${row.support},${row.interaction}`)
    })

    const csv = lines.join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'dashboard-admin.csv'
    document.body.appendChild(link)
    link.click()
    link.remove()
    URL.revokeObjectURL(url)
  }

  function handleExportPdf() {
    import('jspdf').then(({ jsPDF }) => {
      const doc = new jsPDF()
      doc.setFontSize(18)
      doc.text('Tổng quan điều hành - DSS chất lượng giảng dạy', 14, 20)
      doc.setFontSize(12)

      let y = 34
      kpis.forEach((item) => {
        doc.text(`${item.title}: ${item.value} (${item.trend > 0 ? '+' : ''}${item.trend.toFixed(1)}%)`, 14, y)
        y += 8
      })

      y += 4
      doc.text('Top 5 cảnh báo:', 14, y)
      y += 8
      alertItems.slice(0, 5).forEach((item) => {
        doc.text(`- [${severityLabel(item.severity)}] ${item.title}`, 14, y)
        y += 8
      })

      doc.save('dashboard-admin.pdf')
    })
  }

  const latestSemesterSnapshots = useMemo(() => {
    return courseSnapshots.filter((item) => item.semester === latestSemester)
  }, [latestSemester])

  const selectedSemesterSnapshot = useMemo(() => {
    return semesterKpiSnapshots.find((item) => item.semester === latestSemester) ?? semesterKpiSnapshots[semesterKpiSnapshots.length - 1]
  }, [latestSemester])

  const previousSemesterSnapshot = useMemo(() => {
    const index = semesterKpiSnapshots.findIndex((item) => item.semester === selectedSemesterSnapshot.semester)
    if (index <= 0) return selectedSemesterSnapshot
    return semesterKpiSnapshots[index - 1]
  }, [selectedSemesterSnapshot.semester])

  const kpis = useMemo<DashboardKpi[]>(() => {
    return [
      {
        key: 'totalResponses',
        title: 'Tổng số phản hồi',
        value: formatKpiValue('totalResponses', selectedSemesterSnapshot.totalResponses),
        trend: calcTrend(selectedSemesterSnapshot.totalResponses, previousSemesterSnapshot.totalResponses),
        trendLabel: 'vs kỳ trước'
      },
      {
        key: 'totalCoursesRated',
        title: 'Tổng số môn được đánh giá',
        value: formatKpiValue('totalCoursesRated', selectedSemesterSnapshot.totalCoursesRated),
        trend: calcTrend(selectedSemesterSnapshot.totalCoursesRated, previousSemesterSnapshot.totalCoursesRated),
        trendLabel: 'vs kỳ trước'
      },
      {
        key: 'totalInstructorsRated',
        title: 'Tổng số giảng viên được đánh giá',
        value: formatKpiValue('totalInstructorsRated', selectedSemesterSnapshot.totalInstructorsRated),
        trend: calcTrend(selectedSemesterSnapshot.totalInstructorsRated, previousSemesterSnapshot.totalInstructorsRated),
        trendLabel: 'vs kỳ trước'
      },
      {
        key: 'avgQualityIndex',
        title: 'Chỉ số chất lượng trung bình',
        value: formatKpiValue('avgQualityIndex', selectedSemesterSnapshot.avgQualityIndex),
        trend: calcTrend(selectedSemesterSnapshot.avgQualityIndex, previousSemesterSnapshot.avgQualityIndex),
        trendLabel: 'vs kỳ trước'
      },
      {
        key: 'validResponseRate',
        title: 'Tỷ lệ phản hồi hợp lệ',
        value: formatKpiValue('validResponseRate', selectedSemesterSnapshot.validResponseRate),
        trend: calcTrend(selectedSemesterSnapshot.validResponseRate, previousSemesterSnapshot.validResponseRate),
        trendLabel: 'vs kỳ trước'
      },
      {
        key: 'activeAlertsCount',
        title: 'Số cảnh báo đang mở',
        value: formatKpiValue('activeAlertsCount', selectedSemesterSnapshot.activeAlertsCount),
        trend: calcTrend(selectedSemesterSnapshot.activeAlertsCount, previousSemesterSnapshot.activeAlertsCount),
        trendLabel: 'vs kỳ trước'
      }
    ]
  }, [selectedSemesterSnapshot, previousSemesterSnapshot])

  const aggregatedCourses = useMemo(() => {
    const map = new Map<string, {
      id: string
      course: string
      department: string
      instructor: string
      qi: number
      responseCount: number
      clarity: number
      pace: number
      fairness: number
      support: number
      interaction: number
      count: number
    }>()

    latestSemesterSnapshots.forEach((item) => {
      const existing = map.get(item.id)
      if (!existing) {
        map.set(item.id, {
          ...item,
          count: 1
        })
        return
      }

      existing.qi += item.qi
      existing.responseCount += item.responseCount
      existing.clarity += item.clarity
      existing.pace += item.pace
      existing.fairness += item.fairness
      existing.support += item.support
      existing.interaction += item.interaction
      existing.count += 1
    })

    return Array.from(map.values()).map((item) => ({
      ...item,
      qi: Number((item.qi / item.count).toFixed(2)),
      clarity: Number((item.clarity / item.count).toFixed(2)),
      pace: Number((item.pace / item.count).toFixed(2)),
      fairness: Number((item.fairness / item.count).toFixed(2)),
      support: Number((item.support / item.count).toFixed(2)),
      interaction: Number((item.interaction / item.count).toFixed(2))
    }))
  }, [latestSemesterSnapshots])

  const topCourses = useMemo<RankingItem[]>(() => {
    return [...aggregatedCourses]
      .sort((a, b) => b.qi - a.qi)
      .slice(0, 10)
      .map((item) => ({ id: item.id, label: item.course, score: item.qi }))
  }, [aggregatedCourses])

  const bottomCourses = useMemo<RankingItem[]>(() => {
    return [...aggregatedCourses]
      .sort((a, b) => a.qi - b.qi)
      .slice(0, 10)
      .map((item) => ({ id: item.id, label: item.course, score: item.qi }))
  }, [aggregatedCourses])

  const topInstructors = useMemo<RankingItem[]>(() => {
    const map = new Map<string, { totalQi: number; count: number }>()
    latestSemesterSnapshots.forEach((item) => {
      const current = map.get(item.instructor)
      if (!current) {
        map.set(item.instructor, { totalQi: item.qi, count: 1 })
        return
      }
      current.totalQi += item.qi
      current.count += 1
    })

    return Array.from(map.entries())
      .map(([name, stats]) => ({
        id: name,
        label: name,
        score: Number((stats.totalQi / stats.count).toFixed(2))
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)
  }, [latestSemesterSnapshots])

  const heatmapRows = useMemo<HeatmapRow[]>(() => {
    return aggregatedCourses.map((item) => ({
      id: item.id,
      course: item.course,
      department: item.department,
      instructor: item.instructor,
      responseCount: item.responseCount,
      qi: item.qi,
      clarity: item.clarity,
      pace: item.pace,
      fairness: item.fairness,
      support: item.support,
      interaction: item.interaction
    }))
  }, [aggregatedCourses])

  const alertItems = useMemo<AlertItem[]>(() => {
    const lowQiAlerts = aggregatedCourses
      .filter((item) => item.qi < 3)
      .map((item) => ({
        id: `low-qi-${item.id}`,
        title: `QI thấp: ${item.course}`,
        severity: 'high' as const,
        description: `Điểm QI ${item.qi.toFixed(2)} dưới ngưỡng 3.0`,
        type: 'low-qi-course' as const
      }))

    const decreasingAlerts = [
      {
        id: 'decreasing-c11',
        title: 'Xu hướng giảm: Toán rời rạc',
        severity: 'medium' as const,
        description: 'Giảm liên tiếp 2 học kỳ (3.28 -> 3.05 -> 2.89)',
        type: 'decreasing-course' as const
      },
      {
        id: 'decreasing-c12',
        title: 'Xu hướng giảm: Xác suất thống kê',
        severity: 'high' as const,
        description: 'Giảm liên tiếp 2 học kỳ (3.22 -> 2.97 -> 2.76)',
        type: 'decreasing-course' as const
      }
    ]

    const lowConfidenceInstructor = topInstructors
      .filter((item) => {
        const totalResponses = latestSemesterSnapshots
          .filter((snapshot) => snapshot.instructor === item.label)
          .reduce((sum, snapshot) => sum + snapshot.responseCount, 0)
        return totalResponses < 120
      })
      .map((item) => ({
        id: `low-confidence-${item.id}`,
        title: `Độ tin cậy thấp: ${item.label}`,
        severity: 'medium' as const,
        description: 'Số phản hồi dưới ngưỡng tin cậy 120 mẫu',
        type: 'low-confidence-instructor' as const
      }))

    const etlAlerts = [
      {
        id: 'etl-late-load',
        title: 'ETL trễ dữ liệu khảo sát',
        severity: 'high' as const,
        description: 'Tiến trình nạp dữ liệu bị trễ 4 giờ ở lần chạy tối qua',
        type: 'etl-issue' as const
      },
      {
        id: 'etl-missing-facility',
        title: 'ETL thiếu trường facilities_open_question',
        severity: 'low' as const,
        description: '2.1% bản ghi chưa ánh xạ đầy đủ schema',
        type: 'etl-issue' as const
      }
    ]

    return [
      ...lowQiAlerts,
      ...decreasingAlerts,
      ...lowConfidenceInstructor,
      ...etlAlerts
    ]
  }, [aggregatedCourses, latestSemesterSnapshots, topInstructors])

  const dashboardTrendData = qiTrendData

  return (
    <div>
      <div style={{ background: '#FFFFFF', border: '1px solid #E8EEF8', borderRadius: 16, padding: 28, boxShadow: '0 8px 20px rgba(28,61,102,0.04)' }}>
        <PageHeader
          title="Tổng quan"
          description="Hệ thống hỗ trợ ra quyết định cho quản trị chất lượng giảng dạy theo học kỳ, khoa và giảng viên"
          contentGap={8}
          extra={(
            <Space wrap>
              <Button
                icon={<DownloadOutlined />}
                size="large"
                style={{ minHeight: 44, padding: '8px 16px', fontSize: 15 }}
                aria-label="Xuất CSV"
                onClick={handleExportCsv}
              >
                Xuất DSS CSV
              </Button>
              <Button
                icon={<FilePdfOutlined />}
                size="large"
                style={{ minHeight: 44, padding: '8px 16px', fontSize: 15 }}
                aria-label="Xuất PDF"
                onClick={handleExportPdf}
              >
                Xuất DSS PDF
              </Button>
            </Space>
          )}
        />
      </div>

      <Row gutter={[24, 24]} style={{ marginTop: 20 }}>
        {kpis.map((item) => (
          <Col key={item.key} xs={24} md={12} xl={8}>
            <KPICard
              title={item.title}
              value={item.value}
              trend={item.trend}
              trendLabel={item.trendLabel}
            />
          </Col>
        ))}
      </Row>

      <Modal
        open={Boolean(selectedAlert)}
        onCancel={() => setSelectedAlert(null)}
        footer={null}
        centered
        title={selectedAlert ? `Chi tiết cảnh báo: ${selectedAlert.title}` : 'Chi tiết cảnh báo'}
      >
        {selectedAlert && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ color: '#42546B', fontSize: 14 }}>
              {selectedAlert.description}
            </div>
            <div>
              <Tag color={selectedAlert.severity === 'high' ? 'red' : selectedAlert.severity === 'medium' ? 'gold' : 'green'}>
                {severityLabel(selectedAlert.severity)}
              </Tag>
            </div>
          </div>
        )}
      </Modal>

      <Row gutter={[24, 24]} style={{ marginTop: 24 }} align="stretch">
        <Col xs={24} xl={14} style={{ display: 'flex' }}>
          <QITrendChart
            data={dashboardTrendData}
            onNavigateDetail={() => navigate('/admin/course-ranking')}
          />
        </Col>

        <Col xs={24} xl={10} style={{ display: 'flex' }}>
          <AlertPanel
            alerts={alertItems}
            onSelectAlert={(alert) => {
              setSelectedAlert(alert)
              navigate('/admin/data-quality')
            }}
          />
        </Col>
      </Row>

      <div style={{ marginTop: 24 }}>
        <CourseHeatmap rows={heatmapRows} />
      </div>

      <Row gutter={[24, 24]} style={{ marginTop: 24 }} align="stretch">
        <Col xs={24} xl={8} style={{ display: 'flex' }}>
          <RankingBarChart
            title="10 môn có QI cao nhất"
            subtitle="Nhấp vào cột để mở trang chi tiết theo môn học"
            data={topCourses}
            tone="positive"
            onSelect={() => navigate('/admin/course-ranking')}
          />
        </Col>

        <Col xs={24} xl={8} style={{ display: 'flex' }}>
          <RankingBarChart
            title="10 môn có QI thấp nhất"
            subtitle="Ưu tiên can thiệp cho các môn ở nhóm đáy"
            data={bottomCourses}
            tone="negative"
            onSelect={() => navigate('/admin/course-ranking')}
          />
        </Col>

        <Col xs={24} xl={8} style={{ display: 'flex' }}>
          <RankingBarChart
            title="Top giảng viên"
            subtitle="Nhóm giảng viên có QI trung bình cao"
            data={topInstructors}
            tone="neutral"
            onSelect={() => navigate('/admin/instructor-ranking')}
          />
        </Col>
      </Row>

      <div style={{ marginTop: 24 }}>
        <RecommendationPreview data={recommendationPreview} />
      </div>
    </div>
  )
}
