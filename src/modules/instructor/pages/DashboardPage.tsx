import { useMemo } from 'react'
import { Row, Col, Space, Button, Grid, Typography } from 'antd'
import { DownloadOutlined, FilePdfOutlined } from '@ant-design/icons'
import { jsPDF } from 'jspdf'

import StatCard from '../../../components/layout/StatCard'
import type { DashboardScoreItem } from '../../student/types/student.types'
import LineChartCard from '../../../components/charts/LineChartCard'
import BarChartCard from '../../../components/charts/BarChartCard'
import RadarChartCard from '../../../components/charts/RadarChartCard'

const mockScores = [
  { semester: 'Học kỳ 1', tqi: 4.1 },
  { semester: 'Học kỳ 2', tqi: 4.3 }
]

const mockFeatureImportance = [
  { name: 'Clarity', value: 80 },
  { name: 'Fairness', value: 70 },
  { name: 'Interaction', value: 65 },
  { name: 'Support', value: 75 },
  { name: 'Motivation', value: 60 },
  { name: 'Course Fit', value: 68 }
]

export default function DashboardPage() {
  const screens = Grid.useBreakpoint()
  const isMobile = !screens.md

  const tqi = useMemo(() => {
    if (mockScores.length === 0) return 0
    return Number((mockScores.reduce((sum, item) => sum + item.tqi, 0) / mockScores.length).toFixed(1))
  }, [])

  const handleExportCsv = () => {
    const rows: string[][] = [
      ['Chỉ số chất lượng giảng dạy theo học kỳ'],
      ['Học kỳ', 'TQI'],
      ...mockScores.map((score) => [score.semester, score.tqi.toString()]),
      [],
      ['Các tiêu chí đánh giá'],
      ['Tiêu chí', 'Điểm'],
      ...mockFeatureImportance.map((feature) => [feature.name, feature.value.toString()])
    ]

    const csvContent = rows.map((row) => row.map((value) => `"${value}"`).join(',')).join('\n')
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
    pdf.text('Chỉ số chất lượng giảng dạy theo học kỳ', 14, y)
    y += 6

    mockScores.forEach((score) => {
      pdf.text(`${score.semester}: ${score.tqi}`, 14, y)
      y += 6
    })

    y += 4
    pdf.text('Các tiêu chí đánh giá', 14, y)
    y += 6

    mockFeatureImportance.forEach((feature) => {
      pdf.text(`${feature.name}: ${feature.value}`, 14, y)
      y += 6
    })

    pdf.save('instructor-dashboard.pdf')
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ background: '#fff', borderRadius: 20, padding: isMobile ? 20 : 24, border: '1px solid #D7E1F0' }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: isMobile ? 'center' : 'stretch',
            textAlign: isMobile ? 'center' : 'left',
            gap: 16
          }}
        >
          <div style={{ width: '100%' }}>
            <Typography.Title
              level={1}
              style={{
                margin: 0,
                color: '#163253',
                fontSize: isMobile ? 24 : 32,
                fontWeight: 800,
                letterSpacing: 0.4
              }}
            >
              Tổng quan
            </Typography.Title>
            <Typography.Text
              style={{
                display: 'block',
                marginTop: 8,
                color: '#42546B',
                fontSize: isMobile ? 15 : 16,
                lineHeight: 1.6
              }}
            >
              Giảng viên xem tổng quan chất lượng giảng dạy cá nhân
            </Typography.Text>
          </div>

          <Space wrap style={{ justifyContent: isMobile ? 'center' : 'flex-start' }}>
            <Button icon={<DownloadOutlined />} size="large" style={{ minHeight: 44 }} onClick={handleExportCsv}>
              Export CSV
            </Button>
            <Button icon={<FilePdfOutlined />} size="large" style={{ minHeight: 44 }} onClick={handleExportPdf}>
              Export PDF
            </Button>
          </Space>
        </div>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={6}>
          <StatCard title="Chỉ số chất lượng giảng dạy" value={`${tqi}/5`} />
        </Col>
        <Col xs={24} lg={6}>
          <StatCard title="Xếp hạng trong khoa" value={`#${3}`} />
        </Col>
        <Col xs={24} lg={6}>
          <StatCard title="Số phản hồi nhận được" value={42} />
        </Col>
        <Col xs={24} lg={6}>
          <StatCard title="Xu hướng tăng/giảm" value="+0.2" />
        </Col>
      </Row>

      <Row gutter={[16, 16]} align="stretch">
        <Col xs={24} lg={12} style={{ display: 'flex' }}>
          <LineChartCard data={mockScores.map((score) => ({ name: score.semester, value: score.tqi }))} />
        </Col>

        <Col xs={24} lg={12} style={{ display: 'flex' }}>
          <BarChartCard
            data={mockFeatureImportance.map((feature) => ({
              subject: feature.name,
              score: feature.value,
              semester: 'Học kỳ 1'
            })) as DashboardScoreItem[]}
          />
        </Col>
        <Col xs={24} style={{ display: 'flex' }}>
          <RadarChartCard data={[{ name: 'Lý thuyết', value: 70 }, { name: 'Thực hành', value: 80 }, { name: 'Tự học', value: 90 }]} />
        </Col>
      </Row>
    </div>
  )
}
