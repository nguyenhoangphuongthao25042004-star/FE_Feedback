import { useMemo } from 'react'
import { Row, Col, Space, Button } from 'antd'
import { DownloadOutlined, FilePdfOutlined } from '@ant-design/icons'
import { jsPDF } from 'jspdf'

import PageHeader from '../../../components/layout/PageHeader'
import StatCard from '../../../components/layout/StatCard'
import type { DashboardScoreItem } from '../../student/types/student.types'
import LineChartCard from '../../../components/charts/LineChartCard'
import BarChartCard from '../../../components/charts/BarChartCard'
import RadarChartCard from '../../../components/charts/RadarChartCard'

// Mock data for instructor dashboard (frontend-only demo)
const mockScores = [
  { semester: 'Học kỳ 1', tqi: 4.1 },
  { semester: 'Học kỳ 2', tqi: 4.3 }
]

const mockFeatureImportance = [
  { name: 'clarity', value: 80 },
  { name: 'fairness', value: 70 },
  { name: 'interaction', value: 65 },
  { name: 'support', value: 75 },
  { name: 'motivation', value: 60 },
  { name: 'course fit', value: 68 }
]

export default function DashboardPage() {
  const tqi = useMemo(() => {
    // average of mock tqi
    if (mockScores.length === 0) return 0
    return Number((mockScores.reduce((s, i) => s + i.tqi, 0) / mockScores.length).toFixed(1))
  }, [])

  const handleExportCsv = () => {
    const rows: string[][] = [
      ['TQI theo học kỳ'],
      ['Học kỳ', 'TQI'],
      ...mockScores.map((s) => [s.semester, s.tqi.toString()]),
      [],
      ['Feature importance'],
      ['Feature', 'Score'],
      ...mockFeatureImportance.map((f) => [f.name, f.value.toString()])
    ]

    const csvContent = rows.map((row) => row.map((v) => `"${v}"`).join(',')).join('\n')
    const blob = new Blob([`\uFEFF${csvContent}`], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'instructor-dashboard.csv'
    link.click()
    URL.revokeObjectURL(url)
  }

  const handleExportPdf = () => {
    const pdf = new jsPDF({ unit: 'mm', format: 'a4' })
    let y = 14
    pdf.setFontSize(18)
    pdf.text('Instructor Dashboard', 14, y)
    y += 8
    pdf.setFontSize(12)
    pdf.text('TQI theo học kỳ', 14, y)
    y += 6
    mockScores.forEach((s) => {
      pdf.text(`${s.semester}: ${s.tqi}`, 14, y)
      y += 6
    })
    y += 4
    pdf.text('Feature importance', 14, y)
    y += 6
    mockFeatureImportance.forEach((f) => {
      pdf.text(`${f.name}: ${f.value}`, 14, y)
      y += 6
    })
    pdf.save('instructor-dashboard.pdf')
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ background: '#fff', borderRadius: 20, padding: 24, border: '1px solid #D7E1F0' }}>
        <PageHeader
          title="Tổng quan"
          description="Giảng viên xem tổng quan chất lượng giảng dạy cá nhân"
          extra={(
            <Space>
                  <Button icon={<DownloadOutlined />} size="large" style={{ minHeight: 44 }} onClick={handleExportCsv}>
                    Export CSV
                  </Button>
                  <Button icon={<FilePdfOutlined />} size="large" style={{ minHeight: 44 }} onClick={handleExportPdf}>
                    Export PDF
                  </Button>
            </Space>
          )}
        />
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={6}>
          <StatCard title="Teaching Quality Index" value={`${tqi}/5`} />
        </Col>
        <Col xs={24} lg={6}>
          <StatCard title="Xếp hạng trong khoa" value={`#${3}`} />
        </Col>
        <Col xs={24} lg={6}>
          <StatCard title="Số phản hồi nhận được" value={42} />
        </Col>
        <Col xs={24} lg={6}>
          <StatCard title="Xu hướng tăng/giảm" value={`+0.2`} />
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <LineChartCard data={mockScores.map((s) => ({ name: s.semester, value: s.tqi }))} />
        </Col>

        <Col xs={24} lg={12}>
          {/* BarChartCard expects DashboardScoreItem[]; map feature importance to that shape */}
          <BarChartCard data={mockFeatureImportance.map((f) => ({ subject: f.name, score: f.value, semester: 'Học kỳ 1' })) as DashboardScoreItem[]} />
        </Col>
      </Row>

      <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
        <h3 style={{ margin: 0, color: '#163253' }}>Feature importance hiển thị</h3>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <RadarChartCard data={[{ name: 'Lý thuyết', value: 70 }, { name: 'Thực hành', value: 80 }, { name: 'Tự học', value: 90 }]} />
        </Col>
      </Row>
    </div>
  )
}
