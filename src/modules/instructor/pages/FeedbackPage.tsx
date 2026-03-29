import { useEffect, useMemo, useState } from 'react'
import { Alert, Card, Col, Empty, Grid, Row, Select, Table, Tabs, Tag, Typography } from 'antd'
import type { ColumnsType } from 'antd/es/table'

import PageHeader from '../../../components/layout/PageHeader'
import {
  getInstructorFeedbackList,
  getInstructorFeedbackTopics,
  type InstructorFeedbackItem,
  type InstructorFeedbackTopic
} from '../api/instructorInsights.service'

const surfaceCardStyle = {
  background: '#FFFFFF',
  border: '1px solid #D7E1F0',
  borderRadius: 20,
  boxShadow: '0 14px 30px rgba(28, 61, 102, 0.08)'
} as const

const topicAccentMap: Record<string, string> = {
  'Độ rõ ràng': '#2F5E9E',
  'Tương tác lớp học': '#138A72',
  'Tiêu chí đánh giá': '#D97706'
}

const satisfactionColorMap: Record<InstructorFeedbackItem['satisfaction'], string> = {
  'Rất không hài lòng': 'error',
  'Chưa hài lòng': 'warning',
  'Trung lập': 'default',
  'Hài lòng': 'processing',
  'Rất hài lòng': 'success'
}

const satisfactionBarColorMap: Record<InstructorFeedbackItem['satisfaction'], string> = {
  'Rất không hài lòng': '#ff4d4f',
  'Chưa hài lòng': '#faad14',
  'Trung lập': '#d9d9d9',
  'Hài lòng': '#1677ff',
  'Rất hài lòng': '#52c41a'
}

const topicOptions = ['Tất cả chủ đề', 'Độ rõ ràng', 'Tương tác lớp học', 'Tiêu chí đánh giá']
const satisfactionOptions = ['Tất cả mức hài lòng', 'Rất không hài lòng', 'Chưa hài lòng', 'Trung lập', 'Hài lòng', 'Rất hài lòng']
const semesterOptions = [
  { value: 'Tất cả học kỳ', label: 'Tất cả học kỳ' },
  { value: '2025-2026-HK2', label: '2025 - 2026 - Học kỳ 2' },
  { value: '2025-2026-HK1', label: '2025 - 2026 - Học kỳ 1' }
]

type KeywordCloudProps = {
  topic: InstructorFeedbackTopic
  isMobile: boolean
  isTablet: boolean
}

function FeedbackLikertProfile({ item }: { item: InstructorFeedbackItem }) {
  const levels = ['Rất không hài lòng', 'Chưa hài lòng', 'Trung lập', 'Hài lòng', 'Rất hài lòng'] as const
  const scoreByLevel: Record<(typeof levels)[number], number> = {
    'Rất không hài lòng': 1,
    'Chưa hài lòng': 2,
    'Trung lập': 3,
    'Hài lòng': 4,
    'Rất hài lòng': 5
  }
  const currentScore = scoreByLevel[item.satisfaction]

  return (
    <div
      style={{
        minWidth: 0,
        borderRadius: 14,
        background: '#F8FBFF',
        border: '1px solid #D7E1F0',
        padding: '12px 12px 10px'
      }}
    >
      <Typography.Text strong style={{ color: '#163253', display: 'block', marginBottom: 10 }}>
        Likert của phản hồi này
      </Typography.Text>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ height: 12, borderRadius: 999, background: '#E8EEF7', overflow: 'hidden' }}>
          <div
            style={{
              width: `${(currentScore / 5) * 100}%`,
              height: '100%',
              background: satisfactionBarColorMap[item.satisfaction]
            }}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
          <Typography.Text style={{ color: '#163253', fontSize: 12, fontWeight: 700 }}>
            {item.satisfaction}
          </Typography.Text>
          <Typography.Text style={{ color: '#61758A', fontSize: 12 }}>
            {currentScore}/5
          </Typography.Text>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, minmax(0, 1fr))', gap: 6 }}>
          {levels.map((level, index) => (
            <Typography.Text
              key={`${item.id}-${level}`}
              style={{
                textAlign: 'center',
                fontSize: 10,
                color: index + 1 === currentScore ? '#163253' : '#94A3B8',
                fontWeight: index + 1 === currentScore ? 700 : 500
              }}
            >
              {index + 1}
            </Typography.Text>
          ))}
        </div>
      </div>
    </div>
  )
}

