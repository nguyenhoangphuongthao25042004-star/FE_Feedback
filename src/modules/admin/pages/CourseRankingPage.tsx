import React, { useEffect, useMemo, useState } from 'react'
import { Row, Col, Card, Select, Table, Tag, Empty, Radio, Button } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { ArrowUpOutlined, ArrowDownOutlined, MinusOutlined, FilterOutlined, FilterFilled } from '@ant-design/icons'
import PageHeader from '../../../components/layout/PageHeader'
import { useUiStore } from '../../../stores/ui.store'

type CourseRow = {
  id: string
  subject: string
  responses: number
  qi: number
  difficulty: 'Dễ' | 'Trung bình' | 'Khó'
  trend: number // delta from previous period
  alert?: boolean
}

// --- Helpers / Business logic ---
// Assumptions made:
// - trend in the data may be either a percent (e.g. 12 for 12%) or a fraction (e.g. 0.12 for 12%).
//   normalizeTrendToPercent will convert small absolute values (<=1) by multiplying by 100.
// - difficulty in data is categorical; map to numeric scale for status rules:
//   Dễ -> 2.0, Trung bình -> 3.5, Khó -> 4.5
// - QI values may be >5 in some datasets; normalizeQi will convert >5 to a 0-5 scale by dividing by 2.

type TrendInfo = { label: string; color: string; icon: React.ReactNode | null }
type StatusInfo = { label: string; color: string }

function normalizeTrendToPercent(t: number): number {
  if (t === null || t === undefined || Number.isNaN(t)) return 0
  // If the absolute value is <= 1, assume it's a fraction and convert to percent
  return Math.abs(t) <= 1 ? t * 100 : t
}

function difficultyToNumber(d: CourseRow['difficulty'] | number): number {
  if (typeof d === 'number') return d
  switch (d) {
    case 'Dễ':
      return 2.0
    case 'Trung bình':
      return 3.5
    case 'Khó':
      return 4.5
    default:
      return 3.5
  }
}

function normalizeQi(q: number): number {
  if (q === null || q === undefined || Number.isNaN(q)) return 0
  return q > 5 ? q / 2 : q
}

// Difficulty styles copied from student CoursesPage to keep visual parity
const difficultyTagStyleMapAdmin: Record<NonNullable<CourseRow['difficulty']>, { background: string; color: string; borderColor: string }> = {
  'Dễ': { background: '#EAF7EE', color: '#389E0D', borderColor: '#D1F0DC' },
  'Trung bình': { background: '#E8F1FF', color: '#2F5E9E', borderColor: '#D5E6FF' },
  'Khó': { background: '#FDECEF', color: '#CF1322', borderColor: '#F7D7DE' }
}

function getTrendLabel(trend_value: number): TrendInfo {
  const p = normalizeTrendToPercent(trend_value)
  if (p > 5) {
    return { label: `Tăng ${p.toFixed(0)}%`, color: '#1DA57A', icon: <ArrowUpOutlined style={{ color: '#1DA57A', fontSize: 16 }} /> }
  }

  if (p < -5) {
    return { label: `Giảm ${Math.abs(p).toFixed(0)}%`, color: '#D9534F', icon: <ArrowDownOutlined style={{ color: '#D9534F', fontSize: 16 }} /> }
  }

  return { label: 'Ổn định', color: '#8C9AAE', icon: <MinusOutlined style={{ color: '#8C9AAE', fontSize: 16 }} /> }
}

function getTrendKey(trend_value: number) {
  const p = normalizeTrendToPercent(trend_value)
  if (p > 5) return 'up'
  if (p < -5) return 'down'
  return 'stable'
}

