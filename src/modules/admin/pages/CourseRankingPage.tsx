import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { ArrowDownOutlined, ArrowUpOutlined, FilterFilled, FilterOutlined, MinusOutlined } from '@ant-design/icons'
import { Button, Card, Col, Grid, Modal, List, Progress, Radio, Row, Space, Spin, Statistic, Table, Tag, Typography } from 'antd'
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Cell } from 'recharts'
import type { ColumnsType } from 'antd/es/table'
import type { KhuyenNghi } from '../types/drilldown.types'

import PageHeader from '../../../components/layout/PageHeader'
import EmptyState from '../../../components/utility/EmptyState'
import ErrorState from '../../../components/utility/ErrorState'
import { getCourseDetail } from '../api/drilldown.api'
import TrendLineChart from '../components/drilldown/TrendLineChart'

const MAU_CHINH = '#005BAC'

type DoKho = 'Dễ' | 'Trung bình' | 'Khó'
type TrangThai = 'Ổn định' | 'Cần rà soát' | 'Nguy cơ'

type DongMonHoc = {
  rank: number
  id: string
  tenMonHoc: string
  soPhanHoi: number
  qiTrungBinh: number
  qiTrongSo: number
  diemTB: number
  doKho: DoKho
  xuHuong: number
  doTinCay: number
  trangThai: TrangThai
  goiY: string
}

const duLieuMau: DongMonHoc[] = [
  {
    rank: 1,
    id: 'ml101',
    tenMonHoc: 'Nhập môn Học máy',
    soPhanHoi: 184,
    qiTrungBinh: 4.3,
    qiTrongSo: 4.4,
    diemTB: 8.5,
    doKho: 'Khó',
    xuHuong: 7.2,
    doTinCay: 93,
    trangThai: 'Ổn định',
    goiY: 'Môn chất lượng cao'
  },
  {
    rank: 2,
    id: 'web101',
    tenMonHoc: 'Lập trình Web',
    soPhanHoi: 160,
    qiTrungBinh: 4.1,
    qiTrongSo: 4.0,
    diemTB: 8.2,
    doKho: 'Trung bình',
    xuHuong: 3.5,
    doTinCay: 88,
    trangThai: 'Ổn định',
    goiY: 'Theo dõi định kỳ'
  },
  {
    rank: 3,
    id: 'dsa201',
    tenMonHoc: 'Cấu trúc dữ liệu và Giải thuật',
    soPhanHoi: 142,
    qiTrungBinh: 3.9,
    qiTrongSo: 3.8,
    diemTB: 7.7,
    doKho: 'Khó',
    xuHuong: -4.8,
    doTinCay: 82,
    trangThai: 'Cần rà soát',
    goiY: 'Theo dõi định kỳ'
  },
  {
    rank: 4,
    id: 'ai201',
    tenMonHoc: 'Nhập môn Trí tuệ nhân tạo',
    soPhanHoi: 130,
    qiTrungBinh: 2.8,
    qiTrongSo: 2.9,
    diemTB: 7.2,
    doKho: 'Dễ',
    xuHuong: -12.5,
    doTinCay: 79,
    trangThai: 'Nguy cơ',
    goiY: 'Xu hướng giảm mạnh'
  },
  {
    rank: 5,
    id: 'db301',
    tenMonHoc: 'Hệ quản trị cơ sở dữ liệu',
    soPhanHoi: 124,
    qiTrungBinh: 3.7,
    qiTrongSo: 3.6,
    diemTB: 7.9,
    doKho: 'Trung bình',
    xuHuong: -1.2,
    doTinCay: 85,
    trangThai: 'Cần rà soát',
    goiY: 'Theo dõi định kỳ'
  },
  {
    rank: 6,
    id: 'bus102',
    tenMonHoc: 'Giao tiếp trong kinh doanh',
    soPhanHoi: 118,
    qiTrungBinh: 2.7,
    qiTrongSo: 2.8,
    diemTB: 7.5,
    doKho: 'Dễ',
    xuHuong: -6.4,
    doTinCay: 74,
    trangThai: 'Nguy cơ',
    goiY: 'Rà soát phương pháp'
  },
  {
    rank: 7,
    id: 'mkt205',
    tenMonHoc: 'Marketing số',
    soPhanHoi: 105,
    qiTrungBinh: 3.6,
    qiTrongSo: 3.7,
    diemTB: 7.8,
    doKho: 'Trung bình',
    xuHuong: 2.4,
    doTinCay: 76,
    trangThai: 'Ổn định',
    goiY: 'Theo dõi định kỳ'
  },
  {
    rank: 8,
    id: 'eco101',
    tenMonHoc: 'Kinh tế vi mô',
    soPhanHoi: 96,
    qiTrungBinh: 3.1,
    qiTrongSo: 3.2,
    diemTB: 7.3,
    doKho: 'Khó',
    xuHuong: -11.1,
    doTinCay: 68,
    trangThai: 'Nguy cơ',
    goiY: 'Xu hướng giảm mạnh'
  }
]

