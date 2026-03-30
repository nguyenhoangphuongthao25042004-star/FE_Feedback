import { useEffect, useMemo, useState } from 'react'
import { ArrowDownOutlined, ArrowUpOutlined, MinusOutlined, FilterOutlined, FilterFilled } from '@ant-design/icons'
import { Button, Card, Grid, Radio, Table, Typography } from 'antd'
import type { ColumnsType } from 'antd/es/table'

import PageHeader from '../../../components/layout/PageHeader'
import { useUiStore } from '../../../stores/ui.store'

type InstructorRow = {
  id: string
  name: string
  department: string
  responses: number
  instructorQi: number
  avgCourseQi: number
  previousInstructorQi?: number | null
}

const cardStyle = {
  borderRadius: 20,
  border: '1px solid #D7E1F0',
  boxShadow: '0 12px 28px rgba(0, 45, 109, 0.08)'
} as const

function normalizeTrendToPercent(t: number) {
  if (t === null || t === undefined || Number.isNaN(t)) return 0
  return Math.abs(t) <= 1 ? t * 100 : t
}

const getTrendConfig = (qiNow: number, qiPrev: number | null) => {
  if (qiPrev == null) {
    return {
      label: 'Ổn định',
      color: '#8C9AAE',
      icon: <MinusOutlined style={{ color: '#8C9AAE', fontSize: 16 }} />,
      percent: null,
      type: 'stable' as const
    }
  }

  const diff = qiNow - qiPrev
  const p = normalizeTrendToPercent(diff)

  if (p > 5) {
    return {
      label: `Tăng ${Math.round(p)}%`,
      color: '#1DA57A',
      icon: <ArrowUpOutlined style={{ color: '#1DA57A', fontSize: 16 }} />,
      percent: Math.round(p),
      type: 'up' as const
    }
  }

  if (p < -5) {
    return {
      label: `Giảm ${Math.round(Math.abs(p))}%`,
      color: '#D9534F',
      icon: <ArrowDownOutlined style={{ color: '#D9534F', fontSize: 16 }} />,
      percent: Math.round(Math.abs(p)),
      type: 'down' as const
    }
  }

  return {
    label: 'Ổn định',
    color: '#8C9AAE',
    icon: <MinusOutlined style={{ color: '#8C9AAE', fontSize: 16 }} />,
    percent: null,
    type: 'stable' as const
  }
}

const MOCK_DATA: InstructorRow[] = [
  { id: 'i1', name: 'Nguyễn Văn A', department: 'Công nghệ thông tin', responses: 124, instructorQi: 4.6, avgCourseQi: 4.3, previousInstructorQi: 4.48 },
  { id: 'i2', name: 'Trần Thị B', department: 'Toán - Tin', responses: 98, instructorQi: 4.2, avgCourseQi: 4.1, previousInstructorQi: 4.32 },
  { id: 'i3', name: 'Lê Văn C', department: 'Vật lý', responses: 76, instructorQi: 3.8, avgCourseQi: 3.9, previousInstructorQi: 3.78 },
  { id: 'i4', name: 'Phạm Thị D', department: 'Hóa học', responses: 52, instructorQi: 3.3, avgCourseQi: 3.6, previousInstructorQi: 3.48 }
]

