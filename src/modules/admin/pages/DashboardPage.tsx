import { useEffect, useState } from 'react'
import { Button, Col, Empty, List, Row, Space } from 'antd'
import { DownloadOutlined, FilePdfOutlined } from '@ant-design/icons'

import GroupedBarChartCard from '../../../components/charts/GroupedBarChartCard'
import BarChartCard from '../../../components/charts/BarChartCard'
import LineChartCard from '../../../components/charts/LineChartCard'
import PageHeader from '../../../components/layout/PageHeader'
import StatCard from '../../../components/layout/StatCard'

import type { DashboardScoreItem } from '../../student/types/student.types'

type AdminApiResponse = {
  kpis: {
    totalResponses: number
    totalCoursesRated: number
    totalInstructorsRated: number
    avgQualityIndex: number
  }
  topCourses: DashboardScoreItem[]
  topInstructors: DashboardScoreItem[]
  trends: { name: string; value: number }[]
  heatmap: { subject: string; factors: Record<string, number> }[]
  alerts: { id: string; title: string; type: 'course' | 'instructor'; score: number }[]
}

const cardStyle = {
  background: '#fff',
  border: '1px solid #D7E1F0',
  borderRadius: 20,
  padding: 16,
  boxShadow: '0 14px 30px rgba(28,61,102,0.08)',
  width: '100%'
} as const