function mauDoKho(doKho: DoKho) {
  if (doKho === 'Dễ') return { text: '#3B8C2A', bg: '#EEF8EC', border: '#D8F0D2' }
  if (doKho === 'Trung bình') return { text: '#2F6C9E', bg: '#ECF4FF', border: '#D7E8FF' }
  return { text: '#C54949', bg: '#FDEEEF', border: '#F8DADD' }
}

function mauTrangThai(trangThai: TrangThai) {
  if (trangThai === 'Ổn định') return { text: '#4F9B2E', bg: '#F1F9E9', border: '#DDF0CB' }
  if (trangThai === 'Cần rà soát') return { text: '#A87400', bg: '#FFF8E8', border: '#FBE9BC' }
  return { text: '#C2352A', bg: '#FFF0EF', border: '#F8D3D0' }
}

function hienThiXuHuong(xuHuong: number) {
  if (xuHuong > 0) {
    return (
      <Space size={6}>
        <ArrowUpOutlined style={{ color: '#2EAF62' }} />
        <Typography.Text style={{ color: '#2EAF62', fontWeight: 600 }}>{`${xuHuong.toFixed(1)}%`}</Typography.Text>
      </Space>
    )
  }

  if (xuHuong < 0) {
    return (
      <Space size={6}>
        <ArrowDownOutlined style={{ color: '#D9534F' }} />
        <Typography.Text style={{ color: '#D9534F', fontWeight: 600 }}>{`${Math.abs(xuHuong).toFixed(1)}%`}</Typography.Text>
      </Space>
    )
  }

  return (
    <Space size={6}>
      <MinusOutlined style={{ color: '#8C8C8C' }} />
      <Typography.Text style={{ color: '#8C8C8C', fontWeight: 600 }}>0.0%</Typography.Text>
    </Space>
  )
}

