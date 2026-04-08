import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { ArrowDownOutlined, ArrowUpOutlined, FilterFilled, FilterOutlined, MinusOutlined } from '@ant-design/icons'
import { Button, Card, Col, Modal, List, Radio, Row, Space, Spin, Statistic, Table, Tag, Typography } from 'antd'
import type { ColumnsType } from 'antd/es/table'

import PageHeader from '../../../components/layout/PageHeader'
import EmptyState from '../../../components/utility/EmptyState'
import ErrorState from '../../../components/utility/ErrorState'
import { getInstructorDetail } from '../api/drilldown.api'
import HorizontalImpactChart from '../components/drilldown/HorizontalImpactChart'
import TrendLineChart from '../components/drilldown/TrendLineChart'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

const MAU_CHINH = '#005BAC'

type TrangThai = 'Ổn định' | 'Cần rà soát' | 'Nguy cơ'

interface DongGiangVien {
  rank: number
  id: string
  name: string
  responses: number
  qiMean: number
  qiWeighted: number
  coursesTeaching: number
  trend: number
  confidenceScore: number
  status: TrangThai
}

const duLieuMau: DongGiangVien[] = [
  {
    rank: 1,
    id: 'gv001',
    name: 'Nguyễn Minh Anh',
    responses: 186,
    qiMean: 4.6,
    qiWeighted: 4.7,
    coursesTeaching: 3,
    trend: 8.2,
    confidenceScore: 95,
    status: 'Ổn định'
  },
  {
    rank: 2,
    id: 'gv002',
    name: 'Trần Thu Hà',
    responses: 154,
    qiMean: 4.2,
    qiWeighted: 4.1,
    coursesTeaching: 2,
    trend: 3.6,
    confidenceScore: 89,
    status: 'Ổn định'
  },
  {
    rank: 3,
    id: 'gv005',
    name: 'Võ Đức Thành',
    responses: 97,
    qiMean: 4.0,
    qiWeighted: 4.2,
    coursesTeaching: 3,
    trend: 5.4,
    confidenceScore: 87,
    status: 'Ổn định'
  },
  {
    rank: 4,
    id: 'gv003',
    name: 'Lê Hoàng Nam',
    responses: 131,
    qiMean: 3.8,
    qiWeighted: 3.9,
    coursesTeaching: 4,
    trend: -2.4,
    confidenceScore: 81,
    status: 'Cần rà soát'
  },
  {
    rank: 5,
    id: 'gv004',
    name: 'Phạm Lan Anh',
    responses: 108,
    qiMean: 3.4,
    qiWeighted: 3.5,
    coursesTeaching: 2,
    trend: -7.1,
    confidenceScore: 76,
    status: 'Nguy cơ'
  }
]

function layCauHinhTrangThai(trangThai: TrangThai) {
  if (trangThai === 'Ổn định') return { color: 'blue', text: '#2B7AC4' }
  if (trangThai === 'Cần rà soát') return { color: 'gold', text: '#A87400' }
  return { color: 'red', text: '#C2352A' }
}

function layXuHuong(trend: number) {
  if (trend > 0) {
    return {
      icon: <ArrowUpOutlined style={{ color: '#2EAF62' }} />,
      label: `Tăng ${trend.toFixed(1)}%`,
      color: '#2EAF62'
    }
  }

  if (trend < 0) {
    return {
      icon: <ArrowDownOutlined style={{ color: '#D4380D' }} />,
      label: `Giảm ${Math.abs(trend).toFixed(1)}%`,
      color: '#D4380D'
    }
  }

  return {
    icon: <MinusOutlined style={{ color: '#8C8C8C' }} />,
    label: 'Ổn định',
    color: '#8C8C8C'
  }
}