export default function DashboardPage() {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<AdminApiResponse | null>(null)

  function handleExportCsv() {
    if (!data) return

    const lines: string[] = []
    lines.push('KPIs')
    lines.push(`totalResponses,${data.kpis.totalResponses}`)
    lines.push(`totalCoursesRated,${data.kpis.totalCoursesRated}`)
    lines.push(`totalInstructorsRated,${data.kpis.totalInstructorsRated}`)
    lines.push(`avgQualityIndex,${data.kpis.avgQualityIndex}`)
    lines.push('')

    lines.push('Top Courses')
    lines.push('subject,score,semester')
    data.topCourses.forEach((course) => lines.push(`${course.subject},${course.score},${course.semester}`))
    lines.push('')

    lines.push('Top Instructors')
    lines.push('instructor,score,semester')
    data.topInstructors.forEach((instructor) => lines.push(`${instructor.subject},${instructor.score},${instructor.semester}`))
    lines.push('')

    lines.push('Alerts')
    lines.push('id,title,type,score')
    data.alerts.forEach((alert) => lines.push(`${alert.id},"${alert.title}",${alert.type},${alert.score}`))

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
  doc.text('Tổng quan dashboard quản trị', 14, 20)
      doc.setFontSize(12)

        if (data) {
        let y = 34
        doc.text(`Tổng số phản hồi: ${data.kpis.totalResponses}`, 14, y)
        y += 8
        doc.text(`Tổng số môn được đánh giá: ${data.kpis.totalCoursesRated}`, 14, y)
        y += 8
        doc.text(`Tổng số giảng viên được đánh giá: ${data.kpis.totalInstructorsRated}`, 14, y)
        y += 8
        doc.text(`Chỉ số chất lượng trung bình: ${data.kpis.avgQualityIndex}/5`, 14, y)
      }

      doc.save('dashboard-admin.pdf')
    })
  }

  useEffect(() => {
    let mounted = true

    async function load() {
      try {
        const res = await fetch('/api/admin/dashboard')
        if (!res.ok) throw new Error('network')
        const json = (await res.json()) as AdminApiResponse
        if (mounted) setData(json)
      } catch {
        if (mounted) {
          setData({
            kpis: {
              totalResponses: 12480,
              totalCoursesRated: 412,
              totalInstructorsRated: 128,
              avgQualityIndex: 4.12
            },
            topCourses: [
              { subject: 'Xây dựng phần mềm web', score: 4.6, semester: 'Học kỳ 1' },
              { subject: 'AI cơ bản và ứng dụng', score: 4.45, semester: 'Học kỳ 1' },
              { subject: 'Xây dựng phần mềm thiết bị di động', score: 4.33, semester: 'Học kỳ 1' },
              { subject: 'Cơ sở dữ liệu', score: 4.12, semester: 'Học kỳ 1' },
              { subject: 'Hệ điều hành', score: 3.98, semester: 'Học kỳ 1' }
            ],
            topInstructors: [
              { subject: 'TS. Nguyen Van A', score: 4.7, semester: 'Học kỳ 1' },
              { subject: 'ThS. Tran Thi B', score: 4.5, semester: 'Học kỳ 1' },
              { subject: 'TS. Le Van C', score: 4.4, semester: 'Học kỳ 1' },
              { subject: 'ThS. Pham Thi D', score: 4.25, semester: 'Học kỳ 1' },
              { subject: 'TS. Hoang Van E', score: 4.1, semester: 'Học kỳ 1' }
            ],
            trends: [
              { name: 'Hoc ky 1', value: 4.0 },
              { name: 'Hoc ky 2', value: 4.12 }
            ],
            heatmap: [
              { subject: 'Xây dựng phần mềm web', factors: { noiDung: 4.5, phuongPhap: 4.2, taiLieu: 4.0, hoTro: 3.8, tuongTac: 4.1 } },
              { subject: 'AI cơ bản và ứng dụng', factors: { noiDung: 4.6, phuongPhap: 4.4, taiLieu: 4.2, hoTro: 4.1, tuongTac: 4.2 } },
              { subject: 'Xây dựng phần mềm thiết bị di động', factors: { noiDung: 4.3, phuongPhap: 4.0, taiLieu: 3.9, hoTro: 3.7, tuongTac: 3.9 } },
              { subject: 'Cấu trúc dữ liệu', factors: { noiDung: 3.2, phuongPhap: 3.0, taiLieu: 2.9, hoTro: 2.8, tuongTac: 2.7 } },
              { subject: 'Mạng máy tính', factors: { noiDung: 3.4, phuongPhap: 3.1, taiLieu: 3.0, hoTro: 2.9, tuongTac: 2.8 } },
              { subject: 'Hệ điều hành', factors: { noiDung: 3.6, phuongPhap: 3.3, taiLieu: 3.2, hoTro: 3.0, tuongTac: 3.1 } },
              { subject: 'Cơ sở dữ liệu', factors: { noiDung: 3.8, phuongPhap: 3.5, taiLieu: 3.4, hoTro: 3.2, tuongTac: 3.3 } },
              { subject: 'Lập trình web', factors: { noiDung: 4.0, phuongPhap: 3.8, taiLieu: 3.6, hoTro: 3.5, tuongTac: 3.6 } },
              { subject: 'Kiểm thử phần mềm', factors: { noiDung: 4.1, phuongPhap: 3.9, taiLieu: 3.7, hoTro: 3.6, tuongTac: 3.8 } },
              { subject: 'Phân tích thiết kế HTTT', factors: { noiDung: 3.9, phuongPhap: 3.7, taiLieu: 3.5, hoTro: 3.4, tuongTac: 3.5 } }
            ],
            alerts: [
              { id: 'c1', title: 'Môn: Cấu trúc dữ liệu cần cải thiện', type: 'course', score: 2.6 },
              { id: 'i1', title: 'Giảng viên: ThS. Nguyễn cần cải thiện phương pháp', type: 'instructor', score: 2.9 }
            ]
          })
        }
      } finally {
        if (mounted) setLoading(false)
      }
    }

    load()
    return () => {
      mounted = false
    }
  }, [])

  if (!data && loading) return <Empty />

  const kpis = data!.kpis
  const groupedQualityData = data!.heatmap.map((item) => ({
    subject: item.subject,
    noiDung: item.factors.noiDung ?? 0,
    phuongPhap: item.factors.phuongPhap ?? 0,
    taiLieu: item.factors.taiLieu ?? 0,
    hoTro: item.factors.hoTro ?? 0,
    tuongTac: item.factors.tuongTac ?? item.factors.hoTro ?? 0
  }))

  return (
    <div>
      <div style={{ background: '#FFFFFF', border: '1px solid #E8EEF8', borderRadius: 16, padding: 28, boxShadow: '0 8px 20px rgba(28,61,102,0.04)' }}>
        <PageHeader
          title="Tổng quan"
          description="Theo dõi nhanh dữ liệu phản hồi của sinh viên về các môn học và giảng viên"
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
                Export CSV
              </Button>
              <Button
                icon={<FilePdfOutlined />}
                size="large"
                style={{ minHeight: 44, padding: '8px 16px', fontSize: 15 }}
                aria-label="Xuất PDF"
                onClick={handleExportPdf}
              >
                Export PDF
              </Button>
            </Space>
          )}
        />
      </div>

      <Row gutter={[24, 24]} style={{ marginTop: 20 }}>
        <Col xs={24} lg={6}><StatCard title="Tổng số phản hồi" value={kpis.totalResponses} /></Col>
        <Col xs={24} lg={6}><StatCard title="Tổng số môn được đánh giá" value={kpis.totalCoursesRated} /></Col>
        <Col xs={24} lg={6}><StatCard title="Tổng số giảng viên được đánh giá" value={kpis.totalInstructorsRated} /></Col>
        <Col xs={24} lg={6}><StatCard title="Chỉ số chất lượng trung bình" value={`${kpis.avgQualityIndex}/5`} /></Col>
      </Row>

      <div style={{ marginTop: 20 }}>
        <GroupedBarChartCard data={groupedQualityData} />

        <Row gutter={[24, 24]} style={{ marginTop: 24 }} align="stretch">
          <Col xs={24} xl={12} style={{ display: 'flex' }}>
            <div style={{ width: '100%' }}>
              <BarChartCard data={data!.topCourses} />
            </div>
          </Col>

          <Col xs={24} xl={12} style={{ display: 'flex' }}>
            <div style={{ width: '100%' }}>
              <BarChartCard
                data={data!.topInstructors}
                title="Điểm đánh giá giảng viên"
                subtitle="Cột xanh thể hiện điểm trung bình của từng giảng viên"
              />
            </div>
          </Col>
        </Row>

        <Row gutter={[24, 24]} style={{ marginTop: 24 }} align="stretch">
          <Col xs={24} xl={12} style={{ display: 'flex' }}>
            <div style={{ width: '100%' }}>
              <LineChartCard data={data!.trends} />
            </div>
          </Col>

          <Col xs={24} xl={12} style={{ display: 'flex' }}>
            <div style={cardStyle}>
              <h3 style={{ margin: 0, color: '#163253' }}>Cảnh báo môn/giảng viên cần cải thiện</h3>
              <div style={{ marginTop: 12 }}>
                <List
                  dataSource={data!.alerts}
                  renderItem={(item) => (
                    <List.Item>
                      <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                        <div style={{ color: '#163253' }}>{item.title}</div>
                        <div style={{ color: '#D9534F', fontWeight: 700 }}>{item.score.toFixed(1)}</div>
                      </div>
                    </List.Item>
                  )}
                />
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  )
}