export default function CourseRankingPage() {
  const screens = Grid.useBreakpoint()
  const isMobile = !screens.md
  const isTablet = Boolean(screens.md && !screens.xxl)
  const shouldUseCardLayout = isMobile || isTablet
  const [sortConfig, setSortConfig] = useState<{
    key: 'soPhanHoi' | 'qiTrungBinh' | 'qiTrongSo' | 'diemTB' | 'xuHuong' | 'doTinCay' | null
    order: 'asc' | 'desc' | null
  }>({ key: null, order: null })

  const [visibleDrawer, setVisibleDrawer] = useState(false)
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null)

  const duLieuSapXep = useMemo(() => {
    if (!sortConfig.key || !sortConfig.order) return duLieuMau

    const direction = sortConfig.order === 'asc' ? 1 : -1
    const data = [...duLieuMau]
    const sortKey = sortConfig.key

    data.sort((a, b) => {
      const aValue = a[sortKey]
      const bValue = b[sortKey]

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return (aValue - bValue) * direction
      }

      return 0
    })

    return data
  }, [sortConfig])

  function BoLocSapXep({
    columnKey,
    confirm,
    clearFilters
  }: {
    columnKey: 'soPhanHoi' | 'qiTrungBinh' | 'qiTrongSo' | 'diemTB' | 'xuHuong' | 'doTinCay'
    confirm?: () => void
    clearFilters?: () => void
  }) {
    const [value, setValue] = useState<'asc' | 'desc' | null>(sortConfig.key === columnKey ? sortConfig.order : null)

    return (
      <div style={{ padding: 12, width: 180 }}>
        <Radio.Group
          value={value}
          onChange={(event) => setValue(event.target.value)}
          style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
        >
          <Radio value="asc">Tăng dần</Radio>
          <Radio value="desc">Giảm dần</Radio>
        </Radio.Group>

        <div
          style={{
            borderTop: '1px solid #EEF2F7',
            marginTop: 12,
            paddingTop: 12,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <Button
            type="text"
            onClick={() => {
              setValue(null)
              setSortConfig({ key: null, order: null })
              clearFilters?.()
              confirm?.()
            }}
          >
            Reset
          </Button>
          <Button
            type="primary"
            onClick={() => {
              setSortConfig({ key: columnKey, order: value })
              confirm?.()
            }}
          >
            OK
          </Button>
        </div>
      </div>
    )
  }

  const columns: ColumnsType<DongMonHoc> = [
    {
      title: 'Hạng',
      dataIndex: 'rank',
      key: 'rank',
      width: 48,
      align: 'center',
      render: (value: number) => <Typography.Text style={{ color: MAU_CHINH, fontWeight: 700 }}>{value}</Typography.Text>
    },
    {
      title: 'Tên môn học',
      dataIndex: 'tenMonHoc',
      key: 'tenMonHoc',
      width: 170,
      render: (value: string) => <Typography.Text strong>{value}</Typography.Text>
    },
    {
      title: 'Số phản hồi',
      dataIndex: 'soPhanHoi',
      key: 'soPhanHoi',
      width: 84,
      align: 'center',
      filterDropdown: ({ confirm, clearFilters }) => (
        <BoLocSapXep columnKey="soPhanHoi" confirm={confirm} clearFilters={clearFilters} />
      ),
      filterIcon: () => (sortConfig.key === 'soPhanHoi' ? <FilterFilled style={{ color: MAU_CHINH }} /> : <FilterOutlined />)
    },
    {
      title: 'QI trung bình',
      dataIndex: 'qiTrungBinh',
      key: 'qiTrungBinh',
      width: 84,
      align: 'center',
      filterDropdown: ({ confirm, clearFilters }) => (
        <BoLocSapXep columnKey="qiTrungBinh" confirm={confirm} clearFilters={clearFilters} />
      ),
      filterIcon: () => (sortConfig.key === 'qiTrungBinh' ? <FilterFilled style={{ color: MAU_CHINH }} /> : <FilterOutlined />),
      render: (value: number) => value.toFixed(1)
    },
    {
      title: 'QI có trọng số',
      dataIndex: 'qiTrongSo',
      key: 'qiTrongSo',
      width: 90,
      align: 'center',
      filterDropdown: ({ confirm, clearFilters }) => (
        <BoLocSapXep columnKey="qiTrongSo" confirm={confirm} clearFilters={clearFilters} />
      ),
      filterIcon: () => (sortConfig.key === 'qiTrongSo' ? <FilterFilled style={{ color: MAU_CHINH }} /> : <FilterOutlined />),
      render: (value: number) => value.toFixed(1)
    },
    {
      title: 'Điểm TB',
      dataIndex: 'diemTB',
      key: 'diemTB',
      width: 70,
      align: 'center',
      filterDropdown: ({ confirm, clearFilters }) => (
        <BoLocSapXep columnKey="diemTB" confirm={confirm} clearFilters={clearFilters} />
      ),
      filterIcon: () => (sortConfig.key === 'diemTB' ? <FilterFilled style={{ color: MAU_CHINH }} /> : <FilterOutlined />),
      render: (value: number) => value.toFixed(1)
    },
    {
      title: 'Độ khó',
      dataIndex: 'doKho',
      key: 'doKho',
      width: 80,
      align: 'center',
      render: (value: DoKho) => {
        const style = mauDoKho(value)
        return (
          <Tag
            style={{
              margin: 0,
              borderRadius: 999,
              borderColor: style.border,
              background: style.bg,
              color: style.text,
              fontSize: 11,
              paddingInline: 8
            }}
          >
            {value}
          </Tag>
        )
      }
    },
    {
      title: 'Xu hướng',
      dataIndex: 'xuHuong',
      key: 'xuHuong',
      width: 88,
      align: 'center',
      filterDropdown: ({ confirm, clearFilters }) => (
        <BoLocSapXep columnKey="xuHuong" confirm={confirm} clearFilters={clearFilters} />
      ),
      filterIcon: () => (sortConfig.key === 'xuHuong' ? <FilterFilled style={{ color: MAU_CHINH }} /> : <FilterOutlined />),
      render: (value: number) => hienThiXuHuong(value)
    },
    {
      title: 'Độ tin cậy',
      dataIndex: 'doTinCay',
      key: 'doTinCay',
      width: 108,
      align: 'center',
      filterDropdown: ({ confirm, clearFilters }) => (
        <BoLocSapXep columnKey="doTinCay" confirm={confirm} clearFilters={clearFilters} />
      ),
      filterIcon: () => (sortConfig.key === 'doTinCay' ? <FilterFilled style={{ color: MAU_CHINH }} /> : <FilterOutlined />),
      render: (value: number) => <Typography.Text style={{ color: '#1F3E67', fontWeight: 600 }}>{`${value}%`}</Typography.Text>
    },
    {
      title: 'Trạng thái',
      dataIndex: 'trangThai',
      key: 'trangThai',
      width: 95,
      align: 'center',
      render: (value: TrangThai) => {
        const style = mauTrangThai(value)
        return (
          <Tag
            style={{
              margin: 0,
              borderRadius: 999,
              borderColor: style.border,
              background: style.bg,
              color: style.text,
              fontSize: 11,
              paddingInline: 8
            }}
          >
            {value}
          </Tag>
        )
      }
    },
    {
      title: 'Gợi ý',
      dataIndex: 'goiY',
      key: 'goiY',
      width: 112,
      render: (value: string) => <Typography.Text>{value}</Typography.Text>
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 86,
      align: 'center',
      render: (_value, record) => (
        <Button 
          type="link" 
          style={{ padding: 0, fontWeight: 600 }} 
          onClick={() => {
            setSelectedCourseId(record.id)
            setVisibleDrawer(true)
          }}
        >
          Xem chi tiết
        </Button>
      )
    }
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div
        style={{
          background: '#FFFFFF',
          border: '1px solid #E8EEF8',
          borderRadius: 16,
          padding: 24,
          boxShadow: '0 8px 20px rgba(28,61,102,0.04)'
        }}
      >
        <PageHeader
          title="Bảng xếp hạng môn học"
          description="Bảng xếp hạng môn học theo chỉ số QI và mức độ tin cậy"
          contentGap={8}
        />
      </div>

      <Card style={{ borderRadius: 16, border: '1px solid #E1ECFA' }}>
        {shouldUseCardLayout ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: isTablet ? 'repeat(2, minmax(0, 1fr))' : '1fr',
              gap: 16
            }}
          >
            {duLieuSapXep.map((item) => {
              const difficultyStyle = mauDoKho(item.doKho)
              const statusStyle = mauTrangThai(item.trangThai)

              return (
                <Card
                  key={item.id}
                  size="small"
                  style={{
                    borderRadius: 18,
                    border: '1px solid #D7E1F0',
                    boxShadow: '0 8px 18px rgba(0, 45, 109, 0.06)'
                  }}
                  bodyStyle={{ padding: 16 }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start' }}>
                      <div style={{ minWidth: 0 }}>
                        <Typography.Text style={{ display: 'block', color: '#6B7A90', fontSize: 13 }}>
                          Hạng #{item.rank}
                        </Typography.Text>
                        <Typography.Text strong style={{ color: '#163253', fontSize: 20, lineHeight: 1.4 }}>
                          {item.tenMonHoc}
                        </Typography.Text>
                      </div>

                      <Button
                        type="link"
                        style={{ padding: 0, fontWeight: 600, flexShrink: 0 }}
                        onClick={() => {
                          setSelectedCourseId(item.id)
                          setVisibleDrawer(true)
                        }}
                      >
                        Xem chi tiết
                      </Button>
                    </div>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                      <Tag
                        style={{
                          margin: 0,
                          borderRadius: 999,
                          borderColor: difficultyStyle.border,
                          background: difficultyStyle.bg,
                          color: difficultyStyle.text,
                          paddingInline: 10
                        }}
                      >
                        {item.doKho}
                      </Tag>
                      <Tag
                        style={{
                          margin: 0,
                          borderRadius: 999,
                          borderColor: statusStyle.border,
                          background: statusStyle.bg,
                          color: statusStyle.text,
                          paddingInline: 10
                        }}
                      >
                        {item.trangThai}
                      </Tag>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 12 }}>
                      <div>
                        <Typography.Text style={{ display: 'block', color: '#6B7A90', fontSize: 13 }}>Số phản hồi</Typography.Text>
                        <Typography.Text style={{ color: '#163253', fontSize: 15 }}>{item.soPhanHoi}</Typography.Text>
                      </div>
                      <div>
                        <Typography.Text style={{ display: 'block', color: '#6B7A90', fontSize: 13 }}>QI trung bình</Typography.Text>
                        <Typography.Text style={{ color: '#163253', fontSize: 15 }}>{item.qiTrungBinh.toFixed(1)}</Typography.Text>
                      </div>
                      <div>
                        <Typography.Text style={{ display: 'block', color: '#6B7A90', fontSize: 13 }}>QI có trọng số</Typography.Text>
                        <Typography.Text style={{ color: '#163253', fontSize: 15 }}>{item.qiTrongSo.toFixed(1)}</Typography.Text>
                      </div>
                      <div>
                        <Typography.Text style={{ display: 'block', color: '#6B7A90', fontSize: 13 }}>Điểm TB</Typography.Text>
                        <Typography.Text style={{ color: '#163253', fontSize: 15 }}>{item.diemTB.toFixed(1)}</Typography.Text>
                      </div>
                      <div>
                        <Typography.Text style={{ display: 'block', color: '#6B7A90', fontSize: 13 }}>Xu hướng</Typography.Text>
                        {hienThiXuHuong(item.xuHuong)}
                      </div>
                      <div>
                        <Typography.Text style={{ display: 'block', color: '#6B7A90', fontSize: 13 }}>Độ tin cậy</Typography.Text>
                        <Typography.Text style={{ color: '#163253', fontSize: 15 }}>{item.doTinCay}%</Typography.Text>
                      </div>
                    </div>

                    <div>
                      <Typography.Text style={{ display: 'block', color: '#6B7A90', fontSize: 13 }}>Gợi ý</Typography.Text>
                      <Typography.Text style={{ color: '#42546B', lineHeight: 1.6 }}>{item.goiY}</Typography.Text>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        ) : (
          <Table
            rowKey="id"
            columns={columns}
            dataSource={duLieuSapXep}
            pagination={{ pageSize: 8, showSizeChanger: false, position: ['bottomRight'] }}
            scroll={{ x: 1180 }}
          />
        )}
      </Card>

      <CourseDetailDrawer
        visible={visibleDrawer}
        courseId={selectedCourseId}
        onClose={() => setVisibleDrawer(false)}
      />
    </div>
  )
}

function CourseDetailDrawer({ 
  visible, 
  courseId, 
  onClose 
}: { 
  visible: boolean
  courseId: string | null
  onClose: () => void
}) {
  const screens = Grid.useBreakpoint()
  const isMobile = !screens.md
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['course-detail', courseId],
    queryFn: () => getCourseDetail(courseId || ''),
    enabled: Boolean(courseId && visible)
  })
  const [factorChartType, setFactorChartType] = useState<'bar' | 'radar'>('bar')

  const tongDanhGia = useMemo(() => {
    return data?.phanPhoiDanhGia.reduce((tong, item) => tong + item.soLuong, 0) ?? 0
  }, [data?.phanPhoiDanhGia])

  const phanPhoiTheoTyLe = useMemo(() => {
    if (!data?.phanPhoiDanhGia?.length || tongDanhGia === 0) return []
    return data.phanPhoiDanhGia.map((item) => ({
      ...item,
      tyLe: Number(((item.soLuong / tongDanhGia) * 100).toFixed(1))
    }))
  }, [data?.phanPhoiDanhGia, tongDanhGia])

  if (isError) {
    return (
      <Modal title="Chi tiết môn học" onCancel={onClose} open={visible} footer={null}>
        <ErrorState
          title="Không thể tải dữ liệu chi tiết môn học"
          description="Vui lòng thử lại sau ít phút."
          onRetry={() => refetch()}
        />
      </Modal>
    )
  }

  if (!data && !isLoading) {
    return (
      <Modal title="Chi tiết môn học" onCancel={onClose} open={visible} footer={null}>
        <EmptyState title="Không tìm thấy môn học" description="Vui lòng kiểm tra lại mã môn học hoặc chọn môn khác." />
      </Modal>
    )
  }

  const getTrangThaiTag = (qiTrung: number) => {
    if (qiTrung >= 4.0) return { text: 'Ổn định', color: '#3B8C2A', bg: '#F1F9E9', border: '#DDF0CB' }
    if (qiTrung >= 3.0) return { text: 'Cần rà soát', color: '#A87400', bg: '#FFF8E8', border: '#FBE9BC' }
    return { text: 'Nguy cơ', color: '#C2352A', bg: '#FFF0EF', border: '#F8D3D0' }
  }

  const getSeverityStyle = (severity: 'Thấp' | 'Trung bình' | 'Cao') => {
    if (severity === 'Cao') return { color: '#C54949', bg: '#FDEEEF', border: '#F8DADD' }
    if (severity === 'Trung bình') return { color: '#A87400', bg: '#FFF8E8', border: '#FBE9BC' }
    return { color: '#3B8C2A', bg: '#F1F9E9', border: '#DDF0CB' }
  }

  const getActionStatus = (priority: number, severity: 'Thấp' | 'Trung bình' | 'Cao') => {
    if (severity === 'Cao' || priority >= 4) return getTrangThaiTag(2.7)
    if (severity === 'Trung bình' || priority >= 3) return getTrangThaiTag(3.3)
    return getTrangThaiTag(4.2)
  }

  const recommendationColumns: ColumnsType<KhuyenNghi> = [
    {
      title: 'Hành động can thiệp',
      dataIndex: 'chiTiet',
      key: 'chiTiet',
      render: (value: string) => (
        <Typography.Text style={{ color: '#1F2937', fontWeight: 500, fontSize: 13, whiteSpace: 'normal', wordBreak: 'break-word' }}>
          {value}
        </Typography.Text>
      )
    },
    {
      title: 'Mức độ nghiêm trọng',
      dataIndex: 'mucDoNghiemTrong',
      key: 'mucDoNghiemTrong',
      width: 130,
      render: (value: 'Thấp' | 'Trung bình' | 'Cao') => {
        const style = getSeverityStyle(value)
        return (
          <Tag style={{ margin: 0, color: style.color, background: style.bg, borderColor: style.border, fontWeight: 600 }}>
            {value}
          </Tag>
        )
      }
    },
    {
      title: 'Điểm ưu tiên',
      dataIndex: 'diemUuTien',
      key: 'diemUuTien',
      width: 130,
      render: (value: number) => (
        <Space direction="vertical" size={2} style={{ width: '100%' }}>
          <Typography.Text style={{ color: MAU_CHINH, fontWeight: 700 }}>{value}/5</Typography.Text>
          <Progress percent={Math.min(value * 20, 100)} showInfo={false} strokeColor={MAU_CHINH} trailColor="#E8EEF8" size="small" />
        </Space>
      )
    },
    {
      title: 'Trạng thái',
      key: 'trangThai',
      width: 120,
      render: (_, record) => {
        const status = getActionStatus(record.diemUuTien, record.mucDoNghiemTrong)
        return (
          <Tag style={{ margin: 0, color: status.color, background: status.bg, borderColor: status.border, fontWeight: 600 }}>
            {status.text}
          </Tag>
        )
      }
    }
  ]

  return (
    <Modal 
      title="Chi tiết môn học" 
      onCancel={onClose} 
      open={visible} 
      footer={null}
      width={isMobile ? '96vw' : '92vw'}
      style={{ maxWidth: 1340 }}
      centered
      bodyStyle={{ maxHeight: '78vh', overflowY: 'auto', overflowX: 'hidden', padding: isMobile ? 16 : 22 }}
    >
      {isLoading ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 320 }}>
          <Spin size="large" tip="Đang tải chi tiết môn học..." />
        </div>
      ) : data ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <Card
            style={{
              borderRadius: 16,
              border: '1px solid #D7E6FA',
              background: 'linear-gradient(120deg, #F7FBFF 0%, #EEF5FF 100%)',
              boxShadow: '0 8px 22px rgba(0, 91, 172, 0.06)'
            }}
          >
            <Row gutter={[20, 16]} align="middle">
              <Col xs={24} md={24} lg={10}>
                <Typography.Text style={{ color: '#607D9A', fontSize: 12, letterSpacing: 0.5, textTransform: 'uppercase' }}>
                  Phân tích chi tiết môn học
                </Typography.Text>
                <Typography.Title level={3} style={{ margin: '6px 0 4px', color: MAU_CHINH }}>
                  {data.tenMonHoc}
                </Typography.Title>
                <Space size={10} wrap>
                  <Typography.Text style={{ fontSize: 13, color: '#4A5F79' }}>
                    Mã: {data.maMonHoc}
                  </Typography.Text>
                  <Typography.Text style={{ fontSize: 13, color: '#4A5F79' }}>
                    {data.soPhanHoi} phản hồi
                  </Typography.Text>
                  <Tag
                    style={{
                      margin: 0,
                      color: getTrangThaiTag(data.diemQiTong).color,
                      background: getTrangThaiTag(data.diemQiTong).bg,
                      borderColor: getTrangThaiTag(data.diemQiTong).border,
                      fontWeight: 600
                    }}
                  >
                    {getTrangThaiTag(data.diemQiTong).text}
                  </Tag>
                </Space>
              </Col>
              <Col xs={24} sm={8} lg={4}>
                <Statistic 
                  title="QI trung bình môn" 
                  value={data.diemQiTong} 
                  precision={1} 
                  suffix="/ 5"
                  valueStyle={{ color: MAU_CHINH, fontSize: 24, fontWeight: 700 }}
                />
              </Col>
              <Col xs={24} sm={8} lg={5}>
                <Statistic 
                  title="Độ tin cậy" 
                  value={data.doTinCay}
                  suffix="%"
                  valueStyle={{ 
                    color: data.doTinCay >= 80 ? '#2EAF62' : data.doTinCay >= 60 ? '#FAAD14' : '#D4380D',
                    fontSize: 24,
                    fontWeight: 'bold'
                  }}
                />
              </Col>
              <Col xs={24} sm={8} lg={5}>
                <Statistic 
                  title="Độ khó cảm nhận" 
                  value={data.doKhoDiem}
                  suffix="/ 10"
                  valueStyle={{ color: MAU_CHINH, fontSize: 24, fontWeight: 700 }}
                />
              </Col>
            </Row>
          </Card>

          <Card
            title="Phân rã 6 yếu tố chất lượng"
            style={{ borderRadius: 16, border: '1px solid #E1ECFA' }}
            extra={
              <Radio.Group
                size="small"
                value={factorChartType}
                onChange={(event) => setFactorChartType(event.target.value)}
                buttonStyle="solid"
              >
                <Radio.Button value="bar">Biểu đồ cột</Radio.Button>
                <Radio.Button value="radar">Biểu đồ mạng nhện</Radio.Button>
              </Radio.Group>
            }
          >
            <div style={{ width: '100%', height: isMobile ? 260 : 320 }}>
              <ResponsiveContainer>
                {factorChartType === 'bar' ? (
                  <BarChart data={data.phanRaChatLuong}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#EEF3FB" />
                    <XAxis dataKey="ten" tick={{ fill: '#42546B', fontSize: 12 }} />
                    <YAxis domain={[0, 5]} tick={{ fill: '#42546B', fontSize: 12 }} />
                    <Tooltip formatter={(value) => [`${Number(value ?? 0).toFixed(1)} điểm`, 'Điểm']} />
                    <Bar dataKey="diem" radius={[8, 8, 0, 0]}>
                      {data.phanRaChatLuong.map((entry) => (
                        <Cell
                          key={entry.ten}
                          fill={entry.diem >= 4 ? '#0E5EA8' : entry.diem >= 3 ? '#2E7CC3' : '#7CAEE0'}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                ) : (
                  <RadarChart data={data.phanRaChatLuong} outerRadius="72%">
                    <PolarGrid stroke="#E0ECFA" />
                    <PolarAngleAxis dataKey="ten" tick={{ fill: '#42546B', fontSize: 12 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 5]} tick={{ fill: '#8FA5BE', fontSize: 11 }} />
                    <Radar dataKey="diem" stroke={MAU_CHINH} fill={MAU_CHINH} fillOpacity={0.35} />
                    <Tooltip formatter={(value) => [`${Number(value ?? 0).toFixed(1)} điểm`, 'Điểm']} />
                  </RadarChart>
                )}
              </ResponsiveContainer>
            </div>
          </Card>

          <Row gutter={[16, 16]}>
            <Col xs={24} md={24} lg={12}>
              <Card title="Xu hướng QI qua 4 học kỳ gần nhất" style={{ borderRadius: 16, border: '1px solid #E1ECFA' }}>
                <TrendLineChart data={data.xuHuongHocKy} />
              </Card>
            </Col>
            <Col xs={24} md={24} lg={12}>
              <Card title="Phân phối đánh giá (1-5 sao)" style={{ borderRadius: 16, border: '1px solid #E1ECFA' }}>
                <div style={{ width: '100%', height: 300 }}>
                  <ResponsiveContainer>
                    <BarChart data={phanPhoiTheoTyLe}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#EEF3FB" />
                      <XAxis dataKey="sao" tick={{ fill: '#42546B', fontSize: 12 }} />
                      <YAxis unit="%" tick={{ fill: '#42546B', fontSize: 12 }} />
                      <Tooltip
                        formatter={(value, _, payload) => [
                          `${Number(value ?? 0).toFixed(1)}% (${payload?.payload?.soLuong ?? 0} sinh viên)`,
                          'Tỷ lệ'
                        ]}
                      />
                      <Bar dataKey="tyLe" fill="#1469B1" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <Typography.Text style={{ color: '#7A8FA8', fontSize: 12 }}>
                  Tổng mẫu phản hồi: {tongDanhGia} sinh viên
                </Typography.Text>
              </Card>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col xs={24} md={24} lg={10}>
              <Card title="Dữ liệu định tính: Nội dung phản hồi thực tế" style={{ borderRadius: 16, border: '1px solid #E1ECFA' }}>
                <List
                  dataSource={data.phanHoiSinhVien}
                  locale={{ emptyText: 'Chưa có phản hồi' }}
                  style={{ maxHeight: 324, overflowY: 'auto', paddingRight: 8 }}
                  renderItem={(item) => (
                    <List.Item style={{ paddingBlock: 10, borderBottom: '1px solid #EEF3FB' }}>
                      <Typography.Text style={{ color: '#42546B', fontSize: 13, lineHeight: 1.65 }}>
                        {item.noiDung}
                      </Typography.Text>
                    </List.Item>
                  )}
                />
              </Card>
            </Col>

            <Col xs={24} md={24} lg={14}>
              <Card title="Bảng Khuyến nghị & Can thiệp" style={{ borderRadius: 16, border: '1px solid #E1ECFA' }}>
                <Table
                  rowKey="id"
                  dataSource={data.khuyenNghi}
                  columns={recommendationColumns}
                  size="small"
                  tableLayout="fixed"
                  pagination={false}
                  scroll={{ x: 640 }}
                  locale={{ emptyText: 'Không có khuyến nghị' }}
                />
              </Card>
            </Col>
          </Row>
        </div>
      ) : null}
    </Modal>
    )
  }