export default function InstructorRankingPage() {
  const [sortConfig, setSortConfig] = useState<{
    key: 'responses' | 'qiMean' | 'qiWeighted' | 'coursesTeaching' | 'trend' | 'confidenceScore' | null
    order: 'asc' | 'desc' | null
  }>({ key: null, order: null })

  const [visibleDrawer, setVisibleDrawer] = useState(false)
  const [selectedInstructorId, setSelectedInstructorId] = useState<string | null>(null)

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
    columnKey: 'responses' | 'qiMean' | 'qiWeighted' | 'coursesTeaching' | 'trend' | 'confidenceScore'
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

  const cot: ColumnsType<DongGiangVien> = [
    {
      title: 'Thứ hạng',
      dataIndex: 'rank',
      key: 'rank',
      width: 50,
      align: 'center',
      render: (value: number) => <Typography.Text style={{ color: MAU_CHINH, fontWeight: 700 }}>{value}</Typography.Text>
    },
    {
      title: 'Tên giảng viên',
      dataIndex: 'name',
      key: 'name',
      width: 150,
      align: 'center',
      render: (value: string) => <Typography.Text strong>{value}</Typography.Text>
    },
    {
      title: 'Số phản hồi',
      dataIndex: 'responses',
      key: 'responses',
      width: 82,
      align: 'center',
      filterDropdown: ({ confirm, clearFilters }) => (
        <BoLocSapXep columnKey="responses" confirm={confirm} clearFilters={clearFilters} />
      ),
      filterIcon: () => (sortConfig.key === 'responses' ? <FilterFilled style={{ color: MAU_CHINH }} /> : <FilterOutlined />)
    },
    {
      title: 'QI trung bình',
      dataIndex: 'qiMean',
      key: 'qiMean',
      width: 86,
      align: 'center',
      filterDropdown: ({ confirm, clearFilters }) => (
        <BoLocSapXep columnKey="qiMean" confirm={confirm} clearFilters={clearFilters} />
      ),
      filterIcon: () => (sortConfig.key === 'qiMean' ? <FilterFilled style={{ color: MAU_CHINH }} /> : <FilterOutlined />),
      render: (value: number) => value.toFixed(1)
    },
    {
      title: 'QI có trọng số',
      dataIndex: 'qiWeighted',
      key: 'qiWeighted',
      width: 94,
      align: 'center',
      filterDropdown: ({ confirm, clearFilters }) => (
        <BoLocSapXep columnKey="qiWeighted" confirm={confirm} clearFilters={clearFilters} />
      ),
      filterIcon: () => (sortConfig.key === 'qiWeighted' ? <FilterFilled style={{ color: MAU_CHINH }} /> : <FilterOutlined />),
      render: (value: number) => value.toFixed(1)
    },
    {
      title: 'Môn đang dạy',
      dataIndex: 'coursesTeaching',
      key: 'coursesTeaching',
      width: 90,
      align: 'center',
      filterDropdown: ({ confirm, clearFilters }) => (
        <BoLocSapXep columnKey="coursesTeaching" confirm={confirm} clearFilters={clearFilters} />
      ),
      filterIcon: () => (sortConfig.key === 'coursesTeaching' ? <FilterFilled style={{ color: MAU_CHINH }} /> : <FilterOutlined />),
      render: (value: number) => `${value} môn`
    },
    {
      title: 'Xu hướng',
      dataIndex: 'trend',
      key: 'trend',
      width: 95,
      align: 'center',
      filterDropdown: ({ confirm, clearFilters }) => (
        <BoLocSapXep columnKey="trend" confirm={confirm} clearFilters={clearFilters} />
      ),
      filterIcon: () => (sortConfig.key === 'trend' ? <FilterFilled style={{ color: MAU_CHINH }} /> : <FilterOutlined />),
      render: (value: number) => {
        const trend = layXuHuong(value)
        return (
          <Space size={6}>
            {trend.icon}
            <Typography.Text style={{ color: trend.color, fontWeight: 600 }}>{trend.label}</Typography.Text>
          </Space>
        )
      }
    },
    {
      title: 'Điểm tin cậy',
      dataIndex: 'confidenceScore',
      key: 'confidenceScore',
      width: 95,
      align: 'center',
      filterDropdown: ({ confirm, clearFilters }) => (
        <BoLocSapXep columnKey="confidenceScore" confirm={confirm} clearFilters={clearFilters} />
      ),
      filterIcon: () => (sortConfig.key === 'confidenceScore' ? <FilterFilled style={{ color: MAU_CHINH }} /> : <FilterOutlined />),
      render: (value: number) => `${value}%`
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 90,
      align: 'center',
      render: (value: TrangThai) => {
        const trangThai = layCauHinhTrangThai(value)
        return (
          <Tag color={trangThai.color} style={{ borderRadius: 999, paddingInline: 10, margin: 0 }}>
            {value}
          </Tag>
        )
      }
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 88,
      align: 'center',
      render: (_value, record) => (
        <Button 
          type="link" 
          style={{ padding: 0, fontWeight: 600, fontSize: 13 }} 
          onClick={() => {
            setSelectedInstructorId(record.id)
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
          title="Phân tích chất lượng giảng dạy theo giảng viên"
          description="Theo dõi chất lượng giảng dạy theo giảng viên, không tạo cảm giác xếp hạng áp lực"
          contentGap={8}
        />
      </div>

      <Card
        style={{
          borderRadius: 16,
          border: '1px solid #D8E5F7',
          boxShadow: '0 8px 24px rgba(0, 55, 125, 0.06)'
        }}
        styles={{ body: { padding: 0 } }}
      >
        <Table<DongGiangVien>
          rowKey="id"
          dataSource={duLieuSapXep}
          columns={cot}
          size="small"
          className="instructor-ranking-table"
          pagination={{ pageSize: 5, showSizeChanger: false, position: ['bottomRight'] }}
        />
      </Card>

      <InstructorDetailDrawer 
        visible={visibleDrawer} 
        instructorId={selectedInstructorId} 
        onClose={() => setVisibleDrawer(false)} 
      />
    </div>
  )
}

function InstructorDetailDrawer({ 
  visible, 
  instructorId, 
  onClose 
}: { 
  visible: boolean
  instructorId: string | null
  onClose: () => void
}) {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['instructor-detail', instructorId],
    queryFn: () => getInstructorDetail(instructorId || ''),
    enabled: Boolean(instructorId && visible)
  })

  if (isError) {
    return (
      <Modal title="Chi tiết giảng viên" onCancel={onClose} open={visible} footer={null}>
        <ErrorState
          title="Không thể tải dữ liệu chi tiết giảng viên"
          description="Vui lòng thử lại sau ít phút."
          onRetry={() => refetch()}
        />
      </Modal>
    )
  }

  if (!data && !isLoading) {
    return (
      <Modal title="Chi tiết giảng viên" onCancel={onClose} open={visible} footer={null}>
        <EmptyState title="Không tìm thấy giảng viên" description="Vui lòng kiểm tra lại mã giảng viên hoặc chọn giảng viên khác." />
      </Modal>
    )
  }

  return (
    <Modal 
      title="Chi tiết giảng viên" 
      onCancel={onClose} 
      open={visible} 
      footer={null}
      width="90vw"
      style={{ maxWidth: 1400 }}
      centered
      bodyStyle={{ maxHeight: '80vh', overflowY: 'auto', overflowX: 'hidden', padding: 24 }}
    >
      {isLoading ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 320 }}>
          <Spin size="large" tip="Đang tải chi tiết giảng viên..." />
        </div>
      ) : data ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* HEADER SECTION */}
          <Card style={{ borderRadius: 16, background: '#F8FAFB' }}>
            <Row gutter={[24, 16]} align="middle">
              <Col xs={24} md={12}>
                <Typography.Title level={3} style={{ marginBottom: 6, color: '#005BAC' }}>
                  Tên giảng viên
                </Typography.Title>
                <Typography.Text style={{ fontSize: 18, fontWeight: 600, color: '#1F2937' }}>
                  {data.tenGiangVien}
                </Typography.Text>
              </Col>
              <Col xs={24} md={4}>
                <Statistic 
                  title="Tổng QI" 
                  value={data.diemQiTong} 
                  precision={1} 
                  suffix="/ 5"
                  valueStyle={{ color: '#005BAC', fontSize: 24 }}
                />
              </Col>
              <Col xs={24} md={4}>
                <Statistic 
                  title="Số môn" 
                  value={data.soMon}
                  valueStyle={{ color: '#005BAC', fontSize: 24 }}
                />
              </Col>
              <Col xs={24} md={4}>
                <Statistic 
                  title="Độ tin cậy" 
                  value={data.doTinCay}
                  suffix="%"
                  valueStyle={{ 
                    color: data.doTinCay >= 80 ? '#2EAF62' : data.doTinCay >= 50 ? '#FAAD14' : '#D4380D',
                    fontSize: 24,
                    fontWeight: 'bold'
                  }}
                />
              </Col>
            </Row>
          </Card>

          {/* TOP CHARTS: QI by Course & Trend */}
          <Row gutter={[16, 16]}>
            <Col xs={24} lg={12}>
              <Card title="QI theo môn học" style={{ borderRadius: 16 }}>
                <div style={{ width: '100%', height: 300 }}>
                  <ResponsiveContainer>
                    <BarChart data={data.qiTheoMonHoc}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#EEF3FB" />
                      <XAxis dataKey="tenMonHoc" tick={{ fill: '#42546B', fontSize: 12 }} />
                      <YAxis domain={[0, 5]} tick={{ fill: '#42546B', fontSize: 12 }} />
                      <Tooltip formatter={(value) => [`${Number(value ?? 0).toFixed(1)} điểm`, 'QI']} />
                      <Bar dataKey="qi" fill="#2B7AC4" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </Col>

            <Col xs={24} lg={12}>
              <Card title="Xu hướng nhiều học kỳ" style={{ borderRadius: 16 }}>
                <TrendLineChart data={data.xuHuongHocKy} />
              </Card>
            </Col>
          </Row>

          {/* RATING DISTRIBUTION */}
          <Card title="Phân phối đánh giá 1–5 sao" style={{ borderRadius: 16 }}>
            <div style={{ width: '100%', height: 280 }}>
              <ResponsiveContainer>
                <BarChart data={data.phanPhoiDanhGia}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#EEF3FB" />
                  <XAxis dataKey="sao" tick={{ fill: '#42546B', fontSize: 12 }} />
                  <YAxis tick={{ fill: '#42546B', fontSize: 12 }} />
                  <Tooltip formatter={(value) => [value, 'Số sinh viên']} />
                  <Bar dataKey="soLuong" fill="#1469B1" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* TWO COLUMN LAYOUT: LEFT & RIGHT */}
          <Row gutter={[16, 16]}>
            {/* LEFT COLUMN: Factor Impact */}
            <Col xs={24} lg={14}>
              <Card title="Mức độ ảnh hưởng yếu tố" style={{ borderRadius: 16 }}>
                <HorizontalImpactChart data={data.mucDoAnhHuongYeuTo} />
              </Card>
            </Col>

            {/* RIGHT COLUMN: Suggestions */}
            <Col xs={24} lg={10}>
              <Card title="Gợi ý cải thiện" style={{ borderRadius: 16 }}>
                <List
                  dataSource={data.goiYCaiThien}
                  locale={{ emptyText: 'Chưa có gợi ý' }}
                  renderItem={(item, index) => (
                    <List.Item>
                      <Typography.Text>{`${index + 1}. ${item}`}</Typography.Text>
                    </List.Item>
                  )}
                />
              </Card>
            </Col>
          </Row>

          {/* STUDENT FEEDBACK SECTION */}
          <Card title="Ý kiến phản hồi từ sinh viên" style={{ borderRadius: 16 }}>
            <List
              dataSource={data.phanHoiSinhVien}
              locale={{ emptyText: 'Chưa có phản hồi' }}
              style={{ maxHeight: 300, overflowY: 'auto' }}
              renderItem={(item) => (
                <List.Item style={{ paddingBlock: 8, borderBottom: '1px solid #F0F0F0' }}>
                  <Typography.Text 
                    style={{ 
                      color: '#42546B',
                      fontSize: 13,
                      lineHeight: 1.6
                    }}
                  >
                    {item.noiDung}
                  </Typography.Text>
                </List.Item>
              )}
            />
          </Card>
        </div>
      ) : null}
    </Modal>
  )
}