export default function InstructorRankingPage() {
  const screens = Grid.useBreakpoint()
  const isMobile = !screens.md

  const selectedSemester = useUiStore((state) => state.selectedSemester)
  const searchKeyword = useUiStore((state) => state.searchKeyword)

  const [data, setData] = useState<InstructorRow[] | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [sortConfig, setSortConfig] = useState<{ key: 'responses' | 'instructorQi' | 'avgCourseQi' | null; order: 'asc' | 'desc' | null }>({ key: null, order: null })
  const [trendFilter, setTrendFilter] = useState<'up' | 'down' | 'stable' | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setIsLoading(true)

      try {
        const semesterParam = selectedSemester ? `?semester=${encodeURIComponent(selectedSemester)}` : ''
        const res = await fetch(`/api/admin/instructor-ranking${semesterParam}`)

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`)
        }

        const contentType = res.headers.get('content-type') ?? ''
        if (!contentType.includes('application/json')) {
          throw new Error('Invalid API response')
        }

        const json = await res.json()
        if (!Array.isArray(json)) {
          throw new Error('Invalid ranking payload')
        }

        if (!cancelled) setData(json)
      } catch {
        if (!cancelled) {
          setData(MOCK_DATA)
        }
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    load()

    return () => {
      cancelled = true
    }
  }, [selectedSemester])

  const rowsWithRank = useMemo(() => {
    if (!data) return []

    const sorted = [...data].sort((a, b) => b.instructorQi - a.instructorQi)
    return sorted.map((row, index) => ({ ...row, rank: index + 1 }))
  }, [data])

  const filtered = useMemo(() => {
    const keyword = (searchKeyword ?? '').trim().toLowerCase()
    if (!keyword) return rowsWithRank

    return rowsWithRank.filter((row) => row.name.toLowerCase().includes(keyword))
  }, [rowsWithRank, searchKeyword])

  const sortedData = useMemo(() => {
    let arr = [...filtered]

    if (trendFilter) {
      arr = arr.filter((r) => {
        const prev = r.previousInstructorQi ?? null
        const key = getTrendConfig(r.instructorQi, prev)
        if (trendFilter === 'up') return key.type === 'up'
        if (trendFilter === 'down') return key.type === 'down'
        return key.type === 'stable'
      })
    }

    if (sortConfig.key && sortConfig.order) {
      const dir = sortConfig.order === 'asc' ? 1 : -1
      arr.sort((a, b) => {
        const aVal = sortConfig.key === 'responses' ? a.responses : sortConfig.key === 'instructorQi' ? a.instructorQi : a.avgCourseQi
        const bVal = sortConfig.key === 'responses' ? b.responses : sortConfig.key === 'instructorQi' ? b.instructorQi : b.avgCourseQi
        return (aVal - bVal) * dir
      })
    }

    return arr
  }, [filtered, sortConfig, trendFilter])

  function SortFilterDropdown({ columnKey, confirm, clearFilters }: { columnKey: 'responses' | 'instructorQi' | 'avgCourseQi'; confirm?: () => void; clearFilters?: () => void }) {
    const [value, setValue] = useState<'asc' | 'desc' | null>(sortConfig.key === columnKey ? sortConfig.order : null)

    return (
      <div style={{ padding: 12, width: 180 }}>
        <Radio.Group onChange={(e) => setValue(e.target.value)} value={value} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Radio value="asc">Tăng dần</Radio>
          <Radio value="desc">Giảm dần</Radio>
        </Radio.Group>
        <div style={{ borderTop: '1px solid #EEF2F7', marginTop: 12, paddingTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Button type="text" onClick={() => { setValue(null); setSortConfig({ key: null, order: null }); clearFilters?.(); confirm?.() }}>Reset</Button>
          <Button type="primary" onClick={() => { setSortConfig({ key: columnKey, order: value }); confirm?.() }}>OK</Button>
        </div>
      </div>
    )
  }

  function TrendFilterDropdown({ confirm, clearFilters }: { confirm?: () => void; clearFilters?: () => void }) {
    const [value, setValue] = useState<'up' | 'down' | 'stable' | null>(trendFilter)

    return (
      <div style={{ padding: 12, width: 180 }}>
        <Radio.Group onChange={(e) => setValue(e.target.value)} value={value} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Radio value="up">Tăng</Radio>
          <Radio value="down">Giảm</Radio>
          <Radio value="stable">Ổn định</Radio>
        </Radio.Group>
        <div style={{ borderTop: '1px solid #EEF2F7', marginTop: 12, paddingTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Button type="text" onClick={() => { setValue(null); setTrendFilter(null); clearFilters?.(); confirm?.() }}>Reset</Button>
          <Button type="primary" onClick={() => { setTrendFilter(value); confirm?.() }}>OK</Button>
        </div>
      </div>
    )
  }

  const columns: ColumnsType<InstructorRow & { rank: number }> = [
    {
      title: 'Thứ hạng',
      dataIndex: 'rank',
      key: 'rank',
      width: 100,
      align: 'center',
      render: (value: number) => <Typography.Text style={{ color: '#163253' }}>{value}</Typography.Text>
    },
    {
      title: 'Tên giảng viên',
      dataIndex: 'name',
      key: 'name',
      width: 280,
      align: 'center',
      render: (value: string) => <Typography.Text style={{ color: '#163253' }}>{value}</Typography.Text>
    },
    {
      title: 'Số phản hồi',
      dataIndex: 'responses',
      key: 'responses',
      width: 140,
      align: 'center',
      filterDropdown: (props) => (props.visible ? <SortFilterDropdown columnKey="responses" {...props} /> : null),
      filterIcon: () => (sortConfig.key === 'responses' ? <FilterFilled style={{ color: '#163253' }} /> : <FilterOutlined style={{ color: '#163253' }} />),
      render: (value: number) => <Typography.Text>{value}</Typography.Text>
    },
    {
      title: 'QI giảng viên',
      dataIndex: 'instructorQi',
      key: 'instructorQi',
      width: 140,
      align: 'center',
      filterDropdown: (props) => (props.visible ? <SortFilterDropdown columnKey="instructorQi" {...props} /> : null),
      filterIcon: () => (sortConfig.key === 'instructorQi' ? <FilterFilled style={{ color: '#163253' }} /> : <FilterOutlined style={{ color: '#163253' }} />),
      render: (value: number) => <Typography.Text>{value.toFixed(1)}/5</Typography.Text>
    },
    {
      title: 'QI trung bình các môn',
      dataIndex: 'avgCourseQi',
      key: 'avgCourseQi',
      width: 160,
      align: 'center',
      filterDropdown: (props) => (props.visible ? <SortFilterDropdown columnKey="avgCourseQi" {...props} /> : null),
      filterIcon: () => (sortConfig.key === 'avgCourseQi' ? <FilterFilled style={{ color: '#163253' }} /> : <FilterOutlined style={{ color: '#163253' }} />),
      render: (value: number) => <Typography.Text>{value.toFixed(1)}/5</Typography.Text>
    },
    {
      title: 'Xu hướng',
      key: 'trend',
      width: 160,
      align: 'center',
      filterDropdown: (props) => (props.visible ? <TrendFilterDropdown {...props} /> : null),
      filterIcon: () => (trendFilter ? <FilterFilled style={{ color: '#163253' }} /> : <FilterOutlined style={{ color: '#163253' }} />),
      render: (_value: unknown, record: InstructorRow & { rank: number }) => {
        const trend = getTrendConfig(record.instructorQi, record.previousInstructorQi ?? null)

        return (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            {trend.icon}
            <span style={{ color: trend.color, fontWeight: 600 }}>{trend.label}</span>
          </div>
        )
      }
    }
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ background: '#FFFFFF', border: '1px solid #E8EEF8', borderRadius: 16, padding: 28, boxShadow: '0 8px 20px rgba(28,61,102,0.04)' }}>
        <PageHeader title="Xếp hạng giảng viên" description="Hiển thị bảng xếp hạng giảng viên theo QI" contentGap={8} />
      </div>

      <Card style={cardStyle} bodyStyle={{ padding: 20 }}>
        <Table
          rowKey="id"
          loading={isLoading && !data}
          dataSource={sortedData}
          columns={columns}
          pagination={{ pageSize: isMobile ? 6 : 10, showSizeChanger: false }}
          scroll={{ x: 1000 }}
        />
      </Card>
    </div>
  )
}