function getStatus(qiRaw: number, trend_value: number, difficultyRaw: CourseRow['difficulty'] | number): StatusInfo {
  const qi = normalizeQi(qiRaw)
  const trend = normalizeTrendToPercent(trend_value)
  const difficulty = difficultyToNumber(difficultyRaw)

  // Nguy cơ cao
  if (qi < 2.5 || (qi < 3 && trend < -10) || (difficulty > 4 && qi < 3)) {
    return { label: 'Nguy cơ cao', color: 'red' }
  }

  // Cần theo dõi
  if (qi < 3.5 || trend < -5 || difficulty > 3.5) {
    return { label: 'Cần theo dõi', color: 'orange' }
  }

  // Ổn định
  return { label: 'Ổn định', color: 'green' }
}

// cardStyle removed (not used after removing the search card)
const cardStyle = {
  borderRadius: 20,
  border: '1px solid #D7E1F0',
  boxShadow: '0 12px 28px rgba(0, 45, 109, 0.08)'
} as const

export default function CourseRankingPage() {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<CourseRow[]>([])
  const searchKeyword = useUiStore((state) => state.searchKeyword)
  const [difficulty, setDifficulty] = useState<CourseRow['difficulty'] | undefined>(undefined)
  const [trendFilter, setTrendFilter] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true

    async function load() {
      try {
        const res = await fetch('/api/admin/course-ranking')
        if (!res.ok) throw new Error('network')
        const json = (await res.json()) as CourseRow[]
        if (mounted) setData(json)
      } catch {
        if (mounted) {
          // fallback mock data
          setData([
            { id: 'c1', subject: 'Cấu trúc dữ liệu', responses: 124, qi: 2.6, difficulty: 'Khó', trend: -0.4, alert: true },
            { id: 'c2', subject: 'Lập trình web', responses: 98, qi: 4.2, difficulty: 'Trung bình', trend: 0.1 },
            { id: 'c3', subject: 'Cơ sở dữ liệu', responses: 86, qi: 4.0, difficulty: 'Trung bình', trend: 0.0 },
            { id: 'c4', subject: 'Mạng máy tính', responses: 54, qi: 2.9, difficulty: 'Khó', trend: -0.2, alert: true },
            { id: 'c5', subject: 'AI cơ bản', responses: 73, qi: 4.5, difficulty: 'Dễ', trend: 0.3 }
          ])
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

  

  const filtered = useMemo(() => {
    const normalizedKeyword = searchKeyword.trim().toLowerCase()

    return data
      .filter((r) => (normalizedKeyword ? r.subject.toLowerCase().includes(normalizedKeyword) : true))
      .filter((r) => (difficulty ? r.difficulty === difficulty : true))
      .filter((r) => (trendFilter ? getTrendKey(r.trend) === trendFilter : true))
  }, [data, difficulty, searchKeyword, trendFilter])

  // sortConfig: which column is being sorted and in which order
  const [sortConfig, setSortConfig] = useState<{ key: 'responses' | 'qi' | null; order: 'asc' | 'desc' | null }>({ key: null, order: null })

  // Apply sorting to the filtered data according to sortConfig
  const sortedData = useMemo(() => {
    if (!sortConfig.key || !sortConfig.order) return filtered

    const arr = [...filtered]
    const direction = sortConfig.order === 'asc' ? 1 : -1

    if (sortConfig.key === 'responses') {
      arr.sort((a, b) => (a.responses - b.responses) * direction)
    } else if (sortConfig.key === 'qi') {
      arr.sort((a, b) => (normalizeQi(a.qi) - normalizeQi(b.qi)) * direction)
    }

    return arr
  }, [filtered, sortConfig])

  // Small dropdown used as filter UI for sorting (matches screenshot)
  function SortFilterDropdown({ columnKey, confirm, clearFilters }: { columnKey: 'responses' | 'qi'; confirm?: () => void; clearFilters?: () => void }) {
    const [value, setValue] = useState<'asc' | 'desc' | null>(sortConfig.key === columnKey ? sortConfig.order : null)

    return (
      <div style={{ padding: 12, width: 180 }}>
        <Radio.Group
          onChange={(e) => setValue(e.target.value)}
          value={value}
          style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
        >
          <Radio value={'asc'}>Tăng dần</Radio>
          <Radio value={'desc'}>Giảm dần</Radio>
        </Radio.Group>

        <div style={{ borderTop: '1px solid #EEF2F7', marginTop: 12, paddingTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Button
            type="text"
            onClick={() => {
              setValue(null)
              setSortConfig({ key: null, order: null })
              if (clearFilters) {
                clearFilters()
              }
              if (confirm) {
                confirm()
              }
            }}
          >
            Reset
          </Button>
          <Button
            type="primary"
            onClick={() => {
              setSortConfig({ key: columnKey, order: value })
              if (confirm) {
                confirm()
              }
            }}
          >
            OK
          </Button>
        </div>
      </div>
    )
  }

  // Dropdown for filtering difficulty (single choice)
  function DifficultyFilterDropdown({ confirm, clearFilters }: { confirm?: () => void; clearFilters?: () => void }) {
    const options: CourseRow['difficulty'][] = ['Dễ', 'Trung bình', 'Khó']
    const [value, setValue] = useState<CourseRow['difficulty'] | null>(difficulty ?? null)

    return (
      <div style={{ padding: 12, width: 180 }}>
        <Radio.Group
          onChange={(e) => setValue(e.target.value)}
          value={value}
          style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
        >
          {options.map((o) => (
            <Radio key={o} value={o}>
              {o}
            </Radio>
          ))}
        </Radio.Group>

        <div style={{ borderTop: '1px solid #EEF2F7', marginTop: 12, paddingTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Button
            type="text"
            onClick={() => {
              setValue(null)
              setDifficulty(undefined)
              if (clearFilters) clearFilters()
              if (confirm) confirm()
            }}
          >
            Reset
          </Button>
          <Button
            type="primary"
            onClick={() => {
              setDifficulty(value ?? undefined)
              if (confirm) confirm()
            }}
          >
            OK
          </Button>
        </div>
      </div>
    )
  }

  // Dropdown for filtering trend: up/down/stable
  function TrendFilterDropdown({ confirm, clearFilters }: { confirm?: () => void; clearFilters?: () => void }) {
    const options = [
      { key: 'up', label: 'Tăng dần' },
      { key: 'down', label: 'Giảm dần' },
      { key: 'stable', label: 'Ổn định' }
    ] as const

    const [value, setValue] = useState<string | null>(trendFilter ?? null)

    return (
      <div style={{ padding: 12, width: 180 }}>
        <Radio.Group
          onChange={(e) => setValue(e.target.value)}
          value={value}
          style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
        >
          {options.map((o) => (
            <Radio key={o.key} value={o.key}>
              {o.label}
            </Radio>
          ))}
        </Radio.Group>

        <div style={{ borderTop: '1px solid #EEF2F7', marginTop: 12, paddingTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Button
            type="text"
            onClick={() => {
              setValue(null)
              setTrendFilter(null)
              if (clearFilters) clearFilters()
              if (confirm) confirm()
            }}
          >
            Reset
          </Button>
          <Button
            type="primary"
            onClick={() => {
              setTrendFilter(value)
              if (confirm) confirm()
            }}
          >
            OK
          </Button>
        </div>
      </div>
    )
  }

  const columns: ColumnsType<CourseRow> = [
    {
      title: 'Thứ hạng',
      dataIndex: 'rank',
      key: 'rank',
      width: 200,
      align: 'center',
      render: (_: unknown, __: unknown, index: number) => <div style={{ fontWeight: 700 }}>{index + 1}</div>
    },
    {
      title: 'Tên môn',
      dataIndex: 'subject',
      key: 'subject',
      align: 'center',
      render: (text: string) => <div style={{ color: '#163253', fontWeight: 600 }}>{text}</div>
    },
    {
      title: 'Số phản hồi',
      dataIndex: 'responses',
      key: 'responses',
      width: 140,
      align: 'center',
      filterDropdown: (props) => (props.visible ? <SortFilterDropdown columnKey="responses" {...props} /> : null),
      filterIcon: () => (sortConfig.key === 'responses' ? <FilterFilled style={{ color: '#000' }} /> : <FilterOutlined style={{ color: '#000' }} />)
    },
    {
      title: 'QI môn',
      dataIndex: 'qi',
      key: 'qi',
      width: 200,
      align: 'center',
  filterDropdown: (props) => (props.visible ? <SortFilterDropdown columnKey="qi" {...props} /> : null),
  filterIcon: () => (sortConfig.key === 'qi' ? <FilterFilled style={{ color: '#000' }} /> : <FilterOutlined style={{ color: '#000' }} />),
      render: (v: number) => {
        const normalized = v > 5 ? v / 2 : v
        return <div style={{ color: '#163253', fontWeight: 400 }}>{normalized.toFixed(1)}/5</div>
      }
    },
    {
      title: 'Độ khó',
      dataIndex: 'difficulty',
      key: 'difficulty',
      width: 200,
      align: 'center',
      filterDropdown: (props) => (props.visible ? <DifficultyFilterDropdown {...props} /> : null),
      filterIcon: () => (difficulty ? <FilterFilled style={{ color: '#163253' }} /> : <FilterOutlined style={{ color: '#163253' }} />),
      render: (value: CourseRow['difficulty']) => {
        const style = difficultyTagStyleMapAdmin[value]
        return (
          <Tag
            style={{
              background: style.background,
              color: style.color,
              borderColor: style.borderColor,
              borderRadius: 999,
              paddingInline: 12
            }}
          >
            {value}
          </Tag>
        )
      }
    },
    {
      title: 'Xu hướng',
      dataIndex: 'trend',
      key: 'trend',
      width: 200,
      align: 'center',
      filterDropdown: (props) => (props.visible ? <TrendFilterDropdown {...props} /> : null),
      filterIcon: () => (trendFilter ? <FilterFilled style={{ color: '#163253' }} /> : <FilterOutlined style={{ color: '#163253' }} />),
      render: (t: number) => {
        const info = getTrendLabel(t)
        return (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            {info.icon}
            <span style={{ color: info.color, fontWeight: 600 }}>{info.label}</span>
          </div>
        )
      }
    },
    {
      title: 'Trạng thái cảnh báo',
      dataIndex: 'alert',
      key: 'alert',
      width: 200,
      align: 'center',
      render: (_: boolean, record: CourseRow) => {
        const status = getStatus(record.qi, record.trend, record.difficulty)
        return (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Tag color={status.color} style={{ fontWeight: 600 }}>{status.label}</Tag>
          </div>
        )
      }
    }
  ]

  

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24}}>
      <div style={{ background: '#FFFFFF', border: '1px solid #E8EEF8', borderRadius: 16, padding: 28, boxShadow: '0 8px 20px rgba(28,61,102,0.04)' }}>
        <Row align="top" justify="space-between">
          <Col flex="auto">
            <PageHeader title="Xếp hạng môn học" description="Hiển thị bảng xếp hạng các môn học" contentGap={8} />
            </Col>
            <Col style={{ display: 'flex', justifyContent: 'flex-end', minWidth: 240 }}>
              <div style={{ width: 450 }}>
                <div style={{ fontSize: 16, color: '#42546B', marginBottom: 6 }}></div>
                <Select allowClear placeholder="Mức độ khó" size="large" style={{ width: '100%', fontSize: 16 }} value={difficulty} onChange={(v) => setDifficulty(v)}>
                  <Select.Option value="Dễ">Dễ</Select.Option>
                <Select.Option value="Trung bình">Trung bình</Select.Option>
                <Select.Option value="Khó">Khó</Select.Option>
              </Select>
            </div>
          </Col>
        </Row>
      </div>

        <Card style={cardStyle} bodyStyle={{ padding: 0 }}>
          {filtered.length === 0 && !loading ? (
            <Empty description="Không có dữ liệu" style={{ padding: 40 }} />
          ) : (
            <Table
              dataSource={sortedData}
              loading={loading}
              rowKey="id"
              columns={columns}
              size="middle"
              pagination={{ pageSize: 10, position: ['bottomRight'] }}
            />
          )}
        </Card>
    </div>
  )
}