function KeywordCloud({ topic, isMobile, isTablet }: KeywordCloudProps) {
  const accentColor = topicAccentMap[topic.title] ?? '#2F5E9E'
  const sortedKeywords = [...topic.keywords].sort((a, b) => b.weight - a.weight)
  const centerKeyword = sortedKeywords[0]
  const surroundingKeywords = sortedKeywords.slice(1, 20)
  const rows = [
    surroundingKeywords.slice(0, 4),
    surroundingKeywords.slice(4, 8),
    surroundingKeywords.slice(8, 11),
    surroundingKeywords.slice(11, 15),
    surroundingKeywords.slice(15, 19)
  ]
  const getFontSize = (index: number) => {
    if (index === 0) return isMobile ? 20 : isTablet ? 26 : 30
    if (index === 1) return isMobile ? 16 : isTablet ? 20 : 22
    if (index === 2) return isMobile ? 14 : isTablet ? 17 : 19
    if (index === 3) return isMobile ? 12 : isTablet ? 15 : 16
    if (index <= 6) return isMobile ? 10 : isTablet ? 12 : 13
    return isMobile ? 9 : isTablet ? 11 : 12
  }
  const getOpacity = (index: number) => Math.max(0.54, 0.92 - index * 0.02)
  let runningIndex = 1

  return (
    <div
      style={{
        minHeight: isMobile ? 240 : 270,
        borderRadius: 18,
        background: `radial-gradient(circle at center, ${accentColor}10 0%, transparent 68%)`,
        padding: isMobile ? '14px 10px' : '16px 18px'
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: isMobile ? 8 : 10,
          width: '100%',
          minHeight: isMobile ? 212 : 236,
          maxWidth: isMobile ? '100%' : '94%'
        }}
      >
        {rows.map((row, rowIndex) => {
          const isCenterRow = rowIndex === 2

          return (
            <div
              key={`${topic.key}-row-${rowIndex}`}
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                alignItems: 'center',
                gap: isMobile ? 10 : 14,
                width: '100%',
                textAlign: 'center'
              }}
            >
              {isCenterRow &&
                row.slice(0, 1).map((keyword) => {
                  const currentIndex = runningIndex++
                  return (
                    <span
                      key={`${topic.key}-${keyword.word}`}
                      style={{
                        fontSize: getFontSize(currentIndex),
                        fontWeight: 700,
                        color: accentColor,
                        lineHeight: 1.15,
                        opacity: getOpacity(currentIndex),
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {keyword.word}
                    </span>
                  )
                })}

              {isCenterRow && centerKeyword && (
                <span
                  key={`${topic.key}-${centerKeyword.word}`}
                  style={{
                    fontSize: getFontSize(0),
                    fontWeight: 800,
                    color: accentColor,
                    lineHeight: 1.1,
                    letterSpacing: 0.2,
                    opacity: 1,
                    whiteSpace: 'nowrap'
                  }}
                >
                  {centerKeyword.word}
                </span>
              )}

              {row
                .slice(isCenterRow ? 1 : 0)
                .map((keyword) => {
                  const currentIndex = runningIndex++
                  return (
                    <span
                      key={`${topic.key}-${keyword.word}`}
                      style={{
                        fontSize: getFontSize(currentIndex),
                        fontWeight: 700,
                        color: accentColor,
                        lineHeight: 1.15,
                        opacity: getOpacity(currentIndex),
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {keyword.word}
                    </span>
                  )
                })}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function FeedbackPage() {
  const screens = Grid.useBreakpoint()
  const isMobile = !screens.md
  const isTablet = Boolean(screens.md && !screens.xxl)
  const shouldStackThirdFilter = Boolean(screens.md && !screens.xl)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [feedbackTopics, setFeedbackTopics] = useState<InstructorFeedbackTopic[]>([])
  const [feedbackList, setFeedbackList] = useState<InstructorFeedbackItem[]>([])
  const [selectedTopic, setSelectedTopic] = useState('Tất cả chủ đề')
  const [selectedSemester, setSelectedSemester] = useState('Tất cả học kỳ')
  const [selectedSatisfaction, setSelectedSatisfaction] = useState('Tất cả mức hài lòng')

  useEffect(() => {
    let mounted = true

    const load = async () => {
      setLoading(true)
      setError('')
      try {
        const [topics, list] = await Promise.all([getInstructorFeedbackTopics(), getInstructorFeedbackList()])
        if (mounted) {
          setFeedbackTopics(topics)
          setFeedbackList(list)
        }
      } catch {
        if (mounted) {
          setError('Không thể tải dữ liệu phản hồi sinh viên. Vui lòng thử lại.')
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    load()
    return () => {
      mounted = false
    }
  }, [])

  const filteredFeedback = useMemo(() => {
    return feedbackList.filter((item) => {
      const matchTopic = selectedTopic === 'Tất cả chủ đề' || item.topic === selectedTopic
      const matchSemester = selectedSemester === 'Tất cả học kỳ' || item.semester === selectedSemester
      const matchSatisfaction = selectedSatisfaction === 'Tất cả mức hài lòng' || item.satisfaction === selectedSatisfaction
      return matchTopic && matchSemester && matchSatisfaction
    })
  }, [selectedTopic, selectedSemester, selectedSatisfaction, feedbackList])

  const visibleFeedback = useMemo(
    () => filteredFeedback.filter((item) => item.isSafeToDisplay),
    [filteredFeedback]
  )

  const totalFeedbackCount = feedbackList.length
  const hasAnyFeedback = totalFeedbackCount > 0

  const columns: ColumnsType<InstructorFeedbackItem> = [
    {
      title: 'Phản hồi ẩn danh',
      dataIndex: 'text',
      key: 'text',
      render: (value: string) => <Typography.Text style={{ color: '#163253', lineHeight: 1.6 }}>{value}</Typography.Text>
    },
    {
      title: 'Chủ đề',
      dataIndex: 'topic',
      key: 'topic',
      width: 180,
      align: 'center',
      render: (value: string) => <Tag color="processing">{value}</Tag>
    },
    {
      title: 'Học kỳ',
      dataIndex: 'semester',
      key: 'semester',
      width: 150,
      align: 'center'
    },
    {
      title: 'Mức hài lòng',
      dataIndex: 'satisfaction',
      key: 'satisfaction',
      width: 160,
      align: 'center',
      render: (value: InstructorFeedbackItem['satisfaction']) => <Tag color={satisfactionColorMap[value]}>{value}</Tag>
    },
    {
      title: 'Likert cá nhân',
      dataIndex: 'satisfaction',
      key: 'likertProfile',
      width: 320,
      render: (_value, record) => <FeedbackLikertProfile item={record} />
    }
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <Card style={surfaceCardStyle} bodyStyle={{ padding: 24 }}>
        <PageHeader
          title="Phản hồi sinh viên"
          description="Xem phản hồi ẩn danh của sinh viên theo từng chủ đề, học kỳ và mức độ hài lòng"
        />
      </Card>

      {error && <Alert type="error" showIcon message={error} style={{ borderRadius: 14 }} />}

      <Tabs
        defaultActiveKey="topics"
        items={[
          {
            key: 'topics',
            label: 'Chủ đề phản hồi',
            children: loading ? (
              <Card style={surfaceCardStyle}><div style={{ minHeight: 220, display: 'grid', placeItems: 'center' }}>Đang tải dữ liệu...</div></Card>
            ) : feedbackTopics.length === 0 ? (
              <Card style={surfaceCardStyle}><Empty description="Chưa có chủ đề phản hồi" /></Card>
            ) : (
              <Row gutter={[16, 16]}>
                {feedbackTopics.map((topic) => (
                  <Col key={topic.key} xs={24} md={12} xl={8}>
                    <Card style={{ ...surfaceCardStyle, height: '100%' }} bodyStyle={{ padding: 20, height: '100%' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, height: '100%' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start' }}>
                          <div>
                            <Typography.Title level={4} style={{ margin: 0, color: '#163253' }}>{topic.title}</Typography.Title>
                            <Typography.Text style={{ color: '#42546B' }}>{topic.count} phản hồi</Typography.Text>
                          </div>
                          <span style={{ width: 12, height: 12, borderRadius: 999, background: topicAccentMap[topic.title] ?? '#2F5E9E', flexShrink: 0, marginTop: 6 }} />
                        </div>

                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 12
                          }}
                        >
                          <Typography.Text style={{ color: '#42546B', lineHeight: 1.6 }}>
                            {topic.summary}
                          </Typography.Text>
                        </div>

                        <KeywordCloud topic={topic} isMobile={isMobile} isTablet={isTablet} />
                      </div>
                    </Card>
                  </Col>
                ))}
              </Row>
            )
          },
          {
            key: 'list',
            label: 'Danh sách phản hồi',
            disabled: !hasAnyFeedback,
            children: (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <Card style={surfaceCardStyle} bodyStyle={{ padding: 20 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <div
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 10
                      }}
                    >
                      <Typography.Text strong style={{ color: '#163253', fontSize: 16 }}>
                        Tổng số phản hồi đã nhận: {totalFeedbackCount}
                      </Typography.Text>
                    </div>

                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: isMobile ? '1fr' : shouldStackThirdFilter ? 'repeat(2, minmax(0, 1fr))' : 'repeat(3, minmax(0, 1fr))',
                        gap: 16
                      }}
                    >
                      <Select size="large" value={selectedTopic} onChange={setSelectedTopic} options={topicOptions.map((item) => ({ value: item, label: item }))} />
                      <Select size="large" value={selectedSemester} onChange={setSelectedSemester} options={semesterOptions} />
                      <Select
                        size="large"
                        value={selectedSatisfaction}
                        onChange={setSelectedSatisfaction}
                        options={satisfactionOptions.map((item) => ({ value: item, label: item }))}
                        style={shouldStackThirdFilter ? { gridColumn: '1 / -1' } : undefined}
                      />
                    </div>
                  </div>
                </Card>

                {loading ? (
                  <Card style={surfaceCardStyle}><div style={{ minHeight: 220, display: 'grid', placeItems: 'center' }}>Đang tải dữ liệu...</div></Card>
                ) : isMobile || isTablet ? (
                  visibleFeedback.length === 0 ? (
                    <Card style={surfaceCardStyle}><Empty description="Không có phản hồi phù hợp với bộ lọc hiện tại" /></Card>
                  ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: isTablet ? 'repeat(2, minmax(0, 1fr))' : '1fr', gap: 16 }}>
                      {visibleFeedback.map((item) => (
                        <Card key={item.id} style={surfaceCardStyle} bodyStyle={{ padding: 18 }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                              <Tag color="processing">{item.topic}</Tag>
                              <Tag color={satisfactionColorMap[item.satisfaction]}>{item.satisfaction}</Tag>
                              <Tag>{item.semester}</Tag>
                            </div>
                            <FeedbackLikertProfile item={item} />
                            <Typography.Text style={{ color: '#163253', lineHeight: 1.7 }}>{item.text}</Typography.Text>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )
                ) : (
                  <Card style={surfaceCardStyle} bodyStyle={{ padding: 16 }}>
                    <Table rowKey="id" columns={columns} dataSource={visibleFeedback} pagination={{ pageSize: 5, showSizeChanger: false }} locale={{ emptyText: 'Không có phản hồi phù hợp với bộ lọc hiện tại' }} />
                  </Card>
                )}
              </div>
            )
          }
        ]}
      />
    </div>
  )
}
